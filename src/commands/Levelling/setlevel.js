const Discord = require("discord.js")

exports.run = async (bot,message,args) => {
  if(!bot.config.ownerID.includes(message.author.id)) return message.channel.send(bot.error("NO_PERM"))
  let user = bot.parse(message);
  let add = parseInt(args[1]);
  if(!user) return message.channel.send(bot.error("INVALID_ARGS"))
    if(!add) return message.channel.send(bot.error("INVALID_ARGS"))
    if(add < 0) return message.channel.send(bot.error("INVALID_ARGS"))
    let getMem = await bot.utils.Level.set(user,add*bot.config.level_up)

    return message.channel.send(bot.su(`Successfully set ${user.user.tag} to Level ${add}`))

}

exports.help = {
  name: "setlevel",
  aliases: [""],
  description: "Sets level",
  usage: "(user)"
}
