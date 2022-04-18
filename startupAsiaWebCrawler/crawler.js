//crawler libraries

const cheerio = require('cheerio')
const url = 'https://startupjobs.asia/job/search?q=&job-list-dpl-page=1';
const puppeteer = require('puppeteer');

let scraped_headlines =[];

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();


try{
    await page.goto('https://startupjobs.asia/job/search?q=&job-list-dpl-page=1', {timeout: 300000});

    let bodyHTML = await page.evaluate(() => document.body.innerHTML);
    let $ = cheerio.load(bodyHTML);
    let list_headlines = $('a[href*="job/search?q=&job-list-dpl-page=1"]>div')
    list_headlines.each((index, element) => {
        job_name = $(element).find('h5').contents().text()
        scraped_headlines.push({
            'Name': job_name
        })
    });

    
}catch(err){
    console.log(err);
}

await browser.close();
console.log(scraped_headlines)

})();