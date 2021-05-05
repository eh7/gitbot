require('dotenv').config()
global.Promise = require('bluebird');
NTBA_FIX_319=1

const Bot = require('node-telegram-bot-api');
/*
const {
    INPUT_STATUS: ipstatus,
    TELEGRAM_BOT_TOKEN: tgtoken,
    TELEGRAM_CHAT_ID: chatid,
    INPUT_IU_TITLE: ititle,// Issue title
    INPUT_IU_NUM: inum,// Issue Number
    INPUT_IU_ACTOR: iactor,// Issue made by
    INPUT_IU_BODY: ibody,// Issue Body
    INPUT_PR_NUM: pnum,// PR Number
    INPUT_PR_STATE: prstate,// PR Opened, reponed or closed
    INPUT_PR_TITLE: ptitle,// PR Title
    INPUT_PR_BODY: pbody,// Body of the PR
    GITHUB_EVENT_NAME: ghevent,// Name of the trigger event
    GITHUB_REPOSITORY: repo,// Repository the trigger was made from
    GITHUB_ACTOR: ghactor,// User who triggered the action
    GITHUB_SHA: sha,// Commit ID
    GITHUB_WORKFLOW: ghwrkflw// Workflow Name
} = process.env;
*/

class GitHubHook {

  /*
  _chat_id;
  _token;
  _bot;
  */

  constructor(TOKEN, CHAT_ID) {
    this._chat_id = CHAT_ID;
    this._token = TOKEN;
    this._bot = new Bot(TOKEN, {polling: true});
    console.log('gitHubHook initialized :: %o :: %o', TOKEN, CHAT_ID);
  }

  async reqBody(body) {
    // var note = body;
    const jsonBody = JSON.stringify(body, null, 4);
    const note = `
      eh7.co.uk - notification bot

      ${jsonBody}
 
      [inline URL](https://eh7.co.uk)
      gav@eh7.co.uk
    `;
    console.log(note);
    this._bot.sendMessage(this._chat_id, note, {parse_mode : "markdown"})
    // this._bot.sendMessage(this._chat_id, JSON.stringify(body, null, 4), {parse_mode : "Markdown"})
    console.log('Request Body Note Sent: %o', body);
    return Promise.resolve({ status:200, message: 'Request Body Note Sent'});
  }

  // Function to return the response for the specific trigger
  async evresp(gevent) {
    var note = '';
    switch (gevent) {
      case "issues":
        // return `
        note = `
❗️❗️❗️❗️❗️❗️

Issue ${prstate}

Issue Title and Number  : ${ititle} | #${inum}

Commented or Created By : \`${iactor}\`

Issue Body : *${ibody}*

[Link to Issue](https://github.com/${repo}/issues/${inum})
[Link to Repo ](https://github.com/${repo}/)
[Build log here](https://github.com/${repo}/commit/${sha}/checks)`

      case "pull_request":
        // return `
        note = `
🔃🔀🔃🔀🔃🔀
PR ${prstate} 

PR Number:      ${pnum}

PR Title:       ${ptitle}

PR Body:        *${pbody}*

PR By:          ${ghactor}

[Link to Issue](https://github.com/${repo}/pull/${pnum})
[Link to Repo ](https://github.com/${repo}/)
[Build log here](https://github.com/${repo}/commit/${sha}/checks)`

      default:
        // return `
        note = `
ID: ${ghwrkflw}

Action was a *${ipstatus}!*

\`Repository:  ${repo}\` 

On:          *${ghevent}*

By:            *${ghactor}* 

Tag:        ${process.env.GITHUB_REF}

[Link to Repo ](https://github.com/${repo}/)`
    }
    /*
    // assigning the output to a variable
    const output = evresp(ghevent)
    // sending the message
    _bot.sendMessage(chatid,output,{parse_mode : "Markdown"})
    */

    this._bot.sendMessage(this._chat_id, note, {parse_mode : "Markdown"})

    console.log('Note sent');

    return note;
  }

}

module.exports.GitHubHook = GitHubHook;
