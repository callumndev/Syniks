
const Discord = require("discord.js")

exports.run = async (bot,message,args) => {
    if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(bot.error("NO_PERM"));
    let mem = bot.parse(message);
    if(!mem) return message.channel.send(bot.error("INVALID_ARGS"));
    let clear = await bot.utils.Infract.clear(mem);
    return message.channel.send(bot.su(`Infractions cleared successfully for ${mem.user.tag}`))
}

exports.help = {
    name: "clear-all-infractions",
    aliases: ["clear-inf"],
    description: "Clear all infractions",
    usage: "(user)"
}