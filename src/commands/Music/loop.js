const Discord = require("discord.js")
const ytdl = require('ytdl-core-discord');
const search = require("yt-search")

exports.run = async (bot,message,args) => {
if(!message.member.voice.channel) return message.channel.send(bot.error("NEED_VC"));
const permissions = message.member.voice.channel.permissionsFor(message.guild.me);
if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
  return message.channel.send(bot.error("NEED_VC_PERM"));
}
let pauseValue = bot.MusicControl.toggleLoop(player);
return message.channel.send(bot.su(`The queue will now ${pauseValue ? 'loop' : 'not loop'}`))
}

exports.help = {
  name: "loop",
  aliases: [],
  description: "Loop the queue",
  usage: "()"
}
