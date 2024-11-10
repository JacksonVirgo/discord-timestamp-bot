import discord from "discord.js";
import { startDiscordBot } from "./app/discord.ts";

if (import.meta.main) {
	startDiscordBot();
}
