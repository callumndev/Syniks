const cool = module.exports;
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

cool.db = sequelize.define('cooldowns', {
  num: {
    type: Sequelize.INTEGER,
    unique: true,
    primaryKey: true,
    autoIncrement: true
  },
    id: Sequelize.STRING,
    time: Sequelize.INTEGER,
		type: Sequelize.STRING
})
cool.db.sync();

cool.getUser = async (mem,type) => {
  let promise = new Promise(async function(resolve, reject) {
    if(!mem) resolve(false)
    if(!type) resolve(false)
    let findUser = await cool.db.findOne({where: {id: mem.user.id, type: type}});
    if(!findUser) {resolve(false)} else {resolve(findUser.time)};
  });
  return promise;
}

cool.add = async (mem,type,time) => {
  let promise = new Promise(async function(resolve, reject) {
    if(!mem) resolve(false)
    if(!type) resolve(false)
    if(!time) resolve(false)
    let findUser = await cool.db.findOne({where: {id: mem.user.id, type: type}});
    if(findUser) {resolve(false)} else {
      let now = new Date().getTime();
      let future = time + now;
      let make = await cool.db.create({id: mem.user.id, type: type, time: future});
      resolve(true)
    }
  });
  return promise;
}

cool.remove = async (mem,type) => {
  let promise = new Promise(async function(resolve, reject) {
    if(!mem) resolve(false)
    if(!type) resolve(false)
    let findUser = await cool.db.findOne({where: {id: mem.user.id, type: type}});
    if(!findUser) {resolve(false)} else {
      let make = await cool.db.destroy({where: {id: mem.user.id, type: type}});
      resolve(true)
    }
  });
  return promise;
}
