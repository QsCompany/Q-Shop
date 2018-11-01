import {UI, conv2template} from '../../lib/Q/sys/UI';
import {mvc, utils, basic, Api, thread, encoding, net, bind, reflection, collection } from '../../lib/Q/sys/Corelib';
import {sdata, Controller} from '../../lib/Q/sys/System';
import { models } from "../../abstract/Models";
import { funcs, GetVars, extern, Facture } from '../../abstract/extra/Common';
import { basics } from '../../abstract/extra/Basics';
import { SearchData } from '../Search';
import { filters } from '../../lib/Q/sys/Filters';

var b = true;
var GData: basics.vars;
GetVars((v) => {
    GData = v;
    return false;
});

interface ruscallback { t: RegularUsersService, p: UI.Glyph }

export interface IUserOperations {
    ChangePermission();
    Lock();
    Validate();

    Delete();
    Edit();
    AddUser();

    Filter();
    Search();
}

class RegularUsersService {
    private permission: UI.Glyph;
    private lock: UI.Glyph;
    private delete: UI.Glyph;
    private validate: UI.Glyph;

    private add: UI.Glyph;
    private edit: UI.Glyph;
    private lb: UI.Navbar<any>;
    private rb: UI.Navbar<any>;

    private srch: UI.Glyph;
    private filter: UI.Glyph;

    GetLeftBar(target: IUserOperations) {
        if (!this.lb) {
            this.lb = new UI.Navbar<any>();
            this.permission = new UI.Glyph(UI.Glyphs.flag, false, 'Permissions');
            this.validate = new UI.Glyph(UI.Glyphs.check, false, 'Validate');
            this.lock = new UI.Glyph(UI.Glyphs.lock, false, 'Lock');
            var oldget = this.lb.getTemplate;
            this.lb.getTemplate = (c) => {
                var x = new UI.Anchore(c);
                var e = oldget(x);
                e.addEventListener('click', this.callback, { t: this, p: c as UI.Glyph });
                return e;
            }
            this.lb.OnInitialized = n => n.AddRange([this.permission, this.validate, this.lock]);
        }
        this._targer = target;
        return this.lb;
    }
    callback(s: UI.JControl, e: Event, p: ruscallback) {
        var t = p.t._targer;
        if (t)
            switch (p.p.Type) {
                case UI.Glyphs.flag:
                    t.ChangePermission();
                    return;
                case UI.Glyphs.check:
                    t.Validate();
                    return;
                case UI.Glyphs.lock:
                    t.Lock();
                    return;
                default:
                    throw "Unreachable Code";
            }
    }
    callback_right(s: UI.JControl, e: Event, p: ruscallback) {
        var t = p.t._targer;
        if (t)
            switch (p.p.Type) {
                case UI.Glyphs.plusSign:
                    t.AddUser();
                    return;
                case UI.Glyphs.listAlt:
                    t.Edit();
                    return;
                case UI.Glyphs.trash:
                    t.Delete();
                    return;
                case UI.Glyphs.search:
                    t.Search();
                    return;
                case UI.Glyphs.filter:
                    t.Filter();
                default:
                    throw "Unreachable Code";
            }
    }
    GetRightBar(target: IUserOperations) {
        if (!this.rb) {
            this.rb = new UI.Navbar<any>();
            this.add = new UI.Glyph(UI.Glyphs.plusSign, false, 'Add');
            this.edit = new UI.Glyph(UI.Glyphs.listAlt, false, 'Edit');
            this.delete = new UI.Glyph(UI.Glyphs.trash, false, 'Delete');

            this.srch = new UI.Glyph(UI.Glyphs.search, false, 'Search');
            this.filter = new UI.Glyph(UI.Glyphs.filter, false, 'Filter');

            var oldget = this.rb.getTemplate;
            this.rb.getTemplate = (c) => {
                var x = new UI.Anchore(c);
                var e = oldget(x);
                e.addEventListener('click', this.callback_right, { t: this, p: c as UI.Glyph });
                return e;
            }

            this.rb.OnInitialized = n => n.AddRange([this.filter, this.srch, funcs.createSparator(), this.add, this.edit, this.delete]);
        }
        this._targer = target;
        return this.rb;
    }
    private set Target(c: IUserOperations) { this._targer = c; }
    private _targer: IUserOperations;
}

export class RegularUsers extends UI.NavPanel implements IUserOperations {
    
    private adapter: UI.ListAdapter<models.Login, any> = new UI.ListAdapter<any, any>('Client.Validation', 'UnRegUser.row');
    private searchFilter: filters.list.StringFilter<models.Login> = new filters.list.StringFilter<models.Login>();

    searchList: collection.ExList<models.Login, utils.IPatent<models.Login>>;
    OnDeepSearch() {
        if (!this._deepSearch)
            this._deepSearch = new SearchData.Login;
        this._deepSearch.Open((x) => {
            var t = this.searchList.Filter == this._deepSearch as any;
            this.searchList.Filter = this._deepSearch as any;
            if (t) this.searchList.Reset();
        });
    }
    private _deepSearch: SearchData.Login;
    public OnSearche(oldPatent: string, newPatent: string) {
        var t = this.searchList.Filter == this.searchFilter;
        this.searchFilter.Patent = new filters.list.StringPatent(newPatent);
        if (!t)
            this.searchList.Filter = this.searchFilter as any;
        else this.searchList.Reset();
    }
    
    constructor() {
        super('regular_users', "Regular Comptes");
        this.Title = "Regular Comptes";
    }

    OnKeyDown(e: KeyboardEvent) {
        if (!this.adapter.OnKeyDown(e))
            super.OnKeyDown(e);
    }
    initialize() {
        super.initialize();
        this.Add(this.adapter);
        this.adapter.OnInitialized = (p) => this.Update();
        this.searchList = GData.validateLogins.Filtred(this.searchFilter);
    }
    Update() {
        GData.validateLogins.Clear();
        GData.requester.Get(models.Logins, GData.validateLogins, null,
            (s, r, iss) => {
                if (iss) this.adapter.Source = this.searchList;
            }, (r, t) => r.Url = "/_/Users?Valide=True");
    }
    GetLeftBar() { return userService.GetLeftBar(this); }
    GetRightBar() { return userService.GetRightBar(this); }


    public get SelectedUser(): models.Login { return this.adapter.SelectedItem; }
    ChangePermission() { UI.InfoArea.push("The Functionality Is Not Implimented Yet"); }
    Lock() {
        var t = this.SelectedUser;
        if (t) Api.RiseApi('lockuser', { data: t });
    }
    Validate() {

        var t = this.SelectedUser;
        if (t) Api.RiseApi('validateuser', { data: t });
    }

    Delete() {
        var t = this.SelectedUser;
        if (t) Api.RiseApi('removeuser', { data: t });
    }
    Edit() { UI.InfoArea.push("The Functionality Is Not Implimented Yet"); }
    AddUser() { UI.InfoArea.push("The Functionality Is Not Implimented Yet"); }

    Filter() { UI.InfoArea.push("The Functionality Is Not Implimented Yet"); }
    Search() { UI.InfoArea.push("The Functionality Is Not Implimented Yet"); }

}
export class UnRegularUsers extends UI.NavPanel implements IUserOperations {
    searchList: any;
    private adapter: UI.ListAdapter<models.Login, any> = new UI.ListAdapter<any, any>('Client.Validation', 'RegUser.row');
    private searchFilter: filters.list.StringFilter<models.Login> = new filters.list.StringFilter<models.Login>();


    OnDeepSearch() {
        if (!this._deepSearch)
            this._deepSearch = new SearchData.Login;
        this._deepSearch.Open((x) => {
            var t = this.searchList.Filter == this._deepSearch as any;
            this.searchList.Filter = this._deepSearch as any;
            if (t) this.searchList.Reset();
        });
    }
    private _deepSearch: SearchData.Login;
    public OnSearche(oldPatent: string, newPatent: string) {
        this.searchFilter.Patent = new filters.list.StringPatent(newPatent);
    }

    constructor() {
        super('blocked_users', "Blocked Comptes");
        this.Title = "Blocked Comptes";
        
    }

    OnKeyDown(e: KeyboardEvent) {
        if (!this.adapter.OnKeyDown(e))
            super.OnKeyDown(e);
    }
    initialize() {
        super.initialize();
        this.Add(this.adapter);
        this.adapter.OnInitialized = (p) => this.Update();
        this.searchList = GData.invalidateLogins.Filtred(this.searchFilter);
    }
    Update() {
        GData.invalidateLogins.Clear();          
        GData.requester.Get(models.Logins, GData.invalidateLogins, null,
            (s, r, iss) => {
                if (iss) this.adapter.Source = this.searchList;
            }, (r, t) => {
                r.Url = "/_/Users?Valide=False";
            });
    }
    GetLeftBar() { return userService.GetLeftBar(this); }
    GetRightBar() { return userService.GetRightBar(this); }
    ChangePermission() { UI.InfoArea.push("The Functionality Is Not Implimented Yet"); }
    Lock() { var t = this.SelectedUser; if (t) Api.RiseApi('lockuser', { data: t }); }
    Validate() { var t = this.SelectedUser; if (t) Api.RiseApi('validateuser', { data: t }); }

    Delete() { var t = this.SelectedUser; if (t) Api.RiseApi('removeuser', { data: t }); }
    Edit() { UI.InfoArea.push("The Functionality Is Not Implimented Yet"); }
    AddUser() { UI.InfoArea.push("The Functionality Is Not Implimented Yet"); }

    Filter() { UI.InfoArea.push("The Functionality Is Not Implimented Yet"); }
    Search() { UI.InfoArea.push("The Functionality Is Not Implimented Yet"); }
    public get SelectedUser(): models.Login { return this.adapter.SelectedItem; }
}


var userService = new RegularUsersService();
