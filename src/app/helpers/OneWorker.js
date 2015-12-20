/**
 * @class OneWorker
 * @example
 * import OneWorker from 'OneWorker';
 * import TestWorker from 'worker?inline!../workers/test.js';
 * const testWorker = new OneWorker(TestWorker);
 * testWorker.exec({obj: 'some message'}, function (e) {
 *   console.log('Main Thread: onmessage', Date.now(), e);
 *   testWorker.terminate();
 * }, function (err) {
 *   console.error('Main Thread: onerror', Date.now(), err);
 * });
 */
export default class OneWorker {
  constructor(CustomWorker) {
    this._worker = null;
    this._customWorker = CustomWorker;
  }
  terminate() {
    if (this._worker) {
      this._worker.terminate();
      this._worker = null;
    }
  }
  exec(postData, onMessage, onError) {
    this.terminate();
    this._worker = new this._customWorker();
    if (typeof onMessage === 'function') {
      this._worker.onmessage = function (e) {
        onMessage(e, this);
      };
    }
    if (typeof onError === 'function') {
      this._worker.onerror = function (e) {
        onError(e, this);
      };
    }
    this._worker.postMessage(postData);
  }
}
