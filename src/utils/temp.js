const temp = module.exports;
const Sequelize = require('sequelize')

const sequelize = require( './database.js' );

temp.db = sequelize.define('tempStorage', {
    guild: {
        type: Sequelize.STRING,
        unique: true,
        primaryKey: true
    },
    id: Sequelize.STRING,
    time: Sequelize.STRING,
    type: Sequelize.STRING,
})
temp.db.sync();

temp.load = async() => {
    return new Promise(async(resolve,reject) => {
        let getTemp = await temp.db.findAll({});
        resolve(getTemp);
    })
}

temp.add = async(g,id,type,time) => {
    return new Promise(async (resolve,reject) => {
        let search = await temp.db.findOne({where: {id: id, guild:g, type:type}});
        if(search) return resolve(false)
        let add = await temp.db.create({id:id,guild:g,type:type,time:new Date().getTime() + time})
        resolve();
    })
}


temp.remove = async(g,id,type) => {
    return new Promise(async (resolve,reject) => {
        let rem = await temp.db.destroy({where: {id: id, guild:g, type:type}});
        resolve();
    })
}

temp.get = async(g,id,type) => {
    return new Promise(async (resolve,reject) => {
        let search = await temp.db.findOne({where: {id: id, guild:g, type:type}});
        if(search) {resolve(search)} else {resolve(false)}
    })
}