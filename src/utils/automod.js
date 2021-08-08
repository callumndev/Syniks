const automod = module.exports;
const Sequelize = require('sequelize')
let emoji = require("./emoji")
const sequelize = new Sequelize('syniks', 'syniks', '58jne4P@', {
    host: 'syniks.com',
    port: 3306,
    dialect: 'mariadb',
    logging: false,
    define: {
      freezeTableName: true
    }
});

automod.db = sequelize.define('autoSA', {
    guild: {
        type: Sequelize.STRING,
        unique: true,
        primaryKey: true
    },
    mentions: Sequelize.BOOLEAN,
    bypass: Sequelize.STRING,
    mentionCount: Sequelize.INTEGER,
    linkProt: Sequelize.BOOLEAN,
  })
automod.db.sync();

automod.loadConf = async(guild) => {
return new Promise(async(resolve,reject) => {
  let getConf = await automod.db.findOne({where: {guild: guild}});
  if(!getConf) {getConf = await automod.db.create({guild: guild, mentions: false, bypass: "", mentionCount: 4, linkProt: false})};
  resolve(getConf)
})
}


automod.checkBy = async(mem) => {
return new Promise(async(resolve,reject) => {
  let getConf = await automod.db.findOne({where: {guild: mem.guild.id}});
  if(!getConf) {getConf = await automod.db.create({guild: mem.guild.id, mentions: false, bypass: "", mentionCount: 4, linkProt: false})};
  let list = getConf.bypass.length > 1 ? getConf.bypass.split(" ") : [];
  let proc = false;
  list.forEach(l => {if(mem.roles.cache.get(l)) {proc = true}})
  resolve(proc)
})
}

automod.set = async(guild,key,val) => {
  return new Promise(async(resolve,reject) => {
    if(key.endsWith('+') || key.endsWith('-')) {
      let get = await automod.loadConf(guild);
      let text = get.bypass;
      let t;
      if(text.length > 1) {t = text.split(" ")} else {t = []}
      let list = []
      if(text.length > 1) {list = text.split(" ")} else {list = []}
        if(key.endsWith('+')) {
          val.forEach(r => {if(list.indexOf(r) == -1 && t.indexOf(r) == -1) {list.push(r)};})
        } else {
        val.forEach(r => {list = list.filter(w => w !== r)})
        }
        val = list.join(" ");
        val = val.trim();
            key = key.replace(/[+-]/g, "")
    }
    let newSet = {};
    newSet[key] = val;
    let updateDb = await automod.db.update(newSet, {where: {guild: guild}})
    resolve(true)
  })
}

automod.check = async(guild,key) => {
  return new Promise(async(resolve,reject) => {
    let getConf = await automod.db.findOne({where: {guild: guild}});
    if(!getConf) {getConf = await automod.db.create({guild: guild, mentions: false, bypass: "", mentionCount: 4, linkProt: false})}
    resolve(getConf[key])
  })
}
//
automod.load = async (guild) => {
  return new Promise(async (resolve,reject) => {
    let loadConf = await automod.loadConf(guild);
    let list = new Map();
    let arr = ['mentions', 'bypass+', 'bypass-', 'mentionCount', 'linkProt']
    let q = ['Mass Mention Warnings', 'Bypass Add', 'Bypass Remove', 'Mass Mention Threshold', 'Discord Link Protection']
    let listBy = loadConf.bypass;
    if(listBy.length > 1) {listBy = listBy.split(" ")} else {listBy = []}
    let s = ''
    listBy.forEach(lis => {s += `<@&` + lis + `>`})
    list.set('bypass list', s)
    for(let i = 0; i < arr.length; i++) {let w = arr[i]; list.set(emoji[i+1], {key: w, q: `${emoji[i+1]} ${q[i]}`, enabled: loadConf.dataValues[w] == true ? true : loadConf.dataValues[w] == false ? false : loadConf.dataValues[w] ? loadConf.dataValues[w] : '__'});};
    resolve(list);
  })
}
