const { Client, GatewayIntentBits, Collection, REST, Routes, Partials, ActivityType } = require('discord.js');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

client.commands = new Collection();
const commands = [];
const cooldowns = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
        commands.push(command.data.toJSON());
    } else {
        console.log(chalk.yellow(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`));
    }
}

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log(chalk.blue('Started refreshing application (/) commands.'));

        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands },
        );

        console.log(chalk.green('Successfully reloaded application (/) commands.'));
    } catch (error) {
        console.error(chalk.red(error));
    }
})();

client.once('ready', async () => {
    console.clear();
    console.log(chalk.green(`Logged in as ${client.user.tag}!`));
    client.user.setActivity('vystealer', { type: ActivityType.Playing });

    setInterval(async () => {
        const createKeyCommand = client.commands.get('createkeys');
        if (createKeyCommand && createKeyCommand.checkKeyExpirations) {
            await createKeyCommand.checkKeyExpirations(client);
        }
    }, 60 * 60 * 1000); 

    const ticketsCommand = require('./events/tickets');
    const channel = await client.channels.fetch(process.env.TICKETS_CHANNEL_ID);
    if (channel) {
        await ticketsCommand.initialize(channel);
    }
});

client.on('guildMemberAdd', async member => {
    const role = member.guild.roles.cache.find(role => role.name === 'Users');
    if (role) {
        try {
            await member.roles.add(role);
        } catch (error) {
            console.error(chalk.red(`Error adding role to new member: ${error}`));
        }
    } else {
        console.error(chalk.red('Role "Users" not found.'));
    }
});

client.on('interactionCreate', async interaction => {
    if (interaction.isCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) {
            console.error(chalk.red(`No command matching ${interaction.commandName} was found.`));
            return;
        }

        const now = Date.now();
        const timestamps = cooldowns.get(interaction.commandName) || new Collection();
        const cooldownAmount = 15 * 1000;

        if (timestamps.has(interaction.user.id)) {
            const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return interaction.reply({ content: `Please wait ${timeLeft.toFixed(1)} more seconds before reusing the \`${interaction.commandName}\` command.`, ephemeral: true });
            }
        }

        timestamps.set(interaction.user.id, now);
        cooldowns.set(interaction.commandName, timestamps);

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(chalk.red(`Error executing ${interaction.commandName}`));
            console.error(chalk.red(error));
        }
    } else if (interaction.isStringSelectMenu()) {
        const ticketsCommand = require('./events/tickets');
        try {
            await ticketsCommand.handleInteraction(interaction);
        } catch (error) {
            console.error(chalk.red(`Error handling select menu interaction`));
            console.error(chalk.red(error));
        }
    } else if (interaction.isButton()) {
        const ticketsCommand = require('./events/tickets');
        try {
            await ticketsCommand.handleButtonInteraction(interaction);
        } catch (error) {
            console.error(chalk.red(`Error handling button interaction`));
            console.error(chalk.red(error));
        }
    }
});

client.login(process.env.TOKEN);

process.on('uncaughtException', (error) => {
});

process.on('unhandledRejection', (reason, promise) => {
});
