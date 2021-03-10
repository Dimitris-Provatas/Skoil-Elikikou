const helper = require("./helper");

function HandleDM(bot, message)
{
    console.log("DM Resived: " + message.content);
}

function HandleHumam(bot, message)
{

}

module.exports = {
    HandleDM,
    HandleHumam,
}