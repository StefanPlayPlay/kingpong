let express = require('express')
let http = require('http')
let path = require('path')
const bodyParser = require('body-parser');
let dotenv =  require('dotenv');

dotenv.config();

const { WebClient } = require('@slack/web-api');

// Read a token from the environment variables
const token = process.env.SLACK_TOKEN;

// Initialize
const slack = new WebClient(token);

let app = express()
app.use(bodyParser.urlencoded({extended: true}));

app.post('/', async (req, res) => {
    console.log('Got body:', req.body);
    let userA = req.body.user_id;

    const regex = /^<@([A-Z0-9]+)\|[^>]*> +(\d+) *- *(\d+)/;

    const match = regex.exec(req.body.text);
    let userB = match[1];
    let scoreA = match[2];
    let scoreB = match[3];

    const conversation = await slack.conversations.open({
        users: userB,
    });

    await slack.chat.postMessage({
        channel: conversation.channel.id,
        text: 'Hello, this is a private message!',
        attachments: [

        ],
    });

    return res.json({
        "channel": "C04DX31AXD0",
        "text": "I hope the tour went well, Mr. Wonka.",
        "attachments": [
            {
                "text": "Who wins the lifetime supply of chocolate?",
                "fallback": "You could be telling the computer exactly what it can do with a lifetime supply of chocolate.",
                "color": "#3AA3E3",
                "attachment_type": "default",
                "callback_id": "select_simple_1234",
                "actions": [
                    {
                        "name": "winners_list",
                        "text": "Who should win?",
                        "type": "select",
                        "data_source": "users"
                    }
                ]
            }
        ]
    });
});

app.post('/interact', async (req, res) => {
    const data = JSON.parse(req.body.payload);
    console.log(data);

    if ('shortcut' === data.type && 'report_result' === data.callback_id) {
        // Define the modal configuration
        const modal = {
            type: 'modal',
            callback_id: "submit_result",
            title: {
                type: 'plain_text',
                text: 'Report your result'
            },
            blocks: [
                {
                    "block_id": "opponent",
                    "type": "input",
                    "label": {
                        "type": "plain_text",
                        "text": "Opponent"
                    },
                    "element": {
                        "action_id": "opponent_value",
                        "type": "users_select"
                    }
                },
                {
                    "block_id": "user_a_score",
                    "type": "input",
                    "label": {
                        "type": "plain_text",
                        "text": "Your score"
                    },
                    "element": {
                        "action_id": "user_a_score_value",
                        "type": "number_input",
                        is_decimal_allowed: false,
                        "min_value": "0"
                    }
                },
                {
                    "block_id": "user_b_score",
                    "type": "input",
                    "label": {
                        "type": "plain_text",
                        "text": "Opponent score"
                    },
                    "element": {
                        "action_id": "user_b_score_value",
                        "type": "number_input",
                        is_decimal_allowed: false,
                        "min_value": "0"
                    }
                },
            ],
            submit: {
                type: 'plain_text',
                text: 'Submit'
            }
        };

        // Open the modal
        await slack.views.open({
            trigger_id: data.trigger_id,
            view: modal
        });
    } else if ('view_submission' === data.type && 'submit_result' === data.view.callback_id) {
        const userA = data.user.id;
        const userB = data.view.state.values.opponent.opponent_value.selected_user;
        const scoreA = data.view.state.values.user_a_score.user_a_score_value.value;
        const scoreB = data.view.state.values.user_b_score.user_b_score_value.value;

        console.log(userA, userB, scoreA, scoreB);
    }

    return res.json({});
});

let server = http.createServer(app)

server.listen('3000', () => {
    console.log('Listening on port 3000')
})