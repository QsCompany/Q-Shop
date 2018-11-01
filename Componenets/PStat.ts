import { bind, net, basic, Api, encoding, Common } from "../lib/Q/sys/Corelib";
import { UI } from "../lib/Q/sys/UI";
import { models } from "../abstract/Models";
import {  data } from "../assets/data/data";
import { Material } from "../lib/q/components/HeavyTable/script";
//import { GetVars } from "../Desktop/Common";
//import { basics } from "../Desktop/Basics";
import { sdata } from "../lib/Q/sys/System";
import { GetVars, funcs } from "../abstract/extra/Common";
import { basics } from "../abstract/extra/Basics";
var GData: basics.vars;

GetVars((data) => { GData = clone(data); return false; });
export namespace Statistique {
    export namespace Views {
        export class ProduitStat extends UI.TControl<Views.ProduitStat>{
            private _dealer: UI.ProxyAutoCompleteBox<models.Client | models.Fournisseur> = null;
            private _product: UI.ProxyAutoCompleteBox<models.Product> = null;
            private dealer: HTMLInputElement = null;
            private product: HTMLInputElement = null;
            private from: HTMLInputElement = null;
            private to: HTMLInputElement = null;
            private _list: ListOfArticles | ListOfFakePrices;
            get DealersSource() { return this._dealers; }
            public static DPFrom = bind.DObject.CreateField<Date, ProduitStat>("From", Date);
            public From: Date;

            

            public static DPTo = bind.DObject.CreateField<Date, ProduitStat>("To", Date);
            public To: Date;


            public static DPSelectedDealer = bind.DObject.CreateField<models.Client|models.Fournisseur, ProduitStat>("SelectedDealer", models.Dealer);
            public SelectedDealer: models.Client | models.Fournisseur;


            public static DPSelectedProduct = bind.DObject.CreateField<models.Product, ProduitStat>("SelectedProduct", models.Product);
            public SelectedProduct: models.Product;

            constructor(private _dealers: sdata.DataTable<models.Client | models.Fournisseur>, public DealerTitle: 'Client' | 'Fournisseur') {
                super("templates.ProductSearch" + (DealerTitle == 'Client' ? '' : '1'), UI.TControl.Me);
            }

            public set List(v:ListOfArticles|ListOfFakePrices) {
                this._list = v;
            }


            initialize() {
                super.initialize();
                this.To = new Date(Date.now() + 31536000000);
                this.From = new Date(Date.now() - 31536000000);
            }
            public setName(name: string, dom: HTMLElement, cnt: UI.JControl, e: bind.IJobScop) {
                if (this[name] === null) {
                    this[name] = dom;
                    this['_' + name] = e.Control;
                }
            }
            public  modal: UI.Modal;
            static __fields__() { return [this.DPFrom, this.DPTo, this.DPSelectedDealer, this.DPSelectedProduct]; }

            public  Open() {
                if (!this.modal) {
                    this.modal = new UI.Modal();
                    this.modal.OnInitialized = m => this.modal.Content = this;
                    this.modal.OnClosed.On = n => {
                        if (n.Result == UI.MessageResult.ok)
                            this._list.Execute(this.getRequest());
                    }
                }
                this.modal.Open();
                return this;
            }

            private getRequest() {
                var s: string[] = [];
                if (this.SelectedProduct)
                    s.push("Id=" + this.SelectedProduct.Id);
                if (this.SelectedDealer)
                    s.push((this.DealerTitle == 'Client' ? "CID=" : 'FID=') + this.SelectedDealer.Id);
                if (this.From && this.From.getTime() != 0)
                    s.push("From=" + this.From.getTime());
                if (this.To && this.To.getTime() != 0)
                    s.push("To=" + this.To.getTime());
                return s.join('&');
            }
        }

        export class ListOfArticles extends UI.Paginator<models.Article> {
            private table: Material.HeavyTable<models.Article>;
            constructor(public query: ProduitStat) {
                super(7, undefined, true);
                query.List = this;
            }
            Execute(q: string) {
                GData.requester.Costume(
                    { Url: __global.ApiServer.Combine( '/_/pstat/ArticlesPurchased').FullPath +'?'+ q, HasBody: false, Method: net.WebRequestMethod.Get },
                    new models.Articles(null), {}, (pc, data, s, req) => {
                        this.Open();
                        this.OnInitialized = n => {
                            n.table.OnInitialized = t => {
                                pc.data.FromJson(data, encoding.SerializationContext.GlobalContext);
                                this.Input = pc.data;
                            }
                        }
                    }, this);
                this.Open();
            }
            public get DealerTitle() { return this.query.DealerTitle; }
            initialize() {
                super.initialize();
                this.table = new Material.HeavyTable(data.value.ProductStatDef.def);
                this.OnInitialized = (p) => {
                    this.table.OnInitialized = (l) => {
                        l.Source = p.Output;
                        p.OnPropertyChanged(UI.Paginator.DPOutput, (s, e) => { this.table.Source = e._new; });
                    }
                    this.Content = this.table;
                };
            }
            private fact = 1;
            OrderByDealer() {
                (this.Input as models.Articles).OrderBy((a, b) => this.fact * (a.Owner.Client.Name || "").localeCompare(b.Owner.Client.Name || ""));
                this.fact *= -1;
            }
            OrderByProduct() {
                (this.Input as models.Articles).OrderBy((a, b) => this.fact * (a.Product as any || "").toString().localeCompare(b.Product as any || "").toString());
                this.fact *= -1;
            }
            OrderByQte() {
                (this.Input as models.Articles).OrderBy((a, b) => this.fact * (a.Count - b.Count));
                this.fact *= -1;
            }

            OrderByPSel() {
                (this.Input as models.Articles).OrderBy((a, b) => this.fact * (a.PSel - b.PSel));
                this.fact *= -1;
            }

            OrderByPVente() {
                (this.Input as models.Articles).OrderBy((a, b) => this.fact * (a.Price - b.Price));
                this.fact *= -1;
            }

            OrderByModifiedDate() {
                (this.Input as models.Articles).OrderBy((a, b) => this.fact * (funcs.toNum(a.Owner.LastModified) - funcs.toNum(b.Owner.LastModified)));
                this.fact *= -1;
            }

            OrderByFactureDate() {
                (this.Input as models.Articles).OrderBy((a, b) => this.fact * ((a.Owner.Date || ddate).getTime() - (b.Owner.Date || ddate).getTime()));
                this.fact *= -1;
            }
            Open() {
                ListOfArticles.modal.Open();
            }

            public static Open() {
                this.Default.Open();
            }
            public static OpenQuery(): ProduitStat {
                return this.Default.query.Open();                
            }
            OnKeyDown(e: KeyboardEvent) {
                e.preventDefault();
                e.stopPropagation();
                if (this.table.OnKeyDown(e)) return true;
                super.OnKeyDown(e);
            }
            private static modal: UI.Modal;
            private static _default;
            public static get Default(): ListOfArticles {
                if (!this._default) {
                    ListOfArticles._default = new ListOfArticles(new ProduitStat(GData.__data.Costumers, 'Client'));
                    this.modal = new UI.Modal();
                    this.modal.OnInitialized = m => {
                        this.modal.Content = this._default;
                        this.modal.setWidth('90%');
                    }
                }
                return ListOfArticles._default ;
            }

            OpenFacture( e: Event, dt: bind.EventData, scop: bind.Scop, x: bind.events) {
                var art = scop.Value as models.Article || this.table.SelectedItem;
                if (!art) return;
                Api.RiseApi('OpenFacture', {
                    data: art.Owner, callback: (p, x) => {
                        ListOfArticles.modal.Close(UI.MessageResult.Exit);
                    }
                });
            }
        }
        export class ListOfFakePrices extends UI.Paginator<models.FakePrice> {
            private table: Material.HeavyTable<models.FakePrice>;
            constructor(public query: ProduitStat) {
                super(7, undefined, true);
                query.List = this;
            }
            public get DealerTitle() { return this.query.DealerTitle; }

            Execute(q: string) {
                GData.requester.Costume(
                    { Url: __global.ApiServer.Combine('/_/pstat/ArticlesSolded').FullPath + '?' + q, HasBody: false, Method: net.WebRequestMethod.Get },
                    new models.FakePrices(null), {}, (pc, data, s, req) => {
                        this.Open();
                        this.OnInitialized = n => {
                            n.table.OnInitialized = t => {
                                pc.data.FromJson(data, encoding.SerializationContext.GlobalContext);
                                this.Input = pc.data;
                            }
                        }
                    }, this);
                this.Open();
            }
            initialize() {
                super.initialize();
                this.table = new Material.HeavyTable(data.value.ProductStatDef1.def);
                this.OnInitialized = (p) => {
                    this.table.OnInitialized = (l) => {
                        l.Source = p.Output;
                        p.OnPropertyChanged(UI.Paginator.DPOutput, (s, e) => { this.table.Source = e._new; });
                    }
                    this.Content = this.table;                    
                };
            }
            private fact = 1;
            OrderByDealer() {
                (this.Input as models.FakePrices).OrderBy((a, b) => this.fact * (a.Facture.Fournisseur.Name || "").localeCompare(b.Facture.Fournisseur.Name || ""));
                this.fact *= -1;
            }
            OrderByProduct() {
                (this.Input as models.FakePrices).OrderBy((a, b) => this.fact * (a.Product as any || "").toString().localeCompare(b.Product as any || "").toString());
                this.fact *= -1;
            }
            OrderByQte() {
                (this.Input as models.FakePrices).OrderBy((a, b) => this.fact * (a.Qte - b.Qte));
                this.fact *= -1;
            }

            OrderByPSel() {
                (this.Input as models.FakePrices).OrderBy((a, b) => this.fact * (a.PSel - b.PSel));
                this.fact *= -1;
            }

            OrderByPVente() {
                (this.Input as models.FakePrices).OrderBy((a, b) => this.fact * (a.Value - b.Value));
                this.fact *= -1;
            }

            OrderByModifiedDate() {
                (this.Input as models.FakePrices).OrderBy((a, b) => this.fact * (funcs.toNum(a.Facture.LastModified) - funcs.toNum(b.Facture.LastModified)));
                this.fact *= -1;
            }

            OrderByFactureDate() {
                (this.Input as models.FakePrices).OrderBy((a, b) => this.fact * ((a.Facture.Date || ddate).getTime() - (b.Facture.Date || ddate).getTime()));
                this.fact *= -1;
            }
            Open() {
                ListOfFakePrices.modal.Open();
            }
            
            public static OpenQuery(): ProduitStat {
                return this.Default.query.Open();
            }
            public static Open() {
                this.Default.Open();
            }

            OnKeyDown(e: KeyboardEvent) {
                e.preventDefault();
                e.stopPropagation();
                if (this.table.OnKeyDown(e)) return true;
                super.OnKeyDown(e);
            }
            private static modal = new UI.Modal();
            private static _default;
            public static get Default(): ListOfFakePrices {
                if (!this._default) {
                    this._default = new ListOfFakePrices(new ProduitStat(GData.__data.Fournisseurs, 'Fournisseur'));
                    this.modal = new UI.Modal();
                    this.modal.OnInitialized = m => {
                        this.modal.Content = this._default;
                        this.modal.setWidth('90%');
                    }
                }
                return this._default ;
            }
            OpenFacture(e: Event, dt: bind.EventData, scop: bind.Scop, x: bind.events) {
                var art = scop.Value as models.FakePrice || this.table.SelectedItem;
                if (!art) return;
                Api.RiseApi('OpenSFacture', {
                    data: art.Facture, callback: (p, x) => {
                        ListOfFakePrices.modal.Close(UI.MessageResult.Exit);
                    }
                });
            }
        }
    }
}
window['Statistics'] = Statistique;
window['Test'] = () => {
    return Statistique.Views.ProduitStat;
}
var ddate = new Date();