import { UI } from "../../lib/Q/sys/UI";
import { models } from "../../abstract/Models";
import { data } from '../../assets/data/data';
import { Material } from "../../lib/q/components/HeavyTable/script";
import { GetVars, funcs, IGetLastArticlePrice } from "../../abstract/extra/Common";
import { sdata } from "../../lib/Q/sys/System";
import { basics } from "../../abstract/extra/Basics";
import { bind, basic, collection, Api, reflection } from "../../lib/Q/sys/corelib";
import { Forms } from "../../Componenets/Forms";
import { FactureVent, FactureAchat } from "./Facture";
import { Statistique } from "../../Componenets/PStat";
import { Apis } from "../../abstract/QShopApis";
var GData: basics.vars;

GetVars((v) => { GData = clone(v); return false;});
export namespace views {
    export class Command extends UI.NavPanel {
        protected adapter: Material.HeavyTable<models.CArticle>;
        constructor() {
            super("Command", "Command");
        }
        public Value: models.Command;
        _hasValue_() { return true; }
        initialize() {
            super.initialize();
            Api.RiseApi('loadFournisseurs', void 0);
            var f = this.adapter = new Material.HeavyTable<models.CArticle>(data.value.CommandDef.def).applyStyle('fitHeight');
            this.Add(this.adapter = f);
            this.Update();
            var oldkeydown = this.x.OnKeyDown;
            this.x['pressKey'] = (e: KeyboardEvent, dt, scop: bind.Scop, ev) => {
                if (e.keyCode == 116) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    e.stopPropagation();
                    this.GetLastArticlePrice(scop.Value);
                }
            }
            UI.Desktop.Current.KeyCombiner.On('S', 'R', function (s, e) {
                s.Cancel = true;
                var q = Statistique.Views.ListOfFakePrices.OpenQuery();
                q.OnInitialized = n => n.SelectedProduct = this.adapter.SelectedItem.Product;
            }, this, this);
        }
        private currentCell;
        OnKeyDown(e: KeyboardEvent) {
            if (this.Value.IsOpen) {
                if (e.keyCode == 13)
                    return this.NewArticle();
                else if (e.keyCode == 113)
                    return this.EditArticle();
                else if (e.keyCode == 46)
                    return this.DeleteArticle(this.adapter.SelectedItem);
            }
            var c = this.adapter.OnKeyDown(e);
            if (!c) return super.OnKeyDown(e);
            return c;
        }

        OpenInfo(e: Event, dt: bind.EventData, scop: bind.Scop, x: bind.events) {
            var xm = Statistique.Views.ListOfFakePrices.Default;
            var c = scop.Value as models.CArticle;
            this.GetLastArticlePrice(c);
        }
        private x = new UI.Modals.EModalEditer<models.CArticle>("templates.carticleedit",false);
        GetLastArticlePrice(p: models.CArticle) {
            Api.RiseApi('getLastArticlePrice', {
                data: <IGetLastArticlePrice>{ Dealer: undefined, Product: p.Product, Before: new Date(Date.now() + 2231536000000), IsAchat: true, asRecord: true },
                callback: function (a, prc: models.FakePrice) {
                    if (prc) {
                        p.Price = prc.PSel || p.Product.PSel;
                        p.Fournisseur = GData.__data.Fournisseurs.GetById(prc.Facture.Fournisseur as any);
                        if (!p.Qte)
                            p.Qte = prc.Qte;
                    } else
                        GData.apis.Fournisseur.Select((a) => {
                            if (a.Error == basic.DataStat.Success) {
                                p.Fournisseur = a.Data;
                            }
                        });
                }
            });
        };
        NewArticle() {
            var edit = (cc:models.CArticle)=> {
                this._editArticle(cc, (a, e) => {
                    if (e.E.Result == UI.MessageResult.ok) {
                        if (cc.Label == null || cc.Label.trim() == "") {
                            e.E.StayOpen();
                            return;
                        }
                        GData.requester.Request(models.CArticle, "SAVE", cc, void 0, (q, json, b, x) => {
                            if (b)
                            {
                                this.adapter.Source.Add(cc);
                                this.adapter.SelectedItem = cc;
                            }
                            else edit(cc);
                        });
                    }
                });
            }
            basic.GuidManager.New((id) => {
                var cc = new models.CArticle(id);
                cc.Product = null;
                cc.Fournisseur = null;
                cc.Command = this.Value;
                edit(cc);
            }, null);
        }
        EditArticle() {
            var cc = this.adapter.SelectedItem;
            if (!cc) return;
            this._editArticle(cc, (a, e) => {
                if (e.E.Result == UI.MessageResult.ok)
                    GData.requester.Request(models.CArticle, "SAVE", cc, void 0, (q, json, b, x) => {
                        !b && UI.InfoArea.push("UnExpected Error");
                    });
            });
        }
        _editArticle(p: models.CArticle, action: reflection.Method<void, (s: UI.Modals.EModalEditer<models.CArticle>, e: UI.Modals.ModalEditorEventArgs<models.CArticle>) => void>) {
            this.x.edit(p, false, action, this.Value.IsOpen);
        }
        DeleteArticle(art: models.CArticle): any {
            GData.requester.Request(models.CArticle, "DELETE", void 0, { Id: art.Id }, (e, p, d, q) => {
                if (d)
                    this.adapter.Source.Remove(art);
            });
        }
        
        Update() {
            if (!this.Value) {
                this.Value = new models.Command(basic.New());
                this.adapter.Source = this.Value.Articles;
            }
            GData.requester.Request(models.Command, "UPDATEDC", this.Value, void 0, (e, p, d, q) => {
                GData.requester.Request(models.CArticles, "UPDATEDC", this.adapter.Source, void 0, (e, p, d, q) => {

                });
            });
        }
        private get Source() {
            return this.adapter.getScop().Value;
        }
        OnPrint() {
            var responce = {};
            GData.requester.Request(models.Command, "PRINT", responce, void 0, (a, b:any, c) => {
                if (b.Response && b.Response.Success) {
                    var url = __global.ApiServer.Combine('/_/$?Id=' + b.Response.FileName).FullPath;
                    Forms.PDFViewer.Show(url);
                }
            });
        }
    }
}
bind.Register({
    Name: "loadCArticle",
    OnInitialize(ji, e) {
        //this.Todo(ji, e);
    },
    Todo(ji, e) {        
        var art = ji.Scop.getParent().Value as models.CArticle;
        var prd = !e ? art.Product : e._new;
        if (!prd) return;
        Api.RiseApi('getLastArticlePrice', {
            data: <IGetLastArticlePrice>{ Dealer: undefined, Product: prd, Before: new Date(Date.now()+3333333333333333333), IsAchat: true, asRecord: true },
            callback: function (a, prc: models.FakePrice) {
                if (prc) {
                    art.Price = prc.PSel || prd.PSel;
                    art.Fournisseur = GData.__data.Fournisseurs.GetById(prc.Facture.Fournisseur as any);
                    if (!art.Qte)
                        art.Qte = prc.Qte;
                }
                //else
                //    GData.apis.Fournisseur.Select((a) => {
                //        if (a.Error == basic.DataStat.Success) {
                //            art.Fournisseur = a.Data;
                //        }
                //    });
            }
        });
    }
}
);