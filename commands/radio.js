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

    if (stationtitles.find(stationtitle => stationtitle.toLowerCase() == argsString)) {
      selstation = stationtitles.find(stationtitle => stationtitle.toLowerCase() == argsString);
    } else if (stationnames.find(stationtitle => stationtitle.toLowerCase() == argsString)) {
      selstation = stationnames.find(stationtitle => stationtitle.toLowerCase() == argsString);
    }
    
    if (!selstation) {
      return message.channel.send('Channel not available.');
    } else {

      let radioindex = stationtitles.indexOf(selstation) != -1 ? stationtitles.indexOf(selstation) : stationnames.indexOf(selstation) != -1 ? stationnames.indexOf(selstation) : false; //gets the arrayindex of the channel that the users mentions
      let choiceUrl = stationurls[radioindex]; //gets the exact url you need

      if (!radioindex) return message.channel.send('error desu');

      const connection = await message.member.voice.channel.join(); // makes the bot join the vc
      connection.voice.setSelfDeaf(true);

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
    }
  },
};
