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
const BYTESIZED_DIR = path.join(process.cwd(), 'public', 'bytesized');

// Email sources configuration
const EMAIL_SOURCES = {
  bytebytego: {
    name: 'ByteByteGo',
    email: 'bytebytego@substack.com',
    outputDir: BLOGS_DIR,
  },
  bytesized: {
    name: 'ByteSizedDesign',
    email: 'bytesizeddesign@substack.com',
    outputDir: BYTESIZED_DIR,
  },
} as const;

type SourceKey = keyof typeof EMAIL_SOURCES;

interface EmailData {
  id: string;
  snippet?: string | null;
  date?: string | null;
  subject?: string | null;
  body?: string;
  isPaid: boolean;
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
  // Remove emojis and forbidden characters for filenames
  return title
    .replace(/ByteByteGo Newsletter:?\s*/i, '')
    .replace(/[\u{1F300}-\u{1F9FF}]/gu, '') // Remove emojis
    .replace(/&/g, 'and') // Replace & with 'and'
    .replace(/[/\\:*?"<>|#%{}$!'@+`=]/g, '') // Remove problematic chars
    .replace(/\s+/g, ' ') // Normalize multiple spaces
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
    maxResults: 100, // Fetch top 100 recent emails
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

  // Detect "Paid" status using Cheerio
  let isPaid = false;
  if (body) {
    const $ = cheerio.load(body);
    // Look for the specific "Paid" indicator
    // Based on the example, it's a div with text "Paid" and upper case style, but we can just check text content of divs
    // or look for the exact structure if needed.
    // For now, looking for a div that strictly equals "Paid" is a good heuristic.
    $('div, span').each((_i, el) => {
      const text = $(el).text().trim();
      if (text === 'Paid') {
        const style = $(el).attr('style');
        // Check for color rgb(94, 73, 217) with support for variable spacing
        if (style && /rgb\(\s*94\s*,\s*73\s*,\s*217\s*\)/.test(style)) {
          isPaid = true;
        }
      }
    });

    // Fallback: Check for "subscriber-only" text which appears in the body of paid posts
    if (!isPaid && body.includes('subscriber-only')) {
      isPaid = true;
    }
  }

  return {
    id,
    snippet: res.data.snippet,
    date,
    subject,
    body,
    isPaid,
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

  // Find the main content div that typically has max-width: 550px
  let contentHtml = null;
  $('div').each((_i, el) => {
    const style = $(el).attr('style');
    if (style && style.includes('max-width: 550px')) {
      // Update styles
      $(el).attr(
        'style',
        "font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 16px; line-height: 26px; max-width: 728px; width: 100%; margin: 0 auto;"
      );
      // Capture this specific div's HTML
      contentHtml = $.html(el);
    }
  });

  // Return ONLY the found content div, or fallback to body if not found
  return contentHtml || $('body').html() || html;
}

async function main() {
  // Prompt user for which source to fetch from
  const { sourceKey } = await inquirer.prompt([
    {
      type: 'rawlist',
      name: 'sourceKey',
      message: 'Select email source:',
      choices: Object.entries(EMAIL_SOURCES).map(([key, source]) => ({
        name: source.name,
        value: key,
      })),
    },
  ]);

  const selectedSource = EMAIL_SOURCES[sourceKey as SourceKey];
  const { email: senderEmail, outputDir } = selectedSource;

  console.log('Authenticating...');
  const auth = await authorize();

  console.log(`Searching for emails from ${senderEmail}...`);
  const messages = await listMessages(auth, `from:${senderEmail}`);

  if (messages.length === 0) {
    console.log('No messages found.');
    return;
  }

  console.log(`Found ${messages.length} messages.`);

  const { filterPaid } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'filterPaid',
      message: 'Show ONLY Paid blogs?',
      default: false,
    },
  ]);

  const choices = [];

  for (const msg of messages) {
    const details = await getMessage(auth, msg.id!);
    if (details && details.subject && details.date) {
      if (filterPaid && !details.isPaid) {
        continue;
      }

      const dateShort = formatDateForFilename(details.date);
      const titleClean = cleanTitle(details.subject);
      const year = getYearFromDate(details.date);
      const filename = `${dateShort} ${titleClean}.html`;
      const filePath = path.join(outputDir, year, filename);

      const exists = fs.existsSync(filePath);
      const paidTag = details.isPaid ? ' [PAID]' : '';

      choices.push({
        name: `${exists ? '[EXISTS]' : '[NEW]   '} ${paidTag} ${details.date} - ${details.subject}`,
        value: { ...details, filename, year, exists } as EmailChoice,
        disabled: exists ? 'Already imported' : false,
      });
    }
  }

  if (choices.length === 0) {
    console.log('No valid emails found to import.');
    return;
  }

  // Check if there are any selectable (non-disabled) choices
  const selectableChoices = choices.filter((c) => !c.disabled);
  if (selectableChoices.length === 0) {
    console.log('All found emails have already been imported.');
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

    const yearDir = path.join(outputDir, email.year);
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
