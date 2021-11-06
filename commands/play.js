module.exports = {
    name: "play",
    description: "Allows you to play a song using it's name.",

    async execute(Discord, message, args) {
        let yts = require('yt-search');
        let ytdl = require('ytdl-core');

        if (!message.member.voice.channel) { //when you arent in a vc the code will return
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

          const connection = await message.member.voice.channel.join();
          connection.voice.setSelfDeaf(true);
          const searchdispatcher = connection.play(ytdl(searchUrl));

          searchdispatcher.on('start', () => {
//            message.channel.send(`You are now playing \`${searchTitle}\`\nDuration: \`${video[0].timestamp}\``);


              message.channel.send({ embed: {
                color: "ffffff",
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
              }
            });


              searchdispatcher.on('error', console.error);
          });

          searchdispatcher.on('finish', () => {
            message.channel.send('The song has been ended!');
            message.guild.me.voice.channel.leave();
              searchdispatcher.on('error', console.error);
          });
    }
}