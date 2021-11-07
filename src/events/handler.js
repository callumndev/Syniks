const handle = module.exports;
const log = require("../utils/log.js")
const react = require("../utils/react.js")
const Discord = require("discord.js")
const banned = require("../utils/banned.js")
const fs = require("fs")
const tickets = require("../utils/ticket")
const vc = require("../utils/vc")
const automod = require("../utils/automod")
handle.list = ['message', 'messageDelete', 'messageUpdate', 'userUpdate', 'guildMemberAdd', 'guildMemberRemove', 'guildMemberUpdate', 'roleCreate', 'roleDelete', 'roleUpdate', 'guildUpdate', 'emojiUpdate', 'channelCreate', 'channelUpdate', 'channelDelete', 'messageReactionAdd', 'messageReactionRemove', 'voiceStateUpdate', 'inviteCreate']
handle.ignore = ['embedEnabled', 'systemChannelFlags', 'permissions', 'permissionOverwrites']
let ban = ["https://" , "www." , ".gg" , ".com"]

handle.emojiFilter = (text) => {
    const onlyEmojis = text.replace(new RegExp('[\u0000-\u1eeff]', 'g'), '')
    const visibleChars = text.replace(new RegExp('[\n\r\s]+|( )+', 'g'), '')
    return onlyEmojis.length === visibleChars.length
}

handle.messageDelete = async (bot,message) => {
    if(!message.content) return;
    let logL = await log.send(bot,message,message.guild.id, `Message Deletion: Message sent by ${message.author.tag} with content **\`${message.content}\`** has been deleted`,message.author.avatarURL(), 0, 'messageDelete')
}

handle.filter = async (m, bot) => {
    return new Promise(async(resolve,reject) => {
        let checkBlock = await bot.utils.Auto.checkBy(m.member)
        if(checkBlock) return resolve(false)
        let load = await banned.load(m.guild.id);
        let check = await bot.utils.Auto.check(m.guild.id, 'mentions')
        let count = await bot.utils.Auto.check(m.guild.id, 'mentionCount')
        let link = await bot.utils.Auto.check(m.guild.id, 'linkProt')
        if(ban.indexOf(m.content) !== -1) return resolve("Illegal Wording used");
        if(load.indexOf(m.content) !== -1) return resolve("Illegal Wording used");
        if(check) {
            let split = m.content.split("<@");
            if(m.mentions.members.first() && split.length > count) return resolve("Mass Mention");
        }
        if(link) {
            if(m.content.includes("discord.gg")) {return resolve('Using links')}
        }
        resolve(false)
    })
}

handle.messageUpdate = async (bot,oldM,newM) => {
    if(!oldM.content) return;
    if(newM.patrial) {newM = await newM.fetch()}
    if (oldM.content == newM.content) return;
    let logL = await log.send(bot,false,newM.guild.id, `Message Edit: Message sent by ${newM.member.user.tag} has been edited from **\`${oldM.content}\`** to **\`${newM.content}\`**`,newM.author.avatarURL(), 0, 'messageUpdate')
    return;
}

handle.guildMemberUpdate = async (bot,oldM,newM) => {
    if(oldM.displayName !== newM.displayName) {
        let logL = await log.send(bot,false,newM.guild.id, `Nickname Update: Nickname for **\`${oldM.user.tag}\`** changed from **\`${oldM.displayName}\`** to **\`${newM.displayName}\`**`,newM.user.avatarURL(), 0, 'guildMemberUpdate');
    }
    if(oldM.roles.cache !== newM.roles.cache) {
        let add = [];
        let rem = [];
        for(let role of oldM.roles.cache.values()) {
            if(role.name.startsWith("@")) continue;
            if(!newM.roles.cache.get(role.id)) {rem.push(role.name)}
        }
        for(let role of newM.roles.cache.values()) {
            if(role.name.startsWith("@")) continue;
            if(!oldM.roles.cache.get(role.id)) {add.push(role.name)}
        }
        let logL = await log.send(bot,false,newM.guild.id, `Member Role Update: Roles updated for **\`${newM.user.tag}\`** \n\n${add.length > 0 ? `**[+]** ${add.join(" , ")}` : ''}\n${rem.length > 0 ? `**[-]** ${rem.join(" , ")}` : ''}`,newM.user.avatarURL(), 0, 'guildMemberUpdate');
    }
}

handle.roleCreate = async (bot,role) => {let logL = await log.send(bot,false,role.guild.id, `Role Creation: **\`${role.name}\`** has been created`, 0, 0, 'roleCreate')}
handle.roleDelete = async (bot,role) => {let logL = await log.send(bot,false,role.guild.id, `Role Deletion: **\`${role.name}\`** has been deleted`, 0, 0, 'roleDelete')}
handle.roleUpdate = async (bot,oldR,newR) => {
    let list = [];
    for(let key of Object.keys(oldR)) {
        if(oldR[key] !== newR[key]) {
            if(oldR[key] && oldR[key].length == 0) continue;
            if(handle.ignore.indexOf(key) !== -1) continue;
            list.push(`\`${key}\` | \`${oldR[key]}\` => **${newR[key]}**`)
        }
    }
    let logL = await log.send(bot,false,newR.guild.id, `Role Update: **\`${newR.name}\`** has been edited\n\n${list.join("\n")}`, 0, 0, 'roleUpdate')
    
}
handle.guildUpdate = async (bot,oldG,newG) => {
    let list = [];
    for(let key of Object.keys(oldG)) {
        if(oldG[key] !== newG[key]) {
            if(oldG[key] && oldG[key].length == 0) continue;
            if(handle.ignore.indexOf(key) !== -1) continue;
            list.push(`\`${key}\` | \`${oldG[key]}\` => **${newG[key]}**`)
        }
    }
    console.info(`Server Settings Update: Settings updated for  **\`${newG.name}\`**\n${list.join("\n")}`)
    let logL = await log.send(bot,false,newG.id, `Server Settings Update: Settings updated for  **\`${newG.name}\`**\n\n${list.join("\n")}`, 0, 0, 'guildUpdate');
}

handle.emojiUpdate = async (bot,oldE,newE) => {
    let list = [];
    for(let key of Object.keys(oldE)) {
        if(oldE[key] !== newE[key]) {
            if(oldE[key] && oldE[key].length == 0) continue;
            if(handle.ignore.indexOf(key) !== -1) continue;
            list.push(`\`${key}\` | \`${oldE[key]}\` => **${newE[key]}**`)
        }
    }
    let logL = await log.send(bot,false,newE.guild.id, `Emoji Update: Settings updated for  **\`${newE.name}\`**\n\n${list.join("\n")}`, 0, 0, 'emojiUpdate');
    
}

handle.guildMemberAdd = async (bot,mem) => {
    let getR = await bot.utils.Config.load(mem.guild.id);
    let load = await bot.utils.Invite.load(mem.guild.id)
    if(getR.inviteChannel) {
        if(!load) {
            let getAll = await mem.guild.fetchInvites();
            let arr = JSON.parse(JSON.stringify(getAll.array()));
            for(let i = 0; i < arr.length; i++) {let e = arr[i]; let f = getAll.find(a => a.code == e.code); arr[i]['uses'] = f.uses}
            let upd = await bot.utils.Invite.update(mem.guild.id, arr);
            let channel = mem.guild.channels.cache.get(getR.inviteChannel);
            if(!channel) return;
            let form = await log.format(`Member Joined: <@${mem.user.id}> has joined. Inviter could not be detected.`, mem.guild)
            if(getR.inviteImage) {form.setImage(getR.inviteImage)}
            let logL = await channel.send(form)
        } else {
            load = load.dataValues.invites;
            let getAll = await mem.guild.fetchInvites();
            let arr = JSON.parse(JSON.stringify(getAll.array()));
            for(let i = 0; i < arr.length; i++) {let e = arr[i]; let f = getAll.find(a => a.code == e.code); arr[i]['uses'] = f.uses}
            let upd = await bot.utils.Invite.update(mem.guild.id, arr);
            
            for(let invite of getAll.values()) {
                let uses = invite.uses;
                for(let l of load) {
                    if((l.code == invite.code) && (l.uses !== invite.uses)) {
                        
                        
                        
                        let channel = mem.guild.channels.cache.get(getR.inviteChannel);
                        if(!channel) return;
                        
                        let form = await log.format(`Member Joined: <@${mem.user.id}> has joined. Invited by ${mem.guild.members.cache.get(invite.inviterID) ? mem.guild.members.cache.get(invite.inviterID).user.tag : `(${invite.inviter})`}`, mem.guild)
                        if(getR.inviteImage) {form.setImage(getR.inviteImage)}
                        let logL = await channel.send(form)
                        break;
                    }
                }
            }
        }
    }
    if(!getR || !getR.autoRoles.length) return;
    getR.autoRoles.forEach(r => {
        if(!r || !mem.guild.roles.cache.get(r)) return;
        mem.roles.add(r)
    })
}

handle.guildMemberRemove = async (bot,mem) => {
    let getR = await bot.utils.Config.load(mem.guild.id);
    if(getR.leaveChannel) {
        let channel = mem.guild.channels.cache.get(getR.leaveChannel);
        if(!channel) return;
        let form = await log.format(`Member Left: ${mem.user.tag} has left.`, mem.guild)
        if(getR.leaveImage) {form.setImage(getR.leaveImage)}
        let logL = await channel.send(form)
    }
}

handle.inviteCreate = async (bot,inv) => {
    let getAll = await inv.guild.fetchInvites();
    let arr = JSON.parse(JSON.stringify(getAll.array()));
    for(let i = 0; i < arr.length; i++) {let e = arr[i]; let f = getAll.find(a => a.code == e.code); arr[i]['uses'] = f.uses}
    let upd = await bot.utils.Invite.update(inv.guild.id, arr);
}

handle.message = async (bot,message) => {
    if (message.author.bot) return;
    if(message.channel.type !== "text") return;
    let messageArray = message.content.split(" ");
    message.guild['config'] = await bot.utils.Config.load(message.guild.id)
    let prefix = message.guild.config.prefix;
    let cmd = messageArray[0];
    let args = messageArray.slice(1);
    let sender = message.author;
    if(message.mentions.members.first() && message.mentions.members.first().id == bot.user.id) {return message.channel.send(`My prefix is \`${prefix}\``)}
    let filter = await handle.filter(message, bot);
    if(filter) {
        let id = await bot.utils.Infract.add(message,message.author.id,filter,'warn',true)
        return message.delete();
    }
    
    let checkCh = await bot.utils.Ticket.checkCh(message.channel.id);
    if(checkCh && message.content !== `${prefix}close`) {
        let data = `\n${new Date()} | ${message.author.tag} : ${message.content}`
        fs.appendFile(`./transcripts/${message.channel.id}.txt`, data, (err) => {
            if(err) throw err;
        })
    }
    
    let checkCool = await bot.utils.Cool.getUser(message.member, "message");
    if(checkCool) {
        let now = new Date().getTime();
        let dist = checkCool - now;
        if(dist < 0) {
            await bot.utils.Cool.remove(message.member, "message");
        }
    }
    if(!checkCool) {
        let find = await bot.utils.Level.addXP(message.member,  Math.floor(Math.random() * (bot.config.msg_xp[1] - bot.config.msg_xp[0] + 1) + bot.config.msg_xp[0]))
        if(find) {
            let c = bot.commands.get(`level`);
            message['args'] = args;
            let m = message;
            m.channel = message.guild.config.levelMessageChannel && bot.channels.cache.has( message.guild.config.levelMessageChannel ) ? bot.channels.cache.get( message.guild.config.levelMessageChannel ) : message.channel;
            c.run(bot,m,args, true)
            if(find.textUp) {
                find.textUp.forEach(ent => {
                    let role = ent.id;
                    let getR = message.guild.roles.cache.get(role);
                    if(!getR) return;
                    if(!message.member.roles.cache.get(getR.id)) {message.member.roles.add(getR)}
                })
            }
            if(find.oldR) {
                find.oldR.forEach(ent => {
                    let role = ent.id;
                    let getR = message.guild.roles.cache.get(role);
                    if(!getR) return;
                    if(message.member.roles.cache.get(getR.id)) {message.member.roles.remove(getR)}
                })
            }
        }
        
        let add = await bot.utils.Cool.add(message.member, "message", 60000)
    }
    
    messageArray = messageArray.filter(arg => !arg == "");
    if (!message.content.startsWith(prefix)) return;
    message['args'] = args;
    let commandfile = bot.commands.get(cmd.toLowerCase().slice(prefix.length)) || bot.commands.get(bot.aliases.get(cmd.toLowerCase().slice(prefix.length)))
    if (commandfile) {commandfile.run(bot, message, args)}
}

handle.channelCreate = async (bot,role) => {let logL = await log.send(bot,false,role.guild.id, `Channel Creation: **\`${role.name}\`** has been created`, 0, 0, 'channelCreate')}
handle.channelDelete = async (bot,role) => {let logL = await log.send(bot,false,role.guild.id, `Channel Deletion: **\`${role.name}\`** has been deleted`, 0, 0, 'channelDelete')}
handle.channelUpdate = async (bot,oldR,newR) => {
    let list = [];
    for(let key of Object.keys(oldR)) {
        if(oldR[key] !== newR[key]) {
            if(oldR[key] && oldR[key].length == 0) continue;
            if(handle.ignore.indexOf(key) !== -1) continue;
            list.push(`\`${key}\` | \`${oldR[key]}\` => **${newR[key]}**`)
        }
    }
    let logL = await log.send(bot,false,newR.guild.id, `Channel Update: **\`${newR.name}\`** has been edited\n\n${list.join("\n")}`, 0, 0, 'channelUpdate')
    
}

handle.messageReactionAdd = async (bot,r,u) => {
    if(u.bot) return;
    if (r.message.partial) await r.message.fetch();
    if (r.partial) await r.fetch();
    let get = await bot.utils.Poll.get(r.message.id);
    if(get) {
        let sweep = await bot.utils.Poll.sweep(r.message.id, u.id);
        if(sweep) {return r.users.remove(u.id)}
        let em = r.emoji.name;
        let add = await bot.utils.Poll.addReact(r.message.id, u.id, em)
    }
    let emoji;
    let filter = handle.emojiFilter(r.emoji.name);
    if(!filter) {
        emoji = r.message.guild.emojis.cache.find(emoji => emoji.name == r.emoji.name);
        if(emoji) {
            emoji = emoji.id || null
        }
    } else {
        emoji = r.emoji.name
    };
    if(!emoji) return;
    let checkM = await react.get(r.message.guild.id, r.message.id, emoji);
    let checkT = await tickets.checkMsg(r.message.id)
    if(checkM) {
        let role = checkM.rID;
        let g = bot.guilds.cache.get(checkM.gID);
        if(!g) return;
        let getRole = g.roles.cache.get(role);
        if(!getRole) return;
        let mem = g.members.cache.get(u.id);
        if(!mem) return;
        return mem.roles.add(getRole).catch(() => {})
    }
    if(checkT) {
        let checkO = await tickets.checkOpen(u.id, r.message.guild.id);
        r.users.remove(u)
        if(checkO) return u.send(`**You already have an active ticket open!**`)
        let getC = await tickets.getCount(r.message.id);
        r.message.guild.channels.create(`ticket-${getC}`, {
            type: 'text',
            parent: checkT.category,
            permissionOverwrites: [
                {
                    id: u.id,
                    allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                },
                {
                    id: checkT.role,
                    allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                },
                {
                    id: r.message.guild.roles.everyone,
                    deny: ['VIEW_CHANNEL']
                }
            ]
        }).then(ch => {
            let sysAdd = tickets.open(ch.id, u.id, r.message.guild.id);
            let open = new Discord.MessageEmbed()
            .setTitle(`${r.message.guild.name}`)
            .setDescription(`Thank you **${u.tag}** for opening a ticket. A staff member will be with you shortly!`)
            .setThumbnail(r.message.guild.iconURL())
            .setColor(bot.color);
            ch.send(`${r.message.guild.roles.cache.get(checkT.role)} ${u}`)
            let data = `\n${new Date()} | Ticket Opened`
            fs.appendFile(`./transcripts/${ch.id}.txt`, data, (err) => {
                if(err) throw err;
            })
            return ch.send(open)
        })
    }
}

handle.messageReactionRemove = async (bot,r,u) => {
    if(u.bot) return;
    
    if (r.message.partial) await r.message.fetch();
    if (r.partial) await r.fetch();
    let get = await bot.utils.Poll.get(r.message.id);
    if(get) {
        let add = await bot.utils.Poll.removeReact(r.message.id, u.id, r.emoji.name)
        return;
    }
    let emoji;
    let filter = handle.emojiFilter(r.emoji.name);
    if(!filter) {emoji = r.message.guild.emojis.cache.find(emoji => emoji.name == r.emoji.name); emoji = emoji ? emoji.id : ""} else {emoji = r.emoji.name};
    if(!emoji) return;
    let checkM = await react.get(r.message.guild.id, r.message.id, emoji);
    if(checkM) {
        let role = checkM.rID;
        let g = bot.guilds.cache.get(checkM.gID);
        if(!g) return;
        let getRole = g.roles.cache.get(role);
        if(!getRole) return;
        let mem = g.members.cache.get(u.id);
        if(!mem) return;
        return mem.roles.remove(getRole).catch(() => {})
    }
}

handle.voiceStateUpdate = async (bot,oldU,newU) => {
    let chc = newU.channel ? newU : null
    let checkID;
    if(chc) {checkID = await vc.get(chc.guild.id, chc.channel.id)}
    let checkC;
    if(oldU.channel) { checkC = await vc.checkCh(oldU.channel.id)}
    if(checkID && newU.channel) {
        let getU = await vc.getUser(newU.id, newU.guild.id)
        if(checkID && !getU) {
            let guild = newU.guild;
            guild.channels.create(`${newU.member.user.username} VC`, {
                type: 'voice',
                parent: checkID.autoVC_Category,
                permissionOverwrites: [
                    {
                        id: oldU.id,
                        allow: ['VIEW_CHANNEL', 'CONNECT', 'SPEAK', "MANAGE_CHANNELS"]
                    },
                    {
                        id: guild.roles.everyone,
                        deny: ['CONNECT', 'SPEAK']
                    }
                ]
            }).then(ch => {
                let set = vc.add(ch.id, newU.id, guild.id)
                newU.setChannel(ch)
            })
        }
    } else if(checkC && oldU.channel.members.size == 0) {
        vc.remove(oldU.channel.id);
        oldU.channel.delete();
    }
}