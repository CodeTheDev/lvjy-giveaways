const Discord = require('discord.js');
const client = new Discord.Client({
	intents: [
		Discord.IntentsBitField.Flags.Guilds,
		Discord.IntentsBitField.Flags.GuildMessageReactions,
		Discord.IntentsBitField.Flags.GuildMembers
	]
});

// Configuration
const config = require('./config.json');
client.config = config;
console.log('Loaded configuration.');

// Giveaways Manager
const { GiveawaysManager } = require('discord-giveaways');
const manager = new GiveawaysManager(client, {
	storage: './giveaways.json',
	default: {
		botsCanWin: false,
		embedColor: '#FFFFFF',
		embedColorEnd: '#FFFFFF',
		reaction: '🎉'
	}
});
client.giveawaysManager = manager;
console.log('Initialized giveaways manager.')

// Commands
const fs = require('fs');
const syncCommands = require('discord-sync-commands');
client.commands = new Discord.Collection();
fs.readdir('./commands/', (_err, files) => {
	files.forEach((file) => {
		if (!file.endsWith('.js')) return;
		let commandName = file.split('.')[0];
		const command = require(`./commands/${file}`);
		client.commands.set(commandName, {
			name: commandName,
			...command
		});
		delete require.cache[require.resolve(`./commands/${file}`)];
	});
    syncCommands(client, client.commands.map((command) => ({
        name: command.name,
        description: command.description,
        options: command.options,
        type: Discord.ApplicationCommandType.ChatInput
    })), {
        debug: true,
        guildId: config.guild_id
    });
    console.log('Loaded commands.');
});

// Events
client.on('interactionCreate', (interaction) => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);
	if (!command) return void interaction.reply({
		content: `:x: Command \`${interaction.commandName}\` not found.`,
		ephemeral: true
	});

	command.run(client, interaction);
});
client.giveawaysManager.on('giveawayEnded', (giveaway, winners) => {
	console.log(`\nGiveaway (ID: ${giveaway.messageId}) ended.\nWinners: ${winners.map((member) => member.user.username).join(', ')}`);
});
client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}.\n`);
});

// Login
client.login(config.bot_token);