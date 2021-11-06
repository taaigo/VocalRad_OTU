import { Message } from "discord.js";

module.exports = {
  name: "stations",
  description: "Shows a list with all avalible radio stations.",

  execute(message: Message, args: string[]) {
    let prefix = process.env.prefix as string;
    const radstats: any = require("../radiostations.json");
    let stationtitles = radstats.titles;
    let stationnames = radstats.names;

    message.channel.send({
      embed: {
        author: {
          //icon_url: client.user.displayAvatarURL(),
          name: message.client.user!.username + "'s Available stations",
        },
        color: "ffffff",
        description: "Listed radio stations",
        fields: [
          {
            name: `${stationtitles[0]}`,
            value: `command: ${prefix}radio ${stationnames[0]}`,
          },
          {
            name: `${stationtitles[1]}`,
            value: `command: ${prefix}radio ${stationnames[1]}`,
          },
          {
            name: `${stationtitles[2]}`,
            value: `command: ${prefix}radio ${stationnames[2]}`,
          },
          {
            name: `${stationtitles[3]}`,
            value: `command: ${prefix}radio ${stationnames[3]}`,
          },
          {
            name: `${stationtitles[4]}`,
            value: `command: ${prefix}radio ${stationnames[4]}`,
          },
          {
            name: `${stationtitles[5]}`,
            value: `command: ${prefix}radio ${stationnames[5]}`,
          },
        ],
        timestamp: new Date(),
        footer: {
          //icon_url: client.user.displayAvatarURL(),
          text: "Logo by FireyJS\nCreated by Maru and Taigo",
        },
      },
    });
  },
};
