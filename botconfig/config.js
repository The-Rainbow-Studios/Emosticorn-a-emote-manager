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
      CmdDescription: "Utilites commands",
    },
    {
      Folder: "General",
      CmdName: "General",
      CmdDescription: "General commands",
    },
    {
      Folder: "Emotes",
      CmdName: "Emotes",
      CmdDescription: "Emote modification commands",
    },
    {
      Folder: "Stickers",
      CmdName: "Stickers",
      CmdDescription: "Sticker modification commands",
    },
  ],
};
