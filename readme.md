# [dis](https://discord.com)[ro](https://roblox.com)

Discord to Roblox moderation system.

This system **only** enables discord-to-roblox moderation, it's up to you to implement roblox-to-roblox systems.


Much bigger implementations are planned including:
- Updating the codebase with more commands for utility usage (Like checking server data, server fps, server uptime, etc.)
- Cleaning up of the entire codebase cause it is very messy 💀
- Sorting the roblox-client side code allowing scripters to easily implement additional systems such as server messages, so on.

---

## Why disro???

- Web connections are socket-like
	- A lot of systems seen may take significantly long amounts of time to execute commands on roblox, or may exhaust their HTTP calls, disro uses [long polling](https://www.pubnub.com/blog/http-long-polling/) to maintain connections for as long as possible, making sure resources aren't wasted, simultaneously assuring: 1. Near-instant command execution 2. No exhaustive HTTP calls
- Discord bot framework makes it easy to use
- Takes minutes to set up
- Flexible to use on large scale games

---

## Installation


### Step 1.

```sh
# Clone this project
https://github.com/Zzz9194/disro.git

# Go into the directory
cd disro

# Install the required dependencies (from the package.json)
npm install
```

### Step 2.

Edit the `config.json` file.
```json
{
	"botToken": "The bot token given from your application (Refer to https://github.com/Zzz9194/disro/wiki#creating--inviting-a-discord-bot)",
	"botPrefix": "The prefix all your bot commands will use",
	"ownerId": "Bot owner discord ID (As a string [wrapped in quotes] not as an integer!)",
    "serverApiKey": "The API key for your server to communicate with the roblox client, can be any random generated string (Refer to https://github.com/Zzz9194/disro/wiki#generating-a-uuid)",
	"moderationRoleId": "The role ID that is required to run game moderation commands, if it's an empty string only game owners will be able to use commands"
}
```

### Step 3.

Copy the `roblox/ServerFiles.rbxm` **ONLY** into a location in your `ServerScriptService`

In the event (for some reason) you can't upload the `.rbxm` file, upload the four `.lua` files as ModuleScript's, except `GatewayHandler` which should be a regular Script.

Once copied, edit the `GatewayHandler` script with your `serverApiKey` at line 4 and your server URL at line 3

_**!**_ Your server URL can not be a local address (E.g. `127.0.0.1:3000`) because Roblox prohibits any HTTP requests to them

_**!**_ Make sure the game is published and HTTP services are enabled in the Permissions section of the "Game Settings"

`Game Settings > Security > Allow HTTP Requests > Enable`

### Step 4. 

Start up your server

Run `npm start` or `node .`

_**!**_ You can only connect roblox servers after/while the server is alive

---

## Discord Bot Commands

`<>` Indicates a required argument

`[]` Indicates an optional argument

### `findplayer <username>`

Find the server a player is currently in (if they're in any)

### `gameservers [server ID]`

With server ID: Get a list of all the players in the server

Without server ID: Get a list of all the current game servers

### `gamekick <username> <reason>`

Kick a player from the server they're currently in

### `gameban <username> <reason>`

Ban a player from the game entirely and if they're in a server, kick them

### `gameunban <username>`

Unban a player from the entire game

---

## FAQs

### Why did you implement [rbxwebhook.js](https://www.npmjs.com/package/rbxwebhook.js) in your code instead of installing the dependency?

The dependency manages client connections by assigning a random UUID, for this system to be a little easier to use, I assign each connection the ID of the server it's connected to. I'm yet to make a pull request for this to the dependency.

(If you run this on Roblox Studio where they don't give server IDs, the router will randomly generate one)

### How are bans currently handled?

A datastore named "bans" is created and entries are written directly into that datastore with the entry keys being the target user ID and the value being the ban reason

The module to handle all this is in `roblox/BanStore`

### How do I implement my own ban handling/storage system?

Go to `roblox/ModFunctions` and you can adjust/re-do the "handleBan" function as you wish

---

## Dependencies

This project is nothing without the blood, sweat and tears of other dependencies. The listed projects severely assisted the creation of this system and are depended on within the code someway or another.

Their code repositories are listed below:

- [Axios](https://www.npmjs.com/package/axios)
- [Discord.js-commando](https://www.npmjs.com/package/discord.js-commando)
- [Express](npmjs.com/package/express)
- [rbxwebhook.js](https://www.npmjs.com/package/rbxwebhook.js) (Custom implementation was made but the essence of the socket-like communication is directly from this project)

## Suggestions

I do not have a discord server for this since it's a very weeny project, so if you have any suggestions please slap me a friend request on Discord (Zz#7940) and you can talk to me directly from there :D
