const helper = require("./helper");
const commands = require("./commands");

function HandleDM(bot, message)
{
    console.log("DM Resived: " + message.content);
}

function HandleHuman(bot, message)
{
    commands.PerformCommands(bot, message);
    return;
}

async function NotRightchannel(bot, message)
{
    const response = await message.channel.send(`${message.author} τα requests να πάνε στο σωστό κανάλι.`);
    await message.delete({ timeout: 1 });
    await response.delete({ timeout: 10000 });
    return;
}

module.exports = {
    HandleDM,
    HandleHuman,
    NotRightchannel,
}