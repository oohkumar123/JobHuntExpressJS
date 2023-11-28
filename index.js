const express = require('express');
const JobHunt = require('./models/jobHunt.js');
const { reqs, acts, locs } = require('./remoteLib/data.js');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: true })) // to support URL-encoded bodies

app.set('view engine', 'ejs'); // middleware & static files
app.use(express.static('public')); // sets default public folder for styles

async function init () {
    
    //add
    app.get('/add', async (req, res) => {
        console.log('%cLocation: %o', 'color: green;font-size:12px', '/add');
        res.render('add', { title: 'Add Job', reqs, acts, locs });
    });
    //doadd 
    app.post('/doadd', async(req, res) => {
        console.log('%cLocation: %o', 'color: green;font-size:12px', '/doadd');
        await JobHunt.add(req.body);
        res.redirect('/');
    })
    //edit
    app.get('/edit', async (req, res) => {
        console.log('%cLocation: %o', 'color: green;font-size:12px', '/edit');
        let job = await JobHunt.edit(req.query.id);
        res.render('edit', { title: 'Edit Job', job, reqs, acts, locs });
    });
    //doedit 
    app.post('/doedit', async(req, res) => {
        console.log('%cLocation: %o', 'color: green;font-size:12px', '/doedit');
        await JobHunt.doedit(req.body);
        res.redirect('/');
    })
    //delete
    app.get('/delete', async (req, res) => {
        console.log('%cLocation: %o', 'color: green;font-size:12px', '/delete');
        await JobHunt.delete(req.query.id);
        res.redirect('/');
    });
    //list Sort
    //List >> period=>all; sort=>date/company/jobtitle
    app.get('/list/sort/:sortString', async (req, res) => {
        console.log('%cLocation: %o', 'color: green;font-size:12px', '/list?sort');
        const jobList = await JobHunt.list('all', req.params.sortString);
        res.render('list', { title: 'Home', jobList });
    });
    //list
    //List >> period=>all; sort=>date/company/jobtitle
    app.get('/list', async (req, res) => {
        console.log('%cLocation: %o', 'color: green;font-size:12px', '/list');
        const jobList = await JobHunt.list('all', 'date');
        res.render('list', { title: 'Home', jobList });
    });
    //homepage (todays jobs)
    //Homepage >> period=>today; sort=>date
    app.get('/', async (req, res) => {
        console.log('%cLocation: %o', 'color: green;font-size:12px', '/');
        const jobList = await JobHunt.list('today', 'date');
        //res.send(jobList);
        res.render('index', { title: 'Home', jobList });
    });

    //*****************API*********************/
    //api fetch
    app.get('/api/typeAhead', async (req, res) => {
        console.log('%cLocation: %o', 'color: green;font-size:12px', '/api fetch');

        const jobList = await JobHunt.list('month', 'date', req.query);
        res.send(jobList)
    });
    //api month
    app.get('/api/month/:month', async (req, res) => {
        console.log('%cLocation: %o', 'color: green;font-size:12px', '/api month');
        console.log('%creq.params.month: %o', 'color: red;font-size:12px', req.params.month);

        const jobList = await JobHunt.list('month', 'date', req);
        res.send(jobList)
    });
}

JobHunt.connectDb().then(result => {
    app.listen(PORT);
    console.log(`Watching on port ${PORT}`);
    init();
}).catch(err => {
    console.log(err);
    process.exit(1);
});
