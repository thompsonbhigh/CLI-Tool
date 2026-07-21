import chalk from 'chalk';
import createLogger from '../logger.js';
const logger = createLogger('commands:start');
import fs from 'node:fs/promises';
import { oraPromise } from 'ora';
import path from 'node:path';
import { Buffer } from 'node:buffer';
import { input, select } from '@inquirer/prompts';

export default async function start(config) {
    try {
        const projectName = await input({ message: 'Enter your project name' });
        const projectType = await select({
            message: 'Select a module system',
            choices: [
                {
                    name: 'commonjs',
                    value: 'commonjs',
                    description: 'commonjs is the older module system which uses require()',
                },
                {
                    name: 'module',
                    value: 'module',
                    description: 'ESM or ES Modules is the newer module system which uses import'
                },
            ],
        });

        const srcFolder = path.join(process.cwd(), 'src');
        const testFolder = path.join(process.cwd(), 'test');
        const configText = projectType == 'commonjs' ? `module.exports = {\n\tport: 5555\n}` : `export default {\n\tport: 5555\n}`;
        const configData = new Uint8Array(Buffer.from(configText));
        const gitignoreData = new Uint8Array(Buffer.from('node_modules/\n.env\ncoverage/\ndist/\n*.log\n.DS_Store'));
        const dotenvData = new Uint8Array(Buffer.from('# Put secrets in here'));
        const packageData = new Uint8Array(Buffer.from(
`{
    "name": "${projectName}",
    "version": "1.0.0",
    "description": "",
    "type": "${projectType}",
    "main": "src/index.js",
    "scripts": {
        "start": "node src/index.js",
        "dev": "node --watch src/index.js",
        "test": "node --test"
    },
    "keywords": [],
    "author": "",
    "license": "ISC"
}`));

        const indexData = new Uint8Array(Buffer.from(
`import express from 'express';
import 'dotenv/config';
dotenv.config();

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server here!');
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});`
        ));

        await oraPromise(fs.mkdir(srcFolder, { recursive: true }), { text: 'Creating src directory', successText: 'Created src directory', failText: 'Failed to create src directory'});
        await oraPromise(fs.mkdir(testFolder, { recursive: true }), { text: 'Creating test directory', successText: 'Created test directory', failText: 'Failed to create test directory'});
        await oraPromise(fs.writeFile('.gitignore', gitignoreData), { text: 'Creating .gitignore file', successText: 'Created .gitignore file', failText: 'Failed to create .gitignore file'});
        await oraPromise(fs.writeFile('.env', dotenvData), { text: 'Creating .env file', successText: 'Created .env file', failText: 'Failed to create .env file'});
        await oraPromise(fs.writeFile('package.json', packageData), { text: 'Creating package.json file', successText: 'Created package.json file', failText: 'Failed to create package.json file'});
        await oraPromise(fs.writeFile('./src/index.js', indexData), { text: 'Creating index.js file', successText: 'Created index.js file', failText: 'Failed to create index.js file'});
        await oraPromise(fs.writeFile('tool.config.js', configData), { text: 'Creating tool.config.js file', successText: 'Created tool.config.js file', failText: 'Failed to create tool.config.js file'});
    } catch (e) {
        logger.debug(e.message);
    }
}