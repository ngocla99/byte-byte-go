/**
 * File Manager
 *
 * Handles file system operations for saving blog posts
 */

import { mkdir, writeFile, access, readdir } from 'fs/promises';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { config } from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class FileManager {
  constructor() {
    // Resolve base path relative to script location
    this.basePath = resolve(__dirname, config.paths.blogsBase);
  }

  /**
   * Get the full path for a blog file
   * @param {number} year - Publication year
   * @param {string} filename - File name
   * @returns {string} Full file path
   */
  getFilePath(year, filename) {
    return join(this.basePath, year.toString(), filename);
  }

  /**
   * Get the directory path for a year
   * @param {number} year - Publication year
   * @returns {string} Directory path
   */
  getYearDirectory(year) {
    return join(this.basePath, year.toString());
  }

  /**
   * Check if file already exists
   * @param {string} filePath - Full file path
   * @returns {Promise<boolean>}
   */
  async fileExists(filePath) {
    try {
      await access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Ensure directory exists, create if not
   * @param {string} dirPath - Directory path
   */
  async ensureDirectory(dirPath) {
    try {
      await access(dirPath);
    } catch {
      await mkdir(dirPath, { recursive: true });
      console.log(`✓ Created directory: ${dirPath}`);
    }
  }

  /**
   * Save blog HTML to file
   * @param {Object} blog - Parsed blog data
   * @param {boolean} dryRun - If true, don't actually write file
   * @returns {Promise<Object>} Result object
   */
  async saveBlog(blog, dryRun = config.dryRun) {
    const { year, filename, html } = blog;

    // Get paths
    const yearDir = this.getYearDirectory(year);
    const filePath = this.getFilePath(year, filename);

    // Check if file already exists
    const exists = await this.fileExists(filePath);
    if (exists) {
      return {
        success: false,
        reason: 'File already exists',
        filePath,
        skipped: true
      };
    }

    // Dry run mode - don't actually write
    if (dryRun) {
      console.log(`[DRY RUN] Would save to: ${filePath}`);
      return {
        success: true,
        reason: 'Dry run - not saved',
        filePath,
        dryRun: true
      };
    }

    try {
      // Ensure year directory exists
      await this.ensureDirectory(yearDir);

      // Write file
      await writeFile(filePath, html, 'utf-8');

      console.log(`✓ Saved: ${filePath}`);

      return {
        success: true,
        filePath,
        year,
        filename
      };
    } catch (error) {
      console.error(`✗ Error saving ${filename}:`, error.message);
      return {
        success: false,
        reason: error.message,
        filePath,
        error
      };
    }
  }

  /**
   * Get all existing blog files for a year
   * @param {number} year - Publication year
   * @returns {Promise<Array<string>>} Array of filenames
   */
  async getExistingBlogs(year) {
    const yearDir = this.getYearDirectory(year);

    try {
      const files = await readdir(yearDir);
      return files.filter(f => f.endsWith('.html'));
    } catch {
      return [];
    }
  }

  /**
   * Get statistics about saved blogs
   * @returns {Promise<Object>} Statistics object
   */
  async getStats() {
    const stats = {
      totalBlogs: 0,
      byYear: {}
    };

    try {
      const years = await readdir(this.basePath);

      for (const year of years) {
        // Skip non-directory entries
        const yearPath = join(this.basePath, year);
        try {
          const files = await readdir(yearPath);
          const htmlFiles = files.filter(f => f.endsWith('.html'));

          stats.byYear[year] = htmlFiles.length;
          stats.totalBlogs += htmlFiles.length;
        } catch {
          // Skip if not a directory
        }
      }
    } catch (error) {
      console.error('Error getting stats:', error.message);
    }

    return stats;
  }

  /**
   * Format file path relative to project root for display
   * @param {string} filePath - Absolute file path
   * @returns {string} Relative path
   */
  formatPath(filePath) {
    const projectRoot = resolve(__dirname, '..');
    return filePath.replace(projectRoot, '').replace(/^\//, '');
  }

  /**
   * Validate blog before saving
   * @param {Object} blog - Parsed blog data
   * @returns {Object} Validation result
   */
  validateBlog(blog) {
    const errors = [];

    if (!blog.year || typeof blog.year !== 'number') {
      errors.push('Invalid year');
    }

    if (!blog.filename || !blog.filename.endsWith('.html')) {
      errors.push('Invalid filename');
    }

    if (!blog.html || typeof blog.html !== 'string') {
      errors.push('Invalid HTML content');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}
