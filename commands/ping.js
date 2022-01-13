module.exports = {
    name: "ping",
    description: "test command",
    
    execute(Discord, message, args) {
        message.channel.send("passed");
    },
};