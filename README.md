
### `Intro`
Run a command when a file/directory is changed

#### `Install`
``` bash
npm install --save git+https://github.com/anzerr/entr.cli.git
npm install --save @anzerr/entr.cli
```

``` bash
git clone git+https://git@github.com/anzerr/entr.cli.git &&
cd entr.cli &&
npm link
```

### `Example`

``` bash
entr -r index.js ls -la .
entr -p package.json npm i
entr -p package.json sh -c "rm -f package-lock.json && npm i"
```

``` javascript
const Entr = require('entr.cli');

new Entr({
	cwd: path.resolve('./index.js'), // file/dir to watch
	exec: ['cat', 'index.js'], // command to run
	reload: false, // should it track and kill last process
	postpone: false, // should it run on start
	exclude: null // regex to exclude files to watch
});
```