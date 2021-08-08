process.env.NODE_ENV = process.platform == 'linux' ? 'production' : 'development';

const Discord = require("discord.js")
const bot = new Discord.Client({ disableMentions: "everyone", ws: { intents: Discord.Intents.ALL }, partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
const fs = require("fs")
const requireAll = require('require-all');
const Sequelize = require("sequelize");
const MusicClient = require("./utils/MusicClient");
bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();
bot.config = require("./config/config.json")
bot.errorList = require("./error_msg/error.js")
bot.error = (t) => {
    let e = bot.errorList[t];
    if(!e) {e = t}
    return new Discord.MessageEmbed().setColor(bot.color).setDescription(`**[:x:] ${e}**`)
}
bot.mod = (r,dur,user,staff,m) => {
    let t=user;
    if(Number.isInteger(parseInt(user))) {user = {user: {tag: t, avatarURL: '',ofl: true}}}
    return new Discord.MessageEmbed().setAuthor(`${user.user.tag} has been ${m}`, (user.user.ofl ? staff.user.avatarURL() : user.user.avatarURL())).setDescription(`**Reason:** ${r}\n\n**Duration:** ${dur.charAt(0).toUpperCase() + dur.substring(1)}\n\n**Issued By:** ${staff}`).setThumbnail(staff.guild.iconURL())
}
let delay = ms => new Promise(r => setTimeout(r, ms));
bot.utils = require("./utils/utils.js")
bot.color = "#ff4500"
let cool = [];
bot.MusicControl = new MusicClient(bot);
bot.manager = bot.MusicControl.manager;
bot.runSet = new Set();
bot.events = require("./events/handler.js")
const path = require('path')
bot.utils.numberGuesser.init( bot );


bot.getDirectories = source =>
fs.readdirSync(path.join( __dirname, source ), { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)


bot.on("ready", async () => {
    bot.manager.init(bot.user.id);
    await bot.utils.Help.db.sync();
    let getDirs = bot.getDirectories("./commands")
    await bot.utils.Help.db.destroy({truncate: true})
    let loaded = { commands: 0, events: 0 };
    getDirs.forEach(dir => {
        let files = fs.readdirSync(path.join( __dirname, 'commands', dir ))
        
        let jsfile = files.filter(f => f.split(".").pop() === "js");
        
        if (jsfile.length <= 0) {
            console.error("Could not find commands")
            
        } else {
            jsfile.forEach((f, i) => {
                let props = require(`./commands/${dir}/${f}`)
                loaded.commands++;
                bot.commands.set(props.help.name, props);
                let list = [];
                props.help.aliases.forEach(alias => {
                    bot.aliases.set(alias, props.help.name)
                    list.push(alias)
                })
                let aliasList;
                if(list.length > 1) {aliasList = list.join("/")} else {aliasList = "()"}
                bot.utils.Help.db.create({command: props.help.name, usage: props.help.usage, description: props.help.description, aliases: aliasList, cat: dir})
            })
        }
    });
    
    
    for(let i = 0; i < bot.events.list.length; i++) {
        let name = bot.events.list[i]
        const event = bot.events[name];
        if(!event) continue;
        bot.on(name, event.bind(null, bot));
        loaded.events++;
    }
    
    console.info(`[Syniks] Syniks ready with ${bot.guilds.cache.size} guilds.`);
    
    bot.user.setActivity("Syniks.com", {type: "PLAYING"})
})


bot.awaitReply = async (msg, question, limit = 60000) => {
    return new Promise(async (resolve,reject) => {
        const filter = m => m.author.id === msg.author.id;
        let e = new Discord.MessageEmbed()
        .setTitle(question)
        .setAuthor(msg.author.tag, msg.author.avatarURL())
        .setColor(bot.color)
        let m = await msg.channel.send(e);
        try {
            const collected = await msg.channel.awaitMessages(filter, { max: 1, errors: ['time'], time: limit });
            resolve(collected.first());
            setTimeout(function() {
                m.delete();
                collected.first().delete();
            }, 1000)
        } catch (e) {
            resolve(false);
        }
    })
}

bot.parse = (m,i) => {if(!i) {i = 0}; let me = m.mentions.members.first() || m.guild.members.cache.get(m.args[i]); return me || null;}
bot.parseCh = (m,i) => {if(!i) {i = 0}; let me = m.mentions.channels.first() || m.guild.channels.cache.get(m.args[i]); return me || null;}

bot.su = (m) => {return new Discord.MessageEmbed().setColor(bot.color).setDescription(`**[:white_check_mark:] ${m}**`)}


setInterval(async function() {
    let load = await bot.utils.Temp.load();
    let time = new Date().getTime();
    for(let entr of load) {
        if((entr.time - time) < 0) {
            switch(entr.type) {
                case "ban":
                let getGuild = bot.guilds.cache.get(entr.guild);
                if(!getGuild) continue;
                getGuild.members.unban(entr.id).catch(() => {});
                let rem = await bot.utils.Temp.remove(entr.guild, entr.id, entr.type);
                break;
                
                case "mute" :
                let getG = bot.guilds.cache.get(entr.guild);
                if(!getG) continue;
                let getMute = await bot.utils.Config.load(entr.guild);
                let r = getG.roles.cache.get(getMute.mutedRole);
                if(!r) continue;
                let mem = getG.members.cache.get(entr.id);
                if(!mem) continue;
                mem.roles.remove(r).catch(() => {});
                let remo = await bot.utils.Temp.remove(entr.guild, entr.id, entr.type);
                break;
            }
        }
    }
},5000)
setInterval(() => {bot.utils.Poll.check(bot)}, 30000)
setInterval(async () => {
    let load = await bot.utils.Stats.db.findAll({});
    for(let guild of load) {
        let g = bot.guilds.cache.get(guild.guild)
        if(!g) return;
        await bot.utils.Stats.update(g)
        await delay(500)
    }
}, 60000*3);

// THIS IS REQUIRED. Send raw events to Erela.js
bot.on("raw", d => bot.manager.updateVoiceState(d));

setInterval(async () => {
    let load = await bot.utils.Role.db.findAll({});
    for(let u of load) {
        if(u.time > new Date().getTime()) continue;
        let g = bot.guilds.cache.get(u.guild);
        if(!g) return;
        let m = g.members.cache.get(u.id) || await g.members.fetch(u.id);
        if(!m) return;
        m.roles.remove(u.role);
        bot.utils.Role.remove(u.id,u.role)
        await delay(500)
    }
}, 60000);

let stat = 0;
let stats = ['+help', `syniks.com`, `$guild guilds`]
setInterval(() => {
    if (!bot && !bot.user && typeof bot.user.setActivity != 'function ') return;
    let getStat = stats[stat];
    getStat = getStat.replace("$mem", bot.users.cache.size);
    getStat = getStat.replace("$guild", bot.guilds.cache.size)
    bot.user.setActivity(getStat, {type: "WATCHING"});
    if(stat == (stats.length - 1)) {stat = 0} else {stat++}
}, 10000)


//
const util = require('util');
const childProcess = require('child_process');

require.extensions['.txt'] = (module, filename) => {
    module.exports = fs.readFileSync(filename, 'utf8');
};

const env = process.env.NODE_ENV;
const logo = require('./logo.txt');



init().then(() => {
    process.on('uncaughtException', handleException.bind(this));
    process.on('unhandledRejection', handleRejection.bind(this));
    
    function handleRejection(reason, p) {
        try {
            console.error('Unhandled rejection at: Promise ', p, 'reason: ', reason); // eslint-disable-line
        } catch (err) {
            console.error(reason); // eslint-disable-line
        }
    }
    
    function handleException(err) {
        if (!err || (typeof err === 'string' && !err.length)) {
            return console.error('An undefined exception occurred.'); // eslint-disable-line
        }
        
        console.error(err); // eslint-disable-line
    }
    
    bot.login(bot.config.token);
});

function log(...args) {
    process.stdout.write(`${util.format.apply(null, args)}\n`);
}

async function init() {
    log(logo, '\n');
    log(`Starting [${env} ${require('../package.json').version}]`);
    
    if (env === 'production') {
        return Promise.resolve();
    };
    
    try {
        log(`Packages:`);
        await listPackages();
    } catch (err) {};
    
    try {
        log(`Repo:`);
        await gitInfo();
    } catch (err) {};
    
    return Promise.resolve();
};

function listPackages() {
    return new Promise((res, rej) =>
    childProcess.exec('npm list --depth=0', (err, stdout) => {
        if (err) {
            return rej(err);
        };
        let output = stdout.split('\n');
        log(`${output.slice(1, output.length - 1).join('\n')}\n`);
        res();
    }));
};

function gitInfo() {
    return new Promise((res, rej) =>
    childProcess.exec('git log -n 3 --no-color --pretty=format:[\\"%h\\",\\"%s\\",\\"%cr\\",\\"%an\\"],', (err, stdout) => {
        if (err) {
            return rej(err);
        };
        
        let str = stdout.split('\n').join('');
        str = str.substr(0, str.length - 1);
        
        let lines = JSON.parse(`[${str}]`);
        lines = lines.map(l => `[${l[0]}] ${l[1]} - ${l[2]}`);
        log(`${lines.join('\n')}\n`);
        return res();
    }));
};