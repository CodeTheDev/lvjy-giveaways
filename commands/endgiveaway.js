const Discord = require('discord.js');

module.exports = {
    description: 'End a giveaway in-progress.',
    options: [
        {
            name: 'giveaway',
            description: 'The message ID of the giveaway.',
            type: Discord.ApplicationCommandOptionType.String,
            required: true
        }
    ],
    run: async (client, interaction) => {
        if(!interaction.member.permissions.has('ADMINISTRATOR')) {
            return interaction.reply({
                content: ':x:  You need to have the `ADMINISTRATOR` permission node to end giveaways.',
                ephemeral: true
            });
        }

        const giveawayId = interaction.options.getString('giveaway');
        const giveaway = client.giveawaysManager.giveaways.find((guild) => guild.messageId === giveawayId && guild.guildId === interaction.guild.id);

        if (!giveaway) {
            return interaction.reply({
                content: ':x:  Invalid message ID specified.',
                ephemeral: true
            });
        } else if (giveaway.ended) {
            return interaction.reply({
                content: ':x:  This giveaway has already ended.',
                ephemeral: true
            });
        }

        client.giveawaysManager.end(giveaway.messageId).then(() => {
            interaction.reply(`:white_check_mark:  Ended giveaway (ID: \`${giveaway.messageId}\`).`);
        }).catch((error) => {
            interaction.reply({
                content: error,
                ephemeral: true
            });
        });
    }
};