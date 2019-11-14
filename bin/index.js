#!/usr/bin/env node

const Entr = require('../index.js'),
	path = require('path'),
	{Cli, Map} = require('cli.util');

let argv = process.argv;
let cli = new Cli(argv, [
		new Map('postpone')
			.alias(['p', 'P']),
		new Map('reload')
			.alias(['r', 'R']),
		new Map('exclude')
			.alias(['e', 'E'])
			.arg(),
		new Map('include')
			.alias(['i', 'I'])
			.arg()
	], 1),
	arg = cli.argument(); // entr -e "(?!\.ts$)" -r sh -c "ts-node -r tsconfig-paths/register src/main.t"

new Entr({
	cwd: path.resolve(arg.get()),
	exec: argv.slice(cli.end() + 2, argv.length),
	reload: cli.has('reload'),
	postpone: cli.has('postpone'),
	exclude: cli.get('exclude'),
	include: cli.get('include'),
	eval: !cli.has('no-eval')
});
