const infract = module.exports;
const Sequelize = require('sequelize')
const Discord = require("discord.js")
const sequelize = require( './database.js' );

infract.db = sequelize.define('infractions', {
    wid: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    guild: Sequelize.STRING,
    id: Sequelize.STRING,
    time: Sequelize.BIGINT,
    reason: Sequelize.STRING,
    staff: Sequelize.STRING,
    type: Sequelize.STRING
})

infract.db.sync();



infract.add = async (message,id,reason,t,b) => {
    let promise = new Promise(async function(resolve, reject) {
        let time = new Date().getTime();
        let staff = message.author.id;
        if(b) {staff = message.guild.me.user.id}
        t = t.charAt(0).toUpperCase() + t.substring(1)
        let insert = await infract.db.create({guild: message.guild.id, id: id, reason:reason, staff:staff, time:time, type: t})
        resolve(insert.wid);
    });
    return promise;
}

infract.loadAll = async (id,mem) => {
    let promise = new Promise(async function(resolve, reject) {
        let find = await infract.db.findAll({where: {guild:id, id: mem}});
        if(find) {resolve(find)} else {resolve(false)}
    });
    return promise;
}

infract.clear = async (mem) => {
    let promise = new Promise(async function(resolve, reject) {
        let find = await infract.db.destroy({where: {guild:mem.guild.id, id: mem.user.id}});
        resolve(true)
    });
    return promise;
}