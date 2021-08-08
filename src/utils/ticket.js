const ticket = module.exports;
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

ticket.int = sequelize.define('ticketInt', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
    message: Sequelize.STRING,
    count: Sequelize.INTEGER
  })

ticket.conf = sequelize.define('ticketConfigs', {
    guild: {
      type: Sequelize.STRING,
      unique: true,
      primaryKey: true
    },
      log: Sequelize.STRING
    })

ticket.db = sequelize.define('ticketHold', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
    category: Sequelize.STRING,
    message: Sequelize.STRING,
    guild: Sequelize.STRING,
    emoji: Sequelize.STRING,
    role: Sequelize.STRING
  })

ticket.store = sequelize.define('ticketStore', {
    channel: {
      type: Sequelize.STRING,
      unique: true,
      primaryKey: true
    },
      user: Sequelize.STRING,
      guild: Sequelize.STRING
    })
ticket.db.sync();
ticket.store.sync();
ticket.int.sync();
ticket.conf.sync();

ticket.load = async(id) => {
return new Promise(async(resolve,reject) => {
  let getConf = await ticket.db.findOne({where: {id: id}});
  resolve(getConf)
})
}

ticket.checkMsg = async(msg) => {
return new Promise(async(resolve,reject) => {
  let getM = await ticket.db.findOne({where: {message: msg}});
  if(getM) {resolve(getM)} else {resolve(false)}
})
}

ticket.checkCh = async(ch) => {
return new Promise(async(resolve,reject) => {
  let getM = await ticket.store.findOne({where: {channel: ch}});
  if(getM) {resolve(getM)} else {resolve(false)}
})
}

ticket.checkOpen = async(id, g) => {
return new Promise(async(resolve,reject) => {
  let getM = await ticket.store.findOne({where: {user: id, guild: g}});
  if(getM) {resolve(getM)} else {resolve(false)}
})
}

ticket.checkConf = async(g) => {
return new Promise(async(resolve,reject) => {
  let getM = await ticket.conf.findOne({where: {guild: g}});
  if(getM) {resolve(getM)} else {resolve(false)}
})
}

ticket.setTr = async(g, id) => {
return new Promise(async(resolve,reject) => {
  let getM = await ticket.conf.findOne({where: {guild: g}});
  if(getM) {await ticket.conf.update({log: id}, {where: {guild: g}})} else {ticket.conf.create({guild: g, log: id})}
})
}

ticket.add = async(ob) => {
  return new Promise(async(resolve,reject) => {
    let getConf = await ticket.db.findOne({where: {message: ob.message}});
    if(!getConf) {getConf = await ticket.db.create({guild: ob.guild, message: ob.message, category: ob.category, role: ob.role, emoji: ob.emoji})}
    resolve()
  })
}

ticket.open = async(ch,u,g) => {
  return new Promise(async(resolve,reject) => {
    let getConf = await ticket.store.findOne({where: {channel: ch}});
    if(!getConf) {getConf = await ticket.store.create({guild: g, channel: ch, user: u})} else {return resolve(false)}
    resolve(true)
  })
}


ticket.getCount = async(message) => {
  return new Promise(async (resolve,reject) => {
    let getC = await ticket.int.findOne({where: {message: message}});
    if(!getC) {getC = await ticket.int.create({message: message, count: 0})}
    let count = getC.count+1;
    await ticket.int.update({count: count}, {where: {message:message}})
    resolve(count)

  })
}

ticket.set = async(id,key,val) => {
  return new Promise(async(resolve,reject) => {
    let load = await ticket.load(id);
    let newSet = {};
    newSet[key] = val;
    let updateDb = await ticket.db.update(newSet, {where: {guild: id}})
    resolve(true)
  })
}


ticket.delete = async (channel) => {
  return new Promise(async (resolve,reject) => {
    let dest = ticket.store.destroy({where: {channel: channel}})
    resolve();
  })
}

ticket.loadQuestions = () => {
  let questions = ['What channel is the ticket creation message in?', 'What is the message ID for the ticket creation message?', 'What category would you like to use for these tickets?', 'What role would you like to be pinged? (Type `none` if none)', 'What would you like the reaction to be to trigger a ticket opening?'];
  let qs = ['channel', 'message', 'category', 'role', 'emoji']
  let list = [];
  for(let i = 0; i < questions.length; i++) {
    list.push({key: qs[i], q: questions[i]})
  }
  return list;
}
