import { UI } from '../lib/q/sys/UI';
//import {Scops, Facebook } from '../lib/q/sys/Facebook';
import { Critere } from '../lib/q/sys/Critere';
import { mvc, UIDispatcher, utils, basic, thread, encoding, net, bind, collection, Api } from '../lib/q/sys/Corelib';
import { sdata, Controller } from '../lib/q/sys/System';
import { models } from "../abstract/Models";
import { Apis } from '../abstract/QShopApis';
import { init } from '../lib/q/sys/Encoding';
import { funcs, GetVars } from './../abstract/extra/Common';
import { filters } from '../lib/q/sys/Filters';
import { Services } from './Services/QServices';

import { basics } from './../abstract/extra/Basics';
import { SearchData } from './Search';
import { data } from '../assets/data/data';
import { components } from '../lib/Q/components/ActionButton/script';
import { Material } from '../lib/q/components/HeavyTable/script';
import { SMS } from '../abstract/Apis/Agent';
import { FileManager } from '../Idea/FileManager';

var GData: basics.vars;
GetVars((v) => { GData = v; return false; });
var smsRowTemplate = UI.help.createTemplate(data.value.smsTable.def);

export class SMSsView extends Material.HeavyTable<models.SMS> {
    private _paginator: UI.Paginator<models.SMS>;
    public get Paginator() {
        if (this._paginator) return this._paginator;
        this._paginator = UI.Paginator.createPaginator(this, this.Source);
        return this._paginator;
    }
    constructor(source: models.SMSs) {
        super(data.value.smsTable.def);
        this.Source = source;
        this.View.style.overflowX = "auto";
        function getf(a): string {
            return ((a = a.From) && a.FullName || "");
        } function gett(a): string {
            return ((a = a.To) && a.FullName || "");
        } function getd(a): number {
            return ((a = a.Date) && a.getTime() || 0);
        } function getl(a): string {
            return (a.Title || "");
        } function getm(a: models.SMS): string {
            return a.Message || "";
        }

        this.setOrderHandler({
            Owner: this, Invoke: (e) => {
                switch (e.orderBy) {
                    case "IsReaded":
                        return this.Source.OrderBy((a: models.SMS, b: models.SMS) => e.state.factor * ((b.IsReaded ? 1 : 0) - (a.IsReaded ? 1 : 0)));
                    case "From":

                        return this.Source.OrderBy((a, b) => e.state.factor * getf(a).localeCompare(getf(b)));
                    case "To":

                        return this.Source.OrderBy((a, b) => e.state.factor * gett(a).localeCompare(gett(b)));;
                    case "Date":

                        return this.Source.OrderBy((a, b) => e.state.factor * (getd(a) - getd(b)));
                    case "Title":


                        return this.Source.OrderBy((a, b) => e.state.factor * getl(a).localeCompare(getl(b)));

                    case "Message":
                        this.Source.OrderBy((a, b) => e.state.factor * getm(a).localeCompare(getm(b)));
                }
            }
        });
    }
    
}
function getSMSFilter(f: (p: null, sms: models.SMS) => boolean) { return new utils.CostumeFilter<models.SMS, any>(f); }

export class SMSPage extends UI.NavPanel /*implements UI.IService*/ {
    private converter: collection.Converter<models.SMSs, UI.ITabControlData<UI.UniTabControl<models.SMSs>, models.SMSs>>;
    public smsByCategory: collection.List<collection.List<models.SMS>>;
    public smssToTabItem: collection.TransList<models.SMSs, UI.ITabControlData<UI.UniTabControl<models.SMSs>, models.SMSs>>;
    public smsTabControl: UI.UniTabControl<models.SMSs>;
    private _smssView: SMSsView;
    private _paginator: UI.Paginator<models.SMS>;
    private initializeVars() {
        this.converter = {
            ConvertA2B(tarnsList, index, item) {
                return new UI.TabControlItem<UI.UniTabControl<models.SMSs>, models.SMSs>(item.category, item);
            }, ConvertB2A(tarnsList, index, item) {
                return item.Content;
            }
        };
        this.smsByCategory = new collection.List<models.SMSs>(models.SMSs);
        this.smssToTabItem = new collection.TransList<models.SMSs, UI.ITabControlData<UI.UniTabControl<models.SMSs>, models.SMSs>>(Object, this.converter);
        this.smssToTabItem.Source = this.smsByCategory;

        this._paginator = (this._smssView = new SMSsView(null)).Paginator;
        window["pg"] = this._paginator;

        this.smsTabControl = new UI.UniTabControl<models.SMSs>("smsTabControl", "SMS Manager", this.smssToTabItem, this._paginator, (tabControl, view, tabCntData) => {
            (view as UI.Paginator<models.SMS>).Input = tabCntData.Content;
            return tabCntData.Title;
        });
        this._smssView.AcceptNullValue = false;

    }
    private
    static Default: SMSPage;
    constructor() {
        super('SMS', 'SMS');
        if (SMSPage.Default) throw new Error("this is SignleIton Class");
        SMSPage.Default = this;
    }

    public getSuggessions() { return GData.__data.Products; }
    initialize() {
        super.initialize();
        this.initializeVars();
        this.Add(this.smsTabControl);
        this.smsTabControl.OnTabClosed.On = (e) => {
            e.Cancel = true;
        }
        this.initializeTabs();
    }
    private allSMS = new models.SMSs("All Message", "all");
    initializeTabs() {

        var InBoxNonReaded: collection.ExList<models.SMS, utils.IPatent<models.SMS>>;
        var InBoxReaded: collection.ExList<models.SMS, utils.IPatent<models.SMS>>;
        var outBoxNonReaded: collection.ExList<models.SMS, utils.IPatent<models.SMS>>;
        var outBoxReaded: collection.ExList<models.SMS, utils.IPatent<models.SMS>>;

        GData.user.OnMessage((prop, e) => {
            connectionChanged(e._new, e.__this.Client);
        });

        GData.apis.Client.GetMyId((e) => {
            connectionChanged(GData.user.IsLogged, e.Data);
        });

        var self: this = this;
        function connectionChanged(b: boolean, client: models.Client) {
            var all = self.allSMS;
            if (b) {
                let getID = (m: models.Client) => m && m.Id;
                var mid = getID(client);
                if (!InBoxNonReaded) {
                    InBoxNonReaded = all.Filtred(getSMSFilter((_, sms) => !sms.IsReaded && getID(sms.To) === mid));
                    InBoxNonReaded['category'] = "InBox Unreaded";
                    InBoxNonReaded['Tag'] = "NonReaded";

                    InBoxReaded = all.Filtred(getSMSFilter((_, sms) => sms.IsReaded && getID(sms.To) === mid));
                    InBoxReaded['category'] = "InBox Readed";
                    InBoxReaded['Tag'] = "Readed";

                    outBoxNonReaded = all.Filtred(getSMSFilter((_, sms) => !sms.IsReaded && getID(sms.From) === mid));
                    outBoxNonReaded['category'] = "OutBox Non Readed";
                    outBoxNonReaded['Tag'] = "SendedNonReaded";

                    outBoxReaded = all.Filtred(getSMSFilter((_, sms) => sms.IsReaded && getID(sms.From) === mid));
                    outBoxReaded['category'] = "OutBox Readed";
                    outBoxReaded['Tag'] = "Sended";

                    var arr = [InBoxNonReaded, outBoxNonReaded, InBoxReaded, outBoxReaded, all];
                    self.smsByCategory.AddRange(arr);
                }
                GData.apis.Sms.Update(self.allSMS);
            } else
                self.allSMS.Clear();
        }
    }
    OnKeyDown(e: KeyboardEvent) {
        if (e.keyCode == UI.Keys.F2) {
            this.addNewSMS();
            return true;
        } else if (e.keyCode === UI.Keys.Enter) {
            this.showSMS();
        } else if (e.keyCode === UI.Keys.Delete) {
            this.deleteSMS();
        }
        return this.smsTabControl.OnKeyDown(e);
    }
    deleteSMS(): any {
        var sms = this._smssView.SelectedItem;
        var p = this._paginator.Input;
        if (sms) {
            GData.apis.Sms.Delete(sms, (e) => {
                var sms = e.Data;
                if (e.Error === basics.DataStat.Success) {
                    p.Remove(sms);
                }
            });
        }
    }
    showSMS(): any {
        var sms = this._smssView.SelectedItem;
        if (sms) {
            GData.apis.Sms.EditData.edit(sms, false, (s, e) => {
                var sms = e.Data;
                e.Data.Rollback(e.BackupData);
                e.CommitOrBackupHandled = true;
                if (!sms.IsReaded && e.E.Result == UI.MessageResult.ok) {
                    GData.requester.Request(models.SMS, net.WebRequestMethod.Post, void 0, { Id: e.Data.Id, MakeReaded: true }, (e1, json, iss) => {
                        if (iss) {
                            e.Data.IsReaded = true;
                        }

                    });
                }
            }, true);
        }
    }
    
    addNewSMS(): any {
        var d = new Date();
        d.toLocaleString()
        GData.apis.Sms.CreateNew((e) => {
            if (e.Error === basics.DataStat.Success) {
                this.allSMS.Add(e.Data);
                var t = e.Data.To;
                UI.Modal.ShowDialog('Success', `Votre message a ${t && t.FullName} est bien envoyer`, void 0, "OK", null, null);
            }
        });
    }
    OnSearche(o: string, n: string) {
    }
    get HasSearch() { return UI.SearchActionMode.Instantany; }
    private fs = new Services.SearchServices();
    GetLeftBar() {
        return null;
    }
    Update() {
        let lst = this.smsTabControl.SelectedItem.Content;
        if (lst === this.allSMS)
            return GData.apis.Sms.Update(this.allSMS);
        UI.Modal.ShowDialog("", "Do you want to update all sms", (e) => {
            switch (e.Result) {
                case UI.MessageResult.ok:
                    return GData.apis.Sms.Update(this.allSMS);
                case UI.MessageResult.cancel:
                    let lst = this.smsTabControl.SelectedItem.Content;
                    GData.apis.Sms.Update(lst, lst.Tag);
                    return;
            }
        }, "Yes", "No", "Abort");
        //GData.apis.Sms.Update(lst, lst.Tag);
    }
    
    //Handled() {
    //    return true;
    //}
    private _deepSearch: SearchData.SMS;

}


export class FilePage extends UI.NavPanel {
    private manager: FileManager = new FileManager();
    OnKeyDown(e: KeyboardEvent) {
        return this.manager.OnKeyDown(e);
    }
    initialize() {
        super.initialize();
        var t = new UI.Dom('text');
        this.Add(t);
        this.Add(this.manager);
    }
    constructor() {
        super("File Manager", "Explorer");
    }
    Update() {
        this.manager.Update();
    }
    OnSearche(old, _new) {
        return this.manager.OnSearch(old, _new);
    }
    get HasSearch() { return UI.SearchActionMode.Instantany; }
    OnContextMenu(e: MouseEvent) {
        return this.manager.OnContextMenu(e) || super.OnContextMenu(e);
    }
}


//var f: Function;
//window['testSMS1'] =f= () => {

//    var app = UI.Desktop.Current.CurrentApp;
//    var s = new SMSPage(app as any);
//    app.AddPage(s);
//    app.SelectedPage = s;
//}
////setTimeout(f, 4000);