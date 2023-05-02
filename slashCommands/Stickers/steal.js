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
  name: "steal", //the command name for the Slash Command
  category: "Stickers",
  description: "See a sticker info by entering its message link", //the command description for Slash Command Overview
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
        description: "The message link from where you want to steal sticker",
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
          ephemeral: true,
          embeds: [
            new EmbedBuilder()
              .setColor(ee.color)
              .setDescription(`${emote.x} | This is not a message URL`),
          ],
        });
      }
      const guild = client.guilds.cache.get(msg_data.guildId);
      if (!guild) {
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new EmbedBuilder()
              .setColor(ee.color)
              .setDescription(`${emote.x} | I don't have access to the guild`),
          ],
          components: [
            new ActionRowBuilder().addComponents(btn.support, btn.github),
          ],
        });
      }
      const channel = guild.channels.cache.get(msg_data.channelId);
      if (!channel) {
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new EmbedBuilder()
              .setColor(ee.color)
              .setDescription(`${emote.x} | I don't have access to the channel`),
          ],
          components: [
            new ActionRowBuilder().addComponents(btn.support, btn.github),
          ],
        });
      }
      const message = await channel.messages.fetch(msg_data.messageId);
      if (!message) {
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new EmbedBuilder()
              .setColor(ee.color)
              .setDescription(
                `${emote.x} | I don't have access to the message`),
          ],
          components: [
            new ActionRowBuilder().addComponents(btn.support, btn.github),
          ],
        });
      }
      const sticker = await Promise.all(message.stickers.map(async (sticker) => {
        await sticker.fetch()
        return {
          id: sticker.id,
          name: sticker.name,
          description: sticker.description,
          tags: sticker.tags,
          guildId: sticker.guildId,
        };
      }));
      if (!sticker[0].guildId) {
        interaction.reply({
          ephemeral: true,
          embeds: [
            new EmbedBuilder()
              .setColor(ee.color)
              .setDescription(
                `${emote.x} | You cannot steal a default sticker, purchase nitro by clicking [here](https://discord.com/nitro)`),
          ],
          components: [
            new ActionRowBuilder().addComponents(btn.support, btn.github),
          ],
        });
        return;
      }
      let emo = client.stickers.get(sticker[0].id);
      if (!emo?.name || !emo?.id) {
        emo = sticker[0];
      }
      if (!emo?.name || !emo?.id)
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new EmbedBuilder()
              .setColor(ee.color)
              .setDescription(`${emote.x} | No sticker was found in that message`),
          ],
          components: [
            new ActionRowBuilder().addComponents(btn.support, btn.github),
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
            .setDescription(
              `${formatEmoji('1102541481845215248', false)} Sticker name: \`${emo.name}\` 
              ${formatEmoji('1102533953874833529', false)} Sticker Image Link: [Click here](https://cdn.discordapp.com/stickers/${emo.id}.png) 
              ${formatEmoji('1102541952114765941', false)} Sticker Description: \`${emo.description || "No Description"}\` 
              ${formatEmoji('1102541952114765941', false)} Sticker Tags: \`${emo.tags || "No Tags"}\` 
              ${formatEmoji('1102541952114765941', false)} Sticker ID: \`${emo.id}\` 
              ${formatEmoji('1102541952114765941', false)} Sticker Guild ID: \`${emo.guildId}\` 
              ${formatEmoji('1102541952114765941', false)} Sticker Preview:`
            )
            .setImage(`https://cdn.discordapp.com/stickers/${emo.id}.png`),
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
        const mutualGuilds = client.guilds.cache.filter((guild) => {
          return guild.members.cache.has(u.id);
        });
    
        const options = (
          await Promise.all(
            mutualGuilds.map(async (guild) => {
              const member = await guild.members.fetch(interaction.member.id);
              if(member) {
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
            }
            })
          )
        ).filter((option) => option !== undefined);
        const guild_choose_msg = await r.reply({
          ephemeral: true,
          content: `Choose the server you want to add this sticker to \n Don't see your server? Run any of my commands in that server to add it to my database!`,
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
          return msg.edit({
            embeds: [
              new EmbedBuilder()
                .setColor(ee.color)
                .setDescription(`${emote.x} | You ran out of time! Run the command again to steal the sticker!`),
            ],
            components: [
              new ActionRowBuilder().addComponents(btn.support, btn.github),
            ],
          });
        }

        if (t.customId == "guilds_select") {
          t.deferUpdate();
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
                components: [
                  new ActionRowBuilder().addComponents(btn.support, btn.github),
                ],
              })
            )
            .catch((error) => {
              if (error.code == 30039) {
                return guild_choose_msg.edit({
                  embeds: [
                    new EmbedBuilder()
                      .setColor(ee.color)
                      .setDescription(
                        `${emote.x} | Maximum number of stickers reached!`
                      ),
                  ],
                  components: [
                    new ActionRowBuilder().addComponents(
                      btn.support,
                      btn.github
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
                      `${emote.x} | an Error occured while adding stickers. Error Code: ${error.code}`
                    ),
                ],
                components: [
                  new ActionRowBuilder().addComponents(btn.support, btn.github),
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
