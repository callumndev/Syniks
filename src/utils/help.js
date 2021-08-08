const help = module.exports;
const Sequelize = require('sequelize')
let emoji = require("./emoji")
const sequelize = require( './database.js' );

help.db = sequelize.define('helpMenu', {
    command: {
        type: Sequelize.STRING,
        unique: true,
        primaryKey: true,
    },
    description: Sequelize.STRING,
    usage: Sequelize.STRING,
    aliases: Sequelize.STRING,
    cat: Sequelize.STRING,
})
help.db.sync();

help.loadCat = async(cat) => {
    return new Promise(async(resolve,reject) => {
        let getConf = await help.db.findAll({where: {cat: cat}});
        if(!getConf) return resolve(false)
        resolve(getConf)
    })
}

help.load = async (bot) => {
    return new Promise(async (resolve,reject) => {
        let list = new Map();
        let dir = bot.getDirectories("./commands")
        let q = [];
        dir.forEach(d => q.push(d))
        for(let i = 0; i < q.length; i++) {let w = q[i]; list.set(emoji[i+1], {key: w, q: `${emoji[i+1]} ${q[i]}`});};
        resolve(list);
    })
}