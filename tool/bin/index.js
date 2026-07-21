#!/usr/bin/env node
import arg from 'arg';
import chalk from 'chalk';
import getConfig from '../src/commands/config-mgr';
import start from '../src/commands/start';

try {
    const args = arg({
        '--start': Boolean,
        '--build': Boolean,
    });

    if (args['--start']) {
        const config = getConfig();
        start(config);
    }
} catch (e) {
    console.log(chalk.yellow(e.message));
    console.log();
    usage();
}

function usage() {
    console.log(`${chalk.whiteBright('tool [CMD]')}
    ${chalk.greenBright('--start')}\tStarts the app
    ${chalk.greenBright('--build')}\tBuilds the app    
    `);
}