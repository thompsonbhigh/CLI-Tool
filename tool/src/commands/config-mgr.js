import chalk from 'chalk';
import { pkgUpSync } from 'pkg-up';
import { readFileSync } from 'node:fs';

export default function getConfig() {
    const pkgPath = pkgUpSync({cwd: process.cwd()});
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));

    if (pkg.tool) {
        console.log('Found configuration', pkg.tool);
        return pkg.tool;
    } else {
        console.log(chalk.yellow('Could not find configuration, using default'));
        return { port: 1234 };
    }
}