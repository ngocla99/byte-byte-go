// biome-ignore-all lint: reason
import fs from 'node:fs';
import path from 'node:path';
import { authenticate } from '@google-cloud/local-auth';
import * as cheerio from 'cheerio';
import { google } from 'googleapis';
import inquirer from 'inquirer';

// Configuration
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
const TOKEN_PATH = path.join(process.cwd(), 'scripts', 'token.json');
const CREDENTIALS_PATH = path.join(
  process.cwd(),
  'scripts',
  'credentials.json'
);
const BLOGS_DIR = path.join(process.cwd(), 'public', 'blogs');
const SENDER_EMAIL = 'bytebytego@substack.com';

interface EmailData {
  id: string;
  snippet?: string | null;
  date?: string | null;
  subject?: string | null;
  body?: string;
}

interface EmailChoice extends EmailData {
  filename: string;
  year: string;
  exists: boolean;
}

async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.promises.readFile(TOKEN_PATH, 'utf8');
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch {
    return null;
  }
}

async function saveCredentials(client: any) {
  const content = await fs.promises.readFile(CREDENTIALS_PATH, 'utf8');
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.promises.writeFile(TOKEN_PATH, payload);
}

async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

function cleanTitle(title: string): string {
  // Remove "ByteByteGo Newsletter:" or similar prefixes if they exist
  // And remove forbidden characters for filenames
  return title
    .replace(/ByteByteGo Newsletter:?\s*/i, '')
    .replace(/[/\\:*?"<>|]/g, '')
    .trim();
}

function formatDateForFilename(dateStr: string): string {
  const date = new Date(dateStr);
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}${month}${day}`;
}

function getYearFromDate(dateStr: string): string {
  return new Date(dateStr).getFullYear().toString();
}

async function listMessages(auth: any, query: string) {
  const gmail = google.gmail({ version: 'v1', auth });
  const res = await gmail.users.messages.list({
    userId: 'me',
    q: query,
    maxResults: 20, // Fetch top 20 recent emails
  });
  return res.data.messages || [];
}

async function getMessage(auth: any, id: string): Promise<EmailData | null> {
  const gmail = google.gmail({ version: 'v1', auth });
  const res = await gmail.users.messages.get({
    userId: 'me',
    id,
    format: 'full',
  });

  const payload = res.data.payload;
  if (!payload) return null;

  const headers = payload.headers;
  const subject = headers?.find((h) => h.name === 'Subject')?.value;
  const date = headers?.find((h) => h.name === 'Date')?.value;

  let body = '';
  if (payload.body?.data) {
    body = Buffer.from(payload.body.data, 'base64').toString('utf-8');
  } else if (payload.parts) {
    // Try to find HTML part
    const htmlPart = payload.parts.find(
      (part) => part.mimeType === 'text/html'
    );
    if (htmlPart && htmlPart.body?.data) {
      body = Buffer.from(htmlPart.body.data, 'base64').toString('utf-8');
    } else {
      // Fallback to text/plain if HTML not found
      const textPart = payload.parts.find(
        (part) => part.mimeType === 'text/plain'
      );
      if (textPart && textPart.body?.data) {
        body = Buffer.from(textPart.body.data, 'base64').toString('utf-8');
      }
    }
  }

  return {
    id,
    snippet: res.data.snippet,
    date,
    subject,
    body,
  };
}

function extractArticleContent(html: string): string {
  const $ = cheerio.load(html);

  // Substack specific cleaning
  // Remove the "Open in app" or "Share" header usually at the top
  $('.subscription-widget-wrap').remove();
  $('.header-anchor').remove();

  // Attempt to remove known footer elements
  $('div.footer').remove();
  $('table[role="presentation"]').each((_i, el) => {
    // Very naive check for footer-like tables containing "Unsubscribe"
    if ($(el).text().includes('Unsubscribe')) {
      $(el).remove();
    }
  });

  // Return the cleaned body HTML
  return $('body').html() || html;
}

async function main() {
  console.log('Authenticating...');
  const auth = await authorize();

  console.log(`Searching for emails from ${SENDER_EMAIL}...`);
  const messages = await listMessages(auth, `from:${SENDER_EMAIL}`);

  if (messages.length === 0) {
    console.log('No messages found.');
    return;
  }

  console.log(`Found ${messages.length} messages.`);

  const choices = [];

  for (const msg of messages) {
    const details = await getMessage(auth, msg.id!);
    if (details && details.subject && details.date) {
      const dateShort = formatDateForFilename(details.date);
      const titleClean = cleanTitle(details.subject);
      const year = getYearFromDate(details.date);
      const filename = `${dateShort} ${titleClean}.html`;
      const filePath = path.join(BLOGS_DIR, year, filename);

      const exists = fs.existsSync(filePath);
      choices.push({
        name: `${exists ? '[EXISTS] ' : '[NEW]    '} ${details.date} - ${details.subject}`,
        value: { ...details, filename, year, exists } as EmailChoice,
        disabled: exists ? 'Already imported' : false,
      });
    }
  }

  if (choices.length === 0) {
    console.log('No valid emails found to import.');
    return;
  }

  const { selectedEmails } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'selectedEmails',
      message: 'Select emails to import:',
      choices,
      pageSize: 20,
    },
  ]);

  if (selectedEmails.length === 0) {
    console.log('No emails selected.');
    return;
  }

  for (const email of selectedEmails as EmailChoice[]) {
    console.log(`Processing: ${email.subject}...`);

    const yearDir = path.join(BLOGS_DIR, email.year);
    if (!fs.existsSync(yearDir)) {
      fs.mkdirSync(yearDir, { recursive: true });
    }

    const rawHtml = email.body || '';
    const cleanedHtml = extractArticleContent(rawHtml);

    const outputPath = path.join(yearDir, email.filename);
    fs.writeFileSync(outputPath, cleanedHtml);
    console.log(`Saved to: ${outputPath}`);
  }
}

main().catch(console.error);
