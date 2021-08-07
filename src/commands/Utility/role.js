const Discord = require("discord.js")
let delay = ms => new Promise(r => setTimeout(r, ms));
const { formatMilliseconds, parseMilliseconds } = require('format-ms')

sendAll = async (message,list) => {
  return new Promise(async (resolve,reject) => {
    let i = 0;
    for(let member of message.guild.members.cache.values()) {
    for(let ro of list) {
      await delay(200).then(() => {
          member.roles.add(ro)
      })
    }
    i++;
  }
  return resolve(i)
  })
}

exports.run = async (bot,message,args) => {
  if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(bot.error("NO_PERM"))
  let role = message.mentions.roles.first();
  if(!role) return message.channel.send(bot.error("INVALID_ARGS"));
  let list = [];
  for(let r of message.mentions.roles.values()) {list.push(r)}
  let mc = message.guild.memberCount;
  message.channel.send(bot.su(`Beginning role application to ${mc} members. Estimated time: ${formatMilliseconds(mc * 200, {units: 'long', ignore: ['millisecond']})}`))
  let send = await sendAll(message,list);
return message.channel.send(bot.su(`Applied to ${send} members!`))
}

exports.help = {
  name: "roleall",
  aliases: [''],
  description: "Sets all users roles",
  usage: "(role)"
}
