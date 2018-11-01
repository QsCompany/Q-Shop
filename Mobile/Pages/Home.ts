import { controls as cnt, controls } from "../Core";

import { models } from "../../abstract/Models";
import { bind, utils, BuckupList, collection, thread, basic, Api, encoding, attributes } from "../../lib/q/sys/Corelib";
import { resources, Common } from "../Resources";
import { factureOpers, ArticleManager } from "../Common";
import { UI } from "../../lib/q/sys/UI";
import { filters } from "../../lib/q/sys/Filters";
import { context } from "context";


export namespace Pages {
    export class Home extends cnt.abstracts.MobilePage<models.Product> {
        static __fields__() { return [this.DPFacture]; }
        private Products = resources.GData.__data.Products;
        constructor(private app: App) {
            super(resources.mobile.get('home'), "Shop", "", 'home');
        }

        initialize() {
            super.initialize();
            this.Options.Add({ Title: 'Update', OnOptionClicked: this.Update.bind(this) });
        }
        activeClass() { return "selectedProduct"; }
        OnFullInitialized() { super.OnFullInitialized(); }
        OnCompileEnd(cnt: bind.Controller) {
            super.OnCompileEnd(cnt);
            resources.GData.apis.Category.Update();
            resources.GData.requester.Request(models.Products, "GETCSV", void 0, void 0, (ths, json, iss, req) => {
                resources.GData.__data.Products.FromCsv(req.Response, encoding.SerializationContext.GlobalContext);
                this.Items.Source = resources.GData.__data.Products;
            });
        }
        Update() { this.SmartUpdate(); }
        SmartUpdate(callback?: (d: Date, iss) => void) {
            var prd = resources.GData.db.Get('Products');
            if (prd == null) {
                resources.GData.db.CreateTable('Products', models.Product);
            }
            prd.table.LoadTableFromDB(resources.GData.__data.Products, () => {
                var dt = Date.now();
                resources.GData.apis.Product.SmartUpdate(new Date(prd.info.LastUpdate || 0));
            });
        }
        OnAttached() {
        }
        private t = new controls.SimpleEdit(true);

        public static DPFacture = bind.DObject.CreateField<models.Facture, Home>("Facture", models.Facture, null, Home.prototype.FactureChanged);
        public Facture: models.Facture;
        private FactureChanged(e: bind.EventArgs<models.Facture, this>) {
            this.unobserve(e._old);
            this.observe(e._new);
        }
        private articleChanged: collection.ListEventHandler<models.Article> = { Owner: this, Invoke: this.OnArticleChanged };

        private unobserve(f: models.Facture) {
            if (f) {
                f.UnObserve(models.Facture.DPArticles, this.OnArticlesChanged);
                this.rebuild(f.Articles, null);
            }
        }
        private observe(f: models.Facture) {
            if (f) {
                f.Observe(models.Facture.DPArticles, this.OnArticlesChanged, this);
                this.rebuild(null, f.Articles);
            }
        }

        private OnArticlesChanged(s: bind.PropBinding, e: bind.EventArgs<models.Articles, models.Facture>) {
            this.rebuild(e._old, e._new);
        }
        rebuild(o: models.Articles, n: models.Articles) {
            if (o) {
                o.Unlisten = this.articleChanged;
                for (var i = o.Count - 1; i >= 0; i--) {
                    let p: models.Product | models.Article;
                    (p = (p = o.Get(i)) && p.Product) && (p.CurrentArticle = null);
                }
            }
            if (n) {
                n.Listen = this.articleChanged;
                for (var i = n.Count - 1; i >= 0; i--) {
                    var a: models.Article = n.Get(i);
                    let p: models.Product;
                    (p = a && a.Product) && (p.CurrentArticle = a);
                }
            }
        }

        private OnArticleChanged(e: utils.ListEventArgs<number, models.Article>) {
            this.rebuild(this.Facture.Articles, this.Facture.Articles);
        }

        private exec(a: models.Article, o: Common.IOption) {
            debugger;
            if (o.Title == 'add')
                a.Count++;
            else if (o.Title == 'remove')
                a.Count--;
            else if (o.Title == 'unarchive') {
                this.t
                thread.Dispatcher.call(this, function (a) {
                    this.t.Open(a.Count);
                    this.t.OnClosed.Add((s, v, is) => {
                        if (!is) return;
                        a.Count = v;
                    });
                }, a);
            }
            else if (o.Title == 'delete_sweep') {
                a.Count = 0;
            }
        }
        private bl: BuckupList<models.Article>;
        OnOptionOpening() {
            var f = this.Facture;
            var p = this.ListView.SelectedItem;
            if (!p) return;
            this.fop.Init(this.Facture, p && p.CurrentArticle, p, this.t);
            return this.fop.OnOptionOpening();
        }
        OnOptionExecuted(e: Common.IPopEventArgs<Common.IOption>) {
            var f = this.Facture;
            var p = this.ListView.SelectedItem;
            this.fop.Init(this.Facture, p && p.CurrentArticle, p, this.t);
            return this.fop.OnOptionExecuted(e);
        }
        private fop = new factureOpers();
        OnSweep(item: models.Product) {

        }
    }

    export class Factures extends cnt.abstracts.MobilePage<models.Facture> {
        constructor(private app: App) {
            super(resources.mobile.get('factures'), "Factures", "", "library_books");
        }
        initialize() {
            debugger;
            super.initialize();
            this.Options.Add({ Title: "Update ", OnOptionClicked: this.Update.bind(this) });
            this.Options.Add({ Title: "Ouvrir ", OnOptionClicked: this.ShowFacture.bind(this) });
            this.Options.Add({ Title: "Modifier ", OnOptionClicked: this.EditFacture.bind(this) });
            this.Options.Add({ Title: "Nouveau ", OnOptionClicked: this.NewFacture.bind(this) });
            this.Options.Add({ Title: "Delete ", OnOptionClicked: this.DeleteFacture.bind(this) });
            this.Items.Source = resources.GData.__data.Factures;
        }
        activeClass() { return "profile-cart-active"; }
        OnFullInitialized() { super.OnFullInitialized(); }
        OnCompileEnd(cnt: bind.Controller) {
            super.OnCompileEnd(cnt);
            resources.GData.apis.Client.Update();
            resources.GData.apis.Agent.Update();
            resources.GData.requester.Request(models.Factures, "GETCSV", void 0, void 0, (ths, json, iss, req) => {
                resources.GData.__data.Factures.FromCsv(req.Response, encoding.SerializationContext.GlobalContext);
            });
        }
        OnDoubleTab(item: models.Facture) {
            this.app.ShowFacture(item);
        }

        /** Main Operations ***/

        Update() {
            resources.GData.apis.Facture.SmartUpdate();
        }
        NewFacture() {
            this.app.NewFacture();
        }
        DeleteFacture() {
            this.app.DeleteFacture();
        }
        ShowFacture() {
            this.app.ShowFacture(this.ListView.SelectedItem);
        }
        EditFacture() {
            this.app.OpenFacture(this.ListView.SelectedItem);
        }
    }

    export class Facture extends cnt.abstracts.MobilePage<models.Article> {
        public static DPSelectedFacture = bind.DObject.CreateField<models.Facture, Facture>("SelectedFacture", models.Facture, null, Facture.prototype.OnFactureChanged);
        public SelectedFacture: models.Facture;
        static __fields__() { return [this.DPSelectedFacture]; }

        constructor(private app: App) {
            super(resources.mobile.get('facture'), "Facture", "", "receipt");
            this.OnServerResponse = this.OnServerResponse.bind(this);
        }
        initialize() {
            super.initialize();
            this.Options.Add({ Title: 'Metre a jour', OnOptionClicked: this.Update.bind(this) });
            this.Options.Add({ Title: 'Modifier', OnOptionClicked: this.EditFacture.bind(this) });
            this.Options.Add({ Title: 'Ouvrir', OnOptionClicked: this.ShowFacture.bind(this) });
            this.Options.Add({ Title: 'Fermer', OnOptionClicked: this.CloseFacture.bind(this) });
        }
        activeClass() { return "selectedProduct"; }
        OnFullInitialized() { super.OnFullInitialized(); }
        Update() {
            if (this.SelectedFacture)
                resources.GData.apis.Facture.UpdateArticlesOf(this.SelectedFacture, this.OnServerResponse);
        }
        DeleteFacture() {
            this.app.DeleteFacture();
        }
        ShowFacture() {
            this.app.ShowFacture(this.SelectedFacture);
        }
        CloseFacture() {
            this.app.CloseFacture(this.SelectedFacture);
        }
        EditFacture() {
            this.app.OpenFacture(this.SelectedFacture);
        }
        private OnServerResponse(f: models.Facture, iss: boolean, c: basic.DataStat) {
            if (c !== basic.DataStat.Success) alert('Fail to load facture due to :' + basic.DataStat[c]);
        }
        OnDoubleTab(a: models.Article) {
            ArticleManager.editArticle(this.SelectedFacture, a, a && a.Product);
        }

        saveArticle(a: models.Article, count: number) {
            var bc = a.CreateBackup();
            var f = this.SelectedFacture;
            a.Count = count;
            if (count)
                resources.GData.apis.Article.Save(a, (e) => {
                    if (e.Error == basic.DataStat.Success) {
                        a.Commit(bc);
                    } else {
                        alert('L\'article n\'est pas sauvegarder');
                        a.Rollback(bc);
                    }
                });
            else
                resources.GData.apis.Article.Delete(a, (e) => {
                    if (e.Error == basic.DataStat.Success) {
                        a.Commit(bc);
                        f.Articles.Remove(a);
                        a.Product.CurrentArticle = null;
                    } else {
                        alert('L\'article n\'est pas sauvegarder');
                        a.Rollback(bc);
                    }
                });
        }

        private OnFactureChanged(e: bind.EventArgs<models.Facture, Facture>) {
            var f = e._new;
            this.Items.Source = f && f.Articles;
            this.Update();
        }

        OnOptionOpening() {
            var f = this.SelectedFacture;
            var p = this.ListView.SelectedItem;
            if (!p) return;
            this.fop.Init(f, p, p && p.Product, this.t);
            return this.fop.OnOptionOpening();
        }
        OnOptionExecuted(e: Common.IPopEventArgs<Common.IOption>) {
            var f = this.SelectedFacture;
            var a = this.ListView.SelectedItem;
            if (!a) return;
            this.fop.Init(f, a, a.Product, this.t);
            return this.fop.OnOptionExecuted(e);
        }

        private fop = new factureOpers();
        private t = new controls.SimpleEdit(true);
    }

    export class App extends controls.EMobileApp {
        DeleteFacture(): any {
            throw new Error("Method not implemented.");
        }
        private home: Home;
        public factures: Factures;
        public facture: Facture;
        constructor(teta: Common.ITeta) {
            super(resources.mobile.get('app').content.firstElementChild as HTMLElement, teta);
            this.Foot = new UI.ServiceNavBar<UI.IItem>(this, true);
        }
        public initialize() {
            debugger;
            super.initialize();
            this.Items.Add(this.factures = new Pages.Factures(this));
            this.Items.Add(this.facture = new Pages.Facture(this));
            this.Items.Add(this.home = new Pages.Home(this));
            this.__Controller__.OnCompiled = {
                Owner: this, Invoke: this.OnFullCompilled
            }
            this.dbHfFf = new bind.TwoDBind(bind.BindingMode.TwoWay, this.home, this.facture, Home.DPFacture, Facture.DPSelectedFacture, (a) => a, a => a);
            this.initApis();
        }
        private dbHfFf;
        OnFullCompilled(t: bind.Controller) {
            this.SelectedPage = this.home as any;
        }
        public ShowFacture(facture: models.Facture) {
            this.facture.SelectedFacture = facture;
            this.SelectedPage = this.facture;
        }
        public EditFacture(facture: models.Facture) {
            this.facture.SelectedFacture = facture;
            this.SelectedPage = this.home;
        }

        OpenFacture(f: models.Facture) {
            if (!f) return;
            resources.GData.apis.Facture.OpenFacture(f, (item, su) => {
                if (su) {
                    item.IsOpen = true;
                    this.EditFacture(item);
                    UI.InfoArea.push("La Facture est bien ouvrir", true);
                }
                else alert("Failed to open facture .Sory");
            });
        }

        CloseFacture(f: models.Facture) {
            if (!f) return;
            resources.GData.apis.Facture.CloseFacture(f, (item, su) => {
                if (su) {
                    UI.InfoArea.push("La Facture est bien fermer", true);
                    item.IsOpen = false;
                } else alert("Failed to close facture .Sory");
            });
        }
        private t: controls.Pop<any>;
        private ListView: UI.ListAdapter<models.Client, any>
        private initializeNF() {
            this.t = new controls.Pop(true);
            var d = new UI.TControl('mobile.newFacture', {
                data: this.list, OkClicked: (a, b, c, d) => {
                    this.t.Hide(UI.MessageResult.ok, void 0);
                }, CancelClicked: (a, b, c, d) => {
                    this.t.Hide(UI.MessageResult.cancel, void 0);

                }
            });
            (d as any).setName = (name: string, dom: Element, cnt: UI.JControl, e: bind.IJobScop) => {
                if (name == 'ListView') {
                    this.ListView = cnt as any;
                    this.ListView.AcceptNullValue = true;
                }
            }
            resources.GData.apis.Client.Update();
            this.t.Content = d;
        }

        NewFacture() {
            if (!this.t) this.initializeNF();
            this.t.Open((e) => {
                if (e.Result == UI.MessageResult.ok) {
                    var client = this.ListView.SelectedItem;
                    if (!client) {
                        e.Cancel = true;
                        UI.InfoArea.push("Select One Client Please");
                        return;
                    }
                    var f = new models.Facture(0);
                    resources.GData.requester.Request(models.Facture, "CREATE", f, { CId: client.Id, Type: models.BonType.Bon, Abonment: models.Abonment.Detaillant, TType: models.TransactionType.Vente }, (a, b, c) => {
                        if (!c) {
                            UI.InfoArea.push("Creation of Facture Failed");
                        } else {
                            resources.GData.__data.Factures.Add(a.data);
                            this.EditFacture(f);
                        }
                    });
                }
            }, this);
        }

        private list = resources.GData.__data.Costumers.Filtred(window['fltr'] = new filters.list.LStringFilter());

        initApis() {
            bind.NamedScop.Create("qdata", resources.GData.__data);
            var self = this;
            Api.RegisterApiCallback({
                Name: "ShowFacture",
                DoApiCallback(t, a, b) {
                    self.ShowFacture(b.data);
                }
            });

            Api.RegisterApiCallback({
                Name: "OpenFacture",
                DoApiCallback(t, a, b) {
                    self.OpenFacture(b.data);
                }
            });

            Api.RegisterApiCallback({
                Name: "CloseFacture",
                DoApiCallback(t, a, b) {
                    self.CloseFacture(b.data);
                }
            });
        }
    }
}
bind.Register({
    Name: "search",
    OnInitialize(this: basic.IJob, j, e) {
        window['srch'] = this;
        var d = j.dom as HTMLInputElement;
        if (!(d instanceof HTMLInputElement)) console.debug("Un Expected Value Type");
        var fltr = j.Scop.Value as collection.ExList<any, any>;
        d.addEventListener(d.hasAttribute('autosearch') ? 'input' : 'change', function (e) {
            fltr.Filter.Patent = new filters.list.StringPatent(this.value.toString())
        });
    },
    Todo(j, e) {
    }
});