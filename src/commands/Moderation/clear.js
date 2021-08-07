const Discord = require("discord.js")

exports.run = async (bot,message,args) => {
  if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(bot.error("NO_PERM"))
  let arg = parseInt(args[0]);
  if(!arg) return message.channel.send(bot.error("INVALID_ARGS"))
  // message.channel.bulkDelete(arg+1);
  message.delete()
  message.channel.messages.fetch({ limit: arg })
    .then(messages => {
      let deletedMessages = 0;

      messages.forEach( msg => {
        try {
          msg.delete()
          deletedMessages++;
        } catch (error) {}
      } )
      return message.channel.send(bot.su(`Cleared ${ deletedMessages == messages.size ? deletedMessages : `${deletedMessages}/${messages.size}` } messages`))
    })
    .catch(console.error);
}

exports.help = {
  name: "clear",
  aliases: [''],
  description: "Purge messages",
  usage: "(number)"
}
