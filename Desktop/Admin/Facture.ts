import { UI, conv2template } from '../../lib/Q/sys/UI';
import { sdata, Controller } from '../../lib/Q/sys/System';
import { mvc, utils, basic, Api, thread, encoding, net, bind, reflection, collection, attributes } from '../../lib/Q/sys/Corelib';
import { funcs, GetVars, extern, Facture, IGetLastArticlePrice } from '../../abstract/extra/Common';
import { models, Printing } from "../../abstract/Models";
import { basics } from '../../abstract/extra/Basics';
import { filters } from '../../lib/Q/sys/Filters';
import { Material } from '../../lib/Q/components/HeavyTable/script';
//import * as data from "json|../data.json";

import { Forms } from '../../Componenets/Forms';
import { APIEventHandler, APIEventArgs } from '../../abstract/extra/AdminApis';

import { Statistique } from '../../Componenets/PStat';
import { data } from '../../assets/data/data';
import { Components } from '../../lib/q/sys/Components';

declare var $;
//// Limit Credit sur la vent

var GData: basics.vars;
GetVars((v) => {
    GData = v;
    return false;
});
var userAbonment = bind.NamedScop.Get('UserAbonment');

export class FactureAchat extends Facture<models.FakePrice, models.SFacture>{
    GetLastArticlePrice() {
        Api.RiseApi('getLastArticlePrice', {
            data: <IGetLastArticlePrice>{ Dealer: this.Data.Fournisseur, Product: this.adapter.SelectedItem.Product, Before: this.Data.Date, IsAchat: true },
            callback: (a, prc) => {
                if (prc)
                    UI.InfoArea.push("Le dernie revage est " + prc);
                else UI.InfoArea.push("Le Produit n'est pas acheter");
            }
        });
    }
    protected OnAbonmentChanged(b: UI.IAutoCompleteBox, o: basic.EnumValue, n: basic.EnumValue) {
        throw new Error("Method not implemented.");
    }
    CalculateBenifite() {
        var t = this.Data && this.Data.Articles.AsList();
        if (!t) return;
        var b = 0, tt = 0;
        for (var i = 0; i < t.length; i++) {
            var a = t[i];
            if (!a) continue;
            b += (a.Value - a.PSel) * a.Qte;
            tt += a.PSel * a.Qte;
        }
        UI.InfoArea.push('<h3 >Benefit est :</h3><h1>' + b + 'DA  </h1><br><h3 >Precentage est :</h3><h1 style="color:yellow">' + (b / tt) * 100 + '%  </h1>');
    }
    protected OpenPrdStatistics() {
        var q = Statistique.Views.ListOfFakePrices.OpenQuery();
        var a = this.adapter.SelectedItem;
        var d = this.Data;
        q.OnInitialized = n => {
            if (a)
                n.SelectedProduct = a.Product;
            if (d)
                n.SelectedDealer = d.Fournisseur;
        }
    }
    
    protected OpenPrdStatisticsRslt() {
        Statistique.Views.ListOfFakePrices.Open();
    }
    protected ReglerFacture() {
        this.verser(true);
    }
    protected LoadArticles() {
        if (this.Data)
            if (!this.Data.IsOpen)
                if (this.Data.Articles == null || !this.Data.Articles.Stat) {
                    GData.apis.SFacture.UpdateArticlesOf(this.Data, null);
                }
    }
    public OpenInfo() {
        var data = this.Data;
        var bk = data.CreateBackup();
        Api.RiseApi('OpenSFactureInfo', {
            callback: (p, da) => {
                if (da.iss && da.data.IsOpen)
                    GData.requester.Request(models.SFacture, "SetInfo", da.data, da.data, function (r, j, i) {
                        da.data[i ? 'Commit' : 'Rollback'](bk);
                    });
                else
                    da.data.Rollback(bk);
            },
            data: data,
        });
    }
    Update() {
        UI.Modal.ShowDialog("Update", "Do you want realy to update this facture from server", (e) => {
            if (e.Result === UI.MessageResult.ok) {
                GData.apis.SFacture.UpdateArticlesOf(this.Data, (e) => { GData.apis.SFacture.Update(this.Data); });
            }
        });
    }

    constructor() {
        super('facture_achat', 'Facture D\'<b><u>A</u></b>chat', 'SFacture.view', null, false);
    }
    public AddNewArticle() {
        var data = this.adapter.Data;
        if (data.IsOpen)
            GData.apis.Revage.New((e) => {
                var art = e.Data;
                if (e.Error !== basics.DataStat.Success) return UI.InfoArea.push("UnExpected Error");
                art.Facture = data;
                var editCallback = (e: APIEventArgs<models.FakePrice, models.FakePrices>) => {
                    if (e.Error === basic.DataStat.Success) {
                        data.Recalc();
                        data.Articles.Add(e.Data);
                        this.adapter.SelectItem(e.Data);
                    }
                    else e.Data.Dispose();
                }
                this.edit(art, editCallback);
            });
    }


    public SaveFacture() {
        Api.RiseApi("SaveSFacture", {
            data: this.Data
        });
    }

    public DeleteArticle() {
        var d = this.adapter.Data;
        if (!d || !d.IsOpen) return;
        var c = this.adapter.SelectedItem;
        if (c == null) UI.InfoArea.push("select an article to delete");
        var p = c.Product;
        var arts = d.GetValue(models.SFacture.DPArticles);
        var tt: models.SFacture;
        UI.Modal.ShowDialog('Confirmation', 'Do you want to remove this Article <br>' + (p || '').toString(), (xx) => {
            if (xx.Result === UI.MessageResult.ok) {
                GData.apis.Revage.Delete(c, (e) => {
                    if (e.Error == basic.DataStat.Success) {
                        d.Recalc();
                        arts.Remove(c);
                    }
                });
            }
        }, 'DELETE', 'Cancel');
    }
    edit(art?: models.FakePrice, callback?: APIEventHandler<models.FakePrice, models.FakePrices>) {
        if (art || this.adapter.SelectedItem)
            GData.apis.Revage.Show(art || this.adapter.SelectedItem, (e) => {
                if (e.Error == basic.DataStat.Success) this.Data.Recalc();
                callback && callback(e);
            }, this.Data.IsOpen);
    }
    GetLeftBar() {
        var l = this.sfs.GetLeftBar();
        l.OnInitialized = l => this.sfs.ShowFournisseur();
        return l;
    }
    GetRightBar() {
        return this.sfs.GetRightBar();
    }
    private sfs = new FactureService(this, "SFacturePrinter");
    private OnContextMenuFired(r: UI.RichMenu<string>, selected: string) {
        if (selected === 'Ouvrir' || selected === 'Supprimer')
            this.OpenVersments(selected === 'Supprimer');
        else if (selected === 'Regler' || selected === 'Verser')
            this.verser(selected === 'Regler');
    }
    public verser(regler: boolean) {
        var data = this.Data;
        if (!data) return UI.Modal.ShowDialog("ERROR", "Selecter une facture pour ajouter une versment");
        if (regler) return GData.apis.SVersment.Regler(data, data.Client);
        GData.apis.SVersment.VerserTo(data, data.Fournisseur);
    }

    public OpenVersments(forDelete: boolean) {
        var data = this.Data;
        if (data)
            GData.apis.SVersment.OpenSVersmentsOfFacture(data, (results, selected, fournisseur, success) => {
                data.Recalc(results);
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

    public OpenStatistics() {
        this.OpenPrdStatistics();
    }

    public OpenMails() { }

    public NewProduct() {
        var data = this.Data;
        GData.apis.Product.CreateNew((e) => {
            if (e.Error != basic.DataStat.Success) return;
            var product = e.Data;
            if (data && data.IsOpen)
                GData.apis.Revage.New((e) => {
                    if (e.Error !== basic.DataStat.Success) return;
                    var art = e.Data;
                    art.Facture = data;
                    art.Product = product;
                    art.Qte = 0;
                    this.edit(art, (e) => {
                        if (e.Error === basic.DataStat.Success) {
                            data.Articles.Add(e.Data);
                            this.adapter.SelectItem(e.Data);
                        }
                        else e.Data.Dispose();
                    });
                });
        });
    }

    public SelectFournisseur() {
        var facture = this.Data;
        if (!facture.IsOpen) return UI.InfoArea.push("La facture est fermer");
        GData.apis.Fournisseur.Select((e) => {
            if (e.Error == basic.DataStat.Success) {
                if (!e.Data) return thread.Dispatcher.call(this, this.SelectFournisseur);
                if (e.Data != facture.Fournisseur)
                    GData.requester.Request(models.SFacture, "SetProperty", null, { Property: "Fournisseur", Id: facture.Id, Value: e.Data.Id }, (r, j, i) => {
                        if (i) facture.Fournisseur = e.Data;
                    });
            }
        }, this.Data.Fournisseur);
    }

    public SelectAchteur(onSuccessCallback: () => void) {
        var facture = this.Data;
        if (!facture.IsOpen) return UI.InfoArea.push("La facture est fermer");
        var dt = facture.GetValue(models.SFacture.DPAchteur) as models.Agent;
        GData.apis.Agent.Select((e) => {
            var achteur = e.Data;
            if (e.Error === basic.DataStat.Success) {
                if (!achteur) return this.SelectFournisseur();
                if (achteur != facture.Achteur)
                    GData.requester.Request(models.SFacture, "SetProperty", null, { Property: "Achteur", Id: facture.Id, Value: achteur.Id }, (r, j, i) => {
                        if (i) facture.Achteur = achteur;
                    });
            }
        }, dt);
    }

    public Validate() {
        Api.RiseApi("ValidateSFacture", {
            data: this.Data
        });
    }
    public GenerateTickets() {
        if (this._tickets)
            this._tickets.Clear().From(this.Data);
        else {
            this._tickets = models.Tickets.From(this.Data, this._tickets);
            this.mdl_tickets = new UI.Modal();
            this.mdl_tickets.SetDialog("Tickets Generator", this.createTicketTable(this._tickets));
            this.mdl_tickets.OnClosed.Add((e) => {
                if (e.Result === UI.MessageResult.ok) this.onPrint(this._tickets, false);
            });
            this.mdl_tickets.OnInitialized = n => n.setWidth('90%');
        }
        this.mdl_tickets.Open();
    }
    public Print(model?: string) {
        if (model === "Tickets") {
            this.GenerateTickets();
        } else {
            this.PrintModel(model, undefined);
        }
    }

    public Delete() {
        Api.RiseApi("DeleteSFacture", { data: this.Data });
    }
    public New() {
        Api.RiseApi('NewSFacture', { data: null, callback(p, f: models.SFacture) { } });
    }
    public OnBringIntoFront() {
        var d = this.adapter.Data;
        if (d == null) {
            UI.Modal.ShowDialog(this.Caption, 'There no facture selected do you want to create a new one', (xx) => {
                if (xx.Result === UI.MessageResult.ok) {
                    this.New();
                }
                else {
                    var p = this.parent as UI.NavPage;
                    p.Select('facture_fournisseurs');
                }
            }, 'Create New', 'Cancel');
        }
        this.abonment.Box.Enable = true;
        userAbonment.Value = models.Abonment.Detaillant;
        this.abonment.Box.Disable(true);
    }
    private createTicketTable(t: models.Tickets) {
        var x = new Material.HeavyTable(data.value.ticketTableDef.def);
        x.Source = t.Values;
        return x;
    }

    private onPrint(p: models.Tickets, isn: boolean) {
        var data = new Printing.PrintData();
        data.HandlerId = "SFacturePrinter";
        data.DataId = this.Data.Id;
        data.Model = "Tickets";
        data.Data = p;
        GData.requester.Request(Printing.PrintData, "PRINT", data, null, function (a, b, c) {
            var d = a.data;
            if (d.Response && d.Response.Success) {
                var url = __global.ApiServer.Combine('/_/$').FullPath + '?Id=' + d.Response.FileName;
                Forms.PDFViewer.Show(url);
            }
        }, null, null, this);
        return false;
    }
    private PrintModel(format:string,dt) {
        var data = new Printing.PrintData();
        data.HandlerId = "SFacturePrinter";
        data.DataId = this.Data.Id;
        data.Model = format;
        data.Data = dt;
        GData.requester.Request(Printing.PrintData, "PRINT", data, null, function (a, b, c) {
            var d = a.data;
            if (d.Response && d.Response.Success) {
                var url = __global.ApiServer.Combine('/_/$').FullPath + '?Id=' + d.Response.FileName;
                Forms.PDFViewer.Show(url);
            }
        }, null, null, this);
        return false;
    }
    private _tickets: models.Tickets;
    private mdl_tickets: UI.Modal;
}

export class FactureVent extends Facture<models.Article, models.Facture> implements IFactureOperations {
    GetLastArticlePrice() {
        GData.apis.Facture.GetLastArticlePrice(this.Data.Client, this.adapter.SelectedItem.Product, this.Data.Date, (prc) => {
            if (prc)
                UI.InfoArea.push("Le dernie revage est " + prc);
            else UI.InfoArea.push("Le Produit n'est pas acheter");
        });
    }
    CalculateBenifite() {
        var t = this.Data && this.Data.Articles.AsList();
        if (!t) return;
        var b = 0;
        var tt = 0;
        for (var i = 0; i < t.length; i++) {
            var a = t[i];
            if (!a) continue;
            b += (a.Price - a.PSel) * a.Count;
            tt += a.Price * a.Count;
        }
        UI.InfoArea.push('<h3 >Benefit est :</h3><h1>' + b + 'DA  </h1><br><h3 >Precentage est :</h3><h1 style="color:yellow">' + (b / tt) * 100 + '%  </h1>');
    }
    protected OpenPrdStatistics() {
        var q = Statistique.Views.ListOfArticles.OpenQuery();
        var a = this.adapter.SelectedItem;
        var d = this.Data;
        q.OnInitialized = n => {
            n.SelectedProduct = a.Product;
            n.SelectedDealer = d.Client;
        }

    }
    protected OpenPrdStatisticsRslt() {
        Statistique.Views.ListOfArticles.Open();
    }

    public OpenInfo() {
        var d: models.Facture;
        var data = this.Data;
        var bk = data.CreateBackup();
        Api.RiseApi('OpenFactureInfo', {
            callback: (p, da) => {
                if (da.iss && da.data.IsOpen)
                    GData.requester.Request(models.Facture, "SetInfo", da.data, da.data, function (r, j, i) {
                        da.data[i ? 'Commit' : 'Rollback'](bk);
                    });
                else
                    da.data.Rollback(bk);
            },
            data: data,
        });
    }

    
    GenerateTickets() {
        throw new Error("Method not implemented.");
    }

    protected ReglerFacture() {
        this.verser(true);
    }
    protected LoadArticles() {
        if (this.Data)
            if (!this.Data.IsOpen)
                if (this.Data.Articles == null || !this.Data.Articles.Stat) {
                    GData.apis.Facture.UpdateArticlesOf(this.Data, null);
                }
    }

    OnPrint() {
        this.Print("Format1");
    }
    Update() {
        UI.Modal.ShowDialog("Update", "Do you want realy to update this facture from server", (e) => {
            if (e.Result === UI.MessageResult.ok) {                
                GData.apis.Facture.UpdateArticlesOf(this.Data, (e) => {
                    GData.apis.Facture.Update(this.Data);
                });
            }
        });
    }

    edit(art?: models.Article, callback?: APIEventHandler<models.Article,models.Articles>) {
        GData.apis.Article.Show(art || this.adapter.SelectedItem, (e) => {
            if (e.Error == basic.DataStat.Success) this.Data.Recalc();
            callback && callback(e);
        }, this.Data.IsOpen);
    }
    constructor() {
        super('facture_vent', "Facture <b><u>V</u></b>ent", 'Facture.oview', null, false);
    }
    initialize() {
        super.initialize();
        this.Enable = true;
    }
    public AddNewArticle() {
        var data = this.adapter.Data;
        if (data.IsOpen)
            GData.apis.Article.New((e) => {
                var revage = e.Data;
                var t = e.Error;
                if (t !== basics.DataStat.Success) return UI.InfoArea.push("UnExpected Error");
                revage.Owner = data;
                revage.Count = 1;
                var db = revage.OnPropertyChanged(models.Article.DPProduct, (s, e) => {
                    revage.PSel = (e._new && e._new.PSel) || 0;
                });
                this.edit(revage, (e) => {
                    revage.removeEvent(models.Article.DPProduct, db);
                    if (e.Error === basic.DataStat.Success) {
                        data.Articles.Add(e.Data);
                        this.Data.Recalc();
                        this.adapter.SelectItem(e.Data);
                    }
                    else e.Data.Dispose();
                });
            });
    }
    public SaveFacture() {
        var d = this.Data;
        if (!d) return UI.InfoArea.push("There no facture selected");
        Api.RiseApi("SaveFacture", {
            data: d
        });
    }
    public DeleteArticle() {
        var d = this.adapter.Data;
        if (!d || !d.IsOpen) return;
        var c = this.adapter.SelectedItem;
        if (c == null) UI.InfoArea.push("select an article to delete");
        var arts = d.GetValue(models.Facture.DPArticles);
        UI.Modal.ShowDialog('Confirmation', 'Do you want to remove this Article <br>' + (c.Product || '').toString(), (xx) => {
            if (xx.Result === UI.MessageResult.ok) {
                GData.requester.Request(models.Article, "DELETE", c, c as any, (d, j, i) => {
                    if (i)
                        arts.Remove(c), this.Data.Recalc();
                    else UI.InfoArea.push("L' article n'a pas supprimmer");
                });
            }
        }, 'DELETE', 'Cancel');
    }

    GetLeftBar() {
        var l = this.fs.GetLeftBar();
        l.OnInitialized = l => this.fs.HideFournisseur();
        return l;
    }

    private fs = new FactureService(this, "FacturePrinter");
    GetRightBar() {
        return this.fs.GetRightBar();
    }
    public verser(regler: boolean) {
        var data = this.Data;
        if (!data) return UI.Modal.ShowDialog("ERROR", "Selecter une facture pour ajouter une versment");
        if (regler) return GData.apis.Versment.Regler(data, data.Client);
        GData.apis.Versment.VerserTo(data, data.Client);
    }

    public OpenVersments(forDelete: boolean) {
        if (this.Data)
            GData.apis.Versment.OpenVersmentsOfFacture(this.Data, (results, selected, fournisseur, success) => {
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
    public OpenStatistics() { this.OpenPrdStatistics();}

    public OpenMails() { }

    public NewProduct() {
        var data = this.Data;
        GData.apis.Product.CreateNew((e) => {
            if (e.Error != basic.DataStat.Success) return;
            var product = e.Data;
            if (data && data.IsOpen)
                GData.apis.Article.New((e) => {
                    var err = e.Error;
                    var art = e.Data;
                    if (err !== basic.DataStat.Success) return;
                    art.Owner = data;
                    art.Product = product;
                    art.Count = 1;
                    this.edit(art, (e) => {
                        if (e.Error === basic.DataStat.Success) {
                            this.Data.Recalc();
                            data.Articles.Add(e.Data);
                            this.adapter.SelectItem(e.Data);
                        }
                        else e.Data.Dispose();
                    });
                });
        });
    }

    public SelectFournisseur() { }

    public SelectAchteur() {
        var facture = this.Data;
        if (!facture.IsOpen) return UI.InfoArea.push("La facture est fermer");
        var dt = facture.Client;
        GData.apis.Client.Select((e) => {
            var client = e.Data;
            if (e.Error==basic.DataStat.Success) {
                if (!client) return this.SelectAchteur();
                GData.requester.Request(models.Facture, "SetProperty", null, { Property: "Client", Id: facture.Id, Value: client.Id }, (r, j, i) => {
                    if (i) facture.Client = client;
                });
            }
        }, this.Data.Client);
    }

    public Validate() {
        Api.RiseApi("ValidateFacture", { data: this.Data });
    }
    public Print(model: string) {

        var data = new Printing.PrintData();
        data.HandlerId = "FacturePrinter";
        data.DataId = this.Data.Id;
        data.Model = model;
        var self = this;
        GData.requester.Request(Printing.PrintData, "PRINT", data, null, function (a, b, c) {
            var d = a.data;
            if (d.Response && d.Response.Success) {
                var url = __global.ApiServer.Combine('/_/$').FullPath + '?Id=' + d.Response.FileName;
                Forms.PDFViewer.Show(url);
            }
        }, null, null, this);
    }

    public Delete() {
        Api.RiseApi("DeleteFacture", { data: this.Data });
    }
    public New() {
        GData.apis.Article.New((e) => {
            if (e.Error == basics.DataStat.Success)
            {
                this.Data.Articles.Add(e.Data);
                this.Data.Recalc();
            }
            else UI.InfoArea.push("UnExpected  Error");
        });
    }
    public OnBringIntoFront() {
        var d = this.adapter.Data;
        if (d == null) {
            UI.Modal.ShowDialog('Facture De Livraison', 'There no facture selected do you want to create new one', (xx) => {
                if (xx.Result === UI.MessageResult.ok) {
                    this.New();
                }
                else {
                    var p = this.parent as UI.NavPage;
                    p.Select('facture_clientels');
                }
            }, 'Create New', 'Cancel');
        }
        var v: models.Abonment;
        if (d && d.Client)
            v = d.Client.Abonment;
        else v = 0;
        userAbonment.Value = v;
        this.abonment.Box.Enable = true;
        this.Enable = !!d;

    }

    protected OnAbonmentChanged(b: UI.IAutoCompleteBox, o: basic.EnumValue, n: basic.EnumValue) {
        var d = this.Data;
        if (!d) return;
        d.Abonment = n.Value;
    }
}

var abonEnum = basic.getEnum('models.Abonment');



class FactureService {

    constructor(private target: IFactureOperations, private printModeHandlerId: string) {
    }
    //* Right Panel*/
    private _print: UI.Glyph;
    private _save: UI.Glyph;
    private _valid: UI.Glyph;
    private _del: UI.Glyph;
    private _new: UI.Glyph;

    //* Left Panel*/
    private _edit: UI.Glyph;
    private _delete: UI.Glyph;

    private _acht: UI.Glyph;
    private _forn: UI.Glyph;
    private _creditCart: UI.Glyph;

    private _stat: UI.Glyph;
    private _info: UI.Glyph;
    private _mail: UI.Glyph;

    private _prod: UI.Glyph;

    private lb: UI.Navbar<any>;
    private rb: UI.Navbar<any>;

    GetLeftBar(factureModels?: string) {
        if (!this.lb) {
            this._edit = new UI.Glyph(UI.Glyphs.edit, false, 'Edit');
            this._new = new UI.Glyph(UI.Glyphs.plusSign, false, 'New');
            this._delete = new UI.Glyph(UI.Glyphs.fire, false, 'Delete');


            this._acht = new UI.Glyph(UI.Glyphs.user, false, 'Achteur');
            this._forn = new UI.Glyph(UI.Glyphs.home, false, 'Fournisseur');
            this._creditCart = new UI.Glyph(UI.Glyphs.creditCard, false, 'Versments');



            this._stat = new UI.Glyph(UI.Glyphs.stats, false, 'Statistics');
            this._info = new UI.Glyph(UI.Glyphs.infoSign, false, 'Information');
            
            this._prod = new UI.Glyph(UI.Glyphs.rub, false, 'Insert New Product');

            this.lb = new UI.Navbar<any>();
            funcs.setTepmlate(this.lb, this, this.handleSerices);
            this.rm = new UI.RichMenu(undefined, ["Regler", "Verser", "Supprimer", "", "Ouvrir"], this._creditCart);
            GData.requester.Request(Printing.PrintData, "MODELS", new collection.List<string>(String), { HandlerId: this.printModeHandlerId },
                (a, b, c) => {
                    this.printMenu = new UI.RichMenu(undefined, a.data.AsList(), this._print);
                }, null, null, this);
            this.lb.OnInitialized = n => n.AddRange([this._new, this._edit, this._delete, funcs.createSparator(), this._forn, this._acht, this._creditCart, funcs.createSparator(), this._stat, this._info, funcs.createSparator(), funcs.createSparator(), this._prod]);
        }
        return this.lb;
    }
    private rm: UI.RichMenu<any>;
    private printMenu: UI.RichMenu<any>;
    GetRightBar() {
        if (!this.rb) {
            this._print = new UI.Glyph(UI.Glyphs.print, false, 'Print');
            this._save = new UI.Glyph(UI.Glyphs.floppyDisk, false, 'Save');
            this._valid = new UI.Glyph(UI.Glyphs.check, false, 'Validate');

            this.rb = new UI.Navbar<any>();
            funcs.setTepmlate(this.rb, this, this.handleSerices);
            this.rb.OnInitialized = n => n.AddRange([this._print, funcs.createSparator(), this._valid, this._save]);
        }
        return this.rb;
    }

    handleSerices(s, e, p: { t: FactureService, c: UI.Glyphs }) {
        var c = UI.Glyphs;
        var t = p.t.target;
        switch (p.c) {
            case c.print:
                p.t.printMenu.Open(e, { Owner: p.t, Invoke: p.t.OnPrintContextMenuFired }, null, true);
                break;
            case c.floppyDisk:
                t.SaveFacture();
                break;
            case c.check:
                t.Validate();
                break;
            case c.fire:
                t.Delete();
                break;
            case c.plusSign:
                t.New();
                break;
            case c.user:
                t.SelectAchteur();
                break;
            case c.home:
                t.SelectFournisseur();
                break;
            case c.creditCard:
                p.t.rm.Open(e, { Owner: p.t, Invoke: p.t.OnContextMenuFired }, null, true);
                break;
            case c.infoSign:
                t.OpenInfo();
                break;
            case c.rub:
                t.NewProduct();
                break;
            case c.stats:
                t.OpenStatistics();
                return;
            case c.edit:
                t.edit();
                return;
            default:
                UI.InfoArea.push("This Option need for money to activate");
                return;
        }
    }
    HideFournisseur() { this._forn.Visible = false; }
    ShowFournisseur() { this._forn.Visible = true; }

    private OnContextMenuFired(r: UI.RichMenu<string>, selected: string) {
        if (selected === 'Ouvrir' || selected === 'Supprimer')
            this.target.OpenVersments(selected === 'Supprimer');
        else if (selected === 'Regler' || selected === 'Verser')
            this.target.verser(selected === 'Regler');
    }
    private OnPrintContextMenuFired(r: UI.RichMenu<string>, selected: string) {
        this.target.Print(selected);
    }
}
class FacturesService {
    //* Right Panel*/
    private _print: UI.Glyph;
    private _open: UI.Glyph;
    private _new: UI.Glyph;
    //* Left Panel*/
    private _save: UI.Glyph;
    private _update: UI.Glyph;
    private _validate: UI.Glyph;
    private _delete: UI.Glyph;



    private lb: UI.Navbar<any>;
    private rb: UI.Navbar<any>;

    GetRightBar() {
        if (!this.lb) {
            this._print = new UI.Glyph(UI.Glyphs.print, false, 'Print');
            this._open = new UI.Glyph(UI.Glyphs.open, false, 'Open');
            this._new = new UI.Glyph(UI.Glyphs.openFile, false, 'New');

            this.lb = new UI.Navbar<any>();
            var oldget = this.lb.getTemplate;
            this.lb.getTemplate = (c) => {
                var e = oldget(new UI.Anchore(c));
                if (!(c as UI.JControl).Enable)
                    e.Enable = false;
                return e;
            }
            this.lb.OnInitialized = n => n.AddRange([this._print, this._open, this._new]);
            this.lb.OnSelectedItem.On = (u) => {

            }
        }
        return this.lb;
    }
    GetLeftBar() {
        if (!this.rb) {

            this._update = new UI.Glyph(UI.Glyphs.banCircle, false, 'Update');
            this._validate = new UI.Glyph(UI.Glyphs.openFile, false, 'Validate');
            this._save = new UI.Glyph(UI.Glyphs.openFile, false, 'Save');
            this._delete = new UI.Glyph(UI.Glyphs.openFile, false, 'Delete');

            this.rb = new UI.Navbar<any>();
            var oldget = this.rb.getTemplate;
            this.rb.getTemplate = (c) => { return oldget(new UI.Anchore(c)); }

            this.rb.OnInitialized = n => {
                n.AddRange([this._delete, funcs.createSparator(), this._save, this._validate, this._update]);
            }
        }
        return this.rb;
    }
}

export interface IFactureOperations {
    verser(regler: boolean);
    OpenVersments(forDelete: boolean);
    SelectAchteur(onSuccessCallback?: () => void);
    SelectFournisseur(onSuccessCallback?: () => void);
    OpenStatistics();
    OpenInfo();
    OpenMails();
    NewProduct();

    SaveFacture();
    Validate();
    Print(model?: string);
    Delete();
    New();

    edit();
}