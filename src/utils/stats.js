const stats = module.exports;
const Sequelize = require('sequelize')

const sequelize = new Sequelize('syniks', 'syniks', '58jne4P@', {
    host: 'syniks.com',
    port: 3306,
    dialect: 'mariadb',
    logging: false,
    define: {
        freezeTableName: true
    }
});

stats.db = sequelize.define('statsStorage', {
    guild: {
        type: Sequelize.STRING,
        unique: true,
        primaryKey: true
    },
    members: Sequelize.STRING,
    online: Sequelize.STRING,
    bots: Sequelize.STRING
})
stats.db.sync();

stats.load = async(g) => {
    return new Promise(async(resolve,reject) => {
        let getConf = await stats.db.findOne({where: {guild:g}});
        if(!getConf) {return resolve(false)}
        resolve(getConf)
    })
}

stats.setup = async(guild) => {
    return new Promise(async (resolve,reject) => {
        let checkConf = await stats.load(guild.id);
        if(checkConf) {return resolve(false)}
        let makeVC = await guild.channels.create(`Member Count: ${guild.memberCount}`, {
            type: "voice",
            permissionOverwrites: [
                {id: guild.roles.everyone, deny: ['CONNECT']}
            ]
        })
        makeVC = makeVC.id
        
        let botVC = await guild.channels.create(`Bot Count: ${guild.members.cache.filter(mem => mem.user.bot == true).size}`, {
            type: "voice",
            permissionOverwrites: [
                {id: guild.roles.everyone, deny: ['CONNECT']}
            ]
        })
        botVC = botVC.id
        
        let onlineVC = await guild.channels.create(`Online Count: ${guild.members.cache.filter(mem => mem.user.presence.status !== 'offline').size}`, {
            type: "voice",
            permissionOverwrites: [
                {id: guild.roles.everyone, deny: ['CONNECT']}
            ]
        })
        onlineVC = onlineVC.id;
        stats.db.create({guild: guild.id, members: makeVC, bots: botVC, online: onlineVC})
        
        resolve(true);
    })
}

stats.update = async(guild) => {
    return new Promise(async (resolve,reject) => {
        let checkConf = await stats.load(guild.id);
        if(!checkConf) {return resolve(false)}
        let loop = [guild.channels.cache.get(checkConf.online), guild.channels.cache.get(checkConf.bots), guild.channels.cache.get(checkConf.members)]
        for(let i = 0; i < loop.length; i++) {
            let c = loop[i];
            if(!c) continue;
            switch(i) {
                case 0:
                c.setName(`Member Count: ${guild.memberCount}`)
                break;
                case 1:
                c.setName(`Bot Count: ${guild.members.cache.filter(mem => mem.user.bot == true).size}`)
                break;
                case 2:
                c.setName(`Online Count: ${guild.members.cache.filter(mem => mem.user.presence.status == 'online').size}`)
            }
            
        }
        resolve(true);
    })
}

stats.remove = async(guild) => {
    return new Promise(async (resolve,reject) => {
        let checkConf = await stats.load(guild.id);
        if(!checkConf) {return resolve(false)}
        let onlineVC = guild.channels.cache.get(checkConf.online)
        let botVC = guild.channels.cache.get(checkConf.bots)
        let memVC = guild.channels.cache.get(checkConf.members)
        let l = [guild.channels.cache.get(checkConf.bots), guild.channels.cache.get(checkConf.online), guild.channels.cache.get(checkConf.members)]
        
        for(let c of l) {if(!c) continue; c.delete();}
        stats.db.destroy({where: {guild: guild.id}})
        resolve(true);
    })
}