const Discord = require("discord.js")

exports.run = async (bot,message,args) => {
    let user = message.member;
    if(message.mentions.members.first() && !message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(bot.error("NO_PERM"))
    if(message.mentions.members.first()) {user = message.mentions.members.first();}
    let load = await bot.utils.Infract.loadAll(message.guild.id, user.user.id);
    let warns = [];
    let warnsL = new Discord.MessageEmbed()
    .setTitle(`**${user.user.tag} | Infractions**`)
    .setColor(bot.color)
    
    for(let warn of load) {
        warnsL.addField(`__${warn.type}__`, `**ID**: ${warn.wid}\n**Reason**: ${warn.reason}\n**Given By:** ${message.guild.members.cache.get(warn.staff)}`, true)
    }
    
    if(load.length == 0) {warnsL.setDescription(`No infractions stored!`)}
    
    return message.channel.send(warnsL)
}

exports.help = {
    name: "infractions",
    aliases: ["infract", "inf"],
    description: "Displays all infractions",
    usage: "(user)"
}