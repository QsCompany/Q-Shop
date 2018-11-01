import { UI } from "../lib/q/sys/UI";
import { defs } from "../lib/q/sys/defs";
import { collection,net, basic, bind, helper as ehelper, mvc, ScopicCommand, thread, encoding, css, $$, attributes, utils } from "../lib/q/sys/Corelib";
import { filters } from "../lib/q/sys/Filters";
import { models } from "../abstract/Models";
import { basics } from "../abstract/extra/Basics";
//import { GetVars } from "../abstract/extra/Common";
import { Controller } from "../lib/q/sys/System";
import { components } from "../lib/Q/components/ActionButton/script";
//import * as tmp from "template|../assets/templates/templates.mobile.html";
//import { Home } from "../App/Pages/Home";
import { context } from 'context';
import { Command } from "../abstract/Apis/FactureAchat";
import { resources, Common } from './Resources';
import { factureOpers } from "./Common";
import { GetVars } from "../abstract/extra/Common";

export namespace controls {
    
    export class Pop<T> extends UI.ContentControl {
        private static zindex = 13224000000;
        public static Default = new Pop(true);
        private date;
        constructor(isemutable: boolean) {
            super();
            this.View.addEventListener('touchstart', this);
            this.applyStyle('pop', 'card-container');
            this.OnClosed = new bind.FEventListener<(e: Common.IPopEventArgs<T>) => void>('', isemutable);
        }
        private ete: basic.DomEventHandler<any, any>;
        public Open(callback?: (e: Common.IPopEventArgs<T>) => void, owner?: any) {
            if (callback)
                if (owner != null) this.OnClosed.Add({ Invoke: callback, Owner: owner });
                else this.OnClosed.Add(callback);
            this.View.style.zIndex = String(++Pop.zindex);
            document.body.appendChild(this.View);
            this.Parent = UI.Desktop.Current;
            this.date = performance.now();
        }
        public Hide(msg: UI.MessageResult, data: T) {
            this.date = -1;
            var e = <Common.IPopEventArgs<T>>{ Result: msg, Pop: this, Data: data, Cancel: void 0 };
            this.OnClosed.PInvok('', [e], this);
            if (!e.Cancel)
                try {
                    this.View.remove();
                } catch (e) {
                }
        }
        handleEvent(e: TouchEvent) {
            if (e.srcElement != this.View) return;
            if (this.date == -1 || performance.now() - this.date < 1000) return;
            this.Hide(UI.MessageResult.abort, null);
        }
        public OnClosed: bind.FEventListener<basic.Invoker<(e: Common.IPopEventArgs<T>) => void>>;
    }

    export class Options extends UI.TControl<any>{
        ListView: UI.ListAdapter<{ Icon: string }, any>;
        Items = new collection.List<Common.IOption>(Object, [{ Title: "add" }, { Title: resources.MdIcon[resources.MdIcon.remove] }, { Title: resources.MdIcon[resources.MdIcon.unarchive] }, { Title: resources.MdIcon[resources.MdIcon.delete_sweep] }]);
        constructor() {
            super('mobile.nav-bottom', UI.TControl.Me);
            this.pop.OnClosed.Add({ Invoke: this.OnPopClosed, Owner: this });
        }
        initialize() {
            super.initialize();
        }
        setName(name: string, dom: Element, cnt: UI.JControl, e: bind.IJobScop) {
            if (name == 'ListView') {
                this.ListView = cnt as any;
                this.ListView.AcceptNullValue = true;
            }
        }

        OnClicked(e: TouchEvent, data: bind.EventData, scop: bind.Scop, v: bind.events) {
            this.pop.Hide(UI.MessageResult.ok, scop.Value as Common.IOption);
        }
        public Open() {
            this.pop.Content = this;
            this.pop.Open();
        }
        public pop = new Pop<Common.IOption>(false);
        public OnClosed = new bind.FEventListener<basic.Invoker<(s: this, e: Common.IPopEventArgs<Common.IOption>) => void>>('');
        private OnPopClosed(e: Common.IPopEventArgs<Common.IOption>) {
            this.OnClosed.PInvok('', [this, e], this);
        }

        private OkClick(e: TouchEvent, data: bind.EventData, scop: bind.Scop, v: bind.events) {
            this.pop.Hide(UI.MessageResult.Exit, <any>{});
        }
        private CancelClick(e: TouchEvent, data: bind.EventData, scop: bind.Scop, v: bind.events) {
            this.pop.Hide(UI.MessageResult.cancel, <any>{});
        }
    }

    export class SimpleEdit extends UI.TControl<SimpleEdit>{
        public static DPTitle = bind.DObject.CreateField<string, SimpleEdit>("Title", String);
        public Title: string;
        public Value: number;
        private card: HTMLElement;
        _hasValue_() { return true; }
        constructor(imutable: boolean) {
            super(resources.mobile.get('simpleedit'), UI.TControl.Me);
            this._view.addEventListener('click', (e) => { this.OnMouseDown(e); }, false);
            this.card = this._view.getElementsByClassName('green-card')[0] as any;
            this.OnClosed = new bind.FEventListener<(sender: this, value: number, isok: boolean) => void>('', imutable);
        }
        OkClicked(e: MouseEvent, data: bind.EventData, scop: bind.Scop, v: bind.events) {
            this.Close(true);
        }
        CancelClicked(e: MouseEvent, data: bind.EventData, scop: bind.Scop, v: bind.events) {
            this.Close(false);
        }
        OnMouseDown(e: MouseEvent) {
            if (performance.now() - this.start < 1000) return;
            var t = e.srcElement;
            if (this.card.contains(t)) return true;
            this.Close(false);
            e.stopImmediatePropagation();
            e.preventDefault();
            return true;
        }
        private Close(isok: boolean) {
            this.isOpen = false;
            UI.Desktop.Current.ReleaseKeyControl();
            try {
                if (document.body.contains(this._view))
                    this.View.remove();
                this.OnClosed.PInvok('', [this, this.Value, isok], null);
            } catch (e) { }
        }
        private box: HTMLInputElement;
        protected setName(name: string, dom: Element, cnt: UI.JControl) {
            if (name == 'box') this.box = dom as any;
        }
        private start;
        Open(value: number,editable?:boolean) {
            if (this.isOpen) return;
            this.isOpen = true;
            UI.Desktop.Current.GetKeyControl(this, this.OnKeyDown, []);
            this.start = performance.now();
            if (typeof value == 'number') this.Value = value;
            if (this.box) this.box.disabled = editable == undefined ? false : !editable;
            else this.OnCompiled = (n) => { this.box.disabled = editable == undefined ? false : !editable; };
            thread.Dispatcher.call(this, this.asyncOpen);
        }
        private asyncOpen() {
            this.Parent = UI.Desktop.Current;
            document.body.appendChild(this.View);
        }
        OnKeyDown(e: KeyboardEvent): UI.KeyboardControllerResult {
            if (e.keyCode == 13) this.Close(true);
            else if (e.keyCode == 27) this.Close(false);
            else return UI.KeyboardControllerResult.Release;
            e.stopImmediatePropagation();
            e.preventDefault();
            return UI.KeyboardControllerResult.Handled;
        }
        public OnClosed: bind.FEventListener<(sender: this, value: number, isok: boolean) => void>;
        private isOpen: boolean;
    }

    export namespace abstracts {

        export abstract class AppBase<T extends Common.IPage> extends UI.Layout<T> {
            Foot: UI.ServiceNavBar<UI.IItem>; SearchBox: UI.ActionText;
            protected abstract setName(name: string, dom: Element, cnt: UI.JControl);
            Search(data: string) {
                var p = this.SelectedPage;
                data = data.trim();
                if (p instanceof MobilePage)
                    p.Search(data);
            }

            constructor(dom: HTMLElement, public Teta: Common.ITeta) {
                super(dom);
                this.__Controller__ = bind.Controller.Attach(this, this);
                this.Value = this;
            }
            OnDispose() {
                ehelper.TryCatch(this.__Controller__, this.__Controller__.Dispose);
                return super.OnDispose();
            }
        }
        export abstract class MobilePage<Item> extends UI.TControl<any> implements Common.IPage {
            OnSelected = new bind.EventListener<(p: this) => void>(0);
            public Options: collection.List<Common.IOption> = new collection.List<Common.IOption>(Object);
            protected Items = new collection.ExList<Item, filters.list.StringPatent<Item>>(Object);
            ListView: UI.ListAdapter<Item, Item>;
            HasSearch: UI.SearchActionMode;
            OnSearche() {

            }
            OnDeepSearche() {

            }
            OnContextMenu() {

            }
            OnPrint() {

            }
            GetLeftBar() { return null; }
            GetRightBar() { return null; }
            ServiceType: UI.ServiceType = UI.ServiceType.Main;
            Callback(args: any) {
                return void 0;
            }
            Handled() {
                return false;
            }
            initialize() {
                super.initialize();
                this.Items.Filter = new filters.list.LStringFilter();
            }
            constructor(template: mvc.ITemplate | string | Function | UI.Template | HTMLElement, public Name: string, public Url: string, public Glyph: string) {
                super(template, UI.TControl.Me);
                this._view.classList.add('panel', 'left');
                this._view.addEventListener('touchstart', (e) => { this.TouchStart(e); });
            }
            setName(name: string, dom: Element, cnt: UI.JControl, e: bind.IJobScop) {
                if (name == 'ListView') {
                    this.ListView = cnt as any;
                    this.ListView.AcceptNullValue = false;
                    this.ListView.activateClass = this.activeClass();
                    return true;
                }
            }
            Search(data: string) {
                this.Items.Filter.Patent = new filters.list.StringPatent(data == "*" ? "" : data);
            }
            OnKeyDown(e: KeyboardEvent) {
                if (e.keyCode == 13) {
                    this.OnDoubleTab(this.ListView.SelectedItem);
                    e.stopImmediatePropagation(); e.preventDefault();
                    return true;
                }
                else return this.ListView.OnKeyDown(e);
            }
            dom?: Element;
            OnAttached() {
                var t = this.ListView && this.ListView.SelectedChild;
                if (t) (t.View as any).scrollIntoViewIfNeeded();
            }
            OnDetached() {
            }
            Update() {
            }
            abstract activeClass();
            OnOptionExecuted(e: Common.IPopEventArgs<Common.IOption>) {

            }
            private lastAccess: number;
            private lastCnt: Node;
            TouchEnd(e: TouchEvent, data: bind.EventData, scop: bind.Scop, v: bind.events) {
                var now = performance.now();
                var def = now - this.lastAccess;
                var node = this.lastCnt;
                this.lastAccess = now;
                this.lastCnt = data.dom;
                if (def <= 350 && def >= 100)
                    if (node == data.dom)
                        this.OnDoubleTab(this.ListView.SelectedItem);
                if (this.ListView.SelectedIndex == -1) return;
                var lts = this.lts;
                var elt = performance.now();
                if (elt - lts > 500) {
                    if (this.dist(e.changedTouches[0], this.lct) > 10) return;
                    var x = this.SearchParents<EMobileApp>(EMobileApp);
                    x && x.OpenOptions();
                }
                this.lts = elt + 1000;
            }
            private dist(a: Touch, b: Touch) {
                return Math.sqrt((a.screenX - b.screenX) * (a.screenX - b.screenX) + (a.screenY - b.screenY) * (a.screenY - b.screenY));
            }
            protected GetSubsOptions(): { Icon: string } { return; }
            protected OnSubsOptionExecuted(o: Common.IOption) {
                return false;
            }
            private lts: number = 0;
            private lct: Touch;
            TouchStart(e: TouchEvent) {
                this.lts = performance.now();
                this.lct = e.touches[0];
            }

            OnDoubleTab(item: Item) {
            }
            OnOptionOpening() { return false; }
        }
    }
    
    export class EMobileApp extends abstracts.AppBase<Common.IPage> {

        @attributes.property(collection.List, void 0)
        public Options: collection.List<Common.IOption>;
        ///Properties
        _panels: UI.DivControl;
        slogan: HTMLElement;
        menuContent: UI.ListAdapter<Common.IOption, any>;
        Header: HTMLElement;
        Name: string;
        NavList: UI.ListAdapter<Common.IPage, Common.IPage>;
        searchBar: UI.UISearch;
        public Items = new collection.List<Common.IPage>(Object);
        Main: UI.ContentControl;
        _selected: Element;
        ////
        toString() {
            return "EMobileApp";
        }
        protected showPage(page: Common.IPage) {
            if (!this.Main) {
                this.__Controller__.OnCompiled = {
                    Invoke: (a) => {
                        this.showPage(page);
                    }, Owner: this
                };
                return;
            }
            
            this.Main.Content && this.Main.Content.disapplyStyle('center');
            if (page) {
                page && page.applyStyle('center');
                this.Main.Content = page;
                this.menuContent.Source = page.Options;
                this.NavList.SelectedItem = page;
            }
            
        }
        line;
        protected Check(child: Common.IPage) {
            return child instanceof UI.JControl;
        }

        Foot: UI.ServiceNavBar<UI.IItem> = new UI.ServiceNavBar<UI.IItem>(this, true);
        constructor(dom: HTMLElement, Teta: Common.ITeta) {
            super(dom, Teta);
            var x = (e: Common.IPage) => {
                
            };

            this.Items.Listen = (e) => {
                if (e.event == collection.CollectionEvent.Added) {
                    if (e.newItem)
                        e.newItem.OnSelected.Add(x, context.NameOf(EMobileApp));
                } else if (e.event == collection.CollectionEvent.Removed) {
                    if (e.oldItem)
                        e.oldItem.OnSelected.Remove(context.NameOf(EMobileApp));
                } else if (e.event === collection.CollectionEvent.Replace) {
                    if (e.newItem)
                        e.newItem.OnSelected.Add(x, context.NameOf(EMobileApp));
                    if (e.oldItem)
                        e.oldItem.OnSelected.Remove(context.NameOf(EMobileApp));
                } else if (e.event == collection.CollectionEvent.Cleared) {
                    for (var i = 0; i < e.collection.length; i++) {
                        var t = e.collection[i];
                        if (t)
                            t.OnSelected.Remove(context.NameOf(EMobileApp));
                    }
                } else if (e.event == collection.CollectionEvent.Reset) {
                    for (var i = 0; i < e.collection.length; i++) {
                        var t = e.collection[i];
                        if (t)
                            t.OnSelected.Add(x, context.NameOf(EMobileApp));
                    }
                }
            }
        }
        protected _hasValue_() { return true; }
        protected setName(name: string, dom: Element, cnt: UI.JControl) {
            if (name === '_panels') {
                this._panels = new UI.DivControl(dom as HTMLElement); return
            }
            if (name == '_main') {
                this.Main = new UI.ContentControl(dom as HTMLElement);
                this.Main.Parent = this;
                return;
            }
            else if (name == 'slogan')
                dom.addEventListener('click', () => this.ToggleMenu());
            else if (name == "menuContent" ) {
                this.menuContent = cnt as any;
                return;
            }
            else if (name == 'Header') {
            }
            else if (name == 'searchBar') {
                this.searchBar = new UI.UISearch(dom as HTMLElement);
                this.searchBar.OnSearch = this.Search.bind(this);
                this.searchBar.Parent = this;
                var tt = this.searchBar.handleEvent;
                this.searchBar.handleEvent = (e) => {
                    this.Search((this as any).searchBar.inputEl.value);
                    tt.call(this.searchBar, e);
                };
                return;
            }
            else if (name == "NavList") {
                this.NavList = cnt as any;
                this.line = new bind.TwoDBind(bind.BindingMode.TwoWay, this, this.NavList, abstracts.AppBase.DPSelectedPage, UI.ListAdapter.DPSelectedItem, (a) => a, (b) => b);
                return;
            } else return;
            this[name] = dom as HTMLElement;
        }
        Add(child: Common.IPage) {
            return this;
        }

        private OnOptionClicked(e: MouseEvent, data: bind.EventData, scop: bind.Scop, v: bind.events) {
            if (!this.Header.classList.contains('menu-opened')) return;
            this.Header.classList.remove('menu-opened');
            var op = scop.Value as Common.IOption;
            if (op && op.OnOptionClicked)
                ehelper.TryCatch(op, op.OnOptionClicked, void 0, [op, this, this.SelectedPage]);
            ehelper.TryCatch(this.SelectedPage, this.SelectedPage.OnOptionExecuted, void 0, [op]);
        }
        private navClicked(e: MouseEvent, c: bind.EventData, d: bind.Scop, events: bind.events) {
            if (!document.webkitIsFullScreen) {
                var bd = document.body;
                bd.requestFullscreen && bd.requestFullscreen();
                bd.webkitRequestFullScreen && bd.webkitRequestFullScreen();
                bd.webkitRequestFullscreen && bd.webkitRequestFullscreen();
            }
            this.SelectedPage = d.Value;
        }

        public ToggleMenu() {
            $$(this.Header).toggleClass('menu-opened');
        }

        public SelectNaxtPage(): any { this.NavList.SelectedIndex++; }
        public SelectPrevPage(): any { this.NavList.SelectedIndex--; }
        public OpenOptions() {
            if (this.SelectedPage && this.SelectedPage.OnOptionOpening())
                this.subOptions.Open();
        }

        private OnSubsOptionClosed(option: Options, e: Common.IPopEventArgs<Common.IOption>) {
            var p = this.SelectedPage;
            p && p.OnOptionExecuted(e);
        }
        private subOptions = new Options();
        ///Events
        initialize() {
            ScopicCommand.Register({ Invoke: this.reRenderNavitem, Owner: this }, null, 'initNav');
            this.subOptions.OnClosed.Add({ Invoke: this.OnSubsOptionClosed, Owner: this });
            super.initialize();
        }
        Update(): any {
            this.SelectedPage && this.SelectedPage.Update();
        }
        OnKeyDown(e: KeyboardEvent): any | void {
            if (this.searchBar && this.searchBar.IsOpen) return true;
            return super.OnKeyDown(e);
        }
        OnDeepSearche(): any {
            this.searchBar.open();
        }
        Search(data: string) {
            var p = this.SelectedPage as any;
            data = data.trim();
            if (p && p.Search)
                p.Search(data);
        }
        OnAttached() {
            var p = this.SelectedPage;
            if (p) p.OnAttached();
        }
        
        ///

        ///
        private reRenderNavitem(name: string, dom: Element, scop: bind.Scop, param: any) {            
            var val = scop as Common.IPage;
            var a = dom as HTMLAnchorElement;
            var i = a.firstElementChild as HTMLDivElement;
            a.href = "#" + val.Url;
            val.dom = dom;
            i.innerText = val.Glyph;
            if (this.SelectedPage == null)
                this.SelectedPage = val;
        }
        ///
    }

    export class AuthApp extends EMobileApp {
        hors_conn: HTMLInputElement;
        toggleIcon: HTMLElement;
        signupForm: HTMLElement;
        loginForm: HTMLElement;
        _hasValue_() { return true; }
        constructor(teta: Common.ITeta) {
            super(resources.mobile.get('login-form').content.firstElementChild as any, teta);
            this.Value = new models.Login();
        }
        initialize() {
            super.initialize();
        }
        setName(name: string, dom: Element, cnt: UI.JControl) {
            this[name] = dom;
        }


        public Value: models.Login;
        public static id: string;
        _login(e?: MouseEvent, c?: bind.EventData, d?: bind.Scop, events?: bind.events) { this.login(); }
        login() {
            if (this.hors_conn.checked) {
                this.Teta.Setting.offline = true;
                this.Teta.Setting.Stat = Common.ServerStat.Connected;
                return;
            }

            this.Teta.Setting.Stat = Common.ServerStat.Connecting;
            resources.GData.requester.Post(models.Login, this.Value, null, (s, r, iss, hndl) => {
                if (!s.IsSuccess) {
                    return this.Teta.Setting.Stat = Common.ServerStat.UnAvaible;
                }
                this.Teta.Setting.Stat = iss ? Common.ServerStat.Connected : Common.ServerStat.Disconnected;
                if (iss) {
                    this.Teta.Setting.saveAuth();
                    resources.GData.requester.SetAuth('id', AuthApp.id = hndl.GetHeader('id'));
                }
                if (this.firstTime)
                    delete this.firstTime;


            });
        }
        _signup(e: MouseEvent, c: bind.EventData, d: bind.Scop, events: bind.events) {
            alert("Signup");
        }
        pwdForgotten(e: MouseEvent, c: bind.EventData, d: bind.Scop, events: bind.events) {
            alert("Pwd Forgotten");
        }
        hello(e: MouseEvent, c: bind.EventData, d: bind.Scop, events: bind.events) {
            alert("Hello ");
        }
        private i = true;
        public static toogle(log: HTMLElement, sing: HTMLElement) {
            sing.style.opacity = '0';
            sing.style.height = "1px";
            sing.style.display = '';
            var pd = window.getComputedStyle(log, null).getPropertyValue('padding-top');
            var pdb = window.getComputedStyle(log, null).getPropertyValue('padding-bottom');
            return css.animation.animates({
                animations: [{
                    dom: log,
                    props: [css.animation.constats.hideOpacity, css.animation.trigger('padding-top', parseInt(pd), 0, '', 'px'), css.animation.trigger('padding-bottom', parseInt(pdb), 0, '', 'px'), css.animation.trigger('height', log.clientHeight, 0, '', 'px')],
                    timespan: 1000,
                    oncomplete(e) {
                        e.dom.style.display = 'none';
                    }
                }, {
                    dom: sing,
                    props: [css.animation.constats.showOpacity, css.animation.trigger('height', 0, sing.scrollHeight + 1, '', 'px')],
                    timespan: 1000,
                    onstart(e) {
                        e.dom.style.display = 'block';
                    }
                }], interval: 100, timespan: 700
            });
        }
        private anim: css.animation.animations;
        _toggle(e: MouseEvent, c: bind.EventData, d: bind.Scop, events: bind.events) {
            this.toggleIcon.innerText = this.i ? 'create' : 'person';
            UI.JControl.toggleClass(this.toggleIcon, 'glyphicon-user');
            if (this.anim) css.animation.stopAnimations(this.anim);
            if (this.i = !this.i)
                this.anim = AuthApp.toogle(this.signupForm, this.loginForm);
            else this.anim = AuthApp.toogle(this.loginForm, this.signupForm);
        }

        private firstTime = true;

        public ExcuteOnCompiled(Invoke: (...args: any[]) => void, Owner?: any) {
            if (this.__Controller__) this.__Controller__.OnCompiled = { Invoke: Invoke, Owner: Owner };
            else
                Invoke.call(Owner, null);
        }

        Show() {
            
            if (this.firstTime) {
                this.firstTime = false;
                if (this.Teta.Setting.loadAuth()) {
                    this.ExcuteOnCompiled(this.login, this);
                    return;
                }
            }
            var d = UI.Desktop.Current;
            var i = 0, c = d.getChild(i);
            while (c) {
                if (c as any == this) { break; }
                c = d.getChild(++i);
            }
            if (!c)
                d.Add(this);
            d.Show(this);
        }
    }

    export class Settings extends EMobileApp {
        public static DPServerAddress = bind.DObject.CreateField<string, Settings>("ServerAddress", String, "", null, Settings.prototype.AddRessChanged);
        public static DPStat = bind.DObject.CreateField<Common.ServerStat, Settings>("Stat", Number, 0, Settings.prototype.OnStatChanged);
        public static DPPort = bind.DObject.CreateField<number, Settings>("Port", Number);


        public ServerAddress: string;
        public Stat: Common.ServerStat;
        public Port: number;

        hors_conn: HTMLInputElement;
        toggleIcon: HTMLElement;
        signupForm: HTMLElement;
        loginForm: HTMLElement;



        constructor(teta: Common.ITeta) {
            super(resources.mobile.get('settings').content.firstElementChild as any, teta);
            this.connectionCheker = new ECommon.checkConnection(this);
            this.loadIP();
        }
        static __fields__() { return [this.DPServerAddress, this.DPPort, this.DPStat] as any; }

        connect(e: MouseEvent, c: bind.EventData, d: bind.Scop, events: bind.events) {
            this.connectionCheker.request();
        }
        private _show(app: abstracts.AppBase<any>) {
            var d = UI.Desktop.Current;
            var i = 0, c = d.getChild(i);
            while (c) {
                if (c as any == app) { break; }
                c = d.getChild(++i);
            }
            if (!c)
                d.Add(app);
            d.Show(app);
        }
        setName(name: string, dom: Element, cnt: UI.JControl) {
            this[name] = dom;
            if (name === 'toggleIcon') this.toggleIcon.innerText = 'settings';
        }
        private anim: css.animation.animations;
        i = true;
        _toggle(e: MouseEvent, c: bind.EventData, d: bind.Scop, events: bind.events) {

            if (this.anim) css.animation.stopAnimations(this.anim);
            if (this.i = !this.i)
                this.anim = AuthApp.toogle(this.signupForm, this.loginForm);
            else this.anim = AuthApp.toogle(this.loginForm, this.signupForm);
            this.toggleIcon.innerText = this.i ? 'settings' : 'sms';
        }
        AddRessChanged(e: bind.EventArgs<string, this>) {
            var n = e._new || "";
            if (!n) return;
            var i0 = n.indexOf(':');
            var i1 = n.lastIndexOf(':');
            if (i1 > i0)
                thread.Dispatcher.call(this, () => { this.ServerAddress = n.substring(0, i1); });
        }
        offline: boolean;
        OnStatChanged(e: bind.EventArgs<Common.ServerStat, this>) {
            var d = UI.Desktop.Current;
            switch (e._new) {
                case Common.ServerStat.UnAvaible:
                    this.connectionCheker.stopThread();
                    if (this.offline == true)
                        return thread.Dispatcher.call(this, function () { this.Teta.Setting.Stat = Common.ServerStat.Connected; });
                    if (this.offline != null && basic.Settings.get('offline')) {
                        return thread.Dispatcher.call(this, function (this: &Settings) {
                            if (confirm('Do you want to run offline mode')) {
                                this.offline = true;
                                this.Teta.Setting.Stat = Common.ServerStat.Connected;
                                return;
                            } else this.offline = false;
                        });
                    }
                    this._show(this);
                    break;
                case Common.ServerStat.Disconnected:
                    this.connectionCheker.stopThread();
                    this.saveIP();
                    this.Teta.Auth.Show();
                    break;
                case Common.ServerStat.Connected:
                    this.connectionCheker.startThread();
                    this.saveAuth();
                    this.saveIP();
                    this._show(this.Teta.App);
                    break;
                default:
            }
        }

        initialize() {
            super.initialize();
            this.loadIP();
        }

        public Recheck(callback?: Controller.RequestCallback<any>): this {
            this.connectionCheker.request(callback);
            return this;
        }
        private get Address() {
            return this.ServerAddress + (this.Port ? ':' + this.Port : '');
        }
        private Connect() {
            if (this.hors_conn.checked) {
                this.Teta.Setting.offline = true;
                this.Teta.Setting.Stat = Common.ServerStat.Connected;
                return;
            }
            try {
                if (this.ServerAddress.lastIndexOf('/') == this.ServerAddress.length - 1) this.ServerAddress = this.ServerAddress.substring(0, this.ServerAddress.length - 1);
                var t = new System.basics.Url(this.Address);
                if (!t.IsExternal) return alert("L'address doit etre commencer par (http://) ou par (https://) ou par autres shemas ");
                __global.ApiServer = t;
            } catch (e) {
                alert('Un Error Occured check your entities');
                return;
            }
            this.Recheck();

        }
        private connectionCheker: ECommon.checkConnection;

        public Show() {
            this.connectionCheker.stopThread();
            this.connectionCheker.request((a, b: any, c, d) => {
                this.OnStatChanged({ _new: b == null ? Common.ServerStat.UnAvaible : b == true ? Common.ServerStat.Connected : Common.ServerStat.Disconnected } as any);
            });
            super.Show();
        }

        private saveIP() {
            try {
                localStorage.setItem('ip', this.ServerAddress);
                localStorage.setItem('port', String(this.Port));
            } catch (e) {
            }
        }
        private loadIP() {
            this.ServerAddress = localStorage.getItem('ip');
            this.Port = parseInt(localStorage.getItem('port'));
        }

        public saveAuth() {
            try {
                localStorage.setItem('auth', JSON.stringify(encoding.SerializationContext.GlobalContext.reset().ToJson(this.Teta.Auth.Value)));
            } catch (e) {
            }
        }
        public loadAuth(): boolean {
            var v = localStorage.getItem('auth');
            if (v) try {
                __global.ApiServer = new System.basics.Url(localStorage.getItem('ip') || 'http://192.168.1.2');
                this.Teta.Auth.Value.FromJson(JSON.parse(v), encoding.SerializationContext.GlobalContext.reset());
                return true;
            } catch (e) {
            }
            return false;
        }
    }
}

export namespace ECommon {
    export class checkConnection extends Controller.Api<any> {
        private http: XMLHttpRequest = new XMLHttpRequest();
        request(callback?: Controller.RequestCallback<any>): any {
            resources.GData.requester.Request(controls.Settings, "CHECKCONNECTION", null, null, callback);
        }
        private thread: number;
        private _shema: net.RequestMethodShema = { Method: net.WebRequestMethod.Get, Name: 'CHECKCONNECTION', SendData: false, ParamsFormat: basic.StringCompile.Compile("") };

        startThread() {
            clearInterval(this.thread);
            this.thread = setInterval(() => { this.request(); }, 10000);
        }

        stopThread() {
            clearInterval(this.thread);
            this.thread = -1;
        }
        Register(method: net.RequestMethodShema): void {

        }
        ERegister(method: net.WebRequestMethod, name: string, paramsFormat: string, sendData: boolean): void {
        }
        GetMethodShema(m: string | net.RequestMethodShema | net.WebRequestMethod): net.RequestMethodShema {
            return this._shema;
        }
        GetType() {
            return controls.Settings;
        }
        GetRequest(data: any, shema: string | net.RequestMethodShema | net.WebRequestMethod, params: net.IRequestParams): net.RequestUrl {
            return new net.RequestUrl(__global.GetApiAddress('/~checklogging'), null, null, net.WebRequestMethod.Get, false);
        }
        OnResponse(response: JSON | boolean, data: any, context: encoding.SerializationContext) {
            if (response === false)
                this.settings.Stat = Common.ServerStat.Disconnected;
            else if (response === true)
                this.settings.Stat = Common.ServerStat.Connected;
            else
                this.settings.Stat = Common.ServerStat.UnAvaible;
        }
        constructor(public settings: controls.Settings) {
            super(true);
        }
    }    
}
