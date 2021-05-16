-- A ModuleScript

local RunService = game:GetService("RunService")
local DatastoreService = game:GetService("DataStoreService")
local BanStore = DatastoreService:GetDataStore("bans")

-- Since DS keys can't be anything other
-- than strings we will quickly turn any value
-- into a string before running any sort of DS query
function toStr(val) 
	if typeof(val) == "string" then return val 
	else return tostring(val) end
end

--------------------------------FUNCTIONS---------------------------------------

local module = {}

module.isBanned = function(userId)
	userId = toStr(userId)		

	local ban = BanStore:GetAsync(userId)

	if ban == nil then return false
	else return ban end -- If they do have a ban, send the given reason they were banned

end

module.addBan = function(userId, reason)
	userId = toStr(userId)

	if module.isBanned(userId) then return "User is already banned" end

	BanStore:SetAsync(userId, reason)

	return true
end

module.removeBan = function(userId)
	userId = toStr(userId)

	if module.isBanned(userId) == false then return "User is not banned" end

	BanStore:RemoveAsync(userId)

	return true
end

--------------------------------BAN CHECKS--------------------------------------

local Players = game:GetService("Players")

Players.PlayerAdded:Connect(function(player)

	local ban = module.isBanned(player.UserId)

	if ban == false then return end

	local msg = 'You are banned for: "'..tostring(ban)..'"'

	if RunService:IsStudio() == false then 
		player:Kick(msg)
	
	elseif RunService:IsStudio() then
		print(msg)
	
	end
end)

--------------------------------RETURNS-----------------------------------------
return module