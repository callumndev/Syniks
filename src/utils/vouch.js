const vouch = module.exports;
const Sequelize = require('sequelize')

const sequelize = new Sequelize('syniks', 'syniks', '58jne4P@', {
    host: 'syniks.com',
    port: 3306,
    dialect: 'mariadb',
    logging: false,
    define: {
      freezeTableName: true
    }
});

vouch.db = sequelize.define('vouchStorage', {
  id: {
    type: Sequelize.STRING,
    unique: true,
    primaryKey: true
  },
    count: Sequelize.INTEGER
  })
vouch.db.sync();

vouch.load = async(id) => {
return new Promise(async(resolve,reject) => {
  let getvouch = await vouch.db.findOne({where: {id:id}});
  if(!getvouch) {getvouch = await vouch.db.create({id: id, count:0})}
  resolve(getvouch);
})
}

vouch.add = async(id) => {
  return new Promise(async (resolve,reject) => {
    let search = await vouch.load(id)
    let add = await vouch.db.update({count: search.count+1}, {where: {id:id}})
    resolve();
  })
}
