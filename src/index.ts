if (import.meta.main) {
  const discordToken = Deno.env.get("DISCORD_TOKEN");
  console.log(discordToken);
}
