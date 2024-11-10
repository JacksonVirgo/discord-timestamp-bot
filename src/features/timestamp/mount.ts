import { SlashCommand } from "../../builders/slashCommandBuilder.ts";

export default new SlashCommand("timestamp").onRun(async (i) => {
	await i.reply({
		content: `<t:${Math.floor(Date.now() / 1000)}:R>`,
	});
});
