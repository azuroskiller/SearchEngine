const puppeteer = require ('puppeteer')
const fs = require("fs")


async function start (){

    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null,
        args: [ '--ignore-certificate-errors' ]
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

    for (var j=1; j<4; j++){

        const page = await browser.newPage();
        page.setDefaultNavigationTimeout( 0 );
        
        await page.goto('https://startupjobs.asia/job/search?q=&job-list-dpl-page='+j, {
            waitUntil: "networkidle2",
            timeout: 3000000
        });

        console.log('browsing page '+j);

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

    await browser.close();

    const browser2 = await puppeteer.launch({
        headless: true,
        defaultViewport: null,
        args: [ '--ignore-certificate-errors' ]
    });

   for (var j=4; j<7; j++){

        const page2 = await browser2.newPage();
        page2.setDefaultNavigationTimeout( 0 );
        
        await page2.goto('https://startupjobs.asia/job/search?q=&job-list-dpl-page='+j, {
            waitUntil: "networkidle2",
            timeout: 3000000
        });

        console.log('browsing page '+j);

        for ( var i=1; i < 31; i++){

            await page2.waitForXPath("/html/body/div[1]/div[3]/div[1]/div/div[1]/ul/li["+i+"]/div/div[1]/div/h5/a")
            var b = await page2.$x("/html/body/div[1]/div[3]/div[1]/div/div[1]/ul/li["+i+"]/div/div[1]/div/h5/a")
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

            var results = {};
            
            for (var { xpath, propName } of elementsToFind) {
                await page2.waitForXPath(xpath);
                var [el] = await page2.$x(xpath);
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
        await page2.close();
    }
    
    await browser2.close();
 
    const browser3 = await puppeteer.launch({
        headless: true,
        defaultViewport: null,
        args: [ '--ignore-certificate-errors' ]
    });

    for (var j=7; j<8; j++){

        const page3 = await browser3.newPage();
        page3.setDefaultNavigationTimeout( 0 );
        
        await page3.goto('https://startupjobs.asia/job/search?q=&job-list-dpl-page='+j, {
            waitUntil: "networkidle2",
            timeout: 3000000
        });

        console.log('browsing page '+j);

        for ( var i=1; i < 13; i++){

            await page3.waitForXPath("/html/body/div[1]/div[3]/div[1]/div/div[1]/ul/li["+i+"]/div/div[1]/div/h5/a")
            var b = await page3.$x("/html/body/div[1]/div[3]/div[1]/div/div[1]/ul/li["+i+"]/div/div[1]/div/h5/a")
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

            var results = {};

            for (var { xpath, propName } of elementsToFind) {
                await page3.waitForXPath(xpath);
                var [el] = await page3.$x(xpath);
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
        await page3.close();
    }

    await browser3.close();

    var k=1;
    name.forEach(function(a, index) {
        console.log(k, a);
        k++;
    });

    console.log(skills[10])
    
}

start()