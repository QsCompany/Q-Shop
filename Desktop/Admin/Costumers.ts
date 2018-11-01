import {mvc, utils, basic, Api, thread, encoding, net, bind, reflection, collection } from '../../lib/Q/sys/Corelib';
import {UI, conv2template} from './../../lib/Q/sys/UI';
import { models} from "../../abstract/Models";
import { funcs, GetVars, extern } from '../../abstract/extra/Common';
import {sdata, Controller} from '../../lib/Q/sys/System';
import { basics } from '../../abstract/extra/Basics';
import { filters } from '../../lib/Q/sys/Filters';
import { SearchData } from '../Search';
//import { Facebook } from '../../lib/Q/sys/Facebook';
import { Material } from '../../lib/Q/components/HeavyTable/script';
//import { value } from 'json|data.json';
import { data } from '../../assets/data/data';
import { components } from '../../lib/Q/components/ActionButton/script';

var GData: basics.vars;
GetVars((v) => {
    GData = v;
    return false;
});

export class Clients extends UI.NavPanel {
    private searchList: collection.ExList<models.Client, utils.IPatent<models.Client>>;
    private searchFilter: filters.list.StringFilter<models.Client> = new filters.list.StringFilter<models.Client>();

    public OnSearche(oldPatent: string, newPatent: string) {
        var t = this.searchList.Filter == this.searchFilter;
        this.searchFilter.Patent = new filters.list.StringPatent(newPatent);
        if (!t)
            this.searchList.Filter = this.searchFilter as any;
    }
    public get HasSearch(): UI.SearchActionMode { return UI.SearchActionMode.Instantany; }
    public set HasSearch(v: UI.SearchActionMode) { }
    OnKeyDown(e: KeyboardEvent) {
        if (!this.paginator.OnKeyDown(e)) {

            if (e.keyCode === UI.Keys.F1)
                this.getHelp({
                    "F2": "Add New",
                    "F9": "Regler Les Versments",
                    "F10": "Open Versments",
                    "Enter":"Edit",
                    "Suppr": "Delete",
                    
                });
            else if (e.keyCode === UI.Keys.F2)
                this.AddClient();
            else  if (this.adapter.SelectedIndex != -1)
                if (e.keyCode === 13)
                    this.EditClient();
                else if (e.keyCode === UI.Keys.Delete)
                    this.RemoveClient();
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
    private adapter: UI.ListAdapter<models.Client, any>;
    private paginator: UI.Paginator<models.Client>;
    constructor() {
        super("Clients", "Clients");
    }
    initialize() {
        super.initialize();
        this.Add(funcs.initializeSBox("Clients").container);
        var tbl: Material.HeavyTable<models.Client>;
        this.adapter = (tbl = new Material.HeavyTable<models.Client>(data.value.clientTable.def)).applyStyle('row');
        this.paginator = UI.Paginator.createPaginator(this.adapter, this.searchList = GData.__data.Costumers.Filtred(this.searchFilter), 10);
        this.adapter.AcceptNullValue = false;
        this.Add(this.paginator);

        tbl.setOrderHandler<this>({ Invoke: this.OrderBy, Owner: this });
    }
    OrderBy(e: Material.OrderByEventArgs<Material.HeavyTable<models.Client>>) {
        
        switch (e.orderBy) {
            case "Ref":
                return this.searchList.OrderBy((a, b) => e.state.factor * (a.Id - b.Id));
            case "FName":
                return this.searchList.OrderBy((a, b) => e.state.factor * (a.FullName || "").localeCompare(b.FullName || ""));
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

    Update() {
        GData.apis.Client.SmartUpdate();
    }
    AddClient() {
        GData.apis.Client.CreateNew();
    }

    RemoveClient() {
        GData.apis.Client.Delete(this.adapter.SelectedItem, null);
    }
    EditClient() {
        GData.apis.Client.Edit(this.adapter.SelectedItem, void 0);
    }
    Search() {
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
            this.lb.OnInitialized = (n) => n.AddRange([
                new UI.Glyph(UI.Glyphs.plusSign, false, 'Add'),
                new UI.Glyph(UI.Glyphs.edit, false, 'Edit'),
                new UI.Glyph(UI.Glyphs.fire, false, 'Delete'), funcs.createSparator(), this._creditCart
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
                new UI.Glyph(UI.Glyphs.search, false, 'Add')
            ]);
        }
        return this.rb;
    }

    //private static fb: Facebook;
    static ctor() {
        //this.fb = Facebook.Default();
    }

    SendMessageToFacebook() {
    //    UI.Modal.ShowDialog("<strong> Send Invitations to my friends", "Do you want realy to send invitation to your friends", (e) => {
    //        var fb = Clients.fb;
    //        if (e.Result === UI.MessageResult.ok) {
    //            if (!fb.IsConnected) {
    //                fb.RegisterScop([
    //                    "email", "public_profile",
    //                    "read_custom_friendlists",
    //                    "user_about_me", "user_birthday",
    //                    "user_friends",
    //                    "user_hometown", "user_location",
    //                    "invitable_friends"]);
    //                fb.Connect((fb) => {
    //                    this.sendInvitations();
    //                });
    //            }
    //            else this.sendInvitations();
    //        }
    //    }, "Send", "Cancel");
    }

    private sendInvitations() {
        //UI.Spinner.Default.Start('Facebook Is Connecting ....');
        //var fb = Clients.fb;
        //var isconnected = fb.IsConnected;
        //if (isconnected) {
        //    UI.Spinner.Default.Start('Please wait for moment until we send invitations to your friends');
        //    fb.getFriendsList((fb, list) => {
        //        UI.Modal.ShowDialog("My Friends", `<h1><ul> You have ${list.data.length} Friends</ul></h1>`);
        //        UI.Spinner.Default.Pause();
        //    });
        //}
        //else if (isconnected === null) {
        //    fb.Login((r) => {
        //        if (r.status === 'connected')
        //            this.sendInvitations();
        //        else {
        //            UI.Spinner.Default.Pause();
        //            UI.InfoArea.push('We cannot connect to facebook');
        //        }
        //    });
        //}
        //else {
        //    UI.Spinner.Default.Pause();
        //    UI.InfoArea.push('We cannot connect to facebook');
        //}
    }
    private callback(x, v, c) {
        switch (c.p.Type) {
            case UI.Glyphs.plusSign:
                (c.t as this).AddClient();
                break;
            case UI.Glyphs.edit:
                (c.t as this).EditClient();
                break;
            case UI.Glyphs.fire:
                (c.t as this).RemoveClient();
                break;
            case UI.Glyphs.search:
                (c.t as this).Search();
                break;

            case UI.Glyphs.creditCard:
                c.t.rm.Open(v, { Owner: c.t, Invoke: c.t.OnContextMenuFired }, null, true);
                break;
            default:
                UI.InfoArea.push("Unrechable Code");
                return;
        }
    }
    private lb: UI.Navbar<any>;
    private rb: UI.Navbar<any>;

    OnDeepSearch() {
        if (!this._deepSearch)
            this._deepSearch = new SearchData.Client;
        this._deepSearch.Open((x) => this.searchList.Filter = this._deepSearch as any);
    }
    private _deepSearch: SearchData.Client;

    _creditCart = new UI.Glyph(UI.Glyphs.creditCard, false, 'Versments Manager');
    rm: UI.RichMenu<string> = new UI.RichMenu(undefined, ["Regler", "Verser", "Supprimer", "", "Ouvrir"], this._creditCart);
    private OnContextMenuFired(r: UI.RichMenu<string>, selected: string) {
        if (selected === 'Ouvrir' || selected === 'Supprimer')
            this.OpenVersments(selected === 'Supprimer');
        else if (selected === 'Regler' || selected === 'Verser')
            this.verser(selected === 'Regler');
    }

    public OpenVersments(forDelete: boolean) {
        if (this.adapter.SelectedItem)
            GData.apis.Versment.OpenVersmentsOfClient(this.adapter.SelectedItem, (results, selected, fournisseur, success) => {
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
                                })
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
        if (!data) return UI.Modal.ShowDialog("ERROR", "Selecter une Client pour ajouter une versment");
        if (regler) return GData.apis.Versment.Regler(null, data);
        GData.apis.Versment.VerserTo(null, data);
    }
}