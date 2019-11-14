
const Watcher = require('fs.watcher'),
	{spawn} = require('child_process');

const safe = (cd) => {
	try {
		cd();
	} catch(e) {
		// skip
	}
};

class Entr {

	constructor(options) {
		this._options = options;
		this._include = (this._options.include) ? new RegExp(this._options.include) : null;
		this._exclude = (this._options.exclude) ? new RegExp(this._options.exclude) : null;
		this._lock = false;
		this._watch = new Watcher(this._options.cwd, (this._include || this._exclude) ? (p) => {
			return this.exclude(p);
		} : null).on('change', (r) => {
			if (r[0] === 'change' && !r[1]) {
				if (!this._lock) {
					this._lock = true;
					this.run().then(() => (this._lock = false));
				}
			}
		});
		if (!this._options.postpone) {
			this.run();
		}
	}

	exclude(p) {
		if (this._include) {
			if (p.match(this._include)) {
				return true;
			}
		}
		return this._exclude ? !p.match(this._exclude) : true;
	}

	run() {
		let p = (this._options.reload) ? this.kill() : Promise.resolve();
		return p.then(() => {
			if (this._options.eval) {
				console.log(this._options.exec.join(' '));
				this._p = spawn('sh', ['-c', this._options.exec.join(' ')]);
			} else {
				let [, ...args] = this._options.exec;
				this._p = spawn(this._options.exec[0], args);
			}
			this._p.stdout.pipe(process.stdout);
			this._p.stderr.pipe(process.stderr);
			this._p.once('close', () => (this._p = null));
		});
	}

	kill() {
		if (this._p) {
			return new Promise((resolve) => {
				safe(() => process.kill(this._p.pid, 'SIGKILL'));
				safe(() => this._p.stdin.pause());
				safe(() => this._p.kill('SIGKILL'));
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
