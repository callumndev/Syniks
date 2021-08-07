const Discord = require("discord.js")

exports.run = async (bot,message,args) => {
  let load = await bot.utils.Help.load(bot);
  let desc = '';
  let keys = [];
  let val = [];
 for(let [key,value] of load) {
   if(key == 'bypass list') continue;
   keys.push(key);
   val.push(value)
   desc = desc + `\n**${value.q}**`
 }
 let emb = new Discord.MessageEmbed()
 .setTitle("Help Menu")
 .setDescription(desc)
 .setColor(bot.color)
 .setThumbnail(bot.user.avatarURL())

  message.channel.send(emb).then(async m => {
    for(let k of keys) {await m.react(k)};
    const filter = (reaction, user) => keys.includes(reaction.emoji.name) && user.id == message.author.id;
    const collector = m.createReactionCollector(filter, {time: 60000*2});
    collector.on('collect', async r => {
      let ar = keys.indexOf(r.emoji.name)
      m.reactions.removeAll();
      let v = val[ar].key
      let loadHelp = await bot.utils.Help.loadCat(v);
      let prefix = message.guild.config.prefix;
      let cmds = [];
      loadHelp.forEach(cmd => {
        cmds.push(`**${prefix + cmd.command} ${cmd.usage.length > 2 ? `** *` + cmd.usage + `*` : "**"} - ${cmd.description}`)
      })
      let help = new Discord.MessageEmbed()
      .setTitle(`**Help Menu**`)
      .setDescription(cmds.join("\n\n") || "No commands recorded!")
      .setColor(bot.color)
      .setThumbnail(bot.user.avatarURL)

      return m.edit(help);
    })
    collector.on('end', collected => {
      if(collected.size > 0) return;
      emb = new Discord.MessageEmbed()
      .setTitle(":x: Expired :x:")
      .setDescription(`This message has expired for performance reasons. Please re-run the command if you require further help.`)
      .setColor(bot.color);
      bot.runSet.delete(message.guild.id)
      m.reactions.removeAll();
        return m.edit(emb)
    })
  })


}

exports.help = {
  name: "help",
  aliases: ["commands", "cmds"],
  description: "Displays this command",
  usage: "()"
}
