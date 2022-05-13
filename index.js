const puppeteer = require ('puppeteer')
const fs = require("fs")


async function start (){

    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null
    });
    

    var name     = ["Job Name"];
    var country  = ["Country"];
    var company  = ["Company Name"];
    var type     = ["Job Type"];
    var salary   = ["Salary"];
    var skills   = ["Skills Require"];
    var desc     = ["Job Description"];
    var req      = ["Job Requirements"];
    var resp     = ["Job Responsibility"];
    var industry = ["Industry"];

    for (var j=1; j<5; j++){

        const page = await browser.newPage();
        page.setDefaultNavigationTimeout( 0 );
        
        await page.goto('https://startupjobs.asia/job/search?q=&job-list-dpl-page='+j, {
            waitUntil: "load",
            timeout: 0,
        });

        for ( var i=1; i < 31; i++){

            await page.waitForXPath("/html/body/div[1]/div[3]/div[1]/div/div[1]/ul/li["+i+"]/div/div[1]/div/h5/a")
            var b = await page.$x("/html/body/div[1]/div[3]/div[1]/div/div[1]/ul/li["+i+"]/div/div[1]/div/h5/a")
            await b[0].click();
            
            const elementsToFind = [
                { xpath: "/html/body/div[1]/div[3]/div[1]/div/div[1]/ul/li["+i+"]/div/div[1]/div/h5/a",  propName: 'job_name' },
                { xpath: '/html/body/div[1]/div[3]/div[2]/div[1]/div[2]/div/h6[2]/a',                    propName: 'country' },      
                { xpath: "/html/body/div[1]/div[3]/div[1]/div/div[1]/ul/li["+i+"]/div/div[1]/div/p[1]/a",propName: 'company' },
                { xpath: '/html/body/div[1]/div[3]/div[2]/div[2]/div[1]/div[2]/div[1]/div[3]/p',         propName: 'job_type' },
                { xpath: '/html/body/div[1]/div[3]/div[2]/div[2]/div[1]/div[2]/div[1]/div[1]/p',         propName: 'salary' },
                { xpath: '/html/body/div[1]/div[3]/div[2]/div[2]/div[1]/div[2]/div[1]/div[4]/p',         propName: 'skills' },
                { xpath: '/html/body/div[1]/div[3]/div[2]/div[2]/div[1]/div[2]/div[2]/div[1]/div',       propName: 'job_description' },
                { xpath: '/html/body/div[1]/div[3]/div[2]/div[2]/div[1]/div[2]/div[2]/div[3]/div',       propName: 'job_requirement' },
                { xpath: '/html/body/div[1]/div[3]/div[2]/div[2]/div[1]/div[2]/div[2]/div[2]/div',       propName: 'job_responsibility' },
                { xpath: '/html/body/div[1]/div[3]/div[2]/div[2]/div[1]/div[2]/div[1]/div[2]/p',         propName: 'industry' },
                // ...
            ];
            /*const elementsToFind2 = [
                { xpath: '/html/body/div[1]/div[3]/div[2]/div[2]/div[1]/div[3]/div[1]/div[1]/p/a',      propName2: 'website' },
                { xpath: '/html/body/div[1]/div[3]/div[2]/div[2]/div[1]/div[3]/div[2]/div[1]/div',      propName2: 'about' },
                // ...
            ];*/

            var results = {};
            

            for (var { xpath, propName } of elementsToFind) {
                await page.waitForXPath(xpath);
                var [el] = await page.$x(xpath);
                results[propName] = !el ? 'Not Found' : await (await el.getProperty('textContent')).jsonValue();     
            }    

            name.push(results['job_name']);
            country.push(results['country']);
            company.push(results['company']);
            type.push(results['job_type']);
            salary.push(results['salary']);
            skills.push(results['skills']);
            desc.push(results['job_description']);
            req.push(results['job_requirement']);
            resp.push(results['job_responsibility']);
            industry.push(results['industry']);

            //await page.evaluate(() => document.querySelector("#suj-single-jobdetail-wrapper > div.detail-body > div.row > div.col.s12.tabs-wrapper.suj-company-review-tabs-wrapper > ul > li:nth-child(2) > a").click())            
        }
        await page.close();
    }

    var k=1;
    name.forEach(function(a, index) {
        console.log(k, a);
        k++;
    });

    console.log(company[10])
    
  
    await browser.close();
}

start()