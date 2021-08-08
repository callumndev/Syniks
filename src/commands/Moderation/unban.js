const Discord = require("discord.js")
const ms = require("ms")

exports.run = async (bot,message,args) => {
    if(!message.member.hasPermission("MANAGE_MESSAGES")) return;
    let user = args[0]
    if(!user) return message.channel.send("**[:x:] Please provide a valid user!**")
    message.guild.members.unban(user);
    let c = bot.utils.Ban.check(user);
    if(c) {bot.utils.Ban.remove(user)}
    return message.channel.send(bot.su(`Unbanned ${user}}`))
}

exports.help = {
    name: "unban",
    aliases: ['uban'],
    usage: '<user>',
    description: "Unban a user"
}