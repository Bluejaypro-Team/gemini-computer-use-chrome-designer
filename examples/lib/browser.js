/**
 * Browser connection module.
 * Depends on: playwright (external), config.js (CDP_ENDPOINT constant).
 * Receives no implicit globals — the CDP endpoint is injected via config import.
 */

import { chromium } from 'playwright';
import { CDP_ENDPOINT } from './config.js';

/**
 * Connects to a Chrome instance running with --remote-debugging-port
 * and returns the browser handle and first active page.
 *
 * @param {string} [endpoint=CDP_ENDPOINT] - Override the CDP connection URL (useful for testing).
 * @returns {Promise<{browser: import('playwright').Browser, page: import('playwright').Page}>}
 */
export async function connectToChrome(endpoint = CDP_ENDPOINT) {
  let browser;
  try {
    browser = await chromium.connectOverCDP(endpoint);
    console.log(`Connected to remote Chrome instance at ${endpoint}.`);
  } catch (error) {
    console.error('Failed to connect to Chrome. Ensure you launched Chrome with:');
    console.error('chrome.exe --remote-debugging-port=9222 --user-data-dir="C:\\Users\\YourUsername\\ChromeRemoteProfile"');
    console.error('Error details:', error.message);
    process.exit(1);
  }

  const contexts = browser.contexts();
  if (contexts.length === 0) {
    console.error('No browser contexts found.');
    await browser.close();
    process.exit(1);
  }

  const pages = contexts[0].pages();
  if (pages.length === 0) {
    console.error('No active pages found in Chrome.');
    await browser.close();
    process.exit(1);
  }

  const page = pages[0]; // Interacts with the first active tab
  console.log(`Targeting active page: "${await page.title()}"`);

  return { browser, page };
}

/**
 * Captures a PNG screenshot of the page viewport and returns it as a base64
 * encoded string, or null on failure.
 *
 * @param {import('playwright').Page} page
 * @returns {Promise<string|null>}
 */
export async function captureScreenshot(page) {
  try {
    const screenshotBuffer = await page.screenshot({ type: 'png' });
    return screenshotBuffer.toString('base64');
  } catch (error) {
    console.error('Failed to capture page screenshot:', error.message);
    return null;
  }
}
