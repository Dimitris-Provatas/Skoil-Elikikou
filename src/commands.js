const fs = require("fs");
const memes = fs.readdirSync('./src/memes/');
const commands = [
    "help",
    "available_files",
]

async function PerformCommands(bot, author, channel, command)
{
    if (command.indexOf(" ") != -1)
    {
        await channel.send(`Ρε ποκοπίκο ${author}, δεν μπορείς να έχεις πάνω από 1 κενό στην εντολή σου!`);
        return;
    }

    command += "(bot, author, channel)";
    eval(command);
}

async function help(bot, author, channel)
{
    var help = `${author} οι διαθέσιμες εντολές είναι:\r\n\`\`\`\r\n`;
    commands.forEach(command =>
    {
        help += `${command}\r\n`;
    });
    help += "\`\`\`";

    await channel.send(help);
}

async function available_files(bot, author, channel)
{
    var message = `${author} τα διαθέσιμα αρχεία είναι:\r\n\`\`\`\r\n`;
    memes.forEach(meme =>
    {
        message += `- ${meme}\r\n`;
    });
    message += "\`\`\`";

    await channel.send(message);
}

module.exports = {
    PerformCommands,
}