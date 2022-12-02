import { joinVoiceChannel, createAudioPlayer, NoSubscriberBehavior, createAudioResource, StreamType, AudioPlayerStatus } from "@discordjs/voice";
import { Message, MessagePayload } from "../../types/discord.js";

module.exports = {
  name: "playurl",
  description: "play a song using a video URL from a Youtube video.",

  async execute(message: Message, args: string[]) {
    const ytdl = require("ytdl-core-discord");
    const yts = require("yt-search");
    console.log(args);
    let videourl = args[0];

    if (!message.member!.voice.channel) {
      //when you arent in a vc the code will return
      message.channel.send("You must be in a voice channel.");
      return;
    } else if (!videourl) {
      message.channel.send("you must specify a youtube link");
      console.log("denied: args[0] isn't defined");
      return;
    } else if (!videourl.startsWith("https://")) {
      message.channel.send("You must send a youtube link.");
      return;
    }

    let urlsearch = await yts(videourl);
    let videosr = urlsearch.all;
    let videopu = videosr[0];

    const songInfo = await ytdl.getInfo(videourl).catch(console.error);

    if (!songInfo) {
      console.log("denied: varied error => check details above");
      message.channel.send("Error desu");
      return;
    }

    const song = {
      title: songInfo.videoDetails.title,
      url: songInfo.videoDetails.video_url,
    };

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

    let ytdlstream = await ytdl(videourl, { highWaterMark: 1 << 25, filter: 'audioonly', });
    const audio = createAudioResource(ytdlstream, { inputType: StreamType.Opus });

    player.play(audio);

    const subscription = connection.subscribe(player);

    player.on(AudioPlayerStatus.Playing, () => {
      //            message.channel.send(`You are now playing \`${song.title}\``);

      // Prevent the playing message from being posted twice due to a glitch caused by ytdl
      const lm = message.channel.lastMessage;
      if (lm!.author.id === message.client.user?.id && lm!.embeds[0].title?.includes("You are now playing:")) return;

      message.channel.send({
        embeds: [{
          color: "ffffff",
          title: `You are now playing: \`${song.title}\``,
          thumbnail: {
            url: videopu.thumbnail,
          },
          fields: [
            {
              name: "**Duration:**",
              value: `\`${videopu.timestamp}\``,
            },
            {
              name: "**Author:**",
              value: videopu.author.name,
            },
            {
              name: "Uploaded:",
              value: videopu.ago,
            },
          ],
        }],
      } as unknown as MessagePayload);

      player.on("error", console.error);
    });

    player.on(AudioPlayerStatus.Idle, () => {
      if (!audio.ended) return;
      message.channel.send(`The song has been ended!`);
      subscription!.unsubscribe();
      connection.disconnect();
      connection.destroy();
      player.on("error", console.error);
    });
  },
};
