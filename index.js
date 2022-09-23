const Discord = require("discord.js");
const fs = require("fs");
const client = new Discord.Client();
client.commands = new Discord.Collection();
require('dotenv').config();

client.on("ready", () => {
  console.log("the bot is ready");
});

const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.on("message", async (message) => {
  let prefix = process.env.prefix;

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
