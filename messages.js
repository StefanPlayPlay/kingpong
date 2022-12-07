const gifs = require('./gifs.js');

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
            "image_url": gifs['cheater'][0],
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
            "image_url": gifs['denied'][0],
            "alt_text": "Cheater"
        }
        ]     
    };
}

const createResultMessage = (channelId, userA, userB, scoreA, scoreB) => {
    let score_diff = Math.abs(scoreA-scoreB);
    let gif_url = "https://i.imgur.com/dFH9FSs.gif";
    let gif_alt_text = "Guy smashing and throwing the paddle";
    const winner = scoreA > scoreB ? userA : userB;
    const loser = scoreA > scoreB ? userB : userA;
    const winner_score = scoreA > scoreB ? scoreA : scoreB;
    const loser_score = scoreA > scoreB ? scoreB : scoreA;
    let text = `<@${winner}> just won ${winner_score}-${loser_score} against <@${loser}> :table_tennis_paddle_and_ball:`;

    switch(score_diff){
    case 1:
        gif_url = "https://media.giphy.com/media/2vs70gBAfQXvOOYsBI/giphy.gif"
        gif_alt_text = "How did you win by 1 point?"
        text = `Fantastic! <@${winner}> won ${winner_score}-${loser_score} against <@${loser}> :table_tennis_paddle_and_ball:`
        break; 
    case 2:
        gif_url = "https://i.imgur.com/Od9OtO0.gif"
        gif_alt_text = "It was sooooooo close"
        text = `What a match! :fire: <@${winner}> won ${winner_score}-${loser_score} against <@${loser}>`
        break;
    case 3:
        gif_url = "https://i.imgur.com/E1T82Vq.gif"
        gif_alt_text = "Trick shot"
        text = `Was it even challenging? <@${winner}> destroyed <@${loser}> ${winner_score}-${loser_score}`
        break;
    case 4:
        gif_url = "https://i.imgur.com/LeZX32R.gif"
        gif_alt_text = "Game son"
        text = `Game! :boom: <@${winner}> won ${winner_score}-${loser_score} against <@${loser}>`
        break;
    case 5:
        gif_url = "https://i.giphy.com/media/hQSkQm41brwdYDIGqr/giphy.webp"
        gif_alt_text = "No, not even close"
        text = `<@${winner}> won ${winner_score}-${loser_score} against <@${loser}>`
        break;
    case 6:
        gif_url = "https://i.imgur.com/z0mssC3.gif"
        gif_alt_text = "No big deal"
        text = `<@${winner}> defeated <@${loser}> on a ${winner_score}-${loser_score} score`
        break;
    case 7:
        gif_url = "https://media.giphy.com/media/sxCKezAUq8yn6/giphy.gif"
        gif_alt_text = "Grandpa receives a ball in the face"
        text = `Keep practicing <@${loser}> :muscle: <@${winner}> just beat you ${winner_score}-${loser_score}`
        break;
    case 8:
        gif_url = "https://media.giphy.com/media/Oc4pSGTekXrtC/giphy.gif"
        gif_alt_text = "You just got kicked"
        text = `<@${winner}> kicked <@${loser}> in a ${winner_score}-${loser_score} victory :martial_arts_uniform:`
        break;
    case 9:
        gif_url = "https://i.imgur.com/nEHwwmz.gif"
        gif_alt_text = "Vivien rolling over Camille"
        text = `Outch! :tractor: <@${winner}> rolled over <@${loser}> in a ${winner_score}-${loser_score} game`
        break;
    case 10:
        gif_url = "https://media.giphy.com/media/l2JJod66TKus2t3QA/giphy.gif"
        gif_alt_text = "Guy slaping the air"
        text = `:leftwards_hand: <@${winner}> won ${winner_score}-${loser_score} against <@${loser}>`
        break;
    case 11:
        gif_url = "https://media.giphy.com/media/9QmldqOBxeBZC/giphy.gif"
        gif_alt_text = "It's bubble time"
        text = `Oh god! :see_no_evil: <@${winner}> just hit <@${loser}> with a bubble! Final score ${winner_score}-${loser_score}`
        break;
    default:
        break;
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
    createDenyMessage,
    createResultMessage
}
