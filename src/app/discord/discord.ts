import { Events, REST, Routes } from "discord.js";
import { Partials } from "discord.js";
import { Client } from "discord.js";
import config from "../../utils/config.ts";
import { SlashCommand } from "../../builders/slashCommandBuilder.ts";
import onInteraction from "./interactionCreate.ts";

export const DEFAULT_INTENTS = {
	intents: [],
	partials: [Partials.User],
};

export const client = new Client(DEFAULT_INTENTS);
const clientREST = new REST({ version: "10" }).setToken(config.DISCORD_TOKEN);

export async function startDiscordBot() {
	client.on(Events.ClientReady, (client) => {
		console.log(`${client.user.username} is now loaded.`);
	});

	client.on(Events.InteractionCreate, onInteraction);

	await loadInteractions();
	await client.login(config.DISCORD_TOKEN);
	await registerCommands();
}

async function loadInteractions() {
	const interactionPath = new URL("../../features", import.meta.url).pathname;
	const loadFiles = async (dirPath: string) => {
		try {
			for await (const entry of Deno.readDir(dirPath)) {
				const filePath = `${dirPath}/${entry.name}`;
				if (entry.isDirectory) {
					await loadFiles(filePath); // Recursive call for subdirectories
				} else if (
					entry.isFile &&
					(entry.name.endsWith(".ts") || entry.name.endsWith(".js"))
				) {
					try {
						const _ = await import(`file://${filePath}`);
					} catch (_err) {
						console.log(
							`\x1B[31mFailed to load file: \x1B[34m${entry.name}\x1B[0m`
						);
					}
				}
			}
		} catch (_err) {
			console.log(
				`\x1B[31mFailed to load directory: \x1B[34m${interactionPath}\x1B[0m`
			);
		}
	};

	await loadFiles(interactionPath);
	console.log("[BOT] Loaded interactions");
}

export async function registerCommands() {
	try {
		const commandList: object[] = [];
		SlashCommand.slashCommands.forEach((val) => {
			const json = val.toJSON();
			return commandList.push(json);
		});

		const registeredCommands = (await clientREST.put(
			Routes.applicationCommands(config.DISCORD_CLIENT_ID),
			{
				body: commandList,
			}
		)) as unknown;

		if (Array.isArray(registeredCommands)) {
			if (registeredCommands.length != commandList.length) {
				console.log(
					`\x1B[31mFailed to load ${
						commandList.length - registeredCommands.length
					} commands`
				);
			}
		}

		console.log("[BOT] Registered commands");
	} catch (err) {
		console.error(err);
	}
}
