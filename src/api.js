var fs = require('fs');
var https = require("https"); 
var express = require("express"); 
var bodyParser = require('body-parser');
var app = express(); 

//console.log(Date());
//process.exit();

app.use(bodyParser.json())

require('dotenv').config()

const GitHubHook = require('./service/github').GitHubHook;
const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHART_ID = process.env.TELEGRAM_CHAT_ID;

const gitHubHook = new GitHubHook(TOKEN, CHART_ID);

app.get('/', function(req,res){ 
  res.send("<h2>Your names not down, your not getting in! Peace. :) </h2>");
});  

app.post('/hook', async function(req,res){ 

  let secret = false;

  if (req.headers.secret === process.env.GH_SECRET) {
    secret = true;
  }

  if (!secret) {
    return res.send('<h2>Your names not down your not gettinh in!</h2>');
  }

  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  console.log(req.body);

  await gitHubHook.reqBody({ secret, body: req.body });

  // await gitHubHook.evresp('req.body');

  const logData = new Date().toISOString() +
    ' (' + ip + '): ' +
    JSON.stringify(req.body, null, 0) + '\n';

  fs.appendFile('/tmp/github_hook.log', logData, function (err) {
    if (err) throw err;
    res.send("<h2>POST /hook , Have a nice day -- token -> " + TOKEN + ' -- ' + CHART_ID + '</h2>');
  });
});

if (process.env.HTTPS) {
  const privateKey  = fs.readFileSync(
    process.env.TLS_KEY || '/home/gavin/certbot/config/live/vps00.eh7.co.uk/privkey.pem',
    'utf8'
  );
  const certificate = fs.readFileSync(
    process.env.TLS_CRT || '/home/gavin/certbot/config/live/vps00.eh7.co.uk/cert.pem',
    'utf8'
  );
  const chainLines = fs.readFileSync(
    process.env.TLS_CHAIN || '/home/gavin/certbot/config/live/vps00.eh7.co.uk/chain.pem',
    'utf8'
  ).split("\n");
  // console.log(chainLines);
  var cert = [];
  var ca = [];
  chainLines.forEach(function(line) {
    cert.push(line);
    if (line.match(/-END CERTIFICATE-/)) {
      ca.push(cert.join("\n"));
      cert = [];
    }
  });
  https.createServer({
    "key": privateKey,
    "cert": certificate,
    "ca": ca
  }, app).listen(3000, "0.0.0.0", function() { 
    console.log("TLS Server listening on port: 3000");
  });
} else {
  app.listen(3000,function(){ 
    console.log("Server listening on port: 3000");
  });
}

