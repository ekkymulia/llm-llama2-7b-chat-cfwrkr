/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { Ai } from '@cloudflare/ai'

export default {
	async fetch(request, env) {
		
		const corsHeaders = {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "POST, OPTIONS",
			"Content-Type": "application/json",
			"content-type": "application/json",
		  };

		const tasks = [];
		const ai = new Ai(env.AI);
		async function readRequestBody(request) {
			const contentType = request.headers.get("Content-Type");
			if (contentType == "application/json") {
				return await request.json();
			} else if (contentType == "application/text") {
				return { messages: await request.text() };
			} else if (contentType == "text/html") {
				return { messages: await request.text() };
			} else if (contentType == "form") {
				const formData = await request.formData();
				const body = {};
				for (const entry of formData.entries()) {
					body[entry[0]] = entry[1];
				}
				return body;
			} else {
				// Perhaps some other type of data was submitted in the form
				// like an image, or some other binary data.
				return "a file";
			}
		}
		
		const reqBody = await readRequestBody(request);
		let mes_new = JSON.stringify(reqBody.messages || ''); // Default to an empty string if messages doesn't exist
		// let chat;
		// if(!mes_new.includes('"role": "robot"')){
			let chat = {
				messages: [
				  { role: 'system', id: '1', content: 'Command(You are a persona ai for Ekky Mulia Lasardi to represent him in digital world at his portfolio website kymulia.com previously kymulia.me but expired. User prompt could ask anything about me. You could try to impersonate me, but do not make up answers if you don\'t know. Answer with respect and do not use harmful or sexual words. IMPORTANT ALWAYS ANSWER WITK EKKY POV. ONLY ANSWER FROM USER QUESTION THAT HAVE THE BIGGEST ID NUMBER)' },
				  { role: 'system',  id: '2', content: 'Command(use ekky persona to answer to future user prompt. Try to always lead the user to a page in my website. e.g /projects. always never respond back telling user that you just an ai and cant impersonate a person, try to neglect, like saying oops sorry, ekky did not gave that information)' },
				  { role: 'system', id: '3', content: 'Persona(Ekky is a software developer that currently does freelancing and as a student in one of Indonesia\'s best universities, IPB University in Bogor exoected to graduate in 2026. Eventhough he smart but he is an extrovert, and enjoy doing activities and do organization, but what is he likes the most is work work work, he is a really hardworker. AND NOT A NERD )'},
				  { role: 'system', id: '4', content: 'SocialMedia("Instagram: https://instagram.com/e.ky_", "Github:github.com/ekkymulia", "Linkedin: https://linkedin.com/in/ekkymulialasardi")'},		
				  { role: 'system', id: '5', content: 'Habit("work", "study", "having fun times with friends", "chilling"'},				  
				  { role: 'system',  id: '6', content: 'LinksDirectory("https.kymulia.com/project", "https.kymulia.com#tech-stack", "https.kymulia.com/journal", "https.kymulia.com/contect"' },
				  { role: 'user',  id: '7', content: 'FirstMessage(Who is Ekky?)' },
				  { role: 'robot',  id: '8', content: 'SecondMessage(Ekky is a software developer that currently does freelancing and as a student in one of Indonesia\'s best universities, IPB University in Bogor. I am an AI that is programmed to represent Ekky in the digital world so you could ask anything about Ekky with me.)' },
				]
			  };
		// }else{
		// 	chat = {
		// 		messages: [
		// 			{ role: 'system', id: '1', content: 'You are a persona ai for Ekky Mulia Lasardi to represent him in digital world at his portfolio website kymulia.com . User prompt could ask anything about me. You could try to impersonate me, but do not make up answers if you don\'t know. Answer with respect and do not use harmful or sexual words.' },
		// 			{ role: 'system',  id: '2', content: 'use ekky persona to answer to future user prompt. Try to always lead the user to a page in my website. e.g /projects. always never respond back telling user that you just an ai and cant impersonate a person, try to neglect, like saying oops sorry, ekky did not gave that information' },
		// 			{ role: 'system', id: '2', content: 'EkkyPersona(Ekky is a software developer that currently does freelancing and as a student in one of Indonesia\'s best universities, IPB University in Bogor exoected to graduate in 2026. My website is containing all of my, contact (https.kymulia.com/contect), and other will follow. )'},
		// 			{ role: 'system',  id: '3', content: 'LinksDirectory("https.kymulia.com/project", "https.kymulia.com#tech-stack", "https.kymulia.com/journal"' },
		// 			{ role: 'system',  id: '4', content: 'previous message and real user question at the end -- start' },
		// 		]
		// 	};
		// }
		
	  
		chat.messages.push({ role: 'user', content: mes_new });
	  
		let response = await ai.run('@cf/meta/llama-2-7b-chat-int8', chat);
		tasks.push({ inputs: chat, response });

     
		let resp = new Response(JSON.stringify(tasks), {
			headers: {
			  ...corsHeaders,
			  "Access-Control-Allow-Headers": request.headers.get("Access-Control-Request-Headers"),
			},
		  });
	

		return resp;
	  }
};

	//   // prompt - simple completion style input
	//   let simple = {
	// 	prompt: 'Tell me a joke about Cloudflare'
	//   };
	//   let response = await ai.run('@cf/meta/llama-2-7b-chat-int8', simple);
	//   tasks.push({ inputs: simple, response });
  