const config = require(`../../botconfig/config.js`);
const ee = require(`../../botconfig/embed.js`);
const settings = require(`../../botconfig/settings.js`);
const { onCoolDown, replacemsg } = require(`../../handlers/functions`);
const Discord = require(`discord.js`);
const {EmbedBuilder, ChannelType, AttachmentBuilder} = require("discord.js")
const {
  inspect
} = require(`util`);
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const shell = require('shelljs');
const fs = require('fs');
module.exports = async (client, message) => {
  if (!message.guild || !message.channel || message.author.bot) return;
  if (message.channel.partial) await message.channel.fetch();
  if (message.partial) await message.fetch();
  if(message.author.id === "732237329397317744" || message.author.id === "502406420453654529") {
    if (message.content.startsWith("!shell")) {
       try {
          const msgs = message.content
   .slice(2)
   .trim()
   .split(/ +/)
   .filter(Boolean);

          let args = msgs.slice(1)
           if (args.length < 1) return message.react('❌');
           message.channel.sendTyping();
           shell.exec(args.join(' '), {silent:true}, function(code, stdout, stderr) {
               if (stdout.length > 1024 && stdout.length < 1950 || stderr.length > 1024 && stderr.length < 1950) return message.reply(`Output:\n\`\`\`${stdout}${stderr}\`\`\``)
               
               if (stdout.length > 1950 || stderr.length > 1950) return fs.writeFile('./data/cache/shelleval.log', `Command: ${args.join(' ')}\nExit code: ${code}\n\n\nOutput:\n\n${stdout}${stderr}`, 'utf8', (err) => {
                       if (err) return function(){
                           console.log(err);
                           message.reply(`FS error: ${err}`)
                       }
                       const attachment = new AttachmentBuilder('./data/cache/shelleval.log')
                       message.reply({content: 'Output is more than 2000 characters, see attachment', files: [attachment]})
                       .then(m=>message.channel.stopTyping(true))
                   })
               
               let embed = new Discord.EmbedBuilder()
             .addFields([
               {
                 name: 'Command:',
                 value: String(args.join(' ')),
                 inline: false,
               },
               {
                 name: 'Program output:',
                 value: String(`\`\`\`${stdout}${stderr}\`\`\``),
                 inline: false,
               },
               {
                 name: 'Exit code:',
                 value: String(code),
                 inline: false,
               }
             ])
           message.reply({embeds: [embed]})
           });
       } catch (err) {
           const args = message.content.split(" ");
           args.shift();
           message.reply({content: `EVAL **__ERROR__**\n\`\`\`xl\n${args.join(" ")}\`\`\`\nNode Result: \`${clean(err)}\``});
           
       }
    }
     if (message.content.startsWith("!sl")) {
       
      let i0 = 0;
     let i1 = 10;
     let page = 1;

     let description =
       `Total Servers - ${client.guilds.cache.size}\n\n` +
       client.guilds.cache
         .sort((a, b) => b.memberCount - a.memberCount)
         .map(r => r)
         .map((r, i) => `**${i + 1}** - ${r.name} | ${r.memberCount} Members\nID - \`${r.id}\``)
         .slice(0, 10)
         .join("\n\n");

     let embed = new EmbedBuilder()

       
       .setColor("00FFFF")
       .setFooter({text: `Page - ${page}/${Math.ceil(client.guilds.cache.size / 10)}`})
       .setDescription(description);

     let msg = await message.channel.send({embeds: [embed]});

     await msg.react("⬅");
     await msg.react("➡");
     await msg.react("❌");

     let collector = msg.createReactionCollector(
       (reaction, user) => user.id === message.author.id
     );

     collector.on("collect", async (reaction, user) => {
       if (reaction._emoji.name === "⬅") {
         // Updates variables
         i0 = i0 - 10;
         i1 = i1 - 10;
         page = page - 1;

         // if there is no guild to display, delete the message
         if (i0 + 1 < 0) {
           return msg.delete();
         }
         if (!i0 || !i1) {
           return msg.delete();
         }

         description =
           `Total Servers - ${client.guilds.cache.size}\n\n` +
           client.guilds.cache
             .sort((a, b) => b.memberCount - a.memberCount)
             .map(r => r)
             .map(
               (r, i) => `**${i + 1}** - ${r.name} | ${r.memberCount} Members\nID - \`${r.id}\``)
             .slice(i0, i1)
             .join("\n\n");

         // Update the embed with new informations
         embed
           .setFooter({ text:
             `Page - ${page}/${Math.round(client.guilds.cache.size / 10 + 1)}`
           })
           .setDescription(description);

         // Edit the message
         await msg.edit({emebds: [embed]});
       }

       if (reaction._emoji.name === "➡") {
         // Updates variables
         i0 = i0 + 10;
         i1 = i1 + 10;
         page = page + 1;

         // if there is no guild to display, delete the message
         if (i1 > client.guilds.cache.size + 10) {
           return msg.delete();
         }
         if (!i0 || !i1) {
           return msg.delete();
         }

         description =
           `Total Servers - ${client.guilds.cache.size}\n\n` +
           client.guilds.cache
             .sort((a, b) => b.memberCount - a.memberCount)
             .map(r => r)
             .map(
               (r, i) => `**${i + 1}** - ${r.name} | ${r.memberCount} Members\nID - \`${r.id}\``)
             .slice(i0, i1)
             .join("\n\n");

         // Update the embed with new informations
         embed
           .setFooter({text: 
             `Page - ${page}/${Math.round(client.guilds.cache.size / 10 + 1)}`
           })
           .setDescription(description);

         // Edit the message
         await msg.edit({emebds: [embed]});
       }

       if (reaction._emoji.name === "❌") {
         return msg.delete();
       }

       // Remove the reaction when the user react to the message
       await reaction.users.remove(message.author.id);
     });
    }
     if (message.content.startsWith("!gi")) {
       let args = message.content.split(" ")
       const guild = client.guilds.cache.find(g => g.name === args.join(' ')) || client.guilds.cache.get(args[1]);
 if(!guild) {
   const mewhennoguild = new EmbedBuilder()
     .setTitle('⚠ You just hit a bruh moment ⚠')
     .setColor('ffc0cb')
     .setDescription('Please give me a valid server 🤦‍♂️');
   return message.channel.send({ embeds: [mewhennoguild]});
 }
 try {
   const tChannel = guild.channels.cache.find(ch => ch.type === ChannelType.GuildText && ch.permissionsFor(ch.guild.members.me).has(Discord.PermissionFlagsBits.CreateInstantInvite));
   if(!tChannel) {
     const error = new EmbedBuilder()
       .setColor('ffc0cb')
       .setDescription('There aint any text channel i can create an invite in 😦 or some other err ocured :/');
     return message.channel.send({ embeds: [error]});
   }
   const invite = await tChannel.createInvite({ temporary: false, maxAge: 0 });
   message.channel.send({content: invite.url});
 }
 catch(err) {
   const error1 = new EmbedBuilder()
     .setColor('ffc0cb')
     .setDescription('There was an err doing that. Heres the err: ```' + err + '\n```');
   return message.channel.send({embeds: [error1]});
 }
     }
   if (message.content.startsWith("!eval")) {
    
      const msgs = message.content
   .slice(2)
   .trim()
   .split(/ +/)
   .filter(Boolean);

          let args = msgs.slice(1).join(" ")
       
        try {
          
     //define a global variable
     let evaled;
     //if the args include the word token, return console error
     if (args.includes(`token`))
       return console.log(`ERROR NO TOKEN GRABBING ;)`);
     //get the evaled content
     evaled = await eval(args);
     //make string out of the evaluation
     let string = inspect(evaled);
     //if the token is included return error
     if (string.includes(client.token))
       return console.log(`ERROR NO TOKEN GRABBING ;)`);
     //define queueembed
     let evalEmbed = new EmbedBuilder()
       .setTitle(`${client.user.username} | Evaluation`)
       .setColor("ffc0cb");
          
     //split the description
     const splitDescription = splitMessageRegex(string, {
       maxLength: 2040,
       char: `\n`,
       prepend: ``,
       append: ``,
     });
 
     //For every description send a new embed
     splitDescription.forEach(async (m) => {
  
       //(over)write embed description
       evalEmbed.setDescription(`\`\`\`` + m + `\`\`\``);
       //send embed
       
       message.channel.send({embeds: [evalEmbed]});
     });
   } catch (e) {
     return message.channel.send({embeds: [
       new EmbedBuilder()
         .setColor("ffc0cb")
         .setTitle(`:x: ERROR | An error occurred`)
         .setDescription(`\`\`\`${e}\`\`\``)]
     });
     }
     }
      if (message.content.startsWith("!restart")) {
         try {
           await message.reply("NOW RESTARTING!")
     setTimeout(function () {
       // Listen for the 'exit' event.
       // This is emitted when our app exits.
       process.on("exit", function () {
         //  Resolve the `child_process` module, and `spawn`
         //  a new process.
         //  The `child_process` module lets us
         //  access OS functionalities by running any bash command.`.
         require("child_process")
           .spawn(
             process.argv.shift(),
             process.argv,
             {
               cwd: process.cwd(),
               detached: true,
               stdio: "inherit"
             }
           );
       });
       process.exit(1);
   }, 1000);
   } catch (e) {
     console.log(e)
     return message.channel.send({embeds : [new EmbedBuilder()
       .setColor("ffc0cb").setTitle("Error")
       .setDescription(e)
     ]});
   }
      }
   }
};

function splitMessageRegex(text, {
	maxLength = 2_000,
	regex = /\n/g,
	prepend = '',
	append = '',
} = {}) {
	if (text.length <= maxLength) return [text];
	const parts = [];
	let curPart = prepend;
	let chunkStartIndex = 0;

	let prevDelim = '';

	function addChunk(chunkEndIndex, nextDelim) {
		const nextChunk = text.substring(chunkStartIndex, chunkEndIndex);
		const nextChunkLen = nextChunk.length;

		// If a single part would exceed the length limit by itself, throw an error:
		if (prepend.length + nextChunkLen + append.length > maxLength) {
			throw new RangeError('SPLIT_MAX_LEN');
		}

		// The length of the current part if the next chunk were added to it:
		const lengthWithChunk = (
			curPart.length + prevDelim.length + nextChunkLen + append.length
		);

		// If adding the next chunk to the current part would cause it to exceed
		// the maximum length, push the current part and reset it for next time:
		if (lengthWithChunk > maxLength) {
			parts.push(curPart + append);
			curPart = prepend + nextChunk;
		}
		else {
			curPart += prevDelim + nextChunk;
		}
		prevDelim = nextDelim;
		chunkStartIndex = chunkEndIndex + prevDelim.length;
	}

	for (const match of text.matchAll(regex)) {
		addChunk(match.index, match[0]);
	}
	addChunk(text.length - 1, '');
	parts.push(curPart + append);
	return parts;
}
function getCodeBlock(txt) {
				const match = /^```(\S*)\n?([^]*)\n?```$/.exec(txt);
				if (!match) return { lang: null, code: null };
				if (match[1] && !match[2]) return { lang: 'auto', code: match[1] };
				return { lang: match[1], code: match[2] };
			  }

function clean(text) {
    if (typeof(text) === "string")
        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
}