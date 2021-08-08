const Discord = require("discord.js")

exports.run = async (bot,message,args) => {
    let e = new Discord.MessageEmbed()
    .setTitle(`**Invite Links**`)
    .setAuthor(message.author.tag, message.author.avatarURL())
    .setColor(bot.color)
    .addField(`Bot Invite`, '[Invite Here](https://discord.com/api/oauth2/authorize?client_id=739777124256448534&permissions=8&scope=bot)')
    .addField(`Support Server`, `[Join Here](https://discord.gg/fd4Rxx3)`)
    .setThumbnail(bot.user.avatarURL())
    return message.channel.send(e)
}

exports.help = {
    name: "invite",
    aliases: [],
    description: "Invite the bot!",
    usage: "()"
}