import { z } from "zod";

const envSchema = z.object({
	DISCORD_TOKEN: z.string(),
	DISCORD_CLIENT_ID: z.string(),
});

export function fetchConfig() {
	const envVars = Deno.env.toObject();
	return envSchema.parse(envVars);
}

export default fetchConfig();
