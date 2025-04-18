import { Bot } from 'grammy';
import { Hono } from 'hono';

type Payload = {
	description: string;
	signature: string;
};

const app = new Hono<{ Bindings: Env }>();

app.use(async (c, next) => {
	const authHeader = c.req.header('authorization');
	if (authHeader !== c.env.WEBHOOK_TOKEN) return c.json([], 400);
	await next();
});

app.post('/', async (c) => {
	const bot = new Bot(c.env.BOT_TOKEN);
	const payload = await c.req.json<Payload[]>();

	const message = payload.map((e) => `${e.description}\n\nhttps://solscan.io/tx/${e.signature}`).join('\n\n');
	await bot.api.sendMessage(5278367192, message, { link_preview_options: { is_disabled: true } });
	return c.json([], 200);
});

export default app;
