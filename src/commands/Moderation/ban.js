const Discord = require("discord.js")
const ms = require("ms")

exports.run = async (bot,message,args) => {
    if(!message.member.hasPermission("MANAGE_MESSAGES")) return;
    let offl;
    let user = bot.parse(message)
    if(!user && Number.isInteger(parseInt(args[0]))) {user = args[0]; offl=true}
    if(!user) return message.channel.send("**[:x:] Please provide a valid user!**")
    let reason = args.slice(1).join(" ");
    if(!reason) {reason = "No reason provided!"}
    if(offl) {
        let check = await bot.utils.Ban.check(user)
        if(check) return message.channel.send(bot.error("Ban already detected for this user!"))
        bot.utils.Ban.add(user)
    } else {
        if(user.roles.highest.position >= message.member.roles.highest.position) return message.channel.send("**[:x:] This user is above you!**")
        if(user.roles.highest.position >= message.guild.me.roles.highest.position) return message.channel.send("**[:x:] This user is above me!**")
        user.ban({reason});
        let log = await bot.utils.Log.send(bot,message,message.guild.id,`Ban Report:
        
        **User** ${user.user.tag}
        **Staff Member** ${message.author.tag}
        **Reason** ${reason}`, user.user.avatarURL() ,1);
        let addInf = await bot.utils.Infract.add(message,user.user.id,reason,'ban')
    }
    return message.channel.send(bot.mod(reason,'permament',user,message.member,'banned'));
    
}

exports.help = {
    name: "ban",
    aliases: ["mban"],
    usage: '<user> (reason)',
    description: "Bans a user"
}