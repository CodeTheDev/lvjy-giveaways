const Discord = require('discord.js');

module.exports = {
    description: 'Reroll giveaway winners.',
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
                content: ':x:  You need to have the `ADMINISTRATOR` permission node to reroll giveaways.',
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
        } else if (!giveaway.ended) {
            return interaction.reply({
                content: ':x:  The specified giveaway has not ended yet.',
                ephemeral: true
            });
        }

        client.giveawaysManager.reroll(giveaway.messageId).then(() => {
            interaction.reply(`:white_check_mark:  Rerolled giveaway (ID: \`${giveaway.messageId}\`).`);
        }).catch((error) => {
            interaction.reply({
                content: error,
                ephemeral: true
            });
        });
    }
};