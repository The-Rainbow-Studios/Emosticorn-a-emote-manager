const { EmbedBuilder, ActionRowBuilder } = require("discord.js");
const config = require("../../botconfig/config.js");
var ee = require("../../botconfig/embed.js");
const settings = require("../../botconfig/settings.js");
const btn = require("../../botconfig/components.js");
module.exports = {
  name: "invite", //the command name for execution & for helpcmd [OPTIONAL]
  category: "General",
  cooldown: 5, //the command cooldown for execution & for helpcmd [OPTIONAL]
  description: "Sends you an invite link", //the command description for helpcmd [OPTIONAL]
  memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  run: async (client, interaction) => {
    try {
      //things u can directly access in an interaction!
      const {
        member,
        channelId,
        guildId,
        applicationId,
        commandName,
        deferred,
        replied,
        ephemeral,
        options,
        id,
        createdTimestamp,
      } = interaction;
      const { guild } = member;
      interaction.reply({
        ephemeral: true,
        embeds: [
          new EmbedBuilder()
            .setColor(ee.color)
            .setFooter({ text: ee.footertext, iconURL: ee.footericon })
            .setDescription(
              `[**Click here to invite me!**](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=9209484003393&scope=applications.commands%20bot)||`
            ),
        ],
        components: [new ActionRowBuilder().addComponents([btn.invite, btn.support, btn.github])],
      });
    } catch (e) {
      console.log(String(e.stack).bgRed);
    }
  },
};
