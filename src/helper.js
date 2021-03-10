const fs = require('fs');
const suggestionsFile = "./src/my_logs/suggestions.txt";

function GetTime()
{
    var d = new Date();
    return ReplaceAll(d.toISOString().replace("T", " ").replace("Z", ""), "-", "/");
}

function ReplaceAll(string, search, replace)
{
    return string.split(search).join(replace);
}

function GetMentions(bot, msg)
{
    var mention = msg.author;
    var mentions = Array.from(msg.mentions.users.keys());

    if (mentions.length > 0)
        mention = msg.mentions.users.get(mentions[mentions.length - 1]);

    while (mentions.includes(bot.user.id))
    {
        if (mentions.length === 1)
            mentions = [];
        else
            mentions = mentions.splice(mentions.indexOf(bot.user.id) - 1, 1);


        if (mentions.length > 0)
            mention = msg.mentions.users.get(mentions[mentions.length - 1]);
        else
            mention = msg.author;
    }

    return mention;
}

function Suggestion(suggestion, author, server)
{
    const time = GetTime();
    fs.appendFile(suggestionsFile, `${time}: O \'${author}\' από τον σέρβερ \'${server}\' προτίνει: ${suggestion}\r\n`, function (err)
    {
        if (err)
            console.log(err);
        else
            console.log(`${time}: O ${author} έκανε μία πρότασή!`);

        console.log(`----------------------------------------------------------------------------------------------------------------------------`);
    });
}

function ConsoleError(type, user, server, channel)
{
    const time = GetTime();
    console.log(`${time}: No action taken for ${type} ${user} on server \'${server}\' in channel \'${channel}\'!`);
    console.log(`----------------------------------------------------------------------------------------------------------------------------`);
}

module.exports = {
    GetTime,
    GetMentions,
    Suggestion,
    ConsoleError,
    ReplaceAll,
}