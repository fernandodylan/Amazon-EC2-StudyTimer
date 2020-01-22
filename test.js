var mysql = require('mysql');
const nodemailer = require('nodemailer');
/*
var con = mysql.createConnection({
  host: 'database-1.c8hh58sn0vpu.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: 'helloworld',
  database: 'Assignment1'
})
*/

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user:'testcloudwebsiteemail@gmail.com',
    pass:'100553363Pby!'

  }

});

let mailOptions = {
  from: 'testcloudwebsiteemail@gmail.com',
  to: "fernandodyln@gmail.com",
  subject: "Testing",
  text: "It worked!" 
};

transporter.sendMail(mailOptions, function(err, data) {
  if(err){
    console.log("Error sending email: ", err);
  }
  else{
    console.log("Email Sent!!");
  }



});





/*
  con.connect(function(err) {
    if (err) throw err;
    // if connection is successful

    var sql = "INSERT INTO time (timestamp) VALUES (2)";
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record inserted");
    });

    con.query("SELECT * FROM time", function (err, result, fields) {
      // if any error while executing above query, throw error
      if (err) throw err;
      // if there is no error, you have the result
      // iterate for all the rows in result
      Object.keys(result).forEach(function(key) {
        var row = result[key];
        console.log(row.timestamp)
        con.close();
      });
    });
  });
*/