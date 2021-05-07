const { MessageEmbed } = require('discord.js');
const { Command } = require('discord.js-commando');

const { getServers, getServerByServerId } = require('./_servers');
const { permission } = require('../../backend/discord');

class GameServersCommand extends (Command) {
	constructor(client) {
		super(client, {
			name: 'gameservers',
			memberName: 'gameservers',
			aliases: ['gservers', 'gserver'],
			group: 'mod',
			description: 'Get all active game servers',
			guildOnly: true,
			throttling: {
				usages: 3,
				duration: 30
			},
			args: [
				{
					key: 'target',
					prompt: 'What is server-id you wish to search for?',
					type: 'string',
					default: () => null,
				}
			]
		});
	}

	hasPermission(msg) {
		return permission(msg);
	}

	async run(msg, { target }) {

		if (getServers().length <= 0) return msg.reply('There are no running game servers.');

		let targetType;

		if (!target) targetType = 'all';
		else targetType = 'server';

		if (targetType == 'server') {
			const players = getServerByServerId(target);
			if (!players) return msg.reply('That server wasn\'t found.');

			await listServerMembers(msg, target, players);

		} else if (targetType == 'all') {
			const embed = new MessageEmbed()
				.setTitle('Game Servers')
				.setColor('RED');

			for (const [ serverId, serverPlayers ] of getServers()) {
				embed.addField(serverId ? serverId : 'Unknown Server ID', `${Object.keys(serverPlayers).length}/20`, true);
			}

			msg.reply(embed);
		}
	}

}

async function listServerMembers(msg, serverId, players) {
	console.log('Function called', serverId, players);

	const embed = new MessageEmbed()
		.setTitle(`${serverId} Players`)
		.setColor('RED');

	const embPgLmt = 25;
	const iterations = Math.ceil(Object.keys(players).length / embPgLmt);
	let page = 1;

	for (let i = 0; i < iterations; i++) {

		const batch = Object.keys(players).slice((i * embPgLmt), (i * embPgLmt) + 25);

		for (const playerId of batch ) {
			embed.addField(
				`${players[playerId]} (${playerId})`,
				`[Profile](https://roblox.com/users/${playerId}/profile)`,
				true
			);
		}

		embed.setAuthor(`Page ${page}/${iterations}`);
		await msg.reply(embed);

		embed.fields = [];
		page++;

	}

}

module.exports = GameServersCommand;