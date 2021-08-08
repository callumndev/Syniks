const react = module.exports;
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

react.db = sequelize.define('reactStorage', {
    aic: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    gID: Sequelize.STRING,
    mID: Sequelize.STRING,
    cID: Sequelize.STRING,
    rID: Sequelize.STRING,
    emoji: 'VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci'
});

react.db.sync();

react.get = async ( gID, mID, emoji ) => new Promise( async resolve => {
    let getConf = await react.db.findOne( { where: { gID: gID, mID: mID, emoji: emoji } } );
    resolve( getConf ? getConf : false )
} );