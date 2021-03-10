const fs = require("fs")
const secrets = JSON.parse(fs.readFileSync('./src/secrets.json'));

const Discord = require('discord.js');
const bot = new Discord.Client();

const handler = require('./handler');
const helper = require("./helper");

function botInit()
{
    bot.login(secrets.token).then(
        () => {},
        error => { console.log(error); }
    );

    bot.on('ready', async () =>
    {
        const time = helper.GetTime();
        console.info(`${time}: Logged in as ${bot.user.tag}!`);
        bot.user.setActivity("memes flying out!",
        {
            type: "WATCHING",
        });
    });

    bot.on('guildCreate', guild => {
        guild.systemChannel.send("ΜΙΜΣ ΓΙΑ ΟΛΟΥΣ ΤΩΡΑΑΑΑΑΑ!!!!!!");
    });

    bot.on('message', async message =>
    {
        // console.log(message.content);

        // handle bots
        if (message.author.bot)
            return;
        // handle DMs
        else if (message.channel.type == "dm")
            await handler.HandleDM(bot, message);
        // handle humans
        else
            await handler.HandleHuman(bot, message);
    });
}

module.exports = botInit;