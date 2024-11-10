import type { ChatInputCommandInteraction, Interaction } from "discord.js";
import { SlashCommand } from "../../builders/slashCommandBuilder.ts";

// deno-lint-ignore no-explicit-any
export default async function onInteraction(i: Interaction<any>) {
	switch (true) {
		case i.isChatInputCommand():
			return await handleSlashCommand(i as ChatInputCommandInteraction);
		default:
			if (i.isRepliable()) {
				await i.reply({
					content: "This interaction type is not supported yet.",
					ephemeral: true,
				});
			} else {
				console.log("Interaction type not supported yet.", i);
			}
			break;
	}
}

async function handleSlashCommand(i: ChatInputCommandInteraction) {
	const slashCommand = SlashCommand.slashCommands.get(i.commandName);
	if (!slashCommand) {
		return i.reply({
			content: "This command does not exist",
			ephemeral: true,
		});
	}
	return await slashCommand.run(i);
}
