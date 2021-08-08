const Discord = require("discord.js")
const ms = require("ms")

exports.run = async (bot,message,args) => {
    let quest = bot.utils.Poll.questions;
    let ans = [];
    for(let q of quest) {
        let an = await bot.awaitReply(message, q)
        ans.push(an.mentions.channels.first() || an.content || "")
    }
    let title = ans[0];
    let options = ans[1];
    options = options.split(",")
    let ch = ans[2];
    let time = ans[3];
    time = ms(time);
    let proc = await bot.utils.Poll.procOp(options);
    if(!title || !options || !ch || !time) return message.channel.send(bot.error("INVALID_ARGS"));
    let desc = '';
    let k = [];
    for(let key of Object.keys(proc)) {
        let emoji = key;
        k.push(emoji)
        let name = proc[key]
        desc = desc+`${emoji} ${name}\n`
    }
    let poll = new Discord.MessageEmbed()
    .setTitle(title)
    .setColor(bot.color)
    .setDescription(desc)
    .setThumbnail(message.guild.iconURL())
    ch.send(poll).then(async m => {
        for(let emoji of k) {await m.react(emoji)}
        let push = await bot.utils.Poll.add(message.guild.id, m.id, proc, ch.id, time)
    })
}

exports.help = {
    name: "poll",
    aliases: [],
    description: "Start a poll!",
    usage: "()"
}