const banned = module.exports;
const Sequelize = require('sequelize')

banned.list = [];

const sequelize = require( './database.js' );

banned.db = sequelize.define('bannedStorage', {
    i: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    w: Sequelize.STRING,
    g: Sequelize.STRING
})
banned.db.sync();

banned.load = async(g) => {
    return new Promise(async(resolve,reject) => {
        let getConf = await banned.db.findAll({where: {g:g}});
        let word = [];
        getConf.forEach(w => {word.push(w.w)})
        resolve(word)
    })
}

banned.add = async(g,w) => {
    return new Promise(async(resolve,reject) => {
        let getW = await banned.db.findOne({where: {w:w.toLowerCase(), g:g}})
        if(getW) return resolve(false);
        let add = await banned.db.create({w:w.toLowerCase()})
        resolve();
    })
}

banned.remove = async (g,w) => {
    return new Promise(async(resolve,reject) => {
        await banned.db.destroy({where: {w:w.toLowerCase(), g:g}})
        resolve();
    })
}