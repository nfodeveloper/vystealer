const { SlashCommandBuilder } = require('discord.js');
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
        .setName('redeem')
        .setDescription('Redeem your Vy Stealer key.')
        .addStringOption(option =>
            option.setName('key')
                .setDescription('The license key from your plan.')
                .setRequired(true)),
    async execute(interaction) {
        const key = interaction.options.getString('key');
        const userId = interaction.user.id;

        await interaction.deferReply({ ephemeral: true });

        try {
            const keyData = await keysCollection.findOne({ key });

            if (!keyData) {
                await interaction.editReply("Invalid key.");
                return;
            }

            const now = new Date();
            if (new Date(keyData.expirationDate) < now) {
                await interaction.editReply("This key has expired.");
                return;
            }

            const existingPlan = await keysCollection.findOne({ userId });
            if (existingPlan) {
                await interaction.editReply("You already have a plan.");
                return;
            }

            await keysCollection.updateOne({ key }, { $set: { redeemed: true, userId } });

            await interaction.editReply({
                content: `<:p_estrela:1337532914350686259> You successfully redeemed a Vy Stealer plan.`
            });

            const customerRole = interaction.guild.roles.cache.find(role => role.name === 'Customer');
            if (customerRole) {
                const user = await interaction.guild.members.fetch(userId);
                await user.roles.add(customerRole);
                console.log(`Assigned "Customer" role to user ${userId}`);
            } else {
                console.error('Role "Customer" not found.');
            }
        } catch (error) {
            console.error(error);
            await interaction.editReply("An error occurred while redeeming the key.");
        }
    }
};
