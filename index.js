const puppeteer = require ('puppeteer')
const fs = require("fs/promises")

async function start (){

    const browser = await puppeteer.launch()
    const page = await browser.newPage();
    for (var j=1; j<3; j++){
        await page.goto("https://startupjobs.asia/job/search?q=&job-list-dpl-page="+j, {timeout: 3000000})

        for ( var i=1; i < 31; i++){
            var b = (await page.$x("/html/body/div[1]/div[3]/div[1]/div/div[1]/ul/li["+i+"]/div/div[1]/div/h5/a"))[0]
            await b.click()

            const elementsToFind = [
                { xpath: '/html/body/div[1]/div[3]/div[2]/div[1]/div[1]/h5',                       propName: 'job_name' },
                { xpath: '/html/body/div[1]/div[3]/div[2]/div[1]/div[2]/div/h6[2]/a',              propName: 'country' },      
                { xpath: '/html/body/div[1]/div[3]/div[2]/div[1]/div[2]/div/h6[1]/a',              propName: 'company' },
                { xpath: '/html/body/div[1]/div[3]/div[2]/div[2]/div[1]/div[2]/div[1]/div[3]/p',   propName: 'job_type' },
                { xpath: '/html/body/div[1]/div[3]/div[2]/div[2]/div[1]/div[2]/div[1]/div[1]/p',   propName: 'salary' },
                { xpath: '/html/body/div[1]/div[3]/div[2]/div[2]/div[1]/div[2]/div[1]/div[4]/p',   propName: 'skills' },
                { xpath: '/html/body/div[1]/div[3]/div[2]/div[2]/div[1]/div[2]/div[2]/div[1]/div', propName: 'job_description' },
                { xpath: '/html/body/div[1]/div[3]/div[2]/div[2]/div[1]/div[2]/div[2]/div[3]/div', propName: 'job_requireement' },
                { xpath: '/html/body/div[1]/div[3]/div[2]/div[2]/div[1]/div[2]/div[2]/div[2]/div', propName: 'job_responsibility' },
                { xpath: '/html/body/div[1]/div[3]/div[2]/div[2]/div[1]/div[2]/div[1]/div[2]/p',   propName: 'industry' },
                // ...
            ];
            /*const elementsToFind2 = [
                { xpath: '/html/body/div[1]/div[3]/div[2]/div[2]/div[1]/div[3]/div[1]/div[1]/p/a', propName2: 'website' },
                { xpath: '/html/body/div[1]/div[3]/div[2]/div[2]/div[1]/div[3]/div[2]/div[1]/div', propName2: 'about' },
                // ...
            ];*/

            const results = {};

            for (const { xpath, propName } of elementsToFind) {
                await page.waitForXPath(xpath);
                const [el] = await page.$x(xpath);
                results[propName] = !el ? 'Not Found' : await (await el.getProperty('textContent')).jsonValue();
                console.log(propName + results[propName]);      
            }    
            //await page.evaluate(() => document.querySelector("#suj-single-jobdetail-wrapper > div.detail-body > div.row > div.col.s12.tabs-wrapper.suj-company-review-tabs-wrapper > ul > li:nth-child(2) > a").click())
        }
    }
    await browser.close()
}

start()