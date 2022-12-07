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
                        "text": "No, he's lying",
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
    let score_diff = Math.abs(scoreA-scoreB);
    let gif_url = "https://media.giphy.com/media/leH08nNU11M6zJrqNz/giphy.gif";
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



modules.exports = {
    createCheaterMessage,
    createConfirmMessage,
    createResultMessage, 
    createResultMessageBulle
}
