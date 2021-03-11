const fs = require("fs");
const memeDirectoryPath = './src/memes/';
const memeDirectories = getMemeDirectories(memeDirectoryPath);

var playQueue = [];
var isPlaying = false;

function helpMessage(author)
{
    var help = `${author} οι διαθέσιμες εντολές είναι:\r\n\`\`\`\r\n`;
    commands.forEach(command =>
    {
        help += `-> ${command}\r\n`;
    });
    help += "\`\`\`";

    return help;
}

function filesMessage(author)
{
    var available = `${author} οι διαθέσιμες εντολές είναι:\r\n\`\`\`\r\n`;

    memeDirectories.forEach((memeDirectory, idx) =>
    {
        available += `-> ${memeDirectory}\r\n`;
        const memeDirectoryContents = fs.readdirSync(memeDirectoryPath + memeDirectory + "/");
        memeDirectoryContents.forEach(memeDirectoryContent => {
            available += `${memeDirectoryContent}, `;
        });
        available += "\r\n\r\n";
    });

    available += "\`\`\`";

    return available;
}

function getMemeDirectories(path)
{
    return fs.readdirSync(path, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
}

const commands = [
    "help",
    "files_available",
    "play",
]

async function PerformCommands(bot, message)
{
    var command = message.content.substr(message.content.indexOf(' ') + 1);

    if (command.startsWith("play "))
    {
        command = command.split(" ");
        const dir = command[1];
        const file = command[2];

        eval("play(bot, message, dir, file);");
    }
    else
    {
        command += "(bot, message);";
        eval(command);
    }
}

async function play(bot, message, dir, file)
{
    const vc = message.member.voice.channel || null;
    if (!vc)
    {
        await message.channel.send(`${message.author} δεν είσαι σε Voice Channel.`);
        return;
    }

    playQueue.push(memeDirectoryPath + dir + "/" + file + ".mp3");
    console.log(playQueue);

    if (!isPlaying)
    {
        vc.join().then(async connection =>
        {
            isPlaying = true;

            while (playQueue.length > 0)
            {
                const target = playQueue.shift();
                await message.channel.send(`Now Playing: ${target.substr(target.lastIndexOf('/')).substr(1)}`);
                await connection.play(target);
            }

            await vc.leave();
            isPlaying = false;
        }).catch(err => { console.log(err); });
    }
}

async function help(bot, message)
{
    await message.channel.send(helpMessage(message.author));
}

async function files_available(bot, message)
{
    await message.channel.send(filesMessage(message.author));
}

module.exports = {
    PerformCommands,
}