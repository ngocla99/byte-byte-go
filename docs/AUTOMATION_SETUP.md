# ByteByteGo Blog Automation Setup Guide

This guide will help you set up automatic synchronization of ByteByteGo blog posts from Gmail to your repository.

## Overview

The automation system:
- ✅ Fetches new ByteByteGo emails from Gmail automatically
- ✅ Extracts HTML content from emails
- ✅ Saves blogs to the correct year folder
- ✅ Runs daily via GitHub Actions (100% free)
- ✅ Commits and pushes changes automatically

## Prerequisites

- Google account with Gmail
- GitHub repository with Actions enabled
- Node.js 18+ (for local testing)
- pnpm (for dependency management)

## Setup Steps

### 1. Google Cloud Console Setup

#### 1.1 Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"New Project"**
3. Name: `bytebytego-sync` (or any name you prefer)
4. Click **"Create"**

#### 1.2 Enable Gmail API

1. In your project, go to **"APIs & Services" > "Library"**
2. Search for **"Gmail API"**
3. Click on it and press **"Enable"**

#### 1.3 Create OAuth2 Credentials

1. Go to **"APIs & Services" > "Credentials"**
2. Click **"Create Credentials" > "OAuth client ID"**
3. If prompted, configure the OAuth consent screen:
   - User Type: **External**
   - App name: `ByteByteGo Sync`
   - User support email: your email
   - Developer contact: your email
   - Scopes: You'll add these later
   - Test users: Add your Gmail address
4. Back to credentials creation:
   - Application type: **Desktop app**
   - Name: `ByteByteGo Desktop Client`
   - Click **"Create"**
5. **Download** the JSON file with your credentials

#### 1.4 Extract Credentials

Open the downloaded JSON file and extract:
- `client_id` → This is your `GMAIL_CLIENT_ID`
- `client_secret` → This is your `GMAIL_CLIENT_SECRET`

### 2. Local Setup (Get Refresh Token)

#### 2.1 Install Dependencies

```bash
cd scripts
pnpm install
```

#### 2.2 Create .env File

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```env
GMAIL_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
GMAIL_CLIENT_SECRET=your_client_secret_here
# GMAIL_REFRESH_TOKEN will be generated in next step
```

#### 2.3 Generate Refresh Token

Run the authentication script:

```bash
cd scripts
pnpm run auth
```

This will:
1. Open your browser automatically
2. Ask you to sign in with Google
3. Request permissions to access Gmail
4. Display your refresh token in the terminal

**Important:** Copy the `GMAIL_REFRESH_TOKEN` and add it to your `.env` file:

```env
GMAIL_REFRESH_TOKEN=your_refresh_token_here
```

### 3. Test Locally (Optional but Recommended)

#### 3.1 Dry Run (Test Without Saving)

```bash
cd scripts
pnpm run sync:dry-run
```

This will:
- Connect to Gmail
- Find ByteByteGo emails
- Parse content
- Show what would be saved
- **NOT** actually save files or mark emails as processed

#### 3.2 Live Run

```bash
cd scripts
pnpm run sync
```

This will:
- Process new emails
- Save HTML files to `apps/web/public/blogs/YYYY/`
- Mark emails as processed in Gmail

### 4. GitHub Actions Setup

#### 4.1 Add GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings > Secrets and variables > Actions**
3. Click **"New repository secret"**
4. Add these three secrets:

| Name | Value |
|------|-------|
| `GMAIL_CLIENT_ID` | Your client ID from step 1.4 |
| `GMAIL_CLIENT_SECRET` | Your client secret from step 1.4 |
| `GMAIL_REFRESH_TOKEN` | Your refresh token from step 2.3 |

#### 4.2 Enable GitHub Actions

1. Go to **Actions** tab in your repository
2. If prompted, enable Actions
3. You should see the workflow: **"Sync ByteByteGo Blogs"**

#### 4.3 Test the Workflow

1. Go to **Actions** tab
2. Select **"Sync ByteByteGo Blogs"** workflow
3. Click **"Run workflow"**
4. Choose branch (usually `main`)
5. Optionally enable **"dry_run"** for testing
6. Click **"Run workflow"**

The workflow will:
- Run the sync script
- Commit new blog files (if any)
- Push to your repository

### 5. Automatic Scheduling

The workflow is configured to run daily at 9 AM UTC.

To change the schedule:

Edit `.github/workflows/sync-blogs.yml`:

```yaml
on:
  schedule:
    # Change this cron expression
    # Format: minute hour day month day-of-week
    # Example: '0 14 * * *' = 2 PM UTC daily
    - cron: '0 9 * * *'
```

Common schedules:
- `'0 9 * * *'` - Daily at 9 AM UTC
- `'0 */6 * * *'` - Every 6 hours
- `'0 9,21 * * *'` - Twice daily (9 AM and 9 PM UTC)
- `'0 9 * * 1'` - Weekly on Monday at 9 AM UTC

## Usage

### Manual Trigger

To manually sync blogs:

1. Go to **Actions** tab on GitHub
2. Select **"Sync ByteByteGo Blogs"**
3. Click **"Run workflow"**
4. Run on your preferred branch
5. Click **"Run workflow"**

### Local Sync

To sync blogs locally:

```bash
cd scripts
pnpm run sync
```

### Dry Run (Testing)

To test without making changes:

```bash
cd scripts
pnpm run sync:dry-run
```

## How It Works

### Email Search

The script searches for emails matching:
```
from:bytebytego OR from:substack.com
```

### File Naming

Emails are converted to files with this format:
```
YYMMDD Title.html
```

Examples:
- `250814 A Guide to Top Caching Strategies.html`
- `231215 Understanding Microservices.html`

### Folder Organization

Files are saved to year folders:
```
apps/web/public/blogs/
├── 2023/
│   └── 231215 Title.html
├── 2024/
│   └── 241215 Title.html
└── 2025/
    └── 250814 Title.html
```

### Email Processing

Once processed, emails are labeled as:
```
ByteByteGo/Processed
```

This prevents duplicate processing.

## Troubleshooting

### "Authentication failed"

**Problem:** Can't authenticate with Gmail API

**Solutions:**
1. Check your `.env` file has correct credentials
2. Make sure Gmail API is enabled in Google Cloud Console
3. Verify your OAuth consent screen includes your email as a test user
4. Try regenerating the refresh token: `pnpm run auth`

### "No emails found"

**Problem:** Script doesn't find any emails

**Solutions:**
1. Check you have ByteByteGo emails in your Gmail
2. Verify the search query in `.env`:
   ```env
   GMAIL_SEARCH_QUERY=from:bytebytego OR from:substack.com
   ```
3. Try searching manually in Gmail with the same query

### "File already exists"

**Problem:** Email found but file already exists

**Solution:** This is normal! The email was already synced before. The script will:
- Skip saving the duplicate file
- Mark the email as processed to avoid finding it again

### "GitHub Actions fails"

**Problem:** Workflow fails on GitHub

**Solutions:**
1. Check all three secrets are set correctly:
   - `GMAIL_CLIENT_ID`
   - `GMAIL_CLIENT_SECRET`
   - `GMAIL_REFRESH_TOKEN`
2. View the workflow logs for specific error messages
3. Try running locally first to debug: `pnpm run sync:dry-run`

### "Rate limit exceeded"

**Problem:** Too many API requests

**Solutions:**
1. Gmail API free tier: 1 billion quota units/day (very generous)
2. If you hit limits, the script will fail gracefully
3. Wait a few hours and try again
4. Reduce sync frequency in cron schedule

### "Refresh token expired"

**Problem:** Token stopped working

**Solutions:**
1. Refresh tokens from Google usually don't expire
2. If it does expire, regenerate it:
   ```bash
   cd scripts
   pnpm run auth
   ```
3. Update the `GMAIL_REFRESH_TOKEN` in GitHub Secrets

## Security Notes

### Protecting Credentials

- ✅ **Never** commit `.env` file to git
- ✅ `.env` is in `.gitignore`
- ✅ Credentials stored in GitHub Secrets (encrypted)
- ✅ Tokens in `scripts/auth/` are git-ignored

### API Permissions

The script only requests these Gmail permissions:
- `gmail.readonly` - Read emails
- `gmail.modify` - Add labels to emails
- `gmail.labels` - Create/manage labels

It **cannot**:
- ❌ Delete emails
- ❌ Send emails
- ❌ Access other Google services

### Revoking Access

To revoke access:
1. Go to [Google Account Permissions](https://myaccount.google.com/permissions)
2. Find "ByteByteGo Sync"
3. Click "Remove Access"

## Cost

### Free Tier Limits

Everything uses free tier:

| Service | Free Tier | Our Usage |
|---------|-----------|-----------|
| Gmail API | 1B quota units/day | ~100 units/day |
| GitHub Actions | 2000 min/month | ~2 min/day = 60 min/month |
| Google Cloud | Free | Gmail API only |

**Total Cost: $0** 💰

## Advanced Configuration

### Custom Email Query

Edit `.env` to customize email search:

```env
# Only from specific sender
GMAIL_SEARCH_QUERY=from:bytebytego@substack.com

# With specific subject
GMAIL_SEARCH_QUERY=from:bytebytego subject:"ByteByteGo"

# Within date range
GMAIL_SEARCH_QUERY=from:bytebytego after:2024/01/01

# Combine multiple criteria
GMAIL_SEARCH_QUERY=from:bytebytego OR from:alex@bytebytego.com after:2024/01/01
```

### Custom Label Name

Change the processed label:

```env
GMAIL_LABEL_PROCESSED=Blogs/Synced
```

### Custom Blog Path

Change where blogs are saved:

```env
BLOGS_BASE_PATH=../content/blogs
```

## Support

For issues or questions:

1. Check this documentation
2. Review the logs from failed runs
3. Test locally with `pnpm run sync:dry-run`
4. Check the [GitHub repository issues](https://github.com/your-repo/issues)

## Next Steps

After setup:

1. ✅ Verify the first manual sync works
2. ✅ Check that files appear in correct year folders
3. ✅ Verify emails are labeled as "Processed" in Gmail
4. ✅ Wait for the scheduled run or trigger manually
5. ✅ Monitor Actions tab for any failures

---

**You're all set!** 🎉

The system will now automatically sync new ByteByteGo posts from your Gmail every day.
