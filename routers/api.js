const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const JobHunt = require('../models/jobHunt.js')

const app = express();

// middlewarew
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//api fetch
router.get('/typeAhead', async (req, res) => {
    const jobList = await JobHunt.list('all', 'date');
    res.send(jobList)
});
//api month
router.get('/month/:month', async (req, res) => {
    const jobList = await JobHunt.list('month', 'date', req);
    res.send(jobList)
});
//api archive
router.post('/archive', async({body:ids}, res) => {
    await JobHunt.archive(ids);
});

module.exports = router