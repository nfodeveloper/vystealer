const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const randomstring = require('randomstring');
const moment = require('moment');
const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const client = new MongoClient(process.env.MONGODB_URI);
let keysCollection;

client.connect().then(() => {
    const db = client.db(process.env.MONGODB_DB_NAME);
    keysCollection = db.collection('keys');
}).catch(console.error);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('createkeys')
        .setDescription('Generate Vy Stealer license keys.')
        .addStringOption(option =>
            option.setName('duration')
                .setDescription('The license type.')
                .setRequired(true)
                .addChoices(
                    { name: 'Lifetime', value: 'lifetime' },
                    { name: 'Monthly', value: 'monthly' },
                    { name: 'Weekly', value: 'weekly' }
                ))
        .addIntegerOption(option =>
            option.setName('quantity')
                .setDescription('How much licenses will be created.')
                .setRequired(true)),
    async execute(interaction) {
        const duration = interaction.options.getString('duration');
        const quantity = interaction.options.getInteger('quantity');

        if (!duration || !quantity) {
            await interaction.reply("Invalid arguments! Use: /createkey <duration> <quantity>");
            return;
        }

        const owners = process.env.OWNERS.split(',');
        if (!owners.includes(interaction.user.id)) {
            await interaction.reply({ content: "Only owners can use this command!", ephemeral: true });
            return;
        }

        await interaction.deferReply({ ephemeral: true });

        try {
            const keys = [];
            let expirationDate;
            for (let i = 0; i < quantity; i++) {
                const key = "VY-" + randomstring.generate(10);
                if (duration === 'lifetime') {
                    expirationDate = moment().add(99999, 'days').toISOString();
                } else if (duration === 'monthly') {
                    expirationDate = moment().add(1, 'month').toISOString();
                } else if (duration === 'weekly') {
                    expirationDate = moment().add(1, 'week').toISOString();
                }
                keys.push({ key, expirationDate });
            }

            await keysCollection.insertMany(keys.map(k => ({ key: k.key, expirationDate: k.expirationDate, webhook: null })));

            const keysList = keys.map(k => k.key).join('\n');
            const durationText = duration.charAt(0).toUpperCase() + duration.slice(1);

            await interaction.editReply({
                content: `<:p_estrela:1337532914350686259> Generated **${quantity}** ${durationText} Vy keys.\n\`\`\`${keysList}\`\`\``
            });
        } catch (error) {
            console.error(error);
            await interaction.editReply("An error occurred while creating the keys.");
        }
    }
};

module.exports.checkKeyExpirations = async (client) => {
    const now = moment();

    const expiredKeys = await keysCollection.find({ expirationDate: { $lt: now.toISOString() } }).toArray();
    for (const keyData of expiredKeys) {
        await keysCollection.deleteOne({ key: keyData.key });
        const user = await client.guilds.cache.first().members.fetch(keyData.userId);
        if (user) {
            const customerRole = user.guild.roles.cache.find(role => role.name === 'Customer');
            if (customerRole) {
                await user.roles.remove(customerRole);
            }
        }
    }
};