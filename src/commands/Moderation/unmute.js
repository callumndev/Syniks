const Discord = require("discord.js")
const ms = require("ms")

exports.run = async (bot,message,args) => {
    if(!message.member.hasPermission("MANAGE_MESSAGES")) return;
    let user = bot.parse(message)
    if(!user) return message.channel.send("**[:x:] Please provide a valid user!**")
    let findRole = await bot.utils.Config.load(message.guild.id);
    let mute = findRole.mutedRole || null;
    if(!mute) return message.channel.send(bot.error("NO_ROLE"));
    let remove = user.roles.remove(mute);
    let getTemp = await bot.utils.Temp.get(message.guild.id, user.user.id, 'mute');
    if(getTemp) {await bot.utils.Temp.remove(message.guild.id, user.user.id, 'mute')};
    let log = await bot.utils.Log.send(bot,message,message.guild.id,`Unmute Report:
    
    **User** ${user.user.tag}
    **Unmuted By** ${message.author.tag}`,0,1)
    return message.channel.send(bot.su(`Unmuted ${user.user.tag}`))
}

exports.help = {
    name: "unmute",
    aliases: [],
    usage: '<user>',
    description: "Unmute a user"
}