let express = require('express')
let http = require('http')
const bodyParser = require('body-parser');
let dotenv =  require('dotenv');
const modals = require('./modals')
const messages = require('./messages.js')
const ranking = require('./ranking.js')

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

    // Shortcut that opens the modal
    if ('shortcut' === data.type && 'match_report' === data.callback_id) {
        await slack.views.open({
            trigger_id: data.trigger_id,
            view: modals.matchReportModal
        });
    // When user submits the modal form
    } else if ('view_submission' === data.type && 'submit_result' === data.view.callback_id) {
        const userA = data.user.id;
        const userB = data.view.state.values.opponent.opponent_value.selected_user;
        const scoreA = parseInt(data.view.state.values.user_a_score.user_a_score_value.value, 10);
        const scoreB = parseInt(data.view.state.values.user_b_score.user_b_score_value.value, 10);

        const scoreDiff = Math.abs(scoreA - scoreB);

        if (scoreA === scoreB) {
            return res.json({
                "response_action": "errors",
                "errors": {
                    "user_b_score": "The two scores can't be the same.",
                }
            });
        }

        if(scoreDiff === 1){
            return res.json({
                "response_action": "errors",
                "errors": {
                    "user_b_score": "You can only win by a 2 point difference !",
                }
            });
        }

        if(userA === userB){
            const cheaterMessage = messages.createCheaterMessage('C04E584TL82', userA);
            await slack.chat.postMessage(cheaterMessage);
            return res.json({});
        }
        // NEED TO ADD : insert to DB 

        // Open a direct message channel with the user
        const conversation = await slack.conversations.open({
            users: userB,
        });
        const documentId = 'cccccccc';
        const confirmMessage = messages.createConfirmMessage(conversation.channel.id,doc.id,userA,userB,scoreA,scoreB)
        await slack.chat.postMessage(confirmMessage);
    // When userB confirms the result
    } else if ('interactive_message' === data.type && 'confirm_match' === data.callback_id) {

        const hasDenied = data.actions[0].name === "deny";

        // REPLACE BY GET USERS ID FROM DOCUMENT
        const userA = 'xxx';
        const userB = 'xxx';
        const scoreA = '11';
        const scoreB = '6';

        if(hasDenied){  
            const deniedMessage = messages.createDenyMessage('C04E584TL82',userA,userB,scoreA,scoreB);
            await slack.chat.postMessage(deniedMessage);
            const confirmKoMessage = messages.createConfirmKoMessage(userA, userB, scoreA, scoreB)
            return res.status(200).send(confirmKoMessage);

        }
        // Now we now result is accepted
        const winner = scoreA > scoreB ? userA : userB;
        const looser = scoreA > scoreB ? userB : userA;

        // Enable this in PROD !!!
        // ranking.updateRanking(winner,looser);

        // Message sent on the public channel
        const resultMessage = messages.createResultMessage('C04E584TL82',userA, userB, scoreA, scoreB)
        await slack.chat.postMessage(resultMessage);

        // Response to the confirmation (MP)
        const confirmOkMessage = messages.createConfirmOkMessage(userA, userB, scoreA, scoreB)
        return res.status(200).send(confirmOkMessage);
    }

    return res.json({});
});

let server = http.createServer(app)

server.listen('3000', () => {
    console.log('Listening on port 3000')
})
