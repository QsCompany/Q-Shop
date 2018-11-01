import { UI } from '../../lib/Q/sys/UI';
import { basic, encoding } from '../../lib/Q/sys/corelib';
import { models } from '../Models';
import { MyApi, EMyApi, DBCallback, APIEventArgs, APIEventHandler, ListTemplateName } from '../extra/AdminApis';
import { basics } from '../extra/Basics';
import { sdata } from '../../lib/q/sys/System';

export class SVersment extends EMyApi<models.SVersment, models.SVersments> {    
    protected GetArrayType() {
        return models.SVersments;
    }
    protected GetArgType() {
        return models.SVersment;
    }
    protected NativeCreateItem(id: number): models.SVersment {
        return new models.SVersment(id);
    }
    VerserTo(facture: models.SFacture, fournisseur: models.Fournisseur, callback?: DBCallback<models.SVersment>, montant?: number) {
        fournisseur = fournisseur || (facture && facture.Fournisseur);
        if (!fournisseur)
            return UI.InfoArea.push("Unvalid fournisseur ");
        this.New((e) => {
            var data = e.Data, isNew = true, error = e.Error;
            if (error == basics.DataStat.Success) {
                data.Fournisseur = fournisseur;
                data.Facture = facture;
                this.Edit(data, (e) => {
                    var data = e.Data, isNew = true, error = e.Error;
                    if (error === basics.DataStat.Success) {
                        //this._vars.__data.SVersments.Add(data);
                        data.Fournisseur.VersmentTotal += data.Montant;
                    } else {
                        UI.InfoArea.push("Versment est annulé");
                    }
                    callback && callback(data, isNew, error);
                });
                data.Montant = montant || 0;
            } else {
                UI.InfoArea.push("An Expected error while creating a Versment ");
                callback && callback(data, isNew, error);
            }
        });
    }

    Regler(facture?: models.SFacture, fournisseur?: models.Fournisseur, callback?: DBCallback<models.SVersment>) {
        this.OpenSVersmentsOfFacture
        if (!facture && !fournisseur) return UI.InfoArea.push("Vous devez au moin selectioner soit un fournisseur au une facture.");
        if (facture) {

            this._vars.requester.Request(models.SVersments, "Facture.Total", void 0, facture as any, (c, d, f) => {
                facture.MakeChange(function(d: number) {
                    this.Recalc();
                    this.Versment = d || 0;
                }, d as any as number);
                if (facture.Sold != 0)
                    this.VerserTo(facture, fournisseur, callback, facture.Sold);
            });
        }
        else {
            this.VerserTo(facture, fournisseur, callback, fournisseur.SoldTotal);
        }
    }
    Get(id: number/*, callback?: DBCallback<models.Versment>*/) {
        var c = models.SVersment.getById(id, models.SVersment);
        if (!c) {
            c = new models.SVersment(id);
            encoding.SerializationContext.GlobalContext.reset();
            c.FromJson(id, encoding.SerializationContext.GlobalContext, true);
        }
        return c;
    }
    getDefaultList() { return void 0; /*return this._vars.__data.SVersments;*/ }

    
    /*================================================================================================================*/


    OpenSVersmentsOfFournisseur(fournisseur: models.Fournisseur, callback: (result: models.SVersments, selected: models.SVersment, fournisseur: models.Fournisseur, success: boolean) => void) {
        var results = new models.SVersments(fournisseur);
        this._vars.requester.Request(models.SVersments, "VFournisseur", results, fournisseur as any, (c, d, f) => {
            if (f)
                this.OpenList(results, (a, b, c) => {
                    callback && callback(results, b, fournisseur, c === UI.MessageResult.ok);
                });
            else UI.InfoArea.push("The Server Respond With UnExpected Error");
        });
    }

    OpenSVersmentsOfFacture(facture: models.SFacture, callback: (result: models.SVersments, selected: models.SVersment, facture: models.SFacture, success: boolean) => void) {
        var results = new models.SVersments(facture);
        this._vars.requester.Request(models.SVersments, "VFacture", results, facture as any, (c, d, f) => {
            if (f)
                this.OpenList(results, (modal, selectedItem, result) => {
                    callback && callback(results, selectedItem, facture, result === UI.MessageResult.ok);
                });
            else UI.InfoArea.push("The Server Respond With UnExpected Error");
        });
    }

    OpenSVersmentsWithObservation(Observation: string, callback: (result: models.SVersments, selected: models.SVersment, Observation: string, success: boolean) => void) {
        var results = new models.SVersments(null);
        this._vars.requester.Request(models.SVersments, "VObservation", results, { Observation: Observation }, (c, d, f) => {
            if (f) this.OpenList(results, (a, b, c) => {
                callback && callback(results, b, Observation, c === UI.MessageResult.ok);
            });
            else UI.InfoArea.push("The Server Respond With UnExpected Error");
        });
    }

    OpenSVersmentsWithPeriod(Period: { From: Date, To: Date }, callback: (result: models.SVersments, selected: models.SVersment, Observation: { From: Date, To: Date }, success: boolean) => void) {
        var results = new models.SVersments(null);
        this._vars.requester.Request(models.SVersments, "VObservation", results, Period as any, (c, d, f) => {
            if (f) this.OpenList(results, (a, b, c) => {
                callback && callback(results, b, Period, c === UI.MessageResult.ok);
            });
            else UI.InfoArea.push("The Server Respond With UnExpected Error");
        });
    }

    /*================================================================================================================*/

    constructor(_vars: basics.vars) {
        super(_vars, 'SVersment.cart', <ListTemplateName>{ templateName: 'SVersment.list', itemTemplateName: undefined });
    }


}