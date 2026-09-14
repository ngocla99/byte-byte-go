import fs from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';
import { google } from 'googleapis';

const TOKEN_PATH = path.resolve(import.meta.dirname, 'token.json');
const BLOGS_DIR = path.resolve(import.meta.dirname, '../public/blogs');
const BYTESIZED_DIR = path.resolve(import.meta.dirname, '../public/bytesized');

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

function isPromotional(subject: string): boolean {
  const s = subject.toLowerCase();
  const promoKeywords = [
    '50% off',
    '40% off',
    '30% off',
    'sale',
    'deal',
    'discount',
    'unsubscribed',
    'subscription is ending',
    'subscription extended',
    'welcome to byte-sized',
    'last call for enrollment',
    'become an ai engineer',
    'hiring: part time instructor',
  ];
  return promoKeywords.some((kw) => s.includes(kw));
}

function cleanTitle(title: string): string {
  return title
    .replace(/ByteByteGo Newsletter:?\s*/i, '')
    .replace(/[\u{1F300}-\u{1F9FF}]/gu, '') // Remove emojis
    .replace(/&/g, 'and')
    .replace(/[/\\:*?"<>|#%{}$!'@+`=]/g, '')
    .replace(/\s+/g, ' ')
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

function extractArticleContent(html: string): string {
  const $ = cheerio.load(html);

  $('.subscription-widget-wrap').remove();
  $('.header-anchor').remove();
  $('div.footer').remove();
  $('table[role="presentation"]').each((_i, el) => {
    if ($(el).text().includes('Unsubscribe')) {
      $(el).remove();
    }
  });

  let contentHtml = null;
  $('div').each((_i, el) => {
    const style = $(el).attr('style');
    if (style && style.includes('max-width: 550px')) {
      $(el).attr(
        'style',
        "font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 16px; line-height: 26px; max-width: 728px; width: 100%; margin: 0 auto;"
      );
      contentHtml = $.html(el);
    }
  });

  return contentHtml || $('body').html() || html;
}

async function getMessage(gmail: any, id: string) {
  const res = await gmail.users.messages.get({
    userId: 'me',
    id,
    format: 'full',
  });

  const payload = res.data.payload;
  if (!payload) return null;

  const headers = payload.headers;
  const subject = headers?.find((h: any) => h.name === 'Subject')?.value;
  const date = headers?.find((h: any) => h.name === 'Date')?.value;

  let body = '';
  if (payload.body?.data) {
    body = Buffer.from(payload.body.data, 'base64').toString('utf-8');
  } else if (payload.parts) {
    const htmlPart = payload.parts.find(
      (part: any) => part.mimeType === 'text/html'
    );
    if (htmlPart && htmlPart.body?.data) {
      body = Buffer.from(htmlPart.body.data, 'base64').toString('utf-8');
    } else {
      const textPart = payload.parts.find(
        (part: any) => part.mimeType === 'text/plain'
      );
      if (textPart && textPart.body?.data) {
        body = Buffer.from(textPart.body.data, 'base64').toString('utf-8');
      }
    }
  }

  return { id, subject, date, body };
}

async function syncSource(gmail: any, sourceKey: keyof typeof EMAIL_SOURCES) {
  const source = EMAIL_SOURCES[sourceKey];
  console.log(`\n========================================`);
  console.log(`Syncing ${source.name} (${source.email})...`);
  console.log(`========================================`);

  const res = await gmail.users.messages.list({
    userId: 'me',
    q: `from:${source.email}`,
    maxResults: 100,
  });

  const messages = res.data.messages || [];
  console.log(`Found ${messages.length} messages in Gmail.`);

  let importedCount = 0;
  let skippedPromoCount = 0;
  let alreadyExistsCount = 0;

  for (const m of messages) {
    if (!m.id) continue;
    const msg = await getMessage(gmail, m.id);
    if (!msg || !msg.subject || !msg.date || !msg.body) continue;

    if (isPromotional(msg.subject)) {
      skippedPromoCount++;
      continue;
    }

    // Only import paid / subscriber-only articles
    const isPaid =
      msg.body.includes('subscriber-only') ||
      /rgb\(\s*94\s*,\s*73\s*,\s*217\s*\)/.test(msg.body) ||
      cheerio.load(msg.body)('div, span').toArray().some((el) => cheerio.load(msg.body)(el).text().trim() === 'Paid');

    const isTruncated =
      msg.body.includes('This post is for paid subscribers') ||
      msg.body.includes('Upgrade to paid');

    if (!isPaid || isTruncated) {
      continue;
    }

    const dateShort = formatDateForFilename(msg.date);
    const titleClean = cleanTitle(msg.subject);
    const year = getYearFromDate(msg.date);
    const filename = `${dateShort} ${titleClean}.html`;
    const yearDir = path.join(source.outputDir, year);
    const filePath = path.join(yearDir, filename);

    if (fs.existsSync(filePath)) {
      alreadyExistsCount++;
      continue;
    }

    if (!fs.existsSync(yearDir)) {
      fs.mkdirSync(yearDir, { recursive: true });
    }

    const cleanedHtml = extractArticleContent(msg.body);
    fs.writeFileSync(filePath, cleanedHtml, 'utf8');
    console.log(`✓ [${dateShort}] ${titleClean}`);
    importedCount++;
  }

  console.log(`\nDone ${source.name}:`);
  console.log(` - Imported: ${importedCount}`);
  console.log(` - Skipped (already imported): ${alreadyExistsCount}`);
  console.log(` - Skipped (promotional/ads): ${skippedPromoCount}`);

  return importedCount;
}

async function main() {
  const content = fs.readFileSync(TOKEN_PATH, 'utf8');
  const credentials = JSON.parse(content);
  const auth = google.auth.fromJSON(credentials);
  const gmail = google.gmail({ version: 'v1', auth: auth as any });

  const bbgCount = await syncSource(gmail, 'bytebytego');
  const bsdCount = await syncSource(gmail, 'bytesized');

  console.log(`\n🎉 Total new articles imported: ${bbgCount + bsdCount}`);
}

main().catch(console.error);
