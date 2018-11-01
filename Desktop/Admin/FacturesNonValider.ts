import {UI, conv2template} from '../../lib/Q/sys/UI';
import {mvc, utils, basic, Api, thread, encoding, net, bind, reflection, collection } from '../../lib/Q/sys/Corelib';
import { models } from "../../abstract/Models";
import {sdata, Controller} from '../../lib/Q/sys/System';
import { funcs, GetVars, extern, Facture } from '../../abstract/extra/Common';
import { basics } from '../../abstract/extra/Basics';
import { filters } from '../../lib/Q/sys/Filters';
import { SearchData } from '../Search';
var GData: basics.vars;
GetVars((v) => {
    GData = v;    
    return false;
});

export class FactureNav extends UI.NavPanel {
    searchList: collection.ExList<models.Facture, utils.IPatent<models.Facture>>;
    private adapter: UI.ListAdapter<models.Facture, any> = new UI.ListAdapter<any, any>('Factures.InValidation', 'Factures.row');
    constructor(private app: UI.App) {
        super('factures_nonvalider', "Factures Non Valider");
        this.Title = "Les Facture Non Validé";
    } private searchFilter: filters.list.StringFilter<models.Facture> = new filters.list.StringFilter<models.Facture>();
    public OnSearche(oldPatent: string, newPatent: string) {
        var t = this.searchList.Filter == this.searchFilter;
        this.searchFilter.Patent = new filters.list.StringPatent(newPatent);
        if (!t)
            this.searchList.Filter = this.searchFilter as any;
        else this.searchList.Reset();
    }


    OnDeepSearch() {
        if (!this._deepSearch)
            this._deepSearch = new SearchData.Facture;
        this._deepSearch.Open((x) => {
            var t = this.searchList.Filter == this._deepSearch as any;
            this.searchList.Filter = this._deepSearch as any;
            if (t) this.searchList.Reset();
        });
    }
    private _deepSearch: SearchData.Facture;
    public get HasSearch(): UI.SearchActionMode { return UI.SearchActionMode.Instantany; }
    public set HasSearch(v: UI.SearchActionMode) { }
    OnKeyDown(e: KeyboardEvent) {
         if (!this.adapter.OnKeyDown(e)) {
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
                 this.New();
             else  if (this.adapter.SelectedIndex != -1)
                    if (e.keyCode === 13)
                        this.Open();
                    else if (e.keyCode === UI.Keys.Delete)
                        this.Delete();
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
    Open() {
        Api.RiseApi('OpenFacture', { data: this.adapter.SelectedItem });
    }
    Delete() {
        Api.RiseApi('DeleteFacture', { data: this.adapter.SelectedItem });
    }
    New() {
        Api.RiseApi("NewFacture", {
            data: null,
            callback(p, k) { }
        });
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
        if (data.IsOpen) return UI.Modal.ShowDialog("Error", 'Close the facture for you can make a versment');
        if (regler) return GData.apis.Versment.Regler(data, data.Client);
        GData.apis.Versment.VerserTo(data, data.Client);
    }


    initialize() {
        super.initialize();
        this.Add(this.adapter);
        this.initJobs();
        this.adapter.OnInitialized = (p) => p.Source = this.searchList = GData.__data.Factures.Filtred(this.searchFilter);
        this.adapter.AcceptNullValue = false;
    }
    initJobs() {
        var ser = new encoding.SerializationContext(true);
        bind.GetJob('SelectPage');
        bind.Register({
            Name: 'openfacture', OnInitialize: (j, e) => {
                j.addEventListener('dblclick', 'dblclick', (e) => {
                    var f = j.Scop.Value as models.Facture;
                    this.app.OpenPage('Facture');
                });
            }
        });
        bind.Register({
            Name: 'facturevalidate', OnInitialize: (j, e) => {
                j.addEventListener('onclick', 'dblclick', (e) => {
                    var f = j.Scop.Value as models.Facture;
                    GData.apis.Facture.Validate(f, false, (n, x, i) => {
                        if (i === basics.DataStat.Success) {
                            f.Freeze();                    
                            GData.invalidateFactures.Remove(f);
                            UI.InfoArea.push('The Facture Is Valiated', true);
                        }
                        else UI.InfoArea.push('Error Occured When Validating The Facture', false);
                    });
                    
                });
            }
        });
    }

    Update() {
        GData.apis.Facture.SmartUpdate();
    }
}