-- A ModuleScript

local HttpService = game:GetService("HttpService")

local Connection = {}
Connection.__index = Connection

function Connection.new(options)
	local self = setmetatable({options = options}, Connection)

	self._events = {}

	return self
end

function Connection:_url(path)
	return "http" .. (self.secure and "s" or "") .. "://" .. (self.host .. "/" .. path):gsub("//+", "/")
end

function Connection:connect(host, secure)
	host = host:gsub("^https?://", "")

	self.host = host
	self.secure = not not secure

	local setValue
	if (self.options ~= nil ) then
		setValue = self.options.apiKey or false
	end

	local json = HttpService:RequestAsync(
		{
			Url = self:_url("/connect"),
			Method = "GET",
			Headers = {
				["Authorization"] = setValue;
				["ServerId"] = game.JobId;
			}
		}
	)

	local response = HttpService:JSONDecode(json.Body)

	if response.id then
		self.Id = response.id

		self._headers = { ["Connection-Id"] = response.id }
		self._connected = true

		self:_recieve()
	end
end

function Connection:disconnect()
	self._connected = false
	HttpService:GetAsync(self:_url("/disconnect"), true, self._headers)
end

function Connection:_getEvent(target)
	if not self._events[target] then
		self._events[target] = Instance.new("BindableEvent")
	end

	return self._events[target]
end

function Connection:_emit(target, data)
	self:_getEvent(target):Fire(data)
end

function Connection:on(target, func)
	return self:_getEvent(target).Event:Connect(func)
end

function Connection:_recieve()
	if self._connected then
		spawn(function()
			local json = HttpService:GetAsync(self:_url("/data"), true, self._headers)
			local response = HttpService:JSONDecode(json)

			for _, message in pairs(response) do
				self:_emit(message.t, message.d)
			end

			self:_recieve()
		end)
	end
end

function Connection:send(target, data)
	spawn(function()
		local body = HttpService:JSONEncode({ t = target, d = data })
		HttpService:PostAsync(self:_url("/data"), body, nil, nil, self._headers)
	end)
end

return Connection