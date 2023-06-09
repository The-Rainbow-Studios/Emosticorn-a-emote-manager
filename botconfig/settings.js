module.exports = {
  ownerIDS: ["502406420453654529"],
  default_cooldown_in_sec: 1.5,
  antiCrash: true,
  ping_message: true,
  delete_commands: true,
  somethingwentwrong_cmd: true,

  messages: {
    ping_message: "To see all Commands type: `%{prefix}%help`",
    cooldown:
      "❌ You need to wait: **`%{timeleft}%`** before you can use the: `%{commandname}%` command again!",
    notallowed_to_exec_cmd: {
      title: "❌ You are not allowed to execute the: `%{commandname}%` command",
      description: {
        memberpermissions:
          "You need to have one of the Following Permissions:\n> %{commandmemberpermissions}%",
        alloweduserids:
          "You need to be one of the Following Users:\n> %{commandalloweduserids}%",
        requiredroles:
          "You need to have one of the Following Roles:\n> %{commandrequiredroles}%",
        default: "You are not allowed to execute this command",
      },
    },
    somethingwentwrong_cmd: {
      title:
        "❌ Something went wrong while, running the: `%{commandname}%` command",
      description: "```%{errormessage}%```",
    },
    unknown_cmd: "❌ Unkown command, try: **`%{prefix}%general help`**",
    error_occur: "❌ An error occurred",
    error_occur_desc: "````%{errorstack}%````",
  },
  timeout: {
    notallowed_to_exec_cmd: {
      memberpermissions: 4500,
      alloweduserids: 3500,
      requiredroles: 3500,
    },
    minargs: 5000,
    maxargs: 5000,
    minplusargs: 5000,
    maxplusargs: 5000,
  },
};
