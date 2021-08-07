const Discord = require("discord.js")
const { Manager } = require("erela.js");

const nodes = [
    {
      host: "localhost",
      password: "youshallnotpass",
      port: 2333,
    }
  ];

class MusicClient {
    constructor(bot) {
        this.bot = bot;          
        this.manager = new Manager({
            nodes: [{
              host: "localhost",
              retryDelay: 5000,
            }],
            autoPlay: true,
            send: (id, payload) => {
              const guild = this.bot.guilds.cache.get(id);
              if (guild) guild.shard.send(payload);
            }
          })
            .on("nodeConnect", node => console.log(`Node "${node.options.identifier}" connected.`))
            // .on("nodeError", (node, error) => console.log(
            //   `Node "${node.options.identifier}" encountered an error: ${error.message}.`
            // ))
            .on("nodeError", (node, error) => console.log(`Node ${node.options.identifier} had an error: ${error.message}`))

            .on("trackStart", (player, track) => {
              const channel = this.bot.channels.cache.get(player.textChannel);
              channel.send(`Now playing: \`${track.title}\`, requested by \`${track.requester.tag}\`.`);
            })
            .on("queueEnd", player => {
              const channel = this.bot.channels.cache.get(player.textChannel);
              channel.send("Queue has ended.");
              player.destroy();
            });
    }

    createClient(message,vc) {
        let player = this.manager.create({
            guild: message.guild.id,
            voiceChannel: vc.id, 
            textChannel: message.channel.id,
          });
          if (player.state !== "CONNECTED") player.connect();
          return player;
    }

    getClient(message) {
      let player = this.manager.players.get(message.guild.id);
      return player ? player : false
    }
    
    skipSong(player) {
      player.stop();
      return;
    }

    stop(player) {
      player.destroy();
      return;
    }

    togglePause(player) {
      let newSetting = player.paused ? false : true
      player.pause(newSetting);
      return newSetting;
    }

    toggleLoop(player) {
      let newSetting = player.queueRepeat ? false : true
      player.setQueueRepeat(newSetting);
      return newSetting;
    }

    async processSong(player,title,message) {
         let res;

         try {
             res = await player.search(title, message.author);
             if (res.loadType === 'LOAD_FAILED') {
             if (!player.queue.current) player.destroy();
              throw res.exception;
         }
        } catch (err) {
      return message.reply(`there was an error while searching: ${err.message}`);
     }

     switch (res.loadType) {
        case 'NO_MATCHES':
          if (!player.queue.current) player.destroy();
          return message.channel.send(this.bot.error('No results found.'));
        case 'TRACK_LOADED':
          player.queue.add(res.tracks[0]);
    
          if (!player.playing && !player.paused && !player.queue.size) player.play();
          return message.channel.send(this.bot.su(`Adding \`${res.tracks[0].title}\` to the queue.`));
        case 'PLAYLIST_LOADED':
          player.queue.add(res.tracks);
    
          if (!player.playing && !player.paused && player.queue.totalSize === res.tracks.length) player.play();
          return message.channel.send(this.bot.su(`Adding playlist \`${res.playlist.name}\` with ${res.tracks.length} tracks to the queue.`));
        case 'SEARCH_RESULT':
          let max = 5, collected, filter = (m) => m.author.id === message.author.id && /^(\d+|end)$/i.test(m.content);
          if (res.tracks.length < max) max = res.tracks.length;
    
          const results = res.tracks
              .slice(0, max)
              .map((track, index) => `${++index} - \`${track.title}\``)
              .join('\n');

              let resemb = new Discord.MessageEmbed().setTitle("Please make a selection").setDescription(results).setColor(this.bot.color).setThumbnail(message.guild.iconURL());

    
          message.channel.send(resemb);
    
          try {
            collected = await message.channel.awaitMessages(filter, { max: 1, time: 30e3, errors: ['time'] });
          } catch (e) {
            if (!player.queue.current) player.destroy();
            return message.channel.send(this.bot.error("No selection provided."));
          }
    
          const first = collected.first().content;
    
          if (first.toLowerCase() === 'end') {
            if (!player.queue.current) player.destroy();
            return message.channel.send(this.bot.error('Cancelled selection.'));
          }
    
          const index = Number(first) - 1;
          if (index < 0 || index > max - 1) return message.channel.send(this.this.bot.error(`Invalid number provided. Must be (1-${max}).`));
    
          const track = res.tracks[index];
          player.queue.add(track);
    
          if (!player.playing && !player.paused && !player.queue.size) player.play();
          return message.channel.send(this.bot.su(`Added \`${track.title}\` to the queue.`));
      }
    }

}

module.exports = MusicClient;