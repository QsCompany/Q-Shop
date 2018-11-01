import { UI, conv2template } from '../lib/q/sys/UI';
import { mvc, utils, basic, Api, thread, encoding, net, bind, reflection, collection, UIDispatcher } from '../lib/q/sys/Corelib';
import { models} from "../abstract/Models";
import {LoadJobs} from './Jobs';
import { AdminNavs } from './Admin/ListOfFactures';
import { Clients } from './Admin/Costumers';
import {Fournisseurs  } from './Admin/Fournisseurs';
import { FactureAchat, FactureVent } from './Admin/Facture';
import {RegularUsers, UnRegularUsers  } from './Admin/Logins';
import { ProductsNav/*, ProformarAchatNav*/  } from './Admin/Products';
import { FactureNav } from './Admin/FacturesNonValider';
import { CategoryNav } from './Admin/Categories';
import {EtatBases, Etats } from './Admin/Revages';
import {Agents, StatisticsPanel  } from './Admin/Agents';


import { Forms } from '../Componenets/Forms';
import { views } from './Admin/Command';
//import { Agent } from './Admin/Apis/Agent';
import { funcs, GetVars } from '../abstract/extra/Common';
import { basics } from '../abstract/extra/Basics';
import { Agent } from '../abstract/Apis/Agent';
import { SMSPage, FilePage } from './SMS';
LoadJobs();
var userAbonment = bind.NamedScop.Get('UserAbonment');
var GData:basics. vars;
GetVars((v) => { GData = v; return false; });
export namespace Admin {
    
    export class AdminPage extends UI.NavPage {
        
        constructor(app: UI.App) {
            super(app, 'Administration', 'Administration');
        }        
        private factures: UI.UniTabControl<models.Facture>;
        private factureHistory = new FactureHistory();
        private sfactureHistory = new SFactureHistory();
        private ca = this.sfactureHistory;
        private cv = this.factureHistory;
        public initialize() {
            super.initialize();
            this.Caption = "";
            this.app.HideTopNavBar(true);
            UI.Desktop.Current.KeyCombiner.On('O', 'T', function (this: AdminPage, s, e) {
                this.app.HideTopNavBar(!this.app.IsTopNavBarhidden());
            }, void 0, this);
            UI.Desktop.Current.KeyCombiner.On('O', 'S', function (this: AdminPage, s, e) {
                if (this.initStat) return;
                this.initStat = true;
                this.SetSeparator();
                this.SetPanel(new RegularUsers());
                this.SetPanel(new UnRegularUsers());
                this.SetSeparator();

                this.SetPanel(new Agents());
                this.SetSeparator();
            }, void 0, this);

            this.createPanel(new AdminNavs.FacturesLivraison(), 'CJ')
                .createPanel(this.factureHistory.Control, 'CB')
                .createPanel(new Clients(), 'CL')
                .createPanel(new Etats(false), 'CE')
                .createPanel()
                .createPanel(new AdminNavs.FacturesReciption(), 'FJ')
                .createPanel(this.sfactureHistory.Control, 'FB')
                .createPanel(new Fournisseurs(), 'FL')
                .createPanel(new Etats(true), 'FE')
                .createPanel()
                .createPanel(new ProductsNav(), 'SP')
                .createPanel(new CategoryNav(), 'SC')
                .createPanel(new views.Command(), 'SM')
                .createPanel()
                .createPanel(new StatisticsPanel())
                .createPanel(new SMSPage())
                .createPanel(new FilePage());

                //.createPanel().createPanel(new ProformarAchatNav());
            
            bind.Register({
                Name: 'openafacture', OnInitialize: (j, e) => {
                    j.addEventListener('dblclick', 'dblclick', (e) => {
                        var f = j.Scop.Value as models.Facture;
                        this.cv.Open(f);
                        this.factureHistory.Show(f);
                        this.Select(this.factureHistory.Control.Name);// 'facture_vent');
                    });
                }
            });

            bind.Register({
                Name: 'openasfacture', OnInitialize: (j, e) => {
                    j.addEventListener('dblclick', 'dblclick', (e) => {
                        var f = j.Scop.Value as models.SFacture;
                        this.ca.Open(f);
                        this.Select('facture_achat');
                    });
                }
            });
            this.initAchatCmd();
            this.initVentsCmd();

            this.initVersmentCmd();
            this.initSVersmentCmd();

        }
        createPanel(n?: UI.NavPanel | undefined, shortcut?: string) {
            if (n == undefined) this.SetSeparator();
            else {
                if (shortcut && shortcut.length == 2) {
                    shortcut = shortcut.toUpperCase();
                    UI.Desktop.Current.KeyCombiner.On(shortcut[0], shortcut[1], this._select, this, n);
                    n.ToolTip = `CTRL+${shortcut[0]}, CTRL+${shortcut[1]}`;
                }
                this.SetPanel(n);
            }
            return this;
        }
        _select(owner: UI.keyCominerEvent, e: UI.IKeyCombinerTarget) {
            owner.Cancel = true;
            (e.target as this).SelectedItem = e.Owner;
        }
        private initAchatCmd() {

            Api.RegisterApiCallback({
                Name: 'OpenSFacture', DoApiCallback: (j, e, p) => {
                    this.ca.Open(p.data);
                    this.Select('facture_achat');
                }, Owner: this
            });
            Api.RegisterApiCallback({
                Name: 'SaveSFacture', DoApiCallback: (j, e, p) => {
                    var d = p.data;
                    var apis = GData.apis.SFacture;
                    if (!apis.Check(d)) return;
                    apis.Save(p.data, undefined,
                        (data, isNew: boolean, error_data_notsuccess_iss?: basic.DataStat) => {
                            switch (error_data_notsuccess_iss) {
                                case basic.DataStat.Success:
                                    UI.InfoArea.push('The Facture <h1>Successfully</H1> Saved', true);
                                    break;
                                case basic.DataStat.DataCheckError:
                                    UI.InfoArea.push('Check your <h1 style="color:yellow">Data</h1>  of <h2 style="color:red">Facture</h2> <br> UnSaved', false);
                                    break;
                                default:
                                    UI.InfoArea.push("UnExpected Error Occurred ", false);
                                    break;
                            }
                        });
                    //this.ca.Data = p.data;
                    //this.Select('facture_achat');
                    //this.ca.SaveFacture();
                }, Owner: this
            });
            Api.RegisterApiCallback({
                Name: 'DeleteSFacture', DoApiCallback: (j, e, p) => {
                    UI.Modal.ShowDialog("Confirmation", "Do you want realy to delete this facture", (xx) => {
                        if (xx.Result===UI.MessageResult.ok) {
                            var apis = GData.apis.SFacture;
                            apis.Delete(true, p.data, (data, isNew: boolean, error_data_notsuccess_iss?: basic.DataStat) => {
                                if (error_data_notsuccess_iss == basic.DataStat.Success) {
                                    UI.InfoArea.push('The Facture Successfully Deleted');
                                } else UI.InfoArea.push('An Error Happened When deleting The Facture');
                            });
                        }
                    }, "DELETE", 'CANCEL');
                }, Owner: this
            });
            var sfm: Forms.InitSFacture;
            Api.RegisterApiCallback({
                Name: 'NewSFacture', DoApiCallback: (j, e, p) => {
                    if (!sfm) sfm = new Forms.InitSFacture();

                    var apis = GData.apis.SFacture;
                    var callback1 = (data: models.SFacture, success?: boolean) => {
                        p.callback && p.callback(p, data);
                        if (!success) return;
                        GData.__data.SFactures.Add(data);
                        this.ca.Open(data);
                        this.Select('facture_achat');
                    };
                    sfm.Show(callback1);
                    //var callback = (data: models.SFacture) => {
                    //    Api.RiseApi('OpenFactureInfo', {
                    //        callback: (p, n) => { callback1(p.data); }, data: data
                    //    });
                    //};
                    //apis.Create((a, b, c) => {
                    //    if (a == null || c != basic.DataStat.Success) return;
                    //    callback1(a);
                    //});
                    
                }, Owner: this
            });
            Api.RegisterApiCallback({
                Name: 'UpdateSFacture', DoApiCallback: (j, e, p) => {
                    var t = p.data as models.SFacture;
                    if (!t) UI.InfoArea.push("Please . Select one facture");
                    if (t.IsOpen) {
                        UI.Modal.ShowDialog('Confirmation', "This Facture IsOpened .If You Update It You Will loss all changes data<br> Do you wand realy to Update it", (xx) => {
                            if (xx.Result === UI.MessageResult.ok) GData.apis.SFacture.Update(t);
                        }, "Update");
                    } else GData.apis.SFacture.Update(t);
                }, Owner: this
            });

            Api.RegisterApiCallback({
                Name: 'ValidateSFacture', DoApiCallback: (j, e, p) => {
                    var d = p.data;
                    var apis = GData.apis.SFacture;
                    if (!apis.Check(d)) return;
                    apis.Validate(p.data, undefined,
                        (data, isNew: boolean, error_data_notsuccess_iss?: basic.DataStat) => {
                            switch (error_data_notsuccess_iss) {
                                case basic.DataStat.Success:
                                    UI.InfoArea.push('The Facture <h1>Successfully</H1> Validated', true);
                                    break;
                                case basic.DataStat.DataCheckError:
                                    UI.InfoArea.push('Check your <h1 style="color:yellow">Data</h1>  of <h2 style="color:red">Facture</h2> <br> UnValidated', false);
                                    break;
                                default:
                                    UI.InfoArea.push("UnExpected Error Occurred ", false);
                                    break;
                            }
                        });
                    //this.ca.Data = p.data;
                    //this.Select('facture_achat');
                    //this.ca.Validate();
                }, Owner: this
            });
            Api.RegisterApiCallback({
                Name: 'PrintSFacture', DoApiCallback: (j, e, p) => {
                    var d = p.data as models.SFacture;
                    var apis = GData.apis.SFacture;
                    if (!apis.Check(d)) return;
                    if (d.IsOpen)
                        UI.InfoArea.push("We annot print The Facture While It's open");
                    else
                        apis.Print(p.data,
                            (data, isNew: boolean, error_data_notsuccess_iss?: basic.DataStat) => {
                                switch (error_data_notsuccess_iss) {
                                    case basic.DataStat.Success:
                                        UI.InfoArea.push('The Facture <h1> Is Printing Successfully</H1> Saved', true);
                                        break;
                                    default:
                                        UI.InfoArea.push("UnExpected Error Occurred ", false);
                                        break;
                                }
                            });
                }, Owner: this
            });
        }

        private initVentsCmd() {

            Api.RegisterApiCallback({
                Name: 'OpenFacture', DoApiCallback: (j, e, p) => {
                    this.cv.Open(p.data);
                    this.factureHistory.Show(p.data);
                    this.Select(this.factureHistory.Control.Name);
                }, Owner: this
            });
            Api.RegisterApiCallback({
                Name: 'SaveFacture', DoApiCallback: (j, e, p) => {
                    var d = p.data;
                    var apis = GData.apis.Facture;
                    if (!apis.Check(d)) return;
                    apis.Save(p.data, undefined,
                        (data, isNew: boolean, error_data_notsuccess_iss?: basic.DataStat) => {
                            switch (error_data_notsuccess_iss) {
                                case basic.DataStat.Success:
                                    UI.InfoArea.push('The Facture <h1>Successfully</H1> Saved', true);
                                    break;
                                case basic.DataStat.DataCheckError:
                                    UI.InfoArea.push('Check your <h1 style="color:yellow">Data</h1>  of <h2 style="color:red">Facture</h2> <br> UnSaved', false);
                                    break;
                                default:
                                    UI.InfoArea.push("UnExpected Error Occurred ", false);
                                    break;
                            }
                        });
                    //this.ca.Data = p.data;
                    //this.Select('facture_achat');
                    //this.ca.SaveFacture();
                }, Owner: this
            });
            Api.RegisterApiCallback({
                Name: 'DeleteFacture', DoApiCallback: (j, e, p) => {
                    UI.Modal.ShowDialog("Confirmation", "Do you want realy to delete this facture", (xx) => {
                        if (xx.Result == UI.MessageResult.ok) {
                            var apis = GData.apis.Facture;
                            apis.Delete(true, p.data, (data, isNew: boolean, error_data_notsuccess_iss?: basic.DataStat) => {
                                if (error_data_notsuccess_iss == basic.DataStat.Success) {
                                    UI.InfoArea.push('The Facture Successfully Deleted');
                                } else UI.InfoArea.push('An Error Happened When deleting The Facture');
                            });
                        }
                    }, "DELETE", 'CANCEL');
                }, Owner: this
            });
            var fm: Forms.InitFacture;
            Api.RegisterApiCallback({
                Name: 'NewFacture', DoApiCallback: (j, e, p) => {
                    
                    var apis = GData.apis.Facture;
                    var callback1 = (data: models.Facture, iss) => {
                        if (!iss) return;
                        GData.__data.Factures.Add(data);
                        p.callback && p.callback(p, data);
                        this.cv.Open(data);
                        this.Select('facture_vent');
                    };
                    if (!fm) fm = new Forms.InitFacture();
                    fm.Show(callback1);
                }, Owner: this
            });
            Api.RegisterApiCallback({
                Name: 'UpdateFacture', DoApiCallback: (j, e, p) => {
                    var t = p.data as models.Facture;
                    if (!t) UI.InfoArea.push("Please . Select one facture");
                    if (t.IsOpen) {
                        UI.Modal.ShowDialog('Confirmation', "This Facture IsOpened .If You Update It You Will loss all changes data<br> Do you wand realy to Update it", (xx) => {
                            if (xx.Result == UI.MessageResult.ok) GData.apis.Facture.Update(t);
                        }, "Update");
                    } else GData.apis.Facture.Update(t);
                }, Owner: this
            });

            Api.RegisterApiCallback({
                Name: 'ValidateFacture', DoApiCallback: (j, e, p) => {
                    var d = p.data;
                    var apis = GData.apis.Facture;
                    if (!apis.Check(d)) return;
                    apis.Validate(p.data, undefined,
                        (data, isNew: boolean, error_data_notsuccess_iss?: basic.DataStat) => {
                            switch (error_data_notsuccess_iss) {
                                case basic.DataStat.Success:
                                    UI.InfoArea.push('The Facture <h1>Successfully</H1> Validated', true);
                                    break;
                                case basic.DataStat.DataCheckError:
                                    UI.InfoArea.push('Check your <h1 style="color:yellow">Data</h1>  of <h2 style="color:red">Facture</h2> <br> UnValidated', false);
                                    break;
                                default:
                                    UI.InfoArea.push("UnExpected Error Occurred ", false);
                                    break;
                            }
                        });
                    //this.ca.Data = p.data;
                    //this.Select('facture_achat');
                    //this.ca.Validate();
                }, Owner: this
            });
            Api.RegisterApiCallback({
                Name: 'PrintFacture', DoApiCallback: (j, e, p) => {
                    var d = p.data as models.Facture;
                    var apis = GData.apis.Facture;
                    if (d.IsOpen)
                        UI.InfoArea.push("We annot print The Facture While It's open");
                    else
                        apis.Print(p.data,
                            (data, isNew: boolean, error_data_notsuccess_iss?: basic.DataStat) => {
                                switch (error_data_notsuccess_iss) {
                                    case basic.DataStat.Success:
                                        UI.InfoArea.push('The Facture <h1> Is Printing Successfully</H1> Saved', true);
                                        break;
                                    default:
                                        UI.InfoArea.push("UnExpected Error Occurred ", false);
                                        break;
                                }
                            });
                }, Owner: this
            });
        }

        private initVersmentCmd() {
            Api.RegisterApiCallback({
                Name: 'OpenVersment', DoApiCallback: (j, e, p) => {                    
                    GData.apis.Versment.Edit(p.data);
                }, Owner: this
            });
            Api.RegisterApiCallback({
                Name: 'DeleteVersment', DoApiCallback: (j, e, p) => {
                    GData.apis.Versment.Delete(p.data);
                }, Owner: this
            });
            Api.RegisterApiCallback({
                Name: 'NewVersment', DoApiCallback: (j, e, p) => {
                    GData.apis.Versment.New((e) => {
                        var data = e.Data;
                        if (!p || !p.data) {
                            GData.apis.Client.Select((e) => {
                                var item = e.Data;
                                if (item && e.Error === basic.DataStat.Success) {
                                    data.Client = item;
                                    GData.apis.Versment.Edit(data);
                                }
                            }, null);
                        } else {
                            data.Client = p.data;
                            GData.apis.Versment.Edit(data,  (e) => { if (p.callback) p.callback(p, e.Data); });
                        }
                    });
                }, Owner: this
            });
            Api.RegisterApiCallback({
                Name: 'UpdateVersments', DoApiCallback: (j, e, p) => {
                    GData.apis.Versment.Update(p.data/* || GData.__data.Versments*/);
                }, Owner: this
            });
        }

        private initSVersmentCmd() {
            Api.RegisterApiCallback({
                Name: 'OpenSVersment', DoApiCallback: (j, e, p) => {
                    GData.apis.SVersment.Edit(p.data);
                }, Owner: this
            });
            Api.RegisterApiCallback({
                Name: 'DeleteSVersment', DoApiCallback: (j, e, p) => {
                    GData.apis.SVersment.Delete( p.data);
                }, Owner: this
            });
            Api.RegisterApiCallback({
                Name: 'NewSVersment', DoApiCallback: (j, e, p) => {
                    GData.apis.SVersment.New((e) => {
                        var data = e.Data;
                        data.Fournisseur = p.data;
                        GData.apis.SVersment.Edit(data);
                    });
                }, Owner: this
            });
            Api.RegisterApiCallback({
                Name: 'UpdateSVersments', DoApiCallback: (j, e, p) => {
                    GData.apis.SVersment.Update(p.data /*|| GData.__data.SVersments*/);
                }, Owner: this
            });
        }
        private initStat;
        OnKeyDown(e: KeyboardEvent) {
            if (e.keyCode == 112)
                UI.showSPTooltips(!basic.Settings.get('show-sp-tooltips'));
            else return super.OnKeyDown(e);
            return true;
        }
    }

    export class Test{
        static initialize() {

            return new UI.TabControl("TabControl", "Tab Control", [
                { Title: "Fournisseurs", Content: new Fournisseurs() },
                { Title: "Clients", Content: new Clients() },
                { Title: "Products", Content: new ProductsNav() },
            ]);
        }
        static initialize1() {
            var c = new FactureVent();
            var x = new collection.TransList<models.Facture, UI.TabControlItem<any, models.Facture>>(UI.TabControlItem,
                new Converter(), null);
            x.Source = GData.__data.Factures;
            var sx= new UI.UniTabControl("UniTabControl", "UniTab Control",x, c, (utc, cnt, selctd) => { var d = selctd.Content; c.Open(d); return selctd.Title = (d.Client && (d.Client.Name || d.Client.FullName) || d.Ref); });
        }
        
    }

    class Converter<T extends models.FactureBase> implements collection.Converter<T, UI.TabControlItem<any, T>>{
        ConvertA2B(sender: collection.TransList<T, UI.TabControlItem<any, T>>, index: number, a: T, d: any): UI.TabControlItem<any, T> {
            return new UI.TabControlItem((d.Client && (d.Client.Name || d.Client.FullName) || d.Ref), a);
        }
        ConvertB2A(sender: collection.TransList<T, UI.TabControlItem<any, T>>, index: number, b: UI.TabControlItem<any, T>, d: any): T {
            return b.Content;
        }

    }


    class FactureHistory {
        private dictionary
        public History = new collection.List<models.Facture>(models.Facture);
        private transList: collection.TransList<models.Facture, UI.TabControlItem<any, models.Facture>>;
        private tabControl: UI.UniTabControl<models.Facture>;
        private factureView = new FactureVent();

        private translator(sender: collection.TransList<models.Facture, UI.TabControlItem<any, models.Facture>>, i: null, d: models.Facture, objectStat: this) {
            return new UI.TabControlItem((d.Client && (d.Client.Name || d.Client.FullName) || d.Ref), d);
        }
        constructor() {
            this.transList = new collection.TransList<models.Facture, UI.TabControlItem<any, models.Facture>>(Object, new Converter(), this);
            this.transList.Source = this.History;
            this.tabControl = new UI.UniTabControl("facture_vent", "Bon Livraison", this.transList, this.factureView, this.OnItemSelected);
            this.tabControl.OnInitialized = n => this.OnLoad();
            this.tabControl.OnTabClosed.Add((e) => {
                var f = e.Target.Content;
                if (e.Stat == "closing" && f.IsOpen) {
                    UI.InfoArea.push(`La facture ${f.Ref} est ouvert. fermez la d'abord`);
                    e.Cancel = true;
                }
            });
        }

        OnhistoryChanged() {
            basic.Settings.set('opened_factures', this.History.AsList().map((v) => v.Id));
        }
        OnLoad() {
            var dt = GData.__data.Factures;
            var v = basic.Settings.get('opened_factures') as number[];
            var pt = this.tabControl.SelectedItem;
            if (v instanceof Array) {
                for (var i = 0; i < v.length; i++) {
                    var f = dt.GetById(v[i]);
                    if (f && this.History.IndexOf(f) == -1)
                        this.History.Add(f);
                }
            }
            var id = basic.Settings.get('opened_facture');
            if (id && pt == null) {
                var c = dt.GetById(id);
                if (c && this.History.IndexOf(c) == -1) return;
                this.Show(c);
            }
            this.reloadTitles();
            this.History.Listen = n => this.OnhistoryChanged();
        }
        private reloadTitles() {
            var l = this.transList.AsList();
            var o = this.History.AsList();
            if (o && l)
                for (var i = 0; i < l.length; i++) {
                    var d = o[i];
                    if (!d) continue;
                    l[i].Title = (d.Client && (d.Client.Name || d.Client.FullName) || d.Ref);
                }
            this.transList.Get(0)
        }
        private OnItemSelected(sndr: UI.UniTabControl<models.Facture>, cnt: UI.JControl, selectedItem: UI.ITabControlData<UI.UniTabControl<models.Facture>, models.Facture>) {
            var d = selectedItem && selectedItem.Content;
            (cnt as FactureVent).Open(d);
            basic.Settings.set('opened_facture', d.Id && d.Id);
            return selectedItem.Title = (d.Client && (d.Client.Name || d.Client.FullName) || d.Ref);
        }
        public Show(fact: models.Facture) {
            var i = this.History.IndexOf(fact);
            if (i === -1) {
                this.History.Add(fact);
                i = this.History.Count - 1;
            }
            if (this.tabControl.IsInit)
                this.tabControl.SelectedItem = this.transList.Get(i);
            else this.tabControl.OnInitialized = n => n.SelectedItem = this.transList.Get(i);
        }
        public get Control() { return this.tabControl; }

        public Open(fact: models.Facture) {
            this.Show(fact);
        }
        
    }

    class SFactureHistory {
        public History = new collection.List<models.SFacture>(models.SFacture);
        private transList: collection.TransList<models.SFacture, UI.TabControlItem<any, models.SFacture>>;
        private tabControl: UI.UniTabControl<models.SFacture>;
        private factureView = new FactureAchat();

        private translator(sender: collection.TransList<models.SFacture, UI.TabControlItem<any, models.SFacture>>, i: null, d: models.SFacture, objectStat: this) {
            return new UI.TabControlItem((d.Fournisseur && (d.Fournisseur.Name || d.Fournisseur.Tel) || d.Ref), d);
        }
        constructor() {
            this.transList = new collection.TransList<models.SFacture, UI.TabControlItem<any, models.SFacture>>(Object, new Converter(), this);
            this.transList.Source = this.History;
            this.tabControl = new UI.UniTabControl("facture_achat", "Bon Réception", this.transList, this.factureView, this.OnItemSelected);
            this.tabControl.OnInitialized = n => this.OnLoad();
            this.tabControl.OnTabClosed.Add((e) => {
                var f = e.Target.Content;
                if (e.Stat == "closing" && f.IsOpen) {
                    UI.InfoArea.push(`La facture ${f.Ref} est ouvert. fermez la d'abord`);
                    e.Cancel = true;
                }
            });
        }
        OnhistoryChanged() {
            basic.Settings.set('opened_sfactures', this.History.AsList().map((v) => v.Id));
        }
        OnLoad() {
            var dt = GData.__data.SFactures;
            var v = basic.Settings.get('opened_sfactures') as number[];
            var pt = this.tabControl.SelectedItem;
            if (v instanceof Array) {
                for (var i = 0; i < v.length; i++) {
                    var f = dt.GetById(v[i]);
                    if (f && this.History.IndexOf(f) == -1)
                        this.History.Add(f);
                }
            }
            var id = basic.Settings.get('opened_sfacture');
            if (id && pt) {
                var c = dt.GetById(id);
                if (c && this.History.IndexOf(c) == -1) return;
                this.Show(c);
            }
            this.reloadTitles();
            this.History.Listen = n => this.OnhistoryChanged();
        }
        private reloadTitles() {
            var l = this.transList.AsList();
            var o = this.History.AsList();
            if (o && l)
                for (var i = 0; i < l.length; i++) {
                    var d = o[i];
                    if (!d) continue;
                    l[i].Title = (d.Fournisseur && (d.Fournisseur.Name || d.Fournisseur.Tel) || d.Ref);
                }
            this.transList.Get(0)
        }
        private OnItemSelected(sndr: UI.UniTabControl<models.SFacture>, cnt: UI.JControl, selectedItem: UI.ITabControlData<UI.UniTabControl<models.SFacture>, models.SFacture>) {
            var d = selectedItem && selectedItem.Content;
            (cnt as FactureAchat).Open(d);
            basic.Settings.set('opened_sfacture', d.Id && d.Id);
            return selectedItem.Title = (d.Fournisseur && (d.Fournisseur.Name || d.Fournisseur.Tel) || d.Ref);
        }
        

        public Open(fact: models.SFacture) {
            this.Show(fact);
        }
        public Show(fact: models.SFacture) {
            var i = this.History.IndexOf(fact);
            if (i === -1) {
                this.History.Add(fact);
                i = this.History.Count - 1;
            }
            if (this.tabControl.IsInit)
                this.tabControl.SelectedItem = this.transList.Get(i);
            else {
                var c = this.transList.Get(i);
                this.tabControl.OnInitialized = n => n.SelectedItem = c;
            }
        }
        public get Control() { return this.tabControl; }
    }
}