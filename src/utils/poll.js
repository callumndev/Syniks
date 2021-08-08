const poll = module.exports;
const emoji = require("./emoji")
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

poll.db = sequelize.define('pollStorage', {
  num: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  guild: Sequelize.STRING,
  channel: Sequelize.STRING,
  reactions: Sequelize.JSON,
  options: Sequelize.JSON,
  end: Sequelize.INTEGER,
  msg: Sequelize.STRING
})

// Options: {
//   "emoji" {
//       name: "string"
//   }
// }
poll.db.sync();

poll.get = async(mID) => {
return new Promise(async(resolve,reject) => {
  let getF = await poll.db.findOne({where: {msg:mID}});
  resolve(getF)
})
}

poll.add = async(g,mID,op,ch,end) => {
return new Promise(async(resolve,reject) => {
  let getF = await poll.db.findOne({where: {msg:mID}})
  if(getF) return resolve(false);
  let add = await poll.db.create({msg:mID,guild:g, options:op, channel:ch, end:new Date().getTime() + end})
  resolve();
})
}

poll.sweep = async(mID, user) => {
  return new Promise(async (resolve,reject) => {
    let getP = await poll.db.findOne({where: {msg: mID}});
    let loadR = getP.reactions || {}
    let a = false;
    for(let key of Object.keys(loadR)) {
      let v = loadR[key]
      if(v.includes(user)) {a = true; break;}
    }
    resolve(a);
  })
}

poll.removeReact = async(mID, user, emoji) => {
  return new Promise(async (resolve,reject) => {
  let getP = await poll.db.findOne({where: {msg: mID}});
  let loadR = getP.reactions;
  let a;
  let v = loadR[emoji] || {}
  if(v.includes(user)) {a = {k:emoji,v:v}}
  if(!a) {return resolve()}
  let filt = a.v.filter(i => i !== user);
  if(a) {loadR[a.k] = filt}
  let p = await poll.db.update({reactions:loadR}, {where: {msg: mID}})
  resolve(loadR)
});
}

poll.procOp = async(op) => {
  return new Promise(async (resolve,reject) => {
    let list = {};
    for(let i = 0; i < op.length; i++) {list[emoji[i+1]] = op[i]}

    resolve(list);
  })
}

poll.addReact = async(mID, user, emoji) => {
return new Promise(async(resolve,reject) => {
let getP = await poll.db.findOne({where: {msg: mID}});
let loadR = getP.reactions;
if(!loadR) {loadR = {}};
if(!loadR[emoji]) {loadR[emoji] = []};
let ch = await poll.sweep(mID, user);
if(ch) {loadR = await poll.removeReact(mID, user)}
let arr = loadR[emoji];
arr.push(user);
loadR[emoji] = arr;
let upd = await poll.db.update({reactions: loadR}, {where: {msg: mID}})
resolve();
})
}

poll.check = async(bot) => {
  let getP = await poll.db.findAll({});
  let now = new Date().getTime();
  for(let p of getP) {
    if(now > p.end) {
      let react = p.reactions;
      let total = 0;
      let list = [];
      let win = {name: "", amt: 0}
      for(let key of Object.keys(react)) {
        let emoji = key;
        let ppl = react[key];
        let amt = ppl.length;
        let name = p.options[emoji];
        total = total + amt
        list.push({name: name, amt:amt})
        if(win.amt > amt) continue;
        win = {name: name, amt: amt}
      }

      let getCh = bot.channels.cache.get(p.channel) || await bot.channels.fetch(p.channel);
      if(!getCh) {return bot.utils.Poll.db.destroy({where: {msg: p.msg}})}
      let getMsg = await getCh.messages.fetch(p.msg).catch( e => { } );
      if(!getMsg)  {return bot.utils.Poll.db.destroy({where: {msg: p.msg}})};
      let emb = getMsg.embeds[0];
      emb['description'] = emb.description + '\n'
      for(let t of list) {
        emb['description'] = emb.description + `\n${t.name} | ${t.amt} reactions`
      }
      emb['description'] = emb.description + `\n\nWinning Entry: ${win.name} | ${win.amt} reactions`
      let rem = await bot.utils.Poll.db.destroy({where: {msg: p.msg}})
      return getMsg.edit(emb);
    }
  }
}


poll.questions = [`What is the title of this poll?`, 'What are the options for this poll? Please write them seperated by a `,`?', 'What channel do you want this poll sent in?', 'How long should this poll be open for?']
