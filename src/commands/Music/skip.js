const Discord = require("discord.js")
const ytdl = require('ytdl-core-discord');
  
exports.run = async (bot,message,args) => {
    if(!message.member.voice.channel) return message.channel.send(bot.error("NEED_VC"));
    const permissions = message.member.voice.channel.permissionsFor(message.guild.me);
    const player = bot.MusicControl.getClient(message);
    if(!player) return message.channel.send(bot.error('No active music found'))
    bot.MusicControl.skipSong(player);
    return message.channel.send(bot.su('Skipping...'))
}

exports.help = {
    name: "skip",
    aliases: ["s"],
    description: "Skip a song",
    usage: "()"
}