const { Command } = require('discord.js-commando');

const { permission } = require('../../backend/discord');
const { usernameToUserId } = require('../../backend/roblox');
const { getServerIdByPlayerId } = require('./_servers');

class FindPlayerCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'findplayer',
			memberName: 'findplayer',
			aliases: ['fp', 'searchplayer'],
			group: 'mod',
			description: 'Find what server a player is in (if any)',
			args: [
				{
					key: 'target',
					prompt: 'Who are you searching for?',
					max: 20, min: 3,
					type: 'string'
				}
			]
		});
	}

	hasPermission(msg) {
		return permission(msg);
	}

	async run(msg, { target }) {

		let targetUid = await usernameToUserId(target);
		if (!targetUid) return msg.reply('Target user doesn\'t exist.');

		targetUid = targetUid.id;

		const serverId = getServerIdByPlayerId(targetUid);

		if (!serverId) return msg.reply('Target user wasn\'t found in any game servers.');
		else msg.reply(`Target user found in server \`${serverId}\`.`);

	}

}

module.exports = FindPlayerCommand;