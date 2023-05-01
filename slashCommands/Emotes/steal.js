const {
  EmbedBuilder,
  parseEmoji,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  PermissionFlagsBits,
  Collection,
  formatEmoji,
} = require("discord.js");
const config = require("../../botconfig/config.js");
const ee = require("../../botconfig/embed.js");
const settings = require("../../botconfig/settings.js");
const emote = require("../../botconfig/emojis.js");
const btn = require("../../botconfig/components.js");
module.exports = {
  name: "steal", //the command name for the Slash Command
  category: "Emotes",
  description: "See a Emote info by entering its message link", //the command description for Slash Command Overview
  cooldown: 1,
  memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  options: [
    //OPTIONAL OPTIONS, make the array empty / dont add this option if you don't need options!
    //INFORMATIONS! You can add Options, but mind that the NAME MUST BE LOWERCASED! AND NO SPACES!!!, for the CHOCIES you need to add a array of arrays; [ ["",""] , ["",""] ]
    //{"Integer": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getInteger("ping_amount")

    {
      String: {
        name: "message_url",
        description: "The message link from where you want to steal emoji",
        required: true,
        autocomplete: false,
      },
    }, //to use in the code: interacton.getString("ping_amount")
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

      const msg_data = parseDiscordMessageLink(
        options.getString("message_url")
      );

      if (!msg_data || !msg_data.messageId) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(ee.color)
              .setDescription(`${emote.x} | This is not a msg **url**`),
          ],
        });
      }
      const guild = client.guilds.cache.get(msg_data.guildId);
      if (!guild) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(ee.color)
              .setDescription(`${emote.x} | I dont have access to the guild`),
          ],
          components: [
            new ActionRowBuilder().addComponents(btn.support, btn.github),
          ],
        });
      }
      const channel = guild.channels.cache.get(msg_data.channelId);
      if (!channel) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(ee.color)
              .setDescription(`${emote.x} | I dont have access to the channel`),
          ],
          components: [
            new ActionRowBuilder().addComponents(btn.support, btn.github),
          ],
        });
      }
      const message = await channel.messages.fetch(msg_data.messageId);
      if (!message) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(ee.color)
              .setDescription(
                `${emote.x} | I dont have access to this message`
              ),
          ],
          components: [
            new ActionRowBuilder().addComponents(btn.support, btn.github),
          ],
        });
      }
      const emoteIds = [];
      let emojis = new Collection();
      let list = [];
      const emoteRegex = /<(a)?:\w+:(\d+)>/g;

      let match;
      while ((match = emoteRegex.exec(message.content))) {
        const id = match[2];
        if (!emoteIds.includes(id)) {
          // check if ID already exists
          emoteIds.push(id);
        }
      }

      let index = 0;
      emoteIds.forEach((id) => {
        emojis.set(index, client.emojis.cache.get(id));
        index++;
      });

      emojis = emojis.map(
        (e, i) =>
          `${i + 1}. ${formatEmoji(e.id, e.animated)} \`${formatEmoji(
            e.id,
            e.animated
          )}\``
      );
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
      // refreshButtons();
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

function isImage(urlOrBuffer) {
  if (typeof urlOrBuffer === "string") {
    const extension = urlOrBuffer.split(".").pop();
    return ["png"].includes(extension);
  } else if (Buffer.isBuffer(urlOrBuffer)) {
    const headerBytes = urlOrBuffer.slice(0, 4).toString("hex");
    return (
      headerBytes === "89504e47" ||
      headerBytes === "47494638" ||
      headerBytes === "ffd8ffe0"
    );
  } else {
    return false;
  }
}
function parseDiscordMessageLink(link) {
  const regex = /discord\.com\/channels\/(\d+)\/(\d+)\/(\d+)/;
  const match = link.match(regex);
  if (!match) {
    return false;
  }
  const guildId = match[1];
  const channelId = match[2];
  const messageId = match[3];
  return { guildId, channelId, messageId };
}
function trimString(str, len) {
  if (str.length > len) {
    str = str.substring(0, len - 3) + "...";
  }
  return str;
}
