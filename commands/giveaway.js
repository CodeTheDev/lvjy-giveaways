const Discord = require('discord.js');
const ms = require('ms');
const messages = require("../utils/messages");

module.exports = {
    description: 'Start a giveaway.',
    options: [
        {
            name: 'duration',
            description: 'Duration of the giveaway. (e.g. 2h, 7d, etc.)',
            type: Discord.ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: 'winners',
            description: 'Number of winners for the giveaway.',
            type: Discord.ApplicationCommandOptionType.Integer,
            required: true
        },
        {
            name: 'prize',
            description: 'Prize for the giveaway.',
            type: Discord.ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: 'channel',
            description: 'Channel to post the giveaway in.',
            type: Discord.ApplicationCommandOptionType.Channel,
            required: true
        }
    ],
    run: async (client, interaction) => {
        if(!interaction.member.permissions.has('ADMINISTRATOR')) {
            return interaction.reply({
                content: ':x:  You need to have the `ADMINISTRATOR` permission node to start giveaways.',
                ephemeral: true
            });
        }
    
        const channel = interaction.options.getChannel('channel');
        const duration = interaction.options.getString('duration');
        const winners = interaction.options.getInteger('winners');
        const prize = interaction.options.getString('prize');
        
        if(!channel.isTextBased()) {
            return interaction.reply({
                content: ':x:  Specified channel is not a text channel.',
                ephemeral: true
            });
        }
    
        client.giveawaysManager.start(channel, {
            duration: ms(duration),
            prize: prize,
            winnerCount: winners,
            hostedBy: null,
            messages
        });
        interaction.reply({
            content: `:white_check_mark:  Giveaway started in ${channel}!`,
            ephemeral: true
        });
    }
};