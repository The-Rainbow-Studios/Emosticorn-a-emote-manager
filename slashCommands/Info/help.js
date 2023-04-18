const {
  EmbedBuilder
} = require("discord.js");
const config = require("../../botconfig/config.js");
const ee = require("../../botconfig/embed.js");
const settings = require("../../botconfig/settings.js");
module.exports = {
  name: "help", //the command name for execution & for helpcmd [OPTIONAL]
  cooldown: 1, //the command cooldown for execution & for helpcmd [OPTIONAL]
  description: "Returns all Commmands, or one specific command", //the command description for helpcmd [OPTIONAL]
  memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  options: [ //OPTIONAL OPTIONS, make the array empty / dont add this option if you don't need options!	
    //INFORMATIONS! You can add Options, but mind that the NAME MUST BE LOWERCASED! AND NO SPACES!!!, for the CHOCIES you need to add a array of arrays; [ ["",""] , ["",""] ] 
    //{"Integer": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getInteger("ping_amount")
    {
      "String": {
        name: "specific_cmd",
        description: "Want details of a Specific Command?",
        required: false
      }
    }, //to use in the code: interacton.getString("ping_amount")
    //{"User": { name: "ping_a_user", description: "To Ping a user lol", required: false }}, //to use in the code: interacton.getUser("ping_a_user")
    //{"Channel": { name: "what_channel", description: "To Ping a Channel lol", required: false }}, //to use in the code: interacton.getChannel("what_channel")
    //{"Role": { name: "what_role", description: "To Ping a Role lol", required: false }}, //to use in the code: interacton.getRole("what_role")
    //{"IntChoices": { name: "what_ping", description: "What Ping do you want to get?", required: true, choices: [["Bot", 1], ["Discord Api", 2]] }, //here the second array input MUST BE A NUMBER // TO USE IN THE CODE: interacton.getInteger("what_ping")
    //{"StringChoices": { name: "what_ping", description: "What Ping do you want to get?", required: false, choices: [["Bot", "botping"], ["Discord Api", "api"]] }}, //here the second array input MUST BE A STRING // TO USE IN THE CODE: interacton.getString("what_ping")
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
        createdTimestamp
      } = interaction;
      const {
        guild
      } = member;
      let prefix = '/'
      let args = options.getString("specific_cmd");
      if (args && args.length > 0) {
        const embed = new EmbedBuilder();
        const cmd = client.commands.get(args.toLowerCase()) || client.commands.get(client.aliases.get(args.toLowerCase()));
        if (!cmd) {
          return interaction.reply({
            ephemeral: true,
            embeds: [embed.setColor(ee.wrongcolor).setDescription(`No Information found for command **${args.toLowerCase()}**`)]
          });
        }
        if (cmd.name) embed.addFields({ name: "**Command name**", value: `\`${cmd.name}\`` });
        if (cmd.name) embed.setTitle(`Detailed Information about:\`${cmd.name}\``);
        if (cmd.description) embed.addFields({ name: "**Description**", value: `\`${cmd.description}\`` });
        if (cmd.aliases) embed.addFields({ name: "**Aliases**", value: `\`${cmd.aliases.map((a) => `${a}`).join("`, `")}\`` });
        embed.addFields({ name: "**Cooldown**", value: `\`${cmd.cooldown ? cmd.cooldown + " Seconds" : settings.default_cooldown_in_sec + " Second"}\`` });
        if (cmd.usage) {
          embed.addFields({ name: "**Usage**", value: `\`${prefix}${cmd.usage}\`` });
          embed.setFooter({text: "Syntax: <> = required, [] = optional"});
        }
        return interaction.reply({
          ephemeral: true,
          embeds: [embed.setColor(ee.color)]
        });
      } else {
        const embed = new EmbedBuilder()
          .setColor(ee.color)
          .setThumbnail(client.user.displayAvatarURL())
          .setTitle("HELP MENU 🔰 Commands")
          .setDescription(`**[Invite me with __Slash Commands__ Permissions](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands), cause all of my Commands are Slash Commands!**`)
          .setFooter({text: `To see command Descriptions and Information, type: ${prefix}help [CMD NAME]`, iconURL: client.user.displayAvatarURL()});
        const commands = (category) => {
          return client.commands.filter((cmd) => cmd.category === category).map((cmd) => `\`${cmd.name}\``);
        };
        try {
          for (let i = 0; i < client.categories.length; i += 1) {
            const current = client.categories[i];
            const items = commands(current);
            embed.addFields(`**${current.toUpperCase()} [${items.length}]**`, `> ${items.join(", ")}`);
          }
        } catch (e) {
          console.log(String(e.stack).red);
        }
        interaction.reply({
          ephemeral: true,
          embeds: [embed]
        });
      }
    } catch (e) {
      console.log(String(e.stack).bgRed)
      return interaction.reply({
        ephemeral: true,
        embeds: [new EmbedBuilder()
          .setColor(ee.wrongcolor)
          .setFooter({ text: ee.footertext, iconURL: ee.footericon})
          .setTitle(`${client.allEmojis.x} ERROR | An error occurred`)
          .setDescription(`\`\`\`${e.message ? String(e.message).substr(0, 2000) : String(e).substr(0, 2000)}\`\`\``)
        ]
      });
    }
  }
}

