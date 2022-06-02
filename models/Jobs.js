const moment = require('moment-timezone')
const mongoose = require('mongoose')
mongoose.connect("mongodb+srv://hairul:hairul123@crawler1.u1w6t.mongodb.net/?retryWrites=true&w=majority", { useNewUrlParser: true });

mongoose.connection
    .once('open', () => console.log('Connected'))
    .on("error", error => {
        console.log("Your Error", error);
    });

const JobsSchema = new mongoose.Schema({

    "jobName": {
        type: String,
        required: true
    },
    "country": {
        type: String,
        required: true
    },
    "company": {
        type: String,
        required: true
    },
    "jobType": {
        type: String,
        required: true
    },
    "salary": {
        type: String,
        required: true
    },
    "skills": {
        type: String,
        required: true
    },
    "jobDesc": {
        type: String,
        required: true
    },
    "jobReq": {
        type: String,
        required: true
    },
    "jobResponsibility": {
        type: String,
        required: true
    },
    "industry": {
        type: String,
        required: true
    },
    "crawledDate": {
        type: String,
        default: () => moment().utcOffset(+480).format()
    },
})

module.exports = mongoose.model('WebCrawler', JobsSchema)