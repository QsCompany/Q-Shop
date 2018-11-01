import { UI } from '../../lib/Q/sys/UI';
import { basic, net } from '../../lib/Q/sys/corelib';
import { models } from '../Models';
import { MyApi, EMyApi, DBCallback, APIEventArgs, APIEventHandler, dateToUTC, FactureBase } from '../extra/AdminApis';
import { basics } from '../extra/Basics';
import { sdata, Controller } from '../../lib/q/sys/System';



export class SFacture extends FactureBase<models.SFacture, models.SFactures> {
    protected GetArrayType() {
        return models.SFactures;
    }
    protected GetArgType() {
        return models.SFacture;
    }
    GetLastArticlePrice(frn: models.Fournisseur, prd: models.Product, before: Date, callback: (price: number) => void, asRecord?: boolean): any {
        this._vars.requester.Costume({ Url: __global.ApiServer.Combine('/_/pstat/LastArticleSolded').FullPath + `?Id=${prd.Id}&CID=${frn && frn.Id}&Befor=${before && dateToUTC(before)}${(asRecord ? '' : '&price')}`, HasBody: false, Method: net.WebRequestMethod.Get
    }, undefined, {}, function (pc, data, s, req) {
            callback && callback(data);
        }, this);
    }

    UpdateArticlesOf(data: models.SFacture, callback?: DBCallback<models.SFacture>): any {
        if (!data) return callback && callback(null, false, basics.DataStat.DataCheckError);
        var x = data.IsFrozen();
        data.UnFreeze();
        if (data.Articles == null) data.Articles = new models.FakePrices(data, []);
        else data.Articles.Clear();
        this._vars.requester.Get(models.FakePrices, data.Articles, data, (d, r, iss) => {
            if (iss) data.Articles.Stat = sdata.DataStat.Updated;
            if (x) data.Freeze();
            else data.UnFreeze();
            callback && callback(d.param, false, iss ? basics.DataStat.Success : basics.DataStat.Fail);
        }, null, null, { Id: String(data.Id) });
    }
    LoadArticlesOf(data: models.SFacture, callback?: DBCallback<models.SFacture>): any {
        if (!data) return callback(null, undefined, basics.DataStat.DataCheckError);
        if (!data.IsOpen)
            if (data.Articles == null || !data.Articles.Stat)
                return this.UpdateArticlesOf(data, callback);
        return callback(data, undefined, basics.DataStat.Success);
    }

    protected UpdateData(data: models.SFacture, callback?: Controller.RequestCallback<models.SFacture>, costumize?: Controller.RequestCostumize<models.SFacture>) {
        this._vars.requester.Request(models.SFacture, "UPDATE", data, data as any, callback, costumize);
    }
    protected UpdateList(list: models.SFactures, ofOwner: sdata.DataRow, callback?: Controller.RequestCallback<models.SFactures>, costumize?: Controller.RequestCostumize<models.SFactures>) {
        this._vars.requester.Get(models.SFactures, list, { OwnerId: ofOwner && ofOwner.Id }, callback, costumize);
    }
    protected UpdateAll(callback?: Controller.RequestCallback<models.SFactures>, costumize?: Controller.RequestCostumize<models.SFactures>) {
        this._vars.requester.Get(models.SFactures, this._vars.__data.SFactures, { FromDate: 0 }, callback, costumize);
    }

    Check(data: models.SFacture): boolean {
        return true;
    }
    Avaible(callback: DBCallback<models.SFactures>): boolean {
        return callback ? callback(this._vars.__data.SFactures, undefined, basics.DataStat.Fail) || true : true;
    }
    New(callback: DBCallback<models.SFacture>, saveToApp: boolean, saveToServer?: boolean): models.SFacture {
        this.Create(callback);
        return void 0;
    }


    Create(callbackg: DBCallback<models.SFacture>) {
        var data: {
            Agent?: models.Agent,
            Fournisseur?: models.Fournisseur,
            Facture?: models.SFacture,
            GData: basics.vars,
            success?: boolean
        } = { GData: this._vars };
        function selectFournisseur(callback: () => void) {
            data.GData.apis.Fournisseur.Select(function(e) {
                var fournisseur = e.Data, iss
                if (e.Error === basic.DataStat.Success) {
                    if (!fournisseur) {
                        UI.InfoArea.push("You must selet a fournisseur");
                        return selectFournisseur(callback);
                    }
                    data.Fournisseur = fournisseur;
                    callback && callback();
                } else {
                    data.Fournisseur = null;
                    callback && callback();
                }
            }, data.Fournisseur);
        }

        function selectAchteur(callback: () => void) {
            data.GData.apis.Agent.Select((e) => {
                var agent = e.Data;
                if (e.Error === basic.DataStat.Success) {
                    if (!agent) {
                        UI.InfoArea.push("You must selet an Achteur");
                         selectAchteur(callback);
                    }
                    data.Agent = agent;
                    callback && callback();
                } else {
                    data.Agent = null;
                    callback && callback();
                }
            }, data.Agent);
        }

        function Main() {
            if (!data.Fournisseur || !data.Agent) {
                UI.InfoArea.push("The Creation of Facture Canceled");
                return callbackg(null, true, basic.DataStat.OperationCanceled);
            }
            data.Facture = new models.SFacture(0);
            data.GData.requester.Request(models.SFacture, "CREATE", data.Facture, { AId: data.Agent.Id, FId: data.Fournisseur.Id }, (a, b, c) => {
                if (!c) {
                    UI.InfoArea.push("Creation of Facture Failed");
                    selectFournisseur(selectFournisseurAndAchteur);
                } else {
                    data.GData.__data.SFactures.Add(a.data);
                    callbackg(a.data, true, basic.DataStat.Success);
                }
            });
        }
        function selectFournisseurAndAchteur(){
            if (data.Fournisseur) return selectAchteur(Main);
            UI.InfoArea.push("The Creation of Facture Canceled");
            return callbackg(null, true, basic.DataStat.OperationCanceled);
        }
        selectFournisseur(selectFournisseurAndAchteur);
    }

    Save(data: models.SFacture, isNew?: boolean, callback?: DBCallback<models.SFacture>) {
        if (this.Check(data))
            this._vars.requester.Request(models.SFacture, 'SAVE', data, null, (s, r, iss) => {
                if (iss) {
                    UI.InfoArea.push("The SFacture Successfully Saved", true);
                    if (isNew)
                        this._vars.__data.SFactures.Add(data);
                    try {
                        data.Recalc();
                        data.NArticles = data.Articles.Count;
                    } catch (e) {

                    }
                    data.Commit();
                    if (callback) callback(data, isNew, basics.DataStat.Success);
                    return;
                } else UI.InfoArea.push("AN Expected Error !!!!!<br>while Inserting The SFacture", false, 8000);
                if (callback) callback(data, isNew, basics.DataStat.Fail);
                data.Rollback();
            });
        else if (callback) callback(data, isNew, basics.DataStat.DataCheckError);
        return true;
    }

    Delete(saveToServer: boolean, data: models.SFacture, callback: DBCallback<models.SFacture>) {
        if (!data) return this.ShowInfo('Select one SFacture PLEASE;');
        UI.Modal.ShowDialog('Confirmation !!', 'Are you sur to delete this SFacture', (xx) => {
            if (xx.Result !== UI.MessageResult.ok) return callback && callback(data, undefined, basics.DataStat.OperationCanceled);
            if (saveToServer) {
                this._vars.requester.Request(models.SFacture, "DELETE", data, data as any,
                    (s, r, iss) => {
                        if (iss) this.deleteData(data);
                        if (!callback || !callback(data, false, iss ? basics.DataStat.Success : basics.DataStat.Fail))
                            this.ShowInfo(
                                iss ?
                                    'The SFacture :' + data.toString() + '  Deleted!! ' :
                                    'Could Not Delete The SFacture :' + data.toString(), false);
                    }
                );
            }
            else {
                this.deleteData(data);
                if (!callback || !callback(data, false, basics.DataStat.Success))
                    this.ShowInfo(
                        'The SFacture :' + data.toString() + '  Deleted!! from App ', true);
            }
        }, 'DELETE', "Let's");
    }
    private deleteData(data: models.SFacture) {
        this._vars.__data.Factures.UnFreeze();
        this._vars.__data.SFactures.Remove(data);
    }
    Edit(saveToServer: boolean, data: models.SFacture, isNew: boolean, callback?: DBCallback<models.SFacture>) {
        if (!data) {
            if (!callback || !callback(data, isNew, basics.DataStat.DataCheckError))
                UI.InfoArea.push('Select one SFacture PLEASE;');
        }
        else {
            this.EditData.edit(data, false, this.getAction(callback));
        }
    }


    OnModalSuccess(data: models.SFacture, isNew: boolean, callback?: DBCallback<models.SFacture>) {
        return this.Save(data, isNew, callback);
    }
    OnModalError(cat: models.SFacture, isNew: boolean, callback?: DBCallback<models.SFacture>) {
        UI.InfoArea.push("The Modification Aborded", true, 2500);
        if (callback) return callback(cat, isNew, basics.DataStat.OperationCanceled);
        return false;
    }

    constructor(_vars:basics.vars) {
        super(_vars, 'SSFacture.edit');
    }
    Print(data: models.SFacture, callback?: DBCallback<models.SFacture>) {
    }
    Validate(data: models.SFacture, isNew?: boolean, callback?: DBCallback<models.SFacture>) {
        if (this.Check(data)) {
            this._vars.requester.Request(models.SFacture, "VALIDATE", data, { Validate: data.Id }, (s, r, iss) => {
                if (iss) {
                    UI.InfoArea.push("The SFacture Successfully Saved", true);
                    data.IsValidated = true;
                    
                    if (isNew) 
                        this._vars.__data.SFactures.Add(data);
                    try {
                        data.Recalc();
                        data.NArticles = data.Articles.Count;
                    } catch (e) {

                    }
                    data.Commit();
                    if (callback) callback(data, isNew, basics.DataStat.Success);
                    return;
                } else UI.InfoArea.push("AN Expected Error !!!!!<br>while Inserting The SFacture", false, 8000);
                if (callback) callback(data, isNew, basics.DataStat.Fail);
                data.Rollback();
            });
        }
        else if (callback) callback(data, isNew, basics.DataStat.DataCheckError);
        return true;
    }
    OpenFacture(data: models.SFacture, callback: DBCallback<models.SFacture>) {
        this._vars.requester.Request(models.SFacture, "OPEN", data, data as any, (c, r, iss) => {
            callback(data, false, iss ? basics.DataStat.Success : basics.DataStat.Fail);
        }, null, null);
    }
    CloseFacture(data: models.SFacture, callback: DBCallback<models.SFacture>) {
        this._vars.requester.Request(models.SFacture, "CLOSE", data, data as any, (c, r, iss) => {            
            if (iss)
                callback(data, false, basics.DataStat.Success);
            else callback(data, false, basics.DataStat.Fail);
        });
    }
    IsFactureOpen(data: models.SFacture, callback: DBCallback<models.SFacture>) {
        this._vars.requester.Request(models.SFacture, "ISOPEN", data, data as any, (c, r, iss) => {
            
            if (iss)
                callback(data, false, basics.DataStat.Success);
            else callback(data, false, basics.DataStat.Fail);
        });
    }
    getDefaultList() { return this._vars.__data.SFactures; }
}


export class CArticle extends EMyApi<models.CArticle, models.CArticles> {
    protected GetArrayType() {
        return models.CArticles;
    }
    protected GetArgType() {
        return models.CArticle;
    
    }
    getDefaultList() { return <models.CArticles>null; }
    constructor(_vars: basics.vars) {
        super(_vars, 'templates.carticleedit', {
            templateName: null,
            itemTemplateName: null
        });
    }
}

export class Command extends EMyApi<models.Command, models.Commands> {
    protected GetArrayType() {
        return models.Commands;
    }
    protected GetArgType() {
        return models.Command;
    }
    getDefaultList() { return null; }
    constructor(_vars: basics.vars) {
        super(_vars, 'templates.carticleedit', {
            templateName: "templates.commands",
            itemTemplateName: null
        });
    }
}



