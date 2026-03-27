import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import Anthropic from '@anthropic-ai/sdk';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const { text } = await request.json();

	if (!text || typeof text !== 'string') {
		return json({ error: 'Text is required' }, { status: 400 });
	}

	if (!env.ANTHROPIC_API_KEY || env.ANTHROPIC_API_KEY === 'your-api-key-here') {
		return json({ error: 'API key not configured' }, { status: 500 });
	}

	const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });

	const message = await client.messages.create({
		model: 'claude-haiku-4-5-20251001',
		max_tokens: 1024,
		messages: [
			{
				role: 'user',
				content: `Generate a single Anki cloze deletion card from the following text. The output will be imported directly into Anki.

Rules:
- Return ONLY the HTML for the card — no JSON, no wrapping, no explanation.
- Use Anki cloze syntax: {{c1::answer}} to hide the key concept.
- Use HTML tags (<b>, <i>, <br>, <ul>/<li>) for formatting as needed.
- Keep it focused — one concept per card.
- You may use multiple cloze deletions (c1, c2, etc.) if the text has several key facts.

Text:
${text}`
			}
		]
	});

	const content = message.content[0];
	if (content.type !== 'text') {
		return json({ error: 'Unexpected response from API' }, { status: 500 });
	}

	return json({ html: content.text.trim() });
};
