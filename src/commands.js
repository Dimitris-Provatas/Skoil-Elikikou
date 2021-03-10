const fs = require("fs");
const memeDirectoryPath = './src/memes/';
const memeDirectories = getMemeDirectories(memeDirectoryPath);

function helpMessage(author)
{
    var help = `${author} οι διαθέσιμες εντολές είναι:\r\n\`\`\`\r\n`;
    commands.forEach(command =>
    {
        help += `- ${command}\r\n`;

        if (command === "play")
        {
            memeDirectories.forEach((memeDirectory, idx) =>
            {
                help += ` |-> ${memeDirectory}\r\n`;
                const memeDirectoryContents = fs.readdirSync(memeDirectoryPath + memeDirectory + "/");
                if (idx === memeDirectories.length - 1)
                    memeDirectoryContents.forEach(memeDirectoryContent => {
                        help += `     |-> ${memeDirectoryContent}\r\n`;
                    });
                else
                    memeDirectoryContents.forEach(memeDirectoryContent => {
                        help += ` |   |-> ${memeDirectoryContent}\r\n`;
                    });
            });
        }
    });
    help += "\`\`\`";

    return help;
}

function getMemeDirectories(path)
{
    return fs.readdirSync(path, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
}

const commands = [
    "help",
    "play"
]

async function PerformCommands(bot, message, command)
{
    if (command === "play")
    {
        command = command.split(" ");
        const dir = command[1];
        const file = command[2];

        eval("play(bot, message, func, dir, file)")
    }
    else
    {
        command += "(bot, message)";
        eval(command);
    }
}

async function play(bot, message, dir, file)
{
    const vc = message.member.voice.channel;
    if (!vc)
    {
        await message.channel.send(`${message.author} δεν είσαι σε Voice Channel.`);
        return;
    }

    await vc.play(memeDirectoryPath + dir + "/" + file).then(() =>
    {
        await vc.leave();
    });
}

async function help(bot, message)
{
    await channel.send(helpMessage(message.author));
}

module.exports = {
    PerformCommands,
}