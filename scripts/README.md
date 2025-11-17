# ByteByteGo Blog Sync Scripts

Automated system to sync ByteByteGo blog posts from Gmail to the repository.

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm
- Gmail account with ByteByteGo subscription
- Google Cloud project with Gmail API enabled

### Installation

```bash
pnpm install
```

### Setup

1. Create `.env` file in project root (copy from `.env.example`)
2. Add your Gmail API credentials
3. Run authentication to get refresh token:

```bash
pnpm run auth
```

4. Add the refresh token to `.env`

### Usage

**Dry run (test without saving):**
```bash
pnpm run sync:dry-run
```

**Live sync:**
```bash
pnpm run sync
```

## Scripts

### `npm run auth`
- Runs OAuth2 authentication flow
- Opens browser for Google sign-in
- Generates refresh token
- Use this once during initial setup

### `npm run sync`
- Fetches new ByteByteGo emails from Gmail
- Parses HTML content
- Saves to `apps/web/public/blogs/YYYY/`
- Marks emails as processed

### `npm run sync:dry-run`
- Same as sync but doesn't save files
- Useful for testing

## Architecture

```
gmail-client.js     → Connects to Gmail API, fetches emails
html-parser.js      → Extracts and cleans HTML content
file-manager.js     → Saves files to correct year folders
sync-blogs.js       → Orchestrates the entire workflow
config.js           → Configuration management
```

## Configuration

Edit `.env` file:

```env
# Required
GMAIL_CLIENT_ID=xxx
GMAIL_CLIENT_SECRET=xxx
GMAIL_REFRESH_TOKEN=xxx

# Optional
GMAIL_SEARCH_QUERY=from:bytebytego OR from:substack.com
GMAIL_LABEL_PROCESSED=ByteByteGo/Processed
BLOGS_BASE_PATH=../apps/web/public/blogs
DRY_RUN=false
```

## Output

Files are saved as:
```
apps/web/public/blogs/
├── 2023/
│   └── 231215 Understanding Microservices.html
├── 2024/
│   └── 241215 API Design Patterns.html
└── 2025/
    └── 250814 A Guide to Top Caching Strategies.html
```

Filename format: `YYMMDD Title.html`

## Email Processing

1. Searches Gmail for ByteByteGo emails
2. Filters out already processed emails (by label)
3. Extracts HTML body from email
4. Parses title and date
5. Saves to correct year folder
6. Adds "ByteByteGo/Processed" label to email

## Error Handling

The script handles:
- Missing credentials → Clear error message
- Duplicate files → Skips gracefully
- Invalid HTML → Validation errors
- API rate limits → Fails with retry suggestion
- Network errors → Error logging

## Development

### Adding New Features

1. Modify the relevant module
2. Test locally with dry-run
3. Commit changes
4. Update documentation

### Testing

```bash
# Test authentication
pnpm run auth

# Test with dry run
pnpm run sync:dry-run

# Test live (on a fresh email)
pnpm run sync
```

### Debugging

Enable verbose logging by modifying scripts:
```javascript
console.log('Debug info:', data);
```

## Security

- Credentials stored in `.env` (gitignored)
- No credentials in code
- Minimal Gmail permissions requested
- Refresh token for long-term access

## Troubleshooting

**"Authentication failed"**
- Check credentials in `.env`
- Regenerate refresh token: `pnpm run auth`

**"No emails found"**
- Check Gmail search query
- Verify emails exist in your inbox

**"File already exists"**
- Normal behavior for duplicate emails
- Email will be marked as processed

See [AUTOMATION_SETUP.md](../docs/AUTOMATION_SETUP.md) for detailed troubleshooting.

## License

MIT
