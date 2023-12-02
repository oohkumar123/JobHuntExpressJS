const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const JobHunt = require('../models/jobHunt.js')
let moment = require('moment')

const { reqs, acts, locs } = require('../remoteLib/data');

const app = express();

// middlewarew
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//add
router.get('/add', checkAuth, async (req, res) => {
    res.render('add', { title: 'Add Job', reqs, acts, locs });
});

//doadd 
router.post('/doadd', checkAuth, async(req, res) => {
    await JobHunt.add(req.body);
    res.redirect('/');
})

//edit
router.get('/edit', checkAuth, async (req, res) => {
    let job = await JobHunt.edit(req.query.id);
    res.render('edit', { title: 'Edit Job', job, reqs, acts, locs, moment });
});

//doedit 
router.post('/doedit', checkAuth, async(req, res) => {
    await JobHunt.doedit(req.body);
    res.redirect('/list');
})

//delete
router.get('/delete', checkAuth, async (req, res) => {
    await JobHunt.delete(req.query.id);
    res.redirect('/list');
});

//list Sort
//List >> period=>all; sort=>date/company/jobtitle
router.get('/list/sort/:sortString', checkAuth, async (req, res) => {
    const jobList = await JobHunt.list('all', req.params.sortString);
    res.render('list', { title: 'Home', jobList, moment });
});

//list
//List >> period=>all; sort=>date/company/jobtitle
router.get('/list', checkAuth, async (req, res) => {
    const jobList = await JobHunt.list('all', 'date');
    res.render('list', { title: 'Home', jobList, moment });

});

//homepage (todays jobs)
//Homepage >> period=>today; sort=>date
router.get('/', checkAuth, async (req, res) => {
    const jobList = await JobHunt.list('today', 'date');
    res.render('index', { title: 'Home', jobList, moment });
    
});

function checkAuth(req, res, next) {
    if (req.cookies.authenticated) {
        next();
    } else {
        res.redirect('/login');
    }
}

module.exports = router