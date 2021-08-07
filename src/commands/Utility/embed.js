const Discord = require("discord.js")

function validURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(str);
}


exports.run = async (bot,message,args) => {
  if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(bot.error("NO_PERM"))
  if(args[0] && args[0] == 'edit') {
    let msg = args[1];
    if(!msg) return message.channel.send(bot.error("INVALID_ARGS"))
    for(let channel of message.guild.channels.cache.values()) {if(msg !== args[1]) break; if(channel.type !== "text") continue; let ab = null; let m = await channel.messages.fetch(msg).then(a => ab = a).catch(() => {}); if(!ab) continue; msg = ab}
    if(!msg) return;
    let extEmb = msg.embeds;
    if(!extEmb) return message.channel.send(bot.error("NO_EMB"))
    extEmb = extEmb[0]
    let load = await bot.utils.Emb.loadQuestions();
    let keys = load.k;
    let val = load.v;
    let emb = new Discord.MessageEmbed()
    .setTitle("Please choose a property to edit")
    .setDescription(`${val.join("\n")}`)
    .setColor(bot.color);

    message.channel.send(emb).then(async m => {
      for(let k of keys) {await m.react(k)}
      const filter = (reaction, user) => keys.includes(reaction.emoji.name) && user.id == message.author.id;
      const collector = m.createReactionCollector(filter, {time: 60000*5, max:1});
      collector.on('collect', async r => {
        let i = keys.indexOf(r.emoji.name);
        let ss = val[i].split(" ");
        let prop = ss[1]
        let ans = await bot.awaitReply(message, `Please supply a value for the ${prop}`)
        extEmb[prop.toLowerCase()] = ans.content;
        msg.edit(extEmb)
        return message.channel.send("Updated")
      })
    })
  } else {
    let arr = [];
    let emb = new Discord.MessageEmbed()
    emb.setColor(bot.color)
    let list = ['a channel', 'a title', 'a description', 'a color', 'an image']
    let color = ''
    let channel;
    let th;
    for(let item of list) {
      let ans = await bot.awaitReply(message, `Please enter ${item}`);
      item = item.split(" ");
      item = item[1];
      if(item == 'channel') {
        let chan = ans.mentions.channels.first();
        if(!chan) {channel = message.channel} else {channel = chan}
      }
      if(ans.attachments.first()) {
        th = ans.attachments.first().url;
      } else {
        ans = ans.content;
        if(ans == "none") {ans = null}
        if(item == 'image') {th = validURL(ans) ? ans : null;}
         else if(item == 'color') {
          if(ans == null) {color = bot.color} else {color = ans};
        } else {  emb[item] = ans}
      }

    }
    emb.setColor(color);
    emb.setImage(th)
  return channel.send(emb).catch(e => {message.channel.send(bot.error("NO_CH") + ' actual error is ' + e.message + ' POG FROG')})
  }
}

exports.help = {
  name: "embed",
  aliases: [""],
  description: "Send or edit an embed",
  usage: "()"
}
