const puppeteer = require('puppeteer')
const schedule = require('node-schedule');

const express = require('express')
const path = require('path')
const app = express()

const mongoose = require('mongoose')
const JobsSchema = require('./models/Jobs');

//Connecting to database
mongoose.connect("mongodb+srv://hairul:hairul123@crawler1.u1w6t.mongodb.net/?retryWrites=true&w=majority", { useMongoClient: true }, (err) => {
    if (err) throw err;
    console.log("Connected to Database");
});


async function start() {

//Opening a browser 
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

//Crawl through 5 pages, the last page contain less than 30 jobs, so it is skipped
    for (var j = 1; j < 6; j++) {

        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(0);

        //Opening the website, timeout is set to 5 min because the website is heavy
        await page.goto('https://startupjobs.asia/job/search?q=&job-list-dpl-page=' + j, {
            waitUntil: "networkidle2",
            timeout: 3000000
        });

        console.log('browsing page ' + j);

        //Scraping for the 30 jobs information in the website
        for (var i = 1; i < 31; i++) {

            //This code is use to skip a job if it has a different style than the others for example: *New or *Hot
            if((j == 1) && (i == 12))
            {
                continue;
            }

            await page.waitForXPath("/html/body/div[1]/div[3]/div[1]/div/div[1]/ul/li[" + i + "]/div/div[1]/div/h5/a");
            var b = await page.$x("/html/body/div[1]/div[3]/div[1]/div/div[1]/ul/li[" + i + "]/div/div[1]/div/h5/a");
            await b[0].click();

            //Give the website a couple of minutes to load the contents to avoid scraping the same information as the job before
            await delay(5000);

            const elementsToFind = [
                { xpath: "/html/body/div[1]/div[3]/div[1]/div/div[1]/ul/li[" + i + "]/div/div[1]/div/h5/a", propName: 'job_name' },
                { xpath: "/html/body/div[1]/div[3]/div[2]/div[1]/div[2]/div/h6[2]/a", propName: 'country' },
                { xpath: "/html/body/div[1]/div[3]/div[1]/div/div[1]/ul/li[" + i + "]/div/div[1]/div/p[1]/a", propName: 'company' },
                { xpath: '/html/body/div[1]/div[3]/div[2]/div[2]/div[1]/div[2]/div[1]/div[3]/p', propName: 'job_type' },
                { xpath: '/html/body/div[1]/div[3]/div[2]/div[2]/div[1]/div[2]/div[1]/div[1]/p', propName: 'salary' },
                { xpath: '/html/body/div[1]/div[3]/div[2]/div[2]/div[1]/div[2]/div[1]/div[4]/p', propName: 'skills' },
                { xpath: '/html/body/div[1]/div[3]/div[2]/div[2]/div[1]/div[2]/div[2]/div[1]/div', propName: 'job_description' },
                { xpath: '/html/body/div[1]/div[3]/div[2]/div[2]/div[1]/div[2]/div[2]/div[3]/div', propName: 'job_requirement' },
                { xpath: '/html/body/div[1]/div[3]/div[2]/div[2]/div[1]/div[2]/div[2]/div[2]/div', propName: 'job_responsibility' },
                { xpath: '/html/body/div[1]/div[3]/div[2]/div[2]/div[1]/div[2]/div[1]/div[2]/p', propName: 'industry' },
            ];

            var results = {};

            //Removing not required content
            for (var { xpath, propName } of elementsToFind) {

                var [el] = await page.$x(xpath);
                results[propName] = !el ? 'Not Found' : await (await el.getProperty('textContent')).jsonValue();
                results[propName] = results[propName].replace(/\s+/g, ' ')
                results[propName] = results[propName].replaceAll('|', ',')
                results[propName] = results[propName].replaceAll('JOB DESCRIPTION', '')
                results[propName] = results[propName].replaceAll('JOB REQUIREMENT', '')
                results[propName] = results[propName].replaceAll('JOB RESPONSIBILITY', '')

            }

            //Inserting the job into the array
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

            console.log(i);
        }

    }
    
    function delay(time) {
        return new Promise(function(resolve) { 
            setTimeout(resolve, time)
        });
     }

    //Saving the job into the databse
    const saveData = async () => {

        var count = 0;

        for (var t = 1; t < 150; t++) {

            //Check if job already exist
            var searching = await JobsSchema.findOne({
                jobName: name[t],
                company: company[t]
            });

            if (!searching) {

                count = count + 1;

                var newJobs = new JobsSchema({
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

                });
                await newJobs.save();
            }
        }
        if(count == 0 )
        {
            console.log("No new data found");
        }
        else{
            console.log(count + " new data found.");
            console.log("All Data Recorded");
        }
    };

    saveData();

    //mongoose.connection.close();

}

start()

//Schedule the crawler to run every 3rd day of the week at 9.05 a.m
//const crawling = schedule.scheduleJob('5 9 * * */3', () =>{
//    start()
//})