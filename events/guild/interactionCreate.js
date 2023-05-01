//Import Modules
const config = require(`../../botconfig/config.js`);
const ee = require(`../../botconfig/embed.js`);
const settings = require(`../../botconfig/settings.js`);
const { onCoolDown, replacemsg } = require("../../handlers/functions");
const Discord = require("discord.js");
module.exports = async (client, interaction) => {
  if (interaction.isAutocomplete()) {
    try {
      if (interaction.commandName === "stickers") {
        if (interaction.options.getSubcommand() === "enlarge") {
          const focusedOption = interaction.options.getString("sticker");
          const sticker_list = client.stickers.map((sticker) => ({ name: sticker.name, id: sticker.id }));

          
          const filtered = sticker_list.filter((sticker) =>
            sticker.name.startsWith(focusedOption)
          );
          const sliced = filtered.slice(0, 25);
          await interaction.respond(
            sliced.map((sticker) => ({
              name: client.guilds.cache
                .get(interaction.member.guild.id)
                .stickers.cache.find((st) => st.id === sticker.id)
                ? `Current Server - ${sticker.name}`
                : `Mutual Server - ${sticker.name}`,
              value: client.stickers.find((st) => st.id === sticker.id).id,
            }))
          );
        }
      }

      if (interaction.commandName === "emotes") {
        if (interaction.options.getSubcommand() === "enlarge") {
          const focusedOption = interaction.options.getString("emoji");
          const emoji_list = client.emojis.cache.map((emoji) => ({ name: emoji.name, id: emoji.id }));
          const filtered = emoji_list.filter((emoji) =>
            emoji.name.startsWith(focusedOption)
          );
          const sliced = filtered.slice(0, 25);
          await interaction.respond(
            sliced.map((emoji) => ({
              name: client.guilds.cache
                .get(interaction.member.guild.id)
                .emojis.cache.find((e) => e.id === emoji.id)
                ? `Current Server - ${emoji.name}`
                : `Mutual Server - ${emoji.name}`,
              value: client.emojis.cache.find((e) => e.id === emoji.id).id,
            }))
          );
        }

        if (interaction.options.getSubcommand() === "add") {
          const focusedOption = interaction.options.getString("emoji");
          const emoji_list = client.emojis.cache.map((emoji) => ({ name: emoji.name, id: emoji.id }));
          const filtered = emoji_list.filter((emoji) =>
            emoji.name.startsWith(focusedOption)
          );
          const sliced = filtered.slice(0, 25);
          await interaction.respond(
            sliced.map((emoji) => ({
              name: client.guilds.cache
                .get(interaction.member.guild.id)
                .emojis.cache.find((e) => e.id === emoji.id)
                ? `Current Server - ${emoji.name}`
                : `Mutual Server - ${emoji.name}`,
              value: client.emojis.cache.find((e) => e.id === emoji.id).id,
            }))
          );
        }
      }
    } catch (e) {
      console.log(e);
    }
    return;
  }

  let prefix = "/";

  const CategoryName = interaction.commandName;
  let command = false;
  try {
    if (
      client.slashCommands.has(
        CategoryName + interaction.options.getSubcommand()
      )
    ) {
      command = client.slashCommands.get(
        CategoryName + interaction.options.getSubcommand()
      );
    }
  } catch {
    if (client.slashCommands.has("normal" + CategoryName)) {
      command = client.slashCommands.get("normal" + CategoryName);
    }
  }
  if (command) {
    if (onCoolDown(interaction, command)) {
      return interaction.reply({
        ephemeral: true,
        embeds: [
          new Discord.EmbedBuilder()
            .setColor(ee.wrongcolor)
            .setFooter({ text: ee.footertext, iconURL: ee.footericon })
            .setTitle(
              replacemsg(settings.messages.cooldown, {
                prefix: prefix,
                command: command,
                timeLeft: onCoolDown(interaction, command),
              })
            ),
        ],
      });
    }
    //if Command has specific permission return error
    //console.log(interaction.member.permissions.toArray())
    if (
      command.memberpermissions &&
      command.memberpermissions.length > 0 &&
      !interaction.member.permissions.has(command.memberpermissions)
    ) {
      return interaction.reply({
        ephemeral: true,
        embeds: [
          new Discord.EmbedBuilder()
            .setColor(ee.wrongcolor)
            .setFooter({ text: ee.footertext, iconURL: ee.footericon })
            .setTitle(
              replacemsg(settings.messages.notallowed_to_exec_cmd.title)
            )
            .setDescription(
              replacemsg(
                settings.messages.notallowed_to_exec_cmd.description
                  .memberpermissions,
                {
                  command: command,
                  prefix: prefix,
                }
              )
            ),
        ],
      });
    }
    //if Command has specific needed roles return error
    if (
      command.requiredroles &&
      command.requiredroles.length > 0 &&
      interaction.member.roles.cache.size > 0 &&
      !interaction.member.roles.cache.some((r) =>
        command.requiredroles.includes(r.id)
      )
    ) {
      return interaction.reply({
        ephemeral: true,
        embeds: [
          new Discord.EmbedBuilder()
            .setColor(ee.wrongcolor)
            .setFooter({ text: ee.footertext, iconURL: ee.footericon })
            .setTitle(
              replacemsg(settings.messages.notallowed_to_exec_cmd.title)
            )
            .setDescription(
              replacemsg(
                settings.messages.notallowed_to_exec_cmd.description
                  .requiredroles,
                {
                  command: command,
                  prefix: prefix,
                }
              )
            ),
        ],
      });
    }
    //if Command has specific users return error
    if (
      command.alloweduserids &&
      command.alloweduserids.length > 0 &&
      !command.alloweduserids.includes(interaction.member.id)
    ) {
      return message.channel.send({
        ephemeral: true,
        embeds: [
          new Discord.EmbedBuilder()
            .setColor(ee.wrongcolor)
            .setFooter({ text: ee.footertext, iconURL: ee.footericon })
            .setTitle(
              replacemsg(settings.messages.notallowed_to_exec_cmd.title)
            )
            .setDescription(
              replacemsg(
                settings.messages.notallowed_to_exec_cmd.description
                  .alloweduserids,
                {
                  command: command,
                  prefix: prefix,
                }
              )
            ),
        ],
      });
    }
    //execute the Command
    command.run(client, interaction);
  }
};
