const puppeteer = require('puppeteer')
const fs = require("fs")
const schedule = require('node-schedule');

const express = require('express')
const path = require('path')
const app = express()

const mongoose = require('mongoose')
const JobsSchema = require('./models/Jobs')
mongoose.connect("mongodb+srv://hairul:hairul123@crawler1.u1w6t.mongodb.net/?retryWrites=true&w=majority");


async function start() {

    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null,
        args: ['--ignore-certificate-errors']
    });

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
    var website = ["Website"];
    var about = ["About"];

    for (var j = 1; j < 7; j++) {

        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(0);

        await page.goto('https://startupjobs.asia/job/search?q=&job-list-dpl-page=' + j, {
            waitUntil: "networkidle2",
            timeout: 3000000
        });

        console.log('browsing page ' + j);

        for (var i = 1; i < 31; i++) {

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
                results[propName] = results[propName].replace(/\s+/g, ' ')
                results[propName] = results[propName].replaceAll('|', ',')
                results[propName] = results[propName].replaceAll('JOB DESCRIPTION ', '')
                results[propName] = results[propName].replaceAll('JOB REQUIREMENT ', '')
                results[propName] = results[propName].replaceAll('JOB RESPONSIBILITY ', '')
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
/*
            const elementsToFind2 = [
                { xpath: '/html/body/div[1]/div[3]/div[2]/div[2]/div[1]/div[3]/div[1]/div[1]/p/a', propName2: 'website' },
                { xpath: '/html/body/div[1]/div[3]/div[2]/div[2]/div[1]/div[3]/div[2]/div[1]/div', propName2: 'about' },
                // ...
            ];

            await page.evaluate(() => document.querySelector("#suj-single-jobdetail-wrapper > div.detail-body > div.row > div.col.s12.tabs-wrapper.suj-company-review-tabs-wrapper > ul > li:nth-child(2) > a").click())

            for (var { xpath, propName2 } of elementsToFind2) {
                await page.waitForXPath(xpath);
                var [el] = await page.$x(xpath);
                results[propName2] = !el ? 'Not Found' : await (await el.getProperty('textContent')).jsonValue();
                results[propName2] = results[propName2].replace(/\s+/g, ' ')
                results[propName2] = results[propName2].replaceAll('|', ',')
            }

            website.push(results['website']);
            about.push(results['industry']);
*/          console.log(i);
        }
        await page.close();
    }

    await browser.close();
/*
    const browser2 = await puppeteer.launch({
        headless: true,
        defaultViewport: null,
        args: ['--ignore-certificate-errors']
    });

    for (var j = 4; j < 7; j++) {

        const page2 = await browser2.newPage();
        page2.setDefaultNavigationTimeout(0);

        await page2.goto('https://startupjobs.asia/job/search?q=&job-list-dpl-page=' + j, {
            waitUntil: "networkidle2",
            timeout: 3000000
        });

        console.log('browsing page ' + j);

        for (var i = 1; i < 31; i++) {

            await page2.waitForXPath("/html/body/div[1]/div[3]/div[1]/div/div[1]/ul/li[" + i + "]/div/div[1]/div/h5/a")
            var b = await page2.$x("/html/body/div[1]/div[3]/div[1]/div/div[1]/ul/li[" + i + "]/div/div[1]/div/h5/a")
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
            const elementsToFind2 = [
                { xpath: '/html/body/div[1]/div[3]/div[2]/div[2]/div[1]/div[3]/div[1]/div[1]/p/a', propName2: 'website' },
                { xpath: '/html/body/div[1]/div[3]/div[2]/div[2]/div[1]/div[3]/div[2]/div[1]/div', propName2: 'about' },
                // ...
            ];

            var results = {};

            for (var { xpath, propName } of elementsToFind) {
                await page2.waitForXPath(xpath);
                var [el] = await page2.$x(xpath);
                results[propName] = !el ? 'Not Found' : await (await el.getProperty('textContent')).jsonValue();
                results[propName] = results[propName].replace(/\s+/g, ' ')
                results[propName] = results[propName].replaceAll('|', ',')
                results[propName] = results[propName].replaceAll('JOB DESCRIPTION ', '')
                results[propName] = results[propName].replaceAll('JOB REQUIREMENT ', '')
                results[propName] = results[propName].replaceAll('JOB RESPONSIBILITY ', '')
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

            await page.waitForXPath("/html/body/div[1]/div[3]/div[2]/div[2]/div[1]/div[1]/ul/li[2]/a")
            var c = await page.$x("/html/body/div[1]/div[3]/div[2]/div[2]/div[1]/div[1]/ul/li[2]/a")
            await c[0].click();

            for (var { xpath, propName } of elementsToFind2) {
                await page.waitForXPath(xpath);
                var [el] = await page.$x(xpath);
                results[propName] = !el ? 'Not Found' : await (await el.getProperty('textContent')).jsonValue();
                results[propName] = results[propName].replace(/\s+/g, ' ')
                results[propName] = results[propName].replaceAll('|', ',')
            }

            website.push(results['website']);
            about.push(results['industry']);

            //await page.evaluate(() => document.querySelector("#suj-single-jobdetail-wrapper > div.detail-body > div.row > div.col.s12.tabs-wrapper.suj-company-review-tabs-wrapper > ul > li:nth-child(2) > a").click())            
        }
        await page2.close();
    }

    await browser2.close();
*/
    /*
    var k = 1;
    name.forEach(function (a, index) {
        console.log(k, a);
        k++;
    });*/

    for (var t = 1; t < 180; t++) {

        var newJobs = new JobsSchema({
            "jobID": '1',
            "jobName": name[t],
            "country": country[t],
            "company": company[t],
            "jobType": type[t],
            "salary": salary[t],
            "skills": skills[t],
            "jobDesc": desc[t],
            "jobReq": req[t],
            "jobResponsibility": resp[t],
            "industry": industry[t],

        })
        newJobs.save(function (err, result) {
            if (err) {
                console.log(err);
            }
        })
    }

    console.log("All Data Recorded")
    /*
    app.post('/api/create', async (req, res) => {
        const record = req.body
        console.log(record)

        // * CREATE (_C_RUD)
        const response = await JobsSchema.create(record)

        console.log(response)

        res.json({ status: 'ok' })
    })*/

}

start()

//schedule the crawler to run every 3rd day of the week at 9.05 a.m
//const crawling = schedule.scheduleJob('5 9 * * */3', () =>{
//    start()
//})