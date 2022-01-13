module.exports = {
  name: "radio",
  description:
    "Let's you play radio stations.\nSee the `stations` command for avalible stations.",

  async execute(Discord, message, args) {
    const radstats = require("../radiostations.json");
    let argsString = args.join(" ").toLowerCase();

    let stationnames = radstats.names;
    let stationurls = radstats.urls;
    let stationtitles = radstats.titles;
    let selstation;

    if (!message.member.voice.channel) {
      //when you arent in a vc the code will return
      message.channel.send("You must be in a voice channel.");
      return;
    }

    console.log("attempted");
  
      let radioindex = stationnames.indexOf(argsString);
      console.log("radioindex = " + radioindex)
      let choiceUrl = stationurls[radioindex]; //gets the exact url you need

      if (!choiceUrl) return message.channel.send('error desu');

      const connection = await message.member.voice.channel.join(); // makes the bot join the vc
      connection.voice.setSelfDeaf(true);

      console.log("choiceurl = " + choiceUrl);

      const dispatcher = connection.play(choiceUrl); // plays the radiostation

      dispatcher.on("start", () => {
        message.channel.send(
          `You are now listening to ${stationtitles[radioindex]}`
        ); //sends this message when the bot starts playing music
        dispatcher.on("error", console.error);
      });

      dispatcher.on("error", () => {
        console.error;
        message.channel.send(
          "There was an error trying to play: " + argsString
        );
      }); //some error shit
  },
};
