import {UI, conv2template} from '../../lib/Q/sys/UI';
import { funcs, GetVars, extern, Facture } from '../../abstract/extra/Common';
import { models } from "../../abstract/Models";
import {filters } from '../../lib/Q/sys/Filters';
import { collection,bind, basic, thread, utils, encoding } from '../../lib/Q/sys/Corelib';
import { basics } from '../../abstract/extra/Basics';
import { SearchData } from '../Search';
import { Forms, Test1 } from '../../Componenets/Forms';
import { PictureEditor } from '../Jobs';
import { sdata } from '../../lib/Q/sys/System';
import { Material } from '../../lib/q/components/HeavyTable/script';
import { context } from 'context';
import { Statistique } from '../../Componenets/PStat';

var GData: basics.vars;
GetVars((v) => {
    GData = v;
    return false;
});

export class ProductsNav extends UI.NavPanel {
    private btn_add = extern.crb('plus', 'Add', 'primary');
    private btn_edit = extern.crb('pencile', 'Edit', 'success');
    private btn_remove = extern.crb('trash', 'Remove', 'danger');
    private group_cnt: UI.Div = new UI.Div().applyStyle('pull-right', 'flat');
    private group_tcnt = new UI.Div().applyStyle('icontent-header');
    public adapter: UI.ListAdapter<models.Product, any> = new UI.ListAdapter<any, any>('Products.table', null && 'Product.row');
    private _caption = document.createTextNode("Products");
    private paginator: UI.Paginator<models.Product>;
    private searchFilter: filters.list.StringFilter<models.Product> = new filters.list.StringFilter<models.Product>();
    public OnSearche(oldPatent: string, newPatent: string) {
        var t = this.searchList.Filter == this.searchFilter;
        this.searchFilter.Patent = new filters.list.StringPatent(newPatent);
        if (!t)
            this.searchList.Filter = this.searchFilter as any;
        else this.searchList.Reset();
    }
    private _deepSearch: SearchData.Product;
    searchList: collection.ExList<models.Product, utils.IPatent<models.Product>>;
    OnDeepSearch() {
        if (!this._deepSearch)
            this._deepSearch = new SearchData.Product;
        this._deepSearch.Open((x) => {
            var t = this.searchList.Filter == this._deepSearch as any;
            this.searchList.Filter = this._deepSearch as any;
            if (t) this.searchList.Reset();
        });
    }
    public get HasSearch(): UI.SearchActionMode { return UI.SearchActionMode.Instantany; }
    public set HasSearch(v: UI.SearchActionMode) { }
    OnKeyDown(e: KeyboardEvent) {
        if (!this.paginator.OnKeyDown(e))
        /*if (!this.adapter.OnKeyDown(e))*/ {
            //if (e.keyCode === UI.Keys.Right)
            //    this.paginator.Next();
            //else if (e.keyCode === UI.Keys.Left)
            //    this.paginator.Previous();
            //else 
            if (e.keyCode === UI.Keys.F1)
                this.getHelp({
                    "F2": "Add New",
                    "F3": "Deep Searche",
                    "F5": "Update",
                    "F9": "Add Revage",
                    "F10": "Edit Revage",
                    "Suppr": "Delete",
                    "Enter": "Edit"
                });
            else if (e.keyCode === UI.Keys.F2)
                this.btnAddClick();
            else if (this.adapter.SelectedIndex != -1)
                if (e.keyCode === 13)
                    if (e.ctrlKey) this.showAvatar();
                    else this.btnEditClick();
                else if (e.keyCode === UI.Keys.Delete)
                    this.btnRemoveClick();

                //else if (e.keyCode === UI.Keys.F9)
                //    this.addRevage();
                //else if (e.keyCode === UI.Keys.F10)
                //    this.corrigerRvage();
                
                else
                    return super.OnKeyDown(e);
            else
                return super.OnKeyDown(e);
        }
        e.stopPropagation();
        e.preventDefault();
        return true;
    }
    constructor() {
        super('products', "Produits");
    }

    Update() {
        GData.apis.Product.SmartUpdate();
    }
    initsec() {
        var div = this.group_cnt.View;
        div.appendChild(this.btn_add); div.appendChild(this.btn_edit); div.appendChild(this.btn_remove);
        this.group_tcnt.View.appendChild(this._caption);
        this.group_tcnt.Add(this.group_cnt);
        this.Add(this.group_tcnt);
        this.initPaginator();

        this.btn_add.addEventListener('click', <any>{ handleEvent(e) { this.self.btnAddClick(); }, self: this });
        this.btn_edit.addEventListener('click', <any>{ handleEvent(e) { this.self.btnEditClick(); }, self: this });
        this.btn_remove.addEventListener('click', <any>{ handleEvent(e) { this.self.btnRemoveClick(); }, self: this });
        //this.txt_action.OnAction.On = (s, o, n) => {
        //    o = (o || "").trim().toLowerCase();
        //    n = (n || "").trim().toLowerCase();
        //    if (o == n) return;
        //    this.searchFilter.Patent = new filters.list.StringPatent(n);
        //};
        this.adapter.AcceptNullValue = false;
        
    }

    initPaginator() {
        this.paginator = new UI.Paginator<models.Product>(10);
        this.paginator.OnInitialized = (p) => {
            this.adapter.OnInitialized = (l) => {
                var x: collection.ExList<any, any> = this.searchList = collection.ExList.New(GData.__data.Products, this.searchFilter);
                l.Source = collection.ExList.New(x, this.paginator.Filter);
                this.paginator.BindMaxToSourceCount(x);
            }
            this.paginator.Content = this.adapter;
        };
        this.Add(this.paginator);
    }

    btnAddClick() {
        GData.apis.Product.CreateNew();
    }
    btnEditClick() {
        GData.apis.Product.Edit(this.adapter.SelectedItem,null);
    }
    btnRemoveClick() {
        GData.apis.Product.Delete(this.adapter.SelectedItem, null);
    }
    initEvents() {
        this.btn_add.addEventListener('click', <any>{ handleEvent(e) { this.self.btnAddClick(e); }, self: this });
        this.btn_edit.addEventListener('click', <any>{ handleEvent: function (e) { this.self.btnEditClick(e); }, self: this });
        this.btn_remove.addEventListener('click', <any>{ handleEvent: function (e) { this.self.btnRemoveClick(e); }, self: this });
    }
    initialize() {
        super.initialize();
        this.initsec();
        
        UI.Desktop.Current.KeyCombiner.On('S', 'R', function (s, e) {
            s.Cancel = true;
            var q = Statistique.Views.ListOfArticles.OpenQuery();
            q.OnInitialized = n => n.SelectedProduct = this.adapter.SelectedItem;
        }, this, this);
        UI.Desktop.Current.KeyCombiner.On('S', 'D', function (s, e) { Statistique.Views.ListOfArticles.Open(); s.Cancel; }, this, this);

    }
    OnPrint() {
        super.OnPrint();
        var l: models.Product[] = (this.adapter.Source as collection.ExList<models.Product, any>).Source.AsList();
        var x = new Array(l.length);
        for (var i = 0; i < x.length; i++)
            x[i] = l[i].Id;
        GData.requester.Request(models.Products, "PRINT", JSON.stringify(x.join('|')), void 0, (a, b: any, c) => {
            if (b.Response && b.Response.Success) {
                var url = __global.ApiServer.Combine('/_/$?Id=' + b.Response.FileName).FullPath;
                Forms.PDFViewer.Show(url);
            }
        });
    }

    selectavatar() {
        let r;

        if (!this.pictureEditor) {
            (this.pictureEditor = new PictureEditor(this.adapter));
            r = true;
        }
        this.pictureEditor.Open((s) => {
            s.Upload(this.adapter.SelectedItem, (e) => {
                if (e.Error == basic.DataStat.Success) {
                    UI.InfoArea.push('La picture successfully uploaded');
                } else if (e.Error == basic.DataStat.OperationCanceled)
                    UI.InfoArea.push('L\'Operation Annulé');
                else UI.InfoArea.push('Une Error occure !!!!!!!!!');
            });
        });
        if (r) this.pictureEditor.OnInitialized = n => n.SetVisible(UI.MessageResult.ok, false);
    }
    private s;
    showAvatar() {
        if (!this.s) {
            var s = this.s = bind.Scop.Create('SelectedItem', this.adapter, bind.BindingMode.SourceToTarget, this.__Controller__);
            s.OnPropertyChanged(bind.Scop.DPValue, function (this: ProductsNav, s, e) {
                var p = e._new as models.Product;
                if (Forms.ImageModal.Default.IsOpen) {
                    var t = p && p.Picture;
                    Forms.ImageModal.Default.Open(t == undefined || t == '' ? '' : '/_/Picture/' + t, p && p.toString());
                }
            }, this);
            Test1();
        }
        var p = this.adapter.SelectedItem;
        if (p) {
            var t = p && p.Picture;
            Forms.ImageModal.Default.Open(t == undefined || t == '' ? '' : '/_/Picture/' + t, p && p.toString());
        }
    }

    private serv = new ProductService();
    GetLeftBar() { return this.serv.GetLeftBar(this); }
    GetRightBar() { return this.serv.GetRightBar(this); }
    private pictureEditor: PictureEditor;
    private __order: order = new order(this);
}


class order {
    private get list(): collection.List<models.Product> { return this.prd.adapter.Source; }
    private ctg = -1; private nm = -1; private dim = -1; private ser = -1; private qlt = -1; private qte = -1; private prx = -1;
    public constructor(private prd: ProductsNav) { }
    public OrderByCategory(e, s) {
        this.ctg = -this.ctg;
        var t = (a: models.Product): string => { return (a && (a = a.Category as any) && (<any>a).Name) || ""; };
        this.list.OrderBy((a, b) => this.ctg * t(a).localeCompare(t(b)));
    }
    public OrderByName(e, s) {
        this.nm = -this.nm;
        this.list.OrderBy((a, b) => this.nm * (a.Name || "").localeCompare(b.Name || ""));
    }
    public OrderByDimention(e, s) {
        this.dim = -this.dim;
        this.list.OrderBy((a, b) => this.dim * (a.Dimention || "").localeCompare(b.Dimention || ""));
    }
    public OrderBySerieName(e, s) {
        this.ser = -this.ser;
        this.list.OrderBy((a, b) => this.ser *(a.SerieName || "").localeCompare(b.SerieName || ""));
    }
    public OrderByQuality(e, s) {
        this.qlt = -this.qlt;
        this.list.OrderBy((a, b) => this.qlt * (a.Quality - b.Quality));
    }
    public OrderByQte(e, s) {
        this.qte = -this.qte;
        this.list.OrderBy((a, b) => this.qte * (a.Qte - b.Qte));
    }
    public OrderByPrice(e, s) {
        this.prx = -this.prx;
        this.list.OrderBy((a, b) => this.prx * (a.Value - b.Value));
    }
}


/*
export class ProformarAchatNav extends UI.NavPanel {    
    private adapter: UI.ListAdapter<models.Product, any> = new UI.ListAdapter<any, any>('Products.table', null && 'Product.row');
    private _caption = document.createTextNode("Performa d'achat");
    private group_tcnt = new UI.Div().applyStyle('icontent-header');
    private paginator: UI.Paginator<models.Product>;
    private searchFilter: filters.list.StringFilter<models.Product> = new filters.list.StringFilter<models.Product>();

    private result = new collection.List<models.Product>(models.Product);
    private list: collection.List<models.Product>;

    public OnSearche(oldPatent: string, newPatent: string) {
        var t = this.searchList.Filter == this.searchFilter;
        this.searchFilter.Patent = new filters.list.StringPatent(newPatent);
        if (!t)
            this.searchList.Filter = this.searchFilter as any;
        else this.searchList.Reset();
    }
    private _deepSearch: SearchData.Product;
    searchList: collection.ExList<models.Product, utils.IPatent<models.Product>>;
    OnDeepSearch() {
        if (!this._deepSearch)
            this._deepSearch = new SearchData.Product;
        this._deepSearch.Open((x) => {
            var t = this.searchList.Filter == this._deepSearch as any;
            this.searchList.Filter = this._deepSearch as any;
            if (t) this.searchList.Reset();
        });
    }
    public get HasSearch(): UI.SearchActionMode { return UI.SearchActionMode.Instantany; }
    public set HasSearch(v: UI.SearchActionMode) { }
    OnKeyDown(e: KeyboardEvent) {
        if (e.keyCode === UI.Keys.Enter) {
            var p = this.adapter.SelectedItem;
            if (p && this.searchList.Source !== this.result) {
                this.result.Add(p);
                this.list.Remove(p);
                UI.InfoArea.push(p.Name + "  added", true, 300);
            }
        }
        else if (e.keyCode === UI.Keys.Delete) {
            var p = this.adapter.SelectedItem;
            if (p && this.searchList.Source === this.result) {
                this.result.Remove(p);
                this.list.Add(p);
                UI.InfoArea.push(p.Name + "  removed", false, 300);
            }
        }
        else if (!this.paginator.OnKeyDown(e))
            if (e.keyCode === UI.Keys.F6)
                this.searchList.Source = this.result;
            else if (e.keyCode === UI.Keys.F7)
                this.searchList.Source = this.list;
            else
                return super.OnKeyDown(e);
        e.stopPropagation();
        e.preventDefault();
        return true;
    }
    constructor() {
        super('proformat_achat', "Proformat d'achat");
    }

    initPaginator() {
        this.paginator = new UI.Paginator<models.Product>(10);
        this.paginator.OnInitialized = (p) => {
            this.adapter.OnInitialized = (l) => {
                var x: collection.ExList<any, any> = this.searchList = collection.ExList.New(this.list, this.searchFilter);
                l.Source = collection.ExList.New(x, this.paginator.Filter);
                this.paginator.BindMaxToSourceCount(x);
            }
            this.paginator.Content = this.adapter;
        };
        this.Add(this.paginator);
    }
    initialize() {
        super.initialize();
        this.list = new collection.List<models.Product>(models.Product, GData.__data.Products.AsList());
        this.group_tcnt.View.appendChild(this._caption);
        this.Add(this.group_tcnt);
        this.initPaginator();
    }
    private serv = new ProductService();
    GetRightBar() {
        if (!this._lb) {
            var r = this._lb = new UI.Navbar<any>();
            funcs.setTepmlate(r, this, this.handleSerices);
            r.OnInitialized = r => {
                r.AddRange([
                    new UI.Glyph(UI.Glyphs.print, false, 'Print'),
                    new UI.Glyph(UI.Glyphs.open, false, 'Open')
                ]);
            };
        }
        return this._lb;
    }
    GetLeftBar() { return null; }
    private _lb: UI.Navbar<any>;
    handleSerices(s, e, p: { t: ProformarAchatNav, c: UI.Glyphs }) {
        var t = p.t;
        if (!t) return;
        var c = UI.Glyphs;
        switch (p.c) {
            case c.print:
                t.OnPrint();
                break;
        }
    }
}
*/
class ProductService {
    private target: ProductsNav;
    public picture: UI.Glyph;
    public add2stock: UI.Glyph;
    
    private _edit: UI.Glyph;
    private _new: UI.Glyph;
    private _delete: UI.Glyph;
    handleSerices(s, e, p: { t: ProductService, c: UI.Glyphs }) {
        var t = p.t.target;
        if (!t) return;
        var c = UI.Glyphs;
        switch (p.c) {
            case c.edit:
                t.btnEditClick();
                break;
            case c.plusSign:
                t.btnAddClick();
                break;
            case c.fire:
                t.btnRemoveClick();
                break;
            case c.flash:
                //t.addRevage();
                break;
            //case c.erase:
            //    t.corrigerRvage();
            //    break;
            case c.picture:
                t.selectavatar();
                break;
        }
    }

    GetLeftBar(target: ProductsNav) {
        this.target = target;
        if (!this.lb) {
            var r = this.lb = new UI.Navbar<any>();
            funcs.setTepmlate(r, this, this.handleSerices);
            r.OnInitialized = r => {

                this._edit = new UI.Glyph(UI.Glyphs.edit, false, 'Edit');
                this._new = new UI.Glyph(UI.Glyphs.plusSign, false, 'New');
                this._delete = new UI.Glyph(UI.Glyphs.fire, false, 'Delete');

                r.AddRange([this._new, this._edit, this._delete, funcs.createSparator(),
                    

                ]);
            };
        }
        return this.lb;
    }
    GetRightBar(target: ProductsNav) {
        this.target = target;
        if (!this.rb) {
            var r = this.rb = new UI.Navbar<any>();
            funcs.setTepmlate(r,this,this.handleSerices);
            r.OnInitialized = r => {
                r.AddRange([
                    //this.swapStock = new UI.Glyph(UI.Glyphs.erase, false, 'Corriger le Stock'),
                    this.add2stock = new UI.Glyph(UI.Glyphs.flash, false, 'Add 2 Stock'),
                    funcs.createSparator(),
                    this.picture = new UI.Glyph(UI.Glyphs.picture, false, 'Select Avatar')
                ]);
            }
        }
        return this.rb;
    }

    private lb: UI.Navbar<any>;
    private rb: UI.Navbar<any>;
}