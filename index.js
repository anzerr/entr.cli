
const Watcher = require('fs.watcher'),
	{spawn} = require('child_process');

class Entr {

	constructor(options) {
		this._options = options;
		let reg = (this._options.exclude) ? new RegExp(this._options.exclude) : null;
		this._watch = new Watcher(this._options.cwd, reg ? (p) => p.match(reg) : null).on('change', (r) => {
			if (r[0] === 'change' && !r[1]) {
				this.run();
			}
		});
		if (!this._options.postpone) {
			this.run();
		}
	}

	run() {
		let p = (this._options.reload) ? this.kill() : Promise.resolve();
		p.then(() => {
			let [, ...args] = this._options.exec;
			this._p = spawn(this._options.exec[0], args);
			this._p.stdout.pipe(process.stdout);
			this._p.stderr.pipe(process.stderr);
			this._p.once('close', () => (this._p = null));
		});
	}

	kill() {
		if (this._p) {
			return new Promise((resolve) => {
				process.kill(this._p.pid, 'SIGKILL');
				this._p.stdin.pause();
				this._p.kill('SIGKILL');
				this._p.once('close', () => {
					this._p = null;
					resolve();
				});
			});
		}
		return Promise.resolve();
	}

	stop() {
		return Promise.all([this._watch.stop(), this.kill()]);
	}

}

module.exports = Entr;
