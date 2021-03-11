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

async function NotRightchannel(bot, message)
{
    if (!message.content.startsWith("skoil") || !message.content.startsWith("σκοιλ")) return;

    // await message.delete(1);
    await message.channel.send(`${message.author} τα requests πάνε στο σωστό κανάλι.`);
    return;
}

module.exports = {
    HandleDM,
    HandleHuman,
    NotRightchannel,
}