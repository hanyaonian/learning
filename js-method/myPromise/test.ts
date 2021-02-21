import myPromise from './index'
import * as promiseTest from 'promises-aplus-tests'

const adapter = {
	deferred: () => {
		let resolve;
		let reject;
		const promise = new myPromise((res, rej) => { resolve = res; reject = rej; });
		return {
			promise,
			reject,
			resolve,
		};
	},
	rejected: (reason) => myPromise.reject(reason),
	resolved: (value) => myPromise.resolve(value),
}

promiseTest(adapter, function (err) {
    // All done; output is in the console. Or check `err` for number of failures.
	console.log(err);
});