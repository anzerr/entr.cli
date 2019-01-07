#!/usr/bin/env node

const entr = require('../index.js'),
	Cli = require('cli.util');

let argv = process.argv, cliArg = [], execArgv = [], length = 0;
for (let i in argv) {
	if (length < 3) {
		if (argv[i].match(/^(--.*|-.)$/)) {
			if (argv[i].match(/^-.$/)) {
				length -= 1;
			}
		} else {
			length += 1;
		}
		cliArg.push(argv[i]);
	} else {
		execArgv.push(argv[i]);
	}
}
let cli = new Cli(cliArg, {}), cwd = process.cwd();

console.log(cliArg, execArgv);
console.log(cli.argument());

console.log('----\n', (new Cli(argv, {})));
