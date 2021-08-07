const log = module.exports;
const Discord = require("discord.js")
const config = require("./config.js")

log.send = async(bot,message,id,msg,img,t,eventName) => {
  return new Promise(async(resolve,reject) => {
    let fetchConf;
    if(message) {fetchConf = message.guild.config} else {fetchConf = await config.load(id)}
    let ch;
    if(!t) {ch = fetchConf.eventLogChannel} else {ch = fetchConf.modLogChannel};
    let findGuild = bot.guilds.cache.get(id);
    if(!findGuild) return resolve(false);
    let channel = findGuild.channels.cache.get(ch);
    if(!channel) return resolve(false);
    if(!img) {img = null}
    if(fetchConf.disabledEvents.includes(eventName)) return resolve(false);
    let genEmb = log.format(msg,findGuild,img,t)
    channel.send(genEmb)
    resolve();
  })
}


log.format = (m,g,mg,i) => {
  let e = new Discord.MessageEmbed()
  .setTitle(`${m.split(":")[0]}`)
  .setDescription(m.split(":")[1])
  .setThumbnail(g.iconURL());
  if(mg) {e.setThumbnail(mg)}
  if(!i) {e.setColor("#FFFF00")} else {e.setColor("FF0000")}

  return e;
}
