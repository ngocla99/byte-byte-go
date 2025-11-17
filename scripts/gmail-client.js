/**
 * Gmail API Client
 *
 * Handles all Gmail API operations:
 * - Authentication
 * - Email search and fetching
 * - Label management
 */

import { google } from 'googleapis';
import { config } from './config.js';

export class GmailClient {
  constructor() {
    this.oauth2Client = null;
    this.gmail = null;
  }

  /**
   * Initialize Gmail client with OAuth2 credentials
   */
  async authenticate() {
    this.oauth2Client = new google.auth.OAuth2(
      config.gmail.clientId,
      config.gmail.clientSecret,
      config.gmail.redirectUri
    );

    // Set credentials
    this.oauth2Client.setCredentials({
      refresh_token: config.gmail.refreshToken
    });

    // Initialize Gmail API client
    this.gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });

    console.log('✓ Authenticated with Gmail API');
  }

  /**
   * Search for emails matching the query
   * @param {string} query - Gmail search query
   * @param {number} maxResults - Maximum number of results
   * @returns {Promise<Array>} Array of message IDs
   */
  async searchEmails(query = config.gmail.searchQuery, maxResults = 50) {
    try {
      const response = await this.gmail.users.messages.list({
        userId: 'me',
        q: query,
        maxResults
      });

      const messages = response.data.messages || [];
      console.log(`✓ Found ${messages.length} email(s) matching query: "${query}"`);

      return messages;
    } catch (error) {
      console.error('Error searching emails:', error.message);
      throw error;
    }
  }

  /**
   * Get full email details including HTML body
   * @param {string} messageId - Gmail message ID
   * @returns {Promise<Object>} Email details
   */
  async getEmail(messageId) {
    try {
      const response = await this.gmail.users.messages.get({
        userId: 'me',
        id: messageId,
        format: 'full'
      });

      const message = response.data;
      const headers = message.payload.headers;

      // Extract metadata from headers
      const subject = headers.find(h => h.name === 'Subject')?.value || '';
      const from = headers.find(h => h.name === 'From')?.value || '';
      const date = headers.find(h => h.name === 'Date')?.value || '';
      const internalDate = message.internalDate;

      // Extract HTML body
      const htmlBody = this.extractHtmlBody(message.payload);

      return {
        id: messageId,
        subject,
        from,
        date,
        internalDate: new Date(parseInt(internalDate)),
        htmlBody,
        labelIds: message.labelIds || []
      };
    } catch (error) {
      console.error(`Error fetching email ${messageId}:`, error.message);
      throw error;
    }
  }

  /**
   * Extract HTML body from email payload
   * @param {Object} payload - Email payload
   * @returns {string} HTML content
   */
  extractHtmlBody(payload) {
    let htmlBody = '';

    // Helper function to recursively find HTML parts
    const findHtmlPart = (part) => {
      if (part.mimeType === 'text/html' && part.body?.data) {
        return Buffer.from(part.body.data, 'base64').toString('utf-8');
      }

      if (part.parts) {
        for (const subPart of part.parts) {
          const html = findHtmlPart(subPart);
          if (html) return html;
        }
      }

      return null;
    };

    htmlBody = findHtmlPart(payload);

    return htmlBody || '';
  }

  /**
   * Get or create a label
   * @param {string} labelName - Label name (e.g., "ByteByteGo/Processed")
   * @returns {Promise<string>} Label ID
   */
  async getOrCreateLabel(labelName) {
    try {
      // List all labels
      const response = await this.gmail.users.labels.list({
        userId: 'me'
      });

      const labels = response.data.labels || [];
      const existingLabel = labels.find(l => l.name === labelName);

      if (existingLabel) {
        return existingLabel.id;
      }

      // Create label if not exists
      const createResponse = await this.gmail.users.labels.create({
        userId: 'me',
        requestBody: {
          name: labelName,
          labelListVisibility: 'labelShow',
          messageListVisibility: 'show'
        }
      });

      console.log(`✓ Created label: ${labelName}`);
      return createResponse.data.id;
    } catch (error) {
      console.error(`Error managing label ${labelName}:`, error.message);
      throw error;
    }
  }

  /**
   * Add label to email
   * @param {string} messageId - Message ID
   * @param {string} labelId - Label ID
   */
  async addLabel(messageId, labelId) {
    try {
      await this.gmail.users.messages.modify({
        userId: 'me',
        id: messageId,
        requestBody: {
          addLabelIds: [labelId]
        }
      });

      console.log(`✓ Added label to message ${messageId}`);
    } catch (error) {
      console.error(`Error adding label to ${messageId}:`, error.message);
      throw error;
    }
  }

  /**
   * Check if email has a specific label
   * @param {Array<string>} labelIds - Email's label IDs
   * @param {string} targetLabelId - Label ID to check
   * @returns {boolean}
   */
  hasLabel(labelIds, targetLabelId) {
    return labelIds.includes(targetLabelId);
  }

  /**
   * Get unprocessed emails
   * @param {string} query - Search query
   * @param {number} maxResults - Maximum results
   * @returns {Promise<Array>} Array of email objects
   */
  async getUnprocessedEmails(query = config.gmail.searchQuery, maxResults = 50) {
    await this.authenticate();

    // Get or create processed label
    const processedLabelId = await this.getOrCreateLabel(config.gmail.labelProcessed);

    // Search for emails
    const messages = await this.searchEmails(query, maxResults);

    // Filter out already processed emails
    const unprocessedEmails = [];

    for (const message of messages) {
      const email = await this.getEmail(message.id);

      // Skip if already processed
      if (this.hasLabel(email.labelIds, processedLabelId)) {
        console.log(`⊘ Skipping processed email: ${email.subject}`);
        continue;
      }

      unprocessedEmails.push({
        ...email,
        processedLabelId
      });
    }

    console.log(`\n✓ Found ${unprocessedEmails.length} unprocessed email(s)\n`);

    return unprocessedEmails;
  }

  /**
   * Mark email as processed
   * @param {string} messageId - Message ID
   * @param {string} labelId - Processed label ID
   */
  async markAsProcessed(messageId, labelId) {
    await this.addLabel(messageId, labelId);
  }
}
