
const Discord = require("discord.js")

exports.run = async (bot,message,args) => {
  if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(bot.error('NO_PERM'));
  let list = bot.utils.Ticket.loadQuestions();
  let loadConf = await bot.utils.Ticket.checkConf(message.guild.id);
  if(!loadConf) {
    let answer = await bot.awaitReply(message, `Please provide a transcripts channel`);
    let c = answer.mentions.channels.first() || message.guild.channels.cache.get(content)
    if(!c) return message.channel.send(bot.error("NO_CH"))
    bot.utils.Ticket.setTr(message.guild.id, c.id)
  }
  let end = [];
  let mOb = {};
  let add = {guild: message.guild.id};
  for(let q of list) {
    let answer = await bot.awaitReply(message, q.q);
    if(!answer) {message.channel.send(bot.error('VALUE_NOT_SET')); continue};
    let content = answer.content;
    if(q.key == "channel") {
      let c = answer.mentions.channels.first() || message.guild.channels.cache.get(content)
      if(!c) return message.channel.send(bot.error("NO_CH"))
      mOb[q.key] = c
    } else {
      let ep = ""
      let r;
      if(q.key == 'emoji') {
        let r;
      if(content.startsWith("<")) {
        let emoji;
        let split = content.split(":");
        emoji = split[2].replace(">", "")
        r = message.guild.emojis.cache.get(emoji);
      } else {r = content}
      if(mOb.channel) {let f = await mOb.channel.messages.fetch(mOb.message); if(f) {f.react(r || message.guild.emojis.cache.get(r))}}
      content = r;
  } else if (q.key == 'category') {
    let findCh = message.guild.channels.cache.get(content) || message.guild.channels.cache.find(c => c.name.toLowerCase() == content.toLowerCase())
    if(!findCh) return message.channel.send(bot.error("NO_CAT"))
    content = findCh.id
    ep = findCh;
  } else if(q.key == 'role'){
    let r = answer.mentions.roles.first() || message.guild.roles.cache.find(c => c.name.toLowerCase() == content.toLowerCase())
    if(!r) return message.channel.send(bot.error("NO_R"))
    ep = r;
    content = r.id
  } else if (q.key == 'message') {
    mOb[q.key] = content;
  }
      end.push({q:q.q,key:q.key,ans: `${ep ? ep : content}`})
      add[q.key] = content;
    }
  }
  let push = await bot.utils.Ticket.add(add)
  let newConf = new Discord.MessageEmbed()
  .setTitle(`${message.guild.name} | Ticket Creation`)
  .setColor(bot.color)
  .setDescription(`A new ticket system has been created`)
  .setThumbnail(message.guild.iconURL());

  end.forEach(entr => {newConf.addField(`${entr.key}`, `${entr.ans}`, true)})
  return message.channel.send(newConf);

}

exports.help = {
  name: "ticket",
  aliases: ['ticket-setup'],
  usage: '()',
  description: "Add new ticket configuration"
}
