import * as Discord from "discord.js";
import * as fs from "fs";
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

client.on("message", async (message: Discord.Message) => {
  let prefix = process.env.prefix as string;

  if (!message.guild || message.author.bot || !message.content.startsWith(prefix)) return;

  let args = message.content.slice(prefix.length).trim().split(/ +/);
  let argsArray = message.content.slice(prefix.length).trim().split(""); // this too
  let cmd = args.shift()?.toLowerCase();

  /* this should be used in the command files where they are needed like the module requiring
  const taigosan = client.users.cache.get("285100690072797184");
  const marusan = client.users.cache.get("266032204243533825");
  */

  //	  console.warn(cmd)

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
