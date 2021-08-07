
const Discord = require("discord.js")

exports.run = async (bot,message,args) => {
if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(bot.error("NO_PERM"));
let mem = bot.parse(message);
let r = args.slice(1).join(" ") || "No reason provided!"
if(!mem) return message.channel.send(bot.error("INVALID_ARGS"));
let add = await bot.utils.Infract.add(message,mem.user.id,r,'warn');
let log = await bot.utils.Log.send(bot,message,message.guild.id,`Warn Report: **User** ${mem.user.tag}\n**Reason** ${r}\n**Given By** ${message.member}`,0,1);
return message.channel.send(bot.mod(r,'permament',mem,message.member,'warned'));
}

exports.help = {
  name: "warn",
  aliases: ["w"],
  description: "Warn a user",
  usage: "(user) (reason)"
}
