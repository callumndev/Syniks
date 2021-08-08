const Discord = require("discord.js")

exports.run = async (bot,message,args) => {
    let user = message.member;
    if(message.mentions.members.first()) {user = message.mentions.members.first()}
    let load = await bot.utils.Vouch.load(user.user.id);
    let vouch = new Discord.MessageEmbed()
    .setTitle(`**${user.user.tag} | Vouches**`)
    .setDescription(`**Vouches:** ${load.count}`)
    .setThumbnail(user.user.avatarURL())
    .setColor(bot.color)
    
    return message.channel.send(vouch)
}

exports.help = {
    name: "vouches",
    aliases: [],
    description: "Displays all vouches",
    usage: "(user)"
}