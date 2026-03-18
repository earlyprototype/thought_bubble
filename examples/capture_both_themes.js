const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  
  // Dark version
  console.log('Capturing dark theme...');
  const darkPage = await browser.newPage();
  await darkPage.setViewport({ width: 1600, height: 1000 });
  await darkPage.goto('file:///C:/Users/Fab2/Desktop/AI/_tools/_thought_bubble/test_outputs/visualization_1773800211884.html', { 
    waitUntil: 'networkidle0', 
    timeout: 60000 
  });
  await darkPage.waitForSelector('svg', { timeout: 30000 });
  await new Promise(resolve => setTimeout(resolve, 5000));
  await darkPage.screenshot({ 
    path: 'C:/Users/Fab2/Desktop/AI/_tools/_thought_bubble/hero_dark.png',
    fullPage: true
  });
  console.log('✓ Dark theme saved');
  
  // Light version
  console.log('Capturing light theme...');
  const lightPage = await browser.newPage();
  await lightPage.setViewport({ width: 1600, height: 1000 });
  await lightPage.goto('file:///C:/Users/Fab2/Desktop/AI/_tools/_thought_bubble/test_outputs/visualization_1773800220617.html', { 
    waitUntil: 'networkidle0', 
    timeout: 60000 
  });
  await lightPage.waitForSelector('svg', { timeout: 30000 });
  await new Promise(resolve => setTimeout(resolve, 5000));
  await lightPage.screenshot({ 
    path: 'C:/Users/Fab2/Desktop/AI/_tools/_thought_bubble/hero_light.png',
    fullPage: true
  });
  console.log('✓ Light theme saved');
  
  await browser.close();
  console.log('✓ Both hero images ready');
})();
