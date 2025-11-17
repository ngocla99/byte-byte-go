#!/usr/bin/env node

/**
 * Gmail OAuth2 Authentication Setup
 *
 * This script helps you generate a refresh token for Gmail API access.
 *
 * Prerequisites:
 * 1. Create a project in Google Cloud Console
 * 2. Enable Gmail API
 * 3. Create OAuth2 credentials (Desktop app)
 * 4. Download credentials and set GMAIL_CLIENT_ID and GMAIL_CLIENT_SECRET in .env
 *
 * Run: npm run auth
 */

import { google } from 'googleapis';
import http from 'http';
import { URL } from 'url';
import open from 'open';
import { config } from '../config.js';

const oauth2Client = new google.auth.OAuth2(
  config.gmail.clientId,
  config.gmail.clientSecret,
  config.gmail.redirectUri
);

/**
 * Generate authorization URL and start local server to receive the code
 */
async function authorize() {
  return new Promise((resolve, reject) => {
    // Generate the url that will be used for authorization
    const authorizeUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: config.gmail.scopes,
      prompt: 'consent' // Force consent to get refresh token
    });

    console.log('🔐 Gmail API Authorization\n');
    console.log('Opening browser for authorization...');
    console.log('If browser doesn\'t open, visit this URL:\n');
    console.log(authorizeUrl);
    console.log('\n');

    // Create local server to receive OAuth callback
    const server = http.createServer(async (req, res) => {
      try {
        const url = new URL(req.url, config.gmail.redirectUri);

        if (url.pathname === '/oauth2callback') {
          const code = url.searchParams.get('code');

          if (!code) {
            throw new Error('No authorization code received');
          }

          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(`
            <html>
              <body style="font-family: system-ui; padding: 40px; text-align: center;">
                <h1 style="color: #10b981;">✓ Authorization Successful!</h1>
                <p>You can close this window and return to the terminal.</p>
              </body>
            </html>
          `);

          // Exchange code for tokens
          const { tokens } = await oauth2Client.getToken(code);

          server.close();
          resolve(tokens);
        }
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Authentication failed. Check the terminal for details.');
        server.close();
        reject(error);
      }
    });

    server.listen(3000, () => {
      // Try to open browser automatically
      open(authorizeUrl).catch(() => {
        console.log('Could not open browser automatically.');
      });
    });

    // Timeout after 5 minutes
    setTimeout(() => {
      server.close();
      reject(new Error('Authorization timeout (5 minutes)'));
    }, 5 * 60 * 1000);
  });
}

/**
 * Main execution
 */
async function main() {
  try {
    // Validate basic config
    if (!config.gmail.clientId || !config.gmail.clientSecret) {
      console.error('❌ Error: Missing Gmail API credentials\n');
      console.error('Please set the following in your .env file:');
      console.error('  - GMAIL_CLIENT_ID');
      console.error('  - GMAIL_CLIENT_SECRET\n');
      console.error('Get credentials from: https://console.cloud.google.com/\n');
      process.exit(1);
    }

    console.log('Starting OAuth2 authorization flow...\n');

    const tokens = await authorize();

    console.log('\n✅ Authorization successful!\n');
    console.log('Add this to your .env file:\n');
    console.log(`GMAIL_REFRESH_TOKEN=${tokens.refresh_token}\n`);

    if (!tokens.refresh_token) {
      console.log('⚠️  Warning: No refresh token received.');
      console.log('This might happen if you\'ve already authorized this app.');
      console.log('Try revoking access at: https://myaccount.google.com/permissions');
      console.log('Then run this script again.\n');
    }

    console.log('You can also use these additional tokens:');
    console.log(`Access Token: ${tokens.access_token?.substring(0, 20)}...`);
    console.log(`Expires In: ${tokens.expiry_date ? new Date(tokens.expiry_date).toLocaleString() : 'N/A'}\n`);

  } catch (error) {
    console.error('\n❌ Authorization failed:', error.message);
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
