#!/usr/bin/env node
import { Command, Option } from 'commander';
import chalk from 'chalk';
import getConfig from '../src/config/config-mgr.js';
import start from '../src/commands/start.js';
import createLogger from '../src/logger.js';
const logger = createLogger('bin');
const program = new Command();

try {
    program
        .name('tool')
        .description('CLI for setting up node projects')
        .version('0.0.1');

    program.command('init')
        .description('Creates tool configuration')
        .action((options) => {
            const config = getConfig();
            start(config);
        });

    program.parse();

} catch (e) {
    logger.warning(e.message);
}