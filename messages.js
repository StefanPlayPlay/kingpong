const gifs = require('./gifs.js');

const pickRandomGif = (key) => {
    try {
        const gifArray = gifs[key];
        return gifArray[Math.floor(Math.random()*gifArray.length)];
    }
    catch(err){
        return "https://i.imgur.com/dFH9FSs.gif";
    }
}

const createConfirmMessage = (recipientId, docId, userA, userB, scoreA, scoreB) => {
    const text = `<@${userA}> submitted the following result : <@${userA}>(${scoreA}) - <@${userB}>(${scoreB}). Do you confirm ?`;
    return {
        channel: recipientId,
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
                "text": "Bullshit",
                "type": "button",
                "value": docId
            }
            ]
        }
        ]
    };
}

const createConfirmOkMessage = (userA, userB, scoreA, scoreB) => {
    const text = `You approved the following result : <@${userA}>(${scoreA}) - <@${userB}>(${scoreB})`;
    return text;
}

const createConfirmKoMessage = (userA, userB, scoreA, scoreB) => {
    const text = `You denied the following result : <@${userA}>(${scoreA}) - <@${userB}>(${scoreB})`;
    return text;
}

const createCheaterMessage = (channelId, cheaterId) => {
    return{
        channel: channelId, 
        blocks: [
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": `<@${cheaterId}> tried to cheat!! You thought we wouldn't catch you?`
            }
        }, 
        {
            "type": "image",
            "image_url": pickRandomGif('cheater'),
            "alt_text": "Cheater"
        }
        ]     
    };
}

const createDenyMessage = (channelId, initiatorId, denierId, initiatorScore, denierScore) => { 
    return{
        channel: channelId, 
        blocks: [
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": `<@${denierId}> denied the following result : <@${initiatorId}>(${initiatorScore}) - <@${denierId}>(${denierScore})`
            }
        }, 
        {
            "type": "image",
            "image_url": pickRandomGif('denied'),
            "alt_text": "Cheater"
        }
        ]     
    };
}

const createResultMessage = (channelId, userA, userB, scoreA, scoreB) => {
    let score_diff = Math.abs(scoreA-scoreB);
    let gif_url = pickRandomGif(score_diff);
    const winner = scoreA > scoreB ? userA : userB;
    const loser = scoreA > scoreB ? userB : userA;
    const winner_score = scoreA > scoreB ? scoreA : scoreB;
    const loser_score = scoreA > scoreB ? scoreB : scoreA;
    let gif_alt_text = `${winner_score}-${loser_score}`;
    let text = `<@${winner}> just won ${winner_score}-${loser_score} against <@${loser}> :table_tennis_paddle_and_ball:`;

    switch(score_diff){
    case 1:
        text = `How did you do that?`
        break; 
    case 2:
        text = `What a match! :fire: 
<@${winner}> won against <@${loser}>. Pure luck? Talent? Who knows :shrug: ...`
        break;
    case 3:
        text = `Close one! :pinching_hand: 
<@${winner}> beat <@${loser}>. As the french say : "L'important c'est les 3 points" :flag-fr:"`   
        break;
    case 4:
        text = `Boom! :bomb: 
<@${winner}> owned <@${loser}>. 4 points ain't that much, but it's a clear win`   
        break;
    case 5:
        text = `Well that was easy! :broom:
<@${winner}> cleared <@${loser}> out of the room. Maybe you should try playing baby-foot? :baby-foot:`
        break;
    case 6:
        text = `Clean! :sponge:
<@${winner}> wiped the floor with <@${loser}>'s tears. :sob:`
        break;
    case 7:
        text = `Ouch! :face_with_head_bandage:
<@${winner}> clearly won. <@${loser}> keep practicing (you loser :speak_no_evil:)`
        break;
    case 8:
        text = `Burned! :melting_face:
<@${winner}> burned <@${loser}> to ashes. Someone call 911 :funeral_urn:`
        break;
    case 9:
        text = `Vroom vroom! :tractor:
<@${winner}> ran over <@${loser}>. Can he still get up? :pancakes:`
        break;
    case 10:
        text = `Humiliated! :dotted_line_face:
<@${winner}> destroyed <@${loser}>. Can someone from their team pick them up? :spoon: `
        break;
    case 11:
        text = `Bubble time! :bubbles:
<@${winner}> ended <@${loser}>'s ping-pong career. You can drop your stuff at the HR dept :door::man-walking:`
        break;
    default:
        break;
    }

    text += `
<@${winner}> ${winner_score} - ${loser_score} <@${loser}>`;


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
                    "text": gif_alt_text,
                    "emoji": true
                },
            "image_url": gif_url,
            "alt_text": gif_alt_text
        }
        ]   
    };
}



modules.exports = {
    createCheaterMessage,
    createConfirmMessage,
    createConfirmOkMessage,
    createConfirmKoMessage,
    createDenyMessage,
    createResultMessage
}
