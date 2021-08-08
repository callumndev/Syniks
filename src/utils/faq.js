const faq = module.exports;
const Sequelize = require('sequelize')
const sequelize = require( './database.js' );

faq.db = sequelize.define('faqStorage', {
    num: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    guild: Sequelize.STRING,
    faq: Sequelize.STRING
})
faq.db.sync();

faq.load = async(g) => {
    return new Promise(async(resolve,reject) => {
        let getF = await faq.db.findAll({where: {guild:g}});
        resolve(getF)
    })
}

faq.add = async(g,f) => {
    return new Promise(async(resolve,reject) => {
        let getF = await faq.db.findOne({where: {faq:f,guild:g}})
        if(getF) return resolve(false);
        let add = await faq.db.create({faq:f,guild:g})
        let getS = await faq.db.findAll({where: {guild:g}})
        let s = getS.length;
        resolve(s);
    })
}

faq.remove = async (g,n) => {
    return new Promise(async(resolve,reject) => {
        let load = await faq.db.findAll({where: {guild: g}});
        if(!load) return resolve(false);
        let getOne = load[n-1];
        if(!getOne) return resolve(false)
        let rem = await faq.db.destroy({where: {guild:g,num:getOne.num}})
        resolve();
    })
}