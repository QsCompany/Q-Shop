var isWorker = typeof importScripts === 'function' && !(typeof window !== 'undefined' && window instanceof Window);
if (typeof exports === 'undefined')
    exports = {};
var Workers;
(function (Workers) {
    var WebWorker;
    (function (WebWorker) {
        var _handlers = {};
        function registerHandler(name, handler) {
            if (!name)
                return false;
            if (name.indexOf('__') === 0 && name.lastIndexOf('__') === name.length - 2)
                return false;
            if (!handler)
                return false;
            _handlers[name] = handler;
            return true;
        }
        WebWorker.registerHandler = registerHandler;
        function getHandler(name) {
            if (name.indexOf('__') === 0 && name.lastIndexOf('__') === name.length - 2)
                return false;
            return _handlers[name];
        }
        WebWorker.getHandler = getHandler;
        function unregisterHandler(name) {
            if (!name)
                return false;
            if (name.indexOf('__') === 0 && name.lastIndexOf('__') === name.length - 2)
                return false;
            return delete _handlers[name];
        }
        WebWorker.unregisterHandler = unregisterHandler;
        var _private = false;
        var Server = /** @class */ (function () {
            function Server() {
                this.onPostMessageError = function (e, data) {
                    this.postMessage({ Id: data.Id, IsError: true, Data: "UnExpectedError", keepAlive: false });
                }.bind(this);
                this.Start();
            }
            Server.prototype.Start = function () {
                self.postMessage;
                this._worker = self; //as any as Worker;
                this._worker.addEventListener('error', this._onerror.bind(this), { capture: true });
                this._worker.addEventListener('message', this._onmessage.bind(this), { capture: true });
            };
            Server.prototype._onerror = function (e) {
            };
            Server.prototype._onmessage = function (e) {
                var data = e.data;
                var handler = _handlers[data.Handler];
                var event = { e: e, Msg: data, Result: undefined, Handled: false, Thread: this };
                var rslt = tryCatch(handler, this._onHandlerError, [event], this);
                if (event.Handled)
                    return;
                this.postMessage({ Id: data.Id, Data: event.Result || rslt, keepAlive: event.keepAlive }, e.origin, e.ports, e.ports.slice());
            };
            Server.prototype._onHandlerError = function (e, v) {
                v.Error = true;
                v.Handled = true;
                this.postMessage({ Id: v.Msg.Id, IsError: true, Data: e, keepAlive: false });
            };
            Server.prototype.postMessage = function (data, targetOrigin, transfers, ports) {
                if (!ports || ports.length == 0) {
                    var p = isWorker ? [data, transfers] : [data, !targetOrigin ? void 0 : targetOrigin, transfers];
                    tryCatch(this._worker.postMessage, this.onPostMessageError, p, this._worker);
                }
                else {
                    p = [data];
                    for (var i = 0; i < ports.length; i++)
                        tryCatch(ports[i].postMessage, this.onPostMessageError, p, ports[i]);
                }
            };
            Server.prototype.postMessageToSW = function (data) {
                return new Promise(function (s, r) {
                    var msg_chan = new MessageChannel();
                    //navigator.serviceWorker.ready.then((a) => {
                    navigator.serviceWorker.controller.postMessage(data, [msg_chan.port2]);
                    msg_chan.port1.onmessage = function (e) {
                        var dt = e.data;
                        (dt.IsError ? r : s)(data, dt);
                    };
                });
            };
            Server.init = (function () {
                function registerHandler(name, handler) {
                    _handlers[name] = handler;
                }
                registerHandler('getValue', function (e) { return self[e.Msg.Data]; });
                registerHandler('__close__', function (e) {
                    if (isWorker)
                        self.close(); return isWorker;
                });
                registerHandler('__loadScripts__', function (e) { importScripts(e.Msg.Data); });
                registerHandler('__hasHandler__', function (e) { return _handlers[e.Msg.Handler] instanceof Function; });
            })();
            Server.Default = new Server();
            return Server;
        }());
        WebWorker.Server = Server;
        var Client = /** @class */ (function () {
            function Client(_url) {
                this._url = _url;
                this._quee = {};
                this.Start();
            }
            Client.prototype.Start = function () {
                this._worker = new Worker(this._url);
                this._worker.addEventListener('error', this._onerror.bind(this), { capture: true });
                this._worker.addEventListener('message', this._onmessage.bind(this), { capture: true });
            };
            Client.prototype.Send = function (packet) {
                var id = performance.now();
                packet.Id = id;
                this._quee[id] = packet;
                this._worker.postMessage({ Id: id, Data: packet.data, Handler: packet.handler });
            };
            Client.prototype._onmessage = function (e) {
                var data = e.data;
                var q = this._quee[data.Id];
                if (!q)
                    return;
                tryCatch(q.callback, undefined, [q, data], q);
                if (!data.keepAlive)
                    delete this._quee[data.Id];
            };
            Client.prototype._onerror = function (e) {
            };
            Client.counter = 0;
            return Client;
        }());
        WebWorker.Client = Client;
        function tryCatch(_try, _catch, params, owner) {
            try {
                return _try && _try.apply(owner, params);
            }
            catch (e) {
                (params = params.slice()).unshift(e);
                return _catch && _catch.apply(owner, params);
            }
        }
    })(WebWorker = Workers.WebWorker || (Workers.WebWorker = {}));
    var Service;
    (function (Service) {
        var Client = /** @class */ (function () {
            function Client(_url, scope) {
                this._promise = navigator.serviceWorker.register(_url, scope ? { scope: scope } : void 0);
                this._promise.then(function (a) {
                }).catch(function (a) {
                });
            }
            return Client;
        }());
        Service.Client = Client;
        //new Client('/Workers/requestHandler.js');
    })(Service = Workers.Service || (Workers.Service = {}));
})(Workers = exports.Workers || (exports.Workers = {}));
var Server = Workers.WebWorker.Server.Default;