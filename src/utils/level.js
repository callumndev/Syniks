const level = module.exports;
const Sequelize = require('sequelize')
const config = require("../config/config.json")
const sequelize = require( './database.js' );

level.db = sequelize.define('levelStorage', {
    num: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id: Sequelize.STRING,
    guild: Sequelize.STRING,
    xp: Sequelize.INTEGER,
    messages: Sequelize.INTEGER,
    points: Sequelize.INTEGER
})

level.ranks = sequelize.define('rankStorage', {
    num: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id: Sequelize.STRING,
    guild: Sequelize.STRING,
    level: Sequelize.INTEGER,
})

level.db.sync()
level.ranks.sync();

level.getUser = async (mem) => {
    let promise = new Promise(async function(resolve, reject) {
        if(!mem) resolve(false)
        let findUser = await level.db.findOne({where: {id: mem.user.id, guild: mem.guild.id}})
        if(!findUser) {findUser = await level.db.create({id: mem.user.id, xp: 0, messages: 0, points: 0, guild: mem.guild.id})}
        let currentLvl = Math.floor(findUser.xp / config.level_up);
        let nextXP = (currentLvl + 1)*config.level_up
        let neededXP = nextXP - findUser.xp;
        let user = {
            id: mem.user.id,
            level: currentLvl,
            next: nextXP,
            xp: findUser.xp,
            needed: neededXP,
            points: findUser.points,
            messages: findUser.messages
        }
        resolve(user)
    });
    return promise;
}

level.getLvl = async (mem) => {
    let promise = new Promise(async function(resolve, reject) {
        if(!mem) resolve(false)
        let tot;
        let findUser = await level.db.findAll({where: {guild: mem.guild.id}, order: [['xp', 'desc']]});
        for(let i = 0; i < findUser.length; i++) {
            let u = findUser[i];
            if(u.id !== mem.user.id) continue;
            tot = i+1;
            break;
        }
        resolve(tot)
    });
    return promise;
}


level.addXP = async (mem, amt) => {
    let promise = new Promise(async function(resolve, reject) {
        let t = new Date().getTime();
        if(!mem) resolve(false)
        let current = await level.getUser(mem);
        let lvl = current.level;
        let findUser = await level.db.findOne({where: {id: mem.user.id, guild: mem.guild.id}})
        let update = await level.db.update({xp: current.xp + amt}, {where: {id: mem.user.id, guild: mem.guild.id}})
        let newU = await level.getUser(mem);
        let newlvl = newU.level;
        let obj = {};
        await level.db.update({messages: parseFloat(current.messages) + 1}, {where: {id: mem.user.id, guild: mem.guild.id}})
        if(newlvl > lvl) {
            obj.newLvl = true;
            let getRank = await level.getRank(mem.guild.id, newlvl);
            obj.newRole = getRank;
        }
        resolve(obj.newLvl ? obj : false)
    });
    return promise;
}

level.set = async (mem,lvl) => {
    let promise = new Promise(async function(resolve, reject) {
        let current = await level.getUser(mem);
        let update = await level.db.update({xp: lvl}, {where: {id: mem.user.id, guild: mem.guild.id}})
        resolve(false)
    });
    return promise;
}

level.removeXP = async (member,amount) => {
    let promise = new Promise(async function(resolve, reject) {
        if(!amount || isNaN(amount)) return resolve(false)
        if(!member) return resolve(false);
        let getUser = await level.getUser(member);
        let newBal = getUser.xp - amount;
        if(newBal < 0) return false;
        let update = await level.db.update({xp: newBal}, {where: {id: member.user.id, guild: mem.guild.id}})
        resolve(true)
    });
    return promise;
    
}

level.getRank = async (guild, lvl) => {
    let promise = new Promise(async function(resolve, reject) {
        let findR;
        findR = await level.ranks.findOne({where: {level: lvl, guild: guild}})
        if(!findR) {resolve(false)} else {resolve(findR)};
    });
    return promise;
}

level.getOldRanks = async (guild, lvl) => {
    let promise = new Promise(async function(resolve, reject) {
        let findR = await level.ranks.findAll({where: {level: {[Sequelize.Op.lte]: lvl, guild: guild}}})
        if(!findR) {resolve(false)} else {resolve(findR)};
    });
    return promise;
}

level.addRank = async (guild, lvl, id) => {
    let promise = new Promise(async function(resolve, reject) {
        if(!level) return resolve(false)
        if(!id) return resolve(false);
        let findR = await level.ranks.findOne({where: {level: lvl, guild: guild}})
        if(!findR) {findR = await level.ranks.create({level: lvl, id: id, guild:guild})} else {await level.ranks.update({id: id}, {where: {level: lvl ,guild: guild}})}
        resolve(true)
    });
    return promise;
    
}

level.removeRank = async (guild, lvl) => {
    let promise = new Promise(async function(resolve, reject) {
        if(!level) return resolve(false)
        let findR = await level.ranks.findOne({where: {level: lvl, guild: guild}})
        if(findR) {await level.ranks.destroy({where: {level: lvl, guild: guild}})}
        resolve(true)
    });
    return promise;
    
}