"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    name: "ping",
    description: "test command",
    execute: function (message, args) {
        message.channel.send("passed");
    },
};
