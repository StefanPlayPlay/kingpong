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
}

const createResultMessageBulle = (channelId, userA, userB, scoreA, scoreB) => {
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
                "title": {
                    "type": "plain_text",
                    "text": "It's bubble time",
                    "emoji": true
                },
                "image_url": "https://media.giphy.com/media/9QmldqOBxeBZC/giphy.gif",
                "alt_text": "Bubble"
            }
        ]   
    };
}



modules.exports = {
    createCheaterMessage,
    createConfirmMessage,
    createResultMessage, 
    createResultMessageBulle
}
