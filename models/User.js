const moment = require('moment-timezone')
const mongoose = require('mongoose')
mongoose.connect("mongodb+srv://hairul:hairul123@crawler1.u1w6t.mongodb.net/?retryWrites=true&w=majority", { useNewUrlParser: true });

mongoose.connection
    .once('open', () => console.log('Connected'))
    .on("error", error => {
        console.log("Your Error", error);
    });

const UserSchema = new mongoose.Schema({

    "userID": {
        type: String
    },
    "email": {
        type: String,
        required: true
    },
    "name": {
        type: String,
        required: true
    },
    "password": {
        type: String,
        required: true
    },
    "postition": {
        type: String,
        required: true
    },
    "createdOn": {
        type: String,
        default: () => moment().utcOffset(+480).format()
    },
    "userLevel": {
        type: Int32,
        default: '0'
    },
    verified: {
        type: Boolean,
        default: false
    },
    "confirmToken": {
        type: String,
        default: ''
    },
    "verifier": {
        type: Boolean,
        default: false
    },
})

module.exports = mongoose.model('WebCrawler', UserSchema)