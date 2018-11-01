
import { basic, thread, thread as th, reflection, Common, ScopicCommand, bind, Api, net, encoding, Notification, collection } from "../lib/Q/sys/Corelib"
import { UI } from '../lib/q/sys/UI';
import { Controller, sdata } from '../lib/q/sys/System';
import { models } from "../abstract/Models";
import { GetVars, funcs } from './../abstract/extra/Common';
import {Admin} from './AdminPage';
import { Pages } from './Pages';
import { Apis } from '../abstract/QShopApis';
import { InitModule } from './../abstract/extra/Common';
import { basics } from './../abstract/extra/Basics';
import { eServices } from '../abstract/Services';
import { context } from 'context';
import { Apps as lapps } from '../Apps/Login';

//import { Material } from '../lib/q/components/QUI/script';
import { defs } from '../lib/q/sys/defs';
import { db } from "../lib/Q/sys/db";
import { ShopApis } from "../abstract/extra/ShopApis";
import { Components } from "../lib/q/sys/Components";

var GData: basics.vars;
Apis.Load();
InitModule();
//var x = new XMLHttp_Request();



GetVars((v) => { GData = v; return !true; });

 namespace Apps {
     export class QShop extends UI.App {
         Search: Pages.SearchPage;
         //Facture: Pages.FacturePage;
         //Factures: Pages.FacturesPage;
         constructor() {
             super('QShop');
             Api.RegisterApiCallback({
                 Name: "Settings", DoApiCallback: (a, b, c) => {
                     UI.Modal.ShowDialog("Settings", 'Do you want realy to make backup to this Shop', (e) => {
                         { }
                         if (e.Result == UI.MessageResult.ok) {
                             GData.requester.Request(Window, "START");
                             setTimeout(() => {
                                 GData.requester.Request(Window, "BACKUP");
                                 setTimeout(() => { c.callback && c.callback(c, this); }, 6000);
                             }, 5000);
                         }
                         else c.callback && c.callback(c, this);
                     }, "Backup", "Cancel");
                 }
             });
             if (!envirenment.isChromeApp)
                 window.addEventListener('beforeunload', window.onbeforeunload = (e) => {
                     return "Merci de ne pas quitter la page!";
                 }, { capture: true, passive: true });
         }

         isReq;
         
         Update() {            
             this.SelectedPage.Update();

         }

         initialize() {
             super.initialize();
             this.Add(this.Search = new Pages.SearchPage(this));
             //this.Add(this.Facture = new Pages.FacturePage(this));
             //this.Add(this.Factures = new Pages.FacturesPage(this));
             this.Head.Header.Brand.addEventListener('click', (s, e, p) => {
                 Api.RiseApi("ReAuth", {
                     callback: (p, arg) => {
                         {
                         }
                     }, data: this
                 });
             }, this);

             var adminPage: Admin.AdminPage;
             GData.user.OnMessage((s, e) => {
                 isLogged(e._new);
             });
             if (GData.user.IsLogged)
                 isLogged(true);
             else isLogged(false);
             var t = this;
             var thread;
             var self = this;
             
             function isLogged(value: boolean) {
                 if (value) {
                     if (Admin && Admin.AdminPage) {
                         GData.requester.Push(models.IsAdmin, new models.IsAdmin(), null, (s, r, iss) => {
                             var page = basic.Settings.get('selectedPage');
                             var toSelect: UI.Page;
                             if (iss) {
                                 if (!adminPage) {
                                     t.Add(adminPage = new Admin.AdminPage(t)); toSelect = adminPage;
                                     toSelect = adminPage;
                                 }

                             } else {
                                 if (adminPage != null) {
                                     t.Remove(adminPage);
                                 }
                             }
                             if (!self.OpenPage(page))
                                 self.SelectedPage = toSelect;
                         });
                     } else {

                     }
                 } else clearInterval(thread);
             }
             this.OnPropertyChanged(UI.Layout.DPSelectedPage, (v, e) => {
                 if (e._new)
                    basic.Settings.set('selectedPage', e._new.Name);
             });
             
             Notification.on("UserSetting.selectedPageChanged", {
                 callback(this: QShop, e, a: models.UserSetting, dp: bind.EventArgs<string, models.UserSetting>) {
                     this.OpenPage(dp._new);
                 }, owner: this
             });
             Window['Ntf'] = Notification;
         }
     }
}

export namespace Init {
    export function Main(desk: UI.Desktop) {
        
        var qshop = new Apps.QShop();
        var auth = new lapps.AuthentificationApp(qshop);
        desk.Add(auth);
        desk.Add(qshop);
        thread.Dispatcher.call(auth, qshop.Show);
        //ini();
    }
}
declare var __LOCALSAVE__;

module updateServiceCallback {
    eServices.registerUpdater(<any>{
        ops: <db.IOperation[]>[],
        Name: 'products',
        del(id) {
            var p = models.Product.getById(id) || GData.__data.Products.GetById(id);
            models.Product.pStore.Remove(id);
            if (p) {
                GData.__data.Products.Remove(p);
                if (typeof __LOCALSAVE__ !== 'undefined')
                    this.ops.push(<db.IOperation>{ op: db.Operation.Delete, row: p });
            }
        },
        edit(id, json, c) {
            var p = models.Product.getById(id) || GData.__data.Products.GetById(id);
            if (p) {
                p.Stat = sdata.DataStat.Updating;
                p.FromJson(json, encoding.SerializationContext.GlobalContext, true);
                p.Stat = sdata.DataStat.Updated;
                if (typeof __LOCALSAVE__ !== 'undefined')
                    this.ops.push(<db.IOperation>{ op: db.Operation.Update, row: p });
            } else {
                p = new models.Product(id);
                p.FromJson(json, c);
                GData.__data.Products.Add(p);
                if (typeof __LOCALSAVE__ !== 'undefined')
                    this.ops.push(<db.IOperation>{ op: db.Operation.Insert, row: p });
            }
        },
        onfinish(json) {
            if (typeof __LOCALSAVE__ !== 'undefined') {
                GData.db.Get('Products').table.ExecuteOperations(this.ops, (scc, nfails) => {

                    if (scc) {
                        GData.db.MakeUpdate('Products', this.date);
                    }
                });
            }
        }, onstart(json) {
            this.date = json && json.date && new Date(json.date) || new Date(0);
        }, add(id, json) {

        }
    });

    export class updater<T extends sdata.DataRow> implements eServices.TableUpdator {
        constructor(private table: sdata.DataTable<T>, public Name: string) {
        }
        del(id: number) {
            var d = sdata.DataRow.getById(id, this.table.ArgType) || this.table.GetById(id);
            if (d) {
                this.table.Remove(d as any);
                d.Dispose();
            }
        }
        edit(id: number, json: any, context: encoding.SerializationContext) {
            var d = sdata.DataRow.getById(id, this.table.ArgType) || this.table.GetById(id);
            if (d) {
                d.Stat = sdata.DataStat.Updating;
                d.FromJson(json, context, true);
                d.Stat = sdata.DataStat.Updated;
            } else {
                d = this.table.CreateNewItem(id);
                d.FromJson(json, context, false);
                this.table.Add(d as any);

            }
        }
    }

    //eServices.registerUpdater(new updater(GData.__data.Articles, 'articles'));
    eServices.registerUpdater(new updater(GData.__data.Costumers, 'clients'));
    eServices.registerUpdater(new updater(GData.__data.Agents, 'agents'));
    eServices.registerUpdater(new updater(GData.__data.Factures, 'factures'));
    eServices.registerUpdater(new updater(GData.__data.SFactures, 'sfactures'));
    eServices.registerUpdater(new updater(GData.__data.Categories, 'categories'));
    eServices.registerUpdater(new updater(GData.__data.Fournisseurs, 'fournisseurs'));
}
Api.RegisterApiCallback({
    Name: "log", DoApiCallback: function (a) {
        var t = document.location.pathname;
        if (t.lastIndexOf('/') != t.length - 1) t += "/";
        console.log("%c" + "", `color:White; background:url('${document.location.origin + t}_/Picture/logo');`);
    }
});

function initApis() {
    var sapi = new ShopApis();
    sapi.Init(GData);
    GData.requester.Get(basic.iGuid, [], null, (s, r, iss) => { });
    GData.requester.Get(basic.SessionId, {}, null, (s, r, iss) => { basic.SessionId.parse(r as any as string); });
    Api.RegisterTrigger({
        Name: 'AddPrice',
        Filter(x, params) {
            //if (params instanceof models.FakePrice)
            //    GData.__data.Prices.Add(params);
            //else if (params instanceof Array)
            //    GData.__data.Prices.AddRange(params);
            return false;
        },
        CheckAccess: (o) => true,
        Params: null
    });
    Api.RegisterApiCallback({ DoApiCallback(x, p) { return true }, Name: 'AddPrice' });
    Api.RegisterApiCallback({ DoApiCallback(x, p) { return true }, Name: 'RemovePrice' });
    Api.RegisterTrigger({
        Name: 'RemovePrice',
        Filter(x, params) {
            //if (params instanceof models.FakePrice)
            //    GData.__data.Prices.Remove(params);
            return false;
        },
        CheckAccess: (o) => true,
        Params: null
    });
}

initApis();