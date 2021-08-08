const Discord = require("discord.js")

function genEmb(list, bot) {
    keys = [];
    val = [];
    for(let [key,value] of list) {
        if(key == 'bypass list') continue;
        keys.push(key);
        val.push(value)
    }
    let emb = new Discord.MessageEmbed()
    .setTitle("Automod Configuration")
    .setDescription(`Bypass List: ${list.get('bypass list')}`)
    .setColor(bot.color);
    for(let v of val) {
        if(!v.q) continue;
        let t;
        if(v.enabled == true) {t = "Enabled"} else if(v.enabled == false) {t = "Disabled"} else {t = v.enabled}
        emb.addField(`${v.q}`, t)
    }
    return {keys: keys, val: val, emb: emb};
}

exports.run = async (bot,message,args) => {
    if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(bot.error('NO_PERM'));
    if(bot.runSet.has(message.guild.id)) return message.channel.send(bot.error("ALR_RUN"))
    let list = new Map();
    list = await bot.utils.Auto.load(message.guild.id)
    
    let a = genEmb(list, bot)
    
    message.channel.send(a.emb).then(async m => {
        bot.runSet.add(message.guild.id)
        for(let k of a.keys) {await m.react(k)};
        const filter = (reaction, user) => a.keys.includes(reaction.emoji.name) && user.id == message.author.id;
        const collector = m.createReactionCollector(filter, {time: 60000*5});
        collector.on('collect', async r => {
            let ar = a.keys.indexOf(r.emoji.name)
            r.users.remove(message.author)
            if(a.val[ar].key.includes("bypass")) {
                let ans;
                if(a.val[ar].key.endsWith("+")) {
                    ans = await bot.awaitReply(message, `Please mention a role (or roles) to add to the bypass`)
                } else {
                    ans = await bot.awaitReply(message, `Please mention a role (or roles) to remove from the bypass`)
                }
                let sp = ans.content.split(" ");
                let roles = [];
                sp.forEach(s => {
                    if(isNaN(s)) {
                        s = s.replace(/[<@>&]/g, "");
                        let r = message.guild.roles.cache.get(s);
                        if(!r) return;
                        roles.push(r.id)
                    } else {
                        let r = message.guild.roles.cache.get(s);
                        if(!r) return;
                        roles.push(r.id)
                    }
                })
                await bot.utils.Auto.set(message.guild.id, a.val[ar].key, roles)
            } else if(a.val[ar].key.includes("mentionCount")){
                let ans = await bot.awaitReply(message, `What would you like the threshold to be for mass mentions?`)
                ans = parseInt(ans);
                if(!ans)  {return message.channel.send(bot.error("BAD_VAL"))}
                if(isNaN(ans)) {return message.channel.send(bot.error("BAD_VAL"))}
                if(ans > 10) return message.channel.send(bot.error("TOO_HIGH"));
                if(ans < 1) return message.channel.send(bot.error("BAD_VAL"))
                await bot.utils.Auto.set(message.guild.id, a.val[ar].key, ans)
                
            } else {
                let getV = a.val[ar].enabled;
                if(getV == false) {getV = true} else {getV = false}
                await bot.utils.Auto.set(message.guild.id, a.val[ar].key, getV)
            }
            
            list = await bot.utils.Auto.load(message.guild.id)
            a = genEmb(list, bot);
            m.edit(a.emb)
        })
        collector.on('end', collected => {
            emb = new Discord.MessageEmbed()
            .setTitle(":x: Expired :x:")
            .setDescription(`This message has expired for performance reasons. Please re-run the command if you require further setup control.`)
            .setColor(bot.color);
            bot.runSet.delete(message.guild.id)
            m.reactions.removeAll();
            return m.edit(emb)
        })
    })
    
    
}

exports.help = {
    name: "autoconf",
    aliases: ["config-automod"],
    usage: '()',
    description: "Update server automod"
}