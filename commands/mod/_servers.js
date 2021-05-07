// This module is only for handling data

const { servers } = require('../../backend/server/router');

module.exports.getServerIdByPlayerId = (userId) => {

	for (const [ serverId, players ] of Object.entries(servers)) {
		if (Object.keys(players).includes(userId.toString())) return serverId;
	}

	return null;
};

module.exports.getServers = () => {
	return Object.keys(servers);
};

module.exports.getServerByServerId = (serverId) => {
	const data = servers[serverId];

	return data ? data : null;
};

module.exports.isPlayerIngame = (userId) => {

	const res = this.getServerByPlayerId(userId);

	if (!res) return false;
	else return true;
};

module.exports.servers = servers;
