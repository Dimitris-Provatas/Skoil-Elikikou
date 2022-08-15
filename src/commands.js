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
    "files [directory name] => τα ονόματα των φακέλων με τα mp3 αρχεία για τα voice chats, αν δωθεί 'directory name' δείχνω τα αρχεία του φακέλου",
    "join => μπαίνω στο voice chat που βρίσκεσαι, αν δεν είσαι σε κάποιο, κάνω το κορόιδο",
    "leave => φεύγω από το voice chat που είμαι (επίσης χρήσιμο για όταν κολλάω)",
    "play => αν μετα βάλεις όνομα φακέλου και όνομα αρχείου, ενώ είμαι σε κάποιο voice chat, αναπαράγω το αρχείο",
    "prune [0 - ∞: number] => σβήνω τις μαλακίες που έγραψες εσύ και οι άλλοι βλάκες νωρίτερα",
];


async function helpMessage(message)
{
    var help = `${message.author} οι διαθέσιμες εντολές είναι:\r\n\`\`\`\r\n`;
    commands.forEach(command =>
    {
        help += `-> ${command}\r\n`;
    });
    help += "\`\`\`";

    message.channel.send(help);
}

async function dirsMessage(message, extra = null)
{
    if (extra !== undefined && extra !== 'undefined')
    {
        filesMessage(message, extra);
        return;
    }

    var response = `${message.author}, οι φάκελοι είναι:\`\`\``;

    memeDirectories.forEach(memeDirectory =>
    {
        response += `- ${memeDirectory}\r\n`;
    });

    response += "\`\`\`";

    await message.channel.send(response);
}

async function filesMessage(message, extra)
{
    var response = `${message.author}, τα αρχεία του φακέλου ${extra} είναι:\r\n\`\`\``;

    const memeDirectoryContents = fs.readdirSync(memeDirectoryPath + extra + "/");
    memeDirectoryContents.forEach(memeDirectoryContent => {
        response += `${memeDirectoryContent}, `;
    });

    response += "\`\`\`";

    await message.channel.send(response);
}

function getMemeDirectories(path)
{
    return fs.readdirSync(path, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);
}

async function PerformCommands(bot, message)
{
    var command = message.content.substr(message.content.indexOf(' ') + 1).toLowerCase().toString();
    if (
        command.indexOf('{') !== -1 &&
        command.indexOf('}') !== -1
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
        command = command.split(" ");
        command[0] += `(bot, message, '${command[1]}');`;

        try
        {
            eval(`try { ${command[0]} } catch(err) { console.log(err) }`);
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
        await message.channel.send(`Δεν υπάρχει αυτό το αρχείο ${message.author}! Για να δεις τα αρχεία, γράψε: \`\`\`skoil files <folder_name?>\`\`\``);
        return;
    }

    if (player.playQueue.length == 0)
    {
        player.playQueue.push(target);
        playSound(message, target, dir, file);
    }
    else
    {
        player.playQueue.push({target, dir, file});
        message.channel.send(`Added to queue: ${dir}/${file}.mp3`);
    }
}

async function playSound(message, target, dir, file)
{
    await message.channel.send(`Now Playing: ${dir}/${file}.mp3`);
    player.connection.play(target).on("finish", () =>
    {
        player.playQueue.shift();
        if (player.playQueue.length > 0)
            playSound(message, player.playQueue[0].target, player.playQueue[0].dir, player.playQueue[0].file);
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
    helpMessage(message);
}

async function files(bot, message, extra)
{
    dirsMessage(message, extra);
}

async function ping(bot, message)
{
    await message.channel.send(`Pong ρε μαλάκα ${message.author}!`);
}

async function prune(bot, message, number)
{
    if (number === 69 || number === 420 || number === 69420)
    {
        await message.channel.send(`LOL, NICE, μου αρέσει ο τρόπος που σκέφτεσαι ${message.author}! Αλλά δεν μπορώ να το κάνω αυτό. Oopsie, αλλά λολ και λεφμάο!`);
        return;
    }

    await message.channel.send(`${message.author} δεν επιτρέπεται αυτό! ΆΝΤΕ!`);
}

function dummy(bot, message)
{
    return;
}

module.exports = {
    PerformCommands,
}