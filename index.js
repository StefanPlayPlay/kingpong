let express = require('express')
let http = require('http')
let path = require('path')
const bodyParser = require('body-parser');


let app = express()
app.use(bodyParser.urlencoded({extended: true}));

app.post('/', (req, res) => {
    console.log('Got body:', req.body);
    let userA = req.body.user_id;

    const regex = /^<@([A-Z0-9]+)\|[^>]*> +(\d+) *- *(\d+)/;

    const match = regex.exec(req.body.text);
    let userB = match[1];
    let scoreA = match[2];
    let scoreB = match[3];

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

let server = http.createServer(app)

server.listen('3000', () => {
    console.log('Listening on port 3000')
})