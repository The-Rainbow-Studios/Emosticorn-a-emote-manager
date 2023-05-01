const { EmbedBuilder, parseEmoji } = require("discord.js");
const config = require("../../botconfig/config.js");
const ee = require("../../botconfig/embed.js");
const settings = require("../../botconfig/settings.js");
const emote = require("../../botconfig/emojis.js");
const btn = require("../../botconfig/components.js");
module.exports = {
  name: "add", //the command name for the Slash Command
  category: "Emotes",
  description: "Add an Emoji to the server", //the command description for Slash Command Overview
  cooldown: 1,
  memberpermissions: ["ManageEmojisAndStickers"], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  options: [
    {
      String: {
        name: "emoji_name",
        description: "what will be the name of the emoji?",
        required: true
      },
    },
    {
      String: {
        name: "emoji",
        description: "The emoji to add? emoji ID or emote",
        required: false
      },
    },
    {
      String: {
        name: "image_url",
        description: "The image url to add? only png",
        required: false
      },
    },
    {
      Attachment: {
        name: "emoji_attachment",
        description: "The emoji to add? only png",
        required: false,
      },
    },
  
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
      const { guild } = member;
      let EmojiName = options.getString("emoji_name");
      const emoji_raw = options.getString("emoji") || options.getString("image_url") || options.getAttachment("emoji_attachment").url
      let emoji
      if(!isImage(emoji_raw)) {

      let emote = emoji_raw.match(/<?(a)?:?(\w{2,32}):(\d{17,19})>?/gi);
      if (emote) {
        emote = emote[0];
        type = "emoji";
        EmojiName =
          emoji_raw
            .replace(/<?(a)?:?(\w{2,32}):(\d{17,19})>?/gi, "")
            .trim()
            .split(" ")[0] || options.getString("emoji_name");
      } else {
        let args = emoji_raw.split(" ");
        emote = `${args.find((arg) => isImage(arg))}`;
        EmojiName = options.getString("emoji_name");
        type = "url";
      }
      emoji = {
        name: "",
      };
      if (type == "emoji") {
        emoji = parseEmoji(emote);
        link = `https://cdn.discordapp.com/emojis/${emoji.id}.${
          emoji.animated ? "gif" : "png"
        }`;
      } else {
        if (!EmojiName)
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(ee.color)
                .setDescription(
                  `${emote.x} | Please provide a name for the emoji`
                ),
            ],
          });
        link = emote;
      }
    } else {
      link = emoji_raw
    }
      interaction.guild.emojis
        .create({ attachment: link, name: emoji?.name || EmojiName })
        .then((em) => interaction.reply({ content: em.toString() + " added!" }))
        .catch((error) => {
          if (error.code == 30008) {
            return interaction.reply({
              embeds: [
                new EmbedBuilder()
                  .setColor(ee.color)
                  .setDescription(`${emote.x} | This server has reached the maximum number of emojis!`),
              ],
            });
          }
          console.log(error);
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(ee.color)
                .setDescription(
                  `${emote.x} | An Error occured, Error code: ${error.code}`
                ),
            ],
          });
        });
    } catch (e) {
      console.log(String(e.stack).bgRed);
    }
  },
};

function isImage(urlOrBuffer) {
  if (typeof urlOrBuffer === "string") {
    const extension = urlOrBuffer.split(".").pop();
    return ["png", "jpg", "gif"].includes(extension);
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
