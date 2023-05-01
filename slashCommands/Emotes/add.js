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
    //OPTIONAL OPTIONS, make the array empty / dont add this option if you don't need options!
    //INFORMATIONS! You can add Options, but mind that the NAME MUST BE LOWERCASED! AND NO SPACES!!!, for the CHOCIES you need to add a array of arrays; [ ["",""] , ["",""] ]
    //{"Integer": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getInteger("ping_amount")
    {
      String: {
        name: "emoji",
        description: "The emoji to add? emoji ID or emote",
        required: true,
        autocomplete: true,
      },
    },
    {
      String: {
        name: "emoji_name",
        description: "what will be the name of the emoji?",
        required: true,
        autocomplete: true,
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
      const { guild } = member;
      let EmojiName = options.getString("emoji_name");
      const emoji_raw = options.getString("emoji");
      // const emo = interaction.guild.emojis.cache.get(emoji) || parseEmoji(emoji);
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
                  `${emote.x} | **Please provide a name for the emote!**`
                ),
            ],
          });
        link = emote;
      }
      //console.log(link)
      interaction.guild.emojis
        .create({ attachment: link, name: emoji.name || EmojiName })
        .then((em) => interaction.reply({ content: em.toString() + " added!" }))
        .catch((error) => {
          if (error.code == 30008) {
            return interaction.reply({
              embeds: [
                new EmbedBuilder()
                  .setColor(ee.color)
                  .setDescription(`${emote.x} | **Max Emoji slots reached.**`),
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
