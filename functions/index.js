const dotenv =  require('dotenv');
dotenv.config();

const functions = require('firebase-functions');
const Firestore = require('@google-cloud/firestore');
const modals = require('./modals.js');
const messages = require('./messages.js');
const PROJECTID = process.env.PROJECT_ID;
const COLLECTION_NAME = 'results';

const { WebClient } = require('@slack/web-api');
const slack = new WebClient(process.env.SLACK_TOKEN);

const firestore = new Firestore({
    projectId: PROJECTID,
    timestampsInSnapshots: true
});

exports.pingPongMatch = functions.https.onRequest(async (req, res) => {
    const data = JSON.parse(req.body.payload);

    if ('shortcut' === data.type && 'match_report' === data.callback_id) {
        // Open the modal
        await slack.views.open({
            trigger_id: data.trigger_id,
            view: modals.matchReportModal
        });

        return res.json({});

    } else if ('view_submission' === data.type && 'submit_result' === data.view.callback_id) {
        const userA = data.user.id;
        const userB = data.view.state.values.opponent.opponent_value.selected_user;
        const scoreA = parseInt(data.view.state.values.user_a_score.user_a_score_value.value, 10);
        const scoreB = parseInt(data.view.state.values.user_b_score.user_b_score_value.value, 10);

        if (userA === userB){
            const cheaterMessage = messages.createCheaterMessage(userA);
            await slack.chat.postMessage(cheaterMessage);
            return res.json({});
        }

        if (scoreA === scoreB) {
            return res.json({
                "response_action": "errors",
                "errors": {
                    "user_b_score": "The two scores can't be the same.",
                }
            });
        }

        const doc = await firestore.collection(COLLECTION_NAME).add({
            user_a : userA,
            user_b: userB,
            user_a_score: scoreA,
            user_b_score: scoreB,
            date: new Date().getTime(),
            is_approved: false
        });
        console.log('Created DB record', doc.id)
        const conversation = await slack.conversations.open({
            users: userB,
        });

        const confirmMessage = messages.createConfirmMessage(conversation.channel.id,doc.id,userA,userB,scoreA,scoreB)
        await slack.chat.postMessage(confirmMessage);
        return res.json({});
    }
    else if ('interactive_message' === data.type && 'confirm_match' === data.callback_id) {
        const hasDenied = data.actions[0].name === "deny";
        const docId = data.actions[0].value;
        console.log('Receieved confirmation with docid :', docId);
        const match = firestore.collection(COLLECTION_NAME).doc(docId);
        await match.update({
            is_approved: true
        });

        const matchUpdated = await match.get();
        const matchData = matchUpdated.data();
        const userA = matchData['user_a'];
        const userB = matchData['user_b'];
        const scoreA = matchData['user_a_score'];
        const scoreB = matchData['user_b_score'];

        if(hasDenied){
            // Envoyer un message au createur
            // TODO: create another message
            const deniedMessage = messages.createCheaterMessage(userA);
            await slack.chat.postMessage(deniedMessage);
            return res.json({});
        }

        const resultMessage = messages.createResultMessageBulle('C04DX31AXD0',userA, userB, scoreA, scoreB);
        // const resultMessage = messages.createResultMessage('C04DX31AXD0',userA, userB, scoreA, scoreB);
        await slack.chat.postMessage(resultMessage);

        return res.status(200).send('Thanks :-)');
    }
});
