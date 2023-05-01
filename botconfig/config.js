module.exports = {
  token: process.env.TOKEN,
  dbType: "", //quick.db OR MONGO
  MONGOtype: "", //quickmongo OR MONGOOSE
  MongoURL: "", //if dbType = MONGO, this is required else skip
  loadSlashsGlobal: true,
  dirSetup: [
    {
      Folder: "Utilites",
      CmdName: "Utilites",
      CmdDescription: "Get bots other info's",
    },
    {
      Folder: "General",
      CmdName: "General",
      CmdDescription: "Some commands that give bot's info",
    },
    {
      Folder: "Emotes",
      CmdName: "Emotes",
      CmdDescription: "Emoji modification commands",
    },
    {
      Folder: "Stickers",
      CmdName: "Stickers",
      CmdDescription: "Stcikers modification commands",
    },
  ],
};
