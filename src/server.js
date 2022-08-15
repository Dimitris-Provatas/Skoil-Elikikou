const express = require("express");
const path = require("path");
const server = express();

const d = new Date();

server.all("/", (req, res) => {
  res.send("Skoil Elikikou Online!");
  // res.sendFile(path.join(__dirname + '/bot.html'));
});

function keepAlive() {
  const time = replaceAll(
    d.toISOString().replace("T", " ").replace("Z", ""),
    "-",
    "/",
  );
  server.listen(3000, () => {
    console.log(`${time}: Server is Ready!`);
  });
}

function replaceAll(string, search, replace) {
  return string.split(search).join(replace);
}

module.exports = keepAlive;
