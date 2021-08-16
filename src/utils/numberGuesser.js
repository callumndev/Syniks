const numberGuesser = module.exports;
const Discord = require('discord.js');


numberGuesser.generateNumber = (min, max) => Math.floor(Math.random() * (max - min)) + min;

numberGuesser.generateEmbed = (props) => {
    return new class extends Discord.MessageEmbed {
        constructor() {
            super();
            return Object.assign(this, props)
        };
    };
};

numberGuesser.bot;

numberGuesser.init = bot => {
    numberGuesser.bot = bot;
    
    bot.on('message', async message => {
        if (!message.guild || message.author.bot) return;
        
        let guildConfig = await bot.utils.Config.db.findByPk( message.guild.id );
        if (!guildConfig || !guildConfig.numberGuesserChannel || message.channel.id != guildConfig.numberGuesserChannel) return;
        
        return numberGuesser.onGuess(message, guildConfig);
    });
};


numberGuesser.onGuess = (message, guildConfig) => {
    let guess = parseInt(message.content);
    
    if (isNaN(guess)) return numberGuesser.onGuessNaN(message);
    if(guess < guildConfig.numberGuesserNumberMin) return numberGuesser.onGuessTooSmall(message, guildConfig);
    if(guess > guildConfig.numberGuesserNumberMax) return numberGuesser.onGuessTooBig(message, guildConfig);
    if (guess != guildConfig.numberGuesserNumber) return numberGuesser.onGuessIncorrect(message);
    
    return numberGuesser.onGuessCorrect(message, guildConfig);
};

numberGuesser.onGuessNaN = message => {
    return message.channel.send(numberGuesser.generateEmbed({
        title: 'Not a Number!',
        description: 'Guess was not a number! Guesses can only be numbers',
        color: 'RED'
    }));
}

numberGuesser.onGuessTooSmall = (message, guildConfig) => {
    return message.channel.send(numberGuesser.generateEmbed({
        title: 'Too Small!',
        description: 'Guess too small! The minimum guess allowed is ' + guildConfig.numberGuesserNumberMin,
        color: 'RED'
    }));
};

numberGuesser.onGuessTooBig = (message, guildConfig) => {
    return message.channel.send(numberGuesser.generateEmbed({
        title: 'Too Big!',
        description: 'Guess too big! The maximum guess allowed is ' + guildConfig.numberGuesserNumberMax,
        color: 'RED'
    }));
};

numberGuesser.onGuessIncorrect = (message) => {
    return message.channel.send(numberGuesser.generateEmbed({
        title: 'Incorrect!',
        description: 'Your guess was incorrect, please try again.',
        color: 'RED'
    }));
};

numberGuesser.onGuessCorrect = async (message, guildConfig) => {
    try {
        let toDelete = ['numberGuesserChannel', 'numberGuesserNumber', 'numberGuesserNumberMin', 'numberGuesserNumberMax'];
        toDelete.map(prop => guildConfig[prop] = null);
        await numberGuesser.bot.utils.Config.db.update(guildConfig.dataValues, { where: { id: message.guild.id } });
        return message.channel.send(numberGuesser.generateEmbed({
            title: 'Correct!',
            description: `Your guess was correct, congratulations <@${message.author.id}>. This game as now ended, management will start a new game soon.`,
            color: 'GREEN'
        }));
    } catch (err) {
        return message.channel.send(numberGuesser.generateEmbed({
            title: 'Correct But... Error',
            description: `Guess correct! Your guess was correct, congratulations ${message.author.tag}. But... this game has not ended because ${err.message}`,
            color: 'RED'
        }));
    };
};

numberGuesser.guildHasGame = async (id) => {
    let guildConfig = await numberGuesser.bot.utils.Config.db.findByPk( id );
    return guildConfig && guildConfig.numberGuesserChannel;
};

numberGuesser.createGame = async (id, numberGuesserChannel, numberGuesserNumber, numberGuesserNumberMin, numberGuesserNumberMax) => {
    return await numberGuesser.bot.utils.Config.db.update({ numberGuesserChannel, numberGuesserNumber, numberGuesserNumberMin, numberGuesserNumberMax }, { where: { id } });
};