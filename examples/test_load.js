const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: false }); // Show browser
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });
  
  const examplePath = path.resolve(__dirname, 'product_roadmap_2026.html');
  console.log('Loading:', examplePath);
  
  await page.goto(`file:///${examplePath.replace(/\\/g, '/')}`, { 
    waitUntil: 'networkidle0', 
    timeout: 60000 
  });
  
  console.log('Waiting 10 seconds for full render...');
  await new Promise(resolve => setTimeout(resolve, 10000));
  
  console.log('Page loaded, press Ctrl+C when you see it rendered properly');
  
  // Keep browser open
  await new Promise(() => {});
})();
