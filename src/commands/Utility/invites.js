const Discord = require("discord.js")

exports.run = async (bot,message,args) => {
let user = message.member;
let pro = 'You have'
let getUser = bot.parse(message);
if(getUser && message.member.hasPermission("ADMINISTRATOR")) {user = getUser; pro = `${user.user.tag} has`};
let fetch = await message.guild.fetchInvites();
fetch = fetch.array();
let num = 0;
for(let i of fetch) {if(i.inviter.id == user.user.id) {num = num + i.uses}}
let emb = new Discord.MessageEmbed()
.setAuthor(`${pro} ${num} invite(s)`, user.user.avatarURL())
.setColor(bot.color);

return message.channel.send(emb);
}

exports.help = {
  name: "invites",
  aliases: ['inv'],
  description: "View invites",
  usage: "(user)"
}
