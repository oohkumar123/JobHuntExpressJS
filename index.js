const express = require('express');
const JobHunt = require('./models/jobHunt.js');
const app = express();
const PORT = process.env.PORT;
app.use(express.urlencoded({ extended: true })) // to support URL-encoded bodies


app.set('view engine', 'ejs'); // middleware & static files
app.use(express.static('public')); // sets default public folder for styles

async function init () {
    
    //list
    app.get('/', async (req, res) => {
        const jobList = await JobHunt.list();
        res.render('index', { title: 'Home', jobList });
    });
    //add
    app.get('/add', async (req, res) => {
        res.render('add', { title: 'Add Job' });
    });
    //doadd 
    app.post('/doadd', async(req, res) => {
        await JobHunt.add(req.body);
        res.redirect('/');
    })
      
    //delete
    //edit
    //admin
    
}

JobHunt.connectDb().then(result => {
    app.listen(PORT);
    console.log(`Watching on port ${PORT}`);
    init();
}).catch(err => {
    console.log(err);
    process.exit(1);
});
