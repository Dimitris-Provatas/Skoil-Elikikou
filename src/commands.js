const e = require("express");
const fs = require("fs");
const memeDirectoryPath = './src/memes/';
const memeDirectories = getMemeDirectories(memeDirectoryPath);

const player = {
    connection: null,
    voiceChannel: null,
    playQueue: [],
};

const commands = [
    "help => αυτό το μήνυμα",
    "files_available => η δομή των φακέλων με τα mp3 αρχεία για τα voice chats",
    "join => μπαίνω στο voice chat που βρίσκεσαι, αν δεν είσαι σε κάποιο κάνω το κορόιδο",
    "leave => φεύγω από το voice chat που είμαι (επίσης χρήσιμο για όταν κολλάω)",
    "play => αν μετα βάλεις όνομα φακέλου και όνομα αρχείου, ενώ είμαι σε κάποιο voice chat, αναπαράγω το αρχείο",
];


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

async function PerformCommands(bot, message)
{
    var command = message.content.substr(message.content.indexOf(' ') + 1);
    if (
        command.indexOf('{') !== -1 &&
        command.indexOf('}') !== -1 &&
        command.indexOf(';') !== -1
    )
    {
        await message.channel.send(`${message.author} ξέρω τι πας να κάνεις εκεί, κακό! Kρίμα που τώρα οι <@&488730147894198273> θα μάθουν τι πήγες να κάνεις!`);
        return;
    }

    if (command.startsWith("play "))
    {
        command = command.split(" ");
        const dir = command[1];
        const file = command[2];

        eval("try { play(bot, message, dir, file); } catch(err) { console.log(err) }");
    }
    else
    {
        command += "(bot, message);";
        try
        {
            eval(`try { ${command} } catch(err) { console.log(err) }`);
        }
        catch (err)
        {
            await message.channel.send(`Δεν υπάρχει αυτό το command ${message.author}! Για να δεις τις εντολές, γράψε: \`\`\`skoil help\`\`\``);
            console.log(err);
        }
    }
}

async function play(bot, message, dir, file)
{
    const target = memeDirectoryPath + dir + "/" + file + ".mp3";

    if (!player.voiceChannel)
    {
        await message.channel.send(`Δεν είμαι σε κάποιο voice channel ${message.author}! Για να έρθω στο κανάλι που είσαι, γράψε: \`\`\`skoil join\`\`\``);
        return;
    }

    if (!fs.existsSync(target))
    {
        await message.channel.send(`Δεν υπάρχει αυτό το αρχείο ${message.author}! Για να δεις τα αρχεία, γράψε: \`\`\`skoil files_available\`\`\``);
        return;
    }

    if (player.playQueue.length == 0)
    {
        player.playQueue.push(target);
        playSound(message, target);
    }
    else
    {
        player.playQueue.push(target);
        await message.channel.send(`Added to queue: ${file}`);
    }
}

async function playSound(message, target)
{
    await message.channel.send(`Now Playing: ${target.substr(target.lastIndexOf('/')).substr(1)}`);
    await player.connection.play(target).on("finish", () =>
    {
        player.playQueue.shift();
        if (player.playQueue.length > 0)
            playSound(message, player.playQueue[0]);
    });
}

async function join(bot, message)
{
    player.voiceChannel = message.member.voice.channel || null;
    if (!player.voiceChannel)
    {
        await message.channel.send(`${message.author} δεν είσαι σε Voice Channel.`);
        return;
    }

    player.voiceChannel.join().then(async con => {
        player.connection = con;
    }).catch(err => { console.log(err); });;
}

async function leave(bot, message)
{
    if (player.voiceChannel)
    {
        await message.channel.send("ΑΝΤΕ ΓΕΙΑ!");
        await player.voiceChannel.leave();
        player.playQueue = [];
        player.connection = null;
        player.voiceChannel = null;
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

function dummy(bot, message)
{
    return;
}

module.exports = {
    PerformCommands,
}