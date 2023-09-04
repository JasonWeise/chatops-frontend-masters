import type { Handler } from '@netlify/functions';

import { parse } from "querystring";
import { slackApi, verifySlackRequest, slackModal, blockKitBlocks } from "./util/slack";

async function handleSlackSlashCommand(payload: SlackSlashCommandPayload){
	switch (payload.command){
		case '/chatops':
			// Tell the SlackAPI to show the user a modal to fill in the information we want
			// Note we are using the Slack Kit Block helper that we created under util folder -> slack.ts
			const response = await slackApi('views.open',
				slackModal({
					id: 'chatop-modal',
					title: 'Start sending some info',
					trigger_id: payload.trigger_id,
					blocks: [
						blockKitBlocks.section({
							text: "The discourse demands some information!"
						}),
						blockKitBlocks.input({
							id: 'user_request',
							label: 'Pop in your info',
							placeholder: 'Example: I would like to on-board someone',
							initial_value: payload.text ?? '',
							hint: 'What do you want us to know'
						}),
						blockKitBlocks.select({
							id: 'importance_level',
							label: 'How important is this',
							placeholder: 'Select Importance Level',
							options: [
								{ label: 'low', value: 'low'},
								{ label: 'med', value: 'med'},
								{ label: 'high', value: 'high'},
								{ label: 'critical', value: 'critical'}
							]
						})
					]
						   }),

			);

			// The Slack slash command was recognised but the Slack API returned an error when talking to it.
			// if return is '{ ok: false, error: 'not_in_channel' }' then it means bot has not been added to the
			// channel sending the message.
			// Add the bot(app) by typing /add at the Slack message prompt and add the app/bot
			if(!response.ok){
				console.log(response)
			}
			break;

		// Slash command was not recognised as one we support
		default:
			return {
				statusCode: 200,
				body: `Command ${payload.command} is not recognized`
			}
	}

	return {
		statusCode: 200,
		body: ''
	}
}

async function handleSlackInteractivity(payload: SlackModalPayload){
	const callback_id = payload.callback_id ?? payload.view.callback_id;

	switch (callback_id){
		case 'chatop-modal':
			const data = payload.view.state.values;
			//NOTE: the data fields such as spice_level below are configurable in our utils helper function
			const fields = {
				user_request: data.opinion_block.opinion.value,
				importance_level: data.spice_level_block.spice_level.selected_option.value,
				submitter: payload.user.username
			}
			await slackApi('chat.postMessage', {
				channel: payload.channel,
				text: `yeah there :eyes: <@${payload.user.id}> just we have received your ${fields.importance_level} request!\n
				We will follow up shortly`
			})

			break;

		default:
			console.log(`No handler definted for ${callback_id}`);
			return {
				statusCode: 400,
				body: `No handler definted for ${callback_id}`
			}
	}

	return {
		statusCode: 200,
		body: ''
	}


}

//********** NOTES ****************
// if return is '{ ok: false, error: 'not_in_channel' }' then it means bot has not been added to the
// channel sending the message.
// Add the bot(app) by typing /add at the Slack message prompt and add the app/bot
export const handler: Handler = async (event) => {
	// *** validate the Slack request ***
	const requestIsValid = verifySlackRequest(event)

	if(!requestIsValid){
		console.error('Invalid request');

		return {
			statusCode: 400,
			body: 'Invalid request'
		}
	}

	// *** handle slash commands ***
	const body = parse(event.body ?? '') as SlackPayload;
	if(body.command){
		return handleSlackSlashCommand(body as SlackSlashCommandPayload)
	}

	// TODO handle interactivity (e.g. context commands, modals)
	if(body.payload){
		const payload = JSON.parse(body.payload);
		return handleSlackInteractivity(payload);
	}

	return {
		statusCode: 200,
		body: 'TODO: handle Slack commands and interactivity',
	};
};
