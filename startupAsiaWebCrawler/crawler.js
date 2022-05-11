const puppeteer = require ('puppeteer')
const fs = require("fs/promises")

async function start (){

    const browser = await puppeteer.launch()
    const page = await browser.newPage();

    let i = 0;
    
    await page.goto("https://startupjobs.asia/job/search?q=&job-list-dpl-page=1", {timeout: 3000000})

    const b = (await page.$x("/html/body/div[1]/div[3]/div[1]/div/div[1]/ul/li[1]/div/div[1]/div/h5/a"))[0]
    b.click()

    const [el1] = await page.$x('//*[@id="suj-single-jobdetail-wrapper"]/div[1]/div[1]/h5');
    const job_name = await (await el1.getProperty('textContent')).jsonValue();

    const [el2] = await page.$x('//*[@id="suj-single-jobdetail-wrapper"]/div[1]/div[2]/div/h6[1]/a');
    const company = await (await el2.getProperty('textContent')).jsonValue();

    const [el3] = await page.$x('/html/body/div[1]/div[3]/div[2]/div[2]/div[1]/div[2]/div[1]/div[3]/p');
    const txt = await el3.getProperty('textContent');
    const job_type = await txt.jsonValue();

    const [el4] = await page.$x('/html/body/div[1]/div[3]/div[2]/div[2]/div[1]/div[2]/div[1]/div[1]/p');
    const salary = await (await el4.getProperty('textContent')).jsonValue();
    
    const [el5] = await page.$x('/html/body/div[1]/div[3]/div[2]/div[2]/div[1]/div[2]/div[1]/div[4]/p');
    const skills = await (await el5.getProperty('textContent')).jsonValue();

    const [el6] = await page.$x('/html/body/div[1]/div[3]/div[2]/div[2]/div[1]/div[2]/div[2]/div[1]/div');
    const job_description = await (await el6.getProperty('textContent')).jsonValue();

    const [el7] = await page.$x('/html/body/div[1]/div[3]/div[2]/div[2]/div[1]/div[2]/div[2]/div[3]/div');
    const job_requirement = await (await el7.getProperty('textContent')).jsonValue();

    const [el8] = await page.$x('/html/body/div[1]/div[3]/div[2]/div[2]/div[1]/div[2]/div[2]/div[2]/div');
    const job_responsibility = await (await el8.getProperty('textContent')).jsonValue();

    const [el9] = await page.$x('/html/body/div[1]/div[3]/div[2]/div[2]/div[1]/div[2]/div[1]/div[2]/p');
    const industry = await (await el9.getProperty('textContent')).jsonValue();

    const [el10] = await page.$x('//*[@id="suj-single-jobdetail-wrapper"]/div[1]/div[2]/div/h6[2]/a');
    const country = await (await el10.getProperty('textContent')).jsonValue();

    await page.evaluate(() => document.querySelector("#suj-single-jobdetail-wrapper > div.detail-body > div.row > div.col.s12.tabs-wrapper.suj-company-review-tabs-wrapper > ul > li:nth-child(2) > a").click())

    const [el11] = await page.$x('/html/body/div[1]/div[3]/div[2]/div[2]/div[1]/div[3]/div[1]/div[1]/p/a');
    const website = await (await el11.getProperty('textContent')).jsonValue();

    const [el12] = await page.$x('/html/body/div[1]/div[3]/div[2]/div[2]/div[1]/div[3]/div[2]/div[1]/div');
    const about = await (await el12.getProperty('textContent')).jsonValue();
  
    await fs.writeFile("txt/jobs.txt", job_name)
    await fs.writeFile("txt/company.txt", company)
    await fs.writeFile("txt/job type.txt", job_type)
    await fs.writeFile("txt/salary.txt", salary)
    await fs.writeFile("txt/skills.txt", skills)
    await fs.writeFile("txt/job description.txt", job_description)
    await fs.writeFile("txt/job requirement.txt", job_requirement)
    await fs.writeFile("txt/job responsibility.txt", job_responsibility)
    await fs.writeFile("txt/industry.txt", industry)
    await fs.writeFile("txt/country.txt", country)
    await fs.writeFile("txt/website.txt",website)
    await fs.writeFile("txt/about.txt",about)


    await browser.close()
}

start()