const Discord = require("discord.js")
const ms = require("ms")

exports.run = async (bot,message,args) => {
  if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(bot.error("NO_PERM"))
  let getUser = bot.parse(message);
  let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1])
  let time = args[2]
  time ? time =  ms(time) : time = time
  if(!Number.isInteger(time)) {time = null}
  if(!role || !getUser || !time) return message.channel.send(bot.error("INVALID_ARGS"));
  if(role.position >= message.member.roles.highest.position) return message.channel.send(bot.error("LOWER_POS"))
  if(getUser.roles.cache.get(role.id)) return message.channel.send(bot.error("ALR_R"))
  if(getUser.roles.highest.position > message.member.roles.highest.position) return message.channel.send(bot.error("LOWER_ROLE"))
  getUser.roles.add(role).then(add => {
    bot.utils.Role.add(message.guild.id, getUser.user.id, role.id, time)
    return message.channel.send(bot.su(`Role has been applied for ${ms(time)}`))
  }).catch(() => {
    return message.channel.send(bot.error(`An error has occured!`))
  })
}

exports.help = {
  name: "temprole",
  aliases: [''],
  description: "Adds a role to a user for a set amount of time",
  usage: "(user) (role) (time)"
}
