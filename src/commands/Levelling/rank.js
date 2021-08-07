const Discord = require('discord.js');

function numberWithCommas(x) {
    x = x.toString();
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(x))
        x = x.replace(pattern, "$1,$2");
    return x;
}

let types = ['add', 'remove']
exports.run = async (bot,message,args) => {
            if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(`**Insufficient Permissions!**`)
            let type = args[0];
            if(!type) return message.channel.send(bot.error("INVALID_ARGS"))
            if(types.indexOf(type.toLowerCase()) == -1) return message.channel.send(bot.error("INVALID_ARGS"))
          switch(type) {
            case "add":
              let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1])
              if(!role) return message.channel.send(bot.error("INVALID_ARGS"))
              if(!args[2]) return message.channel.send(bot.error("INVALID_ARGS"))
              let level = args[2].replace(",", "").replace(",", "").replace(",", "").replace(",", "")
              if(isNaN(level)) return message.channel.send(bot.error("INVALID_ARGS"))
              if(level < 1) return message.channel.send(bot.error("INVALID_ARGS"))
              if(role.position > message.guild.me.roles.highest.position) return message.channel.send("**This role is too high!**")
              await bot.utils.Level.addRank(message.guild.id, level, role.id)
              message.channel.send(bot.su(`Added **${role}** for \`${level}\``))
              break;
            case "remove":
            if(!args[1]) return message.channel.send(bot.error("INVALID_ARGS"))
            let lvl = args[1].replace(",", "").replace(",", "").replace(",", "").replace(",", "")
            if(isNaN(lvl)) return message.channel.send(bot.error("INVALID_ARGS"))
            await bot.utils.Level.removeRank(message.guild.id, lvl)
            return message.channel.send(bot.su(`Removed role for \`${lvl}\``))
              break;
            }

}
exports.help = {
  name: "rank",
  aliases: [''],
  description: "Adds ranks to levels",
  usage: "(add/remove) (role) (level)",
  admin: true
}
