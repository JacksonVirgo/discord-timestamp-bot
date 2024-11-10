import { array } from "zod";
import { SlashCommand } from "../../builders/slashCommandBuilder.ts";

import moment from "momentjs";
import tz from "moment-timezone";

export default new SlashCommand("timestamp")
	.setComponents((b) =>
		b
			.addStringOption((o) =>
				o.setName("datetime").setDescription("Date/Time to get timestamp for")
			)
			.addStringOption((o) =>
				o.setName("timezone").setDescription("Timezone").setAutocomplete(true)
			)
	)
	.onRun(async (i) => {
		const time = i.options.getString("time");
		const timezone = i.options.getString("timezone");

		// TODO: Make sure to also handle mm/dd as some people are WRONG, but still use it
		if (!time) {
			return await i.reply({
				content: "Please provide a time to get a timestamp for.",
				ephemeral: true,
			});
		}

		const data = parseDateTime(time);
		const arr: string[] = [];

		if (data.time) {
			const hour = data.time.hour;
			const minute = data.time.minute.toString().padStart(2, "0");
			const period = data.time.period;
			arr.push(`${hour}:${minute} ${period}`);
		}

		if (data.date) {
			const { year, month, day } = data.date;
			arr.push(`${day}/${month}/${year}`);
		}

		const content = arr.join("\n");
		if (content.trim() == "") {
			return await i.reply({
				content: "Invalid time provided.",
			});
		}

		await i.reply({
			content: arr.join("\n"),
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

function parseDateTime(input: string) {
	const timeRegex = /(\d{1,2})(?::(\d{2}))?(am|pm)/i;
	const dateRegex = /(\d{1,2})\/(\d{1,2})(?:\/(\d{4}))?/;

	const timeMatch = input.match(timeRegex);
	const dateMatch = input.match(dateRegex);

	const result: {
		time?: { hour: number; minute: number; period?: string };
		date?: { day: string; month: string; year: string };
	} = {};

	if (timeMatch) {
		const hour = parseInt(timeMatch[1], 10);
		const minute = timeMatch[2] ? parseInt(timeMatch[2], 10) : 0;
		const period = timeMatch[3].toLowerCase();
		result.time = { hour, minute, period };
	}

	if (dateMatch) {
		result.date = {
			day: dateMatch[1],
			month: dateMatch[2],
			year: dateMatch[3] || new Date().getFullYear().toString(),
		};
	}

	return result;
}
