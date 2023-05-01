const {
  EmbedBuilder,
  parseEmoji,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  PermissionFlagsBits,
  formatEmoji
} = require("discord.js");
const config = require("../../botconfig/config.js");
const ee = require("../../botconfig/embed.js");
const settings = require("../../botconfig/settings.js");
const emote = require("../../botconfig/emojis.js");
const btn = require("../../botconfig/components.js");
module.exports = {
  name: "enlarge", //the command name for the Slash Command
  category: "Stickers",
  description: "Enlarge a Stickers", //the command description for Slash Command Overview
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
        name: "sticker",
        description: "The emoji to enlarge?",
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

      const sticker = options.getString("sticker");
      const emo = client.stickers.get(sticker);

      if (!emo?.name || !emo?.id)
        return interaction.reply({
          //content: "Invalid sticker argument"});
          embeds: [
            new EmbedBuilder()
              .setColor(ee.color)
              .setDescription(`${emote.x} | The sticker is not valid! Try again with a valid sticker!`),
          ],
        });
      const buttons = new ButtonBuilder()
        .setCustomId("steal")
        .setLabel("Steal")
        .setStyle(ButtonStyle.Primary)
        .setEmoji("1056484133372702800");

      const msg = await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(ee.color)
            .setDescription(`${formatEmoji('1102541481845215248', false)} Sticker name: \`${emo.name}\`
            ${formatEmoji('1102533953874833529', false)} Sticker Image Link: [Click here](https://cdn.discordapp.com/stickers/${emo.id}.png)
            ${formatEmoji('1102541952114765941', false)} Sticker ID: \`${emo.id}\`
            ${formatEmoji('1102541952114765941', false)} Sticker description: \`${emo.description ? emo.description : `No Description`}\`
            ${formatEmoji('1102541952114765941', false)} Sticker guild: \`${emo.guild}\`
            ${formatEmoji('1102541952114765941', false)} Sticker tags: \`${emo.tags ? emo.tags : `No Tags`}\`
            ${formatEmoji('1102541952114765941', false)} Sticker Preview:`)
            .setImage(`https://cdn.discordapp.com/stickers/${emo.id}.png`)
        ],

        components: [
          new ActionRowBuilder().addComponents(
            buttons,
            btn.support,
            btn.invite
          ),
        ],
      });

      const filter_btn = function (button) {
        if (button.user !== interaction.user) return button.deferUpdate();

        return (
          ["steal"].includes(button.customId) &&
          button.user === interaction.user
        );
      };

      let r;
      try {
        r = await msg.awaitMessageComponent({
          filter_btn,
          max: 5,
          time: 20000,
          errors: ["time"],
        });
      } catch (error) {
        return msg.edit({
          content: 
            `${emote.x} | You ran out of time! Try again!`,
          components: [
            new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("steal")
                .setLabel("Steal")
                .setStyle(ButtonStyle.Primary)
                .setEmoji("1056484133372702800")
                .setDisabled(true),
              btn.support,
              btn.invite
            ),
          ],
        });
      }
      const u = interaction.member;
      if (r.customId == "steal") {
        const mutualGuilds = await client.guilds.cache.filter(async (guild) => {
          return guild.members.cache.has(u.id);
        });

        const options = (
          await Promise.all(
            mutualGuilds.map(async (guild) => {
              const member = await guild.members.fetch(interaction.member.id);

              if (
                guild.members.me.permissions.has(
                  PermissionFlagsBits.ManageEmojisAndStickers
                ) &&
                member.permissions.has(
                  PermissionFlagsBits.ManageEmojisAndStickers
                )
              ) {
                return {
                  label: trimString(String(guild.name), 25),
                  description: `${guild.memberCount} members`,
                  value: String(guild.id),
                };
              }
            })
          )
        ).filter((option) => option !== undefined);
        const guild_choose_msg = await r.reply({
          ephemeral: true,
          content: `**${emote.loading} | Choose the server you want to add this sticker to**`,
          components: [
            new ActionRowBuilder().addComponents(
              new StringSelectMenuBuilder()
                .setCustomId("guilds_select")
                .setPlaceholder("Click me to select a server")
                .setMinValues(1)
                .setMaxValues(1)
                .addOptions(options)
            ),
          ],
        });
        const filter_menu = function (menu) {
          if (menu.user !== interaction.user) return menu.deferUpdate();

          return (
            ["guilds_select"].includes(menu.customId) &&
            menu.user === interaction.user
          );
        };

        let t;
        try {
          t = await msg.awaitMessageComponent({
            filter_menu,
            max: 5,
            time: 20000,
            errors: ["time"],
          });
        } catch (error) {
          return msg.editReply({
            embeds: [
              new EmbedBuilder()
                .setColor(ee.color)
                .setDescription(`${emote.x} | You didn't choose a server in time! Try again!`),
            ],
            components: [new ActionRowBuilder().addComponents(btn.support, btn.invite, btn.github)],
          });
        }

        if (t.customId == "guilds_select") {
          client.guilds.cache
            .get(String(t.values[0]))
            .stickers.create({
              file: `https://cdn.discordapp.com/stickers/${emo.id}.png`,
              name: emo.name,
              tags: emo.tags,
            })
            .then((st) =>
              guild_choose_msg.edit({
                embeds: [
                  new EmbedBuilder()
                    .setColor(ee.color)
                    .setDescription(`${emote.tick} | ${st.name} + " was added!`)
                    .setImage(
                      `https://cdn.discordapp.com/stickers/${emo.id}.png`
                    ),
                ],
              })
            )
            .catch((error) => {
              if (error.code == 30008) {
                return guild_choose_msg.edit({
                  embeds: [
                    new EmbedBuilder()
                      .setColor(ee.color)
                      .setDescription(
                        `${emote.x} | Maximum number of stickers reached!`
                      ),
                  ],
                });
              }
              console.log(error);
              return guild_choose_msg.edit({
                embeds: [
                  new EmbedBuilder()
                    .setColor(ee.color)
                    .setDescription(
                      `${emote.x} | an Error occured, Error code: ${error.code}`
                    ),
                ],
              });
            });
        }
      }
    } catch (e) {
      console.log(String(e.stack).bgRed);
    }
  },
};

function trimString(str, len) {
  if (str.length > len) {
    str = str.substring(0, len - 3) + "...";
  }
  return str;
}
