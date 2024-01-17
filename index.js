const express = require('express')
const JobHunt = require('./models/jobHunt')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const pages = require('./routers/pages')
const apis = require('./routers/api')
const {auth} = require('./middleware/auth')

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: true })) // to support URL-encoded bodies

app.set('view engine', 'ejs'); // middleware & static files
app.use(express.static('public')); // sets default public folder for styles

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieParser());

async function init () {
    
    app.get('/login', (req, res) => {
        res.render('login', { title:'Login', username:'Kumar', password:'K1kd89623!' });
    });
    
    app.get('/logout', (req, res) => {
        res.clearCookie("authenticated");
        res.redirect('/login');
    });
    
    app.post('/login', auth);
   
    //*****************API*********************/
    
    app.use('/', pages)
    app.use('/api', apis)
}

JobHunt.connectDb().then(result => {
    app.listen(PORT);
    console.log(`Watching on port ${PORT}`);
    init();
}).catch(err => {
    console.log(err);
    process.exit(1);
});// once again we find ourselves here

