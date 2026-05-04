import puppeteer from 'puppeteer';

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  console.log('Navigating to deployed billing page...');
  await page.goto('https://care-path-catalogue-main.vercel.app/login', { waitUntil: 'networkidle0' });
  
  await page.type('input#username', 'SRI');
  await page.type('input#password', 'Dhanvantari1025');
  await page.evaluate(() => { document.querySelector('button[type="submit"]').click(); });
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  await page.goto('https://care-path-catalogue-main.vercel.app/billing', { waitUntil: 'networkidle0' });
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Trigger openEdit with a mock invoice by manipulating React state or dispatching an event
  // Bypassing the UI to just open the modal directly!
  console.log('Opening edit modal...');
  await page.evaluate(() => {
    // Because clicking radix ui is tricky, let's just trigger a click on the first table row's edit button
    const tables = document.querySelectorAll('table');
    if(tables.length > 0) {
      const rows = tables[0].querySelectorAll('tbody tr');
      if (rows.length > 0) {
        const buttons = rows[0].querySelectorAll('button');
        if(buttons.length > 1) {
          buttons[1].click(); // This is the pencil icon
        }
      }
    }
  });

  await new Promise(resolve => setTimeout(resolve, 2000));

  // If the edit modal opened, click 'Update Invoice'
  console.log('Attempting to click Update Invoice...');
  await page.evaluate(() => {
    // Find button containing "Update Invoice"
    const buttons = Array.from(document.querySelectorAll('[role="dialog"] button'));
    const updateBtn = buttons.find(b => b.textContent.includes('Update'));
    if (updateBtn) updateBtn.click();
  });

  // Wait exactly enough for the toast transition to hit the middle of the screen
  await new Promise(resolve => setTimeout(resolve, 800));

  console.log('Taking screenshot of the success toast...');
  await page.screenshot({ path: 'C:\\Users\\NANDA\\.gemini\\antigravity\\brain\\0f95e2a1-70eb-417b-a979-dd0f9bc3df1c\\success_toast.png' });

  console.log('Done!');
  await browser.close();
})();
