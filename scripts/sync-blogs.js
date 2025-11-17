#!/usr/bin/env node

/**
 * ByteByteGo Blog Sync Script
 *
 * Main orchestrator that:
 * 1. Fetches new emails from Gmail
 * 2. Parses HTML content
 * 3. Saves to appropriate folders
 * 4. Marks emails as processed
 *
 * Usage:
 *   npm run sync              # Normal run
 *   npm run sync:dry-run      # Test without saving files
 */

import { config, validateConfig } from './config.js';
import { GmailClient } from './gmail-client.js';
import { HtmlParser } from './html-parser.js';
import { FileManager } from './file-manager.js';

class BlogSyncOrchestrator {
  constructor(options = {}) {
    this.dryRun = options.dryRun || config.dryRun;
    this.gmailClient = new GmailClient();
    this.htmlParser = new HtmlParser();
    this.fileManager = new FileManager();
    this.stats = {
      processed: 0,
      saved: 0,
      skipped: 0,
      failed: 0
    };
  }

  /**
   * Main sync workflow
   */
  async sync() {
    console.log('🚀 ByteByteGo Blog Sync Started\n');
    console.log(`Mode: ${this.dryRun ? '🧪 DRY RUN' : '✅ LIVE'}\n`);

    try {
      // Step 1: Fetch unprocessed emails
      console.log('📧 Step 1: Fetching emails from Gmail...\n');
      const emails = await this.gmailClient.getUnprocessedEmails();

      if (emails.length === 0) {
        console.log('✨ No new emails to process!\n');
        await this.printStats();
        return { success: true, processed: 0 };
      }

      // Step 2: Process each email
      console.log(`📝 Step 2: Processing ${emails.length} email(s)...\n`);

      for (const email of emails) {
        await this.processEmail(email);
      }

      // Step 3: Print summary
      console.log('\n' + '='.repeat(60));
      console.log('📊 Sync Summary');
      console.log('='.repeat(60));
      console.log(`Total Processed: ${this.stats.processed}`);
      console.log(`✓ Saved: ${this.stats.saved}`);
      console.log(`⊘ Skipped: ${this.stats.skipped}`);
      console.log(`✗ Failed: ${this.stats.failed}`);
      console.log('='.repeat(60));

      await this.printStats();

      return {
        success: this.stats.failed === 0,
        ...this.stats
      };

    } catch (error) {
      console.error('\n❌ Sync failed:', error.message);
      console.error(error.stack);
      return { success: false, error: error.message };
    }
  }

  /**
   * Process a single email
   * @param {Object} email - Email from Gmail
   */
  async processEmail(email) {
    this.stats.processed++;

    console.log(`\n[${ this.stats.processed}] Processing: ${email.subject}`);
    console.log('-'.repeat(60));

    try {
      // Parse blog metadata and HTML
      const blog = this.htmlParser.parseBlog(email);

      // Validate parsed data
      const validation = this.htmlParser.validate(blog);
      if (!validation.valid) {
        console.error(`✗ Validation failed: ${validation.errors.join(', ')}`);
        this.stats.failed++;
        return;
      }

      // Display blog info
      console.log(this.htmlParser.formatForDisplay(blog));

      // Save blog to file
      const saveResult = await this.fileManager.saveBlog(blog, this.dryRun);

      if (saveResult.success) {
        if (saveResult.dryRun) {
          this.stats.skipped++;
        } else {
          this.stats.saved++;

          // Mark email as processed (only in live mode)
          if (!this.dryRun) {
            await this.gmailClient.markAsProcessed(
              email.id,
              email.processedLabelId
            );
          }
        }
      } else if (saveResult.skipped) {
        console.log(`⊘ Skipped: ${saveResult.reason}`);
        this.stats.skipped++;

        // Still mark as processed to avoid reprocessing
        if (!this.dryRun) {
          await this.gmailClient.markAsProcessed(
            email.id,
            email.processedLabelId
          );
        }
      } else {
        console.error(`✗ Failed to save: ${saveResult.reason}`);
        this.stats.failed++;
      }

    } catch (error) {
      console.error(`✗ Error processing email: ${error.message}`);
      this.stats.failed++;
    }
  }

  /**
   * Print current blog statistics
   */
  async printStats() {
    console.log('\n📚 Current Blog Library Stats:');

    const stats = await this.fileManager.getStats();

    console.log(`Total blogs: ${stats.totalBlogs}`);
    console.log('By year:');

    const years = Object.keys(stats.byYear).sort();
    for (const year of years) {
      console.log(`  ${year}: ${stats.byYear[year]} blog(s)`);
    }

    console.log('');
  }
}

/**
 * Main execution
 */
async function main() {
  // Check for dry-run flag
  const dryRun = process.argv.includes('--dry-run') || process.argv.includes('-d');

  // Validate configuration
  console.log('⚙️  Validating configuration...\n');
  validateConfig();

  // Create orchestrator
  const orchestrator = new BlogSyncOrchestrator({ dryRun });

  // Run sync
  const result = await orchestrator.sync();

  // Exit with appropriate code
  process.exit(result.success ? 0 : 1);
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { BlogSyncOrchestrator };
