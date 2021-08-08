const music = module.exports;
const Sequelize = require('sequelize')
const Discord = require("discord.js")
const ytdl = require('ytdl-core-discord');
music.queue = new Map();
const sequelize = new Sequelize('syniks', 'syniks', '58jne4P@', {
    host: 'syniks.com',
    port: 3306,
    dialect: 'mariadb',
    logging: false,
    define: {
      freezeTableName: true
    }
});

music.db = sequelize.define('musicions', {
  wid: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  guild: Sequelize.STRING,
  id: Sequelize.STRING,
  time: Sequelize.INTEGER,
  reason: Sequelize.STRING,
  staff: Sequelize.STRING,
  type: Sequelize.STRING
})

music.db.sync();



music.add = async (message,song) => {
  let promise = new Promise(async function(resolve, reject) {
    const serverQueue = music.queue.get(message.guild.id);
    let voiceChannel = message.member.voice.channel;
    if (!serverQueue) {
      const queueContruct = {
        textChannel: message.channel,
        voiceChannel: voiceChannel,
        connection: null,
        loop: false,
        songs: [],
        volume: 5,
        playing: true
      };
      music.queue.set(message.guild.id, queueContruct);

      queueContruct.songs.push(song);

      try {
        var connection = await voiceChannel.join();
        queueContruct.connection = connection;
        music.play(message.guild, queueContruct.songs[0]);
        resolve();
      } catch (err) {
        console.error(err);
        queue.delete(message.guild.id);
        message.channel.send(err);
        return resolve()

      }
    } else {
    serverQueue.songs.push(song);
     message.channel.send(`**${song.title}** has been added to the queue!`);
      return resolve()
  }
  });
  return promise;
}

music.loop = async (guild) => {
  return new Promise(async (resolve,reject) => {

  const serverQueue = music.queue.get(guild.id);
  if(!serverQueue) return reject("No queue exists!")
  serverQueue.loop = serverQueue.loop == true ? false : true;
  return resolve(`The queue ${serverQueue.loop == true ? " will now loop" : "will no longer loop"}`)
})
}

music.pause = async (guild) => {
  return new Promise(async (resolve,reject) => {

  const serverQueue = music.queue.get(guild.id);
  if(!serverQueue) return reject("No queue exists!")
  serverQueue.playing == false ? serverQueue.connection.dispatcher.resume() : serverQueue.connection.dispatcher.pause()
  let os = serverQueue.playing
  serverQueue.playing == false ? serverQueue.playing = true : serverQueue.playing = false
  resolve(`Music has been ${os == false ? "resumed" : "paused"}`)
})
}

music.getQueue = async (guild) => {
  return new Promise(async (resolve,reject) => {

  const serverQueue = music.queue.get(guild.id);
  if(!serverQueue) return reject("No queue exists!")
  return resolve(serverQueue.songs)
})
}

music.play = async (guild, song) => {
  const serverQueue = music.queue.get(guild.id);
  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }

  const dispatcher = serverQueue.connection
    .play(await ytdl(song.url), {type: "opus"})
    .on("finish", () => {
      if(!serverQueue.loop) {
        serverQueue.songs.shift();
        music.play(guild, serverQueue.songs[0]);
      } else {
        let s;
        for(let i = 0; i < serverQueue.songs.length; i++) {if(serverQueue.songs[i].url !== song.url) continue; s = i; break;}
        let nn = serverQueue.songs.indexOf(s+1) > -1 ? s+1 : 0
        music.play(guild, serverQueue.songs[nn]);
      }
    })
    .on("error", error => console.error(error));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  serverQueue.textChannel.send(`Started playing: **${song.title}**`);
}

music.loadAll = async (id,mem) => {
  let promise = new Promise(async function(resolve, reject) {
    let find = await music.db.findAll({where: {guild:id, id: mem}});
    if(find) {resolve(find)} else {resolve(false)}
  });
  return promise;
}

music.stop = (message) => {
  const serverQueue = music.queue.get(message.guild.id);
  if(!serverQueue) return;
  serverQueue.songs = [];
  music.queue.delete(message.guild.id)
  serverQueue.connection.dispatcher.end();
}

music.skip = async (message) => {
  const serverQueue = music.queue.get(message.guild.id);
  if(serverQueue) {  serverQueue.connection.dispatcher.end();}
}

music.clear = async (mem) => {
  let promise = new Promise(async function(resolve, reject) {
    let find = await music.db.destroy({where: {guild:mem.guild.id, id: mem.user.id}});
    resolve(true)
    });
  return promise;
}
