-- A ModuleScript

local chat = game:GetService("Chat")
local players = game:GetService("Players")

-- Custom module used for handling bans
-- refer to roblox/banStore
local BanStore = require(script.Parent.banStore)

local module = {}

module.handleKick = function(Target, Reason)
	--[[
	TargetId: Integer - The UserId of the player you're kicking
	Reason: String - The reason provided when the kick command was invoked
	]]--

	Target:Kick('You\'ve been kicked for "'..chat:FilterStringForBroadcast(Reason, Target)..'"')

	return true
end

module.handleBan = function(TargetId, Reason)
	--[[
	TargetId: Integer - The UserId of the player you're banning
	Reason: String - The reason provided when the ban command was invoked
	]]--

	if BanStore.isBanned(TargetId) ~= false then
		return "User is already banned"
	end

	BanStore.addBan(TargetId, Reason)

	-- If the player is in this server
	-- we kick them too (the reason we run this check 
	-- is because the web-server could've targeted 
	-- this specific client, knowing the player was in the game)
	local TargetPlayer = players:GetPlayerByUserId(TargetId)

	if TargetPlayer ~= nil then
		TargetPlayer:Kick('You\'ve been banned for "'..chat:FilterStringForBroadcast(Reason, TargetPlayer)..'"')
	end

	return true
end

module.handleUnban = function(TargetId)
	--[[
	TargetId: Integer - The UserId of the player you're unbanning
	]]--

	if BanStore.isBanned(TargetId) == false then
		return "User is not banned"
	end

	BanStore.removeBan(TargetId)

	return true
end

return module