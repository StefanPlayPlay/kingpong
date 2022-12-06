let express = require('express')
let http = require('http')
const bodyParser = require('body-parser');
let dotenv =  require('dotenv');
const modals = require('./modals')
const messages = required('./messages')

dotenv.config();

const { WebClient } = require('@slack/web-api');

// Read a token from the environment variables
const token = process.env.SLACK_TOKEN;

// Initialize
const slack = new WebClient(token);

let app = express()
app.use(bodyParser.urlencoded({extended: true}));

app.post('/interact', async (req, res) => {
    const data = JSON.parse(req.body.payload);
    console.log(data);

    if ('shortcut' === data.type && 'match_report' === data.callback_id) {
        await slack.views.open({
            trigger_id: data.trigger_id,
            view: modals.matchReportModal
        });
    } else if ('view_submission' === data.type && 'submit_result' === data.view.callback_id) {
        const userA = data.user.id;
        const userB = data.view.state.values.opponent.opponent_value.selected_user;
        const scoreA = data.view.state.values.user_a_score.user_a_score_value.value;
        const scoreB = data.view.state.values.user_b_score.user_b_score_value.value;

        console.log(userA, userB, scoreA, scoreB);
        // TO PUT AGAIN : insert to DB 

// Open a direct message channel with the user
        const conversation = await slack.conversations.open({
            users: userB,
        });
        const documentId = 'cccccccc';
        const confirmMessage = messages.createConfirmMessage(conversation.channel.id,doc.id,userA,userB,scoreA,scoreB)
        await slack.chat.postMessage(confirmMessage);
    } else if ('interactive_message' === data.type && 'confirm_match' === data.callback_id) {
        // Add DB record update
        return res.status(200).send('Thanks :-)');
    }

    return res.json({});
});

let server = http.createServer(app)

server.listen('3000', () => {
    console.log('Listening on port 3000')
})