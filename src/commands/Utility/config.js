const Discord = require('discord.js')


exports.run = async (bot,message,args,msg) => {
    let indent = '>',
        website = 'https://syniks.com';
    class SyniksEmbed extends Discord.MessageEmbed {
        constructor(props) {
            super();
            return Object.assign(this, props)
        };
    };
    return message.channel.send(new SyniksEmbed({
        title: 'We\'ve moved!',
        description: [
            'We have moved the config!',
            'The config can now be edited on our new dashboard:',
            '',
            `${indent} [Website Link](${website})`,
            `${indent} [Dashboard Link](${`${website}/dashboard/${message.guild.id}`})`
        ].join('\n'),
        color: 'BLUE'
    }));
};

exports.help = {
    name: 'config',
    aliases: ['setup'],
    usage: '()',
    description: 'Update server configuration'
};