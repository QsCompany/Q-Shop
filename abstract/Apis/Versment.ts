import { MyApi, DBCallback, EMyApi, dateToUTC, FactureBase, APIEventHandler, ListTemplateName } from '../extra/AdminApis';
import { UI } from '../../lib/Q/sys/UI';
import { basic, Common, Api, net, encoding } from '../../lib/Q/sys/corelib';
import { models } from '../Models';
import { basics } from '../extra/Basics';
import { Controller, sdata } from '../../lib/Q/sys/System';


export class Versment extends EMyApi<models.Versment, models.Versments> {    
    protected GetArrayType() {
        return models.Versments;
    }
    protected GetArgType() {
        return models.Versment;
    }
    protected NativeCreateItem(id: number): models.Versment {
        return new models.Versment(id);
    }
    getDefaultList() { return void 0 /*this._vars.__data.Versments*/; }

    VerserTo(facture: models.Facture, client: models.Client, callback?: DBCallback<models.Versment>, montant?: number) {
        client = client || (facture && facture.Client);
        if (!client) {
            this._vars.apis.Client.Select((e) => {
                var r = e.Data;
                if (e.Error == basic.DataStat.Success) {
                    if (r) this.VerserTo(facture, r, callback);
                    UI.InfoArea.push("You are'nt select any fournisseur");
                    return this.VerserTo(facture, client, callback);
                }
                UI.InfoArea.push("Versment est abondonnee");
                callback && callback(null, false, basics.DataStat.OperationCanceled);
            }, client);
        }
        this.New((e) => {
            var data = e.Data;
            if (e.Error == basics.DataStat.Success) {
                data.Client = client;
                data.Facture = facture;
                this.Edit(data, (e) => {
                    var data = e.Data;
                    if (e.Error === basics.DataStat.Success) {
                        //this._vars.__data.Versments.Add(data);
                        data.Client.VersmentTotal += data.Montant;
                    } else {
                        UI.InfoArea.push("Versment est annulé");
                    }
                    callback && callback(data, true, e.Error);
                });
                data.Montant = montant || 0;
            } else {
                UI.InfoArea.push("An Expected error while creating a Versment ");
                callback && callback(data, true, e.Error);
            }
        });
    }
    Regler(facture?: models.Facture, client?: models.Client, callback?: DBCallback<models.Versment>) {
        if (!facture && !client) return UI.InfoArea.push("Vous devez au moin selectioner soit un fournisseur au une facture.");
        if (facture) {
            this._vars.requester.Request(models.Versments, "Facture.Total", void 0, facture as any, (c, d, f) => {
                facture.MakeChange(function(d: number) {
                    this.Recalc();
                    this.Versment = d || 0;
                }, d as any as number);
                if (facture.Sold != 0)
                    this.VerserTo(facture, client, callback, facture.Sold);
            });
        }
        else {
            this._vars.apis.Client.UpdateData(client, (e) => {
                if (e.Error == basic.DataStat.OperationCanceled) return;
                if (e.Error !== basic.DataStat.Success) UI.InfoArea.push("Une Error Produit Quant le versment est calcer");
                else this.VerserTo(facture, client, callback, client.SoldTotal);
            });
        }
    }
    Get(id: number) {
        var c = models.Versment.getById(id, models.Versment);
        if (!c || c.Stat <= sdata.DataStat.Modified) {
            c = c || new models.Versment(id);
            encoding.SerializationContext.GlobalContext.reset();
            c.FromJson(id, encoding.SerializationContext.GlobalContext, true);
        }
        return c;
    }

    OpenVersmentsOfClient(client: models.Client, callback: (result: models.Versments, selected: models.Versment, client: models.Client, success: boolean) => void) {
        var results = new models.Versments(client);
        this._vars.requester.Request(models.Versments, "VClient", results, client as any, (c, d, f) => {
            if (f)
                this.OpenList(results, (a, b, c) => {
                    callback && callback(results, b, client, c === UI.MessageResult.ok);
                });
            else UI.InfoArea.push("The Server Respond With UnExpected Error");
        });

    }


    OpenVersmentsOfFacture(facture: models.Facture, callback: (result: models.Versments, selected: models.Versment, facture: models.Facture, success: boolean) => void) {
        var results = facture.ClearVersments() as models.Versments;
        this._vars.requester.Request(models.Versments, "VFacture", results, facture as any, (c, d, f) => {
            if (f)
                facture.Recalc(),
                    this.OpenList(results, (modal, selectedItem, result) => {
                        callback && callback(results, selectedItem, facture, result === UI.MessageResult.ok);
                    });
            else UI.InfoArea.push("The Server Respond With UnExpected Error");
        });
    }
    OpenVersmentsOfPour(client: models.Client, callback: (result: models.Versments, selected: models.Versment, client: models.Client, success: boolean) => void) {
        var results = new models.Versments(client);
        this._vars.requester.Request(models.Versments, "VPour", results, client as any, (c, d, f) => {
            if (f)
                this.OpenList(results, (a, b, c) => {
                    callback && callback(results, b, client, c === UI.MessageResult.ok);
                });
            else UI.InfoArea.push("The Server Respond With UnExpected Error");

        });
    }
    OpenVersmentsWithObservation(Observation: string, callback: (result: models.Versments, selected: models.Versment, Observation: string, success: boolean) => void) {

        var results = new models.Versments(null);
        this._vars.requester.Request(models.Versments, "VObservation", results, { Observation: Observation }, (c, d, f) => {
            if (f)
                this.OpenList(results, (a, b, c) => {
                    callback && callback(results, b, Observation, c === UI.MessageResult.ok);
                });
            else UI.InfoArea.push("The Server Respond With UnExpected Error");
        });
    }

    OpenVersmentsWithPeriod(Period: { From: Date, To: Date }, callback: (result: models.Versments, selected: models.Versment, Observation: { From: Date, To: Date }, success: boolean) => void) {

        var results = new models.Versments(null);
        this._vars.requester.Request(models.Versments, "VObservation", results, Period as any, (c, d, f) => {
            if (f)
                this.OpenList(results, (a, b, c) => {
                    callback && callback(results, b, Period, c === UI.MessageResult.ok);
                });
            else UI.InfoArea.push("The Server Respond With UnExpected Error");
        });
    }
    constructor(_vars: basics.vars) {
        super(_vars, 'Versment.cart', <ListTemplateName>{ templateName: 'Versments.CardView', itemTemplateName: undefined });
    }
}