const { ButtonBuilder, ButtonStyle } = require("discord.js");
module.exports = {
  support: new ButtonBuilder()
    .setStyle(5)
    .setEmoji(`883977796785942528`)
    .setLabel(`Support Server`)
    .setURL("https://discord.gg/e3CkRXy7HD"),
  github: new ButtonBuilder()
    .setStyle(5)
    .setEmoji(`1102466706699460618`)
    .setLabel(`Source Code`)
    .setURL(
      "https://github.com/The-Rainbow-Studios/Emosticorn-a-emote-manager"
    ),
  invite: new ButtonBuilder()
    .setStyle(5)
    .setEmoji(`1090255070018420747`)
    .setLabel(`Invite me`)
    .setURL(
      "https://discord.com/api/oauth2/authorize?client_id=1108082178216185896&permissions=9211631488065&scope=bot%20applications.commands"
    ),
};
