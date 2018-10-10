//fetch in front end to get from server
//post request in server
//install nodeMailer
//express send email

const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
//const creds = require('./config');
const aws = require('aws-sdk');

const app = express();

//package used to parse json
app.use(bodyParser.json());

var creds = new aws.S3({
    username: process.env.USR,
    password: process.env.PWD
});

console.log(creds.username);

//express middleware- makes secure connection between frontend + backend
app.use(cors());

app.get('/', function(req, res) {
    res.send('response from server');
});

//email credentials
var transport = {
    service: 'gmail',
    auth: {
        user: JSON.stringify(creds.username),
        pass: JSON.stringify(creds.password)
    }
};

var transporter = nodemailer.createTransport(transport);

transporter.verify((error, success) => {
    if (error) {
        console.log(error);
    } else {
        console.log('Server is ready to take messages');
    }
});

//send email
app.post('/apply', (req, res) => {
    var sendTo = req.body.sendTo;
    var name = req.body.name;
    var skills = req.body.skills;
    var contact = req.body.contact;
    var comments = req.body.comments;
    var position = req.body.position;
    var organizer = req.body.organizer;
    var content =
        `Hello ${organizer},\n 
            ${name} has applied to the ${position} position from your post on Ctrl-F. \n 
            Here is their application: \n 
            - Name: ${name} \n
            - Email: ${contact} \n 
            - Skills: ${skills} \n 
            - Message: ${comments}`;


    var mail = {
        from: 'CTRL-F Apply',
        to: sendTo,
        subject: 'Someone has applied to your posting on Ctrl-F!',
        text: content
    }
    transporter.sendMail(mail, (err, data) => {
        if (err) {
            res.json({
                msg: 'fail'
            })
        } else {
            res.json({
                msg: 'success'
            })
        }
    })
});

app.listen(8080, () => console.log('Server started...'));

//module.exports = app;