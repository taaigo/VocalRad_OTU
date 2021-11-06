import { Message } from "discord.js";

module.exports = {
  name: "playurl",
  description: "play a song using a video URL from a Youtube video.",

  async execute(message: Message, args: string[]) {
    const ytdl = require("ytdl-core");
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

    const connection = await message.member!.voice.channel.join();
    connection.voice!.setSelfDeaf(true);
    const ytdispatcher = connection.play(ytdl(videourl));

    ytdispatcher.on("start", () => {
      //            message.channel.send(`You are now playing \`${song.title}\``);

      message.channel.send({
        embed: {
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
        },
      });

      ytdispatcher.on("error", console.error);
    });

    ytdispatcher.on("finish", () => {
      message.channel.send(`The song has been ended!`);
      message.guild!.me!.voice.channel!.leave();
      ytdispatcher.on("error", console.error);
    });
  },
};
