const Discord = require("discord.js")

exports.run = async (bot,message,args) => {
    let emb = new Discord.MessageEmbed()
    .setTitle(message.guild.name)
    .setColor(bot.color)
    .addField(`Member Count`, message.guild.members.cache.size, true)
    .addField(`Region`, message.guild.region, true)
    .addField(`Channels`, message.guild.channels.cache.size, true)
    .addField(`Roles`, message.guild.roles.cache.size, true)
    .setThumbnail(message.guild.iconURL());
    return message.channel.send(emb)
}

exports.help = {
    name: "server-info",
    aliases: ["sinfo"],
    description: "Server Information",
    usage: "()"
}