var express = require("express"); 
var bodyParser = require('body-parser');
var app = express(); 
var fs = require('fs');

//console.log(Date());
//process.exit();

app.use(bodyParser.json())

require('dotenv').config()

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHART_ID = process.env.TELEGRAM_CHAT_ID;

app.get('/', function(req,res){ 
  res.send("<h2>Hi there, thanks for checking out my work. The server that is responding to you is developed using 'express.js' module in node.js. Please type 'localhost:3000/one' in your URL search bar to view the next page.</h2>");
});  

app.get('/one', function(req,res){ 
  res.send("<h2>Have a nice day</h2>");
});

app.post('/hook', function(req,res){ 
  console.log(req.body);

//  const logData = new Date().getTime() +
  const logData = new Date().toISOString() +
    ': ' +
    JSON.stringify(req.body, null, 0) + '\n';

  fs.appendFile('/tmp/github_hook.log', logData, function (err) {
    if (err) throw err;
    res.send("<h2>POST /hook , Have a nice day -- toekn -> " + TOKEN + ' -- ' + CHART_ID + '</h2>');
  });
});

app.listen(3000,function(){ 
  console.log("Server listening on port: 3000");
});
