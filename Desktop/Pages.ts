import { UI } from '../lib/q/sys/UI';
//import {Scops, Facebook } from '../lib/q/sys/Facebook';
import {Critere } from '../lib/q/sys/Critere';
import {mvc,UIDispatcher, utils, basic, thread, encoding, net, bind, collection } from '../lib/q/sys/Corelib';
import {sdata, Controller} from '../lib/q/sys/System';
import { models } from "../abstract/Models";
import {Apis} from '../abstract/QShopApis';
import {init} from '../lib/q/sys/Encoding';
import { funcs, GetVars } from './../abstract/extra/Common';
import {filters } from '../lib/q/sys/Filters';
import { Services } from './Services/QServices';

import { basics } from './../abstract/extra/Basics';
import { SearchData } from './Search';

var key;
var event = new bind.EventListener<(v: boolean) => void>(key = Math.random() * 2099837662);
////////var facturePage: Pages.FacturePage;
var chooseClient: UI.Modal;

var GData: basics.vars;
GetVars((v) => {
    GData = v;
    return false;
});


export namespace Pages {
    export class SearchPage extends UI.Page implements UI.IService {
        private paginator: UI.Paginator<models.Product>;
        private searchList: collection.ExList<models.Product, filters.list.StringPatent<models.Product>>;
        private paginationList: collection.ExList<models.Product, filters.list.SubListPatent>;

        private pstore: UI.ListAdapter<models.Product, any>;
        constructor(app: UI.App) {
            super(app, 'Recherche', 'Search');
        }
        public getSuggessions() { return GData.__data.Products; }
        initialize() {
            super.initialize();
            this.paginator = new UI.Paginator<models.Product>(3 * 4 * 5);
            this.paginator.OnInitialized = (p) => {
                (this.pstore = new UI.ListAdapter<models.Product, any>('Products.card', window.outerWidth<768? 'Product.DynCard1':'Product.card')).OnInitialized = (l) => {
                    l.Source =
                        this.paginationList = collection.ExList.New(
                            this.searchList = collection.ExList.New(GData.__data.Products, new filters.list.StringFilter<models.Product>()), this.paginator.Filter);
                    this.paginator.BindMaxToSourceCount(this.searchList);
                }
                this.paginator.Content = this.pstore;
            };
            this.Add(this.paginator);
        }

        OnKeyDown(e:KeyboardEvent) {
            switch (e.keyCode) {
                case UI.Keys.Left:
                    if (e.ctrlKey)
                        this.paginator.Previous();
                    else {
                        this.pstore.SelectedIndex--;
                        return true;
                    }
                    break;
                case UI.Keys.Right:
                    if (e.ctrlKey)
                        this.paginator.Next();
                    else {
                        this.pstore.SelectedIndex++;
                        return true;
                    }
                    break;
                case UI.Keys.Home:
                    if (e.ctrlKey)
                    { (this.paginator as any).paginator.Index = 0; break }
                    return super.OnKeyDown(e);
                case UI.Keys.End:
                    if (e.ctrlKey)
                    {
                        (this.paginator as any).paginator.Index = 1e6;
                        break;
                    }
                    return super.OnKeyDown(e);
                case UI.Keys.Enter:
                    UI.InfoArea.push("L'option n'est pas disponiple en Verssion  d'essayer");
                    return true;
                default:
                    return super.OnKeyDown(e);
            }
            UIDispatcher.OnIdle(() => { this.pstore.SelectedIndex = 0; });
            e.preventDefault();
            e.stopImmediatePropagation();
            return true;
            
        }
        OnSearche(o: string, n: string) {
            this.HasSearch
            this.searchList.Filter.Patent = new filters.list.StringPatent(n);
        }
        get HasSearch() { return UI.SearchActionMode.Instantany; }
        private fs = new Services.SearchServices();
        GetLeftBar() {
            return null;
        }

        Update() {
            GData.apis.Product.SmartUpdate();
        }

        Callback(args: any) {
        }

        Handled() {
            return true;
        }

        OnDeepSearche() {
            if (!this._deepSearch)
                this._deepSearch = new SearchData.Product();
            this._deepSearch.Open((x) => {
                var c = this.searchList.Filter;
                var t = c == this._deepSearch as any;
                this.searchList.Filter = this._deepSearch as any;
                if (t) this.searchList.Reset();
            });
        }

        private _deepSearch: SearchData.Product;
    }

    //export class FacturesPage extends UI.Page implements UI.IService {
    //    private paginator: UI.Paginator<models.Facture>;
    //    private pagination: UI.BiPagination;
    //    private searchList: collection.ExList<models.Facture, filters.list.StringPatent<models.Facture>>;
    //    private paginationList: collection.ExList<models.Facture, filters.list.SubListPatent>;
    //    private paginationFilter: filters.list.SubListFilter<models.Facture>;
    //    private pstore: UI.ListAdapter<models.Facture, any>;
    //    constructor(app: UI.App) {
    //        super(app, 'Factures', 'Factures');
    //    }
    //    public getSuggessions() { return GData.__data.Factures; }
    //    initialize() {
    //        super.initialize();

    //        this.paginator = new UI.Paginator<models.Facture>(6);
    //        this.HasSearch = UI.SearchActionMode.Instantany;
    //        this.paginator.OnInitialized = (p) => {
    //            (this.pstore = new UI.ListAdapter<models.Facture, any>(undefined, 'Facture')).OnInitialized = (l) => {
    //                l.Content.applyStyle('reg');
    //                l.OnItemInserted.On = (s, i, d, t) => t.applyStyle('list-group-item', "col-lg-4", "col-md-6");
    //                l.Source =
    //                    this.paginationList = collection.ExList.New(
    //                        this.searchList = collection.ExList.New(GData.__data.Factures, new filters.list.StringFilter<models.Facture>()), this.paginator.Filter);
    //                this.paginator.BindMaxToSourceCount(this.searchList);
    //            }
    //            this.paginator.Content = this.pstore;
    //        };
    //        this.Add(this.paginator.applyStyle('fitHeight'));
    //    }
    //    OnSearche(o: string, n: string) {
    //        this.searchList.Filter.Patent = new filters.list.StringPatent(n);
    //    }

    //    GetLeftBar() {
    //        this.service.ApplyTo(this);
    //        return this.service;
    //    }
    //    private service = new Services.FacturesService();
    //    Callback(args: any) {
    //        var m = args as UI.CItem;

    //        switch (m.Tag) {
    //            case 'select':
    //                var si = this.pstore.SelectedItem;
    //                Open(si, false);
    //                break;
    //            case 'new':
    //                var t = new models.Facture(basic.New());
    //                GData.__data.Factures.Add(t);
    //                GData.__data.SelectedFacture = t;
    //                UI.App.CurrentApp.OpenPage('Search');
    //                break;
    //            case 'edit':
    //                var si = this.pstore.SelectedItem;
    //                Open(si, true);
    //        }
    //    }

    //    Handled() {
    //        return true;
    //    }


    //    OnDeepSearche() {
    //        if (!this._deepSearch)
    //            this._deepSearch = new SearchData.Facture();
    //        this._deepSearch.Open((x) => {
    //            var c = this.searchList.Filter;
    //            var t = c == this._deepSearch as any;
    //            this.searchList.Filter = this._deepSearch as any;
    //            if (t) this.searchList.Reset();
    //        });
    //    }
    //    private _deepSearch: SearchData.Facture;
    //}

    //export class FacturePage extends UI.Page {
    //    private service: Services.FactureService;
    //    private rservice: Services.RFactureServices;
    //    private modal: UI.Modal;
    //    private c: CostumersPage;
    //    private filter: filters.list.StringFilter<models.Article>;


    //    public get Modal() {
    //        if (this.modal == null) {
    //            this.modal = new UI.Modal();
    //            this.modal.OnInitialized = (m) => {
    //                var c = this.c = new CostumersPage(this.app);
    //                this.modal.View.style.maxHeight = document.body.clientHeight + 'px';
    //                m.Add(c);
    //                m.OnClosed.On = (e) => {
    //                    if (e.msg == 'ok') {
    //                        if (c.costumers.SelectedItem)
    //                            GData.__data.SelectedFacture.Client = c.costumers.SelectedItem;
    //                    }
    //                };
    //            }
    //        } else {
    //            if (this.c.costumers == null) { }
    //            this.c.costumers.SelectItem(GData.__data.SelectedFacture.Client);
    //        }
    //        return this.modal;
    //    }

    //    constructor(app: UI.App) {
    //        super(app, 'Facture', 'Facture');
    //        facturePage = this;

    //        bind.Register({
    //            OnInitialize: (ji, e) => {
    //                var dm = ji.dom as HTMLElement;
    //                dm.onclick = () => {
    //                    var f = GData.__data.SelectedFacture;
    //                    if (f && !f.IsFrozen()) facturePage.Modal.Open();
    //                }
    //            }, Check: null, Name: "selectcostumer", OnScopDisposing: null, OnError: null, Todo: null
    //        }, true);
    //    }
    //    private adapter: UI.ListAdapter<models.Product, any>;

    //    initialize() {
    //        super.initialize();
    //        this.service = new Services.FactureService();
    //        this.rservice = new Services.RFactureServices();

    //        this.OnSelected.On = (p) => { if (GData.__data.SelectedFacture == null) { UI.Modal.ShowDialog('<span class="glyphicon glyphicon-eye-open"></span> Information', '<p class="text-center">Please Select One Facture First</p>', null, 'OK', 'Cancel'); this.app.OpenPage('Factures'); } }

    //        var t = this.filter = new filters.list.StringFilter();
    //        GData.__data.OnPropertyChanged(models.QData.DPSelectedFacture, (s, e) =>                this.adapter.Source = e._new == null ? null : e._new.Articles
    //        );
    //        this.Add(this.adapter = new UI.ListAdapter<models.Product, any>('Facture.list', null, GData.__data, true));
    //    }
    //    Update() {
    //        var si = GData.__data.SelectedFacture;
    //        GData.apis.Facture.UpdateArticlesOf(si);
    //    }

    //    GetLeftBar() {
    //        this.service.ApplyTo(this);
    //        return this.service;
    //    }
    //    GetRightBar() {
    //        this.rservice.ApplyTo(this);
    //        return this.rservice;
    //    }
    //    Callback(args: any) {
    //        var m = args as UI.CItem;

    //        switch (m.Tag) {
    //            case 'add':
    //                var si = GData.__data.SelectedFacture;
    //                Open(si, true);
    //                break;
    //            case 'select':
    //                this.Modal.Open();
    //                break;
    //            case 'delete':
    //                var si = GData.__data.SelectedFacture;
    //                GData.spin.Start("Deleting Facture");
    //                GData.apis.Facture.Delete(true, si, (xx, dd, f) => {
    //                    GData.spin.Pause();                        
    //                });
    //                break;
    //            case 'new':
    //                GData.apis.Facture.New((t) => {
    //                    GData.__data.Factures.Add(t);
    //                    GData.__data.SelectedFacture = t;
    //                }, false);                    
    //                break;
    //            case 'save':
    //                var sf = GData.__data.SelectedFacture;
    //                if (sf) {
    //                    if (sf.IsValidated || sf.IsFrozen()) {
    //                        UI.InfoArea.push("<p><h3>This Facture </h3><h2 style='position:relative' > It's</h2> <h1>Frozen</h1></p>");
    //                        return;
    //                    }    
    //                    GData.spin.Start("Saving");
    //                    GData.apis.Facture.Save(sf, false, (xx, d, i) => {
    //                        sf.Recalc();
    //                        GData.spin.Pause();
    //                    });
    //                }
    //                else UI.InfoArea.push('<p class="text-center">Please Select One Facture First</p>');
    //                break;
    //            case 'discart':
    //                var c = GData.__data.SelectedFacture;
    //                if (c)
    //                    UI.Modal.ShowDialog('Confirm', 'Are you sure to <b style="background:red">Discart</b> this Facture', (xx) => {
    //                        if (xx.Result === UI.MessageResult.ok)
    //                            GData.apis.Facture.Update(sf);
    //                    }, 'Yes', 'No');
    //                else UI.InfoArea.push('<p class="text-center">Please Select One Facture First</p>');
    //                break;
    //        }
    //    }

    //    Handled() {
    //        return true;
    //    }

    //}

    //export class CostumersPage extends UI.Page {
    //    private paginator: UI.Paginator<models.Client>;
    //    private searchList: collection.ExList<models.Client, filters.list.StringPatent<models.Client>>;
    //    private paginationList: collection.ExList<models.Client, filters.list.SubListPatent>;
    //    public costumers: UI.ListAdapter<models.Client, any>;
    //    lb: Services.CostumersService;
    //    GetRightBar() {
    //        if (!this.lb)
    //            this.lb = new Services.CostumersService();
    //        return this.lb.ApplyTo(this);
    //    }
    //    private service: Services.MyClientsService;
    //    constructor(app: UI.App) {
    //        super(app, 'Costumers', 'Costumers');
    //    }

    //    private selectedItem;
    //    initialize() {
    //        super.initialize();

    //        this.paginator = new UI.Paginator<models.Client>(6);
    //        this.HasSearch = UI.SearchActionMode.Instantany;
    //        this.paginator.OnInitialized = (p) => {
    //            (this.costumers = new UI.ListAdapter<models.Client, any>('Client.clients', 'Client.info', GData.user.Client)).OnInitialized = (l) => {
    //                l.OnItemInserted.On = (s, i, d, t) => t.applyStyle('list-group-item');
    //                l.Source =
    //                    this.paginationList = collection.ExList.New(
    //                        this.searchList = collection.ExList.New(GData.__data.Costumers, new filters.list.StringFilter<models.Client>()), this.paginator.Filter);
    //                this.paginator.BindMaxToSourceCount(this.searchList);
    //                l.OnItemSelected.On = (l, i, t) =>
    //                    this.selectedItem = t && t.getDataContext();
    //            }
    //            this.paginator.Content = this.costumers;
    //        };
    //        this.Add(this.paginator);
    //        this.service = new Services.MyClientsService();
    //    }
    //    OnSearche(o: string, n: string) {
    //        this.searchList.Filter.Patent = new filters.list.StringPatent(n);
    //    }
    //    public SelectedClient: models.Client;
    //    GetLeftBar() {
    //        this.service.ApplyTo(this);
    //        return this.service;
    //    }
    //    public getSuggessions() { return GData.__data.Costumers; }
    //    //private static fb:Facebook;
    //    //private static ctor() {
    //    //    this.fb = Facebook.Default();
    //    //}
    //    //private sendInvitations() {
    //    //    UI.Spinner.Default.Start('Facebook Is Connecting ....');
    //    //    var fb = CostumersPage.fb;
            
            
    //    //    var isconnected = fb.IsConnected;
    //    //    if (isconnected) {
    //    //        UI.Spinner.Default.Start('Please wait for moment until we send invitations to your friends');
    //    //        fb.getFriendsList((fb, list) => {
    //    //            UI.Modal.ShowDialog("My Friends", `<h1><ul> You have ${list.data.length} Friends</ul></h1>`);
    //    //            UI.Spinner.Default.Pause();
    //    //        });
    //    //    }
    //    //    else if (isconnected === null) {
    //    //        fb.Login((r) => {
    //    //            if (r.status === 'connected')
    //    //                this.sendInvitations();
    //    //            else {
    //    //                UI.Spinner.Default.Pause();
    //    //                UI.InfoArea.push('We cannot connect to facebook');
    //    //            }
    //    //        });
    //    //    }
    //    //    else {
    //    //        UI.Spinner.Default.Pause();
    //    //        UI.InfoArea.push('We cannot connect to facebook');
    //    //    }
    //    //}
    //    Callback(args: any) {
    //        var m = args as UI.CItem;

    //        switch (m.Tag) {
    //            case 'select':
    //                var si = this.costumers.SelectedItem;
    //                GData.__data.SelectedFacture.Client = si;
    //                break;
    //            case 'delete':
    //                var si = this.costumers.SelectedItem;
    //                GData.apis.Client.Delete(true, si, (item, isNew, error) => {
    //                    var o = this.costumers.SelectedIndex;
    //                    this.costumers.SelectedIndex = 0;
    //                    this.costumers.SelectedIndex = o;
    //                });
    //                break;
    //            case 'new':
    //                GData.apis.Client.CreateNew();
    //                return;

    //            case 'edit':
    //                GData.apis.Client.Edit(true, this.selectedItem, false);
    //                break;
    //            case 'send':
    //                UI.InfoArea.push("Sending Emais not supported in Version DEMO");
    //                return;
    //            //    UI.Modal.ShowDialog("<strong> Send Invitations to my friends", "Do you want realy to send invitation to your friends", (e) => {
    //            //        var fb = CostumersPage.fb;
                        
    //            //        if (e.Result === UI.MessageResult.ok) {
    //            //            if (!fb.IsConnected) {
    //            //                fb.RegisterScop([
    //            //                    "email", "public_profile",
    //            //                    "read_custom_friendlists",
    //            //                    "user_about_me", "user_birthday",
    //            //                     "user_friends",
    //            //                    "user_hometown", "user_location",
    //            //                    "invitable_friends"]);
    //            //                fb.Connect((fb) => {
    //            //                    this.sendInvitations();
    //            //                });
    //            //            }
    //            //            else this.sendInvitations();
    //            //        }
    //            //    }, "Send", "Cancel");
    //            //    break;
    //            //case 'get':
    //        }
    //    }
    //    Handled() {
    //        return true;
    //    }

    //    OnDeepSearche() {
    //        if (!this._deepSearch)
    //            this._deepSearch = new SearchData.Client;
    //        this._deepSearch.Open((x) => {
    //            var c = this.searchList.Filter;
    //            var t = c == this._deepSearch as any;
    //            this.searchList.Filter = this._deepSearch as any;
    //            if (t) this.searchList.Reset();
    //        });
    //    }
    //    private _deepSearch: SearchData.Client;

    //}
}

function Open(si: models.Facture, edit: boolean) {
    if (si == null) return UI.InfoArea.push("There no Facture to Open", false);
    GData.spin.Start("The Facture Is Loading");
    if (edit && !si.Validator)
        si.IsOpen = true;
    GData.apis.Facture.LoadArticlesOf(si, (d, v, k) => {
        if (k == basics.DataStat.Success) {
            GData.__data.SelectedFacture = null;
            GData.__data.SelectedFacture = si;
            UI.App.CurrentApp.OpenPage('Search');
        }
        else UI.InfoArea.push("An Expected Error Happened When Trying Open Facture");
        GData.spin.Pause();
    });
}