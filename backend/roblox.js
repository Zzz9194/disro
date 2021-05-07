const axios = require('axios').default;

async function usernameToUserId(username) {
	const response = await axios.get(`https://api.roblox.com/users/get-by-username?username=${username}`)
		.then(res => res.data)
		.catch(() => null);

	if (!response || response.success == false) return null;
	else return { username: response.Username, id: response.Id };
}

module.exports = {
	usernameToUserId: usernameToUserId,
};
