const helper = require("./helper");
const commands = require("./commands");

async function HandleDM(bot, message) {
  if (message.author.bot) return;

  if (message.content.startsWith("meme ")) {
    if (
      message.content.includes("{") &&
      message.content.endsWith("}") &&
      message.content.includes('"target"') &&
      message.content.includes('"message"')
    ) {
      console.log(`Ο ${message.author.tag} memeάρει με: ${message.content}`);
      console.log(
        "----------------------------------------------------------------------------------------------------------------------------",
      );

      const payload = JSON.parse(message.content.split("meme ")[1]);

      let targetId = false;

      console.log(
        bot.guilds.array().forEach((guild) => {
          bot.guilds
            .get(guild.id)
            .fetchMembers()
            .then((res) => {
              res.members.array().forEach((u) => {
                return u.username == payload.target;
              });
            });
        }),
      );

      try {
        targetId = Object.keys(bot.users).filter(
          (u) => u.username === payload.target,
        ).id;
      } catch (err) {
        console.log(
          `O ${message.author.tag} μου ζήτησε να βρω τον ${payload.target} και δεν τον βρήκα.`,
        );
        console.log(
          "----------------------------------------------------------------------------------------------------------------------------",
        );
      }

      if (targetId) {
        await message.author.send("Σε έχω, στέλνω τώρα!");
        await bot.users
          .get(targetId)
          .send(payload.message)
          .then(
            async () => {
              await message.author.send("Έφτασε το meming σου!");
            },
            async (error) => {
              console.log(error);
              console.log(
                "----------------------------------------------------------------------------------------------------------------------------",
              );
              await message.author.send(
                `Κάτι πήγε στραβά και δεν μπόρεσα να παραδώσω το μήνυμα! Το πρόβλημα ήταν: \`\`\`${error.name}: ${error.message}\`\`\``,
              );
            },
          );
      } else
        message.author.send(
          "Δεν βρήκα τον στόχο. Πρέπει να είναι κάποιος που να έχω τουλαχιστον έναν σέρβερ κοινό!",
        );
    }
  }
}

function HandleHuman(bot, message) {
  commands.PerformCommands(bot, message);
  return;
}

async function NotRightChannel(bot, message) {
  const response = await message.channel.send(
    `${message.author} τα requests να πάνε στο σωστό κανάλι (hint: είναι το <#518904659461668868>).`,
  );
  await message.delete({ timeout: 1 });
  await response.delete({ timeout: 10000 });
  return;
}

module.exports = {
  HandleDM,
  HandleHuman,
  NotRightChannel,
};
