import { SlashCommand } from "../../builders/slashCommandBuilder.ts";

export default new SlashCommand("timestamp")
	.setComponents((b) =>
		b.addStringOption((o) =>
			o.setName("time").setDescription("Time to get timestamp for")
		)
	)
	.onRun(async (i) => {
		const time = i.options.getString("time");
		if (!time) {
			const now = Math.floor(Date.now() / 1000);
			const timestamps = generateTimestampList(now);

			const content = timestamps
				.map((v) => {
					return `\`${v}\` - ${v}`;
				})
				.join("\n");

			return await i.reply({
				content: content,
			});
		}

		const now = Math.floor(Date.now() / 1000);
		const timestamps = generateTimestampList(now);

		const content = timestamps
			.map((v) => {
				return `\`${v}\` - ${v}`;
			})
			.join("\n");

		return await i.reply({
			content: content,
		});
	});

function generateTimestampList(unixTimeSeconds: number): string[] {
	return [
		`<t:${unixTimeSeconds}:d>`,
		`<t:${unixTimeSeconds}:D>`,
		`<t:${unixTimeSeconds}:t>`,
		`<t:${unixTimeSeconds}:T>`,
		`<t:${unixTimeSeconds}:f>`,
		`<t:${unixTimeSeconds}:F>`,
		`<t:${unixTimeSeconds}:R>`,
	];
}
