// setup middleware
const express = require('express')
const router = express.Router()

// crawler libraries
const cheerio = require('cheerio')
const axios = require('axios')

// scrape multiple pages
router.post('/', async (req, res) => {
  try {
    let result = {}
    let url = "https://startupjobs.asia/job/search?q=&job-list-dpl-page=1"

    console.log(url)

      // create a container
      result[url] = {}

      // result[url]["homepage"] = $.text()
      console.log("Scraping", url, "...")
      let job_name
      let homepage_html = await crawlHTML(url.toLowerCase())
      if (typeof homepage_html === 'string') {
        result[url]["error"] = homepage_html
        result[url]["job_name"] = homepage_html
        job_name = homepage_html
      } else {
        job_name = getText(homepage_html)

        result[url]["job_name"] = job_name
      }
      console.log("Done", url)

    // send crawling result back to client
    res.json(result)
  } catch (err) {
    // send error to message back to client
    console.log(err)
    res.json(err)
  }
})

async function crawlHTML(url) {
  try {
    // // normal crawling
    // const { data } = await axios.get(url, { timeout: 60 * 1000 })

    // // crawling using RocketScrape API
    const { data } = await axios.get(process.env.rocketAPI + url, { timeout: 60 * 1000 })
    const $ = await cheerio.load(data)
    return $
  } catch (err) {
    if (err.code === undefined)
      err.code = err.message
      console.log("ERROR: " + err.code)
  }
}

function getText($) {
  try {
    if ($ === undefined)
      console.log("$ not defined")
    let plainText = $.text().trim().replace(/^\s*/gm, "")
    if (plainText === undefined)
    console.log("Text not found")
    return plainText
  } catch (err) {
    if (err.code === undefined)
      err.code = err.message
      console.log("ERROR: " + err.code)
  }
}

module.exports = router