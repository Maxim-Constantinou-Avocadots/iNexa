/* Shared configuration for the verification harness.

   CHROME_PATH  a Chromium/Chrome binary. Leave unset to use Playwright's own
                download. In the container this build was made in, the browser
                is preinstalled and must be pointed at explicitly:
                  export CHROME_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome
   PAGE_URL     the page under test. Defaults to index.html beside this repo,
                so the harness runs with no server. Point it at the deployed
                URL to verify a release instead. */

const path = require('path');

const launchOpts = process.env.CHROME_PATH
  ? { executablePath: process.env.CHROME_PATH }
  : {};

const PAGE_URL =
  process.env.PAGE_URL ||
  'file://' + path.resolve(__dirname, '..', 'index.html');

module.exports = { launchOpts, PAGE_URL };
