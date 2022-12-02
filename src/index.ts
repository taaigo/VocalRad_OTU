import { Message, Client } from "../types/discord.js";
const { Client, Collection, Intents } = require("discord.js");

import * as fs from "fs";
const client: Client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });
client.commands = new Collection();
require('dotenv').config();

client.on("ready", () => {
  console.log("the bot is ready");
});

const commandFiles = fs
  .readdirSync("./dist/commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.on("messageCreate", async (message: Message) => {
  let prefix = process.env.prefix as string;

  if (!message.guild || message.author.bot || !message.content.startsWith(prefix)) return;

  let args = message.content.slice(prefix.length).trim().split(/ +/);
  let cmd = args.shift()?.toLowerCase();

  if (!message.content.startsWith(prefix)) return;
  if (!client.commands.has(cmd)) return;

  try {
    client.commands.get(cmd).execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply("error desu");
  }
});

client.login(process.env.token);
