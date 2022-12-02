import {
  AudioPlayerStatus,
  joinVoiceChannel,
  createAudioPlayer,
  NoSubscriberBehavior,
  createAudioResource,
  StreamType,
  VoiceConnectionStatus,
  entersState
} from "@discordjs/voice";

module.exports = {
    name: "play",
    description: "Allows you to play a song using it's name.",

    async execute(message: import('../../types/discord.js').Message, args: string[]) {
        let ytdl = require('ytdl-core-discord');
        let yts = require('yt-search');
        let videoArs;
        let video: any;
        let searchUrl;
        let searchTitle: any;

        if (!message.member!.voice.channel) { //when you arent in a vc the code will return
            message.channel.send('You must be in a voice channel.');
            return;
          } else if (!args[0]) {
            message.channel.send("Please name a video");
            console.log("denied: args[0] isn't defined");
            return;
          } else if (args[0].startsWith('https://')) {
            message.channel.send('Please use the `playurl` command if you want to use a link.');
            console.log('denied: args[0] is a link.');
            return;
          } else if (args[0].startsWith('http://')) {
            message.channel.send('Please use the `playurl` command if you want to use a link.');
            console.log('denied: args[0] is a link.');
            return;
          }

          try {

          videoArs = await yts(args.join(" "));
          video = videoArs.all;
          searchUrl = video[0].url;
          searchTitle = video[0].title;

        } catch(err) {
          console.log(err);
          message.channel.send('Error desu');
          return;
        }

          console.log(`video found:\n
            title: ${video[0].title}
            description: ${video[0].description}
            timestamp: ${video[0].timestamp}
            videoId: ${video[0].videoId}
            url: ${video[0].url}
            ago: ${video[0].ago}
            `)

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

          const audio = createAudioResource(await ytdl(searchUrl, { highWaterMark: 1 << 25, filter: 'audioonly', }), { inputType: StreamType.Opus });

          player.play(audio);

          const subscription = connection.subscribe(player);

          connection.on(VoiceConnectionStatus.Disconnected, async (oldState, newState) => {
            try {
              await Promise.race([
                entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
                entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
              ]);
              // Seems to be reconnecting to a new channel - ignore disconnect
            } catch (error) {
              // Seems to be a real disconnect which SHOULDN'T be recovered from
              subscription!.unsubscribe();
              connection.destroy();
            }
          });

          player.on(AudioPlayerStatus.Playing, () => {
//            message.channel.send(`You are now playing \`${searchTitle}\`\nDuration: \`${video[0].timestamp}\``);

              // Prevent the playing message from being posted twice due to a glitch caused by ytdl
              const lm = message.channel.lastMessage;
              if (lm!.author.id === message.client.user?.id && lm!.embeds[0].title?.includes("You are now playing:")) return;

              message.channel.send({ embeds: [{
                  color: "ffffff" as unknown as undefined,
                  title: `You are now playing: \`${searchTitle}\``,
                  thumbnail:
                    {
                      url: video[0].thumbnail
                    },
                    fields: [
                      {
                        name: "**Duration:**",
                        value: `\`${video[0].timestamp}\``
                      },
                      {
                        name: "**Author:**",
                        value: video[0].author.name
                      },
                      {
                        name: "Uploaded:",
                        value: video[0].ago
                      }
                    ]
              }]
            } as unknown as import('../../types/discord.js').MessagePayload);


              player.on('error', console.error);
          });

          player.on(AudioPlayerStatus.Idle, () => {
            message.channel.send('The song has been ended!');
            subscription!.unsubscribe();
            connection.disconnect();
            connection.destroy();
            player.on('error', console.error);
          });
    }
}
