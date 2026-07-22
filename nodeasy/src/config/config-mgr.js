import createLogger from '../logger.js';
const logger = createLogger('config:mgr');
import chalk from 'chalk';
import { cosmiconfigSync } from 'cosmiconfig';
import schema from './schema.json' with { type: "json" };
import betterAjvErrors from 'better-ajv-errors';
import Ajv from 'ajv';
const ajv = new Ajv();
const configLoader = cosmiconfigSync('nodeasy');

export default function getConfig() {
    const result = configLoader.search(process.cwd());

    if (!result) {
        logger.warning('Could not find configuration, using default');
        return { port: 1234 };
    } else {
        const isValid = ajv.validate(schema, result.config);
        if (!isValid) {
            logger.warning('Invalid configuration was supplied');
            console.log();
            console.log(betterAjvErrors(schema, result.config, ajv.errors));
            process.exit(1);
        }
        logger.debug('Found configuration', result.config);
        return result.config;
    }
}