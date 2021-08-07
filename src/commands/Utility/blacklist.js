const Discord = require("discord.js")

exports.run = async (bot,message,args) => {
  if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(bot.error('NO_PERM'));
  let caseA = args[0];
  if(!caseA) {
    let list = await bot.utils.Banned.load(message.guild.id);
    let emb = new Discord.MessageEmbed()
    .setTitle(`**Blacklisted Words**`)
    .setDescription(list.join("\n") || "No words saved!")
    .setColor(bot.color);

    return message.channel.send(emb)
  } else {
    let w = args[1]
    if(!w) return message.channel.send(bot.error("INVALID_ARGS"));
    switch(caseA) {
      case "add":
        await bot.utils.Banned.add(message.guild.id, w);
        return message.channel.send(bot.su(`Blacklisted words list updated successfully`))
      break;
      case "remove":
        await bot.utils.Banned.remove(message.guild.id, w);
        return message.channel.send(bot.su(`Blacklisted words list updated successfully`))
      break;
    }

  }
}

exports.help = {
  name: "blacklist",
  aliases: ['blacklist-words'],
  usage: '()',
  description: "Update blacklisted words"
}
