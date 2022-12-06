let express = require('express')
let http = require('http')
const bodyParser = require('body-parser');
let dotenv =  require('dotenv');
let modals = require('./modals')

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

// Open a direct message channel with the user
        const conversation = await slack.conversations.open({
            users: userB,
        });

        let mtext = 'Do you confirm that you won a ping-pong match against <@'+userA+'> ('+scoreB+'-'+scoreA+')?';
        if (scoreA > scoreB) {
            mtext = 'Do you confirm that <@' + userA + '> won a ping-pong match against you (' + scoreA + '-' + scoreB + ')?';
        }
// Send a message with the button attachment
//         await slack.chat.postMessage({
//             channel: conversation.channel.id,
//             text: mtext,
//             attachments: [
//                 {
//                     "callback_id": "wopr_game",
//                     "color": "#3AA3E3",
//                     "attachment_type": "default",
//                     "actions": [
//                         {
//                             "name": "game",
//                             "text": "Thermonuclear War",
//                             "style": "danger",
//                             "type": "button",
//                             "value": "war",
//                             "confirm": {
//                                 "title": "Are you sure?",
//                                 "text": "Wouldn't you prefer a good game of chess?",
//                                 "ok_text": "Yes",
//                                 "dismiss_text": "No"
//                             }
//                         }
//                     ]
//                 }
//             ]
//         });
        const documentId = 'cccccccc';
        await slack.chat.postMessage({
            channel: conversation.channel.id,
            text: 'Hello',
            "attachments": [
                {
                    "text": mtext,
                    "callback_id": "confirm_match",
                    "color": "#3AA3E3",
                    "attachment_type": "default",
                    "actions": [
                        {
                            "name": "game",
                            "text": "Yes",
                            "type": "button",
                            "value": documentId
                        }
                    ]
                }
            ]
        })
    } else if ('interactive_message' === data.type && 'confirm_match' === data.callback_id) {
        console.log(data.actions[0].value);

        return res.status(200).send('Thanks :-)');
    }

    return res.json({});
});

let server = http.createServer(app)

server.listen('3000', () => {
    console.log('Listening on port 3000')
})