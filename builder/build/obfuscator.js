const fs = require('fs').promises;
const path = require('path');
const JavaScriptObfuscator = require('javascript-obfuscator');

const inputFileName = 'index.js';
const outputBaseName = 'vy';
const outputDir = __dirname;

async function obfuscateCode() {
    try {
        const inputFilePath = path.join(outputDir, inputFileName);
        const content = await fs.readFile(inputFilePath, 'utf8');

        const options = {
            compact: true,
            controlFlowFlattening: true,  // Enabled for better obfuscation
            controlFlowFlatteningThreshold: 1.0,  // Apply control flow flattening to 100% of the code
            deadCodeInjection: true,  // Enabled to inject dead code
            deadCodeInjectionThreshold: 0.5,  // Inject dead code into 50% of the code
            debugProtection: true,  // Enabled to prevent debugging
            debugProtectionInterval: 2000,  // Set to a valid number
            disableConsoleOutput: true,
            identifierNamesGenerator: 'mangled-shuffled',  // Use mangled-shuffled identifier names generator
            renameGlobals: true,  // Enabled to rename global variables
            selfDefending: true,  // Enabled to make the code harder to understand
            stringArray: true,
            stringArrayEncoding: ['rc4', 'base64'],  // Use rc4 and base64 encoding for string array
            stringArrayThreshold: 1.0,  // Apply string array encoding to 100% of the strings
            unicodeEscapeSequence: true,  // Enabled to use unicode escape sequences
            rotateStringArray: true,  // Enabled to rotate the string array
            splitStrings: true,  // Enabled to split strings
            splitStringsChunkLength: 5,  // Split strings into chunks of 5 characters
            domainLock: [],  // No domain lock
            seed: 67890,  // Fixed seed for reproducibility
            transformObjectKeys: true,  // Enabled to transform object keys
            numbersToExpressions: true,  // Enabled to convert numbers to expressions
            simplify: true,  // Enabled to simplify the code
            shuffleStringArray: true,  // Enabled to shuffle the string array
            stringArrayWrappersCount: 5,  // Increase the number of string array wrappers
            stringArrayWrappersChainedCalls: true,  // Enabled to chain calls to string array wrappers
            stringArrayWrappersParametersMaxCount: 5,  
            stringArrayWrappersType: 'function',  
            stringArrayWrappersName: 'customWrapper',         
        };

        const obfuscationResult = JavaScriptObfuscator.obfuscate(content, options);

        let obfuscatedCode = obfuscationResult.getObfuscatedCode();

        const outputFileName = `${outputBaseName}.js`;
        const outputFilePath = path.join(outputDir, outputFileName);

        await fs.writeFile(outputFilePath, obfuscatedCode, 'utf8');

        console.log(`Obfuscated code saved to: ${outputFilePath}`);
    } catch (error) {
        console.error('Error processing file:', error);
    }
}

async function startProcess() {
    await obfuscateCode();
}

startProcess();
