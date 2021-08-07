const Discord = require("discord.js")
const ms = require("ms")
let emojis = ['✅' , '❌']
exports.run = async (bot,message,args) => {
    let getSuggest = args.join(" ");
    if(!getSuggest) return message.channel.send(bot.error("INVALID_ARGS"));
    let getConf = await bot.utils.Config.load(message.guild.id);
    let findChan = message.guild.channels.cache.get(getConf.suggestionChannel);
    if(!findChan) return message.channel.send(bot.error("CONFIG_ERROR"));
    let emb = new Discord.MessageEmbed()
    .setAuthor(`${message.author.tag} | Suggestion`, message.author.avatarURL())
    .setDescription(`**${getSuggest}**`)
    .setThumbnail(message.guild.iconURL())
    .setColor(bot.color);
    findChan.send(emb).then(m => {for(let em of emojis) {m.react(em)}})
    if(message.channel.id !== getConf.suggestionChannel) {
        return message.channel.send(bot.su(`Suggestion submitted!`))
    } else {
        message.delete();
    };
};

exports.help = {
  name: "suggest",
  aliases: [''],
  usage: '<suggest>',
  description: "Provide a suggestion"
}
