const Discord = require("discord.js")
const ytdl = require('ytdl-core-discord');
const search = require("yt-search")

exports.run = async (bot,message,args) => {
if(!message.member.voice.channel) return message.channel.send(bot.error("NEED_VC"));
const permissions = message.member.voice.channel.permissionsFor(message.guild.me);
if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
  return message.channel.send(bot.error("NEED_VC_PERM"));
}
let song = args.join(' ');
if(!song) return message.channel.send(bot.error("INVALID_ARGS"))

try {
  let player = bot.MusicControl.createClient(message, message.member.voice.channel);
  return bot.MusicControl.processSong(player,args.join(' '), message)
} catch (error) {
  console.error(error)
  message.channel.send(bot.error(error.message));
}

}

exports.help = {
  name: "play",
  aliases: ["p"],
  description: "Play a song",
  usage: "()"
}
