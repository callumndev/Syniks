const vc = module.exports;
const Sequelize = require('sequelize')
let config = require("./config")
const sequelize = new Sequelize('syniks', 'syniks', '58jne4P@', {
    host: 'syniks.com',
    port: 3306,
    dialect: 'mariadb',
    logging: false,
    define: {
      freezeTableName: true
    }
});

vc.db = sequelize.define('vcStorage', {
  num: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user: Sequelize.STRING,
  guild: Sequelize.STRING,
  channel: Sequelize.STRING
})
vc.db.sync();

vc.get = async(g,c) => {
return new Promise(async(resolve,reject) => {
  let getConf = await config.checkVC(g,c)
  console.log(getConf)
  if(getConf) {resolve(getConf)} else {resolve(false)}
})
}

vc.getUser = async(u, guild) => {
return new Promise(async(resolve,reject) => {
  let getConf = await vc.db.findOne({where: {guild: guild, user: u}})
  if(getConf) {resolve(getConf)} else {resolve(false)}
})
}

vc.checkCh = async(c) => {
return new Promise(async(resolve,reject) => {
  let getConf = await vc.db.findOne({where: {channel: c}})
  if(getConf) {resolve(getConf)} else {resolve(false)}
})
}

vc.add = async(c,u,g) => {
return new Promise(async(resolve,reject) => {
  let getR = await vc.db.findOne({where:{channel: c}})
  if(getR) return resolve(false);
  let add = await vc.db.create({guild: g, user: u, channel: c})
  resolve();
})
}

vc.remove = async (c,u) => {
  return new Promise(async(resolve,reject) => {
    await vc.db.destroy({where: {channel: c}})
    resolve();
  })
}
