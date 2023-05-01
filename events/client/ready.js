//here the event starts
const config = require("../../botconfig/config.js");
const {ActivityType} = require("discord.js")
module.exports = async (client) => {
  try {
    try {
      const stringlength = 69;
      console.log("\n");
      console.log(
        `     ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓`
          .bold.brightGreen
      );
      console.log(
        `     ┃ `.bold.brightGreen +
          " ".repeat(-1 + stringlength - ` ┃ `.length) +
          "┃".bold.brightGreen
      );
      console.log(
        `     ┃ `.bold.brightGreen +
          `Discord Bot is online!`.bold.brightGreen +
          " ".repeat(
            -1 + stringlength - ` ┃ `.length - `Discord Bot is online!`.length
          ) +
          "┃".bold.brightGreen
      );
      console.log(
        `     ┃ `.bold.brightGreen +
          ` /--/ ${client.user.tag} /--/ `.bold.brightGreen +
          " ".repeat(
            -1 +
              stringlength -
              ` ┃ `.length -
              ` /--/ ${client.user.tag} /--/ `.length
          ) +
          "┃".bold.brightGreen
      );
      console.log(
        `     ┃ `.bold.brightGreen +
          " ".repeat(-1 + stringlength - ` ┃ `.length) +
          "┃".bold.brightGreen
      );
      console.log(
        `     ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`
          .bold.brightGreen
      );
    } catch {
      /* */
    }
    try {
      client.user.setActivity(
        `/help | ${client.guilds.cache.size} Guilds | ${Math.ceil(
          client.users.cache.size / 1000
        )}k Members`,
        {
          type: "PLAYING",
        }
      );
    } catch (e) {
      console.log(String(e.stack).bgRed);
    }
    //loop through the status per each 10 minutes
      try {
              const activities = [
  "Organizing all the emotes and stickers...not sure if I should file them under 'cute' or 'epic'",
  `to ${client.guilds.cache.size} Guilds | ${Math.ceil(
    client.users.cache.size / 1000
  )}k Members`,
  "Helping you express your emotions...without the need for actual words!",
  "Saving the world, one emote at a time",
  "Making emotes great again",
  "I'm not lazy, I'm just conserving my energy for emote management",
  "Sometimes I wonder if emotes have feelings too",
  "Emotes are like snowflakes...no two are the same!",
  "Emotes may be small, but they have a big impact",
  "All your emote are belong to us!",
  "To infinity and beyond...with emotes!",
  "I'm not just a bot, I'm an emote enthusiast",
  "You can never have too many emotes...or can you?",
  "Emotes: the universal language of the internet",
  "Emotes don't judge, they just express",
  "My job is to make sure your emote game is on point",
  "I don't always manage emotes, but when I do, I do it with style",
  "When life gives you lemons, make emotes!",
  "I'm not addicted to emotes...I can stop anytime I want!",
  "Emotes are like potato chips...you can't have just one!",
 "I have more emotes and stickers than I have friends...is that sad?",
  "Just trying to make sure no Discord conversation goes without the perfect emote or sticker",
  "I'm not saying I'm the most important bot in your Discord server, but...well, actually, I am saying that",
  "I might be just a bot, but I know the difference between a good emote and a bad one",
  "My dream is to have my own emoji movie...who's with me?",
  "If you don't like my emotes and stickers, you can always make your own...just kidding, please don't do that",
  "I'm not just a bot, I'm an emote and sticker curator...the most important job on the internet",
  "I'm constantly searching for the latest and greatest emotes and stickers...my job is never done",
  "Sometimes I wonder if emotes and stickers are taking over the world...then I remember, that's what I'm here for",
  "I may be just a bot, but my emotes and stickers have more personality than most humans",
  "Do you know how hard it is to find the perfect emote or sticker for every situation? Let's just say, I'm a pro",
  "If you need an emote or sticker for a bad joke, I'm your bot",
  "I'm like a magician, but instead of pulling rabbits out of hats, I pull emotes and stickers out of thin air",
  "I'm always happy to help you express yourself...even if that means using an emote with a crying face",
  "I have a theory that every great Discord conversation starts with an amazing emote or sticker",
  "I'm a bot, but I have feelings too...especially when someone insults my emotes and stickers",
  "My emotes and stickers are like my children...except I have way more of them and they never talk back",
  "Some people say emotes and stickers are a waste of time...I say, those people just haven't found the right ones yet"
];
          const type = [
              ActivityType.Listening, ActivityType.Watching, ActivityType.Watching, ActivityType.Competing , ActivityType.Playing
          ]
    let i = 0;
    setInterval(
      () =>
         client.user.setActivity(
          activities: activities[i++ % activities.length],
          {
            type: type[i++ % type.length],
          }
        ),
      5000
    );
          

    client.application.commands
      .fetch()
      .then((commands) => {
        commands.map((command) => {
          client.helpMaker.push({ name: command.name, id: command.id });
        });
      })
      .catch(console.error);

    for (const [, guild] of client.guilds.cache) {
      guild.stickers.cache.forEach(async (sticker) =>{
        
        client.stickers.set(sticker.id, sticker)}
      );
    }
  } catch (e) {
    console.log(String(e.stack).grey.italic.dim.bgRed);
  }
};
