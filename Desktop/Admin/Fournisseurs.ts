import {UI, conv2template} from '../../lib/Q/sys/UI';
import { models } from "../../abstract/Models";
import { funcs, GetVars, extern } from '../../abstract/extra/Common';
import {sdata, Controller} from '../../lib/Q/sys/System';
import { basic, utils, collection, Api} from '../../lib/Q/sys/Corelib';
import { basics } from '../../abstract/extra/Basics';
import { filters } from '../../lib/Q/sys/Filters';
import { SearchData } from '../Search';
import { Material } from '../../lib/Q/components/HeavyTable/script';
import { data } from '../../assets/data/data';
//import { value } from 'json|data.json';
//var value = data.value;
var GData:basics.vars;
GetVars((v) => {
    GData = v;
    return false;
});


export class Fournisseurs extends UI.NavPanel {       
    private _deepSearch: SearchData.Fournisseur;
    private paginator: UI.Paginator<models.Fournisseur>;
    private adapter: UI.ListAdapter<models.Fournisseur, any>;
    private searchList: collection.ExList<models.Fournisseur, utils.IPatent<models.Fournisseur>>;
    private searchFilter: filters.list.StringFilter<models.Fournisseur> = new filters.list.StringFilter<models.Fournisseur>();
    public get HasSearch(): UI.SearchActionMode { return UI.SearchActionMode.Instantany; }
    public set HasSearch(v: UI.SearchActionMode) { }

    constructor() {
        super("Fournissurs", "Fournisseurs");
        UI.Desktop.Current.KeyCombiner.On('O', 'M', (s) => { alert('Success'); }, this, this);
        this.OnInitialized = t => Api.RiseApi('loadFournisseurs', void 0);
    }
    initialize() {
        super.initialize();
        this.Add(funcs.initializeSBox("Fournisseurs").container);
        var tbl: Material.HeavyTable<models.Fournisseur>;
        this.adapter = (tbl= new Material.HeavyTable<models.Fournisseur>(data.value.fournisseurTable.def)).applyStyle('row');
        this.paginator = UI.Paginator.createPaginator(this.adapter, this.searchList = GData.__data.Fournisseurs.Filtred(this.searchFilter), 10);
        this.Add(this.paginator);
        tbl.setOrderHandler<this>({ Invoke: this.OrderBy, Owner: this });
    }
    OrderBy(e: Material.OrderByEventArgs<Material.HeavyTable<models.Fournisseur>>) {

        switch (e.orderBy) {
            case "Id":
                return this.searchList.OrderBy((a, b) => e.state.factor * (a.Id - b.Id));
            case "Name":
                return this.searchList.OrderBy((a, b) => e.state.factor * (a.Name || "").localeCompare(b.Name || ""));
            case "Tel":
                return this.searchList.OrderBy((a, b) => e.state.factor * (a.Tel || "").localeCompare(b.Tel || ""));
            case "TotalM":
                return this.searchList.OrderBy((a, b) => e.state.factor * (a.MontantTotal - b.MontantTotal));
            case "TotalV":
                return this.searchList.OrderBy((a, b) => e.state.factor * (a.VersmentTotal - b.VersmentTotal));
            case "TotalS":
                return this.searchList.OrderBy((a, b) => e.state.factor * (a.SoldTotal - b.SoldTotal));
            default:
        }
    }
    public OnDeepSearch() {
        if (!this._deepSearch)
            this._deepSearch = new SearchData.Fournisseur;
        this._deepSearch.Open((x) => this.searchList.Filter = this._deepSearch as any);
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
            else if (e.keyCode === UI.Keys.F2)
                this.AddFournisseur();
            else if (this.adapter.SelectedIndex != -1)
                if (e.keyCode === 13)
                    this.EditFournisseur();
                else if (e.keyCode === UI.Keys.Delete)
                    this.RemoveFournisseur();
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
    public OnSearche(oldPatent: string, newPatent: string) {
        var t = this.searchList.Filter == this.searchFilter;
        this.searchFilter.Patent = new filters.list.StringPatent(newPatent);
        if (!t)
            this.searchList.Filter = this.searchFilter as any;
    }
        
    Update() {
        GData.apis.Fournisseur.SmartUpdate();
    }
    AddFournisseur() {
        GData.apis.Fournisseur.CreateNew((f) => { });
    }
    RemoveFournisseur() {
        GData.apis.Fournisseur.Delete(this.adapter.SelectedItem);
    }
    EditFournisseur() {
        GData.apis.Fournisseur.Edit(this.adapter.SelectedItem);
    }

    GetLeftBar() {
        if (!this.lb) {
            this.lb = new UI.Navbar<any>();
            var oldget = this.lb.getTemplate;
            this.lb.getTemplate = (c) => {
                var x = new UI.Anchore(c);
                var e = oldget(x);
                e.addEventListener('click', this.callback, { t: this, p: c as UI.Glyph });
                return e;
            }
            var _creditCart: UI.Glyph;
            
            this.lb.OnInitialized = (n) => n.AddRange([
                new UI.Glyph(UI.Glyphs.plusSign, false, 'Add'),
                new UI.Glyph(UI.Glyphs.edit, false, 'Edit'),
                new UI.Glyph(UI.Glyphs.fire, false, "Delete")

            ]);

        }
        return this.lb;
    }
    GetRightBar() {
        if (!this.rb) {
            this.rb = new UI.Navbar<any>();
            var oldget = this.rb.getTemplate;
            this.rb.getTemplate = (c) => {
                var x = new UI.Anchore(c);
                var e = oldget(x);
                e.addEventListener('click', this.callback, { t: this, p: c as UI.Glyph });
                return e;
            }
            this.rb.OnInitialized = (n) => n.AddRange([
                this._creditCart
            ]);
        }
        return this.rb;
    }

    private callback(s, e, p) {        
        var __this = p.t as this;
        switch (p.p.Type) {
            case UI.Glyphs.plusSign:
                __this.AddFournisseur();
                break;
            case UI.Glyphs.edit:
                __this.EditFournisseur();
                break;
            case UI.Glyphs.fire:
                __this.RemoveFournisseur();
                break;
            case UI.Glyphs.search:
                __this.OnDeepSearch();
                break;
            case UI.Glyphs.creditCard:
                p.t.rm.Open(e, { Owner: __this, Invoke: p.t.OnContextMenuFired }, null, true);
                break;
        }
    }
    private lb: UI.Navbar<any>;
    private rb: UI.Navbar<any>;
    _creditCart = new UI.Glyph(UI.Glyphs.creditCard, false, 'Add');
    rm: UI.RichMenu<string> = new UI.RichMenu(undefined, ["Regler", "Verser", "Supprimer", "", "Ouvrir"], this._creditCart);
    private OnContextMenuFired(r: UI.RichMenu<string>, selected: string) {
        if (selected === 'Ouvrir' || selected === 'Supprimer')
            this.OpenVersments(selected === 'Supprimer');
        else if (selected === 'Regler' || selected === 'Verser')
            this.verser(selected === 'Regler');
    }
    public OpenVersments(forDelete: boolean) {
        if (this.adapter.SelectedItem)
            GData.apis.SVersment.OpenSVersmentsOfFournisseur(this.adapter.SelectedItem, (results, selected, fournisseur, success) => {
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
                }
            });
        else
            UI.Modal.ShowDialog("Info", "Selectioner un fournisseur", void 0, "OK", null, null);
        
    }
    public verser(regler: boolean) {
        var data = this.adapter.SelectedItem;
        if (!data) return UI.Modal.ShowDialog("ERROR", "Selecter une Fournisseur pour ajouter une versment");
        if (regler) return GData.apis.SVersment.Regler(null, data);
        GData.apis.SVersment.VerserTo(null, data);
    }
    
}