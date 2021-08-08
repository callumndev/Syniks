const invite = module.exports;
const Sequelize = require('sequelize')

const sequelize = require( './database.js' );

invite.db = sequelize.define('inviteStorage', {
    id: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    invites: Sequelize.JSON
})
invite.db.sync();

invite.load = async(g) => {
    return new Promise(async(resolve,reject) => {
        let getConf = await invite.db.findOne({where: {id:g}});
        resolve(getConf)
    })
}

invite.update = async(g,l) => {
    return new Promise(async(resolve,reject) => {
        l = JSON.parse(JSON.stringify(l))
        let getW = await invite.db.findOne({where: {id:g}})
        if(getW) {await invite.db.update({invites:l}, {where: {id:g}})} else {invite.db.create({id:g,invites:l})}
        resolve();
    })
}