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

async function NotRightChannel(bot, message)
{
    const response = await message.channel.send(`${message.author} τα requests να πάνε στο σωστό κανάλι (hint: είναι το <#518904659461668868>).`);
    await message.delete({ timeout: 1 });
    await response.delete({ timeout: 10000 });
    return;
}

module.exports = {
    HandleDM,
    HandleHuman,
    NotRightChannel,
}