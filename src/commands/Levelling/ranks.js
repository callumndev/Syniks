const Discord = require('discord.js')


exports.run = async (bot, message, args) => {
    let all = await bot.utils.Level.ranks.findAll({order: [['level', 'ASC']]});
    let list = [];
    all.forEach(r => list.push(`Level **${r.level}** | **${message.guild.roles.cache.get(r.id) || 'Role not found'}**`))
    let emb = new Discord.MessageEmbed()
    .setTitle(`**Achievable Ranks**`)
    .setColor(bot.color)
    .setDescription(list.join("\n"))
    .setThumbnail(message.guild.iconURL());
    
    message.channel.send(emb)
}

exports.help = {
    name: "ranks",
    aliases: [''],
    description: "View ranks",
    usage: "()",
    admin: false
}