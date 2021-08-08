const Discord = require("discord.js");
const snekfetch = require('snekfetch');

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

exports.run = async (bot, message, args) => {
    let getCache = bot.utils.Cache.getMemes();
    if(!getCache) {
        let number = Math.floor(Math.random() * 2) + 1;
        let link;
        let name
        if(number == 1) {link = 'https://www.reddit.com/r/memes.json?sort=top&t=week'; name="r/memes"}
        if(number == 2) {link = 'https://www.reddit.com/r/dankmemes.json?sort=top&t=week'; name="r/dankmemes"}
        try {
            const { body } = await snekfetch
            .get(link)
            .query({ limit: 800 });
            const allowed = message.channel.nsfw ? body.data.children : body.data.children.filter(post => !post.data.over_18);
            if (!allowed.length) return message.channel.send('It seems we are out of fresh memes!, Try again later.');
            bot.utils.Cache.set(allowed)
            const randomnumber = Math.floor(Math.random() * allowed.length)
            const embed = new Discord.MessageEmbed()
            .setColor(bot.color)
            .setTitle(`**` + allowed[randomnumber].data.title + `**`)
            .setFooter("Posted by: " + allowed[randomnumber].data.author + " on " + name)
            .setImage(allowed[randomnumber].data.url)
            .addField("Post Stats:", `^ ` + numberWithCommas(allowed[randomnumber].data.ups) + " **  /  **:speech_balloon: " + numberWithCommas(allowed[randomnumber].data.num_comments))
            message.channel.send(embed)
            
        } catch (err) {
            return console.error(err);
        }
    } else {
        const randommeme = getCache[Math.floor(Math.random() * getCache.length)];
        const embed = new Discord.MessageEmbed()
        .setColor(bot.color)
        .setTitle(`**` + randommeme.data.title + `**`)
        .setFooter("Posted by: " + randommeme.data.author + " on " + "r/memes")
        .setImage(randommeme.data.url)
        .addField("Post Stats:", `^ ` + numberWithCommas(randommeme.data.ups) + " **  /  **:speech_balloon: " + numberWithCommas(randommeme.data.num_comments))
        message.channel.send(embed)
        
    }
    
}

exports.help = {
    name: "meme",
    aliases: [],
    description: "M E M E",
    usage: "()"
}