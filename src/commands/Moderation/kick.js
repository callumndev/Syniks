const Discord = require("discord.js")

exports.run = async (bot,message,args) => {
  if(!message.member.hasPermission("MANAGE_MESSAGES")) return;
  let user = bot.parse(message)
  if(!user) return message.channel.send("**[:x:] Please provide a valid user!**")
  let reason = args.slice(1).join(" ") || "No reason provided!"
  if(user.roles.highest.position > message.member.roles.highest.position) return message.channel.send("**[:x:] This user is above you!**")
    if(user.roles.highest.position >= message.guild.me.roles.highest.position) return message.channel.send("**[:x:] This user is above me!**")
  user.kick(reason);
  let log = await bot.utils.Log.send(bot,message,message.guild.id,`Kick Report:

    **User** ${user.user.tag}
    **Staff Member** ${message.author.tag}
    **Reason** ${reason}`, user.user.avatarURL() ,1);

  let addInf = await bot.utils.Infract.add(message,user.user.id,reason,'kick')
  return message.channel.send(bot.mod(reason,'permament',user,message.member,'kicked'));
}

exports.help = {
  name: "kick",
  aliases: [''],
  usage: '<user> (reason)',
  description: "Kicks a user"
}
