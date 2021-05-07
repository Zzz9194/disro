const { Client } = require('discord.js-commando');
const { join } = require('path');

const expressServer = require('./backend/server/exprserver.js');
const config = require('./config.json');

const bot = new Client({
	commandPrefix: config.botPrefix,
	owner: config.ownerId
});

bot.registry
	.registerDefaults()
	.registerGroup('mod', 'Moderation', true)
	.registerCommandsIn({
		dirname: join(__dirname, 'commands'),
		// Ignore any filename with a prefixing underscore
		excludeDirs: /_\w+\.?/,
	});

bot.once('ready', () => {
	console.log('Bot up!');
});

// Start our server
expressServer.start();

// Start our discord bot
// (this goes last since)
// bot.login is blocking
bot.login(config.botToken);
