# Automate ByteByteGo Blog Sync

## Objective
Tự động hóa quy trình lấy bài viết trả phí từ ByteByteGo (nhận qua Gmail), parse HTML content, và lưu vào folder `apps/web/public/blogs/` theo năm - sử dụng 100% dịch vụ miễn phí.

## Current Manual Process
1. Nhận email từ ByteByteGo/Substack
2. Mở email và copy phần HTML
3. Tạo file mới trong `apps/web/public/blogs/YYYY/`
4. Đặt tên file theo format: `YYMMDD Title.html`
5. Paste HTML content vào file
6. Commit và push lên repository

## Proposed Automated Solution

### Architecture Overview

```
Gmail (ByteByteGo emails)
    ↓
Gmail API (OAuth2)
    ↓
Node.js Sync Script
    ↓
Parse & Extract HTML
    ↓
Save to apps/web/public/blogs/YYYY/
    ↓
Git commit & push
    ↓
GitHub Actions (scheduled)
```

### Technology Stack (All Free)

1. **Gmail API** - Google Cloud Platform (Free tier)
2. **Node.js** - Runtime for sync script
3. **GitHub Actions** - CI/CD automation (2000 minutes/month free)
4. **Git** - Version control

## Implementation Tasks

### Phase 1: Gmail API Setup

#### Task 1.1: Create Google Cloud Project
- [ ] Go to Google Cloud Console
- [ ] Create new project: `bytebytego-sync`
- [ ] Enable Gmail API
- [ ] Create OAuth2 credentials
- [ ] Download credentials JSON

#### Task 1.2: Setup OAuth2 Flow
- [ ] Create `scripts/auth/gmail-auth.js`
- [ ] Implement OAuth2 authentication flow
- [ ] Generate and save refresh token
- [ ] Store credentials securely

**Files to create:**
- `scripts/auth/gmail-auth.js` - OAuth2 authentication
- `scripts/auth/.gitignore` - Ignore credentials

**Dependencies:**
```json
{
  "googleapis": "^140.0.0",
  "dotenv": "^16.4.7"
}
```

---

### Phase 2: Email Processing Script

#### Task 2.1: Create Gmail Client
- [ ] Create `scripts/gmail-client.js`
- [ ] Implement email search by sender/subject
- [ ] Implement email fetching
- [ ] Implement label management (mark as processed)

**Features:**
- Search emails from `@bytebytego.com` or Substack
- Filter unread or unlabeled emails
- Fetch email HTML body
- Mark email as processed with custom label

#### Task 2.2: HTML Parser
- [ ] Create `scripts/html-parser.js`
- [ ] Extract HTML content from email body
- [ ] Parse email subject to get title
- [ ] Parse email date to determine year/filename
- [ ] Clean up HTML (remove tracking pixels, fix paths)

**Parsing Logic:**
```javascript
// Input: Email subject "A Guide to Top Caching Strategies - Aug 14"
// Output:
// - Year: 2025 (from email date)
// - Filename: "250814 A Guide to Top Caching Strategies.html"
// - HTML: cleaned content
```

#### Task 2.3: File Manager
- [ ] Create `scripts/file-manager.js`
- [ ] Implement year detection logic
- [ ] Implement filename generation (YYMMDD format)
- [ ] Create directory if not exists
- [ ] Save HTML to correct location
- [ ] Prevent duplicate files

**File Structure:**
```
apps/web/public/blogs/
├── 2023/
│   └── 231215 Title.html
├── 2024/
│   └── 241215 Title.html
└── 2025/
    └── 250814 Title.html
```

---

### Phase 3: Main Sync Script

#### Task 3.1: Orchestration Script
- [ ] Create `scripts/sync-blogs.js`
- [ ] Connect all modules (Gmail → Parser → File Manager)
- [ ] Implement error handling
- [ ] Add logging
- [ ] Add dry-run mode for testing

**Script Flow:**
```javascript
1. Authenticate with Gmail API
2. Search for new ByteByteGo emails
3. For each email:
   a. Fetch HTML content
   b. Parse metadata (title, date)
   c. Generate filename
   d. Save to correct folder
   e. Mark email as processed
4. Report summary (X new blogs added)
```

#### Task 3.2: Configuration
- [ ] Create `.env.example` template
- [ ] Create `scripts/config.js` for constants
- [ ] Document all environment variables

**Environment Variables:**
```env
GMAIL_CLIENT_ID=xxx
GMAIL_CLIENT_SECRET=xxx
GMAIL_REFRESH_TOKEN=xxx
GMAIL_SEARCH_QUERY=from:bytebytego OR from:substack
GMAIL_LABEL_PROCESSED=ByteByteGo/Processed
```

---

### Phase 4: GitHub Actions Automation

#### Task 4.1: Create Workflow
- [ ] Create `.github/workflows/sync-blogs.yml`
- [ ] Setup schedule trigger (cron)
- [ ] Setup manual trigger (workflow_dispatch)
- [ ] Install dependencies
- [ ] Run sync script
- [ ] Commit and push changes

**Workflow Features:**
- Run daily at 9 AM UTC
- Can be triggered manually
- Only commit if new files added
- Use bot account for commits

#### Task 4.2: GitHub Secrets Setup
- [ ] Add `GMAIL_CLIENT_ID` secret
- [ ] Add `GMAIL_CLIENT_SECRET` secret
- [ ] Add `GMAIL_REFRESH_TOKEN` secret
- [ ] Document secret setup in README

**GitHub Secrets Required:**
```
GMAIL_CLIENT_ID
GMAIL_CLIENT_SECRET
GMAIL_REFRESH_TOKEN
```

---

### Phase 5: Testing & Documentation

#### Task 5.1: Testing
- [ ] Test OAuth2 flow locally
- [ ] Test email fetching with real emails
- [ ] Test HTML parsing and cleaning
- [ ] Test file creation in correct folders
- [ ] Test GitHub Actions workflow
- [ ] Test with edge cases (special characters, long titles)

#### Task 5.2: Documentation
- [ ] Create `docs/AUTOMATION_SETUP.md`
- [ ] Document Gmail API setup steps
- [ ] Document GitHub Secrets configuration
- [ ] Create troubleshooting guide
- [ ] Add usage examples

#### Task 5.3: Safety & Rollback
- [ ] Add validation before file write
- [ ] Keep email unread if processing fails
- [ ] Add --dry-run flag for testing
- [ ] Document manual override process

---

## File Structure

```
byte-byte-go/
├── .agents/
│   └── tasks/
│       └── automate-bytebytego-sync.md (this file)
├── .github/
│   └── workflows/
│       └── sync-blogs.yml
├── scripts/
│   ├── auth/
│   │   ├── gmail-auth.js
│   │   └── .gitignore
│   ├── gmail-client.js
│   ├── html-parser.js
│   ├── file-manager.js
│   ├── sync-blogs.js
│   ├── config.js
│   └── package.json
├── docs/
│   └── AUTOMATION_SETUP.md
├── .env.example
└── apps/web/public/blogs/
    ├── 2023/
    ├── 2024/
    └── 2025/
```

## Dependencies

```json
{
  "name": "bytebytego-sync",
  "version": "1.0.0",
  "type": "module",
  "dependencies": {
    "googleapis": "^140.0.0",
    "dotenv": "^16.4.7",
    "cheerio": "^1.0.0",
    "date-fns": "^4.1.0"
  }
}
```

## Timeline Estimate

- **Phase 1**: 1-2 hours (Gmail API setup + OAuth)
- **Phase 2**: 2-3 hours (Email processing + HTML parsing)
- **Phase 3**: 1-2 hours (Main script + config)
- **Phase 4**: 1 hour (GitHub Actions)
- **Phase 5**: 1 hour (Testing + docs)

**Total**: ~6-9 hours

## Success Criteria

✅ Script can authenticate with Gmail API
✅ Script can find ByteByteGo emails automatically
✅ HTML content is extracted correctly
✅ Files are saved with correct naming format
✅ Files are saved in correct year folder
✅ Duplicate prevention works
✅ GitHub Actions runs automatically daily
✅ Git commits are created only when new files added
✅ Complete documentation for setup

## Risks & Mitigation

| Risk | Mitigation |
|------|------------|
| Gmail API quota limits | Use labels to avoid reprocessing |
| HTML format changes | Add validation and alerts |
| Duplicate files | Check file existence before writing |
| Authentication expiry | Refresh token auto-renewal |
| Action fails silently | Add error notifications |

## Future Enhancements

- [ ] Send Slack/Discord notification when new blog added
- [ ] Automatically create PR instead of direct commit
- [ ] Add blog preview in PR description
- [ ] OCR for image-based emails
- [ ] Support multiple email sources
- [ ] Web dashboard to manage sync

## Notes

- All services used are in FREE tier
- No credit card required for basic setup
- Can process ~100 emails/day with Gmail API free tier
- GitHub Actions: 2000 minutes/month free (plenty for daily runs)
- Credentials stored securely in GitHub Secrets
- Can run manually anytime via GitHub UI

## References

- [Gmail API Node.js Quickstart](https://developers.google.com/gmail/api/quickstart/nodejs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Google Cloud Free Tier](https://cloud.google.com/free)
