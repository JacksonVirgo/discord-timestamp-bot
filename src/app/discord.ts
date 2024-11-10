import { Events } from "discord.js";
import { Partials } from "discord.js";
import { Client } from "discord.js";
import config from "../utils/config.ts";

export const DEFAULT_INTENTS = {
	intents: [],
	partials: [Partials.User],
};

export const client = new Client(DEFAULT_INTENTS);

export async function startDiscordBot() {
	client.on(Events.ClientReady, (client) => {
		console.log(`${client.user.username} is now loaded.`);
	});
	await client.login(config.DISCORD_TOKEN);
}
