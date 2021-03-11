const helper = require("./helper");
const commands = require("./commands");

function HandleDM(bot, message)
{
    console.log("DM Resived: " + message.content);
}

function HandleHuman(bot, message)
{
    if (message.content.startsWith("skoil") || message.content.startsWith("σκοιλ"))
    {
        commands.PerformCommands(bot, message);
        return;
    }
}

module.exports = {
    HandleDM,
    HandleHuman,
}