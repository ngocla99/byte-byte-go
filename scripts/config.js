import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

export const config = {
  gmail: {
    clientId: process.env.GMAIL_CLIENT_ID,
    clientSecret: process.env.GMAIL_CLIENT_SECRET,
    refreshToken: process.env.GMAIL_REFRESH_TOKEN,
    redirectUri: 'http://localhost:3000/oauth2callback',
    scopes: [
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/gmail.modify',
      'https://www.googleapis.com/auth/gmail.labels'
    ],
    searchQuery: process.env.GMAIL_SEARCH_QUERY || 'from:bytebytego OR from:substack.com',
    labelProcessed: process.env.GMAIL_LABEL_PROCESSED || 'ByteByteGo/Processed'
  },

  paths: {
    blogsBase: process.env.BLOGS_BASE_PATH || '../apps/web/public/blogs',
    tokensDir: join(__dirname, 'auth')
  },

  dryRun: process.env.DRY_RUN === 'true',

  // Email parsing patterns
  patterns: {
    // Match ByteByteGo email subjects
    subjectPattern: /^(.+?)(?:\s*-\s*(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2})?$/,

    // Date patterns in email
    datePattern: /(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},?\s+\d{4}/i
  }
};

// Validate required configuration
export function validateConfig() {
  const errors = [];

  if (!config.gmail.clientId) {
    errors.push('GMAIL_CLIENT_ID is required');
  }

  if (!config.gmail.clientSecret) {
    errors.push('GMAIL_CLIENT_SECRET is required');
  }

  if (!config.gmail.refreshToken) {
    errors.push('GMAIL_REFRESH_TOKEN is required (run: npm run auth)');
  }

  if (errors.length > 0) {
    console.error('❌ Configuration errors:');
    errors.forEach(err => console.error(`  - ${err}`));
    console.error('\nPlease check your .env file or run setup.');
    process.exit(1);
  }

  return true;
}
