const matchReportModal =  {
    type: 'modal',
    callback_id: "submit_result",
    title: {
        type: 'plain_text',
        text: 'Report your results'
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

module.exports = {
    matchReportModal
}