
### `Intro`
Run a command when a file/directory is changed

#### `Install`
``` bash
npm install --save git+https://github.com/anzerr/entr.cli.git
npm install --save @anzerr/entr.cli
```

``` bash
git clone git+https://github.com/anzerr/entr.cli.git &&
cd entr.cli &&
npm link
```

### `Example`

``` bash
entr -r index.js ls -la .
entr -p package.json npm i

// no-eval gives you full control
entr -p package.json --no-eval sh -c "rm -f package-lock.json && npm i"

// run change when ts file is edited outside of node_modules
entr -e "(node_module|git)" -i '^(?!.*node_modules).*\.ts$' . echo "change"

// reload will kill the sleep and only run the command on the last edit
entr -e "(node_module|git)" -i '^(?!.*node_modules).*\.ts$' -r . 'sleep 2 && echo "change"'
```

``` javascript
const Entr = require('entr.cli');

new Entr({
	cwd: path.resolve('./index.js'), // file/dir to watch
	exec: ['cat', 'index.js'], // command to run
	reload: false, // should it track and kill last process
	postpone: false, // should it run on start
	exclude: null, // regex to exclude files to watch
	include: null, // regex to include files to watch
	eval: false // run exec in 'sh -c "cat index.js"'
});
```