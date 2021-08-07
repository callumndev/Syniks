const ban = module.exports;
const Sequelize = require('sequelize')

const sequelize = new Sequelize('syniks', 'syniks', '58jne4P@', {
    host: 'syniks.com',
    port: 3306,
    dialect: 'mariadb',
    logging: false,
    operatorsAliases: false,
    define: {
      freezeTableName: true
    }
});

ban.db = sequelize.define('bannedUsers', {
  id: {
    type: Sequelize.STRING,
    unique: true,
    primaryKey: true
  }
  })
ban.db.sync();

ban.check = async(id) => {
return new Promise(async(resolve,reject) => {
  let getban = await ban.db.findOne({where: {id:id}});
  resolve(getban || false);
})
}

ban.add = async(id) => {
  return new Promise(async (resolve,reject) => {
    let search = await ban.check(id)
    if(search) return reject(false)
    let add = await ban.db.create({id: id})
    resolve();
  })
}

ban.remove = async(id) => {
  return new Promise(async (resolve,reject) => {
    let search = await ban.check(id)
    if(!search) return reject(false)
    let add = await ban.db.destroy({where: {id: id}})
    resolve();
  })
}
