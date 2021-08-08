const Discord = require("discord.js")

exports.run = async (bot,message,args) => {
    if(!message.member.hasPermission("MANAGE_ROLES")) return message.channel.send(bot.error("NO_PERM"));
    if(args[0] && args[0].toLowerCase() == "setup") {
        let list = bot.utils.Lock.setup();
        let ans;
        for(let it of list) {
            let i = 0;
            let answer = await bot.awaitReply(message, it);
            while(!answer.mentions.roles.first()) {
                if(i == 3) break;
                i++;
                answer = await bot.awaitReply(message, it);
            }
            ans = answer.mentions.roles;
        }
        if(!ans.first()) return;
        let set = await bot.utils.Lock.set(message.guild.id, ans);
        return message.channel.send(bot.su('Successfully configured lockdown'))
    } else {
        let channel = message.mentions.channels.first() || message.channel;
        let getLock = await bot.utils.Lock.load(message.guild.id)
        if(!getLock) return message.channel.send(bot.error("CONFIG_ERROR"));
        let checkLock = await bot.utils.Lock.check(channel.id);
        if(!checkLock) {
            await bot.utils.Lock.process(channel, getLock.roles, false)
            return message.channel.send(bot.su(`Locked-down ${channel}`))
        } else {
            return message.channel.send(bot.error(`SET_LOCK`))
        }
        
    }
}

exports.help = {
    name: "lockdown",
    aliases: [""],
    description: "Lockdown command",
    usage: "(setup)"
}