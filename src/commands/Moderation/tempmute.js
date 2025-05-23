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
    let log = await bot.utils.Log.send(bot,message,message.guild.id,`Temp Mute Report:
    
    **User** ${user.user.tag}
    **Time** ${ms(time)}
    **Staff Member** ${message.author.tag}
    **Reason** ${reason}`, user.user.avatarURL() ,1);
    let addInf = await bot.utils.Infract.add(message,user.user.id,reason,'mute')
    let add = await bot.utils.Temp.add(message.guild.id,user.user.id,'mute', time);
    let findRole = await bot.utils.Config.load(message.guild.id);
    let mute = findRole.mutedRole || null;
    if(!mute || !message.guild.roles.cache.get(mute)) {mute = await message.guild.roles.create({
        data: {
            name: 'Muted',
            color: 'BLUE',
        }
    });
    message.guild.channels.cache.forEach(c => {
        c.updateOverwrite(mute, {
            SEND_MESSAGES: false
        })
    })
    upd = await bot.utils.Config.set(message.guild.id, 'mutedRole', mute.id);
};
user.roles.add(mute)
return message.channel.send(bot.mod(reason,ms(time),user,message.member,'muted'));

}

exports.help = {
    name: "tempmute",
    aliases: ["tmute"],
    usage: '<user> <time> (reason)',
    description: "Tempmute a user"
}