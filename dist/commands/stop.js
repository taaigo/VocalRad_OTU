"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    name: "stop",
    description: "Stops the song that is playing and makes the bot leave the voice channel.",
    execute: function (message, args) {
        if (!message.member.voice.channel) {
            message.channel.send("You have to be in a vc to stop the music.");
            return;
        }
        try {
            message.guild.me.voice.channel.leave();
            message.channel.send("Thankyou for listening! I'll always be here");
        }
        catch (_a) {
            message.channel.send("I'm not in a voice channel");
        }
    },
};
