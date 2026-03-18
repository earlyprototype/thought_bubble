const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 1000 });
  
  const examplePath = 'C:/Users/Fab2/Desktop/AI/_tools/_thought_bubble/test_outputs/visualization_1773800015233.html';
  await page.goto(`file:///${examplePath.replace(/\\/g, '/')}`, { 
    waitUntil: 'networkidle0', 
    timeout: 60000 
  });
  
  // Wait for D3 to render the Sankey
  await page.waitForSelector('svg', { timeout: 30000 });
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  await page.screenshot({ 
    path: 'C:/Users/Fab2/Desktop/AI/_tools/_thought_bubble/hero_sankey.png',
    fullPage: true
  });
  
  console.log('✓ Saved Sankey hero screenshot');
  
  await browser.close();
})();
