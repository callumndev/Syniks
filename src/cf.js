const Discord = require("discord.js")
let types = ['h', 't']
let ls = ['Heads', 'Tails']
let nums = [2, 2]
let chance = [50, 50]

const { formatMilliseconds, parseMilliseconds } = require('format-ms')

exports.run = async (bot,message,args) => {

  let now = new Date().getTime();
    let type = args[0];
    let money = parseInt(args[1]);
    if(!args[0] || !args[1]) return message.channel.send(bot.error("INVALID_ARGS"));
    if(isNaN(money)) return message.channel.send(bot.error("INVALID_ARGS"));
    if(money == 0 || money < 0) return message.channel.send(bot.error("INVALID_ARGS"));
    let userBal = await bot.utils.Level.getUser(message.member);
    if(money > userBal.points) return message.channel.send("**Insufficient Funds!**");
    let remove = await bot.utils.Level.remove(message.member, money)
    let getT = types.indexOf(type);
    if(getT == -1) return message.channel.send("**Type not found!**");
    let ans;
    if(getT == 0) {ans = ls[1]} else {ans = ls[0]}
    let number = Math.floor(Math.random() * 2) + 1;
    let embed = new Discord.MessageEmbed()
    .setAuthor(`${message.author.tag}'s CoinFlip`, message.author.avatarURL())
    .addField(`**${message.author.username}**`, ls[getT], true)
    .addField(`**Global Bot**`, "...", true)
    .setColor("#deb887");
    let msg = await message.channel.send(embed);

      if(number == 2) {
      let winnings = money * 2;
      let addMoney = await bot.utils.Level.add(message.member, winnings);
        let coolAdd = await bot.utils.Cool.add(message.member, "cf", 5000);
        let win = new Discord.MessageEmbed()
        .setAuthor(`${message.author.tag}'s CoinFlip`, message.author.avatarURL())
        .addField(`**${message.author.username}**`, ls[getT], true)
        .addField(`**Global Bot**`, ls[getT], true)
        .setDescription(`You have won **${winnings}** coins!`)
        .setColor("#32cd32");
      return msg.edit(win);
      } else {
              let coolAdd = await bot.utils.Cool.add(message.member, "cf", 5000);
              let lose = new Discord.MessageEmbed()
              .setAuthor(`${message.author.tag}'s CoinFlip`, message.author.avatarURL())
              .addField(`**${message.author.username}**`, ls[getT], true)
              .addField(`**Global Bot**`, ans, true)
              .setDescription(`You have lost **${money}**`)
              .setColor("#FF0000");
        return msg.edit(lose)
}

  } else {
    let remaining = formatMilliseconds(check - now, { ignore: [ 'millisecond' ], units: 'long' })
    return message.channel.send(`You're on a **1m 30s** cooldown. You have **${remaining}** left.`)
  }

exports.help = {
  name: "cf",
  description: "Coin flip points",
  usage: "(h/t) (amount)",
  admin: false
}
