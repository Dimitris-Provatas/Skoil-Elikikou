const botInit = require("./bot");
const keepAlive = require("./server");

init();

async function init() {
  await botInit();
  keepAlive();
}
