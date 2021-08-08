const Discord = require("discord.js")
const { formatMilliseconds, parseMilliseconds } = require('format-ms')

exports.run = async (bot,message,args) => {
    let check = await bot.utils.Cool.getUser(message.member, "vouch");
    let user = bot.parse(message);
    if(!user || user == message.member) {return message.channel.send(bot.error("INVALID_ARGS"))}
    let now = new Date().getTime();
    let proceed = false;
    if(!check) {proceed = true} else {
        let remaining = check - now;
        if(remaining < 0) {proceed = true; await bot.utils.Cool.remove(message.member, "vouch")}
    }
    if(proceed) {
        await bot.utils.Vouch.add(user.user.id)
        let coolAdd = await bot.utils.Cool.add(message.member, "vouch", 1000*60*60*12);
        return message.channel.send(bot.su(`Vouch has been added for ${user.user.tag}!`))
    } else {
        let remaining = formatMilliseconds(check - now, { ignore: [ 'millisecond' ], units: 'long' })
        return message.channel.send(`You're on a **24 hour** cooldown. You have **${remaining}** left.`)
    }
}

exports.help = {
    name: "vouch",
    aliases: ['vouch-add'],
    description: "Vouch for a user",
    usage: "(user)"
}