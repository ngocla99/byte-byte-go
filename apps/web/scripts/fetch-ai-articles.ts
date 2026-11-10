import fs from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';
import { google } from 'googleapis';

const TOKEN_PATH = path.resolve(import.meta.dirname, 'token.json');
const BLOGS_DIR = path.resolve(import.meta.dirname, '../public/blogs');
const BYTESIZED_DIR = path.resolve(import.meta.dirname, '../public/bytesized');

const AI_PATTERNS = [
  /\bai\b/i,
  /\bgenai\b/i,
  /\bllm\b/i,
  /\bllms\b/i,
  /\brag\b/i,
  /\brags\b/i,
  /\bmcp\b/i,
  /\bagent\b/i,
  /\bagents\b/i,
  /\bagentic\b/i,
  /\bdeepseek\b/i,
  /\bprompt\b/i,
  /\bprompts\b/i,
  /\bgpt\b/i,
  /\bchatbot\b/i,
  /\blangchain\b/i,
  /\bmachine learning\b/i,
  /\bml\b/i,
  /foundation model/i,
  /model training/i,
  /ml annotation/i,
  /ml training/i,
  /neural network/i,
  /transformer/i,
  /vector database/i,
  /vector db/i,
  /embedding/i,
  /vision model/i,
  /diffusion/i,
  /openai/i,
  /anthropic/i,
  /claude/i,
];

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
    'we are hiring',
    'cohort launch',
    'enrollment ends soon',
    'cohort-based course',
    'last chance to enroll',
    'new launch: become an ai engineer',
    'love teaching? bytebytego is hiring',
  ];
  return promoKeywords.some((kw) => s.includes(kw));
}

function cleanTitle(title: string): string {
  return title
    .replace(/ByteByteGo Newsletter:?\s*/i, '')
    .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
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

function getBodyFromPayload(payload: any): string {
  if (payload.body?.data) {
    return Buffer.from(payload.body.data, 'base64').toString('utf-8');
  }
  if (payload.parts) {
    const htmlPart = payload.parts.find((p: any) => p.mimeType === 'text/html');
    if (htmlPart && htmlPart.body?.data) {
      return Buffer.from(htmlPart.body.data, 'base64').toString('utf-8');
    }
    for (const part of payload.parts) {
      if (part.parts) {
        const nested = getBodyFromPayload(part);
        if (nested) return nested;
      }
    }
    const textPart = payload.parts.find((p: any) => p.mimeType === 'text/plain');
    if (textPart && textPart.body?.data) {
      return Buffer.from(textPart.body.data, 'base64').toString('utf-8');
    }
  }
  return '';
}

async function main() {
  const content = fs.readFileSync(TOKEN_PATH, 'utf8');
  const credentials = JSON.parse(content);
  const auth = google.auth.fromJSON(credentials);
  const gmail = google.gmail({ version: 'v1', auth: auth as any });

  const emailsToScan = [
    { name: 'ByteByteGo', email: 'bytebytego@substack.com', dir: BLOGS_DIR },
    { name: 'ByteSized', email: 'bytesizeddesign@substack.com', dir: BYTESIZED_DIR },
  ];

  let totalNew = 0;

  for (const src of emailsToScan) {
    console.log(`\nScanning all emails for ${src.name}...`);
    let pageToken: string | undefined = undefined;
    const allMsgs: any[] = [];

    while (true) {
      const res: any = await gmail.users.messages.list({
        userId: 'me',
        q: `from:${src.email}`,
        pageToken,
        maxResults: 100,
      });
      allMsgs.push(...(res.data.messages || []));
      pageToken = res.data.nextPageToken;
      if (!pageToken) break;
    }

    console.log(`Found ${allMsgs.length} messages in Gmail for ${src.name}.`);

    let imported = 0;
    let skippedExisting = 0;
    let skippedPromo = 0;
    let skippedNonAI = 0;

    for (let i = 0; i < allMsgs.length; i++) {
      const m = allMsgs[i];
      try {
        const msgRes = await gmail.users.messages.get({
          userId: 'me',
          id: m.id,
          format: 'full',
        });
        const payload = msgRes.data.payload;
        if (!payload) continue;

        const headers = payload.headers || [];
        const subject = headers.find((h: any) => h.name === 'Subject')?.value || '';
        const date = headers.find((h: any) => h.name === 'Date')?.value || '';
        const body = getBodyFromPayload(payload);

        if (!subject || !date || !body) continue;

        if (isPromotional(subject)) {
          skippedPromo++;
          continue;
        }

        const isAI = AI_PATTERNS.some((pat) => pat.test(subject) || pat.test(msgRes.data.snippet || ''));
        if (!isAI) {
          skippedNonAI++;
          continue;
        }

        // Check if truncated (paywall teaser)
        const isTruncated =
          body.includes('This post is for paid subscribers') ||
          (body.includes('Upgrade to paid') && body.includes('read more'));

        if (isTruncated) {
          // Teaser only, skip
          continue;
        }

        const dateShort = formatDateForFilename(date);
        const titleClean = cleanTitle(subject);
        const year = getYearFromDate(date);
        const filename = `${dateShort} ${titleClean}.html`;
        const yearDir = path.join(src.dir, year);
        const filePath = path.join(yearDir, filename);

        if (fs.existsSync(filePath)) {
          skippedExisting++;
          continue;
        }

        if (!fs.existsSync(yearDir)) {
          fs.mkdirSync(yearDir, { recursive: true });
        }

        const cleanedHtml = extractArticleContent(body);
        fs.writeFileSync(filePath, cleanedHtml, 'utf8');
        console.log(`✓ [${dateShort}] ${titleClean}`);
        imported++;
      } catch (err: any) {
        if (err?.message?.includes('Quota') || err?.status === 429 || err?.status === 403) {
          console.log('Hit rate limit, waiting 5 seconds...');
          await new Promise((r) => setTimeout(r, 5000));
          i--; // retry
          continue;
        }
        console.error(`Error on message ${m.id}:`, err?.message || err);
      }
    }

    console.log(`Done ${src.name}:`);
    console.log(` - Imported: ${imported}`);
    console.log(` - Already exists: ${skippedExisting}`);
    console.log(` - Skipped promo: ${skippedPromo}`);
    console.log(` - Skipped non-AI: ${skippedNonAI}`);
    totalNew += imported;
  }

  console.log(`\n🎉 Total new AI articles imported: ${totalNew}`);
}

main().catch(console.error);
