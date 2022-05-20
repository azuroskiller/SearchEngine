const puppeteer = require('puppeteer')
const fs = require("fs")
const { Cluster } = require('puppeteer-cluster')


async function start() {

    var name = ["Job Name"];
    var country = ["Country"];
    var company = ["Company Name"];
    var type = ["Job Type"];
    var salary = ["Salary"];
    var skills = ["Skills Require"];
    var desc = ["Job Description"];
    var req = ["Job Requirements"];
    var resp = ["Job Responsibility"];
    var industry = ["Industry"];

    const urls = [
        "https://startupjobs.asia/job/search?q=&job-list-dpl-page=1",
        "https://startupjobs.asia/job/search?q=&job-list-dpl-page=2",
        "https://startupjobs.asia/job/search?q=&job-list-dpl-page=3",
        "https://startupjobs.asia/job/search?q=&job-list-dpl-page=4",
        "https://startupjobs.asia/job/search?q=&job-list-dpl-page=5",
        "https://startupjobs.asia/job/search?q=&job-list-dpl-page=6",
        "https://startupjobs.asia/job/search?q=&job-list-dpl-page=7"
    ];

    const cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_PAGE,
        maxConcurrency: 7,
        monitor: true,
        timeout: 3000000,
        retryLimit: 5,
        puppeteerOptions: {
            headless: true,
            defaultViewport: null,
            userDataDir: "./tmp",
            args: ['--ignore-certificate-errors']
        },
    });

    cluster.on("taskerror", (err, data, willRetry) => {
        if (willRetry) {
            console.warn(`Encountered an error while crawling ${data}. ${err.message}\nThis job will be retried`);
        } else {
            console.log(`Error crawling ${data}: ${err.message}`);
        }

    });

    await cluster.task(async ({ page, data: url }) => {
        await page.goto(url, {
            waitUntil: "networkidle2",
            timeout: 3000000
        });;

        console.log('browsing page ' + url);

        for (var i = 1; i < 31; i++) {

            page.setDefaultNavigationTimeout(0);

            await page.waitForXPath("/html/body/div[1]/div[3]/div[1]/div/div[1]/ul/li[" + i + "]/div/div[1]/div/h5/a")
            var b = await page.$x("/html/body/div[1]/div[3]/div[1]/div/div[1]/ul/li[" + i + "]/div/div[1]/div/h5/a")
            await b[0].click();

            const elementsToFind = [
                { xpath: "/html/body/div[1]/div[3]/div[1]/div/div[1]/ul/li[" + i + "]/div/div[1]/div/h5/a", propName: 'job_name' },
                { xpath: '/html/body/div[1]/div[3]/div[2]/div[1]/div[2]/div/h6[2]/a', propName: 'country' },
                { xpath: "/html/body/div[1]/div[3]/div[1]/div/div[1]/ul/li[" + i + "]/div/div[1]/div/p[1]/a", propName: 'company' },
                { xpath: '/html/body/div[1]/div[3]/div[2]/div[2]/div[1]/div[2]/div[1]/div[3]/p', propName: 'job_type' },
                { xpath: '/html/body/div[1]/div[3]/div[2]/div[2]/div[1]/div[2]/div[1]/div[1]/p', propName: 'salary' },
                { xpath: '/html/body/div[1]/div[3]/div[2]/div[2]/div[1]/div[2]/div[1]/div[4]/p', propName: 'skills' },
                { xpath: '/html/body/div[1]/div[3]/div[2]/div[2]/div[1]/div[2]/div[2]/div[1]/div', propName: 'job_description' },
                { xpath: '/html/body/div[1]/div[3]/div[2]/div[2]/div[1]/div[2]/div[2]/div[3]/div', propName: 'job_requirement' },
                { xpath: '/html/body/div[1]/div[3]/div[2]/div[2]/div[1]/div[2]/div[2]/div[2]/div', propName: 'job_responsibility' },
                { xpath: '/html/body/div[1]/div[3]/div[2]/div[2]/div[1]/div[2]/div[1]/div[2]/p', propName: 'industry' },
                // ...
            ];

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

    });
    for (const url of urls) {
        await cluster.queue(url);
    }

    await cluster.idle();
    await cluster.close();

    var k = 1;
    name.forEach(function (a, index) {
        console.log(k, a);
        k++;
    });

    console.log(skills[10])



};

start()