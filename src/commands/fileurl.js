module.exports = {
    name: "fileurl",
    description: "Allows you to use a URL of an file instead,\nthis includes most formats that ffmpeg supports including video such as mp4.",

    async execute(message, args) {

        let fileUrl = args[0];
  
        if (!message.member.voice.channel) { //when you arent in a vc the code will return
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

        const connection = await message.member.voice.channel.join();
        connection.voice.setSelfDeaf(true);
        const filedispatcher = connection.play(fileUrl);

        filedispatcher.on('start', () => {
          message.channel.send('Your file is now being played');
            filedispatcher.on('error', console.error);
        });

        filedispatcher.on('finish', () => {
          message.channel.send('The song has been ended!');
          message.guild.me.voice.channel.leave();
            filedispatcher.on('error', console.error);
        });
    },
};
