const Discord = require("discord.js")

exports.run = async (bot,message,args) => {
if(!message.member.voice.channel) return message.channel.send(bot.error("NEED_VC"));
const permissions = message.member.voice.channel.permissionsFor(message.guild.me);
if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
  return message.channel.send(bot.error("NEED_VC_PERM"));
}
const player = bot.MusicControl.getClient(message);
if(!player) return message.channel.send(bot.error('No active music found'))
let pauseValue = bot.MusicControl.togglePause(player);
return message.channel.send(bot.su(`Music has been ${pauseValue ? 'paused' : 'resumed'}`))
}

exports.help = {
  name: "pause",
  aliases: [],
  description: "Pause current queue",
  usage: "()"
}
