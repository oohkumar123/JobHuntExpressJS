const express = require('express');
const JobHunt = require('./models/jobHunt.js');

const app = express();
const PORT = process.env.PORT || 3000

app.set('view engine', 'ejs'); // middleware & static files
app.use(express.static('public')); // sets default public folder for styles

async function init () {
    
    //list
    app.get('/', async (req, res) => {
        const jobList = await JobHunt.list();
        res.render('index', { title: 'Home', jobList });
    });
    //add
    
}

JobHunt.connectDb().then(result => {
    app.listen(PORT);
    console.log(`Watching on port ${PORT}`);
    init();
}).catch(err => {
    console.log(err);
    process.exit(1);
});
