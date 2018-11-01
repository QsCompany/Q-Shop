import { UI, conv2template } from '../../lib/Q/sys/UI';
import { mvc, utils, basic, Api, thread, encoding, net, bind, collection, ScopicCommand } from '../../lib/Q/sys/Corelib';
import { models } from "../../abstract/Models";
import { GetVars, funcs } from '../../abstract/extra/Common';
import { filters } from '../../lib/Q/sys/Filters';
import { basics } from '../../abstract/extra/Basics';
import { sdata } from '../../lib/Q/sys/System';
import { SearchData } from '../Search';
import { MyApi } from '../../abstract/extra/AdminApis';

var GData: basics.vars;
GetVars((v) => {
    GData = v;
    return false;
});


export abstract class EtatBases<T extends models.EtatTransfer, P extends sdata.DataTable<T>> extends UI.NavPanel {
    abstract Delete();
    protected adapter: UI.ListAdapter<T, any>;
    protected searchList: collection.ExList<T, filters.list.StringPatent<T>>;
    private paginationList: collection.ExList<T, filters.list.SubListPatent>;
    private head: UI.TControl<models.EtatTransfers>;
    public HasSearch = UI.SearchActionMode.Validated;
    private paginator: UI.Paginator<T>;
    constructor(Name: string, Caption: string, Title: string, private tableTemplate) {
        super(Name, Caption);
    }

    OnKeyDown(e: KeyboardEvent) {
        if (!this.adapter.OnKeyDown(e)) {
            if (e.keyCode == UI.Keys.F1) {
                this.getHelp({
                    "Enter": "Open Transaction",
                    "Suppr": "Delete Transaction",
                    "F3": "Deep Searche",
                    "F4": "New Etat"
                });
            }
            else if (e.keyCode === UI.Keys.F4)
                this.btnOpen();
            else if (e.keyCode == UI.Keys.Enter) {
                var x = this.adapter.SelectedItem;
                if (x)
                    this.Open(x);
            }
            else if (e.keyCode === UI.Keys.Delete) {
                var x = this.adapter.SelectedItem;
                if (x)
                    this.Delete();
            }
            if (e.keyCode == UI.Keys.Left)
                this.paginator.Previous();
            else if (e.keyCode == UI.Keys.Right)
                this.paginator.Next();
            else
                return super.OnKeyDown(e);
        }
        e.preventDefault();
        e.stopPropagation();
        return true;
    }
    initialize() {
        super.initialize();
        this.adapter = new UI.ListAdapter<any, any>(this.tableTemplate);
        this.adapter.AcceptNullValue = false;
        this.adapter.ItemStyle = [];
        this.paginator = new UI.Paginator<T>(21);
        this.paginator.OnInitialized = (p) => {
            (this.adapter).OnInitialized = (l) => {
                l.Source =
                    this.paginationList = collection.ExList.New(
                        this.searchList = collection.ExList.New(this.getSource(), new filters.list.StringFilter<T>()), this.paginator.Filter);
                this.paginator.BindMaxToSourceCount(this.searchList);
            }
            this.paginator.Content = this.adapter;
        };
        this.head = new UI.TControl('templates.transferHeader', this.getSource() as any);
        this.Add(this.head);
        this.Add(this.paginator);
    }
    private _deepSearch: SearchData.Etats;
    OnDeepSearch() {
        if (!this._deepSearch)
            this._deepSearch = new SearchData.Etats;
        this._deepSearch.Open((x) => {
            var t = this.searchList.Filter == this._deepSearch as any;
            this.searchList.Filter = this._deepSearch as any;
            if (t) this.searchList.Reset(); var xx: models.EtatTransfers;
        });
    }
    setSource(v: P) {
        {}
        this.head.Data = v as any;
        if (this.searchList)
            this.searchList.Source = v;
    }

    OnSearche(o: string, n: string) {
        this.searchList.Filter.Patent = new filters.list.StringPatent(n);
    }

    private serv = new VersmentBaseServiceBar();
    GetLeftBar() { return this.serv.GetLeftBar(this); }
    GetRightBar() { return this.serv.GetRightBar(this); }

    protected abstract Open(v: T);  
    abstract btnOpen();
    abstract getSource(): P;


    abstract Update();
}

export class Etats extends EtatBases<models.EtatTransfer, models.EtatTransfers>{
    Delete() {
        deleteTransaction(this.adapter.SelectedItem, this.isFrn);
    }
    protected Open(v: models.EtatTransfer) {
        openTransaction(v, this.isFrn);
    }
    private source = new models.EtatTransfers(null);
    btnDeleteVersment() {
    }
    btnAddVersment() {
        throw new Error("Method not implemented.");
    }
    btnSearch() {
        throw new Error("Method not implemented.");
    }
    btnVersmentOfOwner() {
        throw new Error("Method not implemented.");
    }

    Update() {
        var o = this.source.Owner;
        if (o instanceof models.Client)
            this.ExecuteCLient(o);
        else if (o instanceof models.Fournisseur)
            this.ExecuteFournisseur(o);
        else this.btnOpen();
    }

    btnOpen() {
        if (this.isFrn)
            GData.apis.Fournisseur.Select((e) => {
                if (e.Error==basic.DataStat.Success)
                    this.ExecuteFournisseur(e.Data);
            }, null);
        else
            GData.apis.Client.Select((e) => {
                if (e.Error == basic.DataStat.Success)
                    this.ExecuteCLient(e.Data);
            }, null);
    }
    check(si: models.EtatTransfer): boolean {
        throw new Error("Method not implemented.");
    }
    getSource(): models.EtatTransfers {
        return this.source;
    }
    constructor(private isFrn) {
        super(isFrn ? "fournisseurEtat" : "clientEtat", isFrn ? "Situation Fournisseur" : "Situation  Clientele", isFrn ? "Situation  Fournisseur" : "Situation  Clientele", isFrn ? "etatTransfers.atable": "etatTransfers.table");
    }
    public ExecuteCLient(l: models.Client) {
        this.setSource(this.source);
        this.source.Clear();
        GData.requester.Request(models.EtatTransfers, "GET", this.source, { Id: l.Id, "IsAchat": false }, (req, json, iss) => {
            this.source.Owner = l;
            this.source.ReOrder();
            //this.source.OrderBy((a, b) => (b.Date.getTime() - a.Date.getTime()) as any);
        });
    }
    public ExecuteFournisseur(l: models.Fournisseur) {
        this.source.Clear();
        GData.requester.Request(models.EtatTransfers, "GET", this.source, { Id: l.Id, "IsAchat": true }, (req, json, iss) => {
            this.source.Owner = l;
            this.source.ReOrder();
            //this.source.OrderBy((a, b) => (b.Date.getTime() - a.Date.getTime()) as any);
        });
    }
}



class VersmentBaseServiceBar {
    private target: EtatBases<any, any>;

    private _delete: UI.Glyph;
    public _add: UI.Glyph;    
    public _search: UI.Glyph;    
    private _versOf: UI.Glyph;    
    private _open: UI.Glyph;

    handleSerices(s, e, p: { t: VersmentBaseServiceBar, c: UI.Glyphs }) {
        var t = p.t.target;
        if (!t) return;
        var c = UI.Glyphs;
        switch (p.c) {
            case c.search:
                return t.btnOpen();
        }
    }

    GetLeftBar(target: EtatBases<any, any>) {
        this.target = target;
        if (!this.lb) {
            var r = this.lb = new UI.Navbar<any>();
            funcs.setTepmlate(r, this, this.handleSerices);
            r.OnInitialized = r => r.AddRange([this._search = new UI.Glyph(UI.Glyphs.search, false, 'Search')]);
        }
        return this.lb;
    }
    GetRightBar(target: EtatBases<any, any>) {
        this.target = target;
        if (!this.rb) {
            var r = this.rb = new UI.Navbar<any>();
            funcs.setTepmlate(r, this, this.handleSerices);
            r.OnInitialized = r => {
                this._delete = new UI.Glyph(UI.Glyphs.fire, false, 'Delete');
                r.AddRange([this._delete]);
            };
        }
        return this.rb;
    }
    private lb: UI.Navbar<any>;
    private rb: UI.Navbar<any>;
}

ScopicCommand.Register({
    Invoke: (n, d, s) => {
        d.addEventListener('click', (e) => openTransaction(<models.EtatTransfer>s.Value));
        return false;
    }
}, null, 'openTransaction');

function openTransaction(v: models.EtatTransfer, isFrn?: boolean) {
    var data;
    if (isFrn) {
        if (v.Type == models.TransferType.Facture) {
             data = GData.__data.SFactures.GetById(v.TransactionId) as any;
            if (data)
                Api.RiseApi("OpenSFacture", { data: data });
        } else {
            GData.apis.SVersment.Show(GData.apis.SVersment.Get(v.TransactionId), void 0, false);
        }
    } else {
        if (v.Type == models.TransferType.Facture) {    
             data = GData.__data.Factures.GetById(v.TransactionId);
            if (data)
                Api.RiseApi("OpenFacture", { data: data });
        } else {
            GData.apis.Versment.Show(GData.apis.Versment.Get(v.TransactionId), undefined, false);
        }
    }
}

function deleteTransaction(v: models.EtatTransfer, isFrn?: boolean) {
    if (isFrn) {
        if (v.Type == models.TransferType.Facture) {
            GData.apis.SFacture.Delete(true, GData.__data.SFactures.GetById(v.TransactionId),null);
        } else {
            GData.apis.SVersment.Delete(GData.apis.SVersment.Get(v.TransactionId));
        }
    } else {
        if (v.Type == models.TransferType.Facture) {
            GData.apis.Facture.Delete(true, GData.__data.Factures.GetById(v.TransactionId), null);
        } else {
            GData.apis.Versment.Delete(GData.apis.Versment.Get(v.TransactionId));
        }
    }
}
ScopicCommand.Register({
    Invoke: (n, d, s) => {
        d.addEventListener('click', (e) => openTransaction(<models.EtatTransfer>s.Value, true));
        return false;
    }
}, null, 'openaTransaction');