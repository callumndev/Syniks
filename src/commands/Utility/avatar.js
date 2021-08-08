const Discord = require("discord.js")

exports.run = async (bot,message,args) => {
    let user = message.member;
    let getUser = bot.parse(message);
    if(getUser) {user = getUser};
    let emb = new Discord.MessageEmbed()
    .setImage(user.user.avatarURL())
    .setColor(bot.color);
    
    return message.channel.send(emb);
}

exports.help = {
    name: "avatar",
    aliases: ['av'],
    description: "View Avatar",
    usage: "(user)"
}