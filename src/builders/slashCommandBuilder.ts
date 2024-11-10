import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export type SlashCommandExecute = (
	i: ChatInputCommandInteraction
) => unknown | Promise<unknown>;
const defaultSlashCommandExecute: SlashCommandExecute = async (i) => {
	await i.reply({
		content: "This slash command has not been implemented yet.",
		ephemeral: true,
	});
};
export class SlashCommand extends SlashCommandBuilder {
	public static slashCommands: Map<string, SlashCommand> = new Map();
	private funcOnRun: SlashCommandExecute = defaultSlashCommandExecute;
	constructor(name: string) {
		super();
		if (SlashCommand.slashCommands.has(name))
			throw new Error("SlashCommand with name: " + name + " already exists");
		SlashCommand.slashCommands.set(name, this);
		this.setName(name).setDescription("No description provided.");
		console.log("Created new slash command: " + name);
	}

	public setComponents(func: (builder: SlashCommandBuilder) => void) {
		func(this);
		return this;
	}

	public onRun(func: SlashCommandExecute) {
		this.funcOnRun = func;
	}

	public async run(i: ChatInputCommandInteraction) {
		try {
			await this.funcOnRun(i);
		} catch (err) {
			console.error(err);
		}
	}
}
