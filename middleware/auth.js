const express = require('express')
const app = express();

const cookieParser = require('cookie-parser')
app.use(cookieParser());


const auth = (req, res, next) => {
    const { username, password } = req.body;
    if (username === process.env.USERNAME && password === process.env.PASSWORD) {
        res.cookie('authenticated', true, { maxAge: 900000, httpOnly: true });
        res.redirect('/list');
    } else {
        res.redirect('/login');
    }
//console.log(res);
};
exports.auth = auth; // here i am once 