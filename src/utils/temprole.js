const tempr = module.exports;
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

tempr.db = sequelize.define('tempRole', {
  num: {
    type: Sequelize.INTEGER,
    unique: true,
    primaryKey: true,
    autoIncrement: true
  },
    guild: Sequelize.STRING,
    id: Sequelize.STRING,
		role: Sequelize.STRING,
    time: Sequelize.INTEGER
})
tempr.db.sync();

tempr.add = async (guild,id,role,time) => {
  let promise = new Promise(async function(resolve, reject) {
    if(!guild) resolve(false)
    if(!id) resolve(false)
    if(!role) resolve(false)
      let now = new Date().getTime();
      let future = time + now;
      let make = await tempr.db.create({id: id, guild: guild, role:role, time: future});
      resolve(true)

  });
  return promise;
}

tempr.remove = async (id,role) => {
  let promise = new Promise(async function(resolve, reject) {
    if(!id) resolve(false)
    if(!role) resolve(false)
    let findUser = await tempr.db.findOne({where: {id: id, role: role}});
    if(!findUser) {resolve(false)} else {
      let make = await tempr.db.destroy({where: {id: id, role: role}});
      resolve(true)
    }
  });
  return promise;
}
