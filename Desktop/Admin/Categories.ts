import {UI, conv2template} from '../../lib/Q/sys/UI';
import { funcs, GetVars, extern, Facture } from '../../abstract/extra/Common';
import { models} from "../../abstract/Models";
import { basic, collection, utils} from '../../lib/Q/sys/Corelib';
import { basics } from '../../abstract/extra/Basics';
import { filters } from '../../lib/Q/sys/Filters';
import { SearchData } from '../Search';
var GData:basics. vars;
GetVars((v) => {
    GData = v;
    return false;
});
var ns = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '!', '"', '#', '%', '\'', '(', ')', ',', '/', ';'];
function toRadix(n, r) {
    var t = [];
    if (r > 72) throw 'radix to big';
    if (r < 2) throw 'radix to small'
    do {
        var x = n % r;
        n = Math.floor(n / r);
        t.unshift(x);
    } while (n !== 0);
    return t;
}
function fromRadix(s, r) {    
    var e= s[0];
    if (e == '+') { e = 1; s = s.substring(1); }
    if (e === '-') { e = -1; s = s.substring(1); }
    else 1;
    if (r <= 36) s = s.toLowerCase();
    var t = 0;
    var x = 1;
    for (var i = s.length - 1; i >= 0; i--) {
        t += ns.indexOf(s[i]) * x;
        x *= r;
    }
    return t * e;
}
export     class CategoryNav extends UI.NavPanel {
    searchList: collection.ExList<models.Category, utils.IPatent<models.Category>>;
    private btn_add = extern.crb('plus', 'Add', 'primary');
    private btn_edit = extern.crb('pencile', 'Edit', 'success');
    private btn_remove = extern.crb('trash', 'Remove', 'danger');
    private group_cnt: UI.Div = new UI.Div().applyStyle('pull-right', 'flat');
    private group_tcnt = new UI.Div().applyStyle('icontent-header');
    private paginator: UI.Paginator<models.Product>;
    private adapter: UI.ListAdapter<models.Category, any> = new UI.ListAdapter<models.Category, any>('Categories.table', 'Category.row');
    private _caption = document.createTextNode("Categories");

    Update() {
        GData.apis.Category.SmartUpdate();
    }
    initsec() {
        var div = this.group_cnt.View;
        div.appendChild(this.btn_add); div.appendChild(this.btn_edit); div.appendChild(this.btn_remove);
        this.group_tcnt.View.appendChild(this._caption);
        this.group_tcnt.Add(this.group_cnt);
        this.Add(this.group_tcnt);
        //this.Add(this.adapter);
        this.paginator = new UI.Paginator(12);
        this.Add(this.paginator);

    }
    private searchFilter: filters.list.StringFilter<models.Category> = new filters.list.StringFilter<models.Category>();
    public OnSearche(oldPatent: string, newPatent: string) {
        var t = this.searchList.Filter == this.searchFilter as any;
        this.searchFilter.Patent = new filters.list.StringPatent(newPatent);
        if (!t)
            this.searchList.Filter = this.searchFilter as any;
        else this.searchList.Reset();
    }
    public get HasSearch(): UI.SearchActionMode { return UI.SearchActionMode.Instantany; }
    public set HasSearch(v: UI.SearchActionMode) { }
    OnKeyDown(e: KeyboardEvent) {
        if (!this.paginator.OnKeyDown(e)) {

            if (e.keyCode === UI.Keys.F1)
                this.getHelp({
                    "F2": "Add New",
                    "Enter": "Edit",
                    "Suppr": "Delete",
                });
            else if (e.keyCode === UI.Keys.Right)
                this.paginator.Next();
            else if (e.keyCode === UI.Keys.Left)
                this.paginator.Previous();
            else if (e.keyCode === UI.Keys.F2)
                this.btnAddClick();
            else if (this.adapter.SelectedIndex != -1)
                if (e.keyCode === 13)
                    this.btnEditClick();
                else if (e.keyCode === UI.Keys.Delete)
                    this.btnRemoveClick();
                else
                    return super.OnKeyDown(e);
            else return super.OnKeyDown(e);
        }
        e.stopPropagation();
        e.preventDefault();
        return true;
    }
    btnAddClick() {
        GData.apis.Category.CreateNew();
    }
    btnEditClick() {
        GData.apis.Category.Edit(this.adapter.SelectedItem);
    }
    btnRemoveClick() {
        GData.apis.Category.Delete(this.adapter.SelectedItem);
    }
    initEvents() {
        this.btn_add.addEventListener('click', <any>{ handleEvent(e) { this.self.btnAddClick(e); }, self: this });
        this.btn_edit.addEventListener('click', <any>{ handleEvent: function (e) { this.self.btnEditClick(e); }, self: this });
        this.btn_remove.addEventListener('click', <any>{ handleEvent: function (e) { this.self.btnRemoveClick(e); }, self: this });
    }
    initialize() {
        super.initialize();
        this.initsec();
        this.initEvents();
        //this.adapter.OnInitialized = (n) => n.Source = this.searchList = GData.__data.Categories.Filtred(this.searchFilter as any);

        this.paginator.OnInitialized = (p) => {
            this.adapter.OnInitialized = (l) => {
                var x: collection.ExList<any, any> = this.searchList = collection.ExList.New(GData.__data.Categories, this.searchFilter);
                l.Source = collection.ExList.New(x, this.paginator.Filter);
                this.paginator.BindMaxToSourceCount(x);
            }
            this.paginator.Content = this.adapter;            
        };

        this.adapter.AcceptNullValue = false;
    }

    constructor() { super('categories', "Categories"); }
    
    GetLeftBar() {
        if (!this.lb) {
            var r = this.lb = new UI.Navbar<any>();
            funcs.setTepmlate(r, this, this.handleSerices);
            r.OnInitialized = r => {
                this._edit = new UI.Glyph(UI.Glyphs.edit, false, 'Edit');
                this._new = new UI.Glyph(UI.Glyphs.plusSign, false, 'New');
                this._delete = new UI.Glyph(UI.Glyphs.fire, false, 'Delete');

                r.AddRange([this._new, this._edit, this._delete]);
            };
        }
        return this.lb;
    }
    handleSerices(s, e, p: { t: CategoryNav, c: UI.Glyphs }) {
        var c = UI.Glyphs;
        switch (p.c) {
            case c.edit:
                return p.t.btnEditClick();
            case c.plusSign:
                return p.t.btnAddClick();
            case c.fire:
                return p.t.btnRemoveClick();
            default: throw "NotImplimented";
        }
    }
    private lb: UI.Navbar<any>;
    private _edit: UI.Glyph;
    private _new: UI.Glyph;
    private _delete: UI.Glyph;

    OnDeepSearch() {
        
        if (!this._deepSearch)
            this._deepSearch = new SearchData.Category;
        this._deepSearch.Open((x) => {
            var t = this.searchList.Filter == this._deepSearch as any;
            this.searchList.Filter = this._deepSearch as any;
            if (t) this.searchList.Reset();
        });
    }
    private _deepSearch: SearchData.Category;
} 