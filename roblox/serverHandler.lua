-- A regular server-side script

local CONNECT_ENDPOINT = "The URL your server is using + the '/rbxwebhook' path at the end"
local CONNECT_API_KEY = "The same API key you put in your config.json"

local connection = require(script.Parent.modClient)
local client = connection.new({ apiKey = CONNECT_API_KEY });

local players = game:GetService("Players")
local modFuncs = require(script.Parent.modFunctions)

client:connect(CONNECT_ENDPOINT)

--------------------------------PLAYERS DATA------------------------------------

local playerSendData = {}

(function()
	for i, player in ipairs(players:GetPlayers()) do
		playerSendData[player.UserId] = player.Name
	end

	client:send("allServerPlayers", {
		serverId = client.Id;
		players = playerSendData;
	})
end)()

players.PlayerAdded:Connect(function(player)
	client:send("addServerPlayer", {
		serverId = client.Id;
		player = {
			userId = player.UserId;
			username = player.Name;
		};
	})
end)

players.PlayerRemoving:Connect(function(player)
	client:send("removeServerPlayer", {
		serverId = client.Id;
		player = player.UserId;
	})
end)

--------------------------------MODERATION------------------------------------

client:on("toKick", function(data)

	local target = players:GetPlayerByUserId(data.targetId)
	local moderatorName = players:GetNameFromUserIdAsync(data.moderatorId)

	-- Player not in the game
	if target == nil then return end

	modFuncs.handleKick(target, data.reason)

end)

client:on("toBan", function(data)

	local ModeratorName = players:GetNameFromUserIdAsync(data.moderatorId)
	local TargetName = players:GetNameFromUserIdAsync(data.targetId)
	
	modFuncs.handleBan(data.targetId, data.reason)

end)

client:on("toUnban", function(data)

	modFuncs.handleUnban(data.targetId)

end)

game:BindToClose(function()
	client:disconnect()
end)
