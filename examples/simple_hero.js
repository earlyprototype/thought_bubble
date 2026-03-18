const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  
  // Use the chart library example instead - simpler, loads faster
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });
  
  const examplePath = path.resolve(__dirname, 'all_d3_charts.html');
  await page.goto(`file:///${examplePath.replace(/\\/g, '/')}`, { 
    waitUntil: 'networkidle0', 
    timeout: 60000 
  });
  
  // Wait for D3 to render
  await page.waitForSelector('svg', { timeout: 30000 });
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  await page.screenshot({ 
    path: path.resolve(__dirname, '..', 'hero_chart_library.png'),
    fullPage: false 
  });
  
  console.log('✓ Saved chart library screenshot');
  
  await browser.close();
})();
