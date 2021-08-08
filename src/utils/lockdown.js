const lock = module.exports;
const Sequelize = require('sequelize')
const Discord = require("discord.js")
const sequelize = require( './database.js' );

lock.db = sequelize.define('lockdownInert', {
    channel: {
        type: Sequelize.STRING,
        primaryKey: true,
        unique: true
    }
})

lock.config = sequelize.define('lockdownConfigs', {
    guild: {
        type: Sequelize.STRING,
        primaryKey: true,
        unique: true
    },
    roles: Sequelize.STRING
})
lock.db.sync()
lock.config.sync();

lock.load = async (g) => {
    let promise = new Promise(async function(resolve, reject) {
        let find = await lock.config.findOne({where: {guild:g}});
        if(find) {resolve(find)} else {resolve(false)}
    });
    return promise;
}

lock.check = async (c) => {
    let promise = new Promise(async function(resolve, reject) {
        let find = await lock.db.findOne({where: {channel:c}});
        if(find) {resolve(find)} else {resolve(false)}
    });
    return promise;
}

lock.end = async (c) => {
    let promise = new Promise(async function(resolve, reject) {
        let rem = await lock.db.destroy({where:{channel:c}})
        resolve(insert.wid);
    });
    return promise;
}

lock.process = async(channel,roles, val) => {
    return new Promise(async (resolve,reject) => {
        roles = roles.split(",");
        if(val == false) {await lock.db.create({channel:channel.id})} else {await lock.db.destroy({where:{channel:channel.id}})}
        for(let role of roles) {
            let roleObj = channel.guild.roles.cache.get(role);
            if(!roleObj) continue;
            await channel.updateOverwrite(roleObj, {
                SEND_MESSAGES: val
            })
        }
        resolve();
    })
}

lock.setup = () => {
    let q = ['Please mention all the roles you would like to be impacted by lockdown']
    return q;
}

lock.set = async(g,r) => {
    return new Promise(async(resolve,reject) => {
        let list = []
        for(let role of r) {
            list.push(role[0])
        }
        let getC = await lock.load(g);
        if(getC) {await lock.config.update({roles: list.join(",")}, {where: {guild:g}})} else {
            let add = await lock.config.create({guild: g, roles: list.join(',')})
        }
        resolve();
    })
}