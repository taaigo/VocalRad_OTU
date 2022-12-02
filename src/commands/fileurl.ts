import { AudioPlayerStatus, createAudioPlayer, createAudioResource, joinVoiceChannel, NoSubscriberBehavior, StreamType } from "@discordjs/voice";
import { Message } from "../../types/discord.js";

module.exports = {
    name: "fileurl",
    description: "Allows you to use a URL of an file instead,\nthis includes most formats that ffmpeg supports including video such as mp4.",

    async execute(message: Message, args: string[]) {

        let fileUrl = args[0];
  
        if (!message.member!.voice.channel) { //when you arent in a vc the code will return
          message.channel.send('You must be in a voice channel.');
          return;
        } else
        if (!fileUrl) {
          message.channel.send("you must specify a link to a file");
          console.log("denied: args[0] isn't defined");
          return;
        } else
        if (!fileUrl.startsWith('https')) {
          message.channel.send('Please use a url to a file');
          console.log('denied: args[0] is not a link');
          return;
        } else
        if (!fileUrl.startsWith('http')) {
            message.channel.send('Please use a url to a file');
            console.log('denied');
            return;
        }

        const connection = joinVoiceChannel({
          channelId: message.member!.voice.channel.id,
          guildId: message.member!.voice.channel.guild.id,
          adapterCreator: message.member!.voice.channel.guild.voiceAdapterCreator,
        });
  
        const player = createAudioPlayer({
          behaviors: {
            noSubscriber: NoSubscriberBehavior.Pause,
          },
        });
  
        const audio = createAudioResource(fileUrl, { inputType: StreamType.Opus });
        
        player.play(audio); // plays the file

        connection.subscribe(player);

        player.on(AudioPlayerStatus.Playing, () => {
          message.channel.send('Your file is now being played');
          player.on('error', console.error);
        });

        player.on(AudioPlayerStatus.Idle, () => {
          message.channel.send('The song has been ended!');
          connection.disconnect();
          connection.destroy();
          player.on('error', console.error);
        });
    },
};
