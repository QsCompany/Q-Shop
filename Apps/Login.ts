import { basic, thread, thread as th, reflection, Common, ScopicCommand, bind, Api, net, encoding, Notification, collection } from "../lib/Q/sys/Corelib"
import {  AI } from '../lib/q/sys/AI';
import { db } from '../lib/q/sys/db';
import { UI } from '../lib/q/sys/UI';
import { Controller, sdata } from '../lib/q/sys/System';
import { models } from "../abstract/Models";
//import { GetVars } from '../Desktop/Common';
//import { InitModule } from '../Desktop/Common';
//import { basics } from './extra/Basics';
import { eServices } from '../abstract/Services';
import { defs } from '../lib/q/sys/defs';
import { InitModule, GetVars } from "../abstract/extra/Common";
import { basics } from "../abstract/extra/Basics";
import { Components } from "../lib/q/sys/Components";
var key;

__global.ApiServer = new System.basics.Url(envirenment.isChromeApp  ? 'http://127.0.0.1/': location.origin);
var onSigninStatChanged = new bind.EventListener<(v: boolean) => void>(key = Math.random() * 2099837662);
var GData: basics.vars;
GetVars((v) => { GData = v; return !true; });
declare var __LOCALSAVE__;
export namespace Apps {

    interface CSVParserParam<T> {
        name: string;
        csvIndex: number;
        prop: bind.DProperty<any, T>
    }

    export class AuthentificationApp extends UI.AuthApp {
        public get RedirectApp() { return this.redirectApp; }
        public set RedirectApp(v) { }
        private _signupPage: UI.Page;
        private _loginPage: UI.Page;
        private user: models.Login;

        constructor(private redirectApp: defs.UI.IApp) {
            super(key,onSigninStatChanged);
            window['auth'] = this;
            GData.user.OnMessage(
                (s: bind.PropBinding, ev: bind.EventArgs<boolean, models.Login>) => onSigninStatChanged.Invoke(key, [ev._new]));
            onSigninStatChanged.On = (v) => {
                if (v)
                    AuthentificationApp.Download();
                else this.fullInitialize();
                this.OnStatStatChanged.PInvok(key, [this, v]);
            };
        }
        public IsLogged<T>(callback: (v: boolean, param: T) => void, param: T) {
            callback(GData.user.IsLogged, param);
        }

        private createSignupPage() {
            var p = new UI.Page(this, 'Signup', 'Signup');
            p.OnInitialized = p => p.Add(new UI.TControl('Client.signup', GData.user));
            this.AddPage(this._signupPage = p);
        }
        private createLoginPage() {
            var p = new UI.Page(this, 'Login', 'Login');
            p.OnInitialized = p => p.Add(new UI.TControl('Client.login', GData.user));
            this.AddPage(this._loginPage = p);
        }

        private auth = thread.Dispatcher.cretaeJob(this.Login, [], this, true);
        private autoAuth = thread.Dispatcher.cretaeJob(this._AutoLogin, [], this, true);
        private AutoLogin() {
            var ident =basic.Settings.get("Identification");
            GData.user.Identification = ident;
            thread.Dispatcher.Push(this.autoAuth);
        }

        private Login() {
            var isl = GData.user.IsLogged;
            Api.RiseApi("Auth", {
                callback: (c, p) => {
                    if (!p || !GData.user.IsLogged) this.fullInitialize();
                    this.OnStatStatChanged.PInvok(key, [this, p]);
                }, data: this
            });
        }
        private _AutoLogin() {
            var isl = GData.user.IsLogged;
            Api.RiseApi("autoAuth", {
                callback: (c, p) => {
                    if (!p || !GData.user.IsLogged) this.fullInitialize();
                    this.OnStatStatChanged.PInvok(key, [this, p]);
                }, data: this
            });
        }
        private static dx;
        public static Download() {
            Notification.fire('ReLoadUserSetting', [models.UserSetting.Default]);
            if (this.dx) {
                GData.spin.Pause(); return;
            }


            this.dx = true;
            GData.__data.Clear();            
            Api.RiseApi('log', { callback: null, data: null });
            GData.requester.Push(models.IsAdmin, new models.IsAdmin(), null, (s, r, iss) => {
                GData.spin.Start("Wait a moment");
                GData.requester.Push(models.Categories, GData.__data.Categories, null, (d, r) => { GData.spin.Message = "Categories"; GData.spin.Start("Wait a moment"); });
                if (typeof __LOCALSAVE__ !== 'undefined')
                    GData.db.Get('Products').table.LoadTableFromDB(GData.__data.Products, () => {
                        GData.apis.Product.SmartUpdate(new Date(GData.db.Get('Products').info.LastUpdate || 0));
                    });
                else {

                    GData.requester.Request(models.Products, "GETCSV", null, null, (pd, json, iss, req) => {
                        GData.__data.Products.FromCsv(req.Response);
                    });
                    //GData.requester.Push(models.Products, GData.__data.Products, null, (d, r) => { GData.spin.Message = "Products"; });
                }
                GData.requester.Push(models.Costumers, GData.__data.Costumers, null, (d, r) => { GData.spin.Message = "Costumers"; });
                if (iss) GData.requester.Push(models.Agents, GData.__data.Agents, null, (d, r) => { GData.spin.Message = "Agents"; });

                GData.requester.Push(models.IsAdmin, new models.IsAdmin(), null, (s, r, iss) => {
                    GData.spin.Pause();
                    Api.RiseApi('log', { callback: null, data: null });
                });

            });
        }

        public initialize() {
            GData.requester.Request(models.IsSecured, "GET", undefined, undefined, (a, b, c) => { 
                __global.https = b as any;
                this.AutoLogin();
            });
        }

        private fullInitialize() {
            if (this.finit) return;
            if (this.IsInit) this._initialize();
            else this.OnInitialized = t => t._initialize();
        }

        private _initialize() {
            super.initialize();
            this.finit = true;
            this.createLoginPage();
            this.createSignupPage();
            initJobs.call(this);
            this.SelectedPage = this._loginPage;
        }

        private finit: boolean;

        public Signout() {
        }

        Logout() {
            logout((islogout) => {
                if (islogout) {

                } else {

                }
            });
        }

        OnAttached() {
            if (!this.isf) return this.isf = true;
            this.fullInitialize();
        }
        isf;
        OnDetached() {
        }
        
    }    
}


function initJobs() {

    bind.Register(new bind.Job('openlogin', null, null, null, (ji, e) => {
        var dm = ji.dom;
        dm.addEventListener('click', () => this.Open(this._loginPage))
    }, null));
    
    bind.Register(new bind.Job('login', null, null, null, (ji, e) => {
        if (!GData.user.Client) GData.user.Client = new models.Client(0);
        ji.dom.addEventListener('click', (() => { GData.spin.Start('login'); this.Login(); }).bind(ji))
    }, null));

    bind.Register(new bind.Job('opensignup', undefined, undefined, undefined, (ji, e) => {
        var dm = ji.dom;
        if (!GData.user.Client) GData.user.Client = new models.Client(0);
        dm.addEventListener('click', () => {
            this.Open(this._signupPage);
        })
    }, null));

    bind.Register(new bind.Job('signup', () => {

    }, null, null, (ji, e) => {
        ji.addEventListener('click', 'click', (() => {
            var t = ji.Scop;
            var v = t.Value as models.Login;
            v.ReGenerateEncPwd("eval(code)", v.Pwd);
            GData.requester.Post(models.Signup, t.Value, null, (callback, p, iss) => {
                if (iss)
                    var m = UI.Modal.ShowDialog('Signup', 'The Signup was successfully created .Please Send a message with your code to activate the account');
                else {
                }
            });
        }).bind(ji));
    }, null));

    bind.Register(new bind.Job('loggedjob', (ji) => {
        var b = ji.Scop.Value as boolean;
        var dm = ji.dom as HTMLElement;
        if (b)
            dm.innerText = 'YOU ARE LOGGED';
        else {
            dm.innerText = 'YOU ARE NOT LOGGED';
        }
    }, null, null, (j, e) => { }, null));
}

Api.RegisterApiCallback({
    Name: "ReAuth", DoApiCallback: function (a, b, c) {
        GData.spin.Start("Authenticating");
        GData.user.Stat = 0;
        GData.requester.Push(models.Login, GData.user, null, function (callback, s, iss) {
            GData.spin.Pause();
            if (iss) {
                var login = callback.data as models.Login;
                if (login.IsLogged) {
                   basic.Settings.set("Identification", login.Identification);
                    c.callback && c.callback(c, true);
                    return;
                }
                UI.InfoArea.push('<p class="text-center">Please Check Your <B>Password</B> AND <B>UserName</B></p>', false, 4000);
            } else
                UI.InfoArea.push('There no connection to server', false);
            this.OnInitialized = (t) => t.fullInitialize();
            c.callback && c.callback(c, false);
        });
    }, Owner: this
});
Api.RegisterApiCallback({
    Name: "Auth", DoApiCallback: function (a, b, c) {
        GData.user.Stat = 0;
        function callback1(callback, s, iss) {
            GData.spin.Pause();
            if (iss) {
                var login = callback.data as models.Login;
                if (login.IsLogged) {
                    saveLoginData(login);
                    c.callback && c.callback(c, true);
                    return;
                }
                UI.InfoArea.push('<p class="text-center">Please Check Your <B>Password</B> AND <B>UserName</B></p>', false, 4000);
            } else
                UI.InfoArea.push('Error de connecter a server', false);
            c.callback && c.callback(c, false);
        }
        GData.requester.Push(models.Login, GData.user, null, callback1);
    }, Owner: this
});
function saveLoginData(login: models.Login) {
    basic.Settings.set("Identification", login.Identification);
    basic.Settings.set("LoginID", login.Id);
}
function loadLoginData(login: models.Login, alsoID: boolean) {
    login.Identification = basic.Settings.get("Identification");
    if (alsoID)
        login.Id = basic.Settings.get("LoginID") || login.Id;
}

Api.RegisterApiCallback({
    Name: "autoAuth", DoApiCallback: function (a, b, c) {
        GData.user.Stat = 0;
        function callback1(callback, s, iss) {
            GData.spin.Pause();
            if (iss) {
                var login = callback.data as models.Login;
                if (login.IsLogged) {
                    basic.Settings.set("Identification", login.Identification);
                    c.callback && c.callback(c, true);
                    return;
                }
                UI.InfoArea.push('<p class="text-center">Please Check Your <B>Password</B> AND <B>UserName</B></p>', false, 4000);
            } else
                UI.InfoArea.push('Error de connecter a server', false);
            c.callback && c.callback(c, false);
        }

        GData.requester.Costume({ Method: 0, Url: '~checklogging' }, undefined, undefined, (e, rslt, succ, req) => {
            if (rslt === true) {
                GData.spin.Pause();
                GData.user.FromJson({ CheckLogging: true }, encoding.SerializationContext.GlobalContext, true);                
                return;
            }
            loadLoginData(GData.user, true);
            GData.requester.Request(models.Login, "AutoLogin", GData.user, GData.user as any,
                (callback, s, iss) => {
                    if (iss) {
                        var login = callback.data as models.Login;
                        if (login.IsLogged) {
                            GData.spin.Pause();
                            saveLoginData(login);
                            c.callback && c.callback(c, true);
                            return;
                        }
                    }

                    GData.requester.Push(models.Login, GData.user, null, callback1);
                });
        }, undefined);
    }, Owner: this
});

function logout(callback:(isLogout:boolean)=>void) {
    GData.requester.Get(models.Login, GData.user, null, function(s, r: any, iss) {
        if (!iss) {
            callback(null);
        } else
            if (!GData.user.IsLogged) {
               basic.Settings.set("Identification", "");
                GData.user.Identification = undefined;
                GData.user.Username = undefined;
                GData.user.Pwd = undefined;
                document.cookie = "id=;";
                callback && callback(true);
            } else {
                //UI.Modal.ShowDialog("Signout failled !!!!", "Some thing happened when logout this session please contact the administrator if site", undefined, "Retry", "Cancel");
                callback && callback(false);
            }
    }, function(r, t) {
        r.Url = "/~Signout";
    });
}

var lr;
declare type callback<T> = (thred: number, param: T) => void;
function myfunction<T>(onConnected: callback<T>, onSignOut: callback<T>, onConnectionLost: callback<T>, param: T) {
    var intThread;
    var c = new XMLHttpRequest();
    var self = this;
    c.onreadystatechange = function() {
        if (this.readyState == 4)
            if (this.status == 200 && this.responseText == "true")
                if (this.responseText == "true")
                    return onConnected(intThread, param);
                else if (this.responseText == "false")
                    return onSignOut(intThread, param);
                else throw "Uknow stat";
            else
                onConnectionLost(intThread, param);
    };
    
    c.onerror = function() {
        onConnectionLost(intThread, param);
    };
    intThread = setInterval(() => {
        c.open('get', __global.GetApiAddress('/~CheckLogging'));
        c.setRequestHeader('Access-Control-Allow-Origin', 'true');
        try { c.send(); c.timeout = 10000; } catch (e) { }
    }, 12000);
}
myfunction(
    (t, p) => { },
    (t, p) => { UI.Desktop.Current.OpenSignin(); },
    (t, p) => { UI.Desktop.Current.OpenSignin(); },
    this);