require('dotenv').config()
const express = require('express')
const JobHunt = require('./models/jobHunt.js')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const apis = require('./routers/api.js')
let moment = require('moment')

const { reqs, acts, locs } = require('./remoteLib/data.js');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: true })) // to support URL-encoded bodies

app.set('view engine', 'ejs'); // middleware & static files
app.use(express.static('public')); // sets default public folder for styles

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

async function init () {
    
    // Custom middleware for login
    const authenticate = (req, res, next) => {
        const { username, password } = req.body;
        if (username === process.env.USERNAME && password === process.env.PASSWORD) {
            res.cookie('authenticated', true, { maxAge: 900000, httpOnly: true });
            res.redirect('/list');
        } else {
            res.redirect('/login');
        }
    };

    app.get('/login', (req, res) => {
        res.render('login', { title:'Login', username:'Kumar', password:'K1kd89623!' });
    });
    
    app.get('/logout', (req, res) => {
        res.clearCookie("authenticated");
        res.redirect('/login');
    });
    
    app.post('/login', authenticate);
    
    //add
    app.get('/add', checkAuth, async (req, res) => {
        res.render('add', { title: 'Add Job', reqs, acts, locs });
    });
    
    //doadd 
    app.post('/doadd', checkAuth, async(req, res) => {
        await JobHunt.add(req.body);
        res.redirect('/');
    })
    
    //edit
    app.get('/edit', checkAuth, async (req, res) => {
        let job = await JobHunt.edit(req.query.id);
        res.render('edit', { title: 'Edit Job', job, reqs, acts, locs, moment });
    });
    
    //doedit 
    app.post('/doedit', checkAuth, async(req, res) => {
        await JobHunt.doedit(req.body);
        res.redirect('/');
    })
    
    //delete
    app.get('/delete', checkAuth, async (req, res) => {
        await JobHunt.delete(req.query.id);
        res.redirect('/list');
    });
    
    //list Sort
    //List >> period=>all; sort=>date/company/jobtitle
    app.get('/list/sort/:sortString', checkAuth, async (req, res) => {
        const jobList = await JobHunt.list('all', req.params.sortString);
        res.render('list', { title: 'Home', jobList, moment });
    });
    
    //list
    //List >> period=>all; sort=>date/company/jobtitle
    app.get('/list', checkAuth, async (req, res) => {
        const jobList = await JobHunt.list('all', 'date');
        res.render('list', { title: 'Home', jobList, moment });

    });
    
    //homepage (todays jobs)
    //Homepage >> period=>today; sort=>date
    app.get('/', checkAuth, async (req, res) => {
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
    //*****************API*********************/
    
    app.use('/api', apis)
}

JobHunt.connectDb().then(result => {
    app.listen(PORT);
    console.log(`Watching on port ${PORT}`);
    init();
}).catch(err => {
    console.log(err);
    process.exit(1);
});
