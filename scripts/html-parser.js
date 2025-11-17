/**
 * HTML Parser
 *
 * Extracts and cleans HTML content from ByteByteGo emails
 */

import * as cheerio from 'cheerio';
import { format, parse } from 'date-fns';
import { config } from './config.js';

export class HtmlParser {
  /**
   * Parse email and extract blog metadata
   * @param {Object} email - Email object from GmailClient
   * @returns {Object} Parsed blog data
   */
  parseBlog(email) {
    const { subject, htmlBody, internalDate } = email;

    // Extract title from subject
    const title = this.extractTitle(subject);

    // Determine publication date (use email's internal date)
    const publicationDate = internalDate;

    // Extract and clean HTML content
    const cleanedHtml = this.cleanHtml(htmlBody);

    // Generate filename
    const filename = this.generateFilename(title, publicationDate);

    // Determine year for folder organization
    const year = publicationDate.getFullYear();

    return {
      title,
      date: publicationDate,
      year,
      filename,
      html: cleanedHtml,
      rawSubject: subject
    };
  }

  /**
   * Extract clean title from email subject
   * @param {string} subject - Email subject line
   * @returns {string} Clean title
   */
  extractTitle(subject) {
    // Remove "ByteByteGo" prefix if present
    let title = subject.replace(/^ByteByteGo:?\s*/i, '');

    // Remove date suffix (e.g., " - Aug 14", " - August 14")
    title = title.replace(/\s*[-–—]\s*(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2}(?:,\s*\d{4})?$/i, '');

    // Clean up extra whitespace
    title = title.trim();

    return title;
  }

  /**
   * Clean and prepare HTML content for saving
   * @param {string} html - Raw HTML from email
   * @returns {string} Cleaned HTML
   */
  cleanHtml(html) {
    if (!html) return '';

    const $ = cheerio.load(html);

    // Remove tracking pixels and analytics
    $('img[src*="track"]').remove();
    $('img[width="1"][height="1"]').remove();
    $('img[style*="display:none"]').remove();

    // Remove email-specific elements
    $('style').remove(); // Remove inline styles (optional)
    $('script').remove();
    $('[class*="unsubscribe"]').remove();
    $('[class*="footer"]').remove();

    // Find the main content area
    // ByteByteGo emails typically have content in specific divs
    const mainContent = $('div[dir="auto"]').first();

    if (mainContent.length > 0) {
      return mainContent.html() || html;
    }

    // Fallback: return body content
    return $('body').html() || html;
  }

  /**
   * Generate filename in format: YYMMDD Title.html
   * @param {string} title - Blog title
   * @param {Date} date - Publication date
   * @returns {string} Filename
   */
  generateFilename(title, date) {
    // Format date as YYMMDD
    const dateStr = format(date, 'yyMMdd');

    // Clean title for filename
    const cleanTitle = this.sanitizeFilename(title);

    return `${dateStr} ${cleanTitle}.html`;
  }

  /**
   * Sanitize title for use in filename
   * @param {string} title - Original title
   * @returns {string} Safe filename
   */
  sanitizeFilename(title) {
    return title
      .replace(/[<>:"/\\|?*]/g, '') // Remove invalid characters
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  }

  /**
   * Validate parsed blog data
   * @param {Object} blog - Parsed blog data
   * @returns {Object} Validation result
   */
  validate(blog) {
    const errors = [];

    if (!blog.title) {
      errors.push('Missing title');
    }

    if (!blog.html || blog.html.length < 100) {
      errors.push('HTML content too short or missing');
    }

    if (!blog.filename) {
      errors.push('Could not generate filename');
    }

    if (!blog.year || blog.year < 2020 || blog.year > 2030) {
      errors.push('Invalid year');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Format blog data for display
   * @param {Object} blog - Parsed blog data
   * @returns {string} Formatted string
   */
  formatForDisplay(blog) {
    return `
📄 Title: ${blog.title}
📅 Date: ${format(blog.date, 'MMM dd, yyyy')}
📁 Year: ${blog.year}
📝 Filename: ${blog.filename}
📏 HTML Length: ${blog.html.length} characters
    `.trim();
  }
}
