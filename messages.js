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


