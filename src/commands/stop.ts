import { getVoiceConnection } from "@discordjs/voice";
import { Message } from "../../types/discord.js";

module.exports = {
  name: "stop",
  description: "Stops the song that is playing and makes the bot leave the voice channel.",
  
  execute(message: Message, args: string[]) {
    const connection = getVoiceConnection(message.guild!.id);
    if (!message.member!.voice.channel) {
      message.channel.send("You have to be in a vc to stop the music.");
      return;
    } else if (!connection) {
      return message.channel.send("The bot isn't connected to any vc.");
    }

    try {
      connection.disconnect();
      connection.destroy();
      message.channel.send("Thankyou for listening! I'll always be here");
    } catch {
      message.channel.send("I'm not in a voice channel");
    }
  },
};
