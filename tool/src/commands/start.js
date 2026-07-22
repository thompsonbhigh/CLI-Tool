import chalk from 'chalk';
import createLogger from '../logger.js';
const logger = createLogger('commands:start');
import fs from 'node:fs/promises';
import { oraPromise } from 'ora';
import path from 'node:path';
import { Buffer } from 'node:buffer';
import { checkbox, input, select } from '@inquirer/prompts';
import child_process from 'node:child_process';
import { promisify } from 'node:util';
import { execa } from 'execa';

export default async function start(config) {
    try {
        const exec = promisify(child_process.exec);
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

        /*
        |--------------------------------------------------------------------------
        | Language
        |--------------------------------------------------------------------------
        */

        const languagePkgs = await select({
            message: 'Select a language',
            choices: [
                {
                    name: 'JavaScript',
                    value: [],
                    description: 'Standard modern JavaScript with no additional packages'
                },
                {
                    name: 'TypeScript',
                    value: ['typescript', 'tsx', '@types/node'],
                    description: 'Static typing, Node type definitions and TypeScript execution'
                }
            ]
        });

        /*
        |--------------------------------------------------------------------------
        | Web framework
        |--------------------------------------------------------------------------
        */

        const frameworkPkgs = await select({
            message: 'Select a web framework to install',
            choices: [
                {
                    name: 'None',
                    value: [],
                    description: 'Do not install a web framework'
                },
                {
                    name: 'Express',
                    value: ['express', '@types/express'],
                    description: 'Familiar and minimal framework for APIs and web servers'
                },
                {
                    name: 'Fastify',
                    value: ['fastify'],
                    description: 'Fast, low-overhead framework with a plugin architecture'
                },
                {
                    name: 'Hono',
                    value: ['hono'],
                    description: 'Lightweight framework that supports multiple JavaScript runtimes'
                },
                {
                    name: 'NestJS',
                    value: [
                        '@nestjs/common',
                        '@nestjs/core',
                        '@nestjs/platform-express',
                        'reflect-metadata',
                        'rxjs'
                    ],
                    description: 'Opinionated framework for larger, structured applications'
                }
            ]
        });

        /*
        |--------------------------------------------------------------------------
        | HTTP client
        |--------------------------------------------------------------------------
        */

        const httpPkgs = await select({
            message: 'Select an HTTP client to install',
            choices: [
                {
                    name: 'Native Fetch - no package required',
                    value: [],
                    description: 'Recommended default for modern Node'
                },
                {
                    name: 'Axios',
                    value: ['axios'],
                    description: 'Interceptors, convenience configuration and broad familiarity'
                },
                {
                    name: 'Undici',
                    value: ['undici'],
                    description: 'Lower-level HTTP client underlying Node’s Fetch implementation'
                }
            ]
        });

        /*
        |--------------------------------------------------------------------------
        | Database
        |--------------------------------------------------------------------------
        */

        const databasePkgs = await select({
            message: 'Select a database driver to install',
            choices: [
                {
                    name: 'None',
                    value: [],
                    description: 'Do not install a database driver'
                },
                {
                    name: 'PostgreSQL',
                    value: ['pg'],
                    description: 'PostgreSQL client for Node.js'
                },
                {
                    name: 'MySQL',
                    value: ['mysql2'],
                    description: 'MySQL client with Promise support'
                },
                {
                    name: 'SQLite',
                    value: ['better-sqlite3'],
                    description: 'Fast and synchronous SQLite driver'
                },
                {
                    name: 'MongoDB',
                    value: ['mongodb'],
                    description: 'Official MongoDB driver for Node.js'
                },
                {
                    name: 'MongoDB with Mongoose',
                    value: ['mongoose'],
                    description: 'MongoDB object modeling and schema validation'
                }
            ]
        });

        /*
        |--------------------------------------------------------------------------
        | ORM or query builder
        |--------------------------------------------------------------------------
        */

        const ormPkgs = await select({
            message: 'Select an ORM or query builder to install',
            choices: [
                {
                    name: 'None',
                    value: [],
                    description: 'Use the database driver directly'
                },
                {
                    name: 'Prisma',
                    value: ['prisma', '@prisma/client'],
                    description: 'Schema-based ORM with a generated type-safe client'
                },
                {
                    name: 'Drizzle',
                    value: ['drizzle-orm', 'drizzle-kit'],
                    description: 'Lightweight TypeScript ORM with SQL-like queries'
                },
                {
                    name: 'Sequelize',
                    value: ['sequelize'],
                    description: 'Traditional model-based SQL ORM'
                },
                {
                    name: 'TypeORM',
                    value: ['typeorm', 'reflect-metadata'],
                    description: 'Entity and decorator-based TypeScript ORM'
                },
                {
                    name: 'Knex',
                    value: ['knex'],
                    description: 'Flexible SQL query builder'
                }
            ]
        });

        /*
        |--------------------------------------------------------------------------
        | API features
        |--------------------------------------------------------------------------
        */

        const apiFeatureSelections = await checkbox({
            message: 'Select API features to install',
            choices: [
                {
                    name: 'Zod validation',
                    value: ['zod'],
                    description: 'Validate request data, environment variables and schemas'
                },
                {
                    name: 'CORS',
                    value: ['cors', '@types/cors'],
                    description: 'Configure cross-origin HTTP requests'
                },
                {
                    name: 'Helmet',
                    value: ['helmet'],
                    description: 'Add common HTTP security headers'
                },
                {
                    name: 'Rate limiting',
                    value: ['express-rate-limit'],
                    description: 'Limit repeated requests to Express endpoints'
                },
                {
                    name: 'Cookie parsing',
                    value: ['cookie-parser', '@types/cookie-parser'],
                    description: 'Parse cookies from incoming Express requests'
                },
                {
                    name: 'File uploads',
                    value: ['multer', '@types/multer'],
                    description: 'Handle multipart form data and uploaded files'
                },
                {
                    name: 'Response compression',
                    value: ['compression', '@types/compression'],
                    description: 'Compress HTTP response bodies'
                }
            ]
        });

        const apiFeaturePkgs = apiFeatureSelections.flat();

        /*
        |--------------------------------------------------------------------------
        | Authentication
        |--------------------------------------------------------------------------
        */

        const authenticationPkgs = await select({
            message: 'Select an authentication method',
            choices: [
                {
                    name: 'None',
                    value: [],
                    description: 'Do not install authentication packages'
                },
                {
                    name: 'JWT with jsonwebtoken',
                    value: ['jsonwebtoken', 'bcrypt', '@types/jsonwebtoken', '@types/bcrypt'],
                    description: 'Token-based authentication with bcrypt password hashing'
                },
                {
                    name: 'JWT with JOSE',
                    value: ['jose', 'bcrypt', '@types/bcrypt'],
                    description: 'Modern JWT utilities with bcrypt password hashing'
                },
                {
                    name: 'Express sessions',
                    value: [
                        'express-session',
                        'bcrypt',
                        '@types/express-session',
                        '@types/bcrypt'
                    ],
                    description: 'Server-side session authentication for Express'
                },
                {
                    name: 'Passport',
                    value: ['passport', 'passport-local', '@types/passport', '@types/passport-local'],
                    description: 'Strategy-based authentication middleware'
                }
            ]
        });

        /*
        |--------------------------------------------------------------------------
        | Logging
        |--------------------------------------------------------------------------
        */

        const loggingPkgs = await select({
            message: 'Select a logger to install',
            choices: [
                {
                    name: 'None',
                    value: [],
                    description: 'Use the built-in console methods'
                },
                {
                    name: 'Pino',
                    value: ['pino', 'pino-pretty'],
                    description: 'Fast structured JSON logging with readable development output'
                },
                {
                    name: 'Winston',
                    value: ['winston'],
                    description: 'Flexible logging with multiple formats and transports'
                },
                {
                    name: 'Morgan',
                    value: ['morgan', '@types/morgan'],
                    description: 'Simple HTTP request logging middleware for Express'
                }
            ]
        });

        /*
        |--------------------------------------------------------------------------
        | Testing
        |--------------------------------------------------------------------------
        */

        const testingPkgs = await select({
            message: 'Select a testing framework to install',
            choices: [
                {
                    name: 'None',
                    value: [],
                    description: 'Do not install a testing framework'
                },
                {
                    name: 'Node Test Runner',
                    value: [],
                    description: 'Use the test runner built into Node.js'
                },
                {
                    name: 'Vitest',
                    value: ['vitest'],
                    description: 'Modern and TypeScript-friendly testing framework'
                },
                {
                    name: 'Jest',
                    value: ['jest', '@types/jest'],
                    description: 'Mature testing framework with a large ecosystem'
                }
            ]
        });

        const apiTestingPkgs = await checkbox({
            message: 'Select additional testing utilities',
            choices: [
                {
                    name: 'Supertest',
                    value: ['supertest', '@types/supertest'],
                    description: 'Test HTTP server endpoints'
                },
                {
                    name: 'Testcontainers',
                    value: ['testcontainers'],
                    description: 'Run disposable databases and services during tests'
                },
                {
                    name: 'Faker',
                    value: ['@faker-js/faker'],
                    description: 'Generate realistic fake data for tests'
                }
            ]
        });

        /*
        |--------------------------------------------------------------------------
        | Code quality
        |--------------------------------------------------------------------------
        */

        const codeQualityPkgs = await select({
            message: 'Select code-quality tooling',
            choices: [
                {
                    name: 'None',
                    value: [],
                    description: 'Do not install linting or formatting tools'
                },
                {
                    name: 'ESLint and Prettier',
                    value: ['eslint', 'prettier', 'eslint-config-prettier'],
                    description: 'Lint code and automatically enforce consistent formatting'
                },
                {
                    name: 'ESLint only',
                    value: ['eslint'],
                    description: 'Find problematic code patterns'
                },
                {
                    name: 'Prettier only',
                    value: ['prettier'],
                    description: 'Automatically format project files'
                },
                {
                    name: 'TypeScript ESLint and Prettier',
                    value: [
                        'eslint',
                        'typescript-eslint',
                        'prettier',
                        'eslint-config-prettier'
                    ],
                    description: 'Lint and format a TypeScript project'
                }
            ]
        });

        /*
        |--------------------------------------------------------------------------
        | Git tooling
        |--------------------------------------------------------------------------
        */

        const gitToolSelections = await checkbox({
            message: 'Select Git development tools to install',
            choices: [
                {
                    name: 'Husky',
                    value: ['husky'],
                    description: 'Configure Git hooks from the project'
                },
                {
                    name: 'lint-staged',
                    value: ['lint-staged'],
                    description: 'Run checks only against staged files'
                },
                {
                    name: 'Commitlint',
                    value: ['@commitlint/cli', '@commitlint/config-conventional'],
                    description: 'Enforce consistent commit message formatting'
                }
            ]
        });

        /*
        |--------------------------------------------------------------------------
        | Development utilities
        |--------------------------------------------------------------------------
        */

        const developmentUtilitySelections = await checkbox({
            message: 'Select development utilities to install',
            choices: [
                {
                    name: 'tsx',
                    value: ['tsx'],
                    description: 'Run and watch TypeScript files'
                },
                {
                    name: 'Nodemon',
                    value: ['nodemon'],
                    description: 'Restart the application when files change'
                },
                {
                    name: 'Concurrently',
                    value: ['concurrently'],
                    description: 'Run multiple npm scripts at the same time'
                },
                {
                    name: 'cross-env',
                    value: ['cross-env'],
                    description: 'Set environment variables consistently across operating systems'
                },
                {
                    name: 'rimraf',
                    value: ['rimraf'],
                    description: 'Delete files and directories across operating systems'
                },
                {
                    name: 'npm-run-all2',
                    value: ['npm-run-all2'],
                    description: 'Run npm scripts sequentially or in parallel'
                }
            ]
        });

        /*
        |--------------------------------------------------------------------------
        | General utilities
        |--------------------------------------------------------------------------
        */

        const generalUtilitySelections = await checkbox({
            message: 'Select general utilities to install',
            choices: [
                {
                    name: 'dotenv',
                    value: ['dotenv'],
                    description: 'Load environment variables from a .env file'
                },
                {
                    name: 'date-fns',
                    value: ['date-fns'],
                    description: 'Modern date utility functions'
                },
                {
                    name: 'Day.js',
                    value: ['dayjs'],
                    description: 'Small library for parsing and formatting dates'
                },
                {
                    name: 'UUID',
                    value: ['uuid'],
                    description: 'Generate standard UUID values'
                },
                {
                    name: 'Nano ID',
                    value: ['nanoid'],
                    description: 'Generate compact unique identifiers'
                },
                {
                    name: 'Lodash',
                    value: ['lodash', '@types/lodash'],
                    description: 'General collection, array and object utilities'
                },
                {
                    name: 'Decimal.js',
                    value: ['decimal.js'],
                    description: 'Perform precise decimal arithmetic'
                },
                {
                    name: 'Slugify',
                    value: ['slugify'],
                    description: 'Create URL-friendly strings'
                }
            ]
        });

        /*
        |--------------------------------------------------------------------------
        | CLI packages
        |--------------------------------------------------------------------------
        */

        const cliPackageSelections = await checkbox({
            message: 'Select CLI packages to install',
            choices: [
                {
                    name: 'Commander',
                    value: ['commander'],
                    description: 'Create commands, arguments and options'
                },
                {
                    name: 'Yargs',
                    value: ['yargs'],
                    description: 'Parse command-line arguments and generate help menus'
                },
                {
                    name: 'Inquirer prompts',
                    value: ['@inquirer/prompts'],
                    description: 'Create interactive command-line prompts'
                },
                {
                    name: 'Chalk',
                    value: ['chalk'],
                    description: 'Add colors and styles to terminal output'
                },
                {
                    name: 'Ora',
                    value: ['ora'],
                    description: 'Display loading spinners in the terminal'
                },
                {
                    name: 'Execa',
                    value: ['execa'],
                    description: 'Execute child processes and shell commands'
                },
                {
                    name: 'fs-extra',
                    value: ['fs-extra', '@types/fs-extra'],
                    description: 'Additional filesystem utilities'
                },
                {
                    name: 'Conf',
                    value: ['conf'],
                    description: 'Store persistent configuration for a CLI application'
                },
                {
                    name: 'Update Notifier',
                    value: ['update-notifier'],
                    description: 'Notify users when a newer CLI version is available'
                }
            ]
        });

        /*
        |--------------------------------------------------------------------------
        | Combine selected packages
        |--------------------------------------------------------------------------
        */

        const selectedPackages = [
            ...languagePkgs,
            ...frameworkPkgs,
            ...httpPkgs,
            ...databasePkgs,
            ...ormPkgs,
            ...apiFeaturePkgs,
            ...authenticationPkgs,
            ...loggingPkgs,
            ...testingPkgs,
            ...apiTestingPkgs.flat(),
            ...codeQualityPkgs,
            ...gitToolSelections.flat(),
            ...developmentUtilitySelections.flat(),
            ...generalUtilitySelections.flat(),
            ...cliPackageSelections.flat()
        ];

        // Remove duplicate packages.
        const uniquePackages = [...new Set(selectedPackages)];

        console.log('Project type:', projectType);
        console.log('Packages to install:', uniquePackages);

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

        async function npmInst() {
            const { stdout, stderr } = await exec('npm i express');
        }

        await oraPromise(fs.mkdir(srcFolder, { recursive: true }), { text: 'Creating src directory', successText: 'Created src directory', failText: 'Failed to create src directory'});
        await oraPromise(fs.mkdir(testFolder, { recursive: true }), { text: 'Creating test directory', successText: 'Created test directory', failText: 'Failed to create test directory'});
        await oraPromise(fs.writeFile('.gitignore', gitignoreData), { text: 'Creating .gitignore file', successText: 'Created .gitignore file', failText: 'Failed to create .gitignore file'});
        await oraPromise(fs.writeFile('.env', dotenvData), { text: 'Creating .env file', successText: 'Created .env file', failText: 'Failed to create .env file'});
        await oraPromise(fs.writeFile('package.json', packageData), { text: 'Creating package.json file', successText: 'Created package.json file', failText: 'Failed to create package.json file'});
        await oraPromise(fs.writeFile('./src/index.js', indexData), { text: 'Creating index.js file', successText: 'Created index.js file', failText: 'Failed to create index.js file'});
        await oraPromise(fs.writeFile('tool.config.js', configData), { text: 'Creating tool.config.js file', successText: 'Created tool.config.js file', failText: 'Failed to create tool.config.js file'});
        if (uniquePackages.length > 0) {
            await execa('npm', ['install', ...uniquePackages], {
                cwd: process.cwd(),
                stdio: 'inherit'
            });
        }
    } catch (e) {
        logger.debug(e.message);
    }
}