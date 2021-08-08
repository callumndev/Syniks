const Discord = require("discord.js")
const ytdl = require('ytdl-core-discord');
const search = require("yt-search")

exports.run = async (bot,message,args) => {
    const player = bot.MusicControl.getClient(message);
    if(!player) return message.channel.send(bot.error('No active music found'))
    const page = args.length && Number(args[0]) ? Number(args[0]) : 1;
    
    const end = page * 10;
    const start = end - 10;
    
    const tracks = player.queue.slice(start, end);
    
    let e = new Discord.MessageEmbed()
    .setTitle(`Server Queue`)
    .setColor(bot.color)
    .setThumbnail(message.guild.iconURL());
    let desc = '';
    if (player.queue.current) e.addField("Current", `[${player.queue.current.title}](${player.queue.current.uri})`);
    e.setDescription(tracks.map((track, i) => `${start + (++i)} - [${track.title}](${track.uri})`).join("\n"));
    return message.channel.send(e)
}

exports.help = {
    name: "queue",
    aliases: ["que"],
    description: "View the queue",
    usage: "()"
}