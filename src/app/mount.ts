import { startDiscordBot } from "./discord/discord.ts";

export default async function mount() {
	await startDiscordBot();
}
