const puppeteer = require('puppeteer');

async function testDepthChart() {
    const browser = await puppeteer.launch({ 
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    // Console log'larını yakala
    page.on('console', msg => {
        console.log('BROWSER LOG:', msg.text());
    });
    
    // Sayfaya git
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    
    // Sayfanın yüklenmesini bekle
    await page.waitForSelector('#counter-depth-total', { timeout: 10000 });
    
    // 5 saniye bekle ve logları kontrol et
    await page.waitForTimeout(5000);
    
    console.log('=== TEST SONUÇLARI ===');
    
    // Derinlik bar elementlerinin durumunu kontrol et
    const depthBars = ['0-10', '10-30', '30-70', '70plus'];
    for (const range of depthBars) {
        const barElement = await page.$(`#depth-${range}`);
        const countElement = await page.$(`#depth-${range}-count`);
        
        if (barElement) {
            const barStyle = await page.evaluate(el => el.style.cssText, barElement);
            const barHeight = await page.evaluate(el => el.style.height, barElement);
            console.log(`📊 Bar ${range}:`, {
                exists: true,
                height: barHeight,
                style: barStyle
            });
        } else {
            console.log(`❌ Bar ${range}: bulunamadı`);
        }
        
        if (countElement) {
            const countText = await page.evaluate(el => el.textContent, countElement);
            console.log(`🔢 Count ${range}:`, countText);
        } else {
            console.log(`❌ Count ${range}: bulunamadı`);
        }
    }
    
    // Sayfadan ekran görüntüsü al
    await page.screenshot({ path: 'depth_chart_debug.png' });
    
    await browser.close();
}

testDepthChart().catch(console.error);