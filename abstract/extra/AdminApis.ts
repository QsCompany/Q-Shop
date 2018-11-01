import { reflection, collection, Api, basic } from "../../lib/Q/sys/corelib";
import { base, sdata, Controller } from "../../lib/Q/sys/System";
import { UI } from "../../lib/Q/sys/UI";
//import { models } from "../lib/Q/sys/QModel";
import { basics } from "./Basics";
import { models } from "../Models";


export function dateToUTC(date: Date) {
    return date.getTime() + date.getTimezoneOffset() * 60000;
}
export declare type DBCallback<T> = UI.Modals.DBCallback<T>;
export interface ListTemplateName {
    templateName: string;
    itemTemplateName: string
}

export declare type APIEventHandler<T extends sdata.QShopRow, P extends sdata.DataTable<T>> = (e: APIEventArgs<T, P>) => void;

export interface APIEventArgs<T extends sdata.QShopRow, P extends sdata.DataTable<T>> {
    Api: IEMyApi<T, P>;
    Data: T;
    List?: P;
    Error: basic.DataStat;
    E?: UI.Modals.ModalEditorEventArgs<T>;
}


export interface IEMyApi<T extends sdata.QShopRow, P extends sdata.DataTable<T>> {

    getDefaultList(): P;

    Init(_vars: basics.vars, modal: string | UI.Modals.EModalEditer<T>, list: ListTemplateName | UI.Modals.ModalList<T>): void;

    Check(data: T, callback: APIEventHandler<T, P>);
    New(callback: APIEventHandler<T, P>): T;
    Save(data: T, callback?: APIEventHandler<T, P>);
    Delete(data: T, callback: APIEventHandler<T, P>);

    Edit(data: T, callback: APIEventHandler<T,P>);
    Show(data: T, callback: APIEventHandler<T, P>, editable: boolean);
    ShowList(selectedItem?: P, action?: UI.Modals.ModalListAction<T>);
    Get(data: T | number, callback: APIEventHandler<T, P>): T;
    Update(_data?: T | P);

    UpdateData(data: T, callback?: APIEventHandler<T, P>);
    UpdateList(list: P, ofOwner: sdata.DataRow, callback?: APIEventHandler<T, P>);
    UpdateAll(callback?: APIEventHandler<T, P>);
}
export abstract class EMyApi<T extends sdata.QShopRow, P extends sdata.DataTable<T>> implements IEMyApi<T, P> {
    protected callback(callback: APIEventHandler<T, P>, data: T, iss: boolean, list?: P) {
        callback && callback({ Api: this, Data: data, Error: iss ? basic.DataStat.Success : basic.DataStat.Fail, List: list });
    }
    protected callback1(callback: APIEventHandler<T, P>, e: APIEventArgs<T, P>) {
        callback && callback(e);
    }
    protected NativeCreateItem(id:number):T {
        return this.getDefaultList().CreateNewItem(id);
    }
    protected abstract GetArrayType();
    protected abstract GetArgType();
    ShowList(selectedItem: P, action?: UI.Modals.ModalListAction<T>) {
        throw new Error("Method not implemented.");
    }
    Get(data: number | T, callback: APIEventHandler<T, P>): T {
        throw new Error("Method not implemented.");
    }

    ShowInfo(msg: any, isInfo?: any, time?: any): any {
        UI.InfoArea.push(msg, isInfo, time);
    }

    protected _actionList: UI.Modals.ModalListAction<T>;
    private _templateName: string;
    private _listTemplateName: ListTemplateName;
    protected _catModal: UI.Modals.EModalEditer<T>;
    private _listModal: UI.Modals.ModalList<T>;

    constructor(_vars: basics.vars, templateName: string, listTemplate?: ListTemplateName | UI.Modals.ModalList<T>) {
        this.Init(_vars, templateName, listTemplate);
    }
    public get EditData(): UI.Modals.EModalEditer<T> {
        if (!this._catModal && this._templateName) {
            this._catModal = new UI.Modals.EModalEditer<any>(this._templateName,false);
        }
        return this._catModal;
    }
    public getEditList(): UI.Modals.ModalList<T> {
        if (!this._listModal && this._listTemplateName) {
            this._listModal = new UI.Modals.ModalList<T>(undefined, this._listTemplateName.templateName, this._listTemplateName.itemTemplateName);
            this._listModal.OnInitialized = (n) => n.setWidth("90%");
        }
        return this._listModal;
    }
    protected _vars: basics.vars;
    Init(vars: basics.vars, modal: string | UI.Modals.EModalEditer<T>, listTemplate?: ListTemplateName | UI.Modals.ModalList<T>): void {
        this._vars = vars;
        if (listTemplate instanceof UI.Modals.ModalList) this._listModal = listTemplate;
        else this._listTemplateName = listTemplate;
        if (typeof modal === 'string') this._templateName = modal;
        else this._catModal = modal;
    }

    Check(data: T, callback?: APIEventHandler<T, P>) {
        callback && callback({ Api: this, Data: data, Error: basic.DataStat.Success });
    }
    New(callback: APIEventHandler<T, P>): T {
        var c = this.NativeCreateItem(basic.New());
        this._vars.requester.Request(c.GetType(), "CREATE", c, null, (s, j, i) => {
           c && (c.Stat = sdata.DataStat.IsNew);
            if (i) { var t = this.getDefaultList(); t && t.Add(c); }
            this.callback(callback, c, i);
        });
        return c;
    }
    Save(data: T, callback?: APIEventHandler<T, P>){
        this.Check(data, (e) => {
            switch (e.Error) {
                case basics.DataStat.Success:
                    this._vars.requester.Request(data.GetType(), "SAVE", data, null, (s, r, iss) => {
                        if (iss) {
                            UI.InfoArea.push(`The ${data.TableName} Successfully Saved`, true);
                            var t = this.getDefaultList(); t && t.Add(data);
                        } else
                            UI.InfoArea.push(`AN Expected Error !!!!!<br>while Inserting The ${data.TableName}`, false, 8000);
                        this.callback(callback, data, iss);
                    });
                    return;
                //case basics.DataStat.Fail:
                //case basics.DataStat.UnknownStat:
                //case basics.DataStat.DataCheckError:
                //case basics.DataStat.OperationCanceled:
                default:
                    callback && callback(e);
                    return;
            }
        });
    }
    
    Delete(data: T, callback?: APIEventHandler<T, P>) {
        if (!data) return this.ShowInfo(`Select one ${data.TableName} PLEASE;`);
        UI.Modal.ShowDialog('Attention !!', `Are you sur to delete this ${data.TableName}`, (xx) => {
            if (xx.Result !== UI.MessageResult.ok) return callback && callback({ Api: this, Data: data, Error: basics.DataStat.OperationCanceled });
            this._vars.requester.Request(data.GetType(), "DELETE", data, data as any, (s, r, iss) => {
                if (iss) { var t = this.getDefaultList(); t && t.Remove(data); }
                if (!callback || !callback({ Api: this, Data: data, Error: iss ? basics.DataStat.Success : basics.DataStat.Fail }))
                    this.ShowInfo(iss ? `The ${data.TableName} :` + data.toString() + '  Deleted!! ' : `Could Not Delete The ${data.TableName} :` + data.toString(), false);
            });
        }, 'DELETE', "Let's");
    }

    Edit(data: T, callback?: APIEventHandler<T, P>,dontCheckForChangedData?:boolean) {
        var bck = data.CreateBackup();
        var check=()=> {
            this.Check(data, ( e) => {
                switch (e.Error) {
                    case basics.DataStat.Success:
                        return save();
                    case basics.DataStat.Fail:
                    case basics.DataStat.UnknownStat:
                    case basics.DataStat.DataCheckError:
                        UI.InfoArea.push(e.Error == basics.DataStat.DataCheckError ? "Please Validate Your Data" : "Fatal Error Occured");
                        return edit();
                    case basics.DataStat.OperationCanceled:
                        UI.InfoArea.push("Operation Cancled");
                        break;
                }
            });
        }

        var save = () => {
            this.Save(data, ( e) => {
                switch (e.Error) {
                    case basics.DataStat.Success:
                        UI.InfoArea.push(data.TableName + " Successfully saved");
                        data.Commit(bck);
                        callback && callback(e);
                        return this.EditData.NativeClose(UI.MessageResult.ok, true);
                    case basics.DataStat.OperationCanceled:
                        UI.InfoArea.push("Operation Cancled");
                        data.Rollback(bck);
                        callback && callback(e);
                        return this.EditData.NativeClose(UI.MessageResult.cancel, true);
                        break;
                    case basics.DataStat.Fail:
                    case basics.DataStat.UnknownStat:
                    case basics.DataStat.DataCheckError:
                        UI.InfoArea.push(e.Error == basics.DataStat.DataCheckError ? "Please Validate Your Data" : "Fatal Error Occured");
                        return;
                }
            });
        };
        var editCallback: UI.Modals.EModalEditorCallback<T> = (s, e) => {
            e.CommitOrBackupHandled = true;
            var error: basic.DataStat;
            if (e.E.Result == UI.MessageResult.ok)
                if ((dontCheckForChangedData || e.IsDataChanged) && e.Editor.IsEditable) {
                    e.E.StayOpen();
                    return check();
                } else error = basic.DataStat.OperationCanceled;

            data.Rollback(bck, false);
            callback && callback({ Api: this, Data: data, E: e, Error: basic.DataStat.OperationCanceled });
        }
        var edit=()=> {
            this.EditData.edit(data, undefined, editCallback, true);
        }
        edit();
    }
    Show(data: T, callback?: APIEventHandler<T, P>, editabe?: boolean) {
        if (editabe)
            this.Edit(data, callback);
        else
            this.EditData.edit(data, undefined, (s, e) => {
                e.Data.Rollback(e.BackupData);
                e.CommitOrBackupHandled = true;
                callback && callback({ Api: this, Data: e.Data, E: e, Error: basic.DataStat.OperationCanceled });
            }, false);
    }
    OpenList(data: P, action?: UI.Modals.ModalListAction<T>) {
        var c = this.getEditList();
        if (c)
            c.show(action, data);
        else UI.InfoArea.push("This data has no template editor yet");
    }
    /**
     * Update Data From The Server
     * @param _data if(T) Update data
                   if(P) Update list of P.Owner
                   if(undefinned) Update A whole Data Of Type T
     */
    Update(_data?: T | P) {
        if (!_data) return this.UpdateAll();

        _data.Stat = sdata.DataStat.Updating;
        if (_data instanceof sdata.DataRow)
            this.UpdateData(_data);
        else if (_data instanceof sdata.DataTable)
            this.UpdateList(_data, _data.Owner);
        else throw new Error("UnExpected Type Of Data");
    }

    public SmartUpdate() {
        var type = this.GetArrayType() as Function;
        this._vars.requester.Request(type, "SUPDATE", null, {});
    }

    public UpdateData(data: T, callback?: APIEventHandler<T, P>) {
        this._vars.requester.Request(data.GetType(), "UPDATE", data, data as any, (prx, json, iss) => this.callback(callback, data, iss));
    }

    public UpdateList(list: P, ofOwner: sdata.DataRow, callback?: APIEventHandler<T, P>) {
        this._vars.requester.Get(list.GetType() as Function, list, { OwnerId: ofOwner && ofOwner.Id }, (prx, json, iss) => this.callback(callback, void 0, iss, list));
    }
    public UpdateAll(callback?: APIEventHandler<T, P>) {
        this._vars.requester.Get(this.GetArrayType(), this.getDefaultList(), { FromDate: 0 }, (prx, json, iss) => this.callback(callback, void 0, iss, this.getDefaultList()));
    }
    
    Select(callback: APIEventHandler<T, P>, selectedItem?: T, list?: P) {
        this.getEditList().show((n, data, err) => {
            this.callback(callback, data, err == UI.MessageResult.ok, list || this.getDefaultList());
        }, list || this.getDefaultList());
        this.getEditList().OnInitialized = n => n.SelectedItem = selectedItem;
        return this.getEditList();
    }
    abstract getDefaultList(): P;
    CreateNew(callback?: APIEventHandler<T, P>) {
        this.New((e) => {
            if (e.Error == basics.DataStat.Success) {
                var cll: APIEventHandler<T, P>;
                this.Edit(e.Data, cll = (e) => {
                    var iss = e.Error === basics.DataStat.Success;
                    switch (e.Error) {
                        case basics.DataStat.Success:
                            var t = this.getDefaultList();
                            t && t.Add(e.Data);
                            break;
                        case basics.DataStat.Fail:
                        case basics.DataStat.UnknownStat:
                            UI.InfoArea.push("Fatal Error Occured");
                            return this.Edit(e.Data, cll);
                        case basics.DataStat.OperationCanceled:
                            UI.InfoArea.push("Operation Cancled");
                            break;
                        case basics.DataStat.DataCheckError:
                            UI.InfoArea.push("Please Validate Your Data");
                            return this.Edit(e.Data, cll);
                    }
                    this.callback1(callback, e);
                });
            } else this.callback1(callback, e);
        });
    }
}

export interface IMyApi<T extends sdata.QShopRow, P extends sdata.DataTable<T>> {
    Init(_vars:basics. vars, modal: string | UI.Modals.ModalEditer<T>, list: ListTemplateName | UI.Modals.ModalList<T>): void;
    Check(data: T): boolean;
    Avaible(callback: DBCallback<P>): boolean;
    New(callback: DBCallback<T>, saveToApp: boolean, saveToServer?: boolean): T;
    Save(data: T, isNew?: boolean, callback?: DBCallback<T>);
    Edit(saveToServer: boolean, data: T, isNew: boolean, callback:DBCallback<T>);
    Delete(saveToServer: boolean, data: T, callback: DBCallback<T>);
    Open(data: T);
    OpenList(data: P, action?:UI.Modals.ModalListAction<T>);
    Get(data: T | number, full?: boolean);
    Update();
}
basic.DataStat.DataCheckError

export abstract class MyApi<T extends sdata.QShopRow, P extends sdata.DataTable<T>> implements IMyApi<T, P> {

    ShowInfo(msg: any, isInfo?: any, time?: any): any {
        UI.InfoArea.push(msg, isInfo, time);
    }
    protected _action: UI.Modals.EditorAction<T>;
    protected _actionList: UI.Modals.ModalListAction<T>;
    private _templateName: string;
    private _listTemplateName: ListTemplateName;
    protected _catModal: UI.Modals.ModalEditer<T>;
    private _listModal: UI.Modals.ModalList<T>;

    constructor(_vars: basics.vars, templateName: string, listTemplate?: ListTemplateName | UI.Modals.ModalList<T>) {
        this.Init(_vars, templateName, listTemplate);
    }

    protected getAction(callback?: DBCallback<T>) {
        return callback == undefined ? this._action : this._action.Clone(callback);
    }
    public get EditData(): UI.Modals.ModalEditer<T> {
        if (!this._catModal && this._templateName) {
            this._catModal = new UI.Modals.ModalEditer<any>(this._templateName); 
        }
        return this._catModal;
    }
    public getEditList(): UI.Modals.ModalList<T> {

        if (!this._listModal && this._listTemplateName) {
            this._listModal = new UI.Modals.ModalList<T>(undefined, this._listTemplateName.templateName, this._listTemplateName.itemTemplateName);
            this._listModal.OnInitialized = (n) => n.setWidth("90%");
        }
        return this._listModal;
    }
    protected _vars: basics.vars;
    Init(vars: basics.vars, modal: string | UI.Modals.ModalEditer<T>, listTemplate?: ListTemplateName | UI.Modals.ModalList<T>): void {
        this._action = UI.Modals.EditorAction.Create(this, this.OnModalSuccess as any, this.OnModalError as any, this.defaultCallback);
        this._vars = vars;
        if (listTemplate instanceof UI.Modals.ModalList) this._listModal = listTemplate;
        else this._listTemplateName = listTemplate;
        if (typeof modal === 'string') this._templateName = modal;
        else this._catModal = modal;
    }
    abstract Check(data: T): boolean;
    abstract Avaible(callback: DBCallback<P>): boolean;
    abstract New(callback: DBCallback<T>, saveToApp: boolean, saveToServer?: boolean): T;
    /**
      Save a record to database
      @param {T} data the record to Save to database and to App
      @param {boolean} isNew report a data as new value -- doesn't in database yet
      @param {DBCallback<T>} callback callback function whether the record Saved to database or not or any error happened to data    
    */
    abstract Save(data: T, isNew?: boolean, callback?: DBCallback<T>);

    /**
      Delete a record from database
      @param {T} data the record to delete from database and from App
      @param {boolean} saveToServer delete from Database Also
      @param {DBCallback<T>} callback callback function whether the record deleted from database or not or any error happened to data
    */
    abstract Delete(saveToServer: boolean, data: T, callback: DBCallback<T>);

    abstract Edit(saveToServer: boolean, data: T, isNew: boolean, callback: DBCallback<T>);

    Open(data_table: T, isNew?: boolean, action?: UI.Modals.IEditorAction<T>) {
        var c = this.EditData;
        if (c)
            c.edit(data_table, isNew, action);
        else UI.InfoArea.push("This data has no template editor yet");
    }
    OpenList(data: P, action?: UI.Modals.ModalListAction<T>) {
        var c = this.getEditList();
        if (c)
            c.show(action, data);
        else UI.InfoArea.push("This data has no template editor yet");
    }
    /**
     * Update Data From The Server
     * @param _data if(T) Update data
                   if(P) Update list of P.Owner
                   if(undefinned) Update A whole Data Of Type T
     */
    Update(_data?: T | P) {
        if (!_data) return this.UpdateAll();

        _data.Stat = sdata.DataStat.Updating;
        if (_data instanceof sdata.DataRow)
            this.UpdateData(_data);
        else if (_data instanceof sdata.DataTable)
            this.UpdateList(_data, _data.Owner);
        else throw new Error("UnExpected Type Of Data");
    }

    public SmartUpdate() {
        var type = this.getDefaultList().GetType() as Function;
        this._vars.requester.Request(type, "SUPDATE", null, {});
    }

    protected abstract UpdateData(data: T, callback?: Controller.RequestCallback<T>, costumize?: Controller.RequestCostumize<T>);
    protected abstract UpdateList(list: P, ofOwner: sdata.DataRow, callback?: Controller.RequestCallback<P>, costumize?: Controller.RequestCostumize<P>);
    protected abstract UpdateAll(callback?: Controller.RequestCallback<P>, costumize?: Controller.RequestCostumize<P>);
    Get(data: number | T, full?: boolean) {
        throw new Error("Method not implemented.");
    }
    abstract OnModalSuccess(data: T, isNew: boolean, callback?: DBCallback<T>);
    abstract OnModalError(data: T, isNew: boolean, callback?: DBCallback<T>);

    defaultCallback: DBCallback<T>;
    Select(n: UI.Modals.ModalListAction<T>, selectedItem?: T, list?: collection.List<T>) {
        this.getEditList().show(n, list || this.getDefaultList());
        this.getEditList().OnInitialized = n => n.SelectedItem = selectedItem;
        return this.getEditList();
    }
    protected abstract getDefaultList(): collection.List<T>;

    CreateNew(callback?: (agent: T) => void) {
        this.New((data, isNew, error) => {
            if (error == basics.DataStat.Success) {
                var cll: UI.Modals.DBCallback<T>;
                this.Edit(true, data, isNew, cll = (data, isNew, error) => {
                    var iss = error === basics.DataStat.Success;
                    switch (error) {
                        case basics.DataStat.Success:
                            this.getDefaultList().Add(data);
                            break;
                        case basics.DataStat.Fail:
                        case basics.DataStat.UnknownStat:
                            UI.InfoArea.push("Fatal Error Occured");
                            return this.Edit(true, data, isNew, cll);
                        case basics.DataStat.OperationCanceled:
                            UI.InfoArea.push("Operation Cancled");
                            break;
                        case basics.DataStat.DataCheckError:
                            UI.InfoArea.push("Please Validate Your Data");
                            return this.Edit(true, data, isNew, cll);
                    }
                    callback && callback(iss ? data : null);
                });
            }
        }, false, false);
    }
}


export abstract class FactureBase<T extends models.FactureBase, P extends sdata.DataTable<T>> extends MyApi<T, P> {
    abstract UpdateArticlesOf(data: T, callback?: DBCallback<T>): any;
    abstract LoadArticlesOf(data: T, callback?: DBCallback<T>): any;
    abstract Validate(data: T, isNew?: boolean, callback?: DBCallback<T>);
    private close(data:models. FactureBase,callback: (data:models. FactureBase, iss: boolean) => void)  {
        this._vars.requester.Request(data.GetType(), "CLOSE", data, data, (c, is, succ) => {
            if (succ) {
                data.IsOpen = false;
            } else UI.Modal.ShowDialog("Critical Error", "The Data was Saved But Closed Yet");
            callback && callback(data, succ);
        });
    };
    Discart(data: models.FactureBase) {
        this._vars.requester.Request(data.GetType(), "FORCECLOSE", null, data, (c, is, succ) => {
            if (succ) {
                UI.InfoArea.push("The Facture Closed Successfully");
                data.IsOpen = false;
            }
        });
    }
    OpenFacture(data: T, callback?: (data: T, iss: boolean) => void) {
        this._vars.requester.Request(data.GetType(), "OPEN", data, data, (c, is, succ) => {
            if (succ) c.data.IsOpen = true;
            callback && callback(data, succ);
        });
    }
    CloseFacture(data: T, callback?: (data: T, iss: boolean) => void) {
        return this.close(data, callback);
    }
    EOpenFacture(data: T | models. FactureBase) {
        if (data.IsOpen == null) data.IsOpen = false;
        if (data.IsOpen)
            this.close(data, (data, iss) => {
                if (iss)
                    if (data instanceof models.SFacture)
                        return this._vars.apis.SVersment.Regler(data, data.Fournisseur);
                    else if (data instanceof models.Facture)
                        return this._vars.apis.Versment.Regler(data, data.Client);
                UI.Modal.ShowDialog("Critical Error", "The Facture Is Saved But doesn't Closed <br> Fatal Error When Closing The Facture");
            });
        else
            this._vars.requester.Request(data.GetType(), "OPEN", data, data, (c, is, succ) => {
                if (succ) {

                    data.IsOpen = true;
                } else UI.Modal.ShowDialog("Critical Error", "It'seem that the facture cannot be opened . Sory");
            });
    }
    CreateNew(callback?: (fact: T) => void) {
        super.CreateNew((fact) => {
            Api.RiseApi('OpenFactureInfo', {
                callback: (p, da) => {
                    callback(p.data);
                },
                data: fact,
            });
        });
    }

}
export abstract class EFactureBase<T extends models.FactureBase, P extends sdata.DataTable<T>> extends EMyApi<T, P> {
    abstract UpdateArticlesOf(data: T, callback?: APIEventHandler<T, P>);
    abstract LoadArticlesOf(data: T, callback?: APIEventHandler<T,P>);
    abstract Validate(data: T, callback?: APIEventHandler<T, P>);
    private close(data: T, callback: APIEventHandler<T,P>) {
        this._vars.requester.Request(data.GetType(), "CLOSE", data, data as any, (c, is, succ) => {
            models.Login
            if (succ)
                data.IsOpen = false;
            else UI.Modal.ShowDialog("Critical Error", "The Data was Saved But Closed Yet");
            this.callback(callback, c.data, succ);
        });
    };
    Discart(data: T) {
        this._vars.requester.Request(data.GetType(), "FORCECLOSE", null, data as any, (c, is, succ) => {
            if (succ) {
                UI.InfoArea.push("The Facture Closed Successfully");
                data.IsOpen = false;
            }
        });
    }
    EOpenFacture(data: T) {
        if (data.IsOpen == null) data.IsOpen = false;
        if (data.IsOpen)
            this.close(data, (e) => {
                if (e.Error==basic.DataStat.Success)
                    if (data instanceof models.SFacture)
                        return this._vars.apis.SVersment.Regler(data, data.Fournisseur);
                    else if (data instanceof models.Facture)
                        return this._vars.apis.Versment.Regler(data, data.Client);
                UI.Modal.ShowDialog("Critical Error", "The Facture Is Saved But doesn't Closed <br> Fatal Error When Closing The Facture");
            });
        else
            this._vars.requester.Request(data.GetType(), "OPEN", data, data as any, (c, is, succ) => {
                if (succ) {
                    data.IsOpen = true;
                } else UI.Modal.ShowDialog("Critical Error", "It'seem that the facture cannot be opened . Sory");
            });
    }
    CreateNew(callback?: APIEventHandler<T, P>) {
        super.CreateNew((e) => {
            if (e.Error == basic.DataStat.Success)
                Api.RiseApi('OpenFactureInfo', {
                    callback: (p, da) => {
                        this.callback(callback, p.data, true);
                    },
                    data: e.Data,
                });
        });
    }

}
