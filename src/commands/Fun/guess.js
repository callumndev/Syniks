const Discord = require('discord.js');

exports.run = async (bot, message, args) => {
    if (!args.length && args.length < 4) {
        return message.channel.send(bot.utils.numberGuesser.generateEmbed({
            title: 'Usage!',
            description: `Incorrect command usage! The correct usgae is \`${exports.help.usage}\``,
            color: 'RED'
        }));
    };
    let [channel, number, minNumber, maxNumber] = args;
    channel = message.mentions.channels.first() || bot.channels.cache.get(channel);
    number = parseFloat( number );
    minNumber = parseFloat( minNumber );
    maxNumber = parseFloat( maxNumber );
    
    if (!channel) {
        return message.channel.send(bot.utils.numberGuesser.generateEmbed({
            title: 'Invalid Channel!',
            description: `Invalid channel provided! Provide a valid channel mention or ID where the game will be hosted`,
            color: 'RED'
        }));
    };
    if (isNaN(number)) {
        return message.channel.send(bot.utils.numberGuesser.generateEmbed({
            title: 'Invalid Number!',
            description: `Invalid guess number! Provide a valid float number that users have to guess`,
            color: 'RED'
        }));
    };
    if (isNaN(minNumber)) {
        return message.channel.send(bot.utils.numberGuesser.generateEmbed({
            title: 'Invalid Min Number!',
            description: `Invalid minimum guess number! Provide a valid float number that is the minimum users can guess`,
            color: 'RED'
        }));
    };
    if (isNaN(maxNumber)) {
        return message.channel.send(bot.utils.numberGuesser.generateEmbed({
            title: 'Invalid Max Number!',
            description: `Invalid maximum guess number! Provide a valid float number that is the maximum users can guess`,
            color: 'RED'
        }));
    };
    
    if (await bot.utils.numberGuesser.guildHasGame(message.guild.id)) {
        return message.channel.send(bot.utils.numberGuesser.generateEmbed({
            title: 'Already a game active!',
            description: 'Game ongoing! This guild already has an active counting game',
            color: 'RED'
        }));
    };
    if (number < minNumber) {
        return message.channel.send(bot.utils.numberGuesser.generateEmbed({
            title: 'Too Small!',
            description: 'Number too small! The guess number provided was less than the minimum guess number',
            color: 'RED'
        }));
    };
    if (number > maxNumber) {
        return message.channel.send(bot.utils.numberGuesser.generateEmbed({
            title: 'Too Big!',
            description: 'Number too big! The guess number provided was less than the minimum guess number',
            color: 'RED'
        }));
    };
    
    try {
        await bot.utils.numberGuesser.createGame(message.guild.id, channel.id, number, minNumber, maxNumber);
        
        return message.channel.send(bot.utils.numberGuesser.generateEmbed({
            title: 'Guess The Number!',
            description: `Game created! The game will be hosted in ${channel}`,
            color: 'GREEN'
        }));
    } catch (err) {
        return message.channel.send(bot.utils.numberGuesser.generateEmbed({
            title: 'Error Creating!',
            description: 'Error creating game! The game could not be created because ' + err.message,
            color: 'RED'
        }));
    };
};

exports.help = {
    name: 'guess',
    description: 'Create a new number guessing name',
    usage: '<channel> <number> <minNumber> <maxNumber>',
    aliases: []
};