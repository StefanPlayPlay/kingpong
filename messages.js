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

const createResultMessage = (channelId, userA, userB, scoreA, scoreB) => {
    const text = `New Result :  <@${userA}>(${scoreA}) - <@${userB}>(${scoreB})`;
    return {
        channel: channelId,
        text: text
    };
}

const createResultMessageBulle = (channelId, userA, userB, scoreA, scoreB) => {
    return{
        channel: channelId, 
        blocks: [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `<@${userA}> just won ${scoreA}-${scoreB} against <@${userB}> :melting_face:`
                },
                "accessory": {
                    "type": "image",
                    "image_url": "https://media.giphy.com/media/9QmldqOBxeBZC/giphy.gif",
                    "alt_text": "Bubble time"
                }
            }
        ]   
    };
}



modules.exports = {
    createConfirmMessage,
    createResultMessage, 
    createResultMessageBulle
}
