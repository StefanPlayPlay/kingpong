const createConfirmMessage = (recipientId, docId, userA, userB, scoreA, scoreB) => {
    const text = `<@${userA}> submitted the following result : <@${userA}>(${scoreA}) - <@${userB}>(${scoreB}). Do you confirm ?`;
    return {
        channel: recipientId,
        text: 'Hello',
        "attachments": [
            {
                "text": text,
                "callback_id": "confirm_match",
                "color": "#3AA3E3",
                "attachment_type": "default",
                "actions": [
                    {
                        "name": "confirm",
                        "text": "Yes",
                        "type": "button",
                        "value": docId
                    },
                    {
                        "name": "deny",
                        "text": "No, it's a lie!",
                        "type": "button",
                        "value": docId
                    }
                ]
            }
        ]
    };
}

const createCheaterMessage = (recipientId) => {
    return{
        channel: recipientId,
        blocks: [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `You filthy cheater`
                }
            },
            {
                "type": "image",
                "image_url": "https://media2.giphy.com/media/3o6ZtdRTmf7f0Ug0Eg/giphy.gif",
                "alt_text": "Bubble"
            }
        ]
    };
}

const createResultMessage = (channelId, userA, userB, scoreA, scoreB) => {
    const text = `New Result :  <@${userA}>(${scoreA}) - <@${userB}>(${scoreB})`;
    return {
        channel: channelId,
        text: text
    };
};

const createResultMessageBulle = (channelId, userA, userB, scoreA, scoreB) => {
    let score_diff = Math.abs(scoreA-scoreB);
    let gif_url = "";
    switch(score_diff){
        case 1:
            gif_url = "https://media.giphy.com/media/leH08nNU11M6zJrqNz/giphy.gif"
            break;
        case 2:
            gif_url = "https://media.giphy.com/media/3oKIPf3C7HqqYBVcCk/giphy.gif"
            break;
        default:
            break;
    }
    let text = `<@${userA}> just won ${scoreA}-${scoreB} against <@${userB}> :melting_face:`;
    if (scoreB > scoreA) {
        text = `<@${userB}> just won ${scoreB}-${scoreA} against <@${userA}> :melting_face:`;
    }
    return{
        channel: channelId,
        blocks: [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": text
                }
            },
            {
                "type": "image",
                "image_url": gif_url,
                "alt_text": 'funny gif'
            }
        ]
    };
}

const createLeaderboardMessage = (channelId, leaderboard) => {
    leaderboard = leaderboard.slice(0, 49);

    let blocks = [
        {
            "type": "header",
            "text": {
                "type": "plain_text",
                "text": "🏆 Leaderboard",
                "emoji": true,
            },
        },
    ];

    const totalUsers = leaderboard.length;
    const emojis = [
        '⭐️', // > 90%
        '✨', // > 80%
        '👍', // > 70%
        '💪', // > 60%
        '😐', // > 50%
        '😕', // > 40%
        '😔', // > 30%
        '😞', // > 20%
        '😭', // > 10%
        '🤦', // > 0%
    ];
    let getEmoji = function (position) {
        if (1 === position) {
            return '🥇🏓';
        }

        if (2 === position) {
            return '🥈';
        }

        if (3 === position) {
            return '🥉';
        }

        if (totalUsers === position) {
            return '💩';
        }

        const i = Math.floor(10 - (1 - (position - 1) / (totalUsers - 1)) * 10 % 10);

        return emojis[i];
    };

    for (let i = 0; i < leaderboard.length; i++) {
        const position = i + 1;
        const emoji = getEmoji(position);

        blocks.push({
            "type": "context",
            "elements": [
                {
                    "type": "mrkdwn",
                    "text": `${emoji} #${position} <@${leaderboard[i].user_id}> (*${leaderboard[i].ranking}* ELO)`,
                },
            ],
        });
    }

    return {
        channel: channelId,
        blocks: blocks,
    };
};

module.exports = {
    createConfirmMessage,
    createCheaterMessage,
    createResultMessage,
    createResultMessageBulle,
    createLeaderboardMessage,
};
