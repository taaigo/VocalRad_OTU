import { Message } from "../../types/discord.js";

module.exports = {
    name: "ping",
    description: "test command",
    
    execute(message: Message, args: string[]) {
        message.channel.send("passed");
    },
};
