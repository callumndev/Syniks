const config = module.exports;
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

let defaults = {        
    "prefix": "+",
    "autoRoles": [],
    "disabledEvents": [],
    "serverStatsEnabled": false,
    "numberGuesserChannelLocked": false
};
config.db = sequelize.define( 'config', {
    id: {
        type: Sequelize.STRING,
        unique: true,
        primaryKey: true
    },
    
    prefix:              { type: Sequelize.STRING, allowNull: false, defaultValue: defaults.prefix },
    suggestionChannel:   Sequelize.STRING,
    autoRoles:           { type: Sequelize.JSON, allowNull: false, defaultValue: defaults.autoRoles },
    mutedRole:           Sequelize.STRING,
    
    modLogChannel:       Sequelize.STRING,
    eventLogChannel:     Sequelize.STRING,
    disabledEvents:      { type: Sequelize.JSON, allowNull: false, defaultValue: defaults.disabledEvents },
    
    autoVC_Category:     Sequelize.STRING,
    autoVC_Channel:      Sequelize.STRING,
    
    inviteChannel:       Sequelize.STRING,
    inviteImage:         Sequelize.STRING,
    
    serverStatsEnabled:  { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
    
    levelMessageChannel: Sequelize.STRING,
    
    numberGuesserChannel: Sequelize.STRING,
    numberGuesserNumber: Sequelize.INTEGER,
    numberGuesserNumberMin: Sequelize.INTEGER,
    numberGuesserNumberMax: Sequelize.INTEGER
} );

config.db.sync();

config.load = async(id) => {
    return new Promise(async(resolve,reject) => {
        let getConf = await config.db.findOne({where: {id: id}});
        if(!getConf) {getConf = await config.db.create({id})}
        resolve(getConf)
    })
}

config.getPrefix = async(id) => {
    return new Promise(async(resolve,reject) => {
        let getConf = await config.load(id);
        let prefix = getConf.prefix;
        resolve(prefix);
    })
}

config.getLog = async (id) => {
    return new Promise(async(resolve,reject) => {
        let load = await config.load(id);
        let obj = {mod: load.modLogChannel, event: load.eventLogChannel}
        resolve(obj)
    })
}

config.checkVC = async (g,id) => {
    return new Promise(async(resolve,reject) => {
        let load = await config.load(g);
        if(load.autoVC_Channel && load.autoVC_Channel == id) {return resolve(load)} else {resolve(false)}
    })
}

config.set = async(id,key,val) => {
    return new Promise(async(resolve,reject) => {
        let load = await config.load(id);
        let newSet = {};
        newSet[key] = val;
        let updateDb = await config.db.update(newSet, {where: {id: id}})
        resolve(true)
    })
}