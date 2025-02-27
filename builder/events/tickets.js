const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ChannelType, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const config = {
    tickets: {
        buy: process.env.TICKET_BUY_CATEGORY_ID,
        support: process.env.TICKET_SUPPORT_CATEGORY_ID
    },
};

module.exports = {
    async initialize(channel) {
        const embed = new EmbedBuilder()
            .setAuthor({ name: 'Vy - Ticket System' })
            .setDescription('Please select your reason from the menu below.')
            .setFooter({ text: '@vystealer' })
            .setImage("https://media.discordapp.net/attachments/1334610652211449906/1337507589302386809/Sem_titulo10121111122111111111112111111312211.png?ex=67a7b282&is=67a66102&hm=3170de8d32cd20786f5e9aa04093d83eab9661f501d3fa208856fa3150c2d6c8&=&format=webp&quality=lossless&width=1440&height=583")
            .setColor(0x313338);

        const button = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('vy-tickets')
                    .setPlaceholder('Ticket Options')
                    .addOptions([
                        {
                            label: 'Buy',
                            value: 'buy',
                        },
                        {
                            label: 'Support',
                            value: 'support',
                        }
                    ])
            );

        await channel.send({ embeds: [embed], components: [button] });
    },
    async handleInteraction(interaction) {
        if (!interaction.isStringSelectMenu()) return;

        const option = interaction.values[0];
        const userId = interaction.user.id;
        const userName = interaction.user.username;
        const guild = interaction.guild;

        if (guild.channels.cache.find(c => c.topic === userId)) {
            const embed = new EmbedBuilder()
                .setColor(0x303037)
                .setDescription('You already have a ticket!');
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const category = config.tickets[option.split('-')[0]];  
        if (!category) return;

        guild.channels.create({
            name: `${userName}`,
            type: ChannelType.GuildText,
            parent: category,
            topic: userId,
            permissionOverwrites: [
                { id: userId, allow: ['SendMessages', 'ViewChannel', 'ReadMessageHistory'] },
                { id: "1335700136247951480", allow: ['SendMessages', 'ViewChannel', 'ReadMessageHistory'] },
                { id: guild.roles.everyone, deny: ['ViewChannel'] }
            ]
        }).then(async (channel) => {
            const embed = new EmbedBuilder()
                .setColor(0x313338)
                .setDescription(`Successfully created ticket: <#${channel.id}>`);
            await interaction.reply({ embeds: [embed], ephemeral: true });

            const embedSend = new EmbedBuilder()
                .setColor(0x313338)
                .setAuthor({ name: `Vy - ${option.split('-')[0].charAt(0).toUpperCase() + option.split('-')[0].slice(1)} Ticket`, iconURL: interaction.client.user.displayAvatarURL() })
                .setDescription('Thank you for submitting a ticket! Our support team will get back to you as soon as possible.');

            const buttonRow = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel('Close ticket')
                        .setStyle(ButtonStyle.Secondary)
                        .setCustomId('close-ticket')
                );

            await channel.send({ content: `<@${userId}>`, embeds: [embedSend], components: [buttonRow] });
        });
    },
    async handleButtonInteraction(interaction) {
        if (!interaction.isButton()) return;

        const channel = interaction.channel;

        if (interaction.customId === 'close-ticket') {
            await channel.delete();
        }
    }
}