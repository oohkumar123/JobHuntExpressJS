const express = require('express')
const router = express.Router()
const JobHunt = require('../models/jobHunt.js')

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

module.exports = router