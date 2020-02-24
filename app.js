const express = require('express');
const path = require('path');
const script = require('./script');
const mysql = require('mysql')
var plotly = require('plotly')("dylan.fernando", ");
const nodemailer = require('nodemailer');

const app = express();
global.obj = [];


//Set up database credentials
const con = mysql.createConnection({
    host: "database-1.c8hh58sn0vpu.us-east-1.rds.amazonaws.com",
    user: "admin",
    password: "helloworld",
    database: "Assignment1"
});

//Websites email credentials
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user:'testcloudwebsiteemail@gmail.com',
      pass:
  
    }
});

//Connect to the database and insert the input
con.connect(function(err) {
    if (err) throw err;
});


app.use(express.static(__dirname + '/public'));

app.use(express.urlencoded({ extended: false }));


//Handler for when the server is connected to
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));

});


//Handler for time stamp inputs 
app.use('/timelogs', function (req, res) {
    var number = req.body.time;
    console.log(number);

    
    var sql = "INSERT INTO time (timestamp) VALUES ('"+ number +"')";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
    });

    
    //Redirect the client to a page with this response
    res.send("New Time log Added!");

      
});


app.use('/taskadd', function (req, res) {
    var subject = req.body.task;
    console.log(subject);

    //Connect to the database and insert the input
   
    
    var sql = "INSERT INTO tasks (taskname) VALUES ('"+ subject +"')";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
    });

    
    //Redirect the client to a page with this response
    res.send("New Task log Added!");

      
});

app.use('/taskdelete', function (req, res) {
    var subject = req.body.task;
    console.log(subject);

    //Connect to the database and insert the input
   
    
    var sql = "DELETE FROM tasks WHERE taskname = ('"+ subject +"')";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record deleted");
    });

    
    //Redirect the client to a page with this response
    res.send("Task Deleted");

      
});

app.get('/taskresults', function (req, res) {
    obj = [0];

    con.query("SELECT * FROM tasks", function (err, result, fields){
        if (err) throw err;

        Object.keys(result).forEach(function(key) {
            var row = result[key];
            console.log(row.taskname);
            obj.push(row.taskname);
            
            
        });
        let results = '<table>';
        for (let el in obj) {
            results += "<tr><td>" + el + "</td><td>" + obj[el] + "</td></tr>";
        }
        results += '</table>';
        
        res.send(results);
        
    });
    
   
})

app.get('/timeresults', function (req, res) {
    obj = [0];

    con.query("SELECT * FROM time", function (err, result, fields){
        if (err) throw err;

        Object.keys(result).forEach(function(key) {
            var row = result[key];
            console.log(row.timestamp);
            obj.push(row.timestamp);
            
            
        });
        let results = '<table>';
        for (let el in obj) {
            results += "<tr><td>" + el + "</td><td>" + obj[el] + "</td></tr>";
        }
        results += '</table>';
        
        res.send(results);
        
    });
    
   
})
//Get graph of the time logs using plotly
app.use('/progression', function (req, res) {
    obj = [0];

    con.query("SELECT * FROM time", function (err, result, fields){
        if (err) throw err;

        Object.keys(result).forEach(function(key) {
            var row = result[key];
            console.log(row.timestamp);
            obj.push(row.timestamp);  
        });
        var trace1 = {
            y: obj,
            type:"scatter"
        };
        var data = trace1;
        var graphOptions = {filename: "Time Progression", fileopt: "overwrite"};
            
        plotly.plot(data, graphOptions, function (err, msg) {
            
            res.send(msg.url);
        });


    });
      

});

app.use('/email', function (req, res) {

    //Variables pulled from form
    var recipient = req.body.to;
    var subject = req.body.subject;
    var context = req.body.context;

    let mailOptions = {
        from: 'testcloudwebsiteemail@gmail.com',
        to: recipient,
        subject: subject,
        text: context 
    };

    transporter.sendMail(mailOptions, function(err, data) {
        if(err){
            console.log("Error sending email: ", err);
        }
        else{
            console.log("Email Sent!!");
        }
    });
    
    res.send("Success!");
      
      

});


app.listen(9000)

