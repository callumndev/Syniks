const Discord = require("discord.js")
let delay = ms => new Promise(r => setTimeout(r, ms));


exports.run = async (bot,message,args) => {
if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(bot.error("NO_PERM"));
let getT = await bot.utils.Ticket.checkCh(message.channel.id);
if(!getT) return message.channel.send(bot.error("NO_T"))
let getCh = await bot.utils.Ticket.checkConf(message.guild.id);
let remove = await bot.utils.Ticket.delete(message.channel.id)
let e = new Discord.MessageEmbed()
.setTitle("Ticket closing in 5 seconds...")
.setColor(bot.color);
message.channel.send(e)
await delay(5000);
message.channel.delete();
let ticketEnded = new Discord.MessageEmbed()
.setTitle(`Ticket Closed`)
.setColor(bot.color)
.addField(`Opened by`,  `**${message.guild.members.cache.get(getT.user) || "User Left"}**`)
.addField(`Closed By`, `${message.member}`)
.setThumbnail(message.guild.iconURL())
if(getCh && getCh.log) {
  let transcriptCh = message.guild.channels.cache.get(getCh.log)
  if(!transcriptCh) return;
  transcriptCh.send({
      embed: ticketEnded,
      files: [{
          attachment: `./transcripts/${message.channel.id}.txt`,
          name: `ticket.txt`
        }],
    })
}
}

exports.help = {
  name: "close",
  aliases: [''],
  description: "Closes a ticket",
  usage: "()"
}
