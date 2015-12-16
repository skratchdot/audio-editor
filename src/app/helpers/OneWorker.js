/**
 * @class OneWorker
 * @example
 * import OneWorker from 'OneWorker';
 * import TestWorker from 'worker?inline!../workers/test.js';
 * const testWorker = new OneWorker(TestWorker);
 * testWorker.exec({obj: 'some message'}, function (e) {
 *   console.log('Main Thread: onmessage', Date.now(), e);
 *   testWorker.kill();
 * }, function (err) {
 *   console.error('Main Thread: onerror', Date.now(), err);
 * });
 */
export default class OneWorker {
  constructor(CustomWorker) {
    this._worker = null;
    this._customWorker = CustomWorker;
  }
  kill() {
    if (this._worker) {
      this._worker.terminate();
      this._worker = null;
    }
  }
  exec(postData, onMessage, onError) {
    this.kill();
    this._worker = new this._customWorker();
    if (typeof onMessage === 'function') {
      this._worker.onmessage = onMessage;
    }
    if (typeof onError === 'function') {
      this._worker.onerror = onError;
    }
    this._worker.postMessage(postData);
  }
}
