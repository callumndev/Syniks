const Discord = require("discord.js")
const ytdl = require('ytdl-core-discord');

exports.run = async (bot,message,args) => {
    if(!message.member.voice.channel) return message.channel.send(bot.error("NEED_VC"));
    if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(bot.error("NO_PERM"))
    const player = bot.MusicControl.getClient(message);
    if(!player) return message.channel.send(bot.error('No active music found'))
    bot.MusicControl.stop(player);
    return message.channel.send(bot.su('Music has been stopped'))
}

exports.help = {
    name: "stop",
    aliases: [""],
    description: "Stop all queue",
    usage: "()"
}