const {
  EmbedBuilder,
  parseEmoji,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require("discord.js");
const config = require("../../botconfig/config.js");
const ee = require("../../botconfig/embed.js");
const settings = require("../../botconfig/settings.js");
const btn = require("../../botconfig/components.js");
module.exports = {
  name: "list", //the command name for the Slash Command
  category: "Emotes",
  description: "Shows a list of the Emojis in this Server", //the command description for Slash Command Overview
  cooldown: 1,
  memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  options: [
    //OPTIONAL OPTIONS, make the array empty / dont add this option if you don't need options!
    //INFORMATIONS! You can add Options, but mind that the NAME MUST BE LOWERCASED! AND NO SPACES!!!, for the CHOCIES you need to add a array of arrays; [ ["",""] , ["",""] ]
    //{"Integer": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getInteger("ping_amount")
    //{"String": { name: "emoji", description: "The emoji to enlarge?", required: true, autocomplete: true }}, //to use in the code: interacton.getString("ping_amount")
    //{"User": { name: "ping_a_user", description: "To Ping a user lol", required: false }}, //to use in the code: interacton.getUser("ping_a_user")
    //{"Channel": { name: "what_channel", description: "To Ping a Channel lol", required: false }}, //to use in the code: interacton.getChannel("what_channel")
    //{"Role": { name: "what_role", description: "To Ping a Role lol", required: false }}, //to use in the code: interacton.getRole("what_role")
    //{"IntChoices": { name: "what_ping", description: "What Ping do you want to get?", required: true, choices: [["Bot", 1], ["Discord Api", 2]] }, //here the second array input MUST BE A NUMBER // TO USE IN THE CODE: interacton.getInteger("what_ping")
    // {
    // 	"StringChoices": {
    // 		name: "what_ping",
    // 		description: "What Ping do you want to get?",
    // 		required: false,
    // 		choices: [
    // 			["Bot", "botping"],
    // 			["Discord Api", "api"]
    // 		]
    // 	}
    // }, //here the second array input MUST BE A STRING // TO USE IN THE CODE: interacton.getString("what_ping")
  ],
  run: async (client, interaction) => {
    try {
      let list = [];
      let emojis = [];
      interaction.guild.emojis.cache.forEach((x) => emojis.push(x));
      if (emojis.size === 0)
        return interaction.reply({
          content: "There are no emojis in this server",
        });

      emojis = emojis.map((e, i) => `${i + 1}. ${e} \`\\${e}\``);
      for (var i = 0; i < emojis.length; i += 10) {
        const items = emojis.slice(i, i + 10);
        list.push(items.join("\n"));
      }
      let page = 0;
      let button1 = new ButtonBuilder()
        .setEmoji("⬅️")
        .setStyle(ButtonStyle.Primary)
        .setCustomId("previous")
        .setDisabled(true);
      let button2 = new ButtonBuilder()
        .setEmoji("⏹")
        .setStyle(ButtonStyle.Danger)
        .setCustomId("stop");
      let button3 = new ButtonBuilder()
        .setEmoji("➡️")
        .setStyle(ButtonStyle.Primary)
        .setCustomId("next");

      let buttons;
      if (list.length === 1) {
        buttons = new ActionRowBuilder().addComponents([
          btn.invite,
          btn.support,
          btn.github,
        ]);
      } else {
        buttons = new ActionRowBuilder().addComponents([
          button1,
          button2,
          button3,
        ]);
      }

      let e = new EmbedBuilder()
        .setDescription(list[page])
        .setFooter({
          text: `Page ${page + 1} of ${list.length} (${emojis.length} entries)`,
          iconURL: ee.footericon,
        })
        .setColor(ee.color);
      const msg = await interaction.reply({
        embeds: [e],
        components: [buttons],
      });
      let doing = true;
      while (doing) {
        let r;
        const filter = function (button) {
          if (button.user !== interaction.user) return button.deferUpdate();

          return (
            ["previous", "stop", "next"].includes(button.customId) &&
            button.user === interaction.user
          );
        };
        try {
          r = await msg.awaitMessageComponent({
            filter,
            time: 20000,
            errors: ["time"],
          });
        } catch (error) {
          return msg.edit({
            components: [
              new ActionRowBuilder().addComponents([
                btn.invite,
                btn.support,
                btn.github,
              ]),
            ],
          });
        }
        const u = interaction.user;
        if (r.customId == "next") {
          page++;
          r.deferUpdate();
          let newEmbed = new EmbedBuilder()
            .setDescription(list[page])
            .setFooter({
              text: `Page ${page + 1} of ${list.length} (${
                emojis.length
              } entries)`,
              iconURL: ee.footericon,
            })
            .setColor(ee.color);
          msg.edit({ embeds: [newEmbed], components: [buttons] });
          refreshButtons();
        } else if (r.customId == "previous") {
          page--;
          r.deferUpdate() && refreshButtons();

          let newEmbed = new EmbedBuilder()
            .setDescription(list[page])
            .setFooter({
              text: `Page ${page + 1} of ${list.length} (${
                emojis.length
              } entries)`,
              iconURL: ee.footericon,
            })
            .setColor(ee.color);
          msg.edit({ embeds: [newEmbed] });
        } else if (r.customId == "stop") {
          r.deferUpdate();
          let button1 = new ButtonBuilder()
            .setEmoji("⬅️")
            .setStyle(ButtonStyle.Primary)
            .setCustomId("previous")
            .setDisabled(true);
          let button2 = new ButtonBuilder()
            .setEmoji("⏹")
            .setStyle(ButtonStyle.Danger)
            .setCustomId("stop")
            .setDisabled(true);
          let button3 = new ButtonBuilder()
            .setEmoji("➡️")
            .setStyle(ButtonStyle.Primary)
            .setCustomId("next")
            .setDisabled(true);
          let buttons = new ActionRowBuilder().addComponents([
            button1,
            button2,
            button3,
          ]);
          msg.edit({
            components: [
              buttons,
              new ActionRowBuilder().addComponents([
                btn.invite,
                btn.support,
                btn.github,
              ]),
            ],
          });
          return;
        }
      }

      function refreshButtons() {
        if (!list[page - 1]) {
          let button1 = new ButtonBuilder()
            .setEmoji("⬅️")
            .setStyle(ButtonStyle.Primary)
            .setCustomId("previous")
            .setDisabled(true);
          let button2 = new ButtonBuilder()
            .setEmoji("⏹")
            .setStyle(ButtonStyle.Danger)
            .setCustomId("stop");
          let button3 = new ButtonBuilder()
            .setEmoji("➡️")
            .setStyle(ButtonStyle.Primary)
            .setCustomId("next");
          let buttons = new ActionRowBuilder().addComponents([
            button1,
            button2,
            button3,
          ]);
          msg.edit({ components: [buttons] });
        } else if (!list[page + 1]) {
          let button1 = new ButtonBuilder()
            .setEmoji("⬅️")
            .setStyle(ButtonStyle.Primary)
            .setCustomId("previous");
          let button2 = new ButtonBuilder()
            .setEmoji("⏹")
            .setStyle(ButtonStyle.Danger)
            .setCustomId("stop");
          let button3 = new ButtonBuilder()
            .setEmoji("➡️")
            .setStyle(ButtonStyle.Primary)
            .setCustomId("next")
            .setDisabled(true);
          let buttons = new ActionRowBuilder().addComponents([
            button1,
            button2,
            button3,
          ]);
          msg.edit({ components: [buttons] });
        } else {
          let button1 = new ButtonBuilder()
            .setEmoji("⬅️")
            .setStyle(ButtonStyle.Primary)
            .setCustomId("previous");
          let button2 = new ButtonBuilder()
            .setEmoji("⏹")
            .setStyle(ButtonStyle.Danger)
            .setCustomId("stop");
          let button3 = new ButtonBuilder()
            .setEmoji("➡️")
            .setStyle(ButtonStyle.Primary)
            .setCustomId("next");
          let buttons = new ActionRowBuilder().addComponents([
            button1,
            button2,
            button3,
          ]);
          msg.edit({ components: [buttons] });
        }
      }
    } catch (e) {
      console.log(String(e.stack).bgRed);
    }
  },
};
