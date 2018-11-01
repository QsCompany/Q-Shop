import {UI, conv2template} from '../../lib/Q/sys/UI';
import {mvc, utils, basic, thread, encoding, net, bind, reflection, collection, Api, ScopicCommand} from '../../lib/Q/sys/Corelib';
import {sdata, Controller, base} from '../../lib/Q/sys/System';
import { models as models } from "../../abstract/Models";
import { Apis } from '../../abstract/QShopApis';
import {init} from '../../lib/Q/sys/Encoding';

import { funcs, GetVars, extern } from './../../abstract/extra/Common';
import { ikmodels as iimodels } from '../../abstract/adminModels';
import {LoadJobs} from '../Jobs';
import {filters } from '../../lib/Q/sys/Filters';
import { basics } from '../../abstract/extra/Basics';
import { SearchData } from '../Search';
import { Material } from "../../lib/q/components/HeavyTable/script";
import { Material as qapp } from "../../lib/q/components/QUI/script";

import { components } from '../../lib/Q/components/ActionButton/script';
import { data } from '../../assets/data/data';
import { Components } from '../../lib/q/sys/Components';
import { OnGStat } from 'context';
var GData: basics.vars;
var b = true;
GetVars((v) => {
    GData = v;
    return false;
});


function crb(dom,icon, title, type,attri:any) {
    var t = document.createElement(dom);
    t.classList.add('btn', 'btn-' + type, 'glyphicon', 'glyphicon-' + icon);
    t.textContent = '  ' + title;
    for (var i in attri)
        t.setAttribute(i, attri[i]);
    return t;
}

export namespace AdminNavs {
    export class FacturesReciption extends UI.NavPanel implements IFacturesOperation {

        private OnContextMenuFired(r: UI.RichMenu<string>, selected: string) {
            if (selected === 'Ouvrir' || selected === 'Supprimer')
                this.OpenVersments(selected === 'Supprimer');
            else if (selected === 'Regler' || selected === 'Verser')
                this.verser(selected === 'Regler');
        }

        public OpenVersments(forDelete: boolean) {

            if (this.adapter.SelectedItem)
                GData.apis.SVersment.OpenSVersmentsOfFacture(this.adapter.SelectedItem, (results, selected, fournisseur, success) => {
                    if (success && forDelete) {
                        if (selected) {
                            UI.Modal.ShowDialog("Confirmation", "Voulez- vous vraiment supprimer ce veremnet", (xx) => {
                                if (xx.Result === UI.MessageResult.ok)
                                    GData.apis.SVersment.Delete(selected, (e) => {
                                        if (e.Error === basics.DataStat.Success) {
                                            UI.InfoArea.push("Ce Virement Est bien Supprimé", true, 5000);
                                        } else {
                                            UI.InfoArea.push("Une erreur s'est produite lorsque nous avons supprimé cette version", true, 5000);
                                        }
                                    });
                            }, "Supprimer", "Annuler");
                        }
                        else UI.InfoArea.push("Vous ne sélectionnez aucun Virement");
                    }
                });
            else {
                UI.InfoArea.push("You Must Set first the client");
            }
        }
        public verser(regler: boolean) {
            var data = this.adapter.SelectedItem;
            if (!data) return UI.Modal.ShowDialog("ERROR", "Selecter une Facture pour ajouter une versment");
            if (regler) return GData.apis.SVersment.Regler(data, data.Client);
            GData.apis.SVersment.VerserTo(data, data.Client);
        }
        searchList: collection.ExList<models.SFacture, utils.IPatent<models.SFacture>>;
        
        constructor() {
            super("facture_fournisseurs", "Journal des achats");
            this.OnInitialized = t => {
                Api.RiseApi('loadFournisseurs', <any>{
                    callback() {
                        Api.RiseApi('loadSFActures', void 0);
                    }, data: this
                });
            }
        }
        actionBtn = new components.ActionButton<models.Fournisseur>();
        private adapter: Material.HeavyTable<models.SFacture>;
        private group_tcnt = new UI.Div().applyStyle('icontent-header');
        private _caption = document.createTextNode("Les Factures ");
        private searchFilter: filters.list.StringFilter<models.SFacture> = new filters.list.StringFilter<models.SFacture>();
        private frnFilter = new filters.list.PropertyFilter<models.SFacture>(models.SFacture.DPFournisseur);
        public OnSearche(oldPatent: string, newPatent: string) {
            if (this.searchList.Filter != this.searchFilter)
                this.searchList.Filter = this.searchFilter;
            this.searchFilter.Patent = new filters.list.StringPatent(newPatent);
        }
        public OnFrnSearch(frn: models.Fournisseur) {
            this.frnFilter.DP = models.SFacture.DPFournisseur;
            this.frnFilter.Patent = new filters.list.PropertyPatent<any>(frn);
            if (this.searchList.Filter != this.frnFilter)
                this.searchList.Filter = this.frnFilter;
        }
        public get HasSearch(): UI.SearchActionMode { return UI.SearchActionMode.Instantany; }
        public set HasSearch(v: UI.SearchActionMode) { }
        CalculateBenifite() {
            var si = this.adapter.SelectedItem;
            GData.requester.Request(models.SFacture, 'BENIFIT', si, { Id: si.Id }, (z, b: any, c) => {
                UI.InfoArea.push('<h3 >Benefit est :</h3><h1>' + b.Benifit + 'DA  </h1><br><h3 >Precentage est :</h3><h1 style="color:yellow">' + (b.Benifit / b.Total) * 100 + '%  </h1>');
            });
        }
        public OnKeyDown(e: KeyboardEvent) {
            if (!this.paginator.OnKeyDown(e)) {
                if (e.keyCode === UI.Keys.F1)
                    this.getHelp({
                        "F2": "Add New",
                        "F3": "Deep Searche",
                        "F5": "Update",
                        "F9": "Settle Debts",
                        "F10": "Versments",
                        "Suppr": "Delete",
                        "Enter": "Edit"
                    });
                else if (e.keyCode == 66 || e.keyCode == 98) {
                    this.CalculateBenifite();
                }

                else if (e.keyCode === UI.Keys.F2)
                    this.New();
                else if (this.adapter.SelectedIndex != -1)
                    if (e.keyCode === 13)
                        this.Open();
                    //else if (e.keyCode === UI.Keys.Delete)
                    //    this.Delete();
                    else if (e.keyCode === UI.Keys.F9)
                        this.verser(true);
                    else if (e.keyCode === UI.Keys.F10)
                        this.OpenVersments(false);
                    else
                        return super.OnKeyDown(e);
                else return super.OnKeyDown(e);
            }
            e.stopPropagation();
            e.preventDefault();
            return true;
        }

        public initializeSBox() {
            this.group_tcnt.View.appendChild(this._caption);
            this.group_tcnt.Add(this.actionBtn);
            this.Add(this.group_tcnt);
            this.actionBtn.Source = GData.__data.Fournisseurs;
            this.actionBtn.OnInitialized = n => n.Box.View.setAttribute('handleClose', '');
            this.actionBtn.Caption.addEventListener('click', (cp, e, p) => this.OnFrnSearch(this.actionBtn.Value), <undefined>null, this);
        }
        public initialize() {
            super.initialize();
            this.initializeSBox();
            this.initPaginator();
            var isc = false;
        }
        private searchRequest: iimodels.SFactureSearch = new iimodels.SFactureSearch();
        private paginator: UI.Paginator<models.SFacture>;

        public initPaginator() {

            if (this) {
                this.adapter = new Material.HeavyTable<models.SFacture>(data.value.factureAchatTable.def);
                this.adapter.setOrderHandler<this>({ Invoke: this.OrderBy, Owner: this });
            }
            //else
            //    this.adapter = new UI.ListAdapter<any, any>('SFactures.table');
            this.adapter.AcceptNullValue = false;
            this.Add(this.paginator = UI.Paginator.createPaginator(this.adapter, this.searchList = GData.__data.SFactures.Filtred(this.searchFilter)));
        }
        OrderBy(e: Material.OrderByEventArgs<Material.HeavyTable<models.SFacture>>) {

            switch (e.orderBy) {
                case "Ref":
                    return this.searchList.OrderBy((a, b) => e.state.factor * (a.Ref || "").localeCompare(b.Ref || ""));
                case "Fournisseur":
                    return this.searchList.OrderBy((a, b) => e.state.factor * (a.Fournisseur && a.Fournisseur.Name || "").localeCompare(b.Fournisseur && b.Fournisseur.Name || ""));
                case "Date":
                    return this.searchList.OrderBy((a, b) => e.state.factor * (a.Date && a.Date.getTime() || 0) - (b.Date && b.Date.getTime() || 0));
                case "NArticles":
                    return this.searchList.OrderBy((a, b) => e.state.factor * (a.NArticles - b.NArticles));
                case "Montant":
                    return this.searchList.OrderBy((a, b) => e.state.factor * (a.Total - b.Total));
                case "Stat":
                    return this.searchList.OrderBy((a, b) => e.state.factor * ((a.IsOpen && -1) - (b.IsOpen && -1)));
                case "Observation":
                    return this.searchList.OrderBy((a, b) => e.state.factor * (a.Observation || "").localeCompare(b.Observation || ""));
                default:
            }
        }

        private Search(f: iimodels.SFactureSearch) {
            var t = GData.__data.Costumers.AsList();
            for (var i = 0, l = t.length; i < l; i++) {
                var e = t[i];
            }
        }
        private service = new FactureBaseServices(this);
        public GetLeftBar() {
            return this.service.GetLeftBar(this);
        }
        public GetRightBar() {
            return this.service.GetRightBar(this);
        }
        public Print() {
            Api.RiseApi('PrintSFacture', { data: this.adapter.SelectedItem });
        }
        public Open() {
            Api.RiseApi('OpenSFacture', { data: this.adapter.SelectedItem });
        }
        public New() {
            Api.RiseApi('NewSFacture', {
                data: null, callback(p, f: models.SFacture) {
                    GData.apis.SFacture.EOpenFacture(f);
                }
            });
        }

        public FsSave() {
            Api.RiseApi('SaveSFacture', { data: this.adapter.SelectedItem });
        }

        public Update() {
            GData.apis.SFacture.SmartUpdate();
        }
        public FsUpdate() {
            Api.RiseApi('UpdateSFacture', { data: this.adapter.SelectedItem });
        }
        public Validate() {
            Api.RiseApi('ValidateSFacture', { data: this.adapter.SelectedItem });
        }
        public Delete() {
            Api.RiseApi('DeleteSFacture', { data: this.adapter.SelectedItem });
        }

        public OnDeepSearch() {
            if (!this._deepSearch)
                this._deepSearch = new SearchData.SFacture;
            this._deepSearch.Open((x) => this.OnDeepSearchTrigged());
        }

        public OnDeepSearchTrigged() {
            if (this.searchList.Filter != this._deepSearch)
                this.searchList.Filter = this._deepSearch;
            else this.searchList.Reset();
        }

        private _deepSearch: SearchData.SFacture;
        
        getFrnName(a: any) {
            return (a && (a = a.Fournisseur) && a.FullName) || "";
        }
    }

    export class FacturesLivraison extends UI.NavPanel {
        actionBtn = new components.ActionButton<models.Client>();
        searchList: collection.ExList<models.Facture, utils.IPatent<models.Facture>>;

        private adapter: Material.HeavyTable<models.Facture>;
        private group_tcnt = new UI.Div().applyStyle('icontent-header');
        private _caption = document.createTextNode("Les Factures ");
        CalculateBenifite() {
            var si = this.adapter.SelectedItem;
            GData.requester.Request(models.Facture, 'BENIFIT', si, { Id: si.Id }, (z, b: any, c) => {
                UI.InfoArea.push('<h3 >Benefit est :</h3><h1>' + b.Benifit + 'DA  </h1><br><h3 >Precentage est :</h3><h1 style="color:yellow">' + (b.Benifit / b.Total) * 100 + '%  </h1>');
            });
        }
        OnDeepSearch() {
            if (!this._deepSearch)
                this._deepSearch = new SearchData.Facture;
            this._deepSearch.Open((x) => this.OnDeepSearchTrigged());
        }

        public OnSearche(oldPatent: string, newPatent: string) {
            if (this.searchList.Filter != this.searchFilter)
                this.searchList.Filter = this.searchFilter;
            this.searchFilter.Patent = new filters.list.StringPatent(newPatent);
        }

        public OnClientSearch(frn: models.Client) {
            this.clientFilter.DP = models.Facture.DPClient;
            this.clientFilter.Patent = new filters.list.PropertyPatent<any>(frn);
            if (this.searchList.Filter != this.clientFilter)
                this.searchList.Filter = this.clientFilter;
        }

        public OnDeepSearchTrigged() {
            if (this.searchList.Filter != this._deepSearch)
                this.searchList.Filter = this._deepSearch;
            else this.searchList.Reset();
        }

        private _deepSearch: SearchData.Facture;

        Update() {
            this.searchList.Source = GData.__data.Factures;
            GData.apis.Facture.SmartUpdate();
        }
        OnKeyDown(e: KeyboardEvent) {
            if (!this.paginator.OnKeyDown(e)) {
                if (e.keyCode === UI.Keys.F1)
                    this.getHelp({
                        "F2": "Add New",
                        "F3": "Deep Searche",
                        "F5": "Update",
                        "F9": "Settle Debts",
                        "F10": "Versments",
                        "Suppr": "Delete",
                        "Enter": "Edit"
                    });
                else if (e.keyCode == 66 || e.keyCode == 98) {
                    this.CalculateBenifite();
                }
                else if (e.keyCode === UI.Keys.F2)
                    this.New();
                else if (this.adapter.SelectedIndex != -1)
                    if (e.keyCode === 13)
                        this.Open();
                    //else if (e.keyCode === UI.Keys.Delete)
                    //    this.Delete();
                    else if (e.keyCode === UI.Keys.F9)
                        this.verser(true);
                    else if (e.keyCode === UI.Keys.F10)
                        this.OpenVersments(false);
                    else
                        return super.OnKeyDown(e);
                else return super.OnKeyDown(e);
            }
            e.stopPropagation();
            e.preventDefault();
            return true;
        }
        constructor() {
            super("facture_clientels", "Journal des Ventes");
            this.OnInitialized = t => Api.RiseApi('loadFActures', void 0);
        }
        initialize() {
            super.initialize();
            this.group_tcnt.View.appendChild(this._caption);
            this.group_tcnt.Add(this.actionBtn);
            this.Add(this.group_tcnt);
            this.initPaginator();
            var isc = false;
            this.adapter.AcceptNullValue = false;
            this.actionBtn.Source = GData.__data.Costumers;
            this.actionBtn.Box.View.setAttribute('handleClose', '');
            this.actionBtn.Caption.addEventListener('click', (s, e, p) => {
                this.OnClientSearch(this.actionBtn.Value);
            }, this);
        }

        get HasSearch() { return UI.SearchActionMode.Validated; }

        private paginator: UI.Paginator<models.Facture>;
        private searchFilter: filters.list.StringFilter<models.Facture> = new filters.list.StringFilter<models.Facture>();
        private clientFilter = new filters.list.PropertyFilter<models.Facture>(models.SFacture.DPFournisseur);


        public initPaginator() {
            this.paginator = new UI.Paginator<models.Facture>(10, undefined, true);
            this.paginator.OnInitialized = (p) => {
                if (this) {
                    this.adapter = new Material.HeavyTable<models.Facture>(data.value.factureVenteTable.def);
                    (this.adapter as Material.HeavyTable<any>).setOrderHandler<this>({ Invoke: this.OrderBy, Owner: this });
                }
                this.adapter.OnInitialized = (l) => {
                    this.paginator.Input = this.searchList = GData.__data.Factures.Filtred(this.searchFilter);
                    l.Source = this.paginator.Output;
                }
                this.paginator.Content = this.adapter;
            };
            this.Add(this.paginator);
            this.applyStyle('fitHeight');
        }

        OrderBy(e: Material.OrderByEventArgs<Material.HeavyTable<models.Facture>>) {

            switch (e.orderBy) {
                case "Ref":
                    return this.searchList.OrderBy((a, b) => e.state.factor * (a.Ref || "").localeCompare(b.Ref || ""));
                case "Client":
                    return this.searchList.OrderBy((a, b) => e.state.factor * (a.Client && a.Client.Name || "").localeCompare(b.Client && b.Client.Name || ""));
                case "Date":
                    return this.searchList.OrderBy((a, b) => e.state.factor * (a.Date && a.Date.getTime() || 0) - (b.Date && b.Date.getTime() || 0));
                case "NArticles":
                    return this.searchList.OrderBy((a, b) => e.state.factor * (a.NArticles - b.NArticles));
                case "Montant":
                    return this.searchList.OrderBy((a, b) => e.state.factor * (a.Total - b.Total));
                case "Stat":
                    return this.searchList.OrderBy((a, b) => e.state.factor * ((a.IsOpen && -1) - (b.IsOpen && -1)));
                case "Observation":
                    return this.searchList.OrderBy((a, b) => e.state.factor * (a.Observation || "").localeCompare(b.Observation || ""));
                default:
            }
        }
        private service = new FactureBaseServices(this);
        public GetLeftBar() {
            return this.service.GetLeftBar(this);
        }
        public GetRightBar() {
            return this.service.GetRightBar(this);
        }
        Print() {
            Api.RiseApi('PrintFacture', { data: this.adapter.SelectedItem });
        }
        Open() {
            Api.RiseApi('OpenFacture', { data: this.adapter.SelectedItem });
        }
        New() {
            Api.RiseApi("NewFacture", {
                data: null,
                callback(p, k) { }
            });
        }

        FsSave() {
            Api.RiseApi('SaveFacture', { data: this.adapter.SelectedItem });
        }
        FsUpdate() {
            Api.RiseApi('UpdateFacture', { data: this.adapter.SelectedItem });
        }

        Validate() {
            Api.RiseApi('ValidateFacture', { data: this.adapter.SelectedItem });
        }
        Delete() {
            Api.RiseApi('DeleteFacture', { data: this.adapter.SelectedItem });
        }

        private OnContextMenuFired(r: UI.RichMenu<string>, selected: string) {
            if (selected === 'Ouvrir' || selected === 'Supprimer')
                this.OpenVersments(selected === 'Supprimer');
            else if (selected === 'Regler' || selected === 'Verser')
                this.verser(selected === 'Regler');
        }

        public OpenVersments(forDelete: boolean) {

            if (this.adapter.SelectedItem)
                GData.apis.Versment.OpenVersmentsOfFacture(this.adapter.SelectedItem, (results, selected, fournisseur, success) => {
                    if (success && forDelete) {
                        if (selected) {
                            UI.Modal.ShowDialog("Confirmation", "Voulez- vous vraiment supprimer ce veremnet", (xx) => {
                                if (xx.Result === UI.MessageResult.ok)
                                    GData.apis.Versment.Delete(selected, (e) => {
                                        if (e.Error === basics.DataStat.Success) {
                                            UI.InfoArea.push("Ce Virement Est bien Supprimé", true, 5000);
                                        } else {
                                            UI.InfoArea.push("Une erreur s'est produite lorsque nous avons supprimé cette version", true, 5000);
                                        }
                                    });
                            }, "Supprimer", "Annuler");
                        }
                        else UI.InfoArea.push("Vous ne sélectionnez aucun Virement");
                    }
                });
            else {
                UI.InfoArea.push("You Must Set first the client");
            }
        }

        public verser(regler: boolean) {
            var data = this.adapter.SelectedItem;
            if (!data) return UI.Modal.ShowDialog("ERROR", "Selecter une Facture pour ajouter une versment");
            if (regler) return GData.apis.Versment.Regler(data, data.Client);
            GData.apis.Versment.VerserTo(data, data.Client);
        }

        rt = [
            <Components.IconGroup>{
                type: "icongroup", value: [
                    { iconName: 'attach_money', commandName: 'benifice' },
                    { iconName: 'card_giftcard', commandName: 'versements' },
                    { iconName: 'update', commandName: 'update' },
                    { iconName: 'print', commandName: 'print' }, { iconName: 'import_export', commandName: 'switch' }
                ]
            },
            <Components.Separator>{ type: "separator" },
            <Components.MdMenuItem>{ type: "menu-item", commandName: "freeze", label: "Freeze", iconName: "visibility_off" },
            <Components.MdMenuItem>{ type: "menu-item", commandName: "unfreeze", label: "UnFreeze", iconName: "visibility" },
            <Components.MdMenuItem>{ type: "menu-item", commandName: "loadfreezed", label: "Load Freezed Factures", iconName: "system_update" }
        ];
        private _contextMenu = new Components.MdContextMenu(this.rt);
        OnContextMenu(e: MouseEvent) {
            UI.Desktop.Current.CurrentApp.OpenContextMenu(this._contextMenu, {
                callback: (si) => {
                    switch ((si.selectedItem as any as Components.MdIconGroupItem).commandName) {
                        case "freeze":
                            this.FreezeFactures(true);
                            break;
                        case "unfreeze":
                            this.FreezeFactures(false);
                            break;
                        case "loadfreezed":
                            this.LoadFreeedFactures();
                            break;
                        case "update":
                            this.Update();
                            break;
                        case "benifice": this.CalculateBenifite(); return;
                        case "versements": this.OpenVersments(false); return;
                        case 'print': this.Print(); return;
                        case 'switch':
                            var dst = this._freezedFactures as models.Factures;
                            this.searchList.Source = dst = (this.searchList.Source === dst ? GData.__data.Factures : dst);
                            return;
                    }
                }, e: e, ObjectStat: this, x: 0, y: 0
            });
        }
        private _freezedFactures = new models.Factures(null);
        private _freezedFacturesloaded = false;
        LoadFreeedFactures(): any {
            
            GData.requester.Request(models.Factures, "LOADFREEZED", this._freezedFactures, { Freezed: true, csv: true }, (r, json, iss, q) => {
                if (iss) {
                    this._freezedFactures.Clear();
                    this._freezedFactures.FromCsv(q.Response, encoding.SerializationContext.GlobalContext.reset());
                    this.searchList.Source = this._freezedFactures;
                } else {
                    UI.InfoArea.push("Error Occured");
                }
            });
        }
        FreezeFactures(freeze: boolean) {
            var src = this.searchList.Source as models.Factures;
            var dst = this._freezedFactures as models.Factures;
            if (src === dst) var dst = GData.__data.Factures;
            UI.Modal.ShowDialog('Freeze Manager', `Do you want really to ${freeze ? '' : 'un'}freeze those factures`, (e) => {
                if (e.Result !== UI.MessageResult.ok) return;
                var data = this.adapter.Source.AsList().map(p => p.Id);
                GData.requester.Request(models.Factures, 'FREEZED', data, { Freezed: freeze }, (x, json, iss, req) => {
                    if (iss) {
                        for (var i of data) {
                            var f = src.GetById(i);
                            if (!f) continue;
                            src.Remove(f); dst.Add(f);
                        }
                        this.paginator.Next();
                        this.paginator.Previous();
                    }
                });
            }, 'Yes', 'No', null);
        }
    }

    
    export interface IFacturesOperation {
        Print();
        Open();
        New();

        FsSave();
        FsUpdate();
        Validate();
        Delete();

        OpenVersments(toDelete: boolean);
        verser(regelr: boolean);
    }
    class FactureLivraisonOrder {
        
        private get list(): collection.List<models.Facture> { return this.getList(); }
        private obs = -1; private ref = -1; private clt = -1; private dt = -1; private nart = -1; private mnt = -1; private stat = -1;
        public constructor(private getList:()=> collection.List<models.Facture>) { }
        public OrderByObservation(e, s) {
            this.obs = -this.obs;
            this.list.OrderBy((a, b) => this.obs * ((a && a.Observation) || "").localeCompare((b && b.Observation) || ""));
        }
        public OrderByRef(e, s) {
            this.ref = -this.ref;
            this.list.OrderBy((a, b) => this.ref * (a.Ref || "").localeCompare(b.Ref || ""));
        }
        public OrderByClient(e, s) {
            this.clt = -this.clt;
            this.list.OrderBy((a, b) => this.clt * this.getclt(a).localeCompare(this.getclt(b)));
        }
        public OrderByDate(e, s) {
            this.dt = -this.dt;
            this.list.OrderBy((a, b) => this.dt * (this.getdt(a) - this.getdt(b)));
        }
        public OrderByNArticles(e, s) {
            this.nart = -this.nart;
            this.list.OrderBy((a, b) => this.nart * (a.NArticles - b.NArticles));
        }
        public OrderByMontant(e, s) {
            this.mnt = -this.mnt;
            this.list.OrderBy((a, b) => this.mnt * (a.Total - b.Total));
        }
        public OrderByStat(e, s) {
            this.stat = -this.stat;
            this.list.OrderBy((a, b) => this.stat * (a.Stat - b.Stat));
        }
        getclt(a: models.Facture) {
            var f: any = a;
            return (f && (f = f.Client) && (f = f.FullName)) || "";
        }
        getdt(a: models.Facture): number {
            var f: any = a;
            return (f && (f = f.Date) && (f = f.getTime())) || 0;
        }
    }
}

 

class FactureBaseServices {
    constructor(private target: AdminNavs.IFacturesOperation) { }
    private lb: UI.Navbar<any>;
    private rb: UI.Navbar<any>;
    GetLeftBar(target: AdminNavs.IFacturesOperation) {
        if (this.lb) return this.lb;
        this.lb = new UI.Navbar<any>();
        var oldget = this.lb.getTemplate; this.rm
        this.lb.getTemplate = (c) => {
            var x = new UI.Anchore(c);
            var e = oldget(x);
            e.addEventListener('click', this.callback, { t: this, p: c as UI.Glyph });
            return e;
        }
        this.lb.OnInitialized = (n) => {
            var _creditCart: UI.JControl;
            n.AddRange([

                new UI.Glyph(UI.Glyphs.edit, false, 'Edit'),
                new UI.Glyph(UI.Glyphs.plusSign, false, 'New'),
                new UI.Glyph(UI.Glyphs.fire, false, 'Delete'),
                funcs.createSparator(),
                new UI.Glyph(UI.Glyphs.print, false, 'Print'),
                funcs.createSparator(),
                _creditCart = new UI.Glyph(UI.Glyphs.creditCard, false, 'Versment Manager'),
            ]);
            this.rm = new UI.RichMenu(undefined, ["Regler", "Verser", "Supprimer", "", "Ouvrir"], _creditCart);
        };
    }
    GetRightBar(target: AdminNavs.IFacturesOperation) {
        if (this.rb) return this.rb;
        this.rb = new UI.Navbar<any>();
        var oldget = this.rb.getTemplate;
        this.rb.getTemplate = (c) => {
            var x = new UI.Anchore(c);
            var e = oldget(x);
            e.addEventListener('click', this.callback, { t: this, p: c as UI.Glyph });
            return e;
        }
        this.rb.OnInitialized = (n) => n.AddRange([
            new UI.Glyph(UI.Glyphs.refresh, false, 'Update'),
            new UI.Glyph(UI.Glyphs.check, false, 'Validate'),
            new UI.Glyph(UI.Glyphs.floppyDisk, false, 'Save')
        ]);
    }
    private callback(x: UI.JControl, e: MouseEvent, c: { t: FactureBaseServices, p: UI.Glyph }) {
        var target = c.t.target;
        switch (c.p.Type) {
            case UI.Glyphs.refresh:
                return target.FsUpdate();
            case UI.Glyphs.check:
                return target.Validate();
            case UI.Glyphs.floppyDisk:
                return target.FsSave();
            case UI.Glyphs.edit:
                return target.Open();
            case UI.Glyphs.plusSign:
                return target.New();
            case UI.Glyphs.fire:
                return target.Delete();
            case UI.Glyphs.print:
                return target.Print();
            case UI.Glyphs.creditCard:
                c.t.rm.Open(e, { Owner: c.t, Invoke: c.t.OnContextMenuFired }, null, true);
                break;
            default:
                UI.InfoArea.push("Unrechable Code");
                return;
        }
    }
    private OnContextMenuFired(r: UI.RichMenu<string>, selected: string) {
        if (selected === 'Ouvrir' || selected === 'Supprimer')
            this.target.OpenVersments(selected === 'Supprimer');
        else if (selected === 'Regler' || selected === 'Verser')
            this.target.verser(selected === 'Regler');
    }
    Print(g, m, t) { t.target.Print(); }
    Open(g, m, t) { t.target.Open(); }
    New(g, m, t) { t.target.New(); }
    Versement(g, m, t) {
        t.rm.Open(m, { Owner: t.target, Invoke: t.target.OnContextMenuFired }, null, true);
    }
    FsSave(g, m, t) { t.target.FsSave(); }
    Update(g, m, t) { t.target.FsUpdate(); }
    Validate(g, m, t) { t.target.Validate(); }
    Delete(g, m, t) { t.target.Delete(); }
    rm: UI.RichMenu<string>;

}
var v: HTMLVideoElement;
var ms: MediaStream;
//navigator.getUserMedia({ video: true }, (a) => { v.srcObject = ms = a; }, (er) => { debugger; })

////var ts = createImageBitmap(v);
//ts.then((a) => {
//    //var tt = new ImageData();
//    //var blob = URL.createObjectURL(ms);
//    //new Notification("Achour", { badge: "love", body: "<h1>Achour</h1>", data: true, dir: "ltr", renotify: true, requireInteraction: true, vibrate: [1, 5, 2, 5], tag: "Achour", image: "./assets/favicon.ico" });
    
//});