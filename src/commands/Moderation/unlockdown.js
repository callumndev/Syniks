const Discord = require("discord.js")

exports.run = async (bot,message,args) => {
    if(!message.member.hasPermission("MANAGE_ROLES")) return message.channel.send(bot.error("NO_PERM"));
    let channel = message.mentions.channels.first() || message.channel;
    let getLock = await bot.utils.Lock.load(message.guild.id)
    if(!getLock) return message.channel.send(bot.error("CONFIG_ERROR"));
    let checkLock = await bot.utils.Lock.check(channel.id);
    if(checkLock) {
        await bot.utils.Lock.process(channel, getLock.roles, true)
        return message.channel.send(bot.su(`Unlocked-down ${channel}`))
    } else {
        return message.channel.send(bot.error(`NO_LOCK`))
    }
    
}

exports.help = {
    name: "unlockdown",
    aliases: [""],
    description: "Remove lockdown",
    usage: "(channel)"
}