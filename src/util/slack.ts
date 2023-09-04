import type {Handler, HandlerEvent} from "@netlify/functions";

import { createHmac } from "crypto";


export function slackApi(
    endpoint: SlackApiEndpoint,
    body: SlackApiRequestBody
){
    return fetch(`https://slack.com/api/${endpoint}`, {
        body: JSON.stringify(body),
        headers: {
            Authorization: `Bearer ${process.env.SLACK_BOT_OAUTH_TOKEN}`,
            'Content-Type': 'application/json; charset=utf-8'
        },
        method: 'POST'
    }).then((response)=> response.json())
}

export function verifySlackRequest(request: HandlerEvent) {
    const secret = process.env.SLACK_SIGNING_SECRET!;
    const signature = request.headers['x-slack-signature'];
    const timestamp = Number(request.headers['x-slack-request-timestamp']); // Prevent replay attacks
    const now = Math.floor(Date.now() / 1000);

    if (Math.abs(now - timestamp) > 300) {  //If the request timestamp is more than 5min more than expected
        console.log("TIMESTAMP OUT OF RANGE")
        return false; // Fail the request, could be a replay attack
    }

    const hash = createHmac('sha256', secret)
        .update(`v0:${timestamp}:${request.body}`)
        .digest('hex');

    // NOTE: Slack will hash the body with the signing secret and put this in x-slack-signature header
    // We then hash the body ourselves with the known secret and compare that they are the same.
    return `v0=${hash}` === signature

}

// Helper for creating Slack Block Kit layouts
// Basic block elements are used here, add more by referring to the Block Kit Builder documentation
export const blockKitBlocks = {
    section: ({ text }: SectionBlockArgs): SlackBlockSection => {
        return {
            type: 'section',
            text: {
                type: 'mrkdwn',
                text: text
            }
        };
    },
    input: ({id, label, placeholder, initial_value = '', hint= ''}: InputBlockArgs): SlackBlockInput => {
        return {
            block_id: `${id}`,
            type: 'input',
            label: {
                type: 'plain_text',
                text: label
            },
            element: {
                action_id: id,
                type: 'plain_text_input',
                placeholder: {
                    type: 'plain_text',
                    text: placeholder
                },
                initial_value
            },
            hint: {
                type: 'plain_text',
                text: hint
            }
        };
    },
    select: ({id,label,placeholder,options}:SelectBlockArgs):SlackBlockInput => {
        return {
            block_id: `${id}_block`,
            type: 'input',
            label: {
                type: 'plain_text',
                text: label
            },
            element: {
                action_id: id,
                type: 'static_select',
                placeholder: {
                    type: 'plain_text',
                    text: placeholder
                },
                options: options.map(({label, value}) => {
                    return {
                        text: {
                            type: 'plain_text',
                            text: label,
                            emoji: true
                        },
                        value
                    }
                })
            },

        }
    }
}

export function slackModal({
    trigger_id,
    id,
    title,
    submit_text = 'Submit',
    blocks }: ModalArgs){

    return {
        trigger_id,
        view: {
            type: 'modal',
            callback_id: id,
            title: {
                type: 'plain_text',
                text: title
            },
            submit: {
                type: 'plain_text',
                text: submit_text
            },
            blocks
        }
    }
}