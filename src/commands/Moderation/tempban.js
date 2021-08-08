const Discord = require("discord.js")
const ms = require("ms")

exports.run = async (bot,message,args) => {
    if(!message.member.hasPermission("MANAGE_MESSAGES")) return;
    let user = bot.parse(message)
    if(!user) return message.channel.send("**[:x:] Please provide a valid user!**")
    if(!args[1]) return message.channel.send(bot.error("INVALID_ARGS"))
    let time = ms(args[1]);
    if(isNaN(time)) return message.channel.send(bot.error("INVALID_ARGS"))
    let reason = args.slice(2).join(" ");
    if(!reason) {reason = "No reason provided!"}
    if(user.roles.highest.position >= message.member.roles.highest.position) return message.channel.send("**[:x:] This user is above you!**")
    if(user.roles.highest.position >= message.guild.me.roles.highest.position) return message.channel.send("**[:x:] This user is above me!**")
    user.ban({reason})
    let log = await bot.utils.Log.send(bot,message,message.guild.id,`Temp Ban Report:
    
    **User** ${user.user.tag}
    **Time** ${ms(time)}
    **Staff Member** ${message.author.tag}
    **Reason** ${reason}`, user.user.avatarURL() ,1);
    let addInf = await bot.utils.Infract.add(message,user.user.id,reason,'ban')
    let add = await bot.utils.Temp.add(message.guild.id,user.user.id,'ban', time);
    return message.channel.send(bot.mod(reason,ms(time),user,message.member,'banned'));
    
}

exports.help = {
    name: "tempban",
    aliases: ["tban"],
    usage: '<user> <time> (reason)',
    description: "Tempbans a user"
}