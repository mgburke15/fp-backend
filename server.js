//fetch in front end to get from server
//post request in server
//install nodeMailer
//express send email

const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
//import firebase from "firebase";

const app = express();

//package used to parse json
app.use(bodyParser.json());


//express middleware- makes secure connection between frontend + backend
app.use(cors());

app.get('/', function(req, res) {
    res.send('response from server');
});

//email credentials
var transport = {
    service: 'gmail',
    auth: {
        user: 'cs4241.ctrlf@gmail.com',
        pass: ''
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
    var content = `name: ${name} \n email: ${contact} \n skills: ${skills} \n message: ${comments}`;


    var mail = {
        from: 'CTRL-F Apply',
        to: sendTo,  //TODO change to poster's email
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