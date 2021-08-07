const Discord = require("discord.js")
const ms = require("ms")
let emojis = ['✅' , '❌']
exports.run = async (bot,message,args) => {
  if(!args[0]) return message.channel.send(bot.error("INVALID_ARGS"))
  args[0] = args[0].toLowerCase();
  if(args[0] && args[0] == 'add') {
    let faq = args.slice(1).join(" ");
    if(!faq) return message.channel.send(bot.error("INVALID_ARGS"))
    let add = await bot.utils.Faq.add(message.guild.id, faq)
    return message.channel.send(bot.su(`FAQ has been updated! ${add > 1 ? `This FAQ is number ${add}` : ''}`))
  } else if (args[0] == 'remove'){
    let num = args[1];
    let rem = await bot.utils.Faq.remove(message.guild.id, num)
    return message.channel.send(bot.su(`FAQ has been updated!`))
  } else {
    let num = args[0];
    if(isNaN(num)) return message.channel.send(bot.error("INVALID_ARGS"))
    let load = await bot.utils.Faq.load(message.guild.id);
    let loadFaq = load[num-1];
    let f = new Discord.MessageEmbed()
    .setTitle(`Frequently Asked Questions`)
    .setDescription(loadFaq ? loadFaq.faq : "No FAQ found for this number!")
    .setColor(bot.color)
    .setThumbnail(message.guild.iconURL())
    .setFooter(loadFaq ? `${num}/${load.length}` : '--');

    return message.channel.send(f)
  }
}

exports.help = {
  name: "faq",
  aliases: [''],
  usage: '',
  description: "FAQ"
}
