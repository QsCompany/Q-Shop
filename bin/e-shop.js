var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define("__supervisor__", ["require", "exports", "context"], function (require, exports, context) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function detectmob() {
        return (navigator.userAgent.match(/Android/i)
            || navigator.userAgent.match(/webOS/i)
            || navigator.userAgent.match(/iPhone/i)
            || navigator.userAgent.match(/iPad/i)
            || navigator.userAgent.match(/iPod/i)
            || navigator.userAgent.match(/BlackBerry/i)
            || navigator.userAgent.match(/Windows Phone/i));
    }
    var isMobole = detectmob();
    var device = !detectmob() ? 'mobile/' : 'desktop/';
    context.SetSuperVisor(function (url) {
        var p = url.FullPath.toLowerCase();
        if (isMobole) {
            if (p.indexOf(device) === 0 || p.indexOf("apps/") == 0 || p.indexOf('idea/') == 0 || p.indexOf('componenets') == 0)
                return true;
        }
        else {
            if (p.indexOf(device) === 0)
                return true;
        }
        return false;
    });
});
define("abstract/extra/AdminApis", ["require", "exports", "../../lib/Q/sys/corelib", "../../lib/Q/sys/System", "../../lib/Q/sys/UI", "abstract/extra/Basics", "abstract/Models"], function (require, exports, corelib_1, System_1, UI_1, Basics_1, Models_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function dateToUTC(date) {
        return date.getTime() + date.getTimezoneOffset() * 60000;
    }
    exports.dateToUTC = dateToUTC;
    var EMyApi = (function () {
        function EMyApi(_vars, templateName, listTemplate) {
            this.Init(_vars, templateName, listTemplate);
        }
        EMyApi.prototype.callback = function (callback, data, iss, list) {
            callback && callback({ Api: this, Data: data, Error: iss ? corelib_1.basic.DataStat.Success : corelib_1.basic.DataStat.Fail, List: list });
        };
        EMyApi.prototype.callback1 = function (callback, e) {
            callback && callback(e);
        };
        EMyApi.prototype.NativeCreateItem = function (id) {
            return this.getDefaultList().CreateNewItem(id);
        };
        EMyApi.prototype.ShowList = function (selectedItem, action) {
            throw new Error("Method not implemented.");
        };
        EMyApi.prototype.Get = function (data, callback) {
            throw new Error("Method not implemented.");
        };
        EMyApi.prototype.ShowInfo = function (msg, isInfo, time) {
            UI_1.UI.InfoArea.push(msg, isInfo, time);
        };
        Object.defineProperty(EMyApi.prototype, "EditData", {
            get: function () {
                if (!this._catModal && this._templateName) {
                    this._catModal = new UI_1.UI.Modals.EModalEditer(this._templateName, false);
                }
                return this._catModal;
            },
            enumerable: true,
            configurable: true
        });
        EMyApi.prototype.getEditList = function () {
            if (!this._listModal && this._listTemplateName) {
                this._listModal = new UI_1.UI.Modals.ModalList(undefined, this._listTemplateName.templateName, this._listTemplateName.itemTemplateName);
                this._listModal.OnInitialized = function (n) { return n.setWidth("90%"); };
            }
            return this._listModal;
        };
        EMyApi.prototype.Init = function (vars, modal, listTemplate) {
            this._vars = vars;
            if (listTemplate instanceof UI_1.UI.Modals.ModalList)
                this._listModal = listTemplate;
            else
                this._listTemplateName = listTemplate;
            if (typeof modal === 'string')
                this._templateName = modal;
            else
                this._catModal = modal;
        };
        EMyApi.prototype.Check = function (data, callback) {
            callback && callback({ Api: this, Data: data, Error: corelib_1.basic.DataStat.Success });
        };
        EMyApi.prototype.New = function (callback) {
            var _this = this;
            var c = this.NativeCreateItem(corelib_1.basic.New());
            this._vars.requester.Request(c.GetType(), "CREATE", c, null, function (s, j, i) {
                c && (c.Stat = System_1.sdata.DataStat.IsNew);
                if (i) {
                    var t = _this.getDefaultList();
                    t && t.Add(c);
                }
                _this.callback(callback, c, i);
            });
            return c;
        };
        EMyApi.prototype.Save = function (data, callback) {
            var _this = this;
            this.Check(data, function (e) {
                switch (e.Error) {
                    case Basics_1.basics.DataStat.Success:
                        _this._vars.requester.Request(data.GetType(), "SAVE", data, null, function (s, r, iss) {
                            if (iss) {
                                UI_1.UI.InfoArea.push("The " + data.TableName + " Successfully Saved", true);
                                var t = _this.getDefaultList();
                                t && t.Add(data);
                            }
                            else
                                UI_1.UI.InfoArea.push("AN Expected Error !!!!!<br>while Inserting The " + data.TableName, false, 8000);
                            _this.callback(callback, data, iss);
                        });
                        return;
                    default:
                        callback && callback(e);
                        return;
                }
            });
        };
        EMyApi.prototype.Delete = function (data, callback) {
            var _this = this;
            if (!data)
                return this.ShowInfo("Select one " + data.TableName + " PLEASE;");
            UI_1.UI.Modal.ShowDialog('Attention !!', "Are you sur to delete this " + data.TableName, function (xx) {
                if (xx.Result !== UI_1.UI.MessageResult.ok)
                    return callback && callback({ Api: _this, Data: data, Error: Basics_1.basics.DataStat.OperationCanceled });
                _this._vars.requester.Request(data.GetType(), "DELETE", data, data, function (s, r, iss) {
                    if (iss) {
                        var t = _this.getDefaultList();
                        t && t.Remove(data);
                    }
                    if (!callback || !callback({ Api: _this, Data: data, Error: iss ? Basics_1.basics.DataStat.Success : Basics_1.basics.DataStat.Fail }))
                        _this.ShowInfo(iss ? "The " + data.TableName + " :" + data.toString() + '  Deleted!! ' : "Could Not Delete The " + data.TableName + " :" + data.toString(), false);
                });
            }, 'DELETE', "Let's");
        };
        EMyApi.prototype.Edit = function (data, callback, dontCheckForChangedData) {
            var _this = this;
            var bck = data.CreateBackup();
            var check = function () {
                _this.Check(data, function (e) {
                    switch (e.Error) {
                        case Basics_1.basics.DataStat.Success:
                            return save();
                        case Basics_1.basics.DataStat.Fail:
                        case Basics_1.basics.DataStat.UnknownStat:
                        case Basics_1.basics.DataStat.DataCheckError:
                            UI_1.UI.InfoArea.push(e.Error == Basics_1.basics.DataStat.DataCheckError ? "Please Validate Your Data" : "Fatal Error Occured");
                            return edit();
                        case Basics_1.basics.DataStat.OperationCanceled:
                            UI_1.UI.InfoArea.push("Operation Cancled");
                            break;
                    }
                });
            };
            var save = function () {
                _this.Save(data, function (e) {
                    switch (e.Error) {
                        case Basics_1.basics.DataStat.Success:
                            UI_1.UI.InfoArea.push(data.TableName + " Successfully saved");
                            data.Commit(bck);
                            callback && callback(e);
                            return _this.EditData.NativeClose(UI_1.UI.MessageResult.ok, true);
                        case Basics_1.basics.DataStat.OperationCanceled:
                            UI_1.UI.InfoArea.push("Operation Cancled");
                            data.Rollback(bck);
                            callback && callback(e);
                            return _this.EditData.NativeClose(UI_1.UI.MessageResult.cancel, true);
                            break;
                        case Basics_1.basics.DataStat.Fail:
                        case Basics_1.basics.DataStat.UnknownStat:
                        case Basics_1.basics.DataStat.DataCheckError:
                            UI_1.UI.InfoArea.push(e.Error == Basics_1.basics.DataStat.DataCheckError ? "Please Validate Your Data" : "Fatal Error Occured");
                            return;
                    }
                });
            };
            var editCallback = function (s, e) {
                e.CommitOrBackupHandled = true;
                var error;
                if (e.E.Result == UI_1.UI.MessageResult.ok)
                    if ((dontCheckForChangedData || e.IsDataChanged) && e.Editor.IsEditable) {
                        e.E.StayOpen();
                        return check();
                    }
                    else
                        error = corelib_1.basic.DataStat.OperationCanceled;
                data.Rollback(bck, false);
                callback && callback({ Api: _this, Data: data, E: e, Error: corelib_1.basic.DataStat.OperationCanceled });
            };
            var edit = function () {
                _this.EditData.edit(data, undefined, editCallback, true);
            };
            edit();
        };
        EMyApi.prototype.Show = function (data, callback, editabe) {
            var _this = this;
            if (editabe)
                this.Edit(data, callback);
            else
                this.EditData.edit(data, undefined, function (s, e) {
                    e.Data.Rollback(e.BackupData);
                    e.CommitOrBackupHandled = true;
                    callback && callback({ Api: _this, Data: e.Data, E: e, Error: corelib_1.basic.DataStat.OperationCanceled });
                }, false);
        };
        EMyApi.prototype.OpenList = function (data, action) {
            var c = this.getEditList();
            if (c)
                c.show(action, data);
            else
                UI_1.UI.InfoArea.push("This data has no template editor yet");
        };
        EMyApi.prototype.Update = function (_data) {
            if (!_data)
                return this.UpdateAll();
            _data.Stat = System_1.sdata.DataStat.Updating;
            if (_data instanceof System_1.sdata.DataRow)
                this.UpdateData(_data);
            else if (_data instanceof System_1.sdata.DataTable)
                this.UpdateList(_data, _data.Owner);
            else
                throw new Error("UnExpected Type Of Data");
        };
        EMyApi.prototype.SmartUpdate = function () {
            var type = this.GetArrayType();
            this._vars.requester.Request(type, "SUPDATE", null, {});
        };
        EMyApi.prototype.UpdateData = function (data, callback) {
            var _this = this;
            this._vars.requester.Request(data.GetType(), "UPDATE", data, data, function (prx, json, iss) { return _this.callback(callback, data, iss); });
        };
        EMyApi.prototype.UpdateList = function (list, ofOwner, callback) {
            var _this = this;
            this._vars.requester.Get(list.GetType(), list, { OwnerId: ofOwner && ofOwner.Id }, function (prx, json, iss) { return _this.callback(callback, void 0, iss, list); });
        };
        EMyApi.prototype.UpdateAll = function (callback) {
            var _this = this;
            this._vars.requester.Get(this.GetArrayType(), this.getDefaultList(), { FromDate: 0 }, function (prx, json, iss) { return _this.callback(callback, void 0, iss, _this.getDefaultList()); });
        };
        EMyApi.prototype.Select = function (callback, selectedItem, list) {
            var _this = this;
            this.getEditList().show(function (n, data, err) {
                _this.callback(callback, data, err == UI_1.UI.MessageResult.ok, list || _this.getDefaultList());
            }, list || this.getDefaultList());
            this.getEditList().OnInitialized = function (n) { return n.SelectedItem = selectedItem; };
            return this.getEditList();
        };
        EMyApi.prototype.CreateNew = function (callback) {
            var _this = this;
            this.New(function (e) {
                if (e.Error == Basics_1.basics.DataStat.Success) {
                    var cll;
                    _this.Edit(e.Data, cll = function (e) {
                        var iss = e.Error === Basics_1.basics.DataStat.Success;
                        switch (e.Error) {
                            case Basics_1.basics.DataStat.Success:
                                var t = _this.getDefaultList();
                                t && t.Add(e.Data);
                                break;
                            case Basics_1.basics.DataStat.Fail:
                            case Basics_1.basics.DataStat.UnknownStat:
                                UI_1.UI.InfoArea.push("Fatal Error Occured");
                                return _this.Edit(e.Data, cll);
                            case Basics_1.basics.DataStat.OperationCanceled:
                                UI_1.UI.InfoArea.push("Operation Cancled");
                                break;
                            case Basics_1.basics.DataStat.DataCheckError:
                                UI_1.UI.InfoArea.push("Please Validate Your Data");
                                return _this.Edit(e.Data, cll);
                        }
                        _this.callback1(callback, e);
                    });
                }
                else
                    _this.callback1(callback, e);
            });
        };
        return EMyApi;
    }());
    exports.EMyApi = EMyApi;
    corelib_1.basic.DataStat.DataCheckError;
    var MyApi = (function () {
        function MyApi(_vars, templateName, listTemplate) {
            this.Init(_vars, templateName, listTemplate);
        }
        MyApi.prototype.ShowInfo = function (msg, isInfo, time) {
            UI_1.UI.InfoArea.push(msg, isInfo, time);
        };
        MyApi.prototype.getAction = function (callback) {
            return callback == undefined ? this._action : this._action.Clone(callback);
        };
        Object.defineProperty(MyApi.prototype, "EditData", {
            get: function () {
                if (!this._catModal && this._templateName) {
                    this._catModal = new UI_1.UI.Modals.ModalEditer(this._templateName);
                }
                return this._catModal;
            },
            enumerable: true,
            configurable: true
        });
        MyApi.prototype.getEditList = function () {
            if (!this._listModal && this._listTemplateName) {
                this._listModal = new UI_1.UI.Modals.ModalList(undefined, this._listTemplateName.templateName, this._listTemplateName.itemTemplateName);
                this._listModal.OnInitialized = function (n) { return n.setWidth("90%"); };
            }
            return this._listModal;
        };
        MyApi.prototype.Init = function (vars, modal, listTemplate) {
            this._action = UI_1.UI.Modals.EditorAction.Create(this, this.OnModalSuccess, this.OnModalError, this.defaultCallback);
            this._vars = vars;
            if (listTemplate instanceof UI_1.UI.Modals.ModalList)
                this._listModal = listTemplate;
            else
                this._listTemplateName = listTemplate;
            if (typeof modal === 'string')
                this._templateName = modal;
            else
                this._catModal = modal;
        };
        MyApi.prototype.Open = function (data_table, isNew, action) {
            var c = this.EditData;
            if (c)
                c.edit(data_table, isNew, action);
            else
                UI_1.UI.InfoArea.push("This data has no template editor yet");
        };
        MyApi.prototype.OpenList = function (data, action) {
            var c = this.getEditList();
            if (c)
                c.show(action, data);
            else
                UI_1.UI.InfoArea.push("This data has no template editor yet");
        };
        MyApi.prototype.Update = function (_data) {
            if (!_data)
                return this.UpdateAll();
            _data.Stat = System_1.sdata.DataStat.Updating;
            if (_data instanceof System_1.sdata.DataRow)
                this.UpdateData(_data);
            else if (_data instanceof System_1.sdata.DataTable)
                this.UpdateList(_data, _data.Owner);
            else
                throw new Error("UnExpected Type Of Data");
        };
        MyApi.prototype.SmartUpdate = function () {
            var type = this.getDefaultList().GetType();
            this._vars.requester.Request(type, "SUPDATE", null, {});
        };
        MyApi.prototype.Get = function (data, full) {
            throw new Error("Method not implemented.");
        };
        MyApi.prototype.Select = function (n, selectedItem, list) {
            this.getEditList().show(n, list || this.getDefaultList());
            this.getEditList().OnInitialized = function (n) { return n.SelectedItem = selectedItem; };
            return this.getEditList();
        };
        MyApi.prototype.CreateNew = function (callback) {
            var _this = this;
            this.New(function (data, isNew, error) {
                if (error == Basics_1.basics.DataStat.Success) {
                    var cll;
                    _this.Edit(true, data, isNew, cll = function (data, isNew, error) {
                        var iss = error === Basics_1.basics.DataStat.Success;
                        switch (error) {
                            case Basics_1.basics.DataStat.Success:
                                _this.getDefaultList().Add(data);
                                break;
                            case Basics_1.basics.DataStat.Fail:
                            case Basics_1.basics.DataStat.UnknownStat:
                                UI_1.UI.InfoArea.push("Fatal Error Occured");
                                return _this.Edit(true, data, isNew, cll);
                            case Basics_1.basics.DataStat.OperationCanceled:
                                UI_1.UI.InfoArea.push("Operation Cancled");
                                break;
                            case Basics_1.basics.DataStat.DataCheckError:
                                UI_1.UI.InfoArea.push("Please Validate Your Data");
                                return _this.Edit(true, data, isNew, cll);
                        }
                        callback && callback(iss ? data : null);
                    });
                }
            }, false, false);
        };
        return MyApi;
    }());
    exports.MyApi = MyApi;
    var FactureBase = (function (_super) {
        __extends(FactureBase, _super);
        function FactureBase() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        FactureBase.prototype.close = function (data, callback) {
            this._vars.requester.Request(data.GetType(), "CLOSE", data, data, function (c, is, succ) {
                if (succ) {
                    data.IsOpen = false;
                }
                else
                    UI_1.UI.Modal.ShowDialog("Critical Error", "The Data was Saved But Closed Yet");
                callback && callback(data, succ);
            });
        };
        ;
        FactureBase.prototype.Discart = function (data) {
            this._vars.requester.Request(data.GetType(), "FORCECLOSE", null, data, function (c, is, succ) {
                if (succ) {
                    UI_1.UI.InfoArea.push("The Facture Closed Successfully");
                    data.IsOpen = false;
                }
            });
        };
        FactureBase.prototype.OpenFacture = function (data, callback) {
            this._vars.requester.Request(data.GetType(), "OPEN", data, data, function (c, is, succ) {
                if (succ)
                    c.data.IsOpen = true;
                callback && callback(data, succ);
            });
        };
        FactureBase.prototype.CloseFacture = function (data, callback) {
            return this.close(data, callback);
        };
        FactureBase.prototype.EOpenFacture = function (data) {
            var _this = this;
            if (data.IsOpen == null)
                data.IsOpen = false;
            if (data.IsOpen)
                this.close(data, function (data, iss) {
                    if (iss)
                        if (data instanceof Models_1.models.SFacture)
                            return _this._vars.apis.SVersment.Regler(data, data.Fournisseur);
                        else if (data instanceof Models_1.models.Facture)
                            return _this._vars.apis.Versment.Regler(data, data.Client);
                    UI_1.UI.Modal.ShowDialog("Critical Error", "The Facture Is Saved But doesn't Closed <br> Fatal Error When Closing The Facture");
                });
            else
                this._vars.requester.Request(data.GetType(), "OPEN", data, data, function (c, is, succ) {
                    if (succ) {
                        data.IsOpen = true;
                    }
                    else
                        UI_1.UI.Modal.ShowDialog("Critical Error", "It'seem that the facture cannot be opened . Sory");
                });
        };
        FactureBase.prototype.CreateNew = function (callback) {
            _super.prototype.CreateNew.call(this, function (fact) {
                corelib_1.Api.RiseApi('OpenFactureInfo', {
                    callback: function (p, da) {
                        callback(p.data);
                    },
                    data: fact,
                });
            });
        };
        return FactureBase;
    }(MyApi));
    exports.FactureBase = FactureBase;
    var EFactureBase = (function (_super) {
        __extends(EFactureBase, _super);
        function EFactureBase() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        EFactureBase.prototype.close = function (data, callback) {
            var _this = this;
            this._vars.requester.Request(data.GetType(), "CLOSE", data, data, function (c, is, succ) {
                Models_1.models.Login;
                if (succ)
                    data.IsOpen = false;
                else
                    UI_1.UI.Modal.ShowDialog("Critical Error", "The Data was Saved But Closed Yet");
                _this.callback(callback, c.data, succ);
            });
        };
        ;
        EFactureBase.prototype.Discart = function (data) {
            this._vars.requester.Request(data.GetType(), "FORCECLOSE", null, data, function (c, is, succ) {
                if (succ) {
                    UI_1.UI.InfoArea.push("The Facture Closed Successfully");
                    data.IsOpen = false;
                }
            });
        };
        EFactureBase.prototype.EOpenFacture = function (data) {
            var _this = this;
            if (data.IsOpen == null)
                data.IsOpen = false;
            if (data.IsOpen)
                this.close(data, function (e) {
                    if (e.Error == corelib_1.basic.DataStat.Success)
                        if (data instanceof Models_1.models.SFacture)
                            return _this._vars.apis.SVersment.Regler(data, data.Fournisseur);
                        else if (data instanceof Models_1.models.Facture)
                            return _this._vars.apis.Versment.Regler(data, data.Client);
                    UI_1.UI.Modal.ShowDialog("Critical Error", "The Facture Is Saved But doesn't Closed <br> Fatal Error When Closing The Facture");
                });
            else
                this._vars.requester.Request(data.GetType(), "OPEN", data, data, function (c, is, succ) {
                    if (succ) {
                        data.IsOpen = true;
                    }
                    else
                        UI_1.UI.Modal.ShowDialog("Critical Error", "It'seem that the facture cannot be opened . Sory");
                });
        };
        EFactureBase.prototype.CreateNew = function (callback) {
            var _this = this;
            _super.prototype.CreateNew.call(this, function (e) {
                if (e.Error == corelib_1.basic.DataStat.Success)
                    corelib_1.Api.RiseApi('OpenFactureInfo', {
                        callback: function (p, da) {
                            _this.callback(callback, p.data, true);
                        },
                        data: e.Data,
                    });
            });
        };
        return EFactureBase;
    }(EMyApi));
    exports.EFactureBase = EFactureBase;
});
define("abstract/Apis/Agent", ["require", "exports", "../../lib/Q/sys/corelib", "abstract/Models", "abstract/extra/AdminApis", "../../lib/Q/sys/System"], function (require, exports, corelib_2, Models_2, AdminApis_1, System_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Agent = (function (_super) {
        __extends(Agent, _super);
        function Agent(_vars) {
            return _super.call(this, _vars, 'Agent.edit', {
                templateName: "Agents.table",
                itemTemplateName: null
            }) || this;
        }
        Agent.prototype.GetArrayType = function () {
            return Models_2.models.Agents;
        };
        Agent.prototype.GetArgType = function () {
            return Models_2.models.Agent;
        };
        Agent.prototype.getDefaultList = function () { return this._vars.__data.Agents; };
        return Agent;
    }(AdminApis_1.EMyApi));
    exports.Agent = Agent;
    var SMS = (function (_super) {
        __extends(SMS, _super);
        function SMS(_vars) {
            return _super.call(this, _vars, 'SMS.edit') || this;
        }
        SMS.prototype.Check = function (data, callback) {
            var e = corelib_2.basic.DataStat.Success;
            if (data.To == null)
                e = corelib_2.basic.DataStat.DataCheckError;
            else if (!data.Title && !data.Message)
                e = corelib_2.basic.DataStat.DataCheckError;
            else if (data.To == this._vars.user.Client)
                e = corelib_2.basic.DataStat.DataCheckError;
            else if (data.To == data.From)
                e = corelib_2.basic.DataStat.DataCheckError;
            callback && callback({ Api: this, Data: data, Error: e });
        };
        SMS.prototype.GetArrayType = function () {
            return Models_2.models.SMSs;
        };
        SMS.prototype.GetArgType = function () {
            return Models_2.models.SMS;
        };
        SMS.prototype.getDefaultList = function () { return this._vars.__data.SMSs; };
        SMS.prototype.Update = function (_data, tag) {
            if (_data instanceof System_2.sdata.DataRow)
                return _super.prototype.Update.call(this, _data);
            this._vars.requester.Request(Models_2.models.SMSs, "Update", _data, { param: tag || _data.Tag }, function (pcall, json, iss, req) {
                if (iss)
                    _data.Clear();
                _data.FromCsv(req.Response, corelib_2.encoding.SerializationContext.GlobalContext.reset());
            });
        };
        SMS.prototype.SaveProperty = function (_data, properties, callback) {
            this._vars.requester.Request(_data.getType(), "SetProperty", properties, { Id: _data.Id }, callback);
        };
        return SMS;
    }(AdminApis_1.EMyApi));
    exports.SMS = SMS;
});
define("abstract/Apis/Article", ["require", "exports", "abstract/Models", "abstract/extra/AdminApis"], function (require, exports, Models_3, AdminApis_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Article = (function (_super) {
        __extends(Article, _super);
        function Article(_vars) {
            return _super.call(this, _vars, 'Article.edit') || this;
        }
        Article.prototype.GetArrayType = function () {
            return Models_3.models.Articles;
        };
        Article.prototype.GetArgType = function () {
            return Models_3.models.Article;
        };
        Article.prototype.NativeCreateItem = function (id) {
            return new Models_3.models.Article(id);
        };
        Article.prototype.Check = function (data, callback) {
            this.callback(callback, data, (data && data.Product) != null);
        };
        Article.prototype.getDefaultList = function () { return void 0; };
        return Article;
    }(AdminApis_2.EMyApi));
    exports.Article = Article;
});
define("abstract/Apis/Category", ["require", "exports", "abstract/Models", "abstract/extra/AdminApis"], function (require, exports, Models_4, AdminApis_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Category = (function (_super) {
        __extends(Category, _super);
        function Category(vars) {
            return _super.call(this, vars, 'Category.edit') || this;
        }
        Category.prototype.GetArrayType = function () {
            return Models_4.models.Categories;
        };
        Category.prototype.GetArgType = function () {
            return Models_4.models.Category;
        };
        Category.prototype.Check = function (data, callback) {
            this.callback(callback, data, data.Name != null && data.Name.trim() != '');
        };
        Category.prototype.getDefaultList = function () { return this._vars.__data.Categories; };
        return Category;
    }(AdminApis_3.EMyApi));
    exports.Category = Category;
});
define("abstract/Apis/Client", ["require", "exports", "../../lib/Q/sys/corelib", "abstract/Models", "abstract/extra/AdminApis"], function (require, exports, corelib_3, Models_5, AdminApis_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Client1 = (function (_super) {
        __extends(Client1, _super);
        function Client1(_vars) {
            return _super.call(this, _vars, 'Client.edit', {
                templateName: "Client.table1",
                itemTemplateName: null
            }) || this;
        }
        Client1.prototype.GetMyId = function (e) {
            var _this = this;
            var client = this._vars.user.Client;
            this._vars.requester.Request(Models_5.models.Client, corelib_3.net.WebRequestMethod.Get, client, { GetMyId: true }, function (cll, json, iss) {
                _this.callback(e, client, iss);
            });
        };
        Client1.prototype.GetArrayType = function () {
            return Models_5.models.Clients;
        };
        Client1.prototype.GetArgType = function () {
            return Models_5.models.Client;
        };
        Client1.prototype.getDefaultList = function () { return this._vars.__data.Costumers; };
        return Client1;
    }(AdminApis_4.EMyApi));
    exports.Client1 = Client1;
});
define("abstract/Apis/Projet", ["require", "exports", "abstract/Models", "abstract/extra/AdminApis"], function (require, exports, Models_6, AdminApis_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Projet = (function (_super) {
        __extends(Projet, _super);
        function Projet(_vars) {
            return _super.call(this, _vars, 'Projet.edit', {
                templateName: "Projet.table1",
                itemTemplateName: null
            }) || this;
        }
        Projet.prototype.GetArrayType = function () {
            return Models_6.models.Projets;
        };
        Projet.prototype.GetArgType = function () {
            return Models_6.models.Projet;
        };
        Projet.prototype.getDefaultList = function () { return this._vars.__data.Projets; };
        return Projet;
    }(AdminApis_5.EMyApi));
    exports.Projet = Projet;
});
define("abstract/Apis/FactureAchat", ["require", "exports", "../../lib/Q/sys/UI", "../../lib/Q/sys/corelib", "abstract/Models", "abstract/extra/AdminApis", "abstract/extra/Basics", "../../lib/q/sys/System"], function (require, exports, UI_2, corelib_4, Models_7, AdminApis_6, Basics_2, System_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SFacture = (function (_super) {
        __extends(SFacture, _super);
        function SFacture(_vars) {
            return _super.call(this, _vars, 'SSFacture.edit') || this;
        }
        SFacture.prototype.GetArrayType = function () {
            return Models_7.models.SFactures;
        };
        SFacture.prototype.GetArgType = function () {
            return Models_7.models.SFacture;
        };
        SFacture.prototype.GetLastArticlePrice = function (frn, prd, before, callback, asRecord) {
            this._vars.requester.Costume({ Url: __global.ApiServer.Combine('/_/pstat/LastArticleSolded').FullPath + ("?Id=" + prd.Id + "&CID=" + (frn && frn.Id) + "&Befor=" + (before && AdminApis_6.dateToUTC(before)) + (asRecord ? '' : '&price')), HasBody: false, Method: corelib_4.net.WebRequestMethod.Get
            }, undefined, {}, function (pc, data, s, req) {
                callback && callback(data);
            }, this);
        };
        SFacture.prototype.UpdateArticlesOf = function (data, callback) {
            if (!data)
                return callback && callback(null, false, Basics_2.basics.DataStat.DataCheckError);
            var x = data.IsFrozen();
            data.UnFreeze();
            if (data.Articles == null)
                data.Articles = new Models_7.models.FakePrices(data, []);
            else
                data.Articles.Clear();
            this._vars.requester.Get(Models_7.models.FakePrices, data.Articles, data, function (d, r, iss) {
                if (iss)
                    data.Articles.Stat = System_3.sdata.DataStat.Updated;
                if (x)
                    data.Freeze();
                else
                    data.UnFreeze();
                callback && callback(d.param, false, iss ? Basics_2.basics.DataStat.Success : Basics_2.basics.DataStat.Fail);
            }, null, null, { Id: String(data.Id) });
        };
        SFacture.prototype.LoadArticlesOf = function (data, callback) {
            if (!data)
                return callback(null, undefined, Basics_2.basics.DataStat.DataCheckError);
            if (!data.IsOpen)
                if (data.Articles == null || !data.Articles.Stat)
                    return this.UpdateArticlesOf(data, callback);
            return callback(data, undefined, Basics_2.basics.DataStat.Success);
        };
        SFacture.prototype.UpdateData = function (data, callback, costumize) {
            this._vars.requester.Request(Models_7.models.SFacture, "UPDATE", data, data, callback, costumize);
        };
        SFacture.prototype.UpdateList = function (list, ofOwner, callback, costumize) {
            this._vars.requester.Get(Models_7.models.SFactures, list, { OwnerId: ofOwner && ofOwner.Id }, callback, costumize);
        };
        SFacture.prototype.UpdateAll = function (callback, costumize) {
            this._vars.requester.Get(Models_7.models.SFactures, this._vars.__data.SFactures, { FromDate: 0 }, callback, costumize);
        };
        SFacture.prototype.Check = function (data) {
            return true;
        };
        SFacture.prototype.Avaible = function (callback) {
            return callback ? callback(this._vars.__data.SFactures, undefined, Basics_2.basics.DataStat.Fail) || true : true;
        };
        SFacture.prototype.New = function (callback, saveToApp, saveToServer) {
            this.Create(callback);
            return void 0;
        };
        SFacture.prototype.Create = function (callbackg) {
            var data = { GData: this._vars };
            function selectFournisseur(callback) {
                data.GData.apis.Fournisseur.Select(function (e) {
                    var fournisseur = e.Data, iss;
                    if (e.Error === corelib_4.basic.DataStat.Success) {
                        if (!fournisseur) {
                            UI_2.UI.InfoArea.push("You must selet a fournisseur");
                            return selectFournisseur(callback);
                        }
                        data.Fournisseur = fournisseur;
                        callback && callback();
                    }
                    else {
                        data.Fournisseur = null;
                        callback && callback();
                    }
                }, data.Fournisseur);
            }
            function selectAchteur(callback) {
                data.GData.apis.Agent.Select(function (e) {
                    var agent = e.Data;
                    if (e.Error === corelib_4.basic.DataStat.Success) {
                        if (!agent) {
                            UI_2.UI.InfoArea.push("You must selet an Achteur");
                            selectAchteur(callback);
                        }
                        data.Agent = agent;
                        callback && callback();
                    }
                    else {
                        data.Agent = null;
                        callback && callback();
                    }
                }, data.Agent);
            }
            function Main() {
                if (!data.Fournisseur || !data.Agent) {
                    UI_2.UI.InfoArea.push("The Creation of Facture Canceled");
                    return callbackg(null, true, corelib_4.basic.DataStat.OperationCanceled);
                }
                data.Facture = new Models_7.models.SFacture(0);
                data.GData.requester.Request(Models_7.models.SFacture, "CREATE", data.Facture, { AId: data.Agent.Id, FId: data.Fournisseur.Id }, function (a, b, c) {
                    if (!c) {
                        UI_2.UI.InfoArea.push("Creation of Facture Failed");
                        selectFournisseur(selectFournisseurAndAchteur);
                    }
                    else {
                        data.GData.__data.SFactures.Add(a.data);
                        callbackg(a.data, true, corelib_4.basic.DataStat.Success);
                    }
                });
            }
            function selectFournisseurAndAchteur() {
                if (data.Fournisseur)
                    return selectAchteur(Main);
                UI_2.UI.InfoArea.push("The Creation of Facture Canceled");
                return callbackg(null, true, corelib_4.basic.DataStat.OperationCanceled);
            }
            selectFournisseur(selectFournisseurAndAchteur);
        };
        SFacture.prototype.Save = function (data, isNew, callback) {
            var _this = this;
            if (this.Check(data))
                this._vars.requester.Request(Models_7.models.SFacture, 'SAVE', data, null, function (s, r, iss) {
                    if (iss) {
                        UI_2.UI.InfoArea.push("The SFacture Successfully Saved", true);
                        if (isNew)
                            _this._vars.__data.SFactures.Add(data);
                        try {
                            data.Recalc();
                            data.NArticles = data.Articles.Count;
                        }
                        catch (e) {
                        }
                        data.Commit();
                        if (callback)
                            callback(data, isNew, Basics_2.basics.DataStat.Success);
                        return;
                    }
                    else
                        UI_2.UI.InfoArea.push("AN Expected Error !!!!!<br>while Inserting The SFacture", false, 8000);
                    if (callback)
                        callback(data, isNew, Basics_2.basics.DataStat.Fail);
                    data.Rollback();
                });
            else if (callback)
                callback(data, isNew, Basics_2.basics.DataStat.DataCheckError);
            return true;
        };
        SFacture.prototype.Delete = function (saveToServer, data, callback) {
            var _this = this;
            if (!data)
                return this.ShowInfo('Select one SFacture PLEASE;');
            UI_2.UI.Modal.ShowDialog('Confirmation !!', 'Are you sur to delete this SFacture', function (xx) {
                if (xx.Result !== UI_2.UI.MessageResult.ok)
                    return callback && callback(data, undefined, Basics_2.basics.DataStat.OperationCanceled);
                if (saveToServer) {
                    _this._vars.requester.Request(Models_7.models.SFacture, "DELETE", data, data, function (s, r, iss) {
                        if (iss)
                            _this.deleteData(data);
                        if (!callback || !callback(data, false, iss ? Basics_2.basics.DataStat.Success : Basics_2.basics.DataStat.Fail))
                            _this.ShowInfo(iss ?
                                'The SFacture :' + data.toString() + '  Deleted!! ' :
                                'Could Not Delete The SFacture :' + data.toString(), false);
                    });
                }
                else {
                    _this.deleteData(data);
                    if (!callback || !callback(data, false, Basics_2.basics.DataStat.Success))
                        _this.ShowInfo('The SFacture :' + data.toString() + '  Deleted!! from App ', true);
                }
            }, 'DELETE', "Let's");
        };
        SFacture.prototype.deleteData = function (data) {
            this._vars.__data.Factures.UnFreeze();
            this._vars.__data.SFactures.Remove(data);
        };
        SFacture.prototype.Edit = function (saveToServer, data, isNew, callback) {
            if (!data) {
                if (!callback || !callback(data, isNew, Basics_2.basics.DataStat.DataCheckError))
                    UI_2.UI.InfoArea.push('Select one SFacture PLEASE;');
            }
            else {
                this.EditData.edit(data, false, this.getAction(callback));
            }
        };
        SFacture.prototype.OnModalSuccess = function (data, isNew, callback) {
            return this.Save(data, isNew, callback);
        };
        SFacture.prototype.OnModalError = function (cat, isNew, callback) {
            UI_2.UI.InfoArea.push("The Modification Aborded", true, 2500);
            if (callback)
                return callback(cat, isNew, Basics_2.basics.DataStat.OperationCanceled);
            return false;
        };
        SFacture.prototype.Print = function (data, callback) {
        };
        SFacture.prototype.Validate = function (data, isNew, callback) {
            var _this = this;
            if (this.Check(data)) {
                this._vars.requester.Request(Models_7.models.SFacture, "VALIDATE", data, { Validate: data.Id }, function (s, r, iss) {
                    if (iss) {
                        UI_2.UI.InfoArea.push("The SFacture Successfully Saved", true);
                        data.IsValidated = true;
                        if (isNew)
                            _this._vars.__data.SFactures.Add(data);
                        try {
                            data.Recalc();
                            data.NArticles = data.Articles.Count;
                        }
                        catch (e) {
                        }
                        data.Commit();
                        if (callback)
                            callback(data, isNew, Basics_2.basics.DataStat.Success);
                        return;
                    }
                    else
                        UI_2.UI.InfoArea.push("AN Expected Error !!!!!<br>while Inserting The SFacture", false, 8000);
                    if (callback)
                        callback(data, isNew, Basics_2.basics.DataStat.Fail);
                    data.Rollback();
                });
            }
            else if (callback)
                callback(data, isNew, Basics_2.basics.DataStat.DataCheckError);
            return true;
        };
        SFacture.prototype.OpenFacture = function (data, callback) {
            this._vars.requester.Request(Models_7.models.SFacture, "OPEN", data, data, function (c, r, iss) {
                callback(data, false, iss ? Basics_2.basics.DataStat.Success : Basics_2.basics.DataStat.Fail);
            }, null, null);
        };
        SFacture.prototype.CloseFacture = function (data, callback) {
            this._vars.requester.Request(Models_7.models.SFacture, "CLOSE", data, data, function (c, r, iss) {
                if (iss)
                    callback(data, false, Basics_2.basics.DataStat.Success);
                else
                    callback(data, false, Basics_2.basics.DataStat.Fail);
            });
        };
        SFacture.prototype.IsFactureOpen = function (data, callback) {
            this._vars.requester.Request(Models_7.models.SFacture, "ISOPEN", data, data, function (c, r, iss) {
                if (iss)
                    callback(data, false, Basics_2.basics.DataStat.Success);
                else
                    callback(data, false, Basics_2.basics.DataStat.Fail);
            });
        };
        SFacture.prototype.getDefaultList = function () { return this._vars.__data.SFactures; };
        return SFacture;
    }(AdminApis_6.FactureBase));
    exports.SFacture = SFacture;
    var CArticle = (function (_super) {
        __extends(CArticle, _super);
        function CArticle(_vars) {
            return _super.call(this, _vars, 'templates.carticleedit', {
                templateName: null,
                itemTemplateName: null
            }) || this;
        }
        CArticle.prototype.GetArrayType = function () {
            return Models_7.models.CArticles;
        };
        CArticle.prototype.GetArgType = function () {
            return Models_7.models.CArticle;
        };
        CArticle.prototype.getDefaultList = function () { return null; };
        return CArticle;
    }(AdminApis_6.EMyApi));
    exports.CArticle = CArticle;
    var Command = (function (_super) {
        __extends(Command, _super);
        function Command(_vars) {
            return _super.call(this, _vars, 'templates.carticleedit', {
                templateName: "templates.commands",
                itemTemplateName: null
            }) || this;
        }
        Command.prototype.GetArrayType = function () {
            return Models_7.models.Commands;
        };
        Command.prototype.GetArgType = function () {
            return Models_7.models.Command;
        };
        Command.prototype.getDefaultList = function () { return null; };
        return Command;
    }(AdminApis_6.EMyApi));
    exports.Command = Command;
});
define("abstract/Apis/FactureVent", ["require", "exports", "../../lib/Q/sys/UI", "../../lib/Q/sys/corelib", "abstract/Models", "abstract/extra/AdminApis", "abstract/extra/Basics", "../../lib/q/sys/System"], function (require, exports, UI_3, corelib_5, Models_8, AdminApis_7, Basics_3, System_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Facture = (function (_super) {
        __extends(Facture, _super);
        function Facture(_vars) {
            return _super.call(this, _vars, 'Facture.edit') || this;
        }
        Facture.prototype.GetArrayType = function () {
            return Models_8.models.Factures;
        };
        Facture.prototype.GetArgType = function () {
            return Models_8.models.Facture;
        };
        Facture.prototype.GetLastArticlePrice = function (client, prd, befor, callback, asRecord) {
            this._vars.requester.Costume({
                Url: __global.ApiServer.Combine('/_/pstat/LastArticlePurchased').FullPath + ("?Id=" + prd.Id + "&CID=" + client.Id + "&Befor=" + (befor && befor.toISOString()) + (asRecord ? '' : '&price')), HasBody: false, Method: corelib_5.net.WebRequestMethod.Get
            }, undefined, {}, function (pc, data, s, req) {
                callback && callback(data);
            }, this);
        };
        Facture.prototype.LoadArticlesOf = function (data, callback) {
            if (!data)
                return callback && callback(null, undefined, Basics_3.basics.DataStat.DataCheckError);
            if (!data.IsOpen)
                if (data.Articles == null || !data.Articles.Stat)
                    return this.UpdateArticlesOf(data, callback);
            return callback(data, undefined, Basics_3.basics.DataStat.Success);
        };
        Facture.prototype.UpdateArticlesOf = function (data, callback) {
            if (!data)
                return callback && callback(null, false, Basics_3.basics.DataStat.DataCheckError);
            var x = data.IsFrozen();
            data.UnFreeze();
            if (data.Articles == null)
                data.Articles = new Models_8.models.Articles(data, []);
            else
                data.Articles.Clear();
            this._vars.requester.Get(Models_8.models.Articles, data.Articles, data, function (d, r, iss) {
                if (iss)
                    data.Articles.Stat = System_4.sdata.DataStat.Updated;
                if (x)
                    data.Freeze();
                callback && callback(d.param, false, iss ? Basics_3.basics.DataStat.Success : Basics_3.basics.DataStat.Fail);
            }, null, null, { Id: String(data.Id) });
        };
        Facture.prototype.UpdateData = function (data, callback, costumize) {
            var x = data.IsFrozen();
            if (x)
                data.UnFreeze();
            this._vars.requester.Request(Models_8.models.Facture, "UPDATE", data, data, function (a, b, c, d) {
                if (x)
                    data.Freeze();
                callback && callback(a, b, c, d);
            }, costumize);
        };
        Facture.prototype.UpdateList = function (list, ofOwner, callback, costumize) {
            this._vars.requester.Get(Models_8.models.Factures, list, { OwnerId: ofOwner && ofOwner.Id }, callback, costumize);
        };
        Facture.prototype.UpdateAll = function (callback, costumize) {
            this._vars.requester.Get(Models_8.models.Factures, this._vars.__data.Factures, { FromDate: 0 }, callback, costumize);
        };
        Facture.prototype.Check = function (data) {
            return true;
        };
        Facture.prototype.Avaible = function (callback) {
            return callback ? callback(this._vars.__data.Factures, undefined, Basics_3.basics.DataStat.Fail) || true : true;
        };
        Facture.prototype.New = function (callback, saveToApp, saveToServer) {
            return this.Create(callback);
        };
        Facture.prototype.Create = function (callbackg) {
            var GData = this._vars;
            function selectClient(callback, client, fact) {
                GData.apis.Client.Select(function (e) {
                    var client = e.Data;
                    if (e.Error == corelib_5.basic.DataStat.Success) {
                        if (!client) {
                            UI_3.UI.InfoArea.push("You must selet a client");
                            return selectClient(callback, client, fact);
                        }
                        callback && callback(client, fact);
                    }
                    else {
                        callback && callback(null, fact);
                    }
                }, client);
                var f;
                GData.__data.Projets;
            }
            function Main(client, fact) {
                if (!client) {
                    UI_3.UI.InfoArea.push("The Creation of Facture Canceled");
                    return callbackg(null, true, corelib_5.basic.DataStat.OperationCanceled);
                }
                var fact = fact || new Models_8.models.Facture(0);
                GData.requester.Request(Models_8.models.Facture, "CREATE", fact, { CId: client.Id }, function (a, b, c) {
                    if (!c) {
                        UI_3.UI.InfoArea.push("Creation of Facture Failed");
                        selectClient(Main, client, fact);
                    }
                    else {
                        GData.__data.Factures.Add(a.data);
                        callbackg(a.data, true, corelib_5.basic.DataStat.Success);
                    }
                });
            }
            selectClient(Main, null, null);
        };
        Facture.prototype.Save = function (data, isNew, callback) {
            var _this = this;
            if (this.Check(data))
                this._vars.requester.Request(Models_8.models.Facture, "SAVE", data, null, function (s, r, iss) {
                    if (iss) {
                        UI_3.UI.InfoArea.push("The Facture Successfully Saved", true);
                        if (isNew)
                            _this._vars.__data.Factures.Add(data);
                        try {
                            data.Recalc();
                        }
                        catch (e) {
                        }
                        data.Commit();
                        if (callback)
                            callback(data, isNew, Basics_3.basics.DataStat.Success);
                        return;
                    }
                    else
                        UI_3.UI.InfoArea.push("AN Expected Error !!!!!<br>while Inserting The Facture", false, 8000);
                    if (callback)
                        callback(data, isNew, Basics_3.basics.DataStat.Fail);
                    data.Rollback();
                });
            else if (callback)
                callback(data, isNew, Basics_3.basics.DataStat.DataCheckError);
            return true;
        };
        Facture.prototype.Validate = function (data, isNew, callback) {
            var _this = this;
            if (this.Check(data)) {
                if (data)
                    this._vars.requester.Request(Models_8.models.Facture, "VALIDATE", data, { Validate: data.Id }, function (s, r, iss) {
                        if (iss) {
                            UI_3.UI.InfoArea.push("The SFacture Successfully Saved", true);
                            data.IsValidated = true;
                            try {
                                data.Recalc();
                                data.MakeChange(function (data) { return data.NArticles = data.Articles.Count; }, data);
                            }
                            catch (e) {
                            }
                            if (isNew)
                                _this._vars.__data.Factures.Add(data);
                            data.Commit();
                            if (callback)
                                callback(data, isNew, Basics_3.basics.DataStat.Success);
                            return;
                        }
                        else
                            UI_3.UI.InfoArea.push("AN Expected Error !!!!!<br>while Inserting The SFacture", false, 8000);
                        if (callback)
                            callback(data, isNew, Basics_3.basics.DataStat.Fail);
                        data.Rollback();
                    }, null, null);
            }
            else if (callback)
                callback(data, isNew, Basics_3.basics.DataStat.DataCheckError);
            return true;
        };
        Facture.prototype.Delete = function (saveToServer, data, callback) {
            var _this = this;
            if (!data)
                return this.ShowInfo('Select one Facture PLEASE;');
            UI_3.UI.Modal.ShowDialog('Confirmation !!', 'Are you sur to delete this Facture', function (xx) {
                if (xx.Result !== UI_3.UI.MessageResult.ok)
                    return callback && callback(data, undefined, Basics_3.basics.DataStat.OperationCanceled);
                if (saveToServer)
                    _this._vars.requester.Request(Models_8.models.Facture, "DELETE", data, data, function (s, r, iss) {
                        if (iss)
                            _this.deleteData(data);
                        if (!callback || !callback(data, false, iss ? Basics_3.basics.DataStat.Success : Basics_3.basics.DataStat.Fail))
                            _this.ShowInfo(iss ?
                                'The Facture :' + data.toString() + '  Deleted!! ' :
                                'Could Not Delete The Facture :' + data.toString(), false);
                    }, null, null, { Id: String(data.Id) });
                else {
                    _this.deleteData(data);
                    if (!callback || !callback(data, false, Basics_3.basics.DataStat.Success))
                        _this.ShowInfo('The Facture :' + data.toString() + '  Deleted!! from App ', true);
                }
            }, 'DELETE', "Let's");
        };
        Facture.prototype.deleteData = function (data) {
            this._vars.__data.Factures.UnFreeze();
            this._vars.__data.Factures.Remove(data);
        };
        Facture.prototype.Edit = function (saveToServer, data, isNew, callback) {
            if (!data) {
                if (!callback || !callback(data, isNew, Basics_3.basics.DataStat.DataCheckError))
                    UI_3.UI.InfoArea.push('Select one Facture PLEASE;');
            }
            else {
                this.EditData.edit(data, false, this.getAction(callback));
            }
        };
        Facture.prototype.Print = function (data, callback) {
            var _this = this;
            UI_3.UI.Modal.ShowDialog("Confirmation", "Do you want realy to Print this Facture", function (e) {
                if (e.Result === UI_3.UI.MessageResult.ok)
                    _this._vars.requester.Request(Models_8.models.Facture, "PRINT", data, data, function (req, json, iss) {
                        if (iss) {
                            UI_3.UI.InfoArea.push("You Facture Printed Successfully");
                        }
                        else
                            UI_3.UI.InfoArea.push("UnResolved Stat When We Print the facture " + data.Ref);
                    });
            }, "PRINT");
        };
        Facture.prototype.OnModalSuccess = function (data, isNew, callback) {
            return this.Save(data, isNew, callback);
        };
        Facture.prototype.OnModalError = function (cat, isNew, callback) {
            UI_3.UI.InfoArea.push("The Modification Aborded", true, 2500);
            if (callback)
                return callback(cat, isNew, Basics_3.basics.DataStat.OperationCanceled);
            return false;
        };
        Facture.prototype.getDefaultList = function () { return this._vars.__data.Factures; };
        return Facture;
    }(AdminApis_7.FactureBase));
    exports.Facture = Facture;
});
define("abstract/Apis/Fournisseur", ["require", "exports", "abstract/Models", "abstract/extra/AdminApis"], function (require, exports, Models_9, AdminApis_8) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Fournisseur = (function (_super) {
        __extends(Fournisseur, _super);
        function Fournisseur(_vars) {
            return _super.call(this, _vars, 'Fournisseur.edit', {
                templateName: "Fournisseur.table",
                itemTemplateName: null
            }) || this;
        }
        Fournisseur.prototype.GetArrayType = function () {
            return Models_9.models.Fournisseurs;
        };
        Fournisseur.prototype.GetArgType = function () {
            return Models_9.models.Fournisseur;
        };
        Fournisseur.prototype.getDefaultList = function () { return this._vars.__data.Fournisseurs; };
        return Fournisseur;
    }(AdminApis_8.EMyApi));
    exports.Fournisseur = Fournisseur;
});
define("abstract/Apis/Product", ["require", "exports", "abstract/Models", "abstract/extra/AdminApis"], function (require, exports, Models_10, AdminApis_9) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Product = (function (_super) {
        __extends(Product, _super);
        function Product(vars) {
            return _super.call(this, vars, 'iProduct.edit') || this;
        }
        Product.prototype.GetArrayType = function () {
            return Models_10.models.Products;
        };
        Product.prototype.GetArgType = function () {
            return Models_10.models.Product;
        };
        Product.prototype.SmartUpdate = function (date) {
            this._vars.requester.Request(Models_10.models.Products, "SUPDATE", null, { Date: (date && date.toLocaleString()) || "12/12/2016" });
        };
        Product.prototype.getDefaultList = function () { return this._vars.__data.Products; };
        return Product;
    }(AdminApis_9.EMyApi));
    exports.Product = Product;
});
define("abstract/Apis/Revage", ["require", "exports", "abstract/Models", "abstract/extra/AdminApis"], function (require, exports, Models_11, AdminApis_10) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Revage = (function (_super) {
        __extends(Revage, _super);
        function Revage(_vars) {
            return _super.call(this, _vars, 'Price.edit') || this;
        }
        Revage.prototype.GetArrayType = function () {
            return Models_11.models.FakePrices;
        };
        Revage.prototype.GetArgType = function () {
            return Models_11.models.FakePrice;
        };
        Revage.prototype.NativeCreateItem = function (id) {
            return new Models_11.models.FakePrice(id);
        };
        Revage.prototype.Check = function (data, callback) {
            var d = true;
            if (data.Product == null)
                d = false;
            if (data.PSel > data.Value)
                d = false;
            else {
                if (data.Value > data.PValue)
                    data.PValue = data.Value;
                if (data.PValue > data.HWValue)
                    data.HWValue = data.PValue;
                if (data.HWValue > data.WValue)
                    data.WValue = data.HWValue;
            }
            this.callback(callback, data, d);
        };
        Revage.prototype.getDefaultList = function () {
            return void 0;
        };
        return Revage;
    }(AdminApis_10.EMyApi));
    exports.Revage = Revage;
});
define("abstract/Apis/Versment", ["require", "exports", "abstract/extra/AdminApis", "../../lib/Q/sys/UI", "../../lib/Q/sys/corelib", "abstract/Models", "abstract/extra/Basics", "../../lib/Q/sys/System"], function (require, exports, AdminApis_11, UI_4, corelib_6, Models_12, Basics_4, System_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Versment = (function (_super) {
        __extends(Versment, _super);
        function Versment(_vars) {
            return _super.call(this, _vars, 'Versment.cart', { templateName: 'Versments.CardView', itemTemplateName: undefined }) || this;
        }
        Versment.prototype.GetArrayType = function () {
            return Models_12.models.Versments;
        };
        Versment.prototype.GetArgType = function () {
            return Models_12.models.Versment;
        };
        Versment.prototype.NativeCreateItem = function (id) {
            return new Models_12.models.Versment(id);
        };
        Versment.prototype.getDefaultList = function () { return void 0; };
        Versment.prototype.VerserTo = function (facture, client, callback, montant) {
            var _this = this;
            client = client || (facture && facture.Client);
            if (!client) {
                this._vars.apis.Client.Select(function (e) {
                    var r = e.Data;
                    if (e.Error == corelib_6.basic.DataStat.Success) {
                        if (r)
                            _this.VerserTo(facture, r, callback);
                        UI_4.UI.InfoArea.push("You are'nt select any fournisseur");
                        return _this.VerserTo(facture, client, callback);
                    }
                    UI_4.UI.InfoArea.push("Versment est abondonnee");
                    callback && callback(null, false, Basics_4.basics.DataStat.OperationCanceled);
                }, client);
            }
            this.New(function (e) {
                var data = e.Data;
                if (e.Error == Basics_4.basics.DataStat.Success) {
                    data.Client = client;
                    data.Facture = facture;
                    _this.Edit(data, function (e) {
                        var data = e.Data;
                        if (e.Error === Basics_4.basics.DataStat.Success) {
                            data.Client.VersmentTotal += data.Montant;
                        }
                        else {
                            UI_4.UI.InfoArea.push("Versment est annulé");
                        }
                        callback && callback(data, true, e.Error);
                    });
                    data.Montant = montant || 0;
                }
                else {
                    UI_4.UI.InfoArea.push("An Expected error while creating a Versment ");
                    callback && callback(data, true, e.Error);
                }
            });
        };
        Versment.prototype.Regler = function (facture, client, callback) {
            var _this = this;
            if (!facture && !client)
                return UI_4.UI.InfoArea.push("Vous devez au moin selectioner soit un fournisseur au une facture.");
            if (facture) {
                this._vars.requester.Request(Models_12.models.Versments, "Facture.Total", void 0, facture, function (c, d, f) {
                    facture.MakeChange(function (d) {
                        this.Recalc();
                        this.Versment = d || 0;
                    }, d);
                    if (facture.Sold != 0)
                        _this.VerserTo(facture, client, callback, facture.Sold);
                });
            }
            else {
                this._vars.apis.Client.UpdateData(client, function (e) {
                    if (e.Error == corelib_6.basic.DataStat.OperationCanceled)
                        return;
                    if (e.Error !== corelib_6.basic.DataStat.Success)
                        UI_4.UI.InfoArea.push("Une Error Produit Quant le versment est calcer");
                    else
                        _this.VerserTo(facture, client, callback, client.SoldTotal);
                });
            }
        };
        Versment.prototype.Get = function (id) {
            var c = Models_12.models.Versment.getById(id, Models_12.models.Versment);
            if (!c || c.Stat <= System_5.sdata.DataStat.Modified) {
                c = c || new Models_12.models.Versment(id);
                corelib_6.encoding.SerializationContext.GlobalContext.reset();
                c.FromJson(id, corelib_6.encoding.SerializationContext.GlobalContext, true);
            }
            return c;
        };
        Versment.prototype.OpenVersmentsOfClient = function (client, callback) {
            var _this = this;
            var results = new Models_12.models.Versments(client);
            this._vars.requester.Request(Models_12.models.Versments, "VClient", results, client, function (c, d, f) {
                if (f)
                    _this.OpenList(results, function (a, b, c) {
                        callback && callback(results, b, client, c === UI_4.UI.MessageResult.ok);
                    });
                else
                    UI_4.UI.InfoArea.push("The Server Respond With UnExpected Error");
            });
        };
        Versment.prototype.OpenVersmentsOfFacture = function (facture, callback) {
            var _this = this;
            var results = facture.ClearVersments();
            this._vars.requester.Request(Models_12.models.Versments, "VFacture", results, facture, function (c, d, f) {
                if (f)
                    facture.Recalc(),
                        _this.OpenList(results, function (modal, selectedItem, result) {
                            callback && callback(results, selectedItem, facture, result === UI_4.UI.MessageResult.ok);
                        });
                else
                    UI_4.UI.InfoArea.push("The Server Respond With UnExpected Error");
            });
        };
        Versment.prototype.OpenVersmentsOfPour = function (client, callback) {
            var _this = this;
            var results = new Models_12.models.Versments(client);
            this._vars.requester.Request(Models_12.models.Versments, "VPour", results, client, function (c, d, f) {
                if (f)
                    _this.OpenList(results, function (a, b, c) {
                        callback && callback(results, b, client, c === UI_4.UI.MessageResult.ok);
                    });
                else
                    UI_4.UI.InfoArea.push("The Server Respond With UnExpected Error");
            });
        };
        Versment.prototype.OpenVersmentsWithObservation = function (Observation, callback) {
            var _this = this;
            var results = new Models_12.models.Versments(null);
            this._vars.requester.Request(Models_12.models.Versments, "VObservation", results, { Observation: Observation }, function (c, d, f) {
                if (f)
                    _this.OpenList(results, function (a, b, c) {
                        callback && callback(results, b, Observation, c === UI_4.UI.MessageResult.ok);
                    });
                else
                    UI_4.UI.InfoArea.push("The Server Respond With UnExpected Error");
            });
        };
        Versment.prototype.OpenVersmentsWithPeriod = function (Period, callback) {
            var _this = this;
            var results = new Models_12.models.Versments(null);
            this._vars.requester.Request(Models_12.models.Versments, "VObservation", results, Period, function (c, d, f) {
                if (f)
                    _this.OpenList(results, function (a, b, c) {
                        callback && callback(results, b, Period, c === UI_4.UI.MessageResult.ok);
                    });
                else
                    UI_4.UI.InfoArea.push("The Server Respond With UnExpected Error");
            });
        };
        return Versment;
    }(AdminApis_11.EMyApi));
    exports.Versment = Versment;
});
define("abstract/Apis/SVersment", ["require", "exports", "../../lib/Q/sys/UI", "../../lib/Q/sys/corelib", "abstract/Models", "abstract/extra/AdminApis", "abstract/extra/Basics"], function (require, exports, UI_5, corelib_7, Models_13, AdminApis_12, Basics_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SVersment = (function (_super) {
        __extends(SVersment, _super);
        function SVersment(_vars) {
            return _super.call(this, _vars, 'SVersment.cart', { templateName: 'SVersment.list', itemTemplateName: undefined }) || this;
        }
        SVersment.prototype.GetArrayType = function () {
            return Models_13.models.SVersments;
        };
        SVersment.prototype.GetArgType = function () {
            return Models_13.models.SVersment;
        };
        SVersment.prototype.NativeCreateItem = function (id) {
            return new Models_13.models.SVersment(id);
        };
        SVersment.prototype.VerserTo = function (facture, fournisseur, callback, montant) {
            var _this = this;
            fournisseur = fournisseur || (facture && facture.Fournisseur);
            if (!fournisseur)
                return UI_5.UI.InfoArea.push("Unvalid fournisseur ");
            this.New(function (e) {
                var data = e.Data, isNew = true, error = e.Error;
                if (error == Basics_5.basics.DataStat.Success) {
                    data.Fournisseur = fournisseur;
                    data.Facture = facture;
                    _this.Edit(data, function (e) {
                        var data = e.Data, isNew = true, error = e.Error;
                        if (error === Basics_5.basics.DataStat.Success) {
                            data.Fournisseur.VersmentTotal += data.Montant;
                        }
                        else {
                            UI_5.UI.InfoArea.push("Versment est annulé");
                        }
                        callback && callback(data, isNew, error);
                    });
                    data.Montant = montant || 0;
                }
                else {
                    UI_5.UI.InfoArea.push("An Expected error while creating a Versment ");
                    callback && callback(data, isNew, error);
                }
            });
        };
        SVersment.prototype.Regler = function (facture, fournisseur, callback) {
            var _this = this;
            this.OpenSVersmentsOfFacture;
            if (!facture && !fournisseur)
                return UI_5.UI.InfoArea.push("Vous devez au moin selectioner soit un fournisseur au une facture.");
            if (facture) {
                this._vars.requester.Request(Models_13.models.SVersments, "Facture.Total", void 0, facture, function (c, d, f) {
                    facture.MakeChange(function (d) {
                        this.Recalc();
                        this.Versment = d || 0;
                    }, d);
                    if (facture.Sold != 0)
                        _this.VerserTo(facture, fournisseur, callback, facture.Sold);
                });
            }
            else {
                this.VerserTo(facture, fournisseur, callback, fournisseur.SoldTotal);
            }
        };
        SVersment.prototype.Get = function (id) {
            var c = Models_13.models.SVersment.getById(id, Models_13.models.SVersment);
            if (!c) {
                c = new Models_13.models.SVersment(id);
                corelib_7.encoding.SerializationContext.GlobalContext.reset();
                c.FromJson(id, corelib_7.encoding.SerializationContext.GlobalContext, true);
            }
            return c;
        };
        SVersment.prototype.getDefaultList = function () { return void 0; };
        SVersment.prototype.OpenSVersmentsOfFournisseur = function (fournisseur, callback) {
            var _this = this;
            var results = new Models_13.models.SVersments(fournisseur);
            this._vars.requester.Request(Models_13.models.SVersments, "VFournisseur", results, fournisseur, function (c, d, f) {
                if (f)
                    _this.OpenList(results, function (a, b, c) {
                        callback && callback(results, b, fournisseur, c === UI_5.UI.MessageResult.ok);
                    });
                else
                    UI_5.UI.InfoArea.push("The Server Respond With UnExpected Error");
            });
        };
        SVersment.prototype.OpenSVersmentsOfFacture = function (facture, callback) {
            var _this = this;
            var results = new Models_13.models.SVersments(facture);
            this._vars.requester.Request(Models_13.models.SVersments, "VFacture", results, facture, function (c, d, f) {
                if (f)
                    _this.OpenList(results, function (modal, selectedItem, result) {
                        callback && callback(results, selectedItem, facture, result === UI_5.UI.MessageResult.ok);
                    });
                else
                    UI_5.UI.InfoArea.push("The Server Respond With UnExpected Error");
            });
        };
        SVersment.prototype.OpenSVersmentsWithObservation = function (Observation, callback) {
            var _this = this;
            var results = new Models_13.models.SVersments(null);
            this._vars.requester.Request(Models_13.models.SVersments, "VObservation", results, { Observation: Observation }, function (c, d, f) {
                if (f)
                    _this.OpenList(results, function (a, b, c) {
                        callback && callback(results, b, Observation, c === UI_5.UI.MessageResult.ok);
                    });
                else
                    UI_5.UI.InfoArea.push("The Server Respond With UnExpected Error");
            });
        };
        SVersment.prototype.OpenSVersmentsWithPeriod = function (Period, callback) {
            var _this = this;
            var results = new Models_13.models.SVersments(null);
            this._vars.requester.Request(Models_13.models.SVersments, "VObservation", results, Period, function (c, d, f) {
                if (f)
                    _this.OpenList(results, function (a, b, c) {
                        callback && callback(results, b, Period, c === UI_5.UI.MessageResult.ok);
                    });
                else
                    UI_5.UI.InfoArea.push("The Server Respond With UnExpected Error");
            });
        };
        return SVersment;
    }(AdminApis_12.EMyApi));
    exports.SVersment = SVersment;
});
define("abstract/extra/ShopApis", ["require", "exports", "abstract/Apis/Agent", "abstract/Apis/Article", "abstract/Apis/Category", "abstract/Apis/Client", "abstract/Apis/Projet", "abstract/Apis/FactureAchat", "abstract/Apis/FactureVent", "abstract/Apis/Fournisseur", "abstract/Apis/Product", "abstract/Apis/Revage", "abstract/Apis/Versment", "abstract/Apis/SVersment"], function (require, exports, Agent_1, Article_1, Category_1, Client_1, Projet_1, FactureAchat_1, FactureVent_1, Fournisseur_1, Product_1, Revage_1, Versment_1, SVersment_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ShopApis = (function () {
        function ShopApis() {
        }
        ShopApis.prototype.Init = function (vars) {
            this.vars = vars;
            this.Agent = new Agent_1.Agent(vars);
            this.Article = new Article_1.Article(vars);
            this.Client = new Client_1.Client1(vars);
            this.Category = new Category_1.Category(vars);
            this.SFacture = new FactureAchat_1.SFacture(vars);
            this.Facture = new FactureVent_1.Facture(vars);
            this.Fournisseur = new Fournisseur_1.Fournisseur(vars);
            this.Product = new Product_1.Product(vars);
            this.Revage = new Revage_1.Revage(vars);
            this.Versment = new Versment_1.Versment(vars);
            this.SVersment = new SVersment_1.SVersment(vars);
            this.Projet = new Projet_1.Projet(vars);
            this.Command = new FactureAchat_1.Command(vars);
            this.Sms = new Agent_1.SMS(vars);
            return this;
        };
        return ShopApis;
    }());
    exports.ShopApis = ShopApis;
});
define("abstract/extra/Basics", ["require", "exports", "../../lib/Q/sys/Corelib"], function (require, exports, Corelib_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var basics;
    (function (basics) {
        basics.DataStat = Corelib_1.basic.DataStat;
    })(basics = exports.basics || (exports.basics = {}));
});
define("abstract/Services", ["require", "exports", "abstract/Models", "../lib/q/sys/Corelib", "../lib/q/sys/System", "../lib/q/sys/UI", "../lib/q/sys/Services"], function (require, exports, Models_14, Corelib_2, System_6, UI_6, Services_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var requester;
    var tables = {};
    var GData;
    var eServices;
    (function (eServices) {
        function registerUpdater(updator) {
            tables[updator.Name] = updator;
        }
        eServices.registerUpdater = registerUpdater;
    })(eServices = exports.eServices || (exports.eServices = {}));
    var services;
    (function (services) {
        var qdata = Corelib_2.bind.NamedScop.Get('qdata');
        var c = new Corelib_2.encoding.SerializationContext(true);
        var p = Models_14.models.Product.getById;
        var ProductsUpdater = (function () {
            function ProductsUpdater() {
                this.Name = 'products_qte_updater';
            }
            ProductsUpdater.prototype.OnResponse = function (proxy, webr, json) {
                var l = json.sdata;
                c.reset();
                for (var i in l) {
                    this.UpdatePrice(parseInt(i), l[i]);
                }
                UI_6.UI.InfoArea.push("<p style='background:yellow'>Products <h1>Success</h1>-<h2>fully</h2> Updated</p>", true);
                json.dropRequest = true;
            };
            ProductsUpdater.prototype.UpdatePrice = function (i, val) {
                { }
                var prd = p(i);
                if (prd) {
                    prd.Stat = 4;
                    prd.FromJson(val, c, true);
                    prd.Stat = 16;
                }
                else
                    c.FromJson(val, Models_14.models.Product, null);
            };
            return ProductsUpdater;
        }());
        services.ProductsUpdater = ProductsUpdater;
        var Updater = (function () {
            function Updater() {
                this.Name = 'updater';
            }
            Updater.prototype.OnResponse = function (proxy, webr, json) {
                var l = json.sdata;
                c.reset();
                var table = tables[json["table"]];
                if (table) {
                    if (table.onstart)
                        table.onstart(json);
                    for (var i in l) {
                        var val = l[i];
                        try {
                            if (typeof val === 'number') {
                                table.del(val);
                            }
                            else {
                                table.edit(val.Id, val, c);
                            }
                        }
                        catch (e) {
                        }
                    }
                    if (table.onfinish)
                        table.onfinish(json);
                }
                UI_6.UI.InfoArea.push("<p style='background:yellow'>" + table.Name.toUpperCase() + " <h1>Success</h1>-<h2>fully</h2> Updated</p>", true);
                json.dropRequest = true;
            };
            return Updater;
        }());
        services.Updater = Updater;
        var SecurityAccountRequest = (function () {
            function SecurityAccountRequest() {
                this.Name = "SecurityAccountRequest";
            }
            SecurityAccountRequest.prototype.OnResponse = function (proxy, webr, json) {
                var a = json;
                UI_6.UI.Spinner.Default.Start("Your Account is open By " + a.OriginalIP + "\r\n Your IP Is : " + a.YourIP);
                setTimeout(function () { UI_6.UI.Spinner.Default.Pause(); }, a.Wait | 300000);
                json.dropRequest = true;
            };
            return SecurityAccountRequest;
        }());
        services.SecurityAccountRequest = SecurityAccountRequest;
        var FactureUpdater = (function () {
            function FactureUpdater() {
                this.Name = 'facture_count_updater';
            }
            FactureUpdater.prototype.OnResponse = function (proxy, webr, json) {
                var l = json.sdata;
                var f = Models_14.models.Facture.getById(l.id, Models_14.models.Facture);
                if (l.for) {
                    var _for = Models_14.models.Client.getById(l.for);
                    if (!_for)
                        requester.Get(Models_14.models.Client, f.Client = new Models_14.models.Client(l.for), null, function (s, r, iss) {
                            if (iss)
                                f.Client = s.data;
                            else
                                UI_6.UI.InfoArea.push("Failed To Update The Costumer Info of this facture", false);
                        });
                    f.Client = _for;
                }
                else
                    f.Client = null;
                var arts = f.Articles;
                var narts = l.articles;
                var todarts = "";
                for (var sid in narts) {
                    var id = parseFloat(sid);
                    var oart = arts.GetById(id);
                    if (oart != null)
                        oart.Count = narts[id];
                    else
                        todarts += todarts === '' ? id : ',' + id;
                }
                var list = arts.AsList();
                for (var i = 0; i < list.length; i++) {
                    var art = list[i];
                    if (narts[art.Id] == null) {
                        arts.Remove(art);
                        art.getStore().Remove(art.Id);
                        i--;
                    }
                }
                if (todarts !== '') {
                    requester.Get(Models_14.models.Articles, new Models_14.models.Articles(f), null, function (s, r, iss) {
                        if (iss) {
                            var d = s.data;
                            arts.AddRange(d.AsList());
                            UI_6.UI.InfoArea.push("Facture <h1>Success</h1>-<h2>fully</h2> Updated", true);
                            d.Clear();
                            d.Dispose();
                        }
                        else
                            UI_6.UI.InfoArea.push("Facture <h1>UnSuccess</h1>-<h2>fully</h2> Updated", true);
                    }, function (r, t) {
                        r.Url = '/_/Articles?list=' + todarts;
                    });
                }
                else
                    UI_6.UI.InfoArea.push("Facture <h1>Success</h1>-<h2>fully</h2> Updated", true);
                json.dropRequest = true;
            };
            return FactureUpdater;
        }());
        services.FactureUpdater = FactureUpdater;
        var PriceUpdater = (function () {
            function PriceUpdater() {
                this.Name = 'update_price';
            }
            PriceUpdater.prototype.OnResponse = function (proxy, webr, json) {
                var l = json.sdata;
                var f = Models_14.models.FakePrice.pStore.Get(l.id);
                if (!f) {
                    f = new Models_14.models.FakePrice(l.id);
                    Models_14.models.FakePrice.pStore.Set(l.id, f);
                }
                f.Value = l.value;
            };
            return PriceUpdater;
        }());
        services.PriceUpdater = PriceUpdater;
    })(services || (services = {}));
    function Load(gdata) {
        Services_1.Load(gdata.requester);
        requester = gdata.requester;
        GData = gdata;
        System_6.Controller.Register(new services.ProductsUpdater());
        System_6.Controller.Register(new services.FactureUpdater());
        System_6.Controller.Register(new services.PriceUpdater());
        System_6.Controller.Register(new services.SecurityAccountRequest());
        System_6.Controller.Register(new services.Updater());
    }
    exports.Load = Load;
});
define("assets/data/data", ["require", "exports", "json|./data.json"], function (require, exports, x) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.data = { value: x.value, require: x.require };
});
define("abstract/extra/Common", ["require", "exports", "../../lib/q/sys/UI", "../../lib/q/sys/Corelib", "context", "abstract/Models", "../../lib/q/sys/System", "../../lib/q/sys/Encoding", "abstract/Services", "../../lib/q/sys/db", "../../lib/Q/components/ActionButton/script", "abstract/extra/ShopApis"], function (require, exports, UI_7, Corelib_3, context_1, Models_15, System_7, Encoding_1, Services_2, db_1, script_1, ShopApis_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var abonEnum = context_1.context.GetEnum('models.Abonment');
    var GData = {
        __data: new Models_15.models.QData(),
        modify: Corelib_3.bind.NamedScop.Create("modify", false, 3),
        user: (function () { var t = new Models_15.models.Login(); t.Client = new Models_15.models.Client(Corelib_3.basic.New()); return t; })(),
        requester: System_7.Controller.ProxyData.Default,
        invalidateFactures: new Corelib_3.collection.List(Models_15.models.Facture),
        invalidateLogins: new Corelib_3.collection.List(Models_15.models.Login),
        validateLogins: new Corelib_3.collection.List(Models_15.models.Login),
        mails: new Corelib_3.collection.List(Models_15.models.Mail),
        spin: UI_7.UI.Spinner.Default,
        apis: new ShopApis_1.ShopApis(),
        db: new db_1.db.Database().initialize(),
    };
    function initializeDB() {
        var fields = Corelib_3.bind.DObject.getFields(Models_15.models.QData);
        for (var _i = 0, fields_1 = fields; _i < fields_1.length; _i++) {
            var i = fields_1[_i];
            if (GData.db.Get(i.Name))
                continue;
            if (Corelib_3.reflection.IsInstanceOf(i.Type, System_7.sdata.DataTable)) {
                GData.db.CreateTable(i.Name, GData.__data.GetValue(i).getArgType());
            }
        }
    }
    GData.apis.Init(GData);
    var userAbonment = Corelib_3.bind.NamedScop.Create('UserAbonment', Models_15.models.Abonment.Detaillant, Corelib_3.bind.BindingMode.TwoWay);
    var cgv;
    function GetVars(call) {
        if (cgv)
            return;
        cgv = call(GData);
    }
    exports.GetVars = GetVars;
    function InitModule() {
        UI_7.UI.Desktop.Current.OnInitialized = function (d) { return GData.spin.Parent = d; };
        Encoding_1.init();
        Services_2.Load(GData);
        initialize();
    }
    exports.InitModule = InitModule;
    function initialize() {
        window.data = GData.__data;
        Corelib_3.thread.Dispatcher.call(GData.__data, GData.__data.OnPropertyChanged, Models_15.models.QData.DPSelectedFacture, function (s, e) {
            var f = e._new;
            if (e._new)
                this.Value = f.IsOpen && !f.Validator;
            else
                this.Value = false;
        }, GData.modify);
        Corelib_3.bind.NamedScop.Create('qdata', GData.__data);
        Corelib_3.bind.NamedScop.Create('User', GData.user, 0);
        internal.initializeOprs();
        var LabelJob = Corelib_3.bind.Register(new Corelib_3.bind.Job("showIfModifiable", function (ji, e) {
            var t = ji.Scop.Value;
            var dm = ji.dom;
            dm.parentElement.style.display = (t ? t.IsFrozen() : false) ? 'none' : '';
        }, null, null, function (ji, e) {
            var dm = ji.dom;
            var t = ji.Scop.Value;
            dm.parentElement.style.display = (t ? t.IsFrozen() : false) ? 'none' : '';
        }, function (ji, e) {
        }));
        var LabelJob = Corelib_3.bind.Register(new Corelib_3.bind.Job("ilabel", function (ji, e) {
            var dm = ji.dom;
            dm.innerText = ji.Scop.Value || 'Personal';
        }, null, null, function (ji, e) {
            var dm = ji.dom;
            dm.innerText = ji.Scop.Value || 'Personal';
        }, function (ji, e) {
        }));
        var LabelJob = Corelib_3.bind.Register(new Corelib_3.bind.Job("dosave", null, null, null, function (ji, e) {
            var dm = ji.dom;
            dm.click = function () {
                var v = ji.Scop.Value;
                if (v instanceof System_7.sdata.DataRow)
                    UI_7.UI.Modal.ShowDialog('Confirm', 'Are you sure save data ?', function (xx) { if (xx.Result === UI_7.UI.MessageResult.ok)
                        v.Upload(); }, 'Yes', 'No');
            };
        }, null));
        var LabelJob = Corelib_3.bind.Register(new Corelib_3.bind.Job("dodiscart", null, null, null, function (ji, e) {
            var dm = ji.dom;
            dm.click = function () {
                var v = ji.Scop.Value;
                if (v instanceof System_7.sdata.DataRow)
                    UI_7.UI.Modal.ShowDialog('Confirm', 'Are you sure discart data ?', function (xx) { if (xx.Result === UI_7.UI.MessageResult.ok)
                        v.Update(); }, 'Yes', 'No');
            };
        }, null));
        Corelib_3.bind.Register({
            Name: 'openfournisseur', OnInitialize: function (ji, e) {
                ji.addEventListener('ondblclick', 'dblclick', function () { return GData.apis.Fournisseur.Edit(ji.Scop.Value); });
            }
        });
        Corelib_3.bind.Register({
            Name: 'opencostumer', OnInitialize: function (ji, e) {
                ji.addEventListener('ondblclick', 'dblclick', function () {
                    GData.apis.Client.Edit(ji.Scop.Value, void 0);
                });
            }
        });
    }
    var funcs;
    (function (funcs) {
        function setTepmlate(lb, owner, handleService) {
            var oldget = lb.getTemplate;
            lb.getTemplate = function (c) {
                var e = oldget(new UI_7.UI.Anchore(c));
                if (e.Enable === false)
                    e.Enable = false;
                else
                    e.addEventListener('click', handleService, { t: owner, c: c.Type });
                return e;
            };
        }
        funcs.setTepmlate = setTepmlate;
        function createSparator() {
            var separ0 = new UI_7.UI.Glyph(UI_7.UI.Glyphs.none, false);
            separ0.Enable = false;
            return separ0;
        }
        funcs.createSparator = createSparator;
        var _priceModal;
        function priceModal() {
            return _priceModal || (_priceModal = new UI_7.UI.Modals.ModalEditer('Price.edit'));
        }
        funcs.priceModal = priceModal;
        var _pricesModal;
        function pricesModal() {
            return _pricesModal || (_pricesModal = new UI_7.UI.Modals.ModalList(undefined, 'Price.info', 'Price.price'));
        }
        funcs.pricesModal = pricesModal;
        function initializeSBox(caption, hasSearch, source) {
            if (hasSearch) {
                var actionBtn = new script_1.components.ActionButton();
                var btn_filter = UI_7.UI.Modals.CreateGlyph('label', 'filter', '', 'default', {});
            }
            var group_tcnt = new UI_7.UI.Div().applyStyle('icontent-header');
            var _caption = document.createTextNode(caption);
            group_tcnt.View.appendChild(_caption);
            if (hasSearch) {
                group_tcnt.Add(actionBtn);
                actionBtn.Source = source;
            }
            return {
                BtnFilter: btn_filter,
                BtnAction: actionBtn,
                txtCaption: _caption,
                container: group_tcnt
            };
        }
        funcs.initializeSBox = initializeSBox;
        function toNum(a) {
            return (a && a.getTime()) || 0;
        }
        funcs.toNum = toNum;
    })(funcs = exports.funcs || (exports.funcs = {}));
    var internal;
    (function (internal) {
        function getPrd(p) {
            return p instanceof Models_15.models.Article ? p.Product : p;
        }
        function newArticle(prd, count) {
            var art = new Models_15.models.Article(Corelib_3.basic.New());
            art.Product = prd;
            if (count)
                art.Count = count;
            art.Price = prd.IGetValue(GData.__data.SelectedFacture.Abonment || GData.user.Client.Abonment || Models_15.models.Abonment.Detaillant);
            art.Owner = GData.__data.SelectedFacture;
            GData.__data.SelectedFacture.Articles.Add(art);
            return art;
        }
        function removeArticle(prd, art) {
            var art = art || prd.CurrentArticle;
            if (!art)
                return;
            var sf = GData.__data.SelectedFacture;
            sf.Articles.Remove(art);
            prd.CurrentArticle = null;
        }
        function setValue(prd, val, def) {
            if (!GData.__data.QteLimited)
                return setValueUnlimited(prd, val, def);
            var art = prd.CurrentArticle;
            val = val != null ? val : ((art && art.Count || 0) + def);
            var tq = prd.Qte;
            if (art)
                tq += art.OCount;
            else if (val <= 0)
                return;
            else
                art = newArticle(prd);
            if (val <= 0)
                removeArticle(prd, art);
            else if (val <= tq)
                art.Count = val;
            else {
                art.Count = tq;
            }
        }
        function setValueUnlimited(prd, val, def) {
            var art = prd.CurrentArticle;
            val = val != undefined ? val : ((art && art.Count || 0) + def);
            if (val == 0)
                return art && removeArticle(prd, art);
            if (!art)
                art = newArticle(prd, val);
            else
                art.Count = val;
        }
        var types = {};
        function getEnumList(tname) {
            var lst = types[tname];
            if (lst)
                return lst;
            var type = tname && context_1.context.GetEnum(tname);
            if (type == undefined)
                throw 'type not found';
            var _lst = [];
            for (var i in type) {
                if (isNaN(parseFloat(i)))
                    _lst.push(i);
            }
            lst = { list: new Corelib_3.collection.List(String, _lst), type: type };
            lst.list.Freeze();
            Object.freeze(lst);
            Object.freeze(lst.list);
            Object.defineProperty(types, tname, { value: lst, writable: false, enumerable: false, configurable: false });
            return lst;
        }
        function swip(v, x) {
            return GData.__data.QteLimited ? v >= 0 && v <= x ? v : (v < 0 ? 0 : x) : v;
        }
        var ProdOpr = (function () {
            function ProdOpr(Name) {
                var _this = this;
                this.Name = Name;
                switch (Name) {
                    case 'prod-add':
                        var t;
                        this.modadd = new UI_7.UI.Modal();
                        this.modadd.OnInitialized = function (m) {
                            return m.Add(_this.t = new UI_7.UI.NumericUpDown());
                        };
                        this.modadd.OnClosed.On = function (e) { return _this.addr(e.Modal, e.msg); };
                        this.oper = this.add;
                        return;
                    case 'prod-plus':
                        this.oper = this.plus;
                        return;
                    case 'prod-minus':
                        this.oper = this.minus;
                        return;
                    case 'prod-remove':
                        this.oper = this.remove;
                        return;
                }
                throw '';
            }
            ProdOpr.prototype.Todo = function (ji, e) { };
            ProdOpr.prototype.Check = function (ji, e) { };
            ProdOpr.prototype.OnError = function (ji, e) { };
            ProdOpr.prototype.OnInitialize = function (ji, e) {
                var _this = this;
                ji.dom.addEventListener('click', function (e) { return _this.oper(ji); });
            };
            ProdOpr.prototype.OnScopDisposing = function (ji, e) { };
            ProdOpr.prototype.addr = function (e, r) {
                if (r == 'ok')
                    setValue(getPrd(this.selectedJobInstance.Scop.Value), this.t.Value);
            };
            ProdOpr.prototype.add = function (ji) {
                var _this = this;
                var t = GData.__data.SelectedFacture;
                if (t == null)
                    return UI_7.UI.InfoArea.push('<p><h1>Select</h1> a facture</p>');
                this.selectedJobInstance = ji;
                this.modadd.Open();
                this.modadd.OnInitialized = function (m) {
                    _this.t.Focus();
                    var prd = ji.Scop.Value;
                    prd = prd && prd.CurrentArticle;
                    _this.t.Value = prd && prd.Count || 0;
                    _this.t.SelectAll();
                };
            };
            ProdOpr.prototype.plus = function (ji) {
                return setValue(ji.Scop.Value, undefined, +1);
            };
            ProdOpr.prototype.minus = function (ji) {
                return setValue(ji.Scop.Value, undefined, -1);
            };
            ProdOpr.prototype.remove = function (ji) {
                var prod = ji.Scop.Value;
                var art = prod.CurrentArticle;
                if (art != null)
                    UI_7.UI.Modal.ShowDialog('Confirmation', "Do you want realy  to delete this Article", function (xx) {
                        if (xx.Result === UI_7.UI.MessageResult.ok)
                            removeArticle(prod, art);
                    });
            };
            return ProdOpr;
        }());
        var ArtOpr = (function () {
            function ArtOpr(Name) {
                var _this = this;
                this.Name = Name;
                switch (Name) {
                    case 'art-plus':
                        this.oper = this.plus;
                        return;
                    case 'art-minus':
                        this.oper = this.minus;
                        return;
                    case 'art-remove':
                        this.oper = this.remove;
                        return;
                    case 'art-add':
                        this.modadd = new UI_7.UI.Modal();
                        this.modadd.OnInitialized = function (m) {
                            return m.Add(_this.t = new UI_7.UI.NumericUpDown());
                        };
                        this.modadd.OnClosed.On = function (e) { return _this.addr(e.Modal, e.msg); };
                        this.oper = this.add;
                        return;
                }
                throw '';
            }
            ArtOpr.prototype.Todo = function (ji, e) { };
            ArtOpr.prototype.Check = function (ji, e) { };
            ArtOpr.prototype.OnError = function (ji, e) { };
            ArtOpr.prototype.OnInitialize = function (ji, e) {
                var _this = this;
                var dm = ji.dom;
                dm.addEventListener('click', function (e) { _this.oper(ji); });
            };
            ArtOpr.prototype.OnScopDisposing = function (ji, e) { };
            ArtOpr.prototype.addr = function (e, r) {
                if (r == 'ok')
                    setValue(getPrd(this.selectedScop.Scop.Value), this.t.Value);
            };
            ArtOpr.prototype.add = function (ji) {
                var t = GData.__data.SelectedFacture;
                if (t == null)
                    return UI_7.UI.InfoArea.push('<p><h1>Select</h1> a facture</p>');
                this.selectedScop = ji;
                this.modadd.Open();
                this.t.Focus();
                this.t.SelectAll();
            };
            ArtOpr.prototype.plus = function (ji) {
                setValue(getPrd(ji.Scop.Value), undefined, +1);
            };
            ArtOpr.prototype.minus = function (ji) {
                setValue(getPrd(ji.Scop.Value), undefined, -1);
            };
            ArtOpr.prototype.remove = function (ji) {
                var art = ji.Scop.Value;
                if (art != null)
                    UI_7.UI.Modal.ShowDialog('Confirmation', "Do you want realy  to delete this Article", function (xx) {
                        if (xx.Result === UI_7.UI.MessageResult.ok)
                            removeArticle(art.Product, art);
                    });
            };
            return ArtOpr;
        }());
        function initializeOprs() {
            Corelib_3.bind.Register(new ProdOpr('prod-add'));
            Corelib_3.bind.Register(new ProdOpr('prod-plus'));
            Corelib_3.bind.Register(new ProdOpr('prod-remove'));
            Corelib_3.bind.Register(new ProdOpr('prod-minus'));
            Corelib_3.bind.Register(new ArtOpr('art-add'));
            Corelib_3.bind.Register(new ArtOpr('art-plus'));
            Corelib_3.bind.Register(new ArtOpr('art-remove'));
            Corelib_3.bind.Register(new ArtOpr('art-minus'));
            Corelib_3.bind.Register(new Corelib_3.bind.Job('calctotal', null, null, null, function (ji, e) {
                var dm = ji.dom;
                dm.onclick = function (e) {
                    var v = ji.Scop.Value;
                    if (v)
                        v.Recalc();
                };
                var v = ji.Scop.Value;
                if (v)
                    v.Recalc();
            }, null));
            Corelib_3.bind.Register(new Corelib_3.bind.Job('calcsold', null, null, null, function (ji, e) {
                var dm = ji.dom;
                dm.onclick = function (e) {
                    var v = ji.Scop.Value;
                    if (v)
                        ji.dom.nextElementSibling.textContent = v.CalcTotal() || '0.00';
                };
                var v = ji.Scop.Value;
                if (v)
                    ji.dom.nextElementSibling.textContent = v.CalcTotal() || '0.00';
            }, null));
        }
        internal.initializeOprs = initializeOprs;
        function removeUser(p) {
            UI_7.UI.Modal.ShowDialog("Confirmation", "Are you Sure To <b>Delete</b> This Client", function (xx) {
                if (xx.Result === UI_7.UI.MessageResult.ok)
                    GData.requester.Request(Number, "REMOVE", p, p, function (s, r, iss) {
                        if (iss) {
                            GData.invalidateLogins.Remove(p);
                            if (GData.validateLogins.IndexOf(p) == -1)
                                GData.validateLogins.Remove(p);
                            UI_7.UI.InfoArea.push('The Client Successffuly <h2>Removed</h2>', true, 3000);
                        }
                        else {
                            UI_7.UI.InfoArea.push("A <h2 style='color:red'>Error</h2> Occured When Removing A Client", false);
                        }
                    });
            }, "DELETE", "Cancel");
        }
        function validateUser(p) {
            GData.requester.Request(Number, "VALIDATE", p, p, function (s, r, iss) {
                if (iss) {
                    GData.invalidateLogins.Remove(p);
                    if (GData.validateLogins.IndexOf(p) == -1)
                        GData.validateLogins.Add(p);
                    UI_7.UI.InfoArea.push('The Client Successffuly <h2>Validated</h2>', true, 3000);
                }
                else {
                    UI_7.UI.InfoArea.push("A Error Occured When Validating A Client", false);
                }
            });
        }
        function lockUser(p) {
            if (p instanceof Models_15.models.Login == false)
                throw 'invalid param';
            GData.requester.Request(Number, 'LOCK', p, p, function (s, r, iss) {
                if (iss) {
                    GData.validateLogins.Remove(p);
                    GData.invalidateLogins.Add(p);
                    UI_7.UI.InfoArea.push('The Client Successffuly <h2>Locke</h2>', true, 3000);
                }
                else {
                    UI_7.UI.InfoArea.push("A <h2 style='color:red'>Error</h2> Occured When Locking A Client", false);
                }
            });
        }
        Corelib_3.Api.RegisterApiCallback({
            Name: 'validateuser',
            DoApiCallback: function (c, n, p) { validateUser(p.data); }
        });
        Corelib_3.bind.Register({
            Name: 'validateuser',
            OnInitialize: function (j, e) {
                j.addEventListener('onclick', 'click', function (e) { return validateUser(j.Scop.Value); });
            }
        });
        (function () {
            var obsModal;
            var obsObject = (function (_super) {
                __extends(obsObject, _super);
                function obsObject() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                obsObject.ctor = function () {
                    obsObject.DPObservation = Corelib_3.bind.DObject.CreateField('Observation', String, null);
                };
                obsObject.__fields__ = function () { return [this.DPObservation]; };
                return obsObject;
            }(Corelib_3.bind.DObject));
            var obsValue = new obsObject();
            var Scop = new Corelib_3.bind.ValueScop(obsValue, Corelib_3.bind.BindingMode.TwoWay);
            Corelib_3.Api.RegisterApiCallback({
                Name: "OpenObservation", DoApiCallback: function (c, n, p) {
                    if (!obsModal) {
                        obsModal = new UI_7.UI.Modal();
                        obsModal.OnInitialized = function (n) {
                            n.setStyle("minWidth", "50%").setStyle('minHeight', "50%");
                            obsModal.Add(new UI_7.UI.TControl("templates.Observation", Scop));
                        };
                    }
                    obsValue.Observation = p.data;
                    obsModal.Open();
                    obsModal.OnClosed.Add(function (e) {
                        try {
                            e.Modal.OnClosed.Remove('');
                            if (e.Result === UI_7.UI.MessageResult.ok)
                                p.callback(p, obsValue.Observation);
                        }
                        catch (e) {
                        }
                    }, '');
                }
            });
        })();
        function createApiEdit(template, apiName) {
            var editSFacture;
            var p;
            var callback = {
                OnSuccess: {
                    Invoke: function (data, isNew) {
                        p.callback(p, { data: data, iss: true });
                        return true;
                    }, Owner: null
                },
                OnError: {
                    Invoke: function (data, isNew) {
                        p.callback(p, { data: data, iss: false });
                        return true;
                    }, Owner: null
                },
            };
            Corelib_3.Api.RegisterApiCallback({
                Name: apiName, DoApiCallback: function (c, n, px) {
                    if (!editSFacture)
                        editSFacture = new UI_7.UI.Modals.ModalEditer(template);
                    p = px;
                    editSFacture.edit(p.data, false, callback, !p.data.IsFrozen());
                }
            });
        }
        internal.createApiEdit = createApiEdit;
        createApiEdit('templates.sfactureInfo', 'OpenSFactureInfo');
        createApiEdit('templates.factureInfo', 'OpenFactureInfo');
        Corelib_3.Api.RegisterApiCallback({
            Name: 'removeuser', DoApiCallback: function (c, n, p) {
                removeUser(p.data);
            }
        });
        Corelib_3.bind.Register({
            Name: 'removeuser', OnInitialize: function (j, e) {
                j.addEventListener('onclick', 'click', function (e) { return removeUser(j.Scop.Value); });
            }
        });
        Corelib_3.Api.RegisterApiCallback({
            Name: 'lockuser', DoApiCallback: function (a, v, p) {
                lockUser(p.data);
            }
        });
        Corelib_3.bind.Register({
            Name: 'lockuser', OnInitialize: function (j, e) { j.addEventListener('onclick', 'click', function (e) { return lockUser(j.Scop.Value); }); }
        });
        Corelib_3.bind.Register({
            Name: 'openclient', OnInitialize: function (j, p) {
                j.addEventListener('click', 'click', {
                    Owner: j,
                    handleEvent: function (e) {
                        GData.apis.Client.Edit(this.Owner.Scop.Value, void 0);
                    }
                });
            }
        });
        Corelib_3.bind.Register({
            Name: 'selectclient', OnInitialize: function (j, e) {
                j.addEventListener('click', 'click', {
                    Owner: j,
                    handleEvent: function (e) {
                        var t = j.Scop.Value;
                        GData.apis.Client.Select(function (e) {
                            if (e.Error == Corelib_3.basic.DataStat.Success)
                                j.Scop.Value = e.Data;
                        }, t);
                    }
                });
            }
        });
        Corelib_3.bind.Register({
            Name: 'selectprojet', OnInitialize: function (j, e) {
                j.addEventListener('click', 'click', {
                    Owner: j,
                    handleEvent: function (e) {
                        var t = j.Scop.Value;
                        GData.apis.Projet.Select(function (e) {
                            if (e.Error == Corelib_3.basic.DataStat.Success)
                                j.Scop.Value = e.Data;
                        }, t);
                    }
                });
            }
        });
        Corelib_3.bind.Register({
            Name: "proj.new",
            OnInitialize: function (j, e) {
                j.addEventListener('click', 'click', {
                    Owner: j,
                    handleEvent: function (e) {
                        GData.apis.Projet.CreateNew();
                    }
                });
            }
        });
        Corelib_3.bind.Register({
            Name: "proj.del",
            OnInitialize: function (j, e) {
                j.addEventListener('click', 'click', {
                    Owner: j,
                    handleEvent: function (e) {
                        alert(j);
                    }
                });
            }
        });
        Corelib_3.bind.Register({
            Name: 'openproduct', OnInitialize: function (j, e) {
                j.addEventListener('dblclick', 'dblclick', {
                    Owner: j,
                    handleEvent: function (e) {
                        var t = this.Owner.Scop.Value;
                        GData.apis.Product.Edit(t, null);
                    }
                });
            }
        });
        Corelib_3.bind.Register({
            Name: 'opencategory', OnInitialize: function (j, e) {
                j.addEventListener('dblclick', 'dblclick', {
                    handleEvent: function (e) {
                        var t = this.self.Scop.Value;
                        GData.apis.Category.Edit(t);
                    }, self: j
                });
            }
        });
        Corelib_3.bind.Register({
            Name: 'enum2string',
            OnInitialize: function (ji, e) {
                var dm = ji.dom;
                ji.addValue('info', { map: getEnumList(dm.getAttribute('type')), rIsNumber: dm.getAttribute('rtype') === 'number' });
                this.Todo(ji, e);
            },
            Todo: function (ji, e) {
                var info = ji.getValue('info');
                var vl = ji.Scop.Value;
                var dm = ji.dom;
                dm.textContent = info.rIsNumber ? (info.map.type[vl || 0] || (vl || 0).toString()) : vl || info.map.type[0];
            }
        });
        Corelib_3.bind.Register({
            Name: 'selectcategory',
            OnInitialize: function (j, e) {
                if (!(j.dom instanceof HTMLSelectElement))
                    throw "Dom must be Select";
                var k = new UI_7.UI.ComboBox(j.dom, GData.__data.Categories);
                var parent = j.Control || j.Scop.__Controller__ && j.Scop.__Controller__.CurrentControl || UI_7.UI.Desktop.Current;
                k.Parent = parent;
                k.addEventListener('change', function (s, e, k) {
                    var x = k.Content.getChild(e.target.selectedIndex);
                    if (x) {
                        var c = x.getDataContext();
                        if (c) {
                            j.Scop.Value = c;
                        }
                    }
                }, k);
            }
        });
    })(internal || (internal = {}));
    var extern;
    (function (extern) {
        function crb(icon, title, type, attr) {
            var t = document.createElement('button');
            t.classList.add('btn', 'btn-' + type, 'glyphicon', 'glyphicon-' + icon);
            t.textContent = '  ' + title;
            if (attr)
                for (var i in attr)
                    t.setAttribute(i, attr[i]);
            return t;
        }
        extern.crb = crb;
    })(extern = exports.extern || (exports.extern = {}));
    var Facture = (function (_super) {
        __extends(Facture, _super);
        function Facture(name, caption, template, Data, focuseOrEdit) {
            var _this = _super.call(this, name, caption) || this;
            _this.template = template;
            _this.focuseOrEdit = focuseOrEdit;
            _this.header = UI_7.UI.Template.ToTemplate('templates.facturePageHeader', false).CreateShadow(null);
            _this._caption = document.createTextNode("Facture D'Achat");
            _this.abonment = new UI_7.UI.ProxyAutoCompleteBox(new UI_7.UI.Input(document.createElement('input')), Corelib_3.basic.getEnum('models.Abonment'));
            _this.Title = caption;
            _this.Data = Data;
            return _this;
        }
        Facture.__fields__ = function () { return [this.DPData, this.DPTitle]; };
        Facture.prototype.Open = function (x) {
            var _this = this;
            this.OnInitialized = function (me) {
                var lx = me.Data;
                me.Data = x;
                me.LoadArticles();
                if (me.scp)
                    return;
                var _scop = Corelib_3.bind.Scop.Create('Data.IsOpen', me, 1);
                _scop.AddJob(me, me.View);
                _this.tb = new Corelib_3.bind.TwoBind(3, me, me.adapter, Facture.DPData, UI_7.UI.TControl.DPData);
                me.scp = _this;
            };
        };
        Facture.prototype.getHelp = function () {
            var t = {
                "Enter": "New Article",
                "F2": "Edit",
                "F3": "Deep Searche",
                "F4": "Open Info",
                "F5": "Update",
                "F7": "Open | Close ",
                "F8": "Save Facture",
                "F9": "Regler Facture",
                "CTRL+S, CTRL+R": "Stat. Recherche",
                "CTRL+S, CTRL+D": "Stat. Detail",
                "CTRL+S, CTRL+B": "Stat. Benifit",
            };
            var l = ["primary", "success", "danger", "info", "warning"];
            var k = 0;
            var s = "";
            for (var i in t) {
                s += '<div class="input-group" style="background:gray"> <span class="input-group-btn"> <label class="btn btn-' + l[(k++) % l.length] + '">' + i + '</label> </span> <label class="form-control" >' + t[i] + '</label> </div>';
            }
            UI_7.UI.InfoArea.push(s, true, 10000);
        };
        Facture.prototype.OnKeyDown = function (e) {
            if (this.Data && this.Data.IsOpen && e.keyCode == UI_7.UI.Keys.Enter) {
                this.AddNewArticle();
            }
            else if (!this.adapter.OnKeyDown(e)) {
                switch (e.keyCode) {
                    case 86:
                        this.GetLastArticlePrice();
                        return;
                    case UI_7.UI.Keys.F1:
                        this.getHelp();
                        break;
                    case 13:
                        if (this.focuseOrEdit)
                            this.focuser.focuseNext(true);
                        else
                            this.edit();
                        break;
                    case UI_7.UI.Keys.F2:
                        this.edit();
                        break;
                    case UI_7.UI.Keys.F3:
                        this.OnDeepSearch();
                        break;
                    case UI_7.UI.Keys.F4:
                        this.OpenInfo();
                        break;
                    case UI_7.UI.Keys.F5:
                        this.Update();
                        break;
                    case UI_7.UI.Keys.F6:
                        break;
                    case UI_7.UI.Keys.F7:
                        this.OpenCloseFacture();
                        break;
                    case UI_7.UI.Keys.F8:
                        if (this.Data.IsOpen)
                            this.SaveFacture();
                        break;
                    case UI_7.UI.Keys.F9:
                        this.ReglerFacture();
                        break;
                    case UI_7.UI.Keys.F10:
                        this.OpenVersments(false);
                        break;
                    case 13:
                        this.edit();
                        break;
                    default:
                        return _super.prototype.OnKeyDown.call(this, e);
                }
                e.preventDefault();
                e.stopPropagation();
            }
        };
        Facture.prototype.ToggleFactureStat = function (e, dt, scopValue, events) {
            var data = this.Data;
            var v = dt.dom;
            if (data)
                GData.apis.Facture.EOpenFacture(data);
            if (v)
                v.blur();
        };
        Facture.prototype.initialize = function () {
            _super.prototype.initialize.call(this);
            this._view.style.minWidth = '750px';
            this.Add(this.header);
            this.Add(this.adapter = (new UI_7.UI.ListAdapter(this.template, undefined, this.Data, true)).applyStyle('fitHeight'));
            this.adapter.AcceptNullValue = false;
            this.adapter.OnItemSelected.On = function (n) {
                var t = n.SelectedChild;
                if (t && t.View)
                    Corelib_3.thread.Dispatcher.call(null, Corelib_3.basic._focuseOn, t.View);
            };
            this.focuser = new Corelib_3.basic.focuser(this.adapter.View, true);
            UI_7.UI.Desktop.Current.KeyCombiner.On('S', 'R', function (s, e) {
                this.OpenPrdStatistics();
                s.Cancel = true;
            }, this, this);
            UI_7.UI.Desktop.Current.KeyCombiner.On('S', 'D', function (s, e) {
                this.OpenPrdStatisticsRslt();
                s.Cancel = true;
            }, this, this);
            UI_7.UI.Desktop.Current.KeyCombiner.On('S', 'B', function (s, e) {
                this.CalculateBenifite();
                s.Cancel = true;
            }, this, this);
        };
        Object.defineProperty(Facture.prototype, "IsOpen", {
            get: function () { var d = this.Data; if (d)
                return d.IsOpen; return false; },
            enumerable: true,
            configurable: true
        });
        Facture.prototype.OpenCloseFacture = function () {
            GData.apis.Facture.EOpenFacture(this.Data);
        };
        __decorate([
            Corelib_3.attributes.property(String, ""),
            __metadata("design:type", String)
        ], Facture.prototype, "Title", void 0);
        __decorate([
            Corelib_3.attributes.property(Models_15.models.FactureBase),
            __metadata("design:type", Object)
        ], Facture.prototype, "Data", void 0);
        return Facture;
    }(UI_7.UI.NavPanel));
    exports.Facture = Facture;
    Corelib_3.Api.RegisterApiCallback({
        Name: 'loadFournisseurs',
        Params: {},
        DoApiCallback: function (a, b, c) {
            if (this.Params.loaded)
                return c && c.callback && c.callback(c, true);
            this.Params.loaded = true;
            GData.spin.Start("Load la list des fournisseurs");
            GData.requester.Push(Models_15.models.Fournisseurs, GData.__data.Fournisseurs, null, function (d, r, iss) {
                GData.spin.Pause();
                c && c.callback && c.callback(c, iss);
            });
        }
    });
    Corelib_3.Api.RegisterApiCallback({
        Name: 'loadSFActures',
        Params: {},
        DoApiCallback: function (a, b, c) {
            if (this.Params.loaded)
                return c && c.callback && c.callback(c, true);
            this.Params.loaded = true;
            GData.spin.Start("Load la list des factures de reciption");
            GData.requester.Push(Models_15.models.SFactures, GData.__data.SFactures, null, function (d, r, iss) {
                GData.spin.Pause();
                c && c.callback && c.callback(c, iss);
            });
        }
    });
    Corelib_3.Api.RegisterApiCallback({
        Name: 'loadFActures',
        Params: {},
        DoApiCallback: function (a, b, c) {
            if (this.Params.loaded)
                return c && c.callback && c.callback(c, true);
            this.Params.loaded = true;
            GData.spin.Start("Load la list des factures de livraison");
            GData.requester.Request(Models_15.models.Factures, "GETCSV", null, null, function (d, r, iss, req) {
                GData.spin.Pause();
                GData.__data.Factures.FromCsv(req.Response);
                c && c.callback && c.callback(c, iss);
            });
        }
    });
    Corelib_3.Api.RegisterApiCallback({
        Name: 'getLastArticlePrice',
        Params: {},
        DoApiCallback: function (a, b, c) {
            var p = c.data;
            if (p.Dealer)
                p.IsAchat = p.Dealer instanceof Models_15.models.Fournisseur;
            var t = p.IsAchat ? GData.apis.SFacture : GData.apis.Facture;
            t.GetLastArticlePrice(p.Dealer, p.Product, p.Before, function (prc) { return c && c.callback && c.callback(c, prc); }, p.asRecord);
        }
    });
    if (typeof __data !== 'undefined')
        Corelib_3.Api.RiseApi('getLastArticlePrice', { data: { Dealer: __data.Costumers.Get(0), Product: __data.Products.Get(0), Before: new Date(0) }, callback: function (a, r) { } });
    window['api'] = Corelib_3.Api;
    UI_7.UI;
});
define("Componenets/Forms", ["require", "exports", "abstract/Models", "../lib/Q/sys/UI", "../lib/Q/sys/Corelib", "abstract/extra/Common", "abstract/extra/Basics"], function (require, exports, Models_16, UI_8, Corelib_4, Common_1, Basics_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GData;
    Common_1.GetVars(function (c) { GData = c; return false; });
    var Forms;
    (function (Forms) {
        var InitFacture = (function (_super) {
            __extends(InitFacture, _super);
            function InitFacture() {
                var _this = _super.call(this, "Facture.new", UI_8.UI.TControl.Me) || this;
                _this.OnSuccess = new Corelib_4.bind.EventListener(0, true);
                return _this;
            }
            InitFacture.prototype.SelectClient = function () {
                var _this = this;
                GData.apis.Client.Select(function (e) {
                    if (e.Error == Basics_6.basics.DataStat.Success) {
                        var selected = e.Data;
                        _this.Value.Client = selected;
                        if (selected) {
                            _this.Value.Abonment = selected.Abonment;
                        }
                    }
                }, this.Value.Client, GData.__data.Costumers);
            };
            InitFacture.prototype.Show = function (callback) {
                var _this = this;
                this.Value = new Models_16.models.Facture(0);
                this.Data = this.Value;
                if (callback)
                    this.OnSuccess.Add(callback);
                this.Value.Type = Models_16.models.BonType.Bon;
                this.Value.Transaction = Models_16.models.TransactionType.Vente;
                this.Value.Abonment = this.Value.Client && this.Value.Client.Abonment || 0;
                UI_8.UI.Modal.ShowDialog("Creation Facture Vente", this, function (e) { return _this.onModalCosed(e); }, "Create", "Discart");
                return this;
            };
            InitFacture.prototype.onModalCosed = function (e) {
                var _this = this;
                this.Parent = null;
                if (e.Result == UI_8.UI.MessageResult.ok) {
                    var f = this.Value;
                    if (!f.Client)
                        return e.StayOpen();
                    GData.requester.Request(Models_16.models.Facture, "CREATE", this.Value, { CId: f.Client.Id, Type: f.Type, Abonment: f.Abonment, Transaction: f.Transaction }, function (s, r, iss) {
                        _this.OnSuccess.PInvok(0, [_this.Value, iss], _this);
                    });
                }
            };
            return InitFacture;
        }(UI_8.UI.TControl));
        Forms.InitFacture = InitFacture;
        var PDFViewer = (function (_super) {
            __extends(PDFViewer, _super);
            function PDFViewer() {
                var _this = _super.call(this, "templates.PDFViewer", UI_8.UI.TControl.Me) || this;
                _this.quee = [];
                if (PDFViewer.pdf != null)
                    throw null;
                PDFViewer.pdf = _this;
                PDFViewer.modal.OnInitialized = function (n) { n.setWidth('95vw').setHeight('90vh').Content = _this; };
                PDFViewer.modal.OnClosed.On = function (e) {
                    if (_this.quee.length == 0)
                        return;
                    e.StayOpen();
                    _this.Url = _this.quee.pop();
                };
                return _this;
            }
            PDFViewer.__fields__ = function () { return [this.DPUrl]; };
            PDFViewer.ctor = function () {
                PDFViewer.modal = new UI_8.UI.Modal();
            };
            PDFViewer.prototype.UrlChanged = function (e) {
                this.OnInitialized = function (n) { return Corelib_4.thread.Dispatcher.call(n, n.asyncUrl, e._new); };
            };
            PDFViewer.prototype.asyncUrl = function (url) {
                this.pdfDom.src = '';
                setTimeout(function (ths, url) {
                    ths.pdfDom.src = url;
                }, 200, this, url);
            };
            PDFViewer.prototype.setName = function (name, dom, cnt, e) {
                var _this = this;
                if (name == "pdfDom") {
                    this.pdfDom = dom;
                    this.pdfDom.addEventListener('error', function (e) { _this.Refech(); });
                    return true;
                }
            };
            PDFViewer.Show = function (url) {
                if (!this.pdf)
                    new PDFViewer();
                if (!this.modal.IsOpen) {
                    this.modal.Open();
                    this.pdf.OnCompiled = function (pdf) { return pdf.Url = url; };
                }
                else
                    PDFViewer.pdf.quee.push(url);
            };
            PDFViewer.prototype.Refech = function () {
                var d = this.Url;
                this.Url = '';
                this.Url = d;
            };
            PDFViewer.modal = new UI_8.UI.Modal();
            PDFViewer.DPUrl = Corelib_4.bind.DObject.CreateField("Url", String, null, PDFViewer.prototype.UrlChanged);
            return PDFViewer;
        }(UI_8.UI.TControl));
        Forms.PDFViewer = PDFViewer;
        var InitSFacture = (function (_super) {
            __extends(InitSFacture, _super);
            function InitSFacture() {
                var _this = _super.call(this, "SFacture.new", UI_8.UI.TControl.Me) || this;
                _this.OnSuccess = new Corelib_4.bind.EventListener(0, true);
                return _this;
            }
            InitSFacture.prototype.SelectFournisseur = function () {
                var _this = this;
                GData.apis.Fournisseur.Select(function (e) {
                    if (e.Error === Basics_6.basics.DataStat.Success) {
                        _this.Value.Fournisseur = e.Data;
                    }
                }, this.Value.Fournisseur);
            };
            InitSFacture.prototype.SelectAchteur = function () {
                var _this = this;
                GData.apis.Agent.Select(function (e) {
                    var selected = e.Data;
                    if (e.Error == Basics_6.basics.DataStat.Success)
                        _this.Value.Achteur = selected;
                }, this.Value.Achteur, GData.__data.Agents);
            };
            InitSFacture.prototype.Show = function (callback) {
                var _this = this;
                this.Value = new Models_16.models.SFacture(0);
                this.Data = this.Value;
                if (callback)
                    this.OnSuccess.Add(callback);
                this.Value.Type = Models_16.models.BonType.Bon;
                this.Value.Transaction = Models_16.models.TransactionType.Vente;
                this.Value.Abonment = this.Value.Client && this.Value.Client.Abonment || 0;
                UI_8.UI.Modal.ShowDialog("Creation Facture Achat", this, function (e) { return _this.onModalCosed(e); }, "Create", "Discart");
                return this;
            };
            InitSFacture.prototype.onModalCosed = function (e) {
                var _this = this;
                this.Parent = null;
                if (e.Result == UI_8.UI.MessageResult.ok) {
                    var f = this.Value;
                    if (!f.Fournisseur || !f.Achteur)
                        return e.StayOpen();
                    GData.requester.Request(Models_16.models.SFacture, "CREATE", this.Value, { FId: f.Fournisseur.Id, AId: f.Achteur.Id, Type: f.Type, Transaction: f.Transaction }, function (s, r, iss) {
                        _this.OnSuccess.PInvok(0, [_this.Value, iss], _this);
                    });
                }
            };
            return InitSFacture;
        }(UI_8.UI.TControl));
        Forms.InitSFacture = InitSFacture;
        var PictureViewer = (function (_super) {
            __extends(PictureViewer, _super);
            function PictureViewer() {
                var _this = _super.call(this, 'templates.PictureViewer', UI_8.UI.TControl.Me) || this;
                var f = new FileReader();
                _this.openDlg.multiple = false;
                _this.openDlg.pattern = "[\w\d\s].png";
                f.readAsText(_this.openDlg.files[0]);
                return _this;
            }
            return PictureViewer;
        }(UI_8.UI.TControl));
        Forms.PictureViewer = PictureViewer;
        var ImageModal = (function (_super) {
            __extends(ImageModal, _super);
            function ImageModal() {
                return _super.call(this, ImageModal.createElement('div', 'ImageModal')) || this;
            }
            ImageModal.prototype.initialize = function () {
                this._view.appendChild(this.btnClose = ImageModal.createElement('span', 'close'));
                this._view.appendChild(this.txtCaption = ImageModal.createElement('div', void 0, 'caption'));
                this._view.appendChild(this.imgContent = ImageModal.createElement('img', 'modal-content'));
                this.btnClose.addEventListener('click', this);
                this._view.style.zIndex = "9007199254740991";
                this.btnClose.innerText = 'Fermer';
                require('style|../assets/Forms.css');
            };
            ImageModal.createElement = function (tag, css, id) {
                var t = document.createElement(tag);
                if (css)
                    t.classList.add(css);
                if (id)
                    t.id = id;
                return t;
            };
            ImageModal.prototype.Open = function (img, caption) {
                var _this = this;
                if (this.Parent == null) {
                    this.Parent = UI_8.UI.Desktop.Current;
                    UI_8.UI.Desktop.Current.View.appendChild(this._view);
                }
                else
                    this.Parent.View.classList.add('modal-open');
                UI_8.UI.Desktop.Current.GetKeyControl(this, function (e) {
                    if (e.keyCode == UI_8.UI.Keys.Esc)
                        _this.Close();
                    if (e.keyCode > 36 && e.keyCode < 41 && !e.altKey && !e.ctrlKey && !e.shiftKey)
                        return 2;
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    return 0;
                }, []);
                this._view.style.display = "block";
                this.imgContent.src = img;
                this.txtCaption.innerHTML = caption;
            };
            Object.defineProperty(ImageModal.prototype, "IsOpen", {
                get: function () {
                    return this._view.style.display == "block";
                },
                enumerable: true,
                configurable: true
            });
            ImageModal.prototype.Close = function () {
                this.Parent.View.classList.remove('modal-open');
                this._view.style.display = "none";
                UI_8.UI.Desktop.Current.ReleaseKeyControl();
            };
            ImageModal.prototype.handleEvent = function (e) {
                if (e.type == 'click' && e.srcElement === this.btnClose)
                    this.Close();
            };
            ImageModal.Default = new ImageModal();
            return ImageModal;
        }(UI_8.UI.JControl));
        Forms.ImageModal = ImageModal;
        window['ImageModal'] = ImageModal;
    })(Forms = exports.Forms || (exports.Forms = {}));
    function Test() {
        var t = new Forms.InitFacture();
        t.Show();
        return t;
    }
    exports.Test = Test;
    function Test1() {
        var t = new Forms.InitSFacture();
        t.Show();
        return t;
    }
    exports.Test1 = Test1;
});
define("Componenets/PStat", ["require", "exports", "../lib/Q/sys/Corelib", "../lib/Q/sys/UI", "abstract/Models", "assets/data/data", "../lib/q/components/HeavyTable/script", "abstract/extra/Common"], function (require, exports, Corelib_5, UI_9, Models_17, data_1, script_2, Common_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GData;
    Common_2.GetVars(function (data) { GData = clone(data); return false; });
    var Statistique;
    (function (Statistique) {
        var Views;
        (function (Views) {
            var ProduitStat = (function (_super) {
                __extends(ProduitStat, _super);
                function ProduitStat(_dealers, DealerTitle) {
                    var _this = _super.call(this, "templates.ProductSearch" + (DealerTitle == 'Client' ? '' : '1'), UI_9.UI.TControl.Me) || this;
                    _this._dealers = _dealers;
                    _this.DealerTitle = DealerTitle;
                    _this._dealer = null;
                    _this._product = null;
                    _this.dealer = null;
                    _this.product = null;
                    _this.from = null;
                    _this.to = null;
                    return _this;
                }
                Object.defineProperty(ProduitStat.prototype, "DealersSource", {
                    get: function () { return this._dealers; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ProduitStat.prototype, "List", {
                    set: function (v) {
                        this._list = v;
                    },
                    enumerable: true,
                    configurable: true
                });
                ProduitStat.prototype.initialize = function () {
                    _super.prototype.initialize.call(this);
                    this.To = new Date(Date.now() + 31536000000);
                    this.From = new Date(Date.now() - 31536000000);
                };
                ProduitStat.prototype.setName = function (name, dom, cnt, e) {
                    if (this[name] === null) {
                        this[name] = dom;
                        this['_' + name] = e.Control;
                    }
                };
                ProduitStat.__fields__ = function () { return [this.DPFrom, this.DPTo, this.DPSelectedDealer, this.DPSelectedProduct]; };
                ProduitStat.prototype.Open = function () {
                    var _this = this;
                    if (!this.modal) {
                        this.modal = new UI_9.UI.Modal();
                        this.modal.OnInitialized = function (m) { return _this.modal.Content = _this; };
                        this.modal.OnClosed.On = function (n) {
                            if (n.Result == UI_9.UI.MessageResult.ok)
                                _this._list.Execute(_this.getRequest());
                        };
                    }
                    this.modal.Open();
                    return this;
                };
                ProduitStat.prototype.getRequest = function () {
                    var s = [];
                    if (this.SelectedProduct)
                        s.push("Id=" + this.SelectedProduct.Id);
                    if (this.SelectedDealer)
                        s.push((this.DealerTitle == 'Client' ? "CID=" : 'FID=') + this.SelectedDealer.Id);
                    if (this.From && this.From.getTime() != 0)
                        s.push("From=" + this.From.getTime());
                    if (this.To && this.To.getTime() != 0)
                        s.push("To=" + this.To.getTime());
                    return s.join('&');
                };
                ProduitStat.DPFrom = Corelib_5.bind.DObject.CreateField("From", Date);
                ProduitStat.DPTo = Corelib_5.bind.DObject.CreateField("To", Date);
                ProduitStat.DPSelectedDealer = Corelib_5.bind.DObject.CreateField("SelectedDealer", Models_17.models.Dealer);
                ProduitStat.DPSelectedProduct = Corelib_5.bind.DObject.CreateField("SelectedProduct", Models_17.models.Product);
                return ProduitStat;
            }(UI_9.UI.TControl));
            Views.ProduitStat = ProduitStat;
            var ListOfArticles = (function (_super) {
                __extends(ListOfArticles, _super);
                function ListOfArticles(query) {
                    var _this = _super.call(this, 7, undefined, true) || this;
                    _this.query = query;
                    _this.fact = 1;
                    query.List = _this;
                    return _this;
                }
                ListOfArticles.prototype.Execute = function (q) {
                    var _this = this;
                    GData.requester.Costume({ Url: __global.ApiServer.Combine('/_/pstat/ArticlesPurchased').FullPath + '?' + q, HasBody: false, Method: Corelib_5.net.WebRequestMethod.Get }, new Models_17.models.Articles(null), {}, function (pc, data, s, req) {
                        _this.Open();
                        _this.OnInitialized = function (n) {
                            n.table.OnInitialized = function (t) {
                                pc.data.FromJson(data, Corelib_5.encoding.SerializationContext.GlobalContext);
                                _this.Input = pc.data;
                            };
                        };
                    }, this);
                    this.Open();
                };
                Object.defineProperty(ListOfArticles.prototype, "DealerTitle", {
                    get: function () { return this.query.DealerTitle; },
                    enumerable: true,
                    configurable: true
                });
                ListOfArticles.prototype.initialize = function () {
                    var _this = this;
                    _super.prototype.initialize.call(this);
                    this.table = new script_2.Material.HeavyTable(data_1.data.value.ProductStatDef.def);
                    this.OnInitialized = function (p) {
                        _this.table.OnInitialized = function (l) {
                            l.Source = p.Output;
                            p.OnPropertyChanged(UI_9.UI.Paginator.DPOutput, function (s, e) { _this.table.Source = e._new; });
                        };
                        _this.Content = _this.table;
                    };
                };
                ListOfArticles.prototype.OrderByDealer = function () {
                    var _this = this;
                    this.Input.OrderBy(function (a, b) { return _this.fact * (a.Owner.Client.Name || "").localeCompare(b.Owner.Client.Name || ""); });
                    this.fact *= -1;
                };
                ListOfArticles.prototype.OrderByProduct = function () {
                    var _this = this;
                    this.Input.OrderBy(function (a, b) { return _this.fact * (a.Product || "").toString().localeCompare(b.Product || "").toString(); });
                    this.fact *= -1;
                };
                ListOfArticles.prototype.OrderByQte = function () {
                    var _this = this;
                    this.Input.OrderBy(function (a, b) { return _this.fact * (a.Count - b.Count); });
                    this.fact *= -1;
                };
                ListOfArticles.prototype.OrderByPSel = function () {
                    var _this = this;
                    this.Input.OrderBy(function (a, b) { return _this.fact * (a.PSel - b.PSel); });
                    this.fact *= -1;
                };
                ListOfArticles.prototype.OrderByPVente = function () {
                    var _this = this;
                    this.Input.OrderBy(function (a, b) { return _this.fact * (a.Price - b.Price); });
                    this.fact *= -1;
                };
                ListOfArticles.prototype.OrderByModifiedDate = function () {
                    var _this = this;
                    this.Input.OrderBy(function (a, b) { return _this.fact * (Common_2.funcs.toNum(a.Owner.LastModified) - Common_2.funcs.toNum(b.Owner.LastModified)); });
                    this.fact *= -1;
                };
                ListOfArticles.prototype.OrderByFactureDate = function () {
                    var _this = this;
                    this.Input.OrderBy(function (a, b) { return _this.fact * ((a.Owner.Date || ddate).getTime() - (b.Owner.Date || ddate).getTime()); });
                    this.fact *= -1;
                };
                ListOfArticles.prototype.Open = function () {
                    ListOfArticles.modal.Open();
                };
                ListOfArticles.Open = function () {
                    this.Default.Open();
                };
                ListOfArticles.OpenQuery = function () {
                    return this.Default.query.Open();
                };
                ListOfArticles.prototype.OnKeyDown = function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (this.table.OnKeyDown(e))
                        return true;
                    _super.prototype.OnKeyDown.call(this, e);
                };
                Object.defineProperty(ListOfArticles, "Default", {
                    get: function () {
                        var _this = this;
                        if (!this._default) {
                            ListOfArticles._default = new ListOfArticles(new ProduitStat(GData.__data.Costumers, 'Client'));
                            this.modal = new UI_9.UI.Modal();
                            this.modal.OnInitialized = function (m) {
                                _this.modal.Content = _this._default;
                                _this.modal.setWidth('90%');
                            };
                        }
                        return ListOfArticles._default;
                    },
                    enumerable: true,
                    configurable: true
                });
                ListOfArticles.prototype.OpenFacture = function (e, dt, scop, x) {
                    var art = scop.Value || this.table.SelectedItem;
                    if (!art)
                        return;
                    Corelib_5.Api.RiseApi('OpenFacture', {
                        data: art.Owner, callback: function (p, x) {
                            ListOfArticles.modal.Close(UI_9.UI.MessageResult.Exit);
                        }
                    });
                };
                return ListOfArticles;
            }(UI_9.UI.Paginator));
            Views.ListOfArticles = ListOfArticles;
            var ListOfFakePrices = (function (_super) {
                __extends(ListOfFakePrices, _super);
                function ListOfFakePrices(query) {
                    var _this = _super.call(this, 7, undefined, true) || this;
                    _this.query = query;
                    _this.fact = 1;
                    query.List = _this;
                    return _this;
                }
                Object.defineProperty(ListOfFakePrices.prototype, "DealerTitle", {
                    get: function () { return this.query.DealerTitle; },
                    enumerable: true,
                    configurable: true
                });
                ListOfFakePrices.prototype.Execute = function (q) {
                    var _this = this;
                    GData.requester.Costume({ Url: __global.ApiServer.Combine('/_/pstat/ArticlesSolded').FullPath + '?' + q, HasBody: false, Method: Corelib_5.net.WebRequestMethod.Get }, new Models_17.models.FakePrices(null), {}, function (pc, data, s, req) {
                        _this.Open();
                        _this.OnInitialized = function (n) {
                            n.table.OnInitialized = function (t) {
                                pc.data.FromJson(data, Corelib_5.encoding.SerializationContext.GlobalContext);
                                _this.Input = pc.data;
                            };
                        };
                    }, this);
                    this.Open();
                };
                ListOfFakePrices.prototype.initialize = function () {
                    var _this = this;
                    _super.prototype.initialize.call(this);
                    this.table = new script_2.Material.HeavyTable(data_1.data.value.ProductStatDef1.def);
                    this.OnInitialized = function (p) {
                        _this.table.OnInitialized = function (l) {
                            l.Source = p.Output;
                            p.OnPropertyChanged(UI_9.UI.Paginator.DPOutput, function (s, e) { _this.table.Source = e._new; });
                        };
                        _this.Content = _this.table;
                    };
                };
                ListOfFakePrices.prototype.OrderByDealer = function () {
                    var _this = this;
                    this.Input.OrderBy(function (a, b) { return _this.fact * (a.Facture.Fournisseur.Name || "").localeCompare(b.Facture.Fournisseur.Name || ""); });
                    this.fact *= -1;
                };
                ListOfFakePrices.prototype.OrderByProduct = function () {
                    var _this = this;
                    this.Input.OrderBy(function (a, b) { return _this.fact * (a.Product || "").toString().localeCompare(b.Product || "").toString(); });
                    this.fact *= -1;
                };
                ListOfFakePrices.prototype.OrderByQte = function () {
                    var _this = this;
                    this.Input.OrderBy(function (a, b) { return _this.fact * (a.Qte - b.Qte); });
                    this.fact *= -1;
                };
                ListOfFakePrices.prototype.OrderByPSel = function () {
                    var _this = this;
                    this.Input.OrderBy(function (a, b) { return _this.fact * (a.PSel - b.PSel); });
                    this.fact *= -1;
                };
                ListOfFakePrices.prototype.OrderByPVente = function () {
                    var _this = this;
                    this.Input.OrderBy(function (a, b) { return _this.fact * (a.Value - b.Value); });
                    this.fact *= -1;
                };
                ListOfFakePrices.prototype.OrderByModifiedDate = function () {
                    var _this = this;
                    this.Input.OrderBy(function (a, b) { return _this.fact * (Common_2.funcs.toNum(a.Facture.LastModified) - Common_2.funcs.toNum(b.Facture.LastModified)); });
                    this.fact *= -1;
                };
                ListOfFakePrices.prototype.OrderByFactureDate = function () {
                    var _this = this;
                    this.Input.OrderBy(function (a, b) { return _this.fact * ((a.Facture.Date || ddate).getTime() - (b.Facture.Date || ddate).getTime()); });
                    this.fact *= -1;
                };
                ListOfFakePrices.prototype.Open = function () {
                    ListOfFakePrices.modal.Open();
                };
                ListOfFakePrices.OpenQuery = function () {
                    return this.Default.query.Open();
                };
                ListOfFakePrices.Open = function () {
                    this.Default.Open();
                };
                ListOfFakePrices.prototype.OnKeyDown = function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (this.table.OnKeyDown(e))
                        return true;
                    _super.prototype.OnKeyDown.call(this, e);
                };
                Object.defineProperty(ListOfFakePrices, "Default", {
                    get: function () {
                        var _this = this;
                        if (!this._default) {
                            this._default = new ListOfFakePrices(new ProduitStat(GData.__data.Fournisseurs, 'Fournisseur'));
                            this.modal = new UI_9.UI.Modal();
                            this.modal.OnInitialized = function (m) {
                                _this.modal.Content = _this._default;
                                _this.modal.setWidth('90%');
                            };
                        }
                        return this._default;
                    },
                    enumerable: true,
                    configurable: true
                });
                ListOfFakePrices.prototype.OpenFacture = function (e, dt, scop, x) {
                    var art = scop.Value || this.table.SelectedItem;
                    if (!art)
                        return;
                    Corelib_5.Api.RiseApi('OpenSFacture', {
                        data: art.Facture, callback: function (p, x) {
                            ListOfFakePrices.modal.Close(UI_9.UI.MessageResult.Exit);
                        }
                    });
                };
                ListOfFakePrices.modal = new UI_9.UI.Modal();
                return ListOfFakePrices;
            }(UI_9.UI.Paginator));
            Views.ListOfFakePrices = ListOfFakePrices;
        })(Views = Statistique.Views || (Statistique.Views = {}));
    })(Statistique = exports.Statistique || (exports.Statistique = {}));
    window['Statistics'] = Statistique;
    window['Test'] = function () {
        return Statistique.Views.ProduitStat;
    };
    var ddate = new Date();
});
define("Desktop/Admin/Facture", ["require", "exports", "../../lib/Q/sys/UI", "../../lib/Q/sys/Corelib", "abstract/extra/Common", "abstract/Models", "abstract/extra/Basics", "../../lib/Q/components/HeavyTable/script", "Componenets/Forms", "Componenets/PStat", "assets/data/data"], function (require, exports, UI_10, Corelib_6, Common_3, Models_18, Basics_7, script_3, Forms_1, PStat_1, data_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GData;
    Common_3.GetVars(function (v) {
        GData = v;
        return false;
    });
    var userAbonment = Corelib_6.bind.NamedScop.Get('UserAbonment');
    var FactureAchat = (function (_super) {
        __extends(FactureAchat, _super);
        function FactureAchat() {
            var _this = _super.call(this, 'facture_achat', 'Facture D\'<b><u>A</u></b>chat', 'SFacture.view', null, false) || this;
            _this.sfs = new FactureService(_this, "SFacturePrinter");
            return _this;
        }
        FactureAchat.prototype.GetLastArticlePrice = function () {
            Corelib_6.Api.RiseApi('getLastArticlePrice', {
                data: { Dealer: this.Data.Fournisseur, Product: this.adapter.SelectedItem.Product, Before: this.Data.Date, IsAchat: true },
                callback: function (a, prc) {
                    if (prc)
                        UI_10.UI.InfoArea.push("Le dernie revage est " + prc);
                    else
                        UI_10.UI.InfoArea.push("Le Produit n'est pas acheter");
                }
            });
        };
        FactureAchat.prototype.OnAbonmentChanged = function (b, o, n) {
            throw new Error("Method not implemented.");
        };
        FactureAchat.prototype.CalculateBenifite = function () {
            var t = this.Data && this.Data.Articles.AsList();
            if (!t)
                return;
            var b = 0, tt = 0;
            for (var i = 0; i < t.length; i++) {
                var a = t[i];
                if (!a)
                    continue;
                b += (a.Value - a.PSel) * a.Qte;
                tt += a.PSel * a.Qte;
            }
            UI_10.UI.InfoArea.push('<h3 >Benefit est :</h3><h1>' + b + 'DA  </h1><br><h3 >Precentage est :</h3><h1 style="color:yellow">' + (b / tt) * 100 + '%  </h1>');
        };
        FactureAchat.prototype.OpenPrdStatistics = function () {
            var q = PStat_1.Statistique.Views.ListOfFakePrices.OpenQuery();
            var a = this.adapter.SelectedItem;
            var d = this.Data;
            q.OnInitialized = function (n) {
                if (a)
                    n.SelectedProduct = a.Product;
                if (d)
                    n.SelectedDealer = d.Fournisseur;
            };
        };
        FactureAchat.prototype.OpenPrdStatisticsRslt = function () {
            PStat_1.Statistique.Views.ListOfFakePrices.Open();
        };
        FactureAchat.prototype.ReglerFacture = function () {
            this.verser(true);
        };
        FactureAchat.prototype.LoadArticles = function () {
            if (this.Data)
                if (!this.Data.IsOpen)
                    if (this.Data.Articles == null || !this.Data.Articles.Stat) {
                        GData.apis.SFacture.UpdateArticlesOf(this.Data, null);
                    }
        };
        FactureAchat.prototype.OpenInfo = function () {
            var data = this.Data;
            var bk = data.CreateBackup();
            Corelib_6.Api.RiseApi('OpenSFactureInfo', {
                callback: function (p, da) {
                    if (da.iss && da.data.IsOpen)
                        GData.requester.Request(Models_18.models.SFacture, "SetInfo", da.data, da.data, function (r, j, i) {
                            da.data[i ? 'Commit' : 'Rollback'](bk);
                        });
                    else
                        da.data.Rollback(bk);
                },
                data: data,
            });
        };
        FactureAchat.prototype.Update = function () {
            var _this = this;
            UI_10.UI.Modal.ShowDialog("Update", "Do you want realy to update this facture from server", function (e) {
                if (e.Result === UI_10.UI.MessageResult.ok) {
                    GData.apis.SFacture.UpdateArticlesOf(_this.Data, function (e) { GData.apis.SFacture.Update(_this.Data); });
                }
            });
        };
        FactureAchat.prototype.AddNewArticle = function () {
            var _this = this;
            var data = this.adapter.Data;
            if (data.IsOpen)
                GData.apis.Revage.New(function (e) {
                    var art = e.Data;
                    if (e.Error !== Basics_7.basics.DataStat.Success)
                        return UI_10.UI.InfoArea.push("UnExpected Error");
                    art.Facture = data;
                    var editCallback = function (e) {
                        if (e.Error === Corelib_6.basic.DataStat.Success) {
                            data.Recalc();
                            data.Articles.Add(e.Data);
                            _this.adapter.SelectItem(e.Data);
                        }
                        else
                            e.Data.Dispose();
                    };
                    _this.edit(art, editCallback);
                });
        };
        FactureAchat.prototype.SaveFacture = function () {
            Corelib_6.Api.RiseApi("SaveSFacture", {
                data: this.Data
            });
        };
        FactureAchat.prototype.DeleteArticle = function () {
            var d = this.adapter.Data;
            if (!d || !d.IsOpen)
                return;
            var c = this.adapter.SelectedItem;
            if (c == null)
                UI_10.UI.InfoArea.push("select an article to delete");
            var p = c.Product;
            var arts = d.GetValue(Models_18.models.SFacture.DPArticles);
            var tt;
            UI_10.UI.Modal.ShowDialog('Confirmation', 'Do you want to remove this Article <br>' + (p || '').toString(), function (xx) {
                if (xx.Result === UI_10.UI.MessageResult.ok) {
                    GData.apis.Revage.Delete(c, function (e) {
                        if (e.Error == Corelib_6.basic.DataStat.Success) {
                            d.Recalc();
                            arts.Remove(c);
                        }
                    });
                }
            }, 'DELETE', 'Cancel');
        };
        FactureAchat.prototype.edit = function (art, callback) {
            var _this = this;
            if (art || this.adapter.SelectedItem)
                GData.apis.Revage.Show(art || this.adapter.SelectedItem, function (e) {
                    if (e.Error == Corelib_6.basic.DataStat.Success)
                        _this.Data.Recalc();
                    callback && callback(e);
                }, this.Data.IsOpen);
        };
        FactureAchat.prototype.GetLeftBar = function () {
            var _this = this;
            var l = this.sfs.GetLeftBar();
            l.OnInitialized = function (l) { return _this.sfs.ShowFournisseur(); };
            return l;
        };
        FactureAchat.prototype.GetRightBar = function () {
            return this.sfs.GetRightBar();
        };
        FactureAchat.prototype.OnContextMenuFired = function (r, selected) {
            if (selected === 'Ouvrir' || selected === 'Supprimer')
                this.OpenVersments(selected === 'Supprimer');
            else if (selected === 'Regler' || selected === 'Verser')
                this.verser(selected === 'Regler');
        };
        FactureAchat.prototype.verser = function (regler) {
            var data = this.Data;
            if (!data)
                return UI_10.UI.Modal.ShowDialog("ERROR", "Selecter une facture pour ajouter une versment");
            if (regler)
                return GData.apis.SVersment.Regler(data, data.Client);
            GData.apis.SVersment.VerserTo(data, data.Fournisseur);
        };
        FactureAchat.prototype.OpenVersments = function (forDelete) {
            var data = this.Data;
            if (data)
                GData.apis.SVersment.OpenSVersmentsOfFacture(data, function (results, selected, fournisseur, success) {
                    data.Recalc(results);
                    if (success && forDelete) {
                        if (selected) {
                            UI_10.UI.Modal.ShowDialog("Confirmation", "Voulez- vous vraiment supprimer ce veremnet", function (xx) {
                                if (xx.Result === UI_10.UI.MessageResult.ok)
                                    GData.apis.SVersment.Delete(selected, function (e) {
                                        if (e.Error === Basics_7.basics.DataStat.Success) {
                                            UI_10.UI.InfoArea.push("Ce Virement Est bien Supprimé", true, 5000);
                                        }
                                        else {
                                            UI_10.UI.InfoArea.push("Une erreur s'est produite lorsque nous avons supprimé cette version", true, 5000);
                                        }
                                    });
                            }, "Supprimer", "Annuler");
                        }
                        else
                            UI_10.UI.InfoArea.push("Vous ne sélectionnez aucun Virement");
                    }
                });
            else {
                UI_10.UI.InfoArea.push("You Must Set first the client");
            }
        };
        FactureAchat.prototype.OpenStatistics = function () {
            this.OpenPrdStatistics();
        };
        FactureAchat.prototype.OpenMails = function () { };
        FactureAchat.prototype.NewProduct = function () {
            var _this = this;
            var data = this.Data;
            GData.apis.Product.CreateNew(function (e) {
                if (e.Error != Corelib_6.basic.DataStat.Success)
                    return;
                var product = e.Data;
                if (data && data.IsOpen)
                    GData.apis.Revage.New(function (e) {
                        if (e.Error !== Corelib_6.basic.DataStat.Success)
                            return;
                        var art = e.Data;
                        art.Facture = data;
                        art.Product = product;
                        art.Qte = 0;
                        _this.edit(art, function (e) {
                            if (e.Error === Corelib_6.basic.DataStat.Success) {
                                data.Articles.Add(e.Data);
                                _this.adapter.SelectItem(e.Data);
                            }
                            else
                                e.Data.Dispose();
                        });
                    });
            });
        };
        FactureAchat.prototype.SelectFournisseur = function () {
            var _this = this;
            var facture = this.Data;
            if (!facture.IsOpen)
                return UI_10.UI.InfoArea.push("La facture est fermer");
            GData.apis.Fournisseur.Select(function (e) {
                if (e.Error == Corelib_6.basic.DataStat.Success) {
                    if (!e.Data)
                        return Corelib_6.thread.Dispatcher.call(_this, _this.SelectFournisseur);
                    if (e.Data != facture.Fournisseur)
                        GData.requester.Request(Models_18.models.SFacture, "SetProperty", null, { Property: "Fournisseur", Id: facture.Id, Value: e.Data.Id }, function (r, j, i) {
                            if (i)
                                facture.Fournisseur = e.Data;
                        });
                }
            }, this.Data.Fournisseur);
        };
        FactureAchat.prototype.SelectAchteur = function (onSuccessCallback) {
            var _this = this;
            var facture = this.Data;
            if (!facture.IsOpen)
                return UI_10.UI.InfoArea.push("La facture est fermer");
            var dt = facture.GetValue(Models_18.models.SFacture.DPAchteur);
            GData.apis.Agent.Select(function (e) {
                var achteur = e.Data;
                if (e.Error === Corelib_6.basic.DataStat.Success) {
                    if (!achteur)
                        return _this.SelectFournisseur();
                    if (achteur != facture.Achteur)
                        GData.requester.Request(Models_18.models.SFacture, "SetProperty", null, { Property: "Achteur", Id: facture.Id, Value: achteur.Id }, function (r, j, i) {
                            if (i)
                                facture.Achteur = achteur;
                        });
                }
            }, dt);
        };
        FactureAchat.prototype.Validate = function () {
            Corelib_6.Api.RiseApi("ValidateSFacture", {
                data: this.Data
            });
        };
        FactureAchat.prototype.GenerateTickets = function () {
            var _this = this;
            if (this._tickets)
                this._tickets.Clear().From(this.Data);
            else {
                this._tickets = Models_18.models.Tickets.From(this.Data, this._tickets);
                this.mdl_tickets = new UI_10.UI.Modal();
                this.mdl_tickets.SetDialog("Tickets Generator", this.createTicketTable(this._tickets));
                this.mdl_tickets.OnClosed.Add(function (e) {
                    if (e.Result === UI_10.UI.MessageResult.ok)
                        _this.onPrint(_this._tickets, false);
                });
                this.mdl_tickets.OnInitialized = function (n) { return n.setWidth('90%'); };
            }
            this.mdl_tickets.Open();
        };
        FactureAchat.prototype.Print = function (model) {
            if (model === "Tickets") {
                this.GenerateTickets();
            }
            else {
                this.PrintModel(model, undefined);
            }
        };
        FactureAchat.prototype.Delete = function () {
            Corelib_6.Api.RiseApi("DeleteSFacture", { data: this.Data });
        };
        FactureAchat.prototype.New = function () {
            Corelib_6.Api.RiseApi('NewSFacture', { data: null, callback: function (p, f) { } });
        };
        FactureAchat.prototype.OnBringIntoFront = function () {
            var _this = this;
            var d = this.adapter.Data;
            if (d == null) {
                UI_10.UI.Modal.ShowDialog(this.Caption, 'There no facture selected do you want to create a new one', function (xx) {
                    if (xx.Result === UI_10.UI.MessageResult.ok) {
                        _this.New();
                    }
                    else {
                        var p = _this.parent;
                        p.Select('facture_fournisseurs');
                    }
                }, 'Create New', 'Cancel');
            }
            this.abonment.Box.Enable = true;
            userAbonment.Value = Models_18.models.Abonment.Detaillant;
            this.abonment.Box.Disable(true);
        };
        FactureAchat.prototype.createTicketTable = function (t) {
            var x = new script_3.Material.HeavyTable(data_2.data.value.ticketTableDef.def);
            x.Source = t.Values;
            return x;
        };
        FactureAchat.prototype.onPrint = function (p, isn) {
            var data = new Models_18.Printing.PrintData();
            data.HandlerId = "SFacturePrinter";
            data.DataId = this.Data.Id;
            data.Model = "Tickets";
            data.Data = p;
            GData.requester.Request(Models_18.Printing.PrintData, "PRINT", data, null, function (a, b, c) {
                var d = a.data;
                if (d.Response && d.Response.Success) {
                    var url = __global.ApiServer.Combine('/_/$').FullPath + '?Id=' + d.Response.FileName;
                    Forms_1.Forms.PDFViewer.Show(url);
                }
            }, null, null, this);
            return false;
        };
        FactureAchat.prototype.PrintModel = function (format, dt) {
            var data = new Models_18.Printing.PrintData();
            data.HandlerId = "SFacturePrinter";
            data.DataId = this.Data.Id;
            data.Model = format;
            data.Data = dt;
            GData.requester.Request(Models_18.Printing.PrintData, "PRINT", data, null, function (a, b, c) {
                var d = a.data;
                if (d.Response && d.Response.Success) {
                    var url = __global.ApiServer.Combine('/_/$').FullPath + '?Id=' + d.Response.FileName;
                    Forms_1.Forms.PDFViewer.Show(url);
                }
            }, null, null, this);
            return false;
        };
        return FactureAchat;
    }(Common_3.Facture));
    exports.FactureAchat = FactureAchat;
    var FactureVent = (function (_super) {
        __extends(FactureVent, _super);
        function FactureVent() {
            var _this = _super.call(this, 'facture_vent', "Facture <b><u>V</u></b>ent", 'Facture.oview', null, false) || this;
            _this.fs = new FactureService(_this, "FacturePrinter");
            return _this;
        }
        FactureVent.prototype.GetLastArticlePrice = function () {
            GData.apis.Facture.GetLastArticlePrice(this.Data.Client, this.adapter.SelectedItem.Product, this.Data.Date, function (prc) {
                if (prc)
                    UI_10.UI.InfoArea.push("Le dernie revage est " + prc);
                else
                    UI_10.UI.InfoArea.push("Le Produit n'est pas acheter");
            });
        };
        FactureVent.prototype.CalculateBenifite = function () {
            var t = this.Data && this.Data.Articles.AsList();
            if (!t)
                return;
            var b = 0;
            var tt = 0;
            for (var i = 0; i < t.length; i++) {
                var a = t[i];
                if (!a)
                    continue;
                b += (a.Price - a.PSel) * a.Count;
                tt += a.Price * a.Count;
            }
            UI_10.UI.InfoArea.push('<h3 >Benefit est :</h3><h1>' + b + 'DA  </h1><br><h3 >Precentage est :</h3><h1 style="color:yellow">' + (b / tt) * 100 + '%  </h1>');
        };
        FactureVent.prototype.OpenPrdStatistics = function () {
            var q = PStat_1.Statistique.Views.ListOfArticles.OpenQuery();
            var a = this.adapter.SelectedItem;
            var d = this.Data;
            q.OnInitialized = function (n) {
                n.SelectedProduct = a.Product;
                n.SelectedDealer = d.Client;
            };
        };
        FactureVent.prototype.OpenPrdStatisticsRslt = function () {
            PStat_1.Statistique.Views.ListOfArticles.Open();
        };
        FactureVent.prototype.OpenInfo = function () {
            var d;
            var data = this.Data;
            var bk = data.CreateBackup();
            Corelib_6.Api.RiseApi('OpenFactureInfo', {
                callback: function (p, da) {
                    if (da.iss && da.data.IsOpen)
                        GData.requester.Request(Models_18.models.Facture, "SetInfo", da.data, da.data, function (r, j, i) {
                            da.data[i ? 'Commit' : 'Rollback'](bk);
                        });
                    else
                        da.data.Rollback(bk);
                },
                data: data,
            });
        };
        FactureVent.prototype.GenerateTickets = function () {
            throw new Error("Method not implemented.");
        };
        FactureVent.prototype.ReglerFacture = function () {
            this.verser(true);
        };
        FactureVent.prototype.LoadArticles = function () {
            if (this.Data)
                if (!this.Data.IsOpen)
                    if (this.Data.Articles == null || !this.Data.Articles.Stat) {
                        GData.apis.Facture.UpdateArticlesOf(this.Data, null);
                    }
        };
        FactureVent.prototype.OnPrint = function () {
            this.Print("Format1");
        };
        FactureVent.prototype.Update = function () {
            var _this = this;
            UI_10.UI.Modal.ShowDialog("Update", "Do you want realy to update this facture from server", function (e) {
                if (e.Result === UI_10.UI.MessageResult.ok) {
                    GData.apis.Facture.UpdateArticlesOf(_this.Data, function (e) {
                        GData.apis.Facture.Update(_this.Data);
                    });
                }
            });
        };
        FactureVent.prototype.edit = function (art, callback) {
            var _this = this;
            GData.apis.Article.Show(art || this.adapter.SelectedItem, function (e) {
                if (e.Error == Corelib_6.basic.DataStat.Success)
                    _this.Data.Recalc();
                callback && callback(e);
            }, this.Data.IsOpen);
        };
        FactureVent.prototype.initialize = function () {
            _super.prototype.initialize.call(this);
            this.Enable = true;
        };
        FactureVent.prototype.AddNewArticle = function () {
            var _this = this;
            var data = this.adapter.Data;
            if (data.IsOpen)
                GData.apis.Article.New(function (e) {
                    var revage = e.Data;
                    var t = e.Error;
                    if (t !== Basics_7.basics.DataStat.Success)
                        return UI_10.UI.InfoArea.push("UnExpected Error");
                    revage.Owner = data;
                    revage.Count = 1;
                    var db = revage.OnPropertyChanged(Models_18.models.Article.DPProduct, function (s, e) {
                        revage.PSel = (e._new && e._new.PSel) || 0;
                    });
                    _this.edit(revage, function (e) {
                        revage.removeEvent(Models_18.models.Article.DPProduct, db);
                        if (e.Error === Corelib_6.basic.DataStat.Success) {
                            data.Articles.Add(e.Data);
                            _this.Data.Recalc();
                            _this.adapter.SelectItem(e.Data);
                        }
                        else
                            e.Data.Dispose();
                    });
                });
        };
        FactureVent.prototype.SaveFacture = function () {
            var d = this.Data;
            if (!d)
                return UI_10.UI.InfoArea.push("There no facture selected");
            Corelib_6.Api.RiseApi("SaveFacture", {
                data: d
            });
        };
        FactureVent.prototype.DeleteArticle = function () {
            var _this = this;
            var d = this.adapter.Data;
            if (!d || !d.IsOpen)
                return;
            var c = this.adapter.SelectedItem;
            if (c == null)
                UI_10.UI.InfoArea.push("select an article to delete");
            var arts = d.GetValue(Models_18.models.Facture.DPArticles);
            UI_10.UI.Modal.ShowDialog('Confirmation', 'Do you want to remove this Article <br>' + (c.Product || '').toString(), function (xx) {
                if (xx.Result === UI_10.UI.MessageResult.ok) {
                    GData.requester.Request(Models_18.models.Article, "DELETE", c, c, function (d, j, i) {
                        if (i)
                            arts.Remove(c), _this.Data.Recalc();
                        else
                            UI_10.UI.InfoArea.push("L' article n'a pas supprimmer");
                    });
                }
            }, 'DELETE', 'Cancel');
        };
        FactureVent.prototype.GetLeftBar = function () {
            var _this = this;
            var l = this.fs.GetLeftBar();
            l.OnInitialized = function (l) { return _this.fs.HideFournisseur(); };
            return l;
        };
        FactureVent.prototype.GetRightBar = function () {
            return this.fs.GetRightBar();
        };
        FactureVent.prototype.verser = function (regler) {
            var data = this.Data;
            if (!data)
                return UI_10.UI.Modal.ShowDialog("ERROR", "Selecter une facture pour ajouter une versment");
            if (regler)
                return GData.apis.Versment.Regler(data, data.Client);
            GData.apis.Versment.VerserTo(data, data.Client);
        };
        FactureVent.prototype.OpenVersments = function (forDelete) {
            if (this.Data)
                GData.apis.Versment.OpenVersmentsOfFacture(this.Data, function (results, selected, fournisseur, success) {
                    if (success && forDelete) {
                        if (selected) {
                            UI_10.UI.Modal.ShowDialog("Confirmation", "Voulez- vous vraiment supprimer ce veremnet", function (xx) {
                                if (xx.Result === UI_10.UI.MessageResult.ok)
                                    GData.apis.Versment.Delete(selected, function (e) {
                                        if (e.Error === Basics_7.basics.DataStat.Success) {
                                            UI_10.UI.InfoArea.push("Ce Virement Est bien Supprimé", true, 5000);
                                        }
                                        else {
                                            UI_10.UI.InfoArea.push("Une erreur s'est produite lorsque nous avons supprimé cette version", true, 5000);
                                        }
                                    });
                            }, "Supprimer", "Annuler");
                        }
                        else
                            UI_10.UI.InfoArea.push("Vous ne sélectionnez aucun Virement");
                    }
                });
            else {
                UI_10.UI.InfoArea.push("You Must Set first the client");
            }
        };
        FactureVent.prototype.OpenStatistics = function () { this.OpenPrdStatistics(); };
        FactureVent.prototype.OpenMails = function () { };
        FactureVent.prototype.NewProduct = function () {
            var _this = this;
            var data = this.Data;
            GData.apis.Product.CreateNew(function (e) {
                if (e.Error != Corelib_6.basic.DataStat.Success)
                    return;
                var product = e.Data;
                if (data && data.IsOpen)
                    GData.apis.Article.New(function (e) {
                        var err = e.Error;
                        var art = e.Data;
                        if (err !== Corelib_6.basic.DataStat.Success)
                            return;
                        art.Owner = data;
                        art.Product = product;
                        art.Count = 1;
                        _this.edit(art, function (e) {
                            if (e.Error === Corelib_6.basic.DataStat.Success) {
                                _this.Data.Recalc();
                                data.Articles.Add(e.Data);
                                _this.adapter.SelectItem(e.Data);
                            }
                            else
                                e.Data.Dispose();
                        });
                    });
            });
        };
        FactureVent.prototype.SelectFournisseur = function () { };
        FactureVent.prototype.SelectAchteur = function () {
            var _this = this;
            var facture = this.Data;
            if (!facture.IsOpen)
                return UI_10.UI.InfoArea.push("La facture est fermer");
            var dt = facture.Client;
            GData.apis.Client.Select(function (e) {
                var client = e.Data;
                if (e.Error == Corelib_6.basic.DataStat.Success) {
                    if (!client)
                        return _this.SelectAchteur();
                    GData.requester.Request(Models_18.models.Facture, "SetProperty", null, { Property: "Client", Id: facture.Id, Value: client.Id }, function (r, j, i) {
                        if (i)
                            facture.Client = client;
                    });
                }
            }, this.Data.Client);
        };
        FactureVent.prototype.Validate = function () {
            Corelib_6.Api.RiseApi("ValidateFacture", { data: this.Data });
        };
        FactureVent.prototype.Print = function (model) {
            var data = new Models_18.Printing.PrintData();
            data.HandlerId = "FacturePrinter";
            data.DataId = this.Data.Id;
            data.Model = model;
            var self = this;
            GData.requester.Request(Models_18.Printing.PrintData, "PRINT", data, null, function (a, b, c) {
                var d = a.data;
                if (d.Response && d.Response.Success) {
                    var url = __global.ApiServer.Combine('/_/$').FullPath + '?Id=' + d.Response.FileName;
                    Forms_1.Forms.PDFViewer.Show(url);
                }
            }, null, null, this);
        };
        FactureVent.prototype.Delete = function () {
            Corelib_6.Api.RiseApi("DeleteFacture", { data: this.Data });
        };
        FactureVent.prototype.New = function () {
            var _this = this;
            GData.apis.Article.New(function (e) {
                if (e.Error == Basics_7.basics.DataStat.Success) {
                    _this.Data.Articles.Add(e.Data);
                    _this.Data.Recalc();
                }
                else
                    UI_10.UI.InfoArea.push("UnExpected  Error");
            });
        };
        FactureVent.prototype.OnBringIntoFront = function () {
            var _this = this;
            var d = this.adapter.Data;
            if (d == null) {
                UI_10.UI.Modal.ShowDialog('Facture De Livraison', 'There no facture selected do you want to create new one', function (xx) {
                    if (xx.Result === UI_10.UI.MessageResult.ok) {
                        _this.New();
                    }
                    else {
                        var p = _this.parent;
                        p.Select('facture_clientels');
                    }
                }, 'Create New', 'Cancel');
            }
            var v;
            if (d && d.Client)
                v = d.Client.Abonment;
            else
                v = 0;
            userAbonment.Value = v;
            this.abonment.Box.Enable = true;
            this.Enable = !!d;
        };
        FactureVent.prototype.OnAbonmentChanged = function (b, o, n) {
            var d = this.Data;
            if (!d)
                return;
            d.Abonment = n.Value;
        };
        return FactureVent;
    }(Common_3.Facture));
    exports.FactureVent = FactureVent;
    var abonEnum = Corelib_6.basic.getEnum('models.Abonment');
    var FactureService = (function () {
        function FactureService(target, printModeHandlerId) {
            this.target = target;
            this.printModeHandlerId = printModeHandlerId;
        }
        FactureService.prototype.GetLeftBar = function (factureModels) {
            var _this = this;
            if (!this.lb) {
                this._edit = new UI_10.UI.Glyph(UI_10.UI.Glyphs.edit, false, 'Edit');
                this._new = new UI_10.UI.Glyph(UI_10.UI.Glyphs.plusSign, false, 'New');
                this._delete = new UI_10.UI.Glyph(UI_10.UI.Glyphs.fire, false, 'Delete');
                this._acht = new UI_10.UI.Glyph(UI_10.UI.Glyphs.user, false, 'Achteur');
                this._forn = new UI_10.UI.Glyph(UI_10.UI.Glyphs.home, false, 'Fournisseur');
                this._creditCart = new UI_10.UI.Glyph(UI_10.UI.Glyphs.creditCard, false, 'Versments');
                this._stat = new UI_10.UI.Glyph(UI_10.UI.Glyphs.stats, false, 'Statistics');
                this._info = new UI_10.UI.Glyph(UI_10.UI.Glyphs.infoSign, false, 'Information');
                this._prod = new UI_10.UI.Glyph(UI_10.UI.Glyphs.rub, false, 'Insert New Product');
                this.lb = new UI_10.UI.Navbar();
                Common_3.funcs.setTepmlate(this.lb, this, this.handleSerices);
                this.rm = new UI_10.UI.RichMenu(undefined, ["Regler", "Verser", "Supprimer", "", "Ouvrir"], this._creditCart);
                GData.requester.Request(Models_18.Printing.PrintData, "MODELS", new Corelib_6.collection.List(String), { HandlerId: this.printModeHandlerId }, function (a, b, c) {
                    _this.printMenu = new UI_10.UI.RichMenu(undefined, a.data.AsList(), _this._print);
                }, null, null, this);
                this.lb.OnInitialized = function (n) { return n.AddRange([_this._new, _this._edit, _this._delete, Common_3.funcs.createSparator(), _this._forn, _this._acht, _this._creditCart, Common_3.funcs.createSparator(), _this._stat, _this._info, Common_3.funcs.createSparator(), Common_3.funcs.createSparator(), _this._prod]); };
            }
            return this.lb;
        };
        FactureService.prototype.GetRightBar = function () {
            var _this = this;
            if (!this.rb) {
                this._print = new UI_10.UI.Glyph(UI_10.UI.Glyphs.print, false, 'Print');
                this._save = new UI_10.UI.Glyph(UI_10.UI.Glyphs.floppyDisk, false, 'Save');
                this._valid = new UI_10.UI.Glyph(UI_10.UI.Glyphs.check, false, 'Validate');
                this.rb = new UI_10.UI.Navbar();
                Common_3.funcs.setTepmlate(this.rb, this, this.handleSerices);
                this.rb.OnInitialized = function (n) { return n.AddRange([_this._print, Common_3.funcs.createSparator(), _this._valid, _this._save]); };
            }
            return this.rb;
        };
        FactureService.prototype.handleSerices = function (s, e, p) {
            var c = UI_10.UI.Glyphs;
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
                    UI_10.UI.InfoArea.push("This Option need for money to activate");
                    return;
            }
        };
        FactureService.prototype.HideFournisseur = function () { this._forn.Visible = false; };
        FactureService.prototype.ShowFournisseur = function () { this._forn.Visible = true; };
        FactureService.prototype.OnContextMenuFired = function (r, selected) {
            if (selected === 'Ouvrir' || selected === 'Supprimer')
                this.target.OpenVersments(selected === 'Supprimer');
            else if (selected === 'Regler' || selected === 'Verser')
                this.target.verser(selected === 'Regler');
        };
        FactureService.prototype.OnPrintContextMenuFired = function (r, selected) {
            this.target.Print(selected);
        };
        return FactureService;
    }());
    var FacturesService = (function () {
        function FacturesService() {
        }
        FacturesService.prototype.GetRightBar = function () {
            var _this = this;
            if (!this.lb) {
                this._print = new UI_10.UI.Glyph(UI_10.UI.Glyphs.print, false, 'Print');
                this._open = new UI_10.UI.Glyph(UI_10.UI.Glyphs.open, false, 'Open');
                this._new = new UI_10.UI.Glyph(UI_10.UI.Glyphs.openFile, false, 'New');
                this.lb = new UI_10.UI.Navbar();
                var oldget = this.lb.getTemplate;
                this.lb.getTemplate = function (c) {
                    var e = oldget(new UI_10.UI.Anchore(c));
                    if (!c.Enable)
                        e.Enable = false;
                    return e;
                };
                this.lb.OnInitialized = function (n) { return n.AddRange([_this._print, _this._open, _this._new]); };
                this.lb.OnSelectedItem.On = function (u) {
                };
            }
            return this.lb;
        };
        FacturesService.prototype.GetLeftBar = function () {
            var _this = this;
            if (!this.rb) {
                this._update = new UI_10.UI.Glyph(UI_10.UI.Glyphs.banCircle, false, 'Update');
                this._validate = new UI_10.UI.Glyph(UI_10.UI.Glyphs.openFile, false, 'Validate');
                this._save = new UI_10.UI.Glyph(UI_10.UI.Glyphs.openFile, false, 'Save');
                this._delete = new UI_10.UI.Glyph(UI_10.UI.Glyphs.openFile, false, 'Delete');
                this.rb = new UI_10.UI.Navbar();
                var oldget = this.rb.getTemplate;
                this.rb.getTemplate = function (c) { return oldget(new UI_10.UI.Anchore(c)); };
                this.rb.OnInitialized = function (n) {
                    n.AddRange([_this._delete, Common_3.funcs.createSparator(), _this._save, _this._validate, _this._update]);
                };
            }
            return this.rb;
        };
        return FacturesService;
    }());
});
define("abstract/Models", ["require", "exports", "../lib/q/sys/Corelib", "../lib/q/sys/System", "../lib/Q/sys/UI"], function (require, exports, Corelib_7, System_8, UI_11) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DPIsLogged = Corelib_7.bind.DObject.CreateField("CheckLogging", Boolean, null, null, null, Corelib_7.bind.PropertyAttribute.NonSerializable);
    var models;
    (function (models) {
        var Job;
        (function (Job) {
            Job[Job["Detaillant"] = 0] = "Detaillant";
            Job[Job["Proffessional"] = 1] = "Proffessional";
            Job[Job["WGrossit"] = 2] = "WGrossit";
            Job[Job["Grossist"] = 2] = "Grossist";
            Job[Job["Entrepreneur"] = 3] = "Entrepreneur";
        })(Job = models.Job || (models.Job = {}));
        var Abonment;
        (function (Abonment) {
            Abonment[Abonment["Detaillant"] = 0] = "Detaillant";
            Abonment[Abonment["Proffessionnal"] = 1] = "Proffessionnal";
            Abonment[Abonment["DemiGrossist"] = 2] = "DemiGrossist";
            Abonment[Abonment["Grossist"] = 3] = "Grossist";
            Abonment[Abonment["Importateur"] = 4] = "Importateur";
            Abonment[Abonment["Exportateur"] = 5] = "Exportateur";
        })(Abonment = models.Abonment || (models.Abonment = {}));
        function get() {
            delete models.get;
            return DPIsLogged;
        }
        models.get = get;
        var VersmentType;
        (function (VersmentType) {
            VersmentType[VersmentType["Espece"] = 0] = "Espece";
            VersmentType[VersmentType["CCP"] = 1] = "CCP";
            VersmentType[VersmentType["CIB"] = 2] = "CIB";
            VersmentType[VersmentType["Cheque"] = 3] = "Cheque";
            VersmentType[VersmentType["EPay"] = 4] = "EPay";
            VersmentType[VersmentType["QPay"] = 5] = "QPay";
        })(VersmentType = models.VersmentType || (models.VersmentType = {}));
        var Validable = 0, UnValidable = 4096;
        var BonType;
        (function (BonType) {
            BonType[BonType["Bon"] = 2] = "Bon";
            BonType[BonType["Facture"] = 4] = "Facture";
            BonType[BonType["Devise"] = 4098] = "Devise";
            BonType[BonType["ProFormat"] = 4100] = "ProFormat";
        })(BonType = models.BonType || (models.BonType = {}));
        var TransactionType;
        (function (TransactionType) {
            TransactionType[TransactionType["Vente"] = 0] = "Vente";
            TransactionType[TransactionType["Neutre"] = 1] = "Neutre";
            TransactionType[TransactionType["Avoir"] = 2] = "Avoir";
        })(TransactionType = models.TransactionType || (models.TransactionType = {}));
        var FTransactionType;
        (function (FTransactionType) {
            FTransactionType[FTransactionType["Achat"] = 0] = "Achat";
            FTransactionType[FTransactionType["Neutre"] = 1] = "Neutre";
            FTransactionType[FTransactionType["Avoir"] = 2] = "Avoir";
        })(FTransactionType = models.FTransactionType || (models.FTransactionType = {}));
        var AgentPermissions;
        (function (AgentPermissions) {
            AgentPermissions[AgentPermissions["None"] = 0] = "None";
            AgentPermissions[AgentPermissions["Agent"] = 1] = "Agent";
            AgentPermissions[AgentPermissions["Vendeur"] = 3] = "Vendeur";
            AgentPermissions[AgentPermissions["Achteur"] = 5] = "Achteur";
            AgentPermissions[AgentPermissions["Cassier"] = 9] = "Cassier";
            AgentPermissions[AgentPermissions["Validateur"] = 17] = "Validateur";
            AgentPermissions[AgentPermissions["Admin"] = -1] = "Admin";
        })(AgentPermissions = models.AgentPermissions || (models.AgentPermissions = {}));
        var Quality;
        (function (Quality) {
            Quality[Quality["None"] = 0] = "None";
            Quality[Quality["Low"] = 1] = "Low";
            Quality[Quality["Medium"] = 2] = "Medium";
            Quality[Quality["High"] = 3] = "High";
        })(Quality = models.Quality || (models.Quality = {}));
        var SMS = (function (_super) {
            __extends(SMS, _super);
            function SMS() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            SMS.prototype.getStore = function () {
                return SMS.store;
            };
            SMS.prototype.Update = function () {
            };
            SMS.prototype.Upload = function () {
            };
            Object.defineProperty(SMS.prototype, "From", {
                get: function () { return this.get(SMS.DPFrom); },
                set: function (v) { this.set(SMS.DPFrom, v); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SMS.prototype, "To", {
                get: function () { return this.get(SMS.DPTo); },
                set: function (v) { this.set(SMS.DPTo, v); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SMS.prototype, "IsReaded", {
                get: function () { return this.get(SMS.DPIsReaded); },
                set: function (v) { this.set(SMS.DPIsReaded, v); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SMS.prototype, "Title", {
                get: function () { return this.get(SMS.DPTitle); },
                set: function (v) { this.set(SMS.DPTitle, v); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SMS.prototype, "Message", {
                get: function () { return this.get(SMS.DPMessage); },
                set: function (v) { this.set(SMS.DPMessage, v); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SMS.prototype, "Date", {
                get: function () { return this.get(SMS.DPDate); },
                set: function (v) { this.set(SMS.DPDate, v); },
                enumerable: true,
                configurable: true
            });
            SMS.__fields__ = function () { return [this.DPFrom, this.DPTo, this.DPIsReaded, this.DPTitle, this.DPMessage, this.DPDate]; };
            SMS.ctor = function () {
                this.DPFrom = Corelib_7.bind.DObject.CreateField("From", models.Client, null, null, null, Corelib_7.bind.PropertyAttribute.SerializeAsId);
                this.DPTo = Corelib_7.bind.DObject.CreateField("To", models.Client, null, null, null, Corelib_7.bind.PropertyAttribute.SerializeAsId);
                this.DPIsReaded = Corelib_7.bind.DObject.CreateField("IsReaded", Boolean);
                this.DPTitle = Corelib_7.bind.DObject.CreateField("Title", String);
                this.DPMessage = Corelib_7.bind.DObject.CreateField("Message", String);
                this.DPDate = Corelib_7.bind.DObject.CreateField("Date", Date);
            };
            SMS.store = new Corelib_7.collection.Dictionary("sms");
            return SMS;
        }(System_8.sdata.QShopRow));
        models.SMS = SMS;
        var SMSs = (function (_super) {
            __extends(SMSs, _super);
            function SMSs(category, Tag) {
                var _this = _super.call(this, null, models.SMS, function (id) { return new models.SMS(id); }) || this;
                _this.category = category;
                _this.Tag = Tag;
                return _this;
            }
            Object.defineProperty(SMSs.prototype, "ArgType", {
                get: function () { return models.SMS; },
                enumerable: true,
                configurable: true
            });
            SMSs.prototype.getArgType = function (json) { return models.SMS; };
            SMSs.prototype.GetType = function () { return SMSs; };
            return SMSs;
        }(System_8.sdata.DataTable));
        models.SMSs = SMSs;
    })(models = exports.models || (exports.models = {}));
    (function (models) {
        var sfpStore = new Corelib_7.collection.Dictionary("sfactures", false);
        var SiegeSocial = (function (_super) {
            __extends(SiegeSocial, _super);
            function SiegeSocial() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Object.defineProperty(SiegeSocial.prototype, "Address", {
                get: function () { return this.get(SiegeSocial.DPAddress); },
                set: function (v) { this.set(SiegeSocial.DPAddress, v); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SiegeSocial.prototype, "Ville", {
                get: function () { return this.get(SiegeSocial.DPVille); },
                set: function (v) { this.set(SiegeSocial.DPVille, v); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SiegeSocial.prototype, "CodePostal", {
                get: function () { return this.get(SiegeSocial.DPCodePostal); },
                set: function (v) { this.set(SiegeSocial.DPCodePostal, v); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SiegeSocial.prototype, "SiteWeb", {
                get: function () { return this.get(SiegeSocial.DPSiteWeb); },
                set: function (v) { this.set(SiegeSocial.DPSiteWeb, v); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SiegeSocial.prototype, "Email", {
                get: function () { return this.get(SiegeSocial.DPEmail); },
                set: function (v) { this.set(SiegeSocial.DPEmail, v); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SiegeSocial.prototype, "Tel", {
                get: function () { return this.get(SiegeSocial.DPTel); },
                set: function (v) { this.set(SiegeSocial.DPTel, v); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SiegeSocial.prototype, "Mobile", {
                get: function () { return this.get(SiegeSocial.DPMobile); },
                set: function (v) { this.set(SiegeSocial.DPMobile, v); },
                enumerable: true,
                configurable: true
            });
            SiegeSocial.__fields__ = function () { return [this.DPAddress, this.DPVille, this.DPCodePostal, this.DPSiteWeb, this.DPEmail, this.DPTel, this.DPMobile]; };
            SiegeSocial.ctor = function () {
                this.DPAddress = Corelib_7.bind.DObject.CreateField("Address", String);
                this.DPVille = Corelib_7.bind.DObject.CreateField("Ville", String);
                this.DPCodePostal = Corelib_7.bind.DObject.CreateField("CodePostal", String);
                this.DPSiteWeb = Corelib_7.bind.DObject.CreateField("SiteWeb", String);
                this.DPEmail = Corelib_7.bind.DObject.CreateField("Email", String);
                this.DPTel = Corelib_7.bind.DObject.CreateField("Tel", String);
                this.DPMobile = Corelib_7.bind.DObject.CreateField("Mobile", String);
            };
            return SiegeSocial;
        }(System_8.sdata.QShopRow));
        models.SiegeSocial = SiegeSocial;
        var Shop = (function (_super) {
            __extends(Shop, _super);
            function Shop() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Object.defineProperty(Shop.prototype, "RIB", {
                get: function () { return this.get(Shop.DPRIB); },
                set: function (v) { this.set(Shop.DPRIB, v); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Shop.prototype, "NRC", {
                get: function () { return this.get(Shop.DPNRC); },
                set: function (v) { this.set(Shop.DPNRC, v); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Shop.prototype, "NIF", {
                get: function () { return this.get(Shop.DPNIF); },
                set: function (v) { this.set(Shop.DPNIF, v); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Shop.prototype, "NCompte", {
                get: function () { return this.get(Shop.DPNCompte); },
                set: function (v) { this.set(Shop.DPNCompte, v); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Shop.prototype, "CapitalSocial", {
                get: function () { return this.get(Shop.DPCapitalSocial); },
                set: function (v) { this.set(Shop.DPCapitalSocial, v); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Shop.prototype, "NAI", {
                get: function () { return this.get(Shop.DPNAI); },
                set: function (v) { this.set(Shop.DPNAI, v); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Shop.prototype, "NIS", {
                get: function () { return this.get(Shop.DPNIS); },
                set: function (v) { this.set(Shop.DPNIS, v); },
                enumerable: true,
                configurable: true
            });
            Shop.__fields__ = function () { return [this.DPRIB, this.DPNRC, this.DPNIF, this.DPNCompte, this.DPCapitalSocial, this.DPNAI, this.DPNIS]; };
            Shop.ctor = function () {
                this.DPRIB = Corelib_7.bind.DObject.CreateField("RIB", String);
                this.DPNRC = Corelib_7.bind.DObject.CreateField("NRC", String);
                this.DPNIF = Corelib_7.bind.DObject.CreateField("NIF", String);
                this.DPNCompte = Corelib_7.bind.DObject.CreateField("NCompte", String);
                this.DPCapitalSocial = Corelib_7.bind.DObject.CreateField("CapitalSocial", String);
                this.DPNAI = Corelib_7.bind.DObject.CreateField("NAI", String);
                this.DPNIS = Corelib_7.bind.DObject.CreateField("NIS", String);
            };
            return Shop;
        }(SiegeSocial));
        models.Shop = Shop;
        var Dealer = (function (_super) {
            __extends(Dealer, _super);
            function Dealer() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Dealer.__fields__ = function () {
                return [this.DPName, this.DPAvatar, this.DPObservation,
                    this.DPVersmentTotal, this.DPMontantTotal, this.DPNFactures, this.DPSoldTotal];
            };
            Object.defineProperty(Dealer.prototype, "SoldTotal", {
                get: function () { return this.get(Dealer.DPSoldTotal); },
                enumerable: true,
                configurable: true
            });
            Dealer.ctor = function () {
                this.DPName = Corelib_7.bind.DObject.CreateField("Name", String);
                this.DPAvatar = Corelib_7.bind.DObject.CreateField("Avatar", String);
                Dealer.DPObservation = Corelib_7.bind.DObject.CreateField('Observation', String);
                Dealer.DPVersmentTotal = Corelib_7.bind.DObject.CreateField('VersmentTotal', Number, null, calcSold);
                Dealer.DPMontantTotal = Corelib_7.bind.DObject.CreateField('MontantTotal', Number, null, calcSold);
                Dealer.DPNFactures = Corelib_7.bind.DObject.CreateField('NFactures', Number, null);
                Dealer.DPSoldTotal = Corelib_7.bind.DObject.CreateField('SoldTotal', Number, 0, null, null, Corelib_7.bind.PropertyAttribute.Private);
            };
            return Dealer;
        }(Shop));
        models.Dealer = Dealer;
        function calcSold(e) {
            e.__this.SetValue(Dealer.DPSoldTotal, (e.__this.MontantTotal || 0) - (e.__this.VersmentTotal || 0));
        }
        var Picture = (function (_super) {
            __extends(Picture, _super);
            function Picture(id, url) {
                var _this = _super.call(this, id) || this;
                _this._region = new Corelib_7.basic.Rectangle();
                _this.ImageUrl = url;
                return _this;
            }
            Picture.__fields__ = function () { return [Picture.DPImageUrl]; };
            Object.defineProperty(Picture.prototype, "Region", {
                get: function () {
                    return this._region;
                },
                enumerable: true,
                configurable: true
            });
            Picture.getById = function (id, type) {
                return Picture.pstore.Get(id);
            };
            Picture.prototype.getStore = function () { return Picture.pstore; };
            Picture.DPImageUrl = Corelib_7.bind.DObject.CreateField("ImageUrl", String, "");
            Picture.pstore = new Corelib_7.collection.Dictionary("Pictures", true);
            return Picture;
        }(System_8.sdata.QShopRow));
        models.Picture = Picture;
        var Pictures = (function (_super) {
            __extends(Pictures, _super);
            function Pictures(_parent, items) {
                return _super.call(this, _parent, Picture, function (id) { return new Picture(id); }, items) || this;
            }
            Object.defineProperty(Pictures.prototype, "ArgType", {
                get: function () { return Picture; },
                enumerable: true,
                configurable: true
            });
            Pictures.prototype.getArgType = function (json) { return Picture; };
            Pictures.prototype.GetType = function () { return Pictures; };
            return Pictures;
        }(System_8.sdata.DataTable));
        models.Pictures = Pictures;
        var FactureBase = (function (_super) {
            __extends(FactureBase, _super);
            function FactureBase() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            FactureBase.__fields__ = function () {
                return [
                    this.DPTotal,
                    this.DPDateLivraison,
                    this.DPDate,
                    this.DPEditeur,
                    this.DPValidator,
                    this.DPObservation,
                    this.DPLockedBy,
                    this.DPLockedAt,
                    this.DPType,
                    this.DPIsValidated, this.DPIsOpen, this.DPNArticles, this.DPRef, this.DPSold, this.DPVersment, this.DPTransaction
                ];
            };
            Object.defineProperty(FactureBase.prototype, "Factor", {
                get: function () { return this.Type < 4096 ? this.Transaction == models.TransactionType.Avoir ? -1 : 1 : 1; },
                enumerable: true,
                configurable: true
            });
            FactureBase.prototype.onTransactionChanging = function (e) {
                if (models.TransactionType[e._new] == undefined)
                    e._new = e._old || models.TransactionType.Vente;
                else
                    switch (this.Type) {
                        case models.BonType.Bon:
                        case models.BonType.Facture:
                            if (e._new == models.TransactionType.Neutre)
                                e._new = models.TransactionType.Vente;
                            break;
                        default:
                            if (e._new !== models.TransactionType.Neutre)
                                e._new = models.TransactionType.Neutre;
                            break;
                    }
            };
            FactureBase.prototype.SetFactureType = function (bonType, transaction) {
                bonType = bonType == undefined ? this.Type : bonType;
                transaction = transaction == undefined ? this.Transaction : transaction;
                if (bonType > 4096)
                    transaction = models.TransactionType.Neutre;
                else {
                    if (transaction == models.TransactionType.Neutre)
                        transaction = models.TransactionType.Vente;
                }
                this.set(FactureBase.DPTransaction, transaction);
                this.set(FactureBase.DPType, bonType);
            };
            FactureBase.prototype.factureTypeChanged = function (e) {
                if (e.prop === FactureBase.DPType)
                    this.SetFactureType(e._new, undefined);
                else
                    this.SetFactureType(undefined, e._new);
            };
            FactureBase.prototype.ClearVersments = function () {
                this.MakeChange(function () { var v = this.Versments; if (v)
                    v.Clear();
                else
                    this.Versments = this.createNewVersments(); }, this);
                return this.Versments;
            };
            FactureBase.prototype.IsFrozen = function () {
                return !this.IsOpen;
            };
            FactureBase.prototype.Freeze = function () {
                this.IsOpen = false;
            };
            FactureBase.prototype.UnFreeze = function () {
                this.IsOpen = true;
            };
            FactureBase.prototype.set = function (prop, value, keepEvent) {
                var isopen = prop === FactureBase.DPIsOpen;
                if (isopen && this._isFrozen)
                    this._isFrozen = false;
                var e = _super.prototype.set.call(this, prop, value, keepEvent);
                if (isopen && !value)
                    this._isFrozen = true;
                return e;
            };
            Object.defineProperty(FactureBase.prototype, "IsOpen", {
                get: function () { return this.get(FactureBase.DPIsOpen); },
                set: function (c) { this.set(FactureBase.DPIsOpen, c); },
                enumerable: true,
                configurable: true
            });
            FactureBase.prototype.MakeChange = function (callback, a, b, c, d) {
                var isf = this._isFrozen;
                if (isf)
                    this._isFrozen = false;
                try {
                    callback.call(this, a, b, c, d);
                }
                catch (e) {
                }
                this._isFrozen = isf;
            };
            FactureBase.ctor = function () {
                FactureBase.DPLockedAt = Corelib_7.bind.DObject.CreateField('LockedAt', Date, null, null, null, Corelib_7.bind.PropertyAttribute.NonSerializable);
                FactureBase.DPLockedBy = Corelib_7.bind.DObject.CreateField('LockedBy', Agent, null, null, null, Corelib_7.bind.PropertyAttribute.NonSerializable);
                FactureBase.DPEditeur = Corelib_7.bind.DObject.CreateField('Editeur', models.Client, null, null, null, Corelib_7.bind.PropertyAttribute.SerializeAsId);
                FactureBase.DPValidator = Corelib_7.bind.DObject.CreateField('Validator', Agent, null, null, null, Corelib_7.bind.PropertyAttribute.SerializeAsId);
            };
            FactureBase.prototype.Recalc = function (results) {
                this.MakeChange(FactureBase._recalc, results);
            };
            FactureBase.prototype.FromJson = function (json, context, update) {
                if (json) {
                    _super.prototype.FromJson.call(this, json, context, update);
                    if (typeof json.IsFrozen === 'boolean')
                        this.IsOpen = !json.IsFrozen;
                }
                return this;
            };
            FactureBase.DPTotal = Corelib_7.bind.DObject.CreateField('Total', Number, 0, function (e) {
                var x = e.__this;
                x.Sold = x.Total - x.Versment;
            }, null, Corelib_7.bind.PropertyAttribute.NonSerializable);
            FactureBase.DPDateLivraison = Corelib_7.bind.DObject.CreateField('DateLivraison', Date, null);
            FactureBase.DPDate = Corelib_7.bind.DObject.CreateField('Date', Date, null);
            FactureBase.DPObservation = Corelib_7.bind.DObject.CreateField('Observation', String, null);
            FactureBase.DPType = Corelib_7.bind.DObject.CreateField('Type', Number, models.BonType.Bon, FactureBase.prototype.factureTypeChanged, function (e) { if (models.BonType[e._new] == undefined)
                e._new = e._old || models.BonType.Bon; }, Corelib_7.bind.PropertyAttribute.NonSerializable);
            FactureBase.DPTransaction = Corelib_7.bind.DObject.CreateField("Transaction", Number, models.TransactionType.Vente, FactureBase.prototype.factureTypeChanged, FactureBase.prototype.onTransactionChanging, Corelib_7.bind.PropertyAttribute.NonSerializable);
            FactureBase.DPIsValidated = Corelib_7.bind.DObject.CreateField('IsValidated', Boolean, null, null, null, Corelib_7.bind.PropertyAttribute.NonSerializable);
            FactureBase.DPVersments = Corelib_7.bind.DObject.CreateField("Versments", System_8.sdata.DataTable, null, null, null, Corelib_7.bind.PropertyAttribute.Private);
            FactureBase.DPIsOpen = Corelib_7.bind.DObject.CreateField('IsOpen', Boolean, false, function (e) {
                if (!!e._new) {
                }
                else {
                }
            }, function (e) {
                if (typeof e._new !== 'boolean')
                    e._new = !!e._new;
            }, Corelib_7.bind.PropertyAttribute.NonSerializable | Corelib_7.bind.PropertyAttribute.Private);
            FactureBase.DPNArticles = Corelib_7.bind.DObject.CreateField('NArticles', Number, 0, null, null, Corelib_7.bind.PropertyAttribute.NonSerializable);
            FactureBase.DPRef = Corelib_7.bind.DObject.CreateField('Ref', String, null, null, null, Corelib_7.bind.PropertyAttribute.NonSerializable);
            FactureBase.DPSold = Corelib_7.bind.DObject.CreateField('Sold', Number, null, null, null, Corelib_7.bind.PropertyAttribute.NonSerializable);
            FactureBase.DPVersment = Corelib_7.bind.DObject.CreateField('Versment', Number, 0, function (e) {
                var x = e.__this;
                x.Sold = x.Total - x.Versment;
            }, null, Corelib_7.bind.PropertyAttribute.NonSerializable);
            FactureBase._recalc = function (results) {
                try {
                    this.Total = NaN;
                    var tot = this.CalcTotal();
                    this.Total = tot;
                    results = results || this.Versments;
                    if (results) {
                        var t = results.AsList();
                        var x = 0;
                        for (var i = t.length - 1; i >= 0; i--)
                            x += t[i].Montant;
                        this.Versment = x;
                        this.Sold = NaN;
                        this.Sold = tot - x;
                    }
                    else if (this.Versement != undefined) {
                        this.Sold = NaN;
                        this.Sold = tot - this.Versment;
                    }
                }
                catch (e) {
                }
            };
            return FactureBase;
        }(System_8.sdata.QShopRow));
        models.FactureBase = FactureBase;
        var Client = (function (_super) {
            __extends(Client, _super);
            function Client(id) {
                return _super.call(this, id) || this;
            }
            Object.defineProperty(Client.prototype, "FullName", {
                get: function () { return this.get(Client.DPFullName); },
                enumerable: true,
                configurable: true
            });
            Client.prototype.toString = function () {
                return (this.get(Client.DPFullName) || '') + ' \tTel:' + (this.get(SiegeSocial.DPTel) || '');
            };
            Client.__fields__ = function () {
                return [
                    Client.DPFirstName,
                    Client.DPLastName,
                    Client.DPJob,
                    Client.DPWorkAt, Client.DPFullName, Client.DPAbonment
                ];
            };
            Client.getById = function (id, type) {
                return Client.pstore.Get(id);
            };
            Client.prototype.getStore = function () { return Client.pstore; };
            Client.ctor = function () {
                this.DPWorkAt = Corelib_7.bind.DObject.CreateField("WorkAt", String, null, null, null, Corelib_7.bind.PropertyAttribute.SerializeAsId);
            };
            Client.DPAbonment = Corelib_7.bind.DObject.CreateField("Abonment", Number, 0, null, function (e) { if (e._new == null)
                e._new = models.Abonment.Detaillant; });
            Client.DPFirstName = Corelib_7.bind.DObject.CreateField("FirstName", String, null, function (e) {
                e.__this.set(Client.DPFullName, (e._new || '') + ' ' + (e.__this.LastName || ''));
            });
            Client.DPLastName = Corelib_7.bind.DObject.CreateField("LastName", String, null, function (e) { e.__this.set(Client.DPFullName, (e.__this.FirstName || '') + ' ' + (e._new || '')); });
            Client.DPFullName = Corelib_7.bind.DObject.CreateField("FullName", String, null, null, null, Corelib_7.bind.PropertyAttribute.Private);
            Client.DPJob = Corelib_7.bind.DObject.CreateField("Job", Number, models.Job.Detaillant);
            Client.pstore = new Corelib_7.collection.Dictionary("Clients", true);
            return Client;
        }(Dealer));
        models.Client = Client;
        var Projet = (function (_super) {
            __extends(Projet, _super);
            function Projet() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Object.defineProperty(Projet.prototype, "Name", {
                get: function () { return this.get(Projet.DPName); },
                set: function (v) { this.set(Projet.DPName, v); },
                enumerable: true,
                configurable: true
            });
            Projet.__fields__ = function () { return [this.DPName]; };
            Projet.ctor = function () {
                this.DPName = Corelib_7.bind.DObject.CreateField("Name", String);
            };
            Projet.prototype.getStore = function () {
                return Projet._pstore;
            };
            Projet._pstore = new Corelib_7.collection.Dictionary("Projets");
            return Projet;
        }(models.SiegeSocial));
        models.Projet = Projet;
        var SFacture = (function (_super) {
            __extends(SFacture, _super);
            function SFacture(id) {
                var _this = _super.call(this, id) || this;
                _this.ArticlesListener = { Invoke: _this.OnArticlesChanged, Owner: _this };
                _this.set(SFacture.DPArticles, new FakePrices(_this));
                return _this;
            }
            SFacture.__fields__ = function () { return [this.DPFournisseur, this.DPAchteur, this.DPArticles]; };
            SFacture.prototype.createNewVersments = function () { return new SVersments(this); };
            SFacture.prototype.OnArticlesChanged = function (e) {
                var a = this.get(SFacture.DPArticles);
                var c = 0;
                if (a)
                    for (var i = 0, l = a.Count; i < l; i++) {
                        var t = a.Get(i);
                        c += t.Qte * t.PSel;
                    }
                this.set(SFacture.DPTotal, c);
            };
            SFacture.prototype.CalcTotal = function () {
                var a = this.get(SFacture.DPArticles);
                var c = 0;
                if (a)
                    for (var i = 0, l = a.Count; i < l; i++) {
                        var t = a.Get(i);
                        c += t.Qte * t.PSel;
                    }
                this.set(SFacture.DPTotal, c);
                this.NArticles = l;
                return c;
            };
            SFacture.prototype.getStore = function () { return sfpStore; };
            SFacture.getById = function (i) {
                return sfpStore.Get(i);
            };
            SFacture.prototype.toString = function () {
                return this._str || (this._str = models.BonType[this.Type] + " " + this.Ref + ": " + ' [' + Facture.getString(this.get(SFacture.DPFournisseur)) + '\rdate:' + Facture.getString(this.get(Facture.DPDate)) + '\rdatelivraison:' + Facture.getString(this.get(Facture.DPDateLivraison)) + ']');
            };
            SFacture.ctor = function () {
                this.DPFournisseur = Corelib_7.bind.DObject.CreateField('Fournisseur', Fournisseur, null, null, null, Corelib_7.bind.PropertyAttribute.NonSerializable);
                this.DPAchteur = Corelib_7.bind.DObject.CreateField('Achteur', Agent, null, null, null, Corelib_7.bind.PropertyAttribute.SerializeAsId);
                this.DPArticles = Corelib_7.bind.DObject.CreateField('Articles', FakePrices, null, null, function (e) {
                    if (e._new == null) {
                        var old = e._old;
                        if (old) {
                            old.UnFreeze();
                            old.Clear();
                            e._new = old;
                            return;
                        }
                        e._new = new models.FakePrices(e.__this, []);
                    }
                }, Corelib_7.bind.PropertyAttribute.NonSerializable);
            };
            return SFacture;
        }(FactureBase));
        models.SFacture = SFacture;
        var Price = (function (_super) {
            __extends(Price, _super);
            function Price() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Price.CalclMoyen = function (_old, _new) {
                var o = _old.Qte || 0;
                var n = _new.Qte || 0;
                var sum = o + n;
                if (sum == 0) {
                    o = 1;
                    n = 1;
                    sum = 2;
                }
                var props = Price.__fields__();
                var no = new FakePrice();
                for (var i = 0; i < props.length - 1; i++) {
                    var prop = props[i];
                    no.set(prop, ((_old.get(prop) || 0) * o + (_new.get(prop) || 0) * n) / sum);
                }
                if (_new instanceof FakePrice)
                    no.Product = _new.Product;
                return no;
            };
            Price.__fields__ = function () { return [Price.DPPSel, Price.DPValue, Price.DPPValue, Price.DPHWValue, Price.DPWValue, Price.DPQte]; };
            Price.prototype.GetPrice = function (abonment) {
                if (abonment < 4 && abonment >= 0)
                    return this.get(this.GetDProperty(abonment));
                return this.Value;
            };
            Price.prototype.GetDProperty = function (abonment) {
                if (abonment < 4 && abonment >= 0)
                    return Corelib_7.bind.DObject.GetDPropertyAt(this.constructor, Price.DPValue.Index + abonment);
                return Price.DPValue;
            };
            Price.GetDProperty = function (abonment) {
                if (abonment < 4 && abonment >= 0)
                    return Corelib_7.bind.DObject.GetDPropertyAt(this, Price.DPValue.Index + abonment);
                return Price.DPValue;
            };
            Price.GetAbonment = function (prop) {
                var t = prop.Index - Price.DPValue.Index;
                return (t < 0 || t > 3) ? models.Abonment.Detaillant : t;
            };
            Price.prototype.ISetValue = function (abonment, price) {
                var prop = this.GetDProperty(abonment);
                if (prop)
                    this.set(prop, price);
                else
                    this.set(Price.DPValue, price);
            };
            Price.prototype.IGetValue = function (abonment) {
                var prop = this.GetDProperty(abonment);
                if (prop)
                    return this.get(prop);
                return undefined;
            };
            Price.prototype.ClonePrices = function (to, alsoPSet) {
                to.Value = this.Value;
                to.PValue = this.PValue;
                to.HWValue = this.HWValue;
                to.WValue = this.WValue;
                if (alsoPSet)
                    to.PSel = this.PSel;
            };
            Price.prototype.getStore = function () { return Price.pStore; };
            Price.DPPSel = Corelib_7.bind.DObject.CreateField("PSel", Number, 0);
            Price.DPValue = Corelib_7.bind.DObject.CreateField("Value", Number, 0);
            Price.DPPValue = Corelib_7.bind.DObject.CreateField("PValue", Number, 0);
            Price.DPHWValue = Corelib_7.bind.DObject.CreateField("HWValue", Number, 0);
            Price.DPWValue = Corelib_7.bind.DObject.CreateField("WValue", Number, 0);
            Price.DPQte = Corelib_7.bind.DObject.CreateField("Qte", Number, null);
            Price.pStore = new Corelib_7.collection.Dictionary("prices");
            return Price;
        }(System_8.sdata.QShopRow));
        models.Price = Price;
        var FakePrice = (function (_super) {
            __extends(FakePrice, _super);
            function FakePrice() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            FakePrice.__fields__ = function () { return [FakePrice.DPProduct, FakePrice.DPNextRevage, FakePrice.DPSFacture, FakePrice.DPApplyPrice]; };
            FakePrice.ctor = function () {
                this.DPApplyPrice = Corelib_7.bind.DObject.CreateField('ApplyPrice', FakePrice);
                this.DPProduct = Corelib_7.bind.DObject.CreateField("Product", Product, null, null, null, Corelib_7.bind.PropertyAttribute.SerializeAsId);
                this.DPNextRevage = Corelib_7.bind.DObject.CreateField("NextRevage", FakePrice, null, null, null, Corelib_7.bind.PropertyAttribute.NonSerializable);
                this.DPSFacture = Corelib_7.bind.DObject.CreateField("Facture", SFacture, null, null, null, Corelib_7.bind.PropertyAttribute.SerializeAsId);
            };
            FakePrice.prototype.getStore = function () { return FakePrice.pStore; };
            FakePrice.getById = function (id) {
                return FakePrice.pStore.Get(id);
            };
            FakePrice.prototype.test = function (e, dt, scop, event) {
                switch (e.keyCode) {
                    case UI_11.UI.Keys.F2:
                        this.calc("current");
                        break;
                    case UI_11.UI.Keys.F3:
                        this.calc("calc");
                        break;
                    case UI_11.UI.Keys.F5:
                        this.applyPrice("moyen");
                        break;
                    case UI_11.UI.Keys.F6:
                        this.applyPrice("percent");
                        break;
                    case UI_11.UI.Keys.F7:
                        this.applyPrice("new");
                        break;
                    case UI_11.UI.Keys.F8:
                        this.applyPrice("old");
                        break;
                    default: return;
                }
                e.stopImmediatePropagation();
                e.stopPropagation();
                e.preventDefault();
            };
            FakePrice.prototype.calcPrices = function (data) {
            };
            FakePrice.prototype.applyPrice = function (method) {
                var art = this;
                var f = art.Facture;
                if (f && !f.IsOpen)
                    return UI_11.UI.Modal.ShowDialog("Apprentissage", 'La Facture Is Clossed donc vous ne pouver pas executer cette command', null, "Ok", null);
                var old = art.Product;
                if (old == null)
                    return UI_11.UI.Modal.ShowDialog('Apprentissage', "Vous dever selectioner un produit pour appliquer le prix");
                switch (method) {
                    case 'moyen':
                        art.ApplyPrice = models.Price.CalclMoyen(old, art);
                        break;
                    case 'new':
                        art.ApplyPrice = art;
                        break;
                    case 'old':
                        art.ApplyPrice = null;
                        break;
                    case 'percent':
                        UI_11.UI.InfoArea.push("this option is depricated");
                        break;
                }
            };
            FakePrice.prototype.calc = function (data) {
                switch (data) {
                    case 'costume':
                        var t = this;
                        if (t.ApplyPrice === t || t.ApplyPrice == null)
                            var y = new FakePrice(Corelib_7.basic.New());
                        else
                            y = t.ApplyPrice;
                        for (var i = 3; i >= 0; i--) {
                            y.ISetValue(i, t.GetPrice(i));
                        }
                        y.PSel = t.PSel;
                        y.Product = t.Product;
                        y.Qte = t.Product.Qte;
                        t.ApplyPrice = y;
                        break;
                    case 'current':
                        var val = this;
                        if (val instanceof models.Product)
                            return;
                        fakePrice = this;
                        var prd = fakePrice.Product;
                        if (!prd)
                            return UI_11.UI.InfoArea.push('The product of this revage is not setted', false);
                        for (var i = 3; i >= 0; i--) {
                            fakePrice.ISetValue(i, prd.GetPrice(i));
                        }
                        break;
                    case 'calc':
                        var fakePrice = this;
                        var ps = fakePrice.PSel;
                        for (var i = 3; i >= 0; i--) {
                            fakePrice.ISetValue(i, ps = parseFloat(Corelib_7.math.round(ps * 1.33, 2)));
                        }
                        break;
                    case 'default':
                        var t = this;
                        t.ApplyPrice = t;
                        break;
                }
            };
            FakePrice.prototype.ToList = function () {
                var x = [];
                var t = this;
                do {
                    if (x.indexOf(t) !== -1)
                        break;
                    x.push(t);
                    t = t.NextRevage;
                } while (t != null);
                return new Corelib_7.collection.List(FakePrice, x);
            };
            FakePrice.prototype.toString = function () { return (this.get(FakePrice.DPProduct) || '').toString(); };
            FakePrice.prototype.Freeze = function () { };
            FakePrice.prototype.UnFreeze = function () { };
            FakePrice.pStore = new Corelib_7.collection.Dictionary("fakes");
            return FakePrice;
        }(Price));
        models.FakePrice = FakePrice;
        var FakePrices = (function (_super) {
            __extends(FakePrices, _super);
            function FakePrices(owner, array) {
                return _super.call(this, owner, FakePrice, function (id) { return new FakePrice(id); }, array) || this;
            }
            Object.defineProperty(FakePrices.prototype, "ArgType", {
                get: function () { return FakePrice; },
                enumerable: true,
                configurable: true
            });
            FakePrices.prototype.getArgType = function (json) { return FakePrice; };
            FakePrices.prototype.GetType = function () { return FakePrices; };
            FakePrices.prototype.Freeze = function () { };
            FakePrices.prototype.UnFreeze = function () { };
            return FakePrices;
        }(System_8.sdata.DataTable));
        models.FakePrices = FakePrices;
        var VersmentBase = (function (_super) {
            __extends(VersmentBase, _super);
            function VersmentBase() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            ;
            VersmentBase.ctor = function () {
                this.DPMontant = Corelib_7.bind.DObject.CreateField("Montant", Number, 0);
                this.DPType = Corelib_7.bind.DObject.CreateField("Type", Number, models.VersmentType.Espece);
                this.DPDate = Corelib_7.bind.DObject.CreateField("Date", Date, new Date());
                this.DPCassier = Corelib_7.bind.DObject.CreateField('Cassier', Agent, null, null, null, Corelib_7.bind.PropertyAttribute.SerializeAsId);
                this.DPObservation = Corelib_7.bind.DObject.CreateField('Observation', String, null);
            };
            VersmentBase.__fields__ = function () { return [VersmentBase.DPType, VersmentBase.DPMontant, VersmentBase.DPDate, this.DPCassier, this.DPObservation, this.DPRef]; };
            VersmentBase.DPRef = Corelib_7.bind.DObject.CreateField('Ref', String, null);
            return VersmentBase;
        }(System_8.sdata.QShopRow));
        models.VersmentBase = VersmentBase;
        var Versment = (function (_super) {
            __extends(Versment, _super);
            function Versment(id) {
                return _super.call(this, id) || this;
            }
            Versment.__fields__ = function () { return [this.DPClient, this.DPFacture]; };
            Object.defineProperty(Versment.prototype, "Partner", {
                get: function () { return this.get(Versment.DPClient); },
                enumerable: true,
                configurable: true
            });
            Versment.ctor = function () {
                this.DPClient = Corelib_7.bind.DObject.CreateField('Client', Client, null, null, null, Corelib_7.bind.PropertyAttribute.SerializeAsId);
                this.DPFacture = Corelib_7.bind.DObject.CreateField('Facture', Facture, null);
            };
            Versment.getById = function (id, type) {
                return Versment.pstore.Get(id);
            };
            Versment.prototype.getStore = function () { return Versment.pstore; };
            Versment.prototype.toString = function () {
                var c = (c = this.Client) && (c = c.FullName || "");
                var s = ((s = this.Cassier) && (s = s.Name)) || "";
                return "Le client " + c + " Verser \uFFFD " + s + " a la date " + this.Date + " le montant " + this.Montant + " DZD en " + models.VersmentType[this.Type] + " \r\n et remarquer que \"" + this.Observation + "\" ";
            };
            Versment.pstore = new Corelib_7.collection.Dictionary("Versments", true);
            return Versment;
        }(VersmentBase));
        models.Versment = Versment;
        var SVersment = (function (_super) {
            __extends(SVersment, _super);
            function SVersment(id) {
                return _super.call(this, id) || this;
            }
            Object.defineProperty(SVersment.prototype, "Partner", {
                get: function () { return this.get(SVersment.DPFournisseur); },
                enumerable: true,
                configurable: true
            });
            SVersment.ctor = function () {
                this.DPFournisseur = Corelib_7.bind.DObject.CreateField('Fournisseur', Fournisseur, null, null, null, Corelib_7.bind.PropertyAttribute.SerializeAsId);
                this.DPFacture = Corelib_7.bind.DObject.CreateField('Facture', SFacture, null, null, null, Corelib_7.bind.PropertyAttribute.SerializeAsId);
            };
            SVersment.__fields__ = function () { return [this.DPFournisseur, this.DPFacture]; };
            SVersment.getById = function (id, type) {
                return SVersment.pstore.Get(id);
            };
            SVersment.prototype.getStore = function () { return SVersment.pstore; };
            SVersment.pstore = new Corelib_7.collection.Dictionary("SVersments", true);
            return SVersment;
        }(VersmentBase));
        models.SVersment = SVersment;
        var BVersments = (function (_super) {
            __extends(BVersments, _super);
            function BVersments() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return BVersments;
        }(System_8.sdata.DataTable));
        models.BVersments = BVersments;
        var Versments = (function (_super) {
            __extends(Versments, _super);
            function Versments(_parent) {
                var _this = _super.call(this, _parent, Versment, function (id) { return new Versment(id); }) || this;
                _this.Owner = _parent;
                return _this;
            }
            Object.defineProperty(Versments.prototype, "ArgType", {
                get: function () { return Versment; },
                enumerable: true,
                configurable: true
            });
            Versments.prototype.getArgType = function (json) { return Versment; };
            Versments.prototype.GetType = function () { return Versments; };
            return Versments;
        }(BVersments));
        models.Versments = Versments;
        var SVersments = (function (_super) {
            __extends(SVersments, _super);
            function SVersments(_parent) {
                var _this = _super.call(this, _parent, Versment, function (id) { return new SVersment(id); }) || this;
                _this.Owner = _parent;
                return _this;
            }
            Object.defineProperty(SVersments.prototype, "ArgType", {
                get: function () { return SVersment; },
                enumerable: true,
                configurable: true
            });
            SVersments.prototype.getArgType = function (json) { return SVersment; };
            SVersments.prototype.GetType = function () { return SVersments; };
            return SVersments;
        }(BVersments));
        models.SVersments = SVersments;
        var Costumers = (function (_super) {
            __extends(Costumers, _super);
            function Costumers(_parent, items) {
                return _super.call(this, _parent, models.Client, function (id) { return new models.Client(id); }, items) || this;
            }
            Object.defineProperty(Costumers.prototype, "ArgType", {
                get: function () { return models.Client; },
                enumerable: true,
                configurable: true
            });
            Costumers.prototype.getArgType = function (json) { return models.Client; };
            Costumers.prototype.GetType = function () { return Costumers; };
            Costumers.prototype.Freeze = function () {
            };
            Costumers.prototype.OnDeserialize = function (list) {
                this.Order((function (a, b) { return (a.Name || "").localeCompare(b.Name || ""); }));
            };
            return Costumers;
        }(System_8.sdata.DataTable));
        models.Costumers = Costumers;
        var Fournisseur = (function (_super) {
            __extends(Fournisseur, _super);
            function Fournisseur(id) {
                return _super.call(this, id) || this;
            }
            Fournisseur.__fields__ = function () { return [this.DPRef]; };
            Fournisseur.prototype.getStore = function () { return Fournisseur._mystore; };
            Fournisseur.prototype.toString = function () {
                return (this.Name || '') + ' / ' + (this.Tel || '');
            };
            Fournisseur.getById = function (id, type) {
                return Fournisseur._mystore.Get(id) || _super.getById.call(this, id, type);
            };
            Fournisseur.DPRef = Corelib_7.bind.DObject.CreateField('Ref', String, null);
            Fournisseur._mystore = new Corelib_7.collection.Dictionary("Fournisseurs", false);
            return Fournisseur;
        }(Dealer));
        models.Fournisseur = Fournisseur;
        var Fournisseurs = (function (_super) {
            __extends(Fournisseurs, _super);
            function Fournisseurs(_parent, items) {
                return _super.call(this, _parent, models.Client, function (id) { return new Fournisseur(id); }, items) || this;
            }
            Object.defineProperty(Fournisseurs.prototype, "ArgType", {
                get: function () { return Fournisseur; },
                enumerable: true,
                configurable: true
            });
            Fournisseurs.prototype.getArgType = function (json) { return Fournisseur; };
            Fournisseurs.prototype.GetType = function () { return Fournisseurs; };
            Fournisseurs.prototype.OnDeserialize = function (list) {
                this.Order((function (a, b) { return (a.Name || "").localeCompare(b.Name || ""); }));
            };
            return Fournisseurs;
        }(System_8.sdata.DataTable));
        models.Fournisseurs = Fournisseurs;
        var Clients = (function (_super) {
            __extends(Clients, _super);
            function Clients(_parent, items) {
                return _super.call(this, _parent, models.Client, function (id) { return new models.Client(id); }, items) || this;
            }
            Object.defineProperty(Clients.prototype, "ArgType", {
                get: function () { return models.Client; },
                enumerable: true,
                configurable: true
            });
            Clients.prototype.getArgType = function (json) { return models.Client; };
            Clients.prototype.GetType = function () { return Clients; };
            return Clients;
        }(System_8.sdata.DataTable));
        models.Clients = Clients;
        var Projets = (function (_super) {
            __extends(Projets, _super);
            function Projets(_parent, items) {
                return _super.call(this, _parent, models.Projet, function (id) { return new models.Projet(id); }, items) || this;
            }
            Projets.__fields__ = function () { return []; };
            Object.defineProperty(Projets.prototype, "ArgType", {
                get: function () { return models.Projet; },
                enumerable: true,
                configurable: true
            });
            Projets.prototype.getArgType = function (json) { return models.Projet; };
            Projets.prototype.GetType = function () { return Projets; };
            return Projets;
        }(System_8.sdata.DataTable));
        models.Projets = Projets;
        var Mails = (function (_super) {
            __extends(Mails, _super);
            function Mails(parent, array) {
                return _super.call(this, parent, models.Mail, function (id) { return new models.Mail(id); }, array) || this;
            }
            return Mails;
        }(System_8.sdata.DataTable));
        models.Mails = Mails;
        var Categories = (function (_super) {
            __extends(Categories, _super);
            function Categories(_parent) {
                return _super.call(this, _parent, Category, function (id) { return new Category(id); }) || this;
            }
            Object.defineProperty(Categories.prototype, "ArgType", {
                get: function () { return Category; },
                enumerable: true,
                configurable: true
            });
            Categories.prototype.getArgType = function (json) { return Category; };
            Categories.prototype.GetType = function () { return Categories; };
            return Categories;
        }(System_8.sdata.DataTable));
        models.Categories = Categories;
        var Category = (function (_super) {
            __extends(Category, _super);
            function Category(id) {
                var _this = _super.call(this, id) || this;
                _this._s = null;
                return _this;
            }
            Category.__fields__ = function () {
                return [
                    Category.DPName,
                    Category.DPBase
                ];
            };
            Category.GetCategory = function (id) {
                var c = Category._categoriesStore.Get(id);
                if (c == null) {
                    c = new Category(id);
                    c.Update();
                }
                return c;
            };
            Object.defineProperty(Category, "Categories", {
                get: function () {
                    return Category._categoriesStore;
                },
                enumerable: true,
                configurable: true
            });
            Category.prototype.toString = function () {
                return this.Name;
            };
            Category.prototype.getStore = function () { return Category.pstore; };
            Category.getById = function (id, type) { return Category.pstore.Get(id); };
            Category.ctor = function () {
                this.DPName = Corelib_7.bind.DObject.CreateField("Name", String, null);
                this.DPBase = Corelib_7.bind.DObject.CreateField("Base", Category, null, null, null, Corelib_7.bind.PropertyAttribute.SerializeAsId);
            };
            Category._categoriesStore = new Categories(null);
            Category.pstore = new Corelib_7.collection.Dictionary('categories', true);
            return Category;
        }(System_8.sdata.QShopRow));
        models.Category = Category;
        var Product = (function (_super) {
            __extends(Product, _super);
            function Product(id) {
                return _super.call(this, id) || this;
            }
            Product.prototype.toString = function () {
                return this._toString;
            };
            Product.__fields__ = function () {
                return [
                    this.DPCategory,
                    this.DPName,
                    this.DPDimention,
                    this.DPSerieName,
                    this.DPQuality,
                    this.DPPicture,
                    this.DPDescription,
                    this.DPRevage,
                    this.DPCurrentArticle
                ];
            };
            Product.prototype.onPropertyChanged = function (ev) {
                if (ev.prop.Index >= Product.DPName.Index && ev.prop.Index <= Product.DPSerieName.Index) {
                    this._toString = (this.Name || '') + '  ' + (this.Dimention || '') + ' ' + (this.SerieName || '');
                }
                _super.prototype.onPropertyChanged.call(this, ev);
            };
            Product.getById = function (id, type) {
                return Product.pstore.Get(id);
            };
            Product.prototype.getStore = function () { return Product.pstore; };
            Product.prototype.FromJson = function (json, context, update) {
                return _super.prototype.FromJson.call(this, json, context, update);
            };
            Product.ctor = function () {
                this.DPCategory = Corelib_7.bind.DObject.CreateField("Category", Category, null, null, null, Corelib_7.bind.PropertyAttribute.SerializeAsId);
                this.DPName = Corelib_7.bind.DObject.CreateField("Name", String, null);
                this.DPDescription = Corelib_7.bind.DObject.CreateField("Description", String);
                this.DPPicture = Corelib_7.bind.DObject.CreateField("Picture", String);
                this.DPDimention = Corelib_7.bind.DObject.CreateField("Dimention", String);
                this.DPQuality = Corelib_7.bind.DObject.CreateField("Quality", Number);
                this.DPSerieName = Corelib_7.bind.DObject.CreateField("SerieName", String);
                this.DPRevage = Corelib_7.bind.DObject.CreateField('Revage', FakePrice, null, null, null, Corelib_7.bind.PropertyAttribute.NonSerializable);
                this.DPCurrentArticle = Corelib_7.bind.DObject.CreateField('CurrentArticle', Article, null, null, null, Corelib_7.bind.PropertyAttribute.Private | Corelib_7.bind.PropertyAttribute.Optional);
            };
            Product.pstore = new Corelib_7.collection.Dictionary("Products", true);
            return Product;
        }(Price));
        models.Product = Product;
        var Products = (function (_super) {
            __extends(Products, _super);
            function Products(_parent, items) {
                return _super.call(this, _parent, Product, function (id) { return new Product(id); }, items) || this;
            }
            Object.defineProperty(Products.prototype, "ArgType", {
                get: function () { return Product; },
                enumerable: true,
                configurable: true
            });
            Products.prototype.getArgType = function (json) { return Product; };
            Products.prototype.GetType = function () { return Products; };
            Products.prototype.OnDeserialize = function (list) {
                var t = new Date(Date.now());
                console.profile("DeserializeProducts");
                this.Order((function (a, b) { return (a.Name || "").localeCompare(b.Name || ""); }));
                console.log("Statr DeserializeProducts " + t + " to " + new Date(Date.now()));
                console.profileEnd();
            };
            return Products;
        }(System_8.sdata.DataTable));
        models.Products = Products;
        var Article = (function (_super) {
            __extends(Article, _super);
            function Article(id) {
                var _this = _super.call(this, id) || this;
                _this.OCount = 0;
                return _this;
            }
            Article.prototype.toString = function () {
                return this.Product.toString() + ' Count:' + this.Count;
            };
            Object.defineProperty(Article.prototype, "Reduction", {
                get: function () { return this.get(Article.DPReduction); },
                enumerable: true,
                configurable: true
            });
            Article.__fields__ = function () {
                return [
                    Article.DPOwner,
                    Article.DPProduct,
                    Article.DPPrice,
                    Article.DPCount,
                    Article.DPPSel, this.DPProductName, this.DPLabel, this.DPReduction, this.DPOPrice
                ];
            };
            Article.getById = function (id, type) {
                return Article.pstore.Get(id);
            };
            Article.prototype.getStore = function () { return Article.pstore; };
            Article.prototype.FromJson = function (json, context, update) {
                _super.prototype.FromJson.call(this, json, context, update);
                this.OCount = this.Count;
                return this;
            };
            Article.ctor = function () {
                this.DPProduct = Corelib_7.bind.DObject.CreateField('Product', Product, null, this.prototype.WhenProductChanged, null, Corelib_7.bind.PropertyAttribute.SerializeAsId);
                this.DPProductName = Corelib_7.bind.DObject.CreateField('ProductName', String, null, this.prototype.WhenProductNameChanged, null);
                this.DPOwner = Corelib_7.bind.DObject.CreateField('Owner', Facture, null, null, null, Corelib_7.bind.PropertyAttribute.SerializeAsId);
                this.DPPrice = Corelib_7.bind.DObject.CreateField('Price', Number, null, this.prototype.onPriceChanged);
                this.DPCount = Corelib_7.bind.DObject.CreateField("Count", Number, 0);
                this.DPPSel = Corelib_7.bind.DObject.CreateField("PSel", Number, 0);
                this.DPOPrice = Corelib_7.bind.DObject.CreateField("OPrice", Number, 0, this.prototype.onOPriceChanged);
                this.DPReduction = Corelib_7.bind.DObject.CreateField("Reduction", Number, 0, void 0, void 0, Corelib_7.bind.PropertyAttribute.Private);
            };
            Article.prototype.onPriceChanged = function (e) {
                this.set(Article.DPReduction, (e._new || 0) - (this.OPrice || 0));
            };
            Article.prototype.onOPriceChanged = function (e) {
                this.set(Article.DPReduction, (this.Price || 0) - (e._new || 0));
            };
            Article.prototype.isNullOrWhiteSpace = function (s) {
                return s == null || s.trim() == "";
            };
            Article.prototype.WhenProductNameChanged = function (e) {
                this._setLabel(this.Product, e._new);
            };
            Article.prototype.WhenProductChanged = function (e) {
                this.updateReduction(e._new);
                this._setLabel(e._new, this.ProductName);
            };
            Article.prototype._setLabel = function (p, name) {
                if (this.isNullOrWhiteSpace(name))
                    this.Label = (p && p.toString()) || "";
                else
                    this.Label = name;
            };
            Article.prototype.Freeze = function () { };
            Article.prototype.UnFreeze = function () { };
            Article.prototype.getValues = function (prd) {
                return {
                    pv: this.OPrice || (prd ? prd.GetPrice(this.Owner && this.Owner.Abonment || 0) || prd.Value : 0) || 0,
                    pa: this.PSel || (prd && prd.PSel) || 0
                };
            };
            Article.prototype.updateReduction = function (prd) {
                var pv = this.getValues(prd).pv;
                this.set(Article.DPReduction, this.Price - pv);
            };
            Article.prototype.setProduct = function (p) {
                this.PSel = p && p.PSel;
                this.OPrice = p && p.IGetValue((this.Owner && this.Owner.Abonment) || models.Abonment.Detaillant);
                this.Price = this.OPrice;
                this.Product = p;
            };
            Article.prototype.setReduction = function (s) {
                Article.redEx.exec(null);
                var rslt = Article.redEx.exec('\0' + s + '\0');
                return rslt && this.calcReduction({ Method: rslt[1], Value: parseFloat(rslt[2]), IsPercent: (rslt[4] || "").trim() == "%" });
            };
            Article.prototype.calcReduction = function (val) {
                var prd = this.Product;
                var vls = this.getValues(prd);
                var v = val.Value;
                switch (val.Method) {
                    case '=':
                        break;
                    case '*':
                        v = vls.pa * v;
                        break;
                    case ':':
                        if (!prd)
                            return false;
                        v = prd.GetPrice(v);
                        break;
                    case '+':
                        v = val.IsPercent ? vls.pa * (1 + v / 100) : vls.pv + v;
                        break;
                    case '-':
                        v = val.IsPercent ? vls.pa * (1 - v / 100) : vls.pv - v;
                        break;
                    case '/':
                        v = vls.pa + Math.abs(vls.pv - vls.pa) / v;
                        break;
                    default:
                        v = val.IsPercent ? v = vls.pa * (1 + v / 100) : vls.pv + v;
                        break;
                }
                this.Price = v;
                return true;
            };
            Article.pstore = new Corelib_7.collection.Dictionary("Articles", true);
            Article.DPLabel = Corelib_7.bind.DObject.CreateField("Label", String, "", void 0, void 0, Corelib_7.bind.PropertyAttribute.Private);
            Article.redEx = /\0([\=\*\-\+\:\/]){0,1}([\-]{0,1}[\d]+(\.[\d]+){0,1})([\%]{0,1})\0/gmi;
            return Article;
        }(System_8.sdata.QShopRow));
        models.Article = Article;
        var Articles = (function (_super) {
            __extends(Articles, _super);
            function Articles(_parent, items) {
                return _super.call(this, _parent, Article, function (id) { return new Article(id); }, items) || this;
            }
            Articles.prototype.Freeze = function () { };
            Articles.prototype.UnFreeze = function () { };
            Object.defineProperty(Articles.prototype, "ArgType", {
                get: function () { return Article; },
                enumerable: true,
                configurable: true
            });
            Articles.prototype.getArgType = function (json) { return Article; };
            Articles.prototype.GetType = function () { return Articles; };
            Articles.prototype.OnDeserialize = function (list) {
                function toNum(d) {
                    return (d && d.getTime()) || 0;
                }
                this.Order((function (a, b) { return toNum(a.LastModified) - toNum(b.LastModified); }));
            };
            return Articles;
        }(System_8.sdata.DataTable));
        models.Articles = Articles;
        var Facture = (function (_super) {
            __extends(Facture, _super);
            function Facture(id) {
                var _this = _super.call(this, id) || this;
                _this.Articles = new Articles(_this);
                return _this;
            }
            Facture.prototype.createNewVersments = function () { return new Versments(this); };
            Facture.getString = function (obj) {
                if (obj == null)
                    return "null";
                return obj.toString();
            };
            Facture.prototype.toString = function () {
                return this._str || (this._str = models.BonType[this.Type] + " " + this.Ref + ": " + ' [' + Facture.getString(this.get(Facture.DPClient)) + '\rdate:' + Facture.getString(this.get(Facture.DPDate)) + '\rdatelivraison:' + this.get(Facture.DPDateLivraison) + ']');
            };
            Facture.__fields__ = function () {
                return [
                    Facture.DPAbonment,
                    Facture.DPClient,
                    Facture.DPAgent,
                    Facture.DPArticles, this.DPPour
                ];
            };
            Facture.prototype.CalcTotal = function () {
                var arts = this.Articles;
                var c = 0;
                for (var i = 0, l = arts.Count; i < l; i++) {
                    var art = arts.Get(i);
                    if (art)
                        c += art.Count * (art.Price || 0.0);
                }
                this.Total = c;
                this.NArticles = l;
                return c;
            };
            Facture.getById = function (id, type) {
                return Facture.pstore.Get(id);
            };
            Facture.prototype.getStore = function () { return Facture.pstore; };
            Facture.freezeArray = function (e) {
                if (e._new == null)
                    if (e._old == null)
                        return;
                    else {
                        e._old.Clear();
                        e._new = e._old;
                    }
            };
            Facture._ctor = function () {
                this.DPAgent = Corelib_7.bind.DObject.CreateField("Vendeur", Agent, null, null, null, Corelib_7.bind.PropertyAttribute.SerializeAsId);
                this.DPClient = Corelib_7.bind.DObject.CreateField("Client", models.Client, null, null, null, Corelib_7.bind.PropertyAttribute.NonSerializable);
                this.DPArticles = Corelib_7.bind.DObject.CreateField("Articles", Articles, null, null, this.freezeArray, Corelib_7.bind.PropertyAttribute.NonSerializable);
                this.DPAbonment = Corelib_7.bind.DObject.CreateField('Abonment', Number, models.Abonment.Detaillant, null, function (e) {
                    if (e._new == null)
                        e._new = models.Abonment.Detaillant;
                    else if (models.Abonment[e._new] == undefined)
                        e._new = e._old;
                }, Corelib_7.bind.PropertyAttribute.NonSerializable);
                Facture.DPPour = Corelib_7.bind.DObject.CreateField('Pour', Projet, null, null, null, Corelib_7.bind.PropertyAttribute.SerializeAsId);
            };
            Facture.prototype.Update = function () {
            };
            Facture.pstore = new Corelib_7.collection.Dictionary("Factures", true);
            return Facture;
        }(FactureBase));
        models.Facture = Facture;
        var SFactures = (function (_super) {
            __extends(SFactures, _super);
            function SFactures(owner, array) {
                return _super.call(this, owner, SFacture, function (id) { return new SFacture(id); }, array) || this;
            }
            Object.defineProperty(SFactures.prototype, "ArgType", {
                get: function () { return SFacture; },
                enumerable: true,
                configurable: true
            });
            SFactures.prototype.getArgType = function (json) { return SFacture; };
            SFactures.prototype.GetType = function () { return SFactures; };
            SFactures.prototype.FromJson = function (json, x, update, callback) {
                if (json) {
                    if (json.__list__ instanceof Array)
                        json.__list__.sort(function (a, b) { return b.Date - a.Date; });
                    return _super.prototype.FromJson.call(this, json, x, update, callback);
                }
                return this;
            };
            SFactures.prototype.OnDeserialize = function (list) {
                this.Order(function (a, b) { return a.Date > b.Date; });
            };
            SFactures.prototype.Freeze = function () {
            };
            return SFactures;
        }(System_8.sdata.DataTable));
        models.SFactures = SFactures;
        var Factures = (function (_super) {
            __extends(Factures, _super);
            function Factures(_parent, items) {
                return _super.call(this, _parent, Facture, function (id) { return new Facture(id); }, items) || this;
            }
            Object.defineProperty(Factures.prototype, "ArgType", {
                get: function () { return Facture; },
                enumerable: true,
                configurable: true
            });
            Factures.prototype.getArgType = function (json) { return Facture; };
            Factures.prototype.GetType = function () { return Factures; };
            Factures.prototype.OnDeserialize = function (list) {
                this.Order(function (a, b) { return a.Date > b.Date; });
            };
            Factures.prototype.FromJson = function (json, x, update, callback) {
                if (json) {
                    if (json.__list__ instanceof Array)
                        json.__list__.sort(function (a, b) { return b.Date - a.Date; });
                    return _super.prototype.FromJson.call(this, json, x, update, callback);
                }
                return this;
            };
            Factures.prototype.Freeze = function () {
            };
            return Factures;
        }(System_8.sdata.DataTable));
        models.Factures = Factures;
        var ii = (function () {
            function ii() {
            }
            return ii;
        }());
        models.ii = ii;
        var Logout = (function (_super) {
            __extends(Logout, _super);
            function Logout() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Logout.prototype.getStore = function () { };
            return Logout;
        }(System_8.sdata.QShopRow));
        models.Logout = Logout;
        function getCookie(cookiename) {
            var cookiestring = RegExp("" + cookiename + "[^;,]+$").exec(document.cookie);
            return decodeURIComponent(!!cookiestring ? cookiestring.toString().replace(/^[^=]+./, "") : "");
        }
        function getKey() {
            var id = getCookie('id');
            if (id && (id = id.trim()) != '')
                return id;
            return 'new_account';
        }
        var Login = (function (_super) {
            __extends(Login, _super);
            function Login(id) {
                return _super.call(this, id || Corelib_7.basic.New()) || this;
            }
            Object.defineProperty(Login.prototype, "IsLogged", {
                get: function () { return this.get(DPIsLogged); },
                enumerable: true,
                configurable: true
            });
            Login.prototype.Freeze = function () {
            };
            Login.copy = function (source, dest, startIdx, max) {
                if (max === void 0) { max = 16; }
                var mx = Math.min(source.length, max);
                for (var i = 0; i < source.length; i++)
                    dest[i + startIdx] = source[i] == 0 ? 128 : source[i];
                for (; i < max; i++) {
                    dest[startIdx + i] = 128;
                }
            };
            Login.prototype.getEncripter = function (pwd) {
            };
            Login.byte2Hex = function (ns) {
                var s = "";
                for (var i = 0; i < ns.length; i++) {
                    var n = ns[i];
                    if (n < 16)
                        s += "0" + n.toString(16);
                    else
                        s += n.toString(16);
                }
                return s.toUpperCase();
            };
            Login.getKey = function (keyString, keySize) {
                if (keySize === void 0) { keySize = 32; }
                var key = new Array(keySize);
                var key1 = this.getBytes(keyString);
                Login.copy(key1.slice(0, keySize), key, 0, keySize);
                return key;
            };
            Login.getBytes = function (str) {
                var key1 = Corelib_7.encoding.UTF8.GetBytes(Corelib_7.encoding.Utf8.encode(str || ""));
                if (key1[key1.length - 1] == 0)
                    key1.pop();
                return key1;
            };
            Login.prototype.ReGenerateEncPwd = function (key, password) {
                var x = new Corelib_7.crypto.AesCBC(Login.getKey(key).slice());
                var encX = x.Encrypt(Login.getBytes(password));
                this.EncPwd = Login.byte2Hex(encX);
            };
            Login.__fields__ = function () { return [DPIsLogged, Login.DPUsername, Login.DPPwd, Login.DPIdentification, Login.DPClient, Login.DPEncPwd]; };
            Login.prototype.getStore = function () { return Login.pStore; };
            Login.prototype.OnMessage = function (invoke) {
                this.OnPropertyChanged(DPIsLogged, invoke);
            };
            Login.prototype.FromJson = function (json, context, update) {
                if (typeof json === 'number') {
                    if (this.Stat >= System_8.sdata.DataStat.Updating)
                        return this;
                    this.Id = json;
                    this.set(System_8.sdata.DataRow.DPStat, System_8.sdata.DataStat.Updating);
                    System_8.Controller.ProxyData.Default.Request(this.constructor, "UPDATE", this, this);
                }
                else {
                    Corelib_7.bind.DObject.prototype.FromJson.call(this, json, context, update);
                    if (json != null && json.IsFrozen == true) {
                        this.Freeze();
                    }
                }
                return this;
            };
            Login.DPUsername = Corelib_7.bind.DObject.CreateField("Username", String, null);
            Login.DPPwd = Corelib_7.bind.DObject.CreateField("Pwd", String, "", function (e) { return e.__this.ReGenerateEncPwd(e.__this instanceof Agent ? getKey() : e._new, e._new); }, undefined, Corelib_7.bind.PropertyAttribute.NonSerializable | Corelib_7.bind.PropertyAttribute.Private);
            Login.DPEncPwd = Corelib_7.bind.DObject.CreateField("EncPwd", String, null);
            Login.DPIdentification = Corelib_7.bind.DObject.CreateField("Identification", String, undefined);
            Login.DPClient = Corelib_7.bind.DObject.CreateField("Client", models.Client, null);
            Login.pStore = new Corelib_7.collection.Dictionary("Signup", false);
            return Login;
        }(System_8.sdata.QShopRow));
        models.Login = Login;
        var Agent = (function (_super) {
            __extends(Agent, _super);
            function Agent(id) {
                return _super.call(this, id) || this;
            }
            Agent.__fields__ = function () {
                return [
                    Agent.DPIsDisponible,
                    Agent.DPPermission,
                    Agent.DPName
                ];
            };
            Agent.getById = function (id, type) {
                return Agent.pstore.Get(id);
            };
            Agent.prototype.getStore = function () { return Agent.pstore; };
            Agent.ctor = function () {
                this.DPIsDisponible = Corelib_7.bind.DObject.CreateField("IsDisponible", Boolean, null);
                this.DPPermission = Corelib_7.bind.DObject.CreateField('Permission', Number, 0);
                this.DPName = Corelib_7.bind.DObject.CreateField("Name", String);
            };
            Agent.prototype.toString = function () {
                var l = this;
                var c = l && l.Client;
                var fn = c && c.FullName || '';
                var tel = c && c.Tel || '';
                return models.AgentPermissions[this.Permission || 1] + ' : ' + fn + ' / ' + tel;
            };
            Agent.pstore = new Corelib_7.collection.Dictionary("Agents", true);
            return Agent;
        }(Login));
        models.Agent = Agent;
        var Agents = (function (_super) {
            __extends(Agents, _super);
            function Agents(_parent) {
                return _super.call(this, _parent, Agent, function (id) { return new Agent(id); }) || this;
            }
            Object.defineProperty(Agents.prototype, "ArgType", {
                get: function () { return Agent; },
                enumerable: true,
                configurable: true
            });
            Agents.prototype.getArgType = function (json) { return Agent; };
            Agents.prototype.GetType = function () { return Agents; };
            return Agents;
        }(System_8.sdata.DataTable));
        models.Agents = Agents;
        var Signup = (function (_super) {
            __extends(Signup, _super);
            function Signup() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return Signup;
        }(Login));
        models.Signup = Signup;
        var Signout = (function (_super) {
            __extends(Signout, _super);
            function Signout() {
                return _super.call(this, Corelib_7.basic.New()) || this;
            }
            Signout.__fields__ = function () {
                return [];
            };
            Signout.prototype.getStore = function () { return Signout.pStore; };
            Signout.prototype.GetType = function () { return Signout; };
            Signout.pStore = new Corelib_7.collection.Dictionary("Signout", false);
            return Signout;
        }(System_8.sdata.QShopRow));
        models.Signout = Signout;
        var Logins = (function (_super) {
            __extends(Logins, _super);
            function Logins(_parent, items) {
                return _super.call(this, _parent, Login, function (id) { return new Login(); }, items) || this;
            }
            Object.defineProperty(Logins.prototype, "ArgType", {
                get: function () { return Facture; },
                enumerable: true,
                configurable: true
            });
            Logins.prototype.getArgType = function (json) { return Facture; };
            Logins.prototype.GetType = function () { return Factures; };
            Logins.prototype.OnDeserialize = function (list) {
                this.Order(function (a, b) { return a.Client.Id > b.Client.Id; });
            };
            return Logins;
        }(System_8.sdata.DataTable));
        models.Logins = Logins;
        var QData = (function (_super) {
            __extends(QData, _super);
            function QData() {
                var _this = _super.call(this, Corelib_7.basic.New()) || this;
                _this.oacd = { Owner: _this, Invoke: _this.OnArticlesChanged };
                _this.articles = new Articles(_this);
                _this.set(QData.DPAgents, new models.Agents(_this));
                _this.set(QData.DPProducts, new Products(_this));
                _this.set(QData.DPFactures, new Factures(_this));
                _this.set(QData.DPCostmers, new Costumers(_this));
                _this.set(QData.DPCategories, new Categories(_this));
                _this.set(QData.DPFournisseurs, new Fournisseurs(_this));
                _this.set(QData.DPProducts, new Products(_this));
                models.SVersment;
                _this.set(QData.DPProjets, new Projets(_this));
                _this.set(QData.DPSFactures, new SFactures(_this));
                _this.set(QData.DPSMSs, new models.SMSs("General", "all"));
                Corelib_7.bind.NamedScop.Create("qdata", _this);
                return _this;
            }
            QData.prototype.getStore = function () { return QData.pStore; };
            QData.__fields__ = function () {
                return [QData.DPProducts, QData.DPSelectedFacture, QData.DPFactures, QData.DPAgents, this.DPCostmers,
                    QData.DPCategories, QData.DPSFactures, QData.DPFournisseurs,];
            };
            Object.defineProperty(QData.prototype, "Products", {
                get: function () { return this.get(QData.DPProducts); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(QData.prototype, "Categories", {
                get: function () { return this.get(QData.DPCategories); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(QData.prototype, "Factures", {
                get: function () { return this.get(QData.DPFactures); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(QData.prototype, "SFactures", {
                get: function () { return this.get(QData.DPSFactures); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(QData.prototype, "Costumers", {
                get: function () { return this.get(QData.DPCostmers); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(QData.prototype, "Projets", {
                get: function () { return this.get(QData.DPProjets); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(QData.prototype, "Fournisseurs", {
                get: function () { return this.get(QData.DPFournisseurs); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(QData.prototype, "Agents", {
                get: function () { return this.get(QData.DPAgents); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(QData.prototype, "SMSs", {
                get: function () { return this.get(QData.DPSMSs); },
                enumerable: true,
                configurable: true
            });
            QData.prototype.onCurrentFactureChanged = function (e) {
                if (e._old) {
                    var o = e._old.Articles;
                    for (var i = 0, l = o.Count; i < l; i++) {
                        var j = o.Get(i);
                        j.Product.CurrentArticle = null;
                    }
                    this.articles.Clear();
                    o.Unlisten = this.oacd;
                }
                if (e._new) {
                    var o = e._new.Articles;
                    for (var i = 0, l = o.Count; i < l; i++) {
                        var j = o.Get(i);
                        var p = j.Product;
                        if (p)
                            p.CurrentArticle = j;
                        this.articles.Add(j);
                    }
                    o.Listen = this.oacd;
                }
            };
            QData.prototype.OnArticlesChanged = function (e) {
                switch (e.event) {
                    case Corelib_7.collection.CollectionEvent.Added:
                        e.newItem.Product.CurrentArticle = e.newItem;
                        this.articles.Insert(e.startIndex, e.newItem);
                        break;
                    case Corelib_7.collection.CollectionEvent.Cleared:
                        var o = this.articles;
                        for (var i = 0, l = o.Count; i < l; i++) {
                            var j = o.Get(i);
                            j.Product.CurrentArticle = null;
                        }
                        this.articles.Clear();
                        break;
                    case Corelib_7.collection.CollectionEvent.Removed:
                        e.oldItem.Product.CurrentArticle = null;
                        this.articles.RemoveAt(e.startIndex);
                        break;
                    case Corelib_7.collection.CollectionEvent.Replace:
                        e.oldItem.Product.CurrentArticle = null;
                        e.newItem.Product.CurrentArticle = e.newItem;
                        this.articles.Set(e.startIndex, e.newItem);
                        break;
                    case Corelib_7.collection.CollectionEvent.Reset:
                        var o = this.articles;
                        for (var i = 0, l = o.Count; i < l; i++) {
                            var j = o.Get(i);
                            j.Product.CurrentArticle = null;
                        }
                        this.articles.Clear();
                        var o = this.SelectedFacture.Articles;
                        for (var i = 0, l = o.Count; i < l; i++) {
                            var j = o.Get(i);
                            j.Product.CurrentArticle = j;
                            this.articles.Add(j);
                        }
                        break;
                }
            };
            QData.prototype.Clear = function () {
                var c = this.GetValues();
                for (var i = 0; i < c.length; i++) {
                    var j = c[i];
                    if (j instanceof System_8.sdata.DataTable) {
                        j.Clear();
                    }
                }
            };
            QData.pStore = new Corelib_7.collection.Dictionary("QData", true);
            QData.DPProducts = Corelib_7.bind.DObject.CreateField("Products", Products, null);
            QData.DPCategories = Corelib_7.bind.DObject.CreateField("Categories", Categories);
            QData.DPSelectedFacture = Corelib_7.bind.DObject.CreateField("SelectedFacture", Facture, null, function (e) { return e.__this.onCurrentFactureChanged(e); });
            QData.DPFactures = Corelib_7.bind.DObject.CreateField("Factures", Factures, null);
            QData.DPSFactures = Corelib_7.bind.DObject.CreateField("SFactures", SFactures, null);
            QData.DPCostmers = Corelib_7.bind.DObject.CreateField("Costumers", Costumers, null);
            QData.DPProjets = Corelib_7.bind.DObject.CreateField("Projets", Projets, null);
            QData.DPFournisseurs = Corelib_7.bind.DObject.CreateField("Fournisseurs", Fournisseurs, null);
            QData.DPAgents = Corelib_7.bind.DObject.CreateField("Agents", Agents, null);
            QData.DPSMSs = Corelib_7.bind.DObject.CreateField("SMSs", models.SMSs);
            return QData;
        }(System_8.sdata.QShopRow));
        models.QData = QData;
        var IsAdmin = (function (_super) {
            __extends(IsAdmin, _super);
            function IsAdmin() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            IsAdmin.prototype.getStore = function () { return null; };
            return IsAdmin;
        }(System_8.sdata.QShopRow));
        models.IsAdmin = IsAdmin;
        var IsSecured = (function (_super) {
            __extends(IsSecured, _super);
            function IsSecured() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            IsSecured.prototype.getStore = function () { return null; };
            return IsSecured;
        }(System_8.sdata.QShopRow));
        models.IsSecured = IsSecured;
        var TransferType;
        (function (TransferType) {
            TransferType[TransferType["Versment"] = 0] = "Versment";
            TransferType[TransferType["Facture"] = 1] = "Facture";
        })(TransferType = models.TransferType || (models.TransferType = {}));
        var EtatTransfer = (function (_super) {
            __extends(EtatTransfer, _super);
            function EtatTransfer() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            EtatTransfer.prototype.getStore = function () {
                return EtatTransfer._store;
            };
            EtatTransfer.prototype.Update = function () {
            };
            EtatTransfer.prototype.Upload = function () {
            };
            EtatTransfer.__fields__ = function () {
                return [this.DPType, this.DPDate, this.DPMontantEntree, this.DPMontantSortie, this.DPTransactionId, this.DPActualSold];
            };
            EtatTransfer._store = new Corelib_7.collection.Dictionary("EtatTransfer");
            EtatTransfer.DPType = Corelib_7.bind.DObject.CreateField('Type', Number, TransferType.Facture);
            EtatTransfer.DPDate = Corelib_7.bind.DObject.CreateField('Date', Date);
            EtatTransfer.DPMontantEntree = Corelib_7.bind.DObject.CreateField('MontantEntree', Number, 0);
            EtatTransfer.DPMontantSortie = Corelib_7.bind.DObject.CreateField('MontantSortie', Number, 0);
            EtatTransfer.DPTransactionId = Corelib_7.bind.DObject.CreateField('TransactionId', Number, 0);
            EtatTransfer.DPActualSold = Corelib_7.bind.DObject.CreateField('ActualSold', Number, 0);
            return EtatTransfer;
        }(System_8.sdata.DataRow));
        models.EtatTransfer = EtatTransfer;
        var EtatTransfers = (function (_super) {
            __extends(EtatTransfers, _super);
            function EtatTransfers(parent) {
                return _super.call(this, parent, EtatTransfer, function (id) { return new EtatTransfer(id); }) || this;
            }
            EtatTransfers.prototype.FromJson = function (json, x, update, callback) {
                _super.prototype.FromJson.call(this, json, x, update, callback);
                this.Recalc();
                return this;
            };
            EtatTransfers.prototype.Recalc = function () {
                this.Sold = (this.TotalSortie || 0) - (this.TotalEntree || 0);
            };
            EtatTransfers.__fields__ = function () {
                return [this.DPTotalEntree, this.DPTotalSortie, this.DPIsVente, this.DPSold];
            };
            EtatTransfers.prototype.ReOrder = function () {
                this.OrderBy(function (a, b) { return (b.Date.getTime() - a.Date.getTime()); });
                var l = this.AsList();
                var c = 0;
                for (var i = l.length - 1; i >= 0; i--) {
                    var v = l[i];
                    var d = (v.MontantSortie || 0) - (v.MontantEntree || 0);
                    c += d;
                    v.ActualSold = this.IsVente ? c : -c;
                }
            };
            EtatTransfers.DPTotalEntree = Corelib_7.bind.DObject.CreateField('TotalEntree', Number, 0, function (e) {
                e.__this.Recalc();
            });
            EtatTransfers.DPTotalSortie = Corelib_7.bind.DObject.CreateField('TotalSortie', Number, 0, function (e) {
                e.__this.Recalc();
            });
            EtatTransfers.DPSold = Corelib_7.bind.DObject.CreateField('Sold', Number, 0);
            EtatTransfers.DPIsVente = Corelib_7.bind.DObject.CreateField('IsVente', Boolean, true);
            return EtatTransfers;
        }(System_8.sdata.DataTable));
        models.EtatTransfers = EtatTransfers;
    })(models = exports.models || (exports.models = {}));
    (function (models) {
        var Mail = (function (_super) {
            __extends(Mail, _super);
            function Mail(id) {
                return _super.call(this, id) || this;
            }
            Mail.prototype.getStore = function () {
                return null;
            };
            Object.defineProperty(Mail.prototype, "From", {
                get: function () { return this.get(Mail.DPFrom); },
                set: function (v) { this.set(Mail.DPFrom, v); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Mail.prototype, "To", {
                get: function () { return this.get(Mail.DPTo); },
                set: function (v) { this.set(Mail.DPTo, v); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Mail.prototype, "Subject", {
                get: function () { return this.get(Mail.DPSubject); },
                set: function (v) { this.set(Mail.DPSubject, v); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Mail.prototype, "Body", {
                get: function () { return this.get(Mail.DPBody); },
                set: function (v) { this.set(Mail.DPBody, v); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Mail.prototype, "Readed", {
                get: function () { return this.get(Mail.DPReaded); },
                set: function (v) { this.set(Mail.DPReaded, v); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Mail.prototype, "Date", {
                get: function () { return this.get(Mail.DPDate); },
                set: function (v) { this.set(Mail.DPDate, v); },
                enumerable: true,
                configurable: true
            });
            Mail.__fields__ = function () { return [this.DPFrom, this.DPTo, this.DPSubject, this.DPBody, this.DPReaded, this.DPDate]; };
            Mail.ctor = function () {
                this.DPFrom = Corelib_7.bind.DObject.CreateField("From", models.Client, null, null, null, Corelib_7.bind.PropertyAttribute.SerializeAsId);
                this.DPTo = Corelib_7.bind.DObject.CreateField("To", models.Client, null, null, null, Corelib_7.bind.PropertyAttribute.SerializeAsId);
                this.DPSubject = Corelib_7.bind.DObject.CreateField("Subject", String);
                this.DPBody = Corelib_7.bind.DObject.CreateField("Body", String);
                this.DPReaded = Corelib_7.bind.DObject.CreateField("Readed", Boolean, null, null, null, Corelib_7.bind.PropertyAttribute.NonSerializable);
                this.DPDate = Corelib_7.bind.DObject.CreateField("Date", String, null, null, null, Corelib_7.bind.PropertyAttribute.NonSerializable);
            };
            Mail.New = function () {
                return new Mail(Corelib_7.basic.GuidManager.Next);
            };
            return Mail;
        }(System_8.sdata.QShopRow));
        models.Mail = Mail;
    })(models = exports.models || (exports.models = {}));
    (function (models) {
        var CArticle = (function (_super) {
            __extends(CArticle, _super);
            function CArticle(id) {
                var _this = _super.call(this, id) || this;
                if (!window['arr'])
                    window['arr'] = [_this];
                else
                    window['arr'].push(_this);
                return _this;
            }
            CArticle.prototype.getStore = function () {
                return CArticle.pstore;
            };
            CArticle.__fields__ = function () { return [this.DPCommand, this.DPFournisseur, this.DPProduct, this.DPQte, this.DPPrice, this.DPPriceMin, this.DPPriceMax, this.DPDateSel, this.DPProductName, this.DPLabel]; };
            CArticle.ctor = function () {
                this.DPCommand = Corelib_7.bind.DObject.CreateField("Command", Command, null, null, null, Corelib_7.bind.PropertyAttribute.SerializeAsId);
                this.DPFournisseur = Corelib_7.bind.DObject.CreateField("Fournisseur", models.Fournisseur, null, null, null, Corelib_7.bind.PropertyAttribute.SerializeAsId);
                this.DPProduct = Corelib_7.bind.DObject.CreateField("Product", models.Product, null, this.prototype.ProductChanged, null, Corelib_7.bind.PropertyAttribute.SerializeAsId);
                this.DPQte = Corelib_7.bind.DObject.CreateField("Qte", Number);
                this.DPPrice = Corelib_7.bind.DObject.CreateField("Price", Number);
                this.DPPriceMin = Corelib_7.bind.DObject.CreateField("PriceMin", Number);
                this.DPPriceMax = Corelib_7.bind.DObject.CreateField("PriceMax", Number);
                this.DPDateSel = Corelib_7.bind.DObject.CreateField("DateSel", Date);
                this.DPProductName = Corelib_7.bind.DObject.CreateField("ProductName", String, void 0, this.prototype.ProductNameChanged);
                this.DPLabel = Corelib_7.bind.DObject.CreateField("Label", String, void 0, void 0, void 0, Corelib_7.bind.PropertyAttribute.Private);
            };
            CArticle.prototype.toString = function () {
                return this.Label || (this.Product && this.Product.toString());
            };
            CArticle.prototype.isNullOrWhiteSpace = function (s) {
                return s == null || s.trim() == "";
            };
            CArticle.prototype.ProductNameChanged = function (e) {
                this.setProduct(this.Product, e._new);
            };
            CArticle.prototype.ProductChanged = function (e) {
                this.setProduct(e._new, this.ProductName);
            };
            CArticle.prototype.setProduct = function (p, name) {
                if (this.isNullOrWhiteSpace(name))
                    this.Label = (p && p.toString()) || "";
                else
                    this.Label = name;
            };
            CArticle.pstore = new Corelib_7.collection.Dictionary("CARTICLES");
            return CArticle;
        }(System_8.sdata.QShopRow));
        models.CArticle = CArticle;
        Corelib_7.bind.Register({
            Name: "TLabel",
            Todo: function (ji, e) {
                var _new = e._new;
                var _old = e._old;
                var obs = ji.getValue('obs');
                obs.Me = _new;
            },
            OnInitialize: function (ji, e) {
                var getLabel = ji.dom.getAttribute('get-label') || 'Label';
                var setLabel = ji.dom.getAttribute('set-label') || 'ProductName';
                var obs = new Corelib_7.bind.Observer(ji.Scop.Value, [getLabel]);
                function setValue(dom, value) {
                    if (dom instanceof HTMLInputElement)
                        dom.value = value || "";
                    else
                        dom.innerText = value || "";
                }
                obs.OnPropertyChanged(Corelib_7.bind.Observer.DPValue, function (s, e) { setValue(this.dom, e._new); }, ji);
                setValue(ji.dom, obs.Value);
                if (ji.dom instanceof HTMLInputElement) {
                    ji.dom.addEventListener('change', function (e) {
                        var c = ji.Scop.Value;
                        if (c)
                            c[setLabel] = ji.dom.value;
                    }, { capture: true });
                }
                ji.addValue('obs', obs);
                this.Todo(ji, { _new: ji.Scop.Value });
            },
        });
        var CArticles = (function (_super) {
            __extends(CArticles, _super);
            function CArticles(parent) {
                return _super.call(this, parent, models.CArticle, function (id) { return new CArticle(id); }) || this;
            }
            Object.defineProperty(CArticles.prototype, "Command", {
                get: function () { return this.get(CArticles.DPCommand); },
                set: function (v) { this.set(CArticles.DPCommand, v); },
                enumerable: true,
                configurable: true
            });
            CArticles.__fields__ = function () { return [this.DPCommand]; };
            CArticles.ctor = function () {
                this.DPCommand = Corelib_7.bind.DObject.CreateField("Command", Command);
            };
            CArticles.prototype.FromJson = function (json, x, update, callback) {
                this.Clear();
                return _super.prototype.FromJson.call(this, json, x, update, callback);
            };
            return CArticles;
        }(System_8.sdata.DataTable));
        models.CArticles = CArticles;
        var Command = (function (_super) {
            __extends(Command, _super);
            function Command(id) {
                var _this = _super.call(this, id) || this;
                _this.Articles = new CArticles(_this);
                return _this;
            }
            Command.prototype.getStore = function () {
                return Command.pstore;
            };
            Object.defineProperty(Command.prototype, "Articles", {
                get: function () { return this.get(Command.DPArticles); },
                set: function (v) { this.set(Command.DPArticles, v); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Command.prototype, "Date", {
                get: function () { return this.get(Command.DPDate); },
                set: function (v) { this.set(Command.DPDate, v); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Command.prototype, "IsOpen", {
                get: function () { return this.get(Command.DPIsOpen); },
                set: function (v) { this.set(Command.DPIsOpen, v); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Command.prototype, "LockedBy", {
                get: function () { return this.get(Command.DPLockedBy); },
                set: function (v) { this.set(Command.DPLockedBy, v); },
                enumerable: true,
                configurable: true
            });
            Command.__fields__ = function () { return [this.DPArticles, this.DPDate, this.DPIsOpen, this.DPLockedBy]; };
            Command.ctor = function () {
                this.DPArticles = Corelib_7.bind.DObject.CreateField("Articles", CArticles);
                this.DPDate = Corelib_7.bind.DObject.CreateField("Date", Date);
                this.DPIsOpen = Corelib_7.bind.DObject.CreateField("IsOpen", Boolean);
                this.DPLockedBy = Corelib_7.bind.DObject.CreateField("LockedBy", models.Agent);
            };
            Command.pstore = new Corelib_7.collection.Dictionary("Command");
            return Command;
        }(System_8.sdata.QShopRow));
        models.Command = Command;
        var Commands = (function (_super) {
            __extends(Commands, _super);
            function Commands() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Commands.__fields__ = function () { return []; };
            Commands.ctor = function () { };
            return Commands;
        }(System_8.sdata.DataTable));
        models.Commands = Commands;
        var Statstics = (function (_super) {
            __extends(Statstics, _super);
            function Statstics() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Statstics.prototype.getStore = function () { return null; };
            Statstics.prototype.Update = function () { };
            Statstics.prototype.Upload = function () { };
            return Statstics;
        }(System_8.sdata.DataRow));
        models.Statstics = Statstics;
    })(models = exports.models || (exports.models = {}));
    (function (models) {
        var Ticket = (function (_super) {
            __extends(Ticket, _super);
            function Ticket() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Ticket.ctor = function () {
                this.DPPrixAchat = Corelib_7.bind.DObject.CreateField("PrixAchat", Number, 0);
                this.DPPrixVent = Corelib_7.bind.DObject.CreateField("PrixVent", Number, 0);
                this.DPCount = Corelib_7.bind.DObject.CreateField("Count", Number, 0);
                this.DPLabel = Corelib_7.bind.DObject.CreateField("Label", String, "");
            };
            Ticket.__fields__ = function () { return [this.DPPrixAchat, this.DPPrixVent, this.DPCount, this.DPLabel]; };
            Ticket.New = function (pa, pv, c, l) {
                var t = new Ticket();
                t.PrixAchat = pa;
                t.PrixVent = pv;
                t.Count = c;
                t.Label = l;
                return t;
            };
            return Ticket;
        }(Corelib_7.bind.DObject));
        models.Ticket = Ticket;
        var Tickets = (function (_super) {
            __extends(Tickets, _super);
            function Tickets() {
                var _this = _super.call(this) || this;
                _this.Values = new Corelib_7.collection.List(Ticket);
                return _this;
            }
            Tickets.prototype.Clear = function () {
                this.Values.Clear();
                this.Response = null;
                return this;
            };
            Tickets.ctor = function () {
                this.DPPrinterName = Corelib_7.bind.DObject.CreateField("PrinterName", String, undefined);
                this.DPValues = Corelib_7.bind.DObject.CreateField("Values", Corelib_7.reflection.GenericType.GetType(Corelib_7.collection.List, [Ticket]), undefined);
            };
            Tickets.__fields__ = function () { return [this.DPPrinterName, this.DPValues, this.DPResponse]; };
            Tickets.test = function () {
                var t = new Tickets();
                for (var i = 0; i < 200; i++)
                    t.Values.Add(Ticket.New(12, 23, 4, "Coude 110"));
                t.Values.Add(Ticket.New(12, 23, 4, "PVC 50"));
                t.Values.Add(Ticket.New(12, 123, 4, "Junker 10L"));
                t.Values.Add(Ticket.New(122, 23, 14, "Slimane Achour"));
                t.PrinterName = "Microsoft Print to PDF";
                return t;
            };
            Tickets.prototype.From = function (f) {
                if (f instanceof models.SFactures) {
                    for (var i = 0; i < f.Count; i++) {
                        this.From(f.Get(i));
                    }
                    return this;
                }
                var arts = f.Articles;
                for (var i = 0; i < arts.Count; i++) {
                    var a = arts.Get(i);
                    this.Values.Add(Ticket.New(a.PSel, a.Value, a.Qte, a.Product.toString()));
                }
                return this;
            };
            Tickets.From = function (f, t) {
                var t = t || new Tickets();
                if (f instanceof models.SFactures) {
                    for (var i = 0; i < f.Count; i++) {
                        this.From(f.Get(i), t);
                    }
                    return t;
                }
                var arts = f.Articles;
                for (var i = 0; i < arts.Count; i++) {
                    var a = arts.Get(i);
                    t.Values.Add(Ticket.New(a.PSel, a.Value, a.Qte, a.Product.toString()));
                }
                return t;
            };
            Tickets.DPResponse = Corelib_7.bind.DObject.CreateField("Response", Object, null, null, null, Corelib_7.bind.PropertyAttribute.NonSerializable);
            return Tickets;
        }(Corelib_7.bind.DObject));
        models.Tickets = Tickets;
        var Printer = (function (_super) {
            __extends(Printer, _super);
            function Printer() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Printer.__fields__ = function () { return [this.DPPrinters, this.DPSelectedPrinter, this.DPPrintToFile, this.DPResponse]; };
            Printer.ctor = function () {
            };
            Printer.DPPrinters = Corelib_7.bind.DObject.CreateField("Printers", Corelib_7.reflection.GenericType.GetType(Corelib_7.collection.List, [String]), null, null, null, Corelib_7.bind.PropertyAttribute.NonSerializable);
            Printer.DPSelectedPrinter = Corelib_7.bind.DObject.CreateField("SelectedPrinter", String);
            Printer.DPPrintToFile = Corelib_7.bind.DObject.CreateField("PrintToFile", Boolean);
            Printer.DPResponse = Corelib_7.bind.DObject.CreateField("Response", Object, null, null, null, Corelib_7.bind.PropertyAttribute.NonSerializable);
            return Printer;
        }(Corelib_7.bind.DObject));
        models.Printer = Printer;
        var PrintService = (function (_super) {
            __extends(PrintService, _super);
            function PrintService() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            PrintService.DPModel = Corelib_7.bind.DObject.CreateField("Model", String);
            PrintService.DPData = Corelib_7.bind.DObject.CreateField("Data", Object);
            PrintService.DPDataId = Corelib_7.bind.DObject.CreateField("DataId", Number);
            PrintService.DPResponse = Corelib_7.bind.DObject.CreateField("Response", Object);
            PrintService.DPHandlerId = Corelib_7.bind.DObject.CreateField("HandlerId", String);
            return PrintService;
        }(Corelib_7.bind.DObject));
        models.PrintService = PrintService;
    })(models = exports.models || (exports.models = {}));
    var Printing;
    (function (Printing) {
        var PrintData = (function (_super) {
            __extends(PrintData, _super);
            function PrintData() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Object.defineProperty(PrintData.prototype, "HandlerId", {
                get: function () { return this.get(PrintData.DPHandlerId); },
                set: function (v) { this.set(PrintData.DPHandlerId, v); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PrintData.prototype, "Model", {
                get: function () { return this.get(PrintData.DPModel); },
                set: function (v) { this.set(PrintData.DPModel, v); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PrintData.prototype, "Data", {
                get: function () { return this.get(PrintData.DPData); },
                set: function (v) { this.set(PrintData.DPData, v); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PrintData.prototype, "DataId", {
                get: function () { return this.get(PrintData.DPDataId); },
                set: function (v) { this.set(PrintData.DPDataId, v); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PrintData.prototype, "Response", {
                get: function () { return this.get(PrintData.DPResponse); },
                set: function (v) { this.set(PrintData.DPResponse, v); },
                enumerable: true,
                configurable: true
            });
            PrintData.__fields__ = function () { return [this.DPHandlerId, this.DPModel, this.DPData, this.DPDataId, this.DPResponse]; };
            PrintData.ctor = function () {
                this.DPHandlerId = Corelib_7.bind.DObject.CreateField("HandlerId", String);
                this.DPModel = Corelib_7.bind.DObject.CreateField("Model", String);
                this.DPData = Corelib_7.bind.DObject.CreateField("Data", Corelib_7.bind.DObject);
                this.DPDataId = Corelib_7.bind.DObject.CreateField("DataId", Number);
                this.DPResponse = Corelib_7.bind.DObject.CreateField("Response", Object);
            };
            return PrintData;
        }(Corelib_7.bind.DObject));
        Printing.PrintData = PrintData;
    })(Printing = exports.Printing || (exports.Printing = {}));
    (function (models) {
        var UserSetting = (function (_super) {
            __extends(UserSetting, _super);
            function UserSetting() {
                var _this = _super.call(this, Corelib_7.basic.New()) || this;
                var t = Corelib_7.bind.DObject.getFields(_this.GetType());
                for (var i = 0; i < t.length; i++) {
                    var p = t[i];
                    _super.prototype.set.call(_this, p, Corelib_7.basic.Settings.get("UserSetting." + p.Name));
                }
                return _this;
            }
            UserSetting.prototype.getStore = function () {
                return UserSetting._store;
            };
            UserSetting.prototype.Update = function () {
            };
            UserSetting.prototype.Upload = function () {
            };
            UserSetting.prototype.onPropertyChanged = function (e) {
                Corelib_7.basic.Settings.set("UserSetting." + e.prop.Name, e._new);
                Corelib_7.Notification.fire("UserSetting." + e.prop.Name + "Changed", [this, e]);
                Corelib_7.Notification.fire("UserSettingChanged", [this, e]);
                return _super.prototype.onPropertyChanged.call(this, e);
            };
            UserSetting._store = new Corelib_7.collection.Dictionary("UserSettings");
            __decorate([
                Corelib_7.attributes.property(Boolean),
                __metadata("design:type", Boolean)
            ], UserSetting.prototype, "TopNavBarVisibility", void 0);
            __decorate([
                Corelib_7.attributes.property(Boolean),
                __metadata("design:type", Boolean)
            ], UserSetting.prototype, "OfflineMode", void 0);
            __decorate([
                Corelib_7.attributes.property(Boolean),
                __metadata("design:type", Boolean)
            ], UserSetting.prototype, "AppTitleHidden", void 0);
            __decorate([
                Corelib_7.attributes.property(Boolean, void 0, 'show-sp-tooltips'),
                __metadata("design:type", Boolean)
            ], UserSetting.prototype, "ShowSPTooltips", void 0);
            __decorate([
                Corelib_7.attributes.property(Number),
                __metadata("design:type", Number)
            ], UserSetting.prototype, "opened_facture", void 0);
            __decorate([
                Corelib_7.attributes.property(Number),
                __metadata("design:type", Number)
            ], UserSetting.prototype, "opened_sfacture", void 0);
            __decorate([
                Corelib_7.attributes.property(String),
                __metadata("design:type", String)
            ], UserSetting.prototype, "selectedPage", void 0);
            __decorate([
                Corelib_7.attributes.property(String),
                __metadata("design:type", String)
            ], UserSetting.prototype, "opened_factures", void 0);
            __decorate([
                Corelib_7.attributes.property(String),
                __metadata("design:type", String)
            ], UserSetting.prototype, "opened_sfactures", void 0);
            return UserSetting;
        }(System_8.sdata.DataRow));
        models.UserSetting = UserSetting;
        UserSetting.Default = new UserSetting();
    })(models = exports.models || (exports.models = {}));
    function total(a) {
        if (a == null)
            return 0;
        var r = 0;
        for (var i = 0, l = a.Count; i < l; i++)
            r += a.Get(i).Montant;
        return r;
    }
    Corelib_7.bind.Register(new Corelib_7.bind.Job('totalarray', function (ji, e) {
        var c = ji.Scop.Value;
        var dm = ji.dom;
        dm.innerHTML = (c == null ? '<span style="color:red">0.00 DZD</span>' : (total(c)) + ' DZD');
    }, null, null, function (ji, e) {
        var c = ji.Scop.Value;
        var dm = ji.dom;
        dm.innerHTML = (c == null ? '<span style="color:red">0.00 DZD</span>' : (total(c)) + ' DZD');
    }, null));
    Corelib_7.bind.Register(new Corelib_7.bind.Job('jobi', function (ji, e) {
        var dm = ji.dom;
        dm.textContent = (ji.Scop.Value || 0) + ' Articles';
    }, null, null, function (ji, e) {
        var dm = ji.dom;
        dm.textContent = (ji.Scop.Value || 0) + ' Articles';
    }, null));
});
define("Apps/Login", ["require", "exports", "../lib/Q/sys/Corelib", "../lib/q/sys/UI", "abstract/Models", "abstract/extra/Common"], function (require, exports, Corelib_8, UI_12, Models_19, Common_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var key;
    __global.ApiServer = new System.basics.Url(envirenment.isChromeApp ? 'http://127.0.0.1/' : location.origin);
    var onSigninStatChanged = new Corelib_8.bind.EventListener(key = Math.random() * 2099837662);
    var GData;
    Common_4.GetVars(function (v) { GData = v; return !true; });
    var Apps;
    (function (Apps) {
        var AuthentificationApp = (function (_super) {
            __extends(AuthentificationApp, _super);
            function AuthentificationApp(redirectApp) {
                var _this = _super.call(this, key, onSigninStatChanged) || this;
                _this.redirectApp = redirectApp;
                _this.auth = Corelib_8.thread.Dispatcher.cretaeJob(_this.Login, [], _this, true);
                _this.autoAuth = Corelib_8.thread.Dispatcher.cretaeJob(_this._AutoLogin, [], _this, true);
                window['auth'] = _this;
                GData.user.OnMessage(function (s, ev) { return onSigninStatChanged.Invoke(key, [ev._new]); });
                onSigninStatChanged.On = function (v) {
                    if (v)
                        AuthentificationApp.Download();
                    else
                        _this.fullInitialize();
                    _this.OnStatStatChanged.PInvok(key, [_this, v]);
                };
                return _this;
            }
            Object.defineProperty(AuthentificationApp.prototype, "RedirectApp", {
                get: function () { return this.redirectApp; },
                set: function (v) { },
                enumerable: true,
                configurable: true
            });
            AuthentificationApp.prototype.IsLogged = function (callback, param) {
                callback(GData.user.IsLogged, param);
            };
            AuthentificationApp.prototype.createSignupPage = function () {
                var p = new UI_12.UI.Page(this, 'Signup', 'Signup');
                p.OnInitialized = function (p) { return p.Add(new UI_12.UI.TControl('Client.signup', GData.user)); };
                this.AddPage(this._signupPage = p);
            };
            AuthentificationApp.prototype.createLoginPage = function () {
                var p = new UI_12.UI.Page(this, 'Login', 'Login');
                p.OnInitialized = function (p) { return p.Add(new UI_12.UI.TControl('Client.login', GData.user)); };
                this.AddPage(this._loginPage = p);
            };
            AuthentificationApp.prototype.AutoLogin = function () {
                var ident = Corelib_8.basic.Settings.get("Identification");
                GData.user.Identification = ident;
                Corelib_8.thread.Dispatcher.Push(this.autoAuth);
            };
            AuthentificationApp.prototype.Login = function () {
                var _this = this;
                var isl = GData.user.IsLogged;
                Corelib_8.Api.RiseApi("Auth", {
                    callback: function (c, p) {
                        if (!p || !GData.user.IsLogged)
                            _this.fullInitialize();
                        _this.OnStatStatChanged.PInvok(key, [_this, p]);
                    }, data: this
                });
            };
            AuthentificationApp.prototype._AutoLogin = function () {
                var _this = this;
                var isl = GData.user.IsLogged;
                Corelib_8.Api.RiseApi("autoAuth", {
                    callback: function (c, p) {
                        if (!p || !GData.user.IsLogged)
                            _this.fullInitialize();
                        _this.OnStatStatChanged.PInvok(key, [_this, p]);
                    }, data: this
                });
            };
            AuthentificationApp.Download = function () {
                Corelib_8.Notification.fire('ReLoadUserSetting', [Models_19.models.UserSetting.Default]);
                if (this.dx) {
                    GData.spin.Pause();
                    return;
                }
                this.dx = true;
                GData.__data.Clear();
                Corelib_8.Api.RiseApi('log', { callback: null, data: null });
                GData.requester.Push(Models_19.models.IsAdmin, new Models_19.models.IsAdmin(), null, function (s, r, iss) {
                    GData.spin.Start("Wait a moment");
                    GData.requester.Push(Models_19.models.Categories, GData.__data.Categories, null, function (d, r) { GData.spin.Message = "Categories"; GData.spin.Start("Wait a moment"); });
                    if (typeof __LOCALSAVE__ !== 'undefined')
                        GData.db.Get('Products').table.LoadTableFromDB(GData.__data.Products, function () {
                            GData.apis.Product.SmartUpdate(new Date(GData.db.Get('Products').info.LastUpdate || 0));
                        });
                    else {
                        GData.requester.Request(Models_19.models.Products, "GETCSV", null, null, function (pd, json, iss, req) {
                            GData.__data.Products.FromCsv(req.Response);
                        });
                    }
                    GData.requester.Push(Models_19.models.Costumers, GData.__data.Costumers, null, function (d, r) { GData.spin.Message = "Costumers"; });
                    if (iss)
                        GData.requester.Push(Models_19.models.Agents, GData.__data.Agents, null, function (d, r) { GData.spin.Message = "Agents"; });
                    GData.requester.Push(Models_19.models.IsAdmin, new Models_19.models.IsAdmin(), null, function (s, r, iss) {
                        GData.spin.Pause();
                        Corelib_8.Api.RiseApi('log', { callback: null, data: null });
                    });
                });
            };
            AuthentificationApp.prototype.initialize = function () {
                var _this = this;
                GData.requester.Request(Models_19.models.IsSecured, "GET", undefined, undefined, function (a, b, c) {
                    __global.https = b;
                    _this.AutoLogin();
                });
            };
            AuthentificationApp.prototype.fullInitialize = function () {
                if (this.finit)
                    return;
                if (this.IsInit)
                    this._initialize();
                else
                    this.OnInitialized = function (t) { return t._initialize(); };
            };
            AuthentificationApp.prototype._initialize = function () {
                _super.prototype.initialize.call(this);
                this.finit = true;
                this.createLoginPage();
                this.createSignupPage();
                initJobs.call(this);
                this.SelectedPage = this._loginPage;
            };
            AuthentificationApp.prototype.Signout = function () {
            };
            AuthentificationApp.prototype.Logout = function () {
                logout(function (islogout) {
                    if (islogout) {
                    }
                    else {
                    }
                });
            };
            AuthentificationApp.prototype.OnAttached = function () {
                if (!this.isf)
                    return this.isf = true;
                this.fullInitialize();
            };
            AuthentificationApp.prototype.OnDetached = function () {
            };
            return AuthentificationApp;
        }(UI_12.UI.AuthApp));
        Apps.AuthentificationApp = AuthentificationApp;
    })(Apps = exports.Apps || (exports.Apps = {}));
    function initJobs() {
        var _this = this;
        Corelib_8.bind.Register(new Corelib_8.bind.Job('openlogin', null, null, null, function (ji, e) {
            var dm = ji.dom;
            dm.addEventListener('click', function () { return _this.Open(_this._loginPage); });
        }, null));
        Corelib_8.bind.Register(new Corelib_8.bind.Job('login', null, null, null, function (ji, e) {
            if (!GData.user.Client)
                GData.user.Client = new Models_19.models.Client(0);
            ji.dom.addEventListener('click', (function () { GData.spin.Start('login'); _this.Login(); }).bind(ji));
        }, null));
        Corelib_8.bind.Register(new Corelib_8.bind.Job('opensignup', undefined, undefined, undefined, function (ji, e) {
            var dm = ji.dom;
            if (!GData.user.Client)
                GData.user.Client = new Models_19.models.Client(0);
            dm.addEventListener('click', function () {
                _this.Open(_this._signupPage);
            });
        }, null));
        Corelib_8.bind.Register(new Corelib_8.bind.Job('signup', function () {
        }, null, null, function (ji, e) {
            ji.addEventListener('click', 'click', (function () {
                var t = ji.Scop;
                var v = t.Value;
                v.ReGenerateEncPwd("eval(code)", v.Pwd);
                GData.requester.Post(Models_19.models.Signup, t.Value, null, function (callback, p, iss) {
                    if (iss)
                        var m = UI_12.UI.Modal.ShowDialog('Signup', 'The Signup was successfully created .Please Send a message with your code to activate the account');
                    else {
                    }
                });
            }).bind(ji));
        }, null));
        Corelib_8.bind.Register(new Corelib_8.bind.Job('loggedjob', function (ji) {
            var b = ji.Scop.Value;
            var dm = ji.dom;
            if (b)
                dm.innerText = 'YOU ARE LOGGED';
            else {
                dm.innerText = 'YOU ARE NOT LOGGED';
            }
        }, null, null, function (j, e) { }, null));
    }
    Corelib_8.Api.RegisterApiCallback({
        Name: "ReAuth", DoApiCallback: function (a, b, c) {
            GData.spin.Start("Authenticating");
            GData.user.Stat = 0;
            GData.requester.Push(Models_19.models.Login, GData.user, null, function (callback, s, iss) {
                GData.spin.Pause();
                if (iss) {
                    var login = callback.data;
                    if (login.IsLogged) {
                        Corelib_8.basic.Settings.set("Identification", login.Identification);
                        c.callback && c.callback(c, true);
                        return;
                    }
                    UI_12.UI.InfoArea.push('<p class="text-center">Please Check Your <B>Password</B> AND <B>UserName</B></p>', false, 4000);
                }
                else
                    UI_12.UI.InfoArea.push('There no connection to server', false);
                this.OnInitialized = function (t) { return t.fullInitialize(); };
                c.callback && c.callback(c, false);
            });
        }, Owner: this
    });
    Corelib_8.Api.RegisterApiCallback({
        Name: "Auth", DoApiCallback: function (a, b, c) {
            GData.user.Stat = 0;
            function callback1(callback, s, iss) {
                GData.spin.Pause();
                if (iss) {
                    var login = callback.data;
                    if (login.IsLogged) {
                        saveLoginData(login);
                        c.callback && c.callback(c, true);
                        return;
                    }
                    UI_12.UI.InfoArea.push('<p class="text-center">Please Check Your <B>Password</B> AND <B>UserName</B></p>', false, 4000);
                }
                else
                    UI_12.UI.InfoArea.push('Error de connecter a server', false);
                c.callback && c.callback(c, false);
            }
            GData.requester.Push(Models_19.models.Login, GData.user, null, callback1);
        }, Owner: this
    });
    function saveLoginData(login) {
        Corelib_8.basic.Settings.set("Identification", login.Identification);
        Corelib_8.basic.Settings.set("LoginID", login.Id);
    }
    function loadLoginData(login, alsoID) {
        login.Identification = Corelib_8.basic.Settings.get("Identification");
        if (alsoID)
            login.Id = Corelib_8.basic.Settings.get("LoginID") || login.Id;
    }
    Corelib_8.Api.RegisterApiCallback({
        Name: "autoAuth", DoApiCallback: function (a, b, c) {
            GData.user.Stat = 0;
            function callback1(callback, s, iss) {
                GData.spin.Pause();
                if (iss) {
                    var login = callback.data;
                    if (login.IsLogged) {
                        Corelib_8.basic.Settings.set("Identification", login.Identification);
                        c.callback && c.callback(c, true);
                        return;
                    }
                    UI_12.UI.InfoArea.push('<p class="text-center">Please Check Your <B>Password</B> AND <B>UserName</B></p>', false, 4000);
                }
                else
                    UI_12.UI.InfoArea.push('Error de connecter a server', false);
                c.callback && c.callback(c, false);
            }
            GData.requester.Costume({ Method: 0, Url: '~checklogging' }, undefined, undefined, function (e, rslt, succ, req) {
                if (rslt === true) {
                    GData.spin.Pause();
                    GData.user.FromJson({ CheckLogging: true }, Corelib_8.encoding.SerializationContext.GlobalContext, true);
                    return;
                }
                loadLoginData(GData.user, true);
                GData.requester.Request(Models_19.models.Login, "AutoLogin", GData.user, GData.user, function (callback, s, iss) {
                    if (iss) {
                        var login = callback.data;
                        if (login.IsLogged) {
                            GData.spin.Pause();
                            saveLoginData(login);
                            c.callback && c.callback(c, true);
                            return;
                        }
                    }
                    GData.requester.Push(Models_19.models.Login, GData.user, null, callback1);
                });
            }, undefined);
        }, Owner: this
    });
    function logout(callback) {
        GData.requester.Get(Models_19.models.Login, GData.user, null, function (s, r, iss) {
            if (!iss) {
                callback(null);
            }
            else if (!GData.user.IsLogged) {
                Corelib_8.basic.Settings.set("Identification", "");
                GData.user.Identification = undefined;
                GData.user.Username = undefined;
                GData.user.Pwd = undefined;
                document.cookie = "id=;";
                callback && callback(true);
            }
            else {
                callback && callback(false);
            }
        }, function (r, t) {
            r.Url = "/~Signout";
        });
    }
    var lr;
    function myfunction(onConnected, onSignOut, onConnectionLost, param) {
        var intThread;
        var c = new XMLHttpRequest();
        var self = this;
        c.onreadystatechange = function () {
            if (this.readyState == 4)
                if (this.status == 200 && this.responseText == "true")
                    if (this.responseText == "true")
                        return onConnected(intThread, param);
                    else if (this.responseText == "false")
                        return onSignOut(intThread, param);
                    else
                        throw "Uknow stat";
                else
                    onConnectionLost(intThread, param);
        };
        c.onerror = function () {
            onConnectionLost(intThread, param);
        };
        intThread = setInterval(function () {
            c.open('get', __global.GetApiAddress('/~CheckLogging'));
            c.setRequestHeader('Access-Control-Allow-Origin', 'true');
            try {
                c.send();
                c.timeout = 10000;
            }
            catch (e) { }
        }, 12000);
    }
    myfunction(function (t, p) { }, function (t, p) { UI_12.UI.Desktop.Current.OpenSignin(); }, function (t, p) { UI_12.UI.Desktop.Current.OpenSignin(); }, this);
});
define("Apps/Calculator/Calc", ["require", "exports", "../../lib/Q/sys/UI", "../../lib/Q/sys/Corelib"], function (require, exports, UI_13, Corelib_9) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Calculator = (function (_super) {
        __extends(Calculator, _super);
        function Calculator() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.theNum = "";
            _this.oldNum = "";
            return _this;
        }
        Calculator.prototype.initialize = function () {
        };
        Calculator.prototype.OnCompileEnd = function (cnt) {
            _super.prototype.OnCompileEnd.call(this, cnt);
            var x = Corelib_9.query.$$(this._view);
            var ops = x.find(Corelib_9.query.hasClass, 'ops').toArray().sort(function (a, b) { return Number(a.textContent) - parseInt(b.textContent); });
            var num = x.find(Corelib_9.query.hasClass, 'num');
        };
        return Calculator;
    }(UI_13.UI.TControl));
    exports.Calculator = Calculator;
});
define("abstract/QShopApis", ["require", "exports", "../lib/q/sys/Corelib", "../lib/q/sys/System", "abstract/Models", "../lib/q/sys/QModel"], function (require, exports, Corelib_10, System_9, Models_20, QModel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var array_user = Models_20.models.Clients;
    var array_product = Models_20.models.Products;
    var array_Facture = Models_20.models.Factures;
    var array_Article = Models_20.models.Articles;
    var array_Client = Models_20.models.Clients;
    var array_Agent = Models_20.models.Agents;
    var array_Versment = Models_20.models.Versments;
    var array_Category = Models_20.models.Categories;
    var array_Picture = Models_20.models.Pictures;
    function serialize(obj) {
        var str = [];
        for (var p in obj)
            if (obj.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
        return str.join("&");
    }
    var Apis;
    (function (Apis) {
        var DataRow = (function (_super) {
            __extends(DataRow, _super);
            function DataRow(_root, costume, skipParseResponse, costumApis) {
                var _this = _super.call(this, true) || this;
                _this._root = _root;
                _this.skipParseResponse = skipParseResponse;
                if (!costume)
                    if (_root.indexOf('/_/') !== 0)
                        _this._root = '/_/' + _root;
                if (!costumApis) {
                    _this.ERegister(Corelib_10.net.WebRequestMethod.Get, 'GET', "Id=@Id", false);
                    _this.ERegister(Corelib_10.net.WebRequestMethod.Get, 'CREATE', "Id=@Id", false);
                    _this.ERegister(Corelib_10.net.WebRequestMethod.Delete, 'DELETE', "Id=@Id", false);
                    _this.ERegister(Corelib_10.net.WebRequestMethod.Post, 'SAVE', undefined, true);
                    _this.ERegister(Corelib_10.net.WebRequestMethod.Get, 'UPDATE', "Id=@Id", false);
                    _this.ERegister(Corelib_10.net.WebRequestMethod.Post, 'VALIDATE', "Id=@Id", true);
                    _this.ERegister(Corelib_10.net.WebRequestMethod.Set, 'SetProperty', "Id=@Id", true);
                    _this.ERegister(Corelib_10.net.WebRequestMethod.Create, 'CREATE', undefined, true);
                }
                return _this;
            }
            Object.defineProperty(DataRow.prototype, "Url", {
                get: function () {
                    return __global.GetApiAddress(this._root);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataRow.prototype, "ParseResponse", {
                get: function () { return !this.skipParseResponse; },
                enumerable: true,
                configurable: true
            });
            DataRow.getId = function (idata) {
                return (idata instanceof System_9.sdata.DataRow)
                    ? idata.Id.toString()
                    : (typeof idata === 'number' ? idata : idata.hasOwnProperty('Id') ? idata.Id : 0);
            };
            DataRow.prototype.addQuestionMark = function () {
                return true;
            };
            DataRow.prototype.GetRequest = function (idata, xshema, params) {
                var shema = this.GetMethodShema(xshema);
                if (shema && shema.ParamsFormat) {
                    var qs = shema.ParamsFormat.apply(params || {});
                }
                else if (params)
                    qs = serialize(params);
                return new Corelib_10.net.RequestUrl(qs ? this.Url + (this.addQuestionMark() ? "?" : '') + qs : this.Url, null, null, shema ? shema.Method : 0, shema.SendData);
            };
            DataRow.prototype.OnResponse = function (response, data, context) {
                if (this.ParseResponse)
                    return data && data.FromJson && data.FromJson(response, context, true);
                return data;
            };
            return DataRow;
        }(System_9.Controller.Api));
        Apis.DataRow = DataRow;
        var DataTable = (function (_super) {
            __extends(DataTable, _super);
            function DataTable(_root, costume) {
                var _this = _super.call(this, true) || this;
                _this._root = _root;
                if (!costume)
                    if (_root.indexOf('/_/') !== 0)
                        _this._root = '/_/' + _root;
                _this.ERegister(Corelib_10.net.WebRequestMethod.Get, "UPDATE", "Id=@Id", false);
                _this.ERegister(Corelib_10.net.WebRequestMethod.SUPDATE, "SUPDATE", "Date=@Date", false);
                _this.ERegister(Corelib_10.net.WebRequestMethod.Get, "GETCSV", "csv=true", false);
                return _this;
            }
            Object.defineProperty(DataTable.prototype, "Url", {
                get: function () {
                    return __global.GetApiAddress(this._root);
                },
                enumerable: true,
                configurable: true
            });
            DataTable.prototype.GetRequest = function (idata, xshema, params) {
                var shema = this.GetMethodShema(xshema);
                if (shema && shema.ParamsFormat)
                    var qs = shema.ParamsFormat.apply(params || {});
                else if (params)
                    qs = serialize(params);
                return new Corelib_10.net.RequestUrl(qs ? this.Url + "?" + qs : this.Url, null, null, shema ? shema.Method : 0, shema && shema.SendData);
            };
            DataTable.prototype.OnResponse = function (response, data, _context) {
                var ed = Date.now();
                if (response == null)
                    return;
                if (data) {
                    data.Stat = System_9.sdata.DataStat.Updating;
                    data.FromJson(response, _context);
                    data.Stat = System_9.sdata.DataStat.Updated;
                }
                return;
            };
            return DataTable;
        }(System_9.Controller.Api));
        Apis.DataTable = DataTable;
        var FactureBase = (function (_super) {
            __extends(FactureBase, _super);
            function FactureBase(root, costume) {
                var _this = _super.call(this, root, costume) || this;
                _this.ERegister(Corelib_10.net.WebRequestMethod.Get, 'OPEN', "Id=@Id&Operation=Open", false);
                _this.ERegister(Corelib_10.net.WebRequestMethod.Get, 'BENIFIT', "Id=@Id&Operation=Benifit", false);
                _this.ERegister(Corelib_10.net.WebRequestMethod.Close, 'CLOSE', "Id=@Id&Operation=Close&Force=@Force", false);
                _this.ERegister(Corelib_10.net.WebRequestMethod.Get, 'ISOPEN', "Id=@Id&Operation=IsOpen", false);
                _this.ERegister(Corelib_10.net.WebRequestMethod.Open, 'OPEN', "Id=@Id", false);
                _this.ERegister(Corelib_10.net.WebRequestMethod.Print, 'PRINT', "Id=@Id", false);
                _this.ERegister(Corelib_10.net.WebRequestMethod.Close, 'FORCECLOSE', "Id=@Id&Force=true", false);
                _this.ERegister(Corelib_10.net.WebRequestMethod.Post, 'SetProperty', "Set=@Property&Id=@Id&value=@Value", false);
                _this.ERegister(Corelib_10.net.WebRequestMethod.Post, 'SetInfo', "SetInfo&Id=@Id", true);
                return _this;
            }
            return FactureBase;
        }(DataRow));
        Apis.FactureBase = FactureBase;
        var UserSetting = (function (_super) {
            __extends(UserSetting, _super);
            function UserSetting() {
                return _super.call(this, 'usersetting') || this;
            }
            UserSetting.prototype.GetType = function () { return Models_20.models.UserSetting; };
            return UserSetting;
        }(DataRow));
        Apis.UserSetting = UserSetting;
        var Client = (function (_super) {
            __extends(Client, _super);
            function Client() {
                return _super.call(this, 'Client') || this;
            }
            Client.prototype.GetType = function () { return Models_20.models.Client; };
            return Client;
        }(DataRow));
        Apis.Client = Client;
        var SMS = (function (_super) {
            __extends(SMS, _super);
            function SMS() {
                return _super.call(this, 'SMS') || this;
            }
            SMS.prototype.GetType = function () { return Models_20.models.SMS; };
            return SMS;
        }(DataRow));
        Apis.SMS = SMS;
        var Projet = (function (_super) {
            __extends(Projet, _super);
            function Projet() {
                return _super.call(this, 'Projet') || this;
            }
            Projet.prototype.GetType = function () { return Models_20.models.Projet; };
            return Projet;
        }(DataRow));
        Apis.Projet = Projet;
        var Login = (function (_super) {
            __extends(Login, _super);
            function Login() {
                var _this = _super.call(this, '/~login', true) || this;
                _this.ERegister(Corelib_10.net.WebRequestMethod.Get, 'AutoLogin', "Identification=@Identification&Id=@Id", false);
                return _this;
            }
            Login.prototype.GetType = function () { return Models_20.models.Login; };
            Login.prototype.GetRequest = function (idata, xshema, params) {
                if (xshema == "AutoLogin")
                    return _super.prototype.GetRequest.call(this, idata, xshema, params);
                return new Corelib_10.net.RequestUrl(this.Url, null, null, Corelib_10.net.WebRequestMethod.Post);
            };
            return Login;
        }(DataRow));
        Apis.Login = Login;
        var LoginO = (function (_super) {
            __extends(LoginO, _super);
            function LoginO() {
                var _this = _super.call(this, 'Login', false) || this;
                _this.ERegister(Corelib_10.net.WebRequestMethod.Post, 'VALIDATE', "validate&Id=@Id", false);
                _this.ERegister(Corelib_10.net.WebRequestMethod.Post, 'LOCK', "lock&Id=@Id", false);
                _this.ERegister(Corelib_10.net.WebRequestMethod.Post, 'REMOVE', "remove&Id=@Id", false);
                return _this;
            }
            LoginO.prototype.GetType = function () { return Number; };
            return LoginO;
        }(DataRow));
        Apis.LoginO = LoginO;
        var OLogin = (function (_super) {
            __extends(OLogin, _super);
            function OLogin() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            OLogin.prototype.GetType = function () { return Models_20.models.Login; };
            return OLogin;
        }(DataRow));
        Apis.OLogin = OLogin;
        var IsAdmin = (function (_super) {
            __extends(IsAdmin, _super);
            function IsAdmin() {
                return _super.call(this, '/~IsAdmin', true) || this;
            }
            IsAdmin.prototype.GetType = function () { return Models_20.models.IsAdmin; };
            IsAdmin.prototype.GetRequest = function () { return new Corelib_10.net.RequestUrl(this.Url, null, null, Corelib_10.net.WebRequestMethod.Get); };
            return IsAdmin;
        }(DataRow));
        Apis.IsAdmin = IsAdmin;
        var IsSecured = (function (_super) {
            __extends(IsSecured, _super);
            function IsSecured() {
                return _super.call(this, '/~IsSecured', true) || this;
            }
            IsSecured.prototype.GetType = function () { return Models_20.models.IsSecured; };
            IsSecured.prototype.GetRequest = function () { return new Corelib_10.net.RequestUrl(this.Url, null, null, Corelib_10.net.WebRequestMethod.Get); };
            return IsSecured;
        }(DataRow));
        Apis.IsSecured = IsSecured;
        var Signup = (function (_super) {
            __extends(Signup, _super);
            function Signup() {
                return _super.call(this, '/~Signup', true) || this;
            }
            Signup.prototype.GetType = function () { return Models_20.models.Signup; };
            Signup.prototype.GetRequest = function () { return new Corelib_10.net.RequestUrl(this.Url, null, null, Corelib_10.net.WebRequestMethod.Post); };
            return Signup;
        }(DataRow));
        Apis.Signup = Signup;
        var Guid = (function (_super) {
            __extends(Guid, _super);
            function Guid() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Guid.prototype.GetType = function () { return Corelib_10.basic.iGuid; };
            Guid.prototype.GetRequest = function () { return new Corelib_10.net.RequestUrl(__global.GetApiAddress('/~Guid'), null, null, Corelib_10.net.WebRequestMethod.Get); };
            Guid.prototype.OnResponse = function (response, data, context) {
                return data;
            };
            return Guid;
        }(System_9.Controller.Api));
        Apis.Guid = Guid;
        var SessionId = (function (_super) {
            __extends(SessionId, _super);
            function SessionId() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            SessionId.prototype.GetType = function () { return Corelib_10.basic.SessionId; };
            SessionId.prototype.GetRequest = function () { return new Corelib_10.net.RequestUrl(__global.GetApiAddress('/~SessionId'), null, null, Corelib_10.net.WebRequestMethod.Get); };
            SessionId.prototype.OnResponse = function (response, data, context) {
                Corelib_10.basic.SessionId.parse(response);
                return response;
            };
            return SessionId;
        }(System_9.Controller.Api));
        Apis.SessionId = SessionId;
        var Signout = (function (_super) {
            __extends(Signout, _super);
            function Signout() {
                return _super.call(this, '/Signout', true) || this;
            }
            Signout.prototype.GetType = function () { return Models_20.models.Signout; };
            Signout.prototype.GetRequest = function () { return new Corelib_10.net.RequestUrl(this.Url, null, null, Corelib_10.net.WebRequestMethod.Post); };
            return Signout;
        }(DataRow));
        Apis.Signout = Signout;
        var Users = (function (_super) {
            __extends(Users, _super);
            function Users() {
                var _this = _super.call(this, 'Users') || this;
                _this = _super.call(this, "Users") || this;
                return _this;
            }
            Users.prototype.GetType = function () { return array_user; };
            return Users;
        }(DataTable));
        Apis.Users = Users;
        var Fournisseur = (function (_super) {
            __extends(Fournisseur, _super);
            function Fournisseur() {
                return _super.call(this, "Fournisseur") || this;
            }
            Fournisseur.prototype.GetType = function () { return Models_20.models.Fournisseur; };
            return Fournisseur;
        }(DataRow));
        Apis.Fournisseur = Fournisseur;
        var Fournisseurs = (function (_super) {
            __extends(Fournisseurs, _super);
            function Fournisseurs() {
                return _super.call(this, 'Fournisseurs') || this;
            }
            Fournisseurs.prototype.GetType = function () { return Models_20.models.Fournisseurs; };
            return Fournisseurs;
        }(DataTable));
        Apis.Fournisseurs = Fournisseurs;
        var Message = (function (_super) {
            __extends(Message, _super);
            function Message() {
                return _super.call(this, "CallBack") || this;
            }
            Message.prototype.GetType = function () { return QModel_1.models.Message; };
            Message.prototype.GetRequest = function (x) { return new Corelib_10.net.RequestUrl(__global.GetApiAddress("/_/CallBack?Id=" + x.Id), null, null, Corelib_10.net.WebRequestMethod.Post); };
            Message.prototype.OnResponse = function (response, data, context) {
                if (data != null)
                    if (data.privateDecompress)
                        return;
                return data && data.FromJson(response, context, true);
            };
            return Message;
        }(DataRow));
        Apis.Message = Message;
        var Product = (function (_super) {
            __extends(Product, _super);
            function Product() {
                var _this = _super.call(this, "Product") || this;
                _this.ERegister(Corelib_10.net.WebRequestMethod.Post, 'AVATAR', "Operation=@Operation&Name=@Name&Size=@Size&PID=@PID", true);
                return _this;
            }
            Product.prototype.GetType = function () { return Models_20.models.Product; };
            return Product;
        }(DataRow));
        Apis.Product = Product;
        var Products = (function (_super) {
            __extends(Products, _super);
            function Products() {
                var _this = _super.call(this, 'Products') || this;
                _this.ERegister(Corelib_10.net.WebRequestMethod.Print, "PRINT", "", true);
                return _this;
            }
            Products.prototype.GetType = function () { return array_product; };
            return Products;
        }(DataTable));
        Apis.Products = Products;
        var FakePrices = (function (_super) {
            __extends(FakePrices, _super);
            function FakePrices() {
                return _super.call(this, 'Prices') || this;
            }
            FakePrices.prototype.GetType = function () { return Models_20.models.FakePrices; };
            return FakePrices;
        }(DataTable));
        Apis.FakePrices = FakePrices;
        var Mails = (function (_super) {
            __extends(Mails, _super);
            function Mails() {
                var _this = _super.call(this, 'Mails') || this;
                _this.ERegister(Corelib_10.net.WebRequestMethod.Get, 'UNREADED', "from=@From&to=@To&unReader=true", false);
                _this.ERegister(Corelib_10.net.WebRequestMethod.Get, 'READED', "from=@From&to=@To&unReader=false", false);
                return _this;
            }
            Mails.prototype.GetType = function () { return Models_20.models.Mails; };
            return Mails;
        }(DataTable));
        Apis.Mails = Mails;
        var ProductsUpdater = (function (_super) {
            __extends(ProductsUpdater, _super);
            function ProductsUpdater() {
                return _super.call(this, 'Products') || this;
            }
            ProductsUpdater.prototype.GetType = function () { return array_product; };
            return ProductsUpdater;
        }(DataTable));
        Apis.ProductsUpdater = ProductsUpdater;
        var Clients = (function (_super) {
            __extends(Clients, _super);
            function Clients() {
                return _super.call(this, 'Clients') || this;
            }
            Clients.prototype.GetType = function () { return Models_20.models.Clients; };
            return Clients;
        }(DataTable));
        Apis.Clients = Clients;
        var SMSs = (function (_super) {
            __extends(SMSs, _super);
            function SMSs() {
                var _this = _super.call(this, 'SMSs') || this;
                _this.ERegister(Corelib_10.net.WebRequestMethod.Get, "UPDATE", "@param", false);
                return _this;
            }
            SMSs.prototype.GetType = function () { return Models_20.models.SMSs; };
            return SMSs;
        }(DataTable));
        Apis.SMSs = SMSs;
        var Projets = (function (_super) {
            __extends(Projets, _super);
            function Projets() {
                return _super.call(this, 'Projets') || this;
            }
            Projets.prototype.GetType = function () { return Models_20.models.Projets; };
            return Projets;
        }(DataTable));
        Apis.Projets = Projets;
        var FakePrice = (function (_super) {
            __extends(FakePrice, _super);
            function FakePrice() {
                return _super.call(this, "FakePrice") || this;
            }
            FakePrice.prototype.GetType = function () { return Models_20.models.FakePrice; };
            return FakePrice;
        }(DataRow));
        Apis.FakePrice = FakePrice;
        var Price = (function (_super) {
            __extends(Price, _super);
            function Price() {
                return _super.call(this, "Price") || this;
            }
            Price.prototype.GetType = function () { return Models_20.models.Price; };
            return Price;
        }(DataRow));
        Apis.Price = Price;
        var Mail = (function (_super) {
            __extends(Mail, _super);
            function Mail() {
                return _super.call(this, "Mail") || this;
            }
            Mail.prototype.GetType = function () {
                return Models_20.models.Mail;
            };
            return Mail;
        }(DataRow));
        Apis.Mail = Mail;
        var Facture = (function (_super) {
            __extends(Facture, _super);
            function Facture() {
                var _this = _super.call(this, "Facture") || this;
                _this.ERegister(Corelib_10.net.WebRequestMethod.Create, 'CREATE', "CId=@CId&Type=@Type&Abonment=@Abonment&TType=@Transaction", false);
                return _this;
            }
            Facture.prototype.GetType = function () { return Models_20.models.Facture; };
            return Facture;
        }(FactureBase));
        Apis.Facture = Facture;
        var SFacture = (function (_super) {
            __extends(SFacture, _super);
            function SFacture() {
                var _this = _super.call(this, "SFacture") || this;
                _this.ERegister(Corelib_10.net.WebRequestMethod.Create, 'CREATE', "FId=@FId&AId=@AId&Type=@Type&TType=@Transaction", false);
                return _this;
            }
            SFacture.prototype.GetType = function () { return Models_20.models.SFacture; };
            return SFacture;
        }(FactureBase));
        Apis.SFacture = SFacture;
        var Factures = (function (_super) {
            __extends(Factures, _super);
            function Factures() {
                var _this = _super.call(this, 'Factures') || this;
                _this.ERegister(Corelib_10.net.WebRequestMethod.Set, 'FREEZED', "Freezed=@Freezed", true);
                _this.ERegister(Corelib_10.net.WebRequestMethod.Get, 'LOADFREEZED', "Freezed=true&csv=@csv", true);
                return _this;
            }
            Factures.prototype.GetType = function () { return array_Facture; };
            return Factures;
        }(DataTable));
        Apis.Factures = Factures;
        var Command = (function (_super) {
            __extends(Command, _super);
            function Command() {
                var _this = _super.call(this, "Command") || this;
                _this.ERegister(Corelib_10.net.WebRequestMethod.Create, 'CREATE', "date=@Date", false);
                _this.ERegister(Corelib_10.net.WebRequestMethod.Get, 'OPEN', "operation=OPEN&Id=@Id", false);
                _this.ERegister(Corelib_10.net.WebRequestMethod.Get, 'CLOSE', "operation=CLOSE&Id=@Id", false);
                _this.ERegister(Corelib_10.net.WebRequestMethod.Get, 'GETARTICLES', "operation=GETARTICLES&Id=@Id", false);
                _this.ERegister(Corelib_10.net.WebRequestMethod.Get, "UPDATEDC", "", false);
                _this.ERegister(Corelib_10.net.WebRequestMethod.Print, "PRINT", "", false);
                return _this;
            }
            Command.prototype.GetType = function () { return Models_20.models.Command; };
            return Command;
        }(DataRow));
        Apis.Command = Command;
        var Commands = (function (_super) {
            __extends(Commands, _super);
            function Commands() {
                return _super.call(this, 'Commands') || this;
            }
            Commands.prototype.GetType = function () { return Models_20.models.Commands; };
            return Commands;
        }(DataTable));
        Apis.Commands = Commands;
        var CArticle = (function (_super) {
            __extends(CArticle, _super);
            function CArticle() {
                return _super.call(this, "CArticle") || this;
            }
            CArticle.prototype.GetType = function () { return Models_20.models.CArticle; };
            return CArticle;
        }(DataRow));
        Apis.CArticle = CArticle;
        var CArticles = (function (_super) {
            __extends(CArticles, _super);
            function CArticles() {
                var _this = _super.call(this, 'CArticles') || this;
                _this.ERegister(Corelib_10.net.WebRequestMethod.Get, "UPDATEDC", "", false);
                return _this;
            }
            CArticles.prototype.GetType = function () { return Models_20.models.CArticles; };
            return CArticles;
        }(DataTable));
        Apis.CArticles = CArticles;
        var Logins = (function (_super) {
            __extends(Logins, _super);
            function Logins() {
                return _super.call(this, 'Users') || this;
            }
            Logins.prototype.GetType = function () { return Models_20.models.Logins; };
            return Logins;
        }(DataTable));
        Apis.Logins = Logins;
        var Article = (function (_super) {
            __extends(Article, _super);
            function Article() {
                return _super.call(this, "Article") || this;
            }
            Article.prototype.GetType = function () { return Models_20.models.Article; };
            return Article;
        }(DataRow));
        Apis.Article = Article;
        var Articles = (function (_super) {
            __extends(Articles, _super);
            function Articles() {
                return _super.call(this, 'Articles') || this;
            }
            Articles.prototype.GetType = function () { return array_Article; };
            return Articles;
        }(DataTable));
        Apis.Articles = Articles;
        var Agent = (function (_super) {
            __extends(Agent, _super);
            function Agent() {
                return _super.call(this, 'Agent') || this;
            }
            Agent.prototype.GetType = function () { return Models_20.models.Agent; };
            return Agent;
        }(DataRow));
        Apis.Agent = Agent;
        var Agents = (function (_super) {
            __extends(Agents, _super);
            function Agents() {
                return _super.call(this, 'Agents') || this;
            }
            Agents.prototype.GetType = function () { return array_Agent; };
            return Agents;
        }(DataTable));
        Apis.Agents = Agents;
        var Versment = (function (_super) {
            __extends(Versment, _super);
            function Versment() {
                return _super.call(this, "Versment") || this;
            }
            Versment.prototype.GetType = function () { return Models_20.models.Versment; };
            return Versment;
        }(DataRow));
        Apis.Versment = Versment;
        var Versments = (function (_super) {
            __extends(Versments, _super);
            function Versments() {
                var _this = _super.call(this, 'Versments') || this;
                _this.ERegister(Corelib_10.net.WebRequestMethod.Get, "VFacture", "q=Facture&Facture=@Id", false);
                _this.ERegister(Corelib_10.net.WebRequestMethod.Get, "VClient", "q=Client&Client=@Id", false);
                _this.ERegister(Corelib_10.net.WebRequestMethod.Get, "VPeriod", "q=Period&From=@From&to=@To", false);
                _this.ERegister(Corelib_10.net.WebRequestMethod.Get, "VCassier", "q=Cassier&Cassier=@Id", false);
                _this.ERegister(Corelib_10.net.WebRequestMethod.Get, "VObservation", "q=Observation&Observation=@Observation", false);
                _this.ERegister(Corelib_10.net.WebRequestMethod.Get, "Facture.Total", "q=Facture&Facture=@Id&total", false);
                return _this;
            }
            Versments.prototype.GetType = function () { return Models_20.models.Versments; };
            return Versments;
        }(DataTable));
        Apis.Versments = Versments;
        var SVersment = (function (_super) {
            __extends(SVersment, _super);
            function SVersment() {
                return _super.call(this, "SVersment") || this;
            }
            SVersment.prototype.GetType = function () { return Models_20.models.SVersment; };
            return SVersment;
        }(DataRow));
        Apis.SVersment = SVersment;
        var SVersments = (function (_super) {
            __extends(SVersments, _super);
            function SVersments() {
                var _this = _super.call(this, 'SVersments') || this;
                _this.ERegister(Corelib_10.net.WebRequestMethod.Get, "VFacture", "q=Facture&Facture=@Id", false);
                _this.ERegister(Corelib_10.net.WebRequestMethod.Get, "VFournisseur", "q=Fournisseur&Fournisseur=@Id", false);
                _this.ERegister(Corelib_10.net.WebRequestMethod.Get, "VPeriod", "q=Period&From=@from&to=@to", false);
                _this.ERegister(Corelib_10.net.WebRequestMethod.Get, "VCassier", "q=Cassier&Cassier=@Id", false);
                _this.ERegister(Corelib_10.net.WebRequestMethod.Get, "VObservation", "q=Observation&Observation=@Observation", false);
                _this.ERegister(Corelib_10.net.WebRequestMethod.Get, "Facture.Total", "q=Facture&Facture=@Id&total", false);
                return _this;
            }
            SVersments.prototype.GetType = function () { return Models_20.models.SVersments; };
            return SVersments;
        }(DataTable));
        Apis.SVersments = SVersments;
        var Costumers = (function (_super) {
            __extends(Costumers, _super);
            function Costumers() {
                return _super.call(this, 'Costumers') || this;
            }
            Costumers.prototype.GetType = function () { return Models_20.models.Costumers; };
            return Costumers;
        }(DataTable));
        Apis.Costumers = Costumers;
        var Category = (function (_super) {
            __extends(Category, _super);
            function Category() {
                return _super.call(this, "Category") || this;
            }
            Category.prototype.GetType = function () { return Models_20.models.Category; };
            return Category;
        }(DataRow));
        Apis.Category = Category;
        var Categories = (function (_super) {
            __extends(Categories, _super);
            function Categories() {
                return _super.call(this, 'Categories') || this;
            }
            Categories.prototype.GetType = function () { return array_Category; };
            return Categories;
        }(DataTable));
        Apis.Categories = Categories;
        var Picture = (function (_super) {
            __extends(Picture, _super);
            function Picture() {
                return _super.call(this, 'Picture') || this;
            }
            Picture.prototype.GetType = function () { return Models_20.models.Picture; };
            return Picture;
        }(DataRow));
        Apis.Picture = Picture;
        var Pictures = (function (_super) {
            __extends(Pictures, _super);
            function Pictures() {
                return _super.call(this, 'Pictures') || this;
            }
            Pictures.prototype.GetType = function () { return array_Picture; };
            return Pictures;
        }(DataTable));
        Apis.Pictures = Pictures;
        var SFactures = (function (_super) {
            __extends(SFactures, _super);
            function SFactures() {
                return _super.call(this, 'SFactures') || this;
            }
            SFactures.prototype.GetType = function () { return Models_20.models.SFactures; };
            return SFactures;
        }(DataTable));
        Apis.SFactures = SFactures;
        var EtatTransfers = (function (_super) {
            __extends(EtatTransfers, _super);
            function EtatTransfers() {
                return _super.call(this, 'EtatTransfers') || this;
            }
            EtatTransfers.prototype.GetType = function () { return Models_20.models.EtatTransfers; };
            return EtatTransfers;
        }(DataTable));
        Apis.EtatTransfers = EtatTransfers;
        var Settings = (function (_super) {
            __extends(Settings, _super);
            function Settings() {
                var _this = _super.call(this, "Settings") || this;
                _this.ERegister(Corelib_10.net.WebRequestMethod.Get, "START", null, false);
                _this.ERegister(Corelib_10.net.WebRequestMethod.Post, "BACKUP", null, false);
                _this.ERegister(Corelib_10.net.WebRequestMethod.Put, "RESTORE", null, false);
                return _this;
            }
            Settings.prototype.GetType = function () { return Window; };
            return Settings;
        }(DataRow));
        Apis.Settings = Settings;
        var Tickets = (function (_super) {
            __extends(Tickets, _super);
            function Tickets() {
                var _this = _super.call(this, "Tickets") || this;
                _this.ERegister(Corelib_10.net.WebRequestMethod.Print, "PRINT", null, true);
                return _this;
            }
            Tickets.prototype.GetType = function () { return Models_20.models.Tickets; };
            return Tickets;
        }(DataRow));
        Apis.Tickets = Tickets;
        var Print = (function (_super) {
            __extends(Print, _super);
            function Print() {
                var _this = _super.call(this, "Print") || this;
                _this.ERegister(Corelib_10.net.WebRequestMethod.Get, "MODELS", "HandlerId=@HandlerId", false);
                _this.ERegister(Corelib_10.net.WebRequestMethod.Print, "PRINT", null, true);
                return _this;
            }
            Print.prototype.GetType = function () { return Models_20.Printing.PrintData; };
            return Print;
        }(DataRow));
        Apis.Print = Print;
        var UUID = (function (_super) {
            __extends(UUID, _super);
            function UUID() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            UUID.prototype.GetType = function () {
                return 0;
            };
            UUID.prototype.GetRequest = function (data, shema, params) {
                UUID.req.Url = __global.GetApiAddress('/~NewGuid');
                return UUID.req;
            };
            UUID.prototype.OnResponse = function (response, data, context) {
                return new Corelib_10.basic.iGuid(data);
            };
            UUID.req = new Corelib_10.net.RequestUrl('/~NewGuid', null, null, Corelib_10.net.WebRequestMethod.Get, false);
            return UUID;
        }(System_9.Controller.Api));
        Apis.UUID = UUID;
        var Statistics = (function (_super) {
            __extends(Statistics, _super);
            function Statistics() {
                var _this = _super.call(this, 'statistics', false, true, true) || this;
                _this.ERegister(Corelib_10.net.WebRequestMethod.Get, 'out', '/@method?from=@from&to=@to&pid=@pid&cid=@cid', false);
                _this.ERegister(Corelib_10.net.WebRequestMethod.Get, 'methods', '?methods', false);
                _this.ERegister(Corelib_10.net.WebRequestMethod.Get, 'params', '?method=@method', false);
                return _this;
            }
            Statistics.prototype.GetType = function () { return Models_20.models.Statstics; };
            Statistics.prototype.addQuestionMark = function () { return false; };
            return Statistics;
        }(DataRow));
        Apis.Statistics = Statistics;
        function Load() {
            new Client, new Users, new Product, new Products, new Facture, new Factures, new Article, new Articles, new Agent, new Agents, new Versment, new Versments, new Category, new Categories, new Picture, new Pictures,
                new Login, new Signout, new FakePrice, new Clients, new Costumers, new Signup, new Logins(), new Categories, new FakePrices, new SFactures, new Tickets
                , new SFacture(), new SVersment, new SVersments, new Fournisseur, new Fournisseurs, new Guid, new Message, new IsAdmin(), new Price(), new EtatTransfers(), new Settings, new SessionId(), new Print(), new LoginO, new Mail, new Mails, new Projet, new Projets, new IsSecured, new CArticle, new CArticles, new Command, new Commands, new UserSetting, new SMS, new SMSs, new Statistics;
        }
        Apis.Load = Load;
        ;
    })(Apis = exports.Apis || (exports.Apis = {}));
});
define("Desktop/Jobs", ["require", "exports", "../lib/q/sys/Corelib", "../lib/q/sys/System", "../lib/q/sys/Jobs", "abstract/Models", "context", "abstract/extra/Common", "abstract/Models", "./../lib/Q/sys/UI", "abstract/extra/Basics"], function (require, exports, Corelib_11, System_10, Jobs_1, Models_21, context_2, Common_5, Models_22, UI_14, Basics_8) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GData;
    Common_5.GetVars(function (v) {
        GData = v;
        return false;
    });
    window.__data = GData.__data;
    var b = true;
    var lc = [10, 10, 10, 10, 7.5, 6, 5.1, 4.4, 3.9, 3.4, 3.1, 2.8, 2.6, 2.6, 2.4, 2.3];
    window['lc'] = lc;
    var Binds;
    (function (Binds) {
        Corelib_11.bind.Register({
            Name: 'trade',
            OnInitialize: function (j, e) {
                this.Todo(j, e);
            }, Todo: function (j, e) {
                var v = j.Scop.Value;
                var d = j.dom;
                if (v != null) {
                    var hasDot = v % 1 !== 0;
                    var s = v.toString();
                    if (s.length > 10)
                        s = s.slice(0, 10);
                }
                else
                    s = "";
                d.style.fontSize = lc[s.length] + 'em';
                d.textContent = s;
            }
        });
        Corelib_11.bind.Register({
            Name: 'getLastArticleTransactioned',
            OnInitialize: function (j, e) {
                this.Todo(j, e);
            },
            Todo: function (j, e) {
                var art = j.Scop.ParentValue;
                var prd = j.Scop.Value;
                if (!art || !prd)
                    return;
                var f = art instanceof Models_22.models.Article ? art.Owner : art.Facture;
                var d = f instanceof Models_22.models.Facture ? f.Client : f instanceof Models_22.models.SFacture ? f.Fournisseur : undefined;
                Corelib_11.Api.RiseApi('getLastArticlePrice', {
                    data: { Dealer: d, Product: prd, Before: f.Date, IsAchat: art instanceof Models_22.models.Article },
                    callback: function (a, prc) {
                        j.dom.innerHTML = prc == undefined ? "n y a aucune transaction " : "derniere prix : " + prc;
                    }
                });
            }
        });
        Corelib_11.bind.Register({
            Name: 'openprice', OnInitialize: function (j, e) {
                j.addEventListener('click', 'click', function (e) {
                    var prd = j.Scop.Value;
                    if (!prd)
                        return;
                    var p = prd && prd.Revage;
                    var isNew = false;
                    if (!p) {
                        p = new Models_21.models.FakePrice(Corelib_11.basic.New());
                        p.Product = prd;
                        prd.Revage = p;
                        isNew = true;
                    }
                    else {
                    }
                    if (!p) {
                        isNew = true;
                        UI_14.UI.Spinner.Default.Start("Wait");
                        p = new Models_21.models.FakePrice(p.Id);
                        p.Product = prd;
                        GData.requester.Get(Models_21.models.FakePrice, p, null, function (s, r, iss) {
                            if (iss)
                                Common_5.funcs.priceModal().edit(s.data, isNew, {
                                    OnSuccess: { Invoke: OnSuccessCategory, Owner: prd },
                                    OnError: { Invoke: OnErrorCategory, Owner: prd }
                                });
                            else
                                UI_14.UI.InfoArea.push("Fatal ERROR Occured !!!! ");
                            UI_14.UI.Spinner.Default.Pause();
                        });
                    }
                    else
                        Common_5.funcs.priceModal().edit(p, isNew, {
                            OnSuccess: { Invoke: OnSuccessCategory, Owner: p },
                            OnError: { Invoke: OnErrorCategory, Owner: p }
                        });
                    if (prd.Revage == null)
                        prd.Revage = p;
                });
            }
        });
        Corelib_11.bind.Register({
            Name: 'openfprice', OnInitialize: function (j, e) {
                j.addEventListener('click', 'click', function (e) {
                    var pr = j.Scop.Value;
                    if (!pr)
                        return;
                    if (pr.NextRevage)
                        Common_5.funcs.pricesModal().show(function (s, i, r) { }, pr.ToList());
                    else
                        Common_5.funcs.priceModal().edit(pr, false, null);
                });
            }
        });
        Corelib_11.bind.Register({
            Name: 'applyprice', OnInitialize: function (j, e) {
                var method = j.dom.getAttribute('method');
                j.addEventListener('click', 'click', function (e) {
                    var art = j.Scop.Value;
                    var f = art.Facture;
                    if (f && !f.IsOpen)
                        return UI_14.UI.Modal.ShowDialog("Apprentissage", 'La Facture Is Clossed donc vous ne pouver pas executer cette command', null, "Ok", null);
                    var old = art.Product;
                    if (old == null)
                        return UI_14.UI.Modal.ShowDialog('Apprentissage', "Vous dever selectioner un produit pour appliquer le prix");
                    switch (method) {
                        case 'moyen':
                            art.ApplyPrice = Models_22.models.Price.CalclMoyen(old, art);
                            break;
                        case 'new':
                            art.ApplyPrice = art;
                            break;
                        case 'old':
                            art.ApplyPrice = null;
                            break;
                        case 'costum':
                            art.ApplyPrice = new Models_22.models.FakePrice();
                            art.ClonePrices(art.ApplyPrice, true);
                            return GData.apis.Revage.Edit(art.ApplyPrice, void 0);
                        case 'percent':
                            UI_14.UI.InfoArea.push("this option is depricated");
                            break;
                    }
                });
            }
        });
        Corelib_11.bind.Register({
            Name: 'openfprice', OnInitialize: function (j, e) {
                j.addEventListener('click', 'click', function (e) {
                    var pr = j.Scop.Value;
                    if (!pr)
                        return;
                    if (pr.NextRevage)
                        Common_5.funcs.pricesModal().show(function (s, i, r) { }, pr.ToList());
                    else
                        Common_5.funcs.priceModal().edit(pr, false, null);
                });
            }
        });
        Corelib_11.bind.Register({
            Name: 'openfsprice', OnInitialize: function (j, e) {
                j.addEventListener('click', 'click', function (e) {
                    var p = j.Scop.Value;
                    if (!p)
                        return;
                    var pr = p.Revage;
                    if (!pr)
                        return UI_14.UI.InfoArea.push('Cannot find Price for this item');
                    if (pr.NextRevage)
                        Common_5.funcs.pricesModal().show(function (s, i, r) { }, pr.ToList());
                    else
                        GData.apis.Revage.Edit(pr, void 0);
                });
            }
        });
        Corelib_11.bind.Register({
            Name: 'dopenfprice', OnInitialize: function (j, e) {
                j.addEventListener('dblclick', 'dblclick', function (e) {
                    var p = j.Scop.Value;
                    if (!p)
                        UI_14.UI.InfoArea.push('Cannot find Price for this item');
                    else
                        GData.apis.Revage.Edit(p, void 0);
                });
            }
        });
        Corelib_11.bind.Register({
            Name: 'dopenfsprice', OnInitialize: function (j, e) {
                j.addEventListener('dblclick', 'dblclick', function (e) {
                    var p = j.Scop.Value;
                    if (!p)
                        return;
                    Common_5.funcs.pricesModal().show(function (s, i, r) { }, p && p.ToList());
                });
            }
        });
        Corelib_11.bind.Register({
            Name: 'dopenfsprice', OnInitialize: function (j, e) {
                j.addEventListener('dblclick', 'dblclick', function (e) {
                    var p = j.Scop.Value;
                    if (!p)
                        return;
                    Common_5.funcs.pricesModal().show(function (s, i, r) { }, p && p.ToList());
                });
            }
        });
        Corelib_11.bind.Register({
            Name: 'factureStat', OnInitialize: function (j, e) {
                this.Todo(j, e);
            }, Todo: function (j, e) {
                var d = j.dom;
                if (j.Scop.Value) {
                    d.style.backgroundColor = "#0F9D58";
                }
                else {
                    d.style.backgroundColor = "var(--qshop-yellow-700)";
                }
            }
        });
        Corelib_11.bind.Register({
            Name: 'applyPriceStat', OnInitialize: function (j, e) {
                this.Todo(j, e);
            }, Todo: function (j, e) {
                var ps = j.Scop.getParent();
                ps = ps && ps.Value;
                var cv = j.Scop.Value;
                var dom = j.dom.parentElement;
                if (!cv) {
                    dom.classList.remove('btn-success', 'btn-primary');
                }
                else if (cv === ps) {
                    dom.classList.remove('btn-primary');
                    dom.classList.add('btn-success');
                }
                else {
                    dom.classList.add('btn-primary');
                    dom.classList.remove('btn-success');
                }
            }
        });
        Corelib_11.bind.Register({
            Name: 'smsState', OnInitialize: function (j, e) {
                this.Todo(j, { _new: !!j.Scop.Value });
            }, Todo: function (j, e) {
                var cv = e._new;
                var dom = j.dom.parentElement;
                if (cv)
                    dom.classList.remove('sms-no-readed');
                else
                    dom.classList.add('sms-no-readed');
            }
        });
        Corelib_11.ScopicCommand.Register({
            Invoke: function (name, dom, scop, param) {
                var cbox = Jobs_1.getTargetFrom(dom);
                dom.addEventListener('click', function (e) {
                    cbox.checked = !cbox.checked;
                });
            },
            Owner: null
        }, null, 'checkboxTrigger');
        Corelib_11.bind.Register({
            Name: 'sfactureStat', OnInitialize: function (j, e) {
                this.Todo(j, e);
            }, Todo: function (j, e) {
                var d = j.dom;
                if (j.Scop.Value) {
                    d.style.backgroundColor = "#0F9D58";
                }
                else {
                    d.style.backgroundColor = "var(--qshop-yellow-700)";
                }
            }
        });
        Corelib_11.bind.Register({
            Name: 'clientStat', OnInitialize: function (j, e) {
                this.Todo(j, e);
            }, Todo: function (j, e) {
                var t = j.Scop.Value || 0;
                if (t == 0)
                    j.dom.parentElement.style.backgroundColor = "#0F9D58";
                else if (t > 0)
                    j.dom.parentElement.style.backgroundColor = "var(--paper-red-500)";
                else
                    j.dom.parentElement.style.backgroundColor = "var(--qshop-yellow-500)";
            }
        });
        Corelib_11.bind.Register({
            Name: 'soldStatus', OnInitialize: function (j, e) {
                this.Todo(j, e);
            }, Todo: function (j, e) {
                var t = j.Scop.Value || 0;
                var n = j.dom.style;
                j.dom.innerText = String(t);
                if (t == 0)
                    n.backgroundColor = "";
                else if (t > 0)
                    n.backgroundColor = "var(--paper-red-500)";
                else
                    n.backgroundColor = "var(--qshop-yellow-500)";
            }
        });
        Corelib_11.bind.Register({
            Name: 'fournisseurStat', OnInitialize: function (j, e) {
                this.Todo(j, e);
            }, Todo: function (j, e) {
                var t = j.Scop.Value || 0;
                if (t == 0)
                    j.dom.parentElement.style.backgroundColor = "#0F9D58";
                else if (t < 0)
                    j.dom.parentElement.style.backgroundColor = "var(--paper-red-500)";
                else
                    j.dom.parentElement.style.backgroundColor = "var(--qshop-yellow-500)";
            }
        });
        Corelib_11.bind.Register({
            Name: 'auto-product', OnInitialize: function (j, e) {
                var d = j.dom;
                var inp = new UI_14.UI.Input(d);
                var ac = new UI_14.UI.ProxyAutoCompleteBox(inp, GData.__data.Products);
                var tmp = d.getAttribute('item-template');
                if (tmp != null)
                    ac.Template = UI_14.UI.Template.ToTemplate(tmp, true);
                inp.Parent = UI_14.UI.Desktop.Current;
                function onTextboxChanged(box, old, nw) {
                    var artScop = this.Scop.getParent();
                    if (artScop) {
                        var art = artScop.Value;
                        if (art instanceof Models_22.models.FakePrice) {
                            var f = art.Facture;
                            if (art.Stat <= System_10.sdata.DataStat.Modified) {
                                art.PSel = nw.PSel;
                                art.Value = nw.Value;
                                art.PValue = nw.PValue;
                                art.HWValue = nw.HWValue;
                                art.WValue = nw.WValue;
                            }
                        }
                        else {
                            art && art.setProduct(nw);
                        }
                    }
                    this.Scop.Value = nw;
                }
                ac.OnValueChanged(j, function (box, old, nw) {
                    if (t.IsChanging)
                        return;
                    t.IsChanging = true;
                    Corelib_11.helper.TryCatch(j, onTextboxChanged, void 0, [box, old, nw]);
                    t.IsChanging = false;
                });
                ac.initialize();
                var t = { ac: ac, IsChanging: false };
                j.Scop.BindingMode = Corelib_11.bind.BindingMode.TwoWay;
                j.addValue('ac', t);
                if (!j.Control)
                    j.Control = ac;
                this.Todo(j, e);
            }, Todo: function (ji, e) {
                var t = ji.getValue('ac');
                if (t.IsChanging)
                    return;
                t.IsChanging = true;
                t.ac.Value = ji.Scop.Value;
                t.IsChanging = false;
            }
        });
        Corelib_11.bind.Register({
            Name: 'autocomplet', OnInitialize: function (j, e) {
                var d = j.dom;
                var s = d.getAttribute('db-source');
                var bts = d.hasAttribute('bind-to-scop');
                var sc = Corelib_11.bind.Scop.Create(s, j.Scop, 1);
                var inp = new UI_14.UI.Input(d);
                var data;
                if (sc) {
                    data = sc.Value;
                    var ac = new UI_14.UI.ProxyAutoCompleteBox(inp, data);
                    var tmp = d.getAttribute('item-template');
                    if (tmp != null)
                        ac.Template = UI_14.UI.Template.ToTemplate(tmp, true);
                    sc.OnPropertyChanged(Corelib_11.bind.Scop.DPValue, function (s, e) {
                        this.DataSource = e._new;
                    }, ac);
                    if (bts) {
                        ac.OnValueChanged(j, function (box, old, nw) {
                            j.Scop.Value = nw;
                        });
                        ac.Value = j.Scop.Value;
                        j.addValue('ac', ac);
                        j.addValue('bts', true);
                    }
                    inp.Parent = UI_14.UI.Desktop.Current;
                    ac.initialize();
                    if (!j.Control)
                        j.Control = ac;
                }
                else
                    throw "datasource not found";
            }, Todo: function (j, e) {
                if (!j.getValue('bts'))
                    return;
                var ac = j.getValue('ac');
                ac.Value = j.Scop.Value;
            }
        });
        function collapse(e) {
            var p;
            var b = this.self;
            var d = p = b.parentElement;
            if (!d)
                return;
            d = d.nextElementSibling;
            if (!d)
                return;
            var s = d.style.display;
            if (s == 'none') {
                d.style.display = '';
                b.classList.remove('glyphicon-triangle-top');
                b.classList.add('glyphicon-triangle-bottom');
            }
            else {
                d.style.display = 'none';
                b.classList.add('glyphicon-triangle-top');
                b.classList.remove('glyphicon-triangle-bottom');
            }
        }
        Corelib_11.ScopicCommand.Register({
            Invoke: function (n, dom, s, p) {
                dom.addEventListener('click', { handleEvent: collapse, self: dom });
            }
        }, null, 'collapse');
        Corelib_11.ScopicCommand.Register({
            Invoke: function (n, dom, s, p) {
                dom.addEventListener('click', function (e) {
                    var isopen = dom.classList.contains('open');
                    if (isopen)
                        dom.classList.remove('open');
                    else {
                        dom.classList.add('open');
                        var t = function (e) { dom.classList.remove('open'); document.removeEventListener('click', t, true); };
                        document.addEventListener('click', t, true);
                    }
                }, true);
                var dom = dom.parentElement;
            }
        }, null, 'opendropdown');
        Corelib_11.ScopicCommand.Register({
            Invoke: function (n, dom, s, p) {
                dom.innerText = s.Value;
            }
        }, null, 'write');
        function setValue(s, dom, rev) {
            var c;
            if (typeof s !== 'boolean') {
                c = s.getAttribute('activate');
                s.setAttribute('activate', c = !(c && c.Value));
            }
            else
                c = s;
            dom.style.backgroundColor = c ? '' : 'var(--qshop-grey-500)';
        }
        Corelib_11.ScopicCommand.Register({
            Invoke: function (n, dom, s, p) {
                s = s.getParent();
                dom.addEventListener('click', function () {
                    setValue(s, dom);
                });
                setValue(false, dom);
            }
        }, null, 'activateCrt');
        Corelib_11.bind.Register({
            Name: 'auto-category', OnInitialize: function (j, e) {
                var d = j.dom;
                var inp = new UI_14.UI.Input(d);
                var ac = new UI_14.UI.ProxyAutoCompleteBox(inp, GData.__data.Categories);
                inp.Parent = UI_14.UI.Desktop.Current;
                ac.OnValueChanged(j, function (box, old, nw) {
                    j.Scop.Value.Category = nw;
                });
                ac.initialize();
                j.addValue('ac', ac);
                this.Todo(j, e);
            }, Todo: function (j, e) {
                var ac = j.getValue('ac');
                var p = j.Scop.Value;
                ac.Value = p ? p.Category : null;
            },
            OnScopDisposing: function (j, e) {
                var ac = j.getValue('ac');
                ac.Box.Dispose();
                ac.Dispose();
            }
        });
        var jobs = [];
        Corelib_11.bind.NamedScop.Create('UserAbonment', Models_21.models.Abonment.Detaillant, 3).OnPropertyChanged(Corelib_11.bind.Scop.DPValue, function (e, c) {
            var x = typeof c._new === 'number';
            if (x)
                Filters.setAbonment(c._new);
            if (c._new instanceof Corelib_11.basic.EnumValue)
                Filters.setAbonment(c._new.Value);
        }, null);
        Corelib_11.bind.Register({
            Name: 'enumoption',
            OnInitialize: function (j, e) {
                if (!(j.dom instanceof HTMLInputElement))
                    throw "Dom must be Select";
                var dm = j.dom;
                var c = dm.getAttribute('enum');
                var et = dm.getAttribute('enum-type');
                if (et !== 'string')
                    et = 'number';
                var lst = Corelib_11.basic.getEnum(c);
                var ac = new UI_14.UI.ProxyAutoCompleteBox(new UI_14.UI.Input(j.dom), lst);
                ac.Box.Parent = UI_14.UI.Desktop.Current;
                ac.initialize();
                var p = { ac: ac, lst: lst, et: et };
                j.addValue('params', p);
                this.Todo(j, e);
                ac.OnValueChanged(ac, function (b, o, n) {
                    return j.Scop.Value = et === 'string' ? (n ? n.Name : lst.Get(0)) : n ? n.Value : 0;
                });
            }, Todo: function (ji, e) {
                var p = ji.getValue('params');
                var v = ji.Scop.Value;
                p.ac.Value = p.et === 'number' ? Corelib_11.basic.EnumValue.GetValue(p.lst, v || 0) : v;
            }
        });
        Corelib_11.bind.Register({
            Name: 'enum',
            OnInitialize: function (j, e) {
                if (!(j.dom instanceof HTMLSelectElement))
                    throw "Dom must be Select";
                var s = j.Scop;
                var dm = j.dom;
                dm.contentEditable = 'true';
                var c = dm.getAttribute('enum') || dm.getAttribute('type') || dm.getAttribute('rtype');
                var lst = Corelib_11.basic.getEnum(c);
                for (var i = 0; i < lst.Count; i++) {
                    var o = document.createElement('option');
                    var m = lst.Get(i);
                    o.value = String(m.Value);
                    o.text = m.Name;
                    j.dom.appendChild(o);
                }
                j.addValue('list', lst);
                this.Todo(j, e);
                j.dom.addEventListener('change', function (e) {
                    if (j._store.inter)
                        return;
                    j._store.inter = true;
                    try {
                        var v = this.options[this.selectedIndex];
                        v = parseFloat(v && v.value);
                        j.Scop.Value = isFinite(v) ? v : null;
                    }
                    catch (_a) { }
                    j._store.inter = false;
                });
            }, Todo: function (ji, e) {
                if (ji._store.inter)
                    return;
                ji._store.inter = true;
                try {
                    var t = ji.getValue('list');
                    var v = Corelib_11.basic.EnumValue.GetValue(t, ji.Scop.Value);
                    v = v && t.IndexOf(v);
                    ji.dom.selectedIndex = v;
                }
                catch (_a) { }
                ji._store.inter = false;
            }
        });
        Corelib_11.bind.Register({
            Name: 'enumstring',
            OnInitialize: function (j, e) {
                var dm = j.dom;
                var c = dm.getAttribute('type');
                var lst = Corelib_11.basic.getEnum(c);
                j.addValue('params', lst);
                this.Todo(j, e);
            }, Todo: function (ji, e) {
                var p = ji.getValue('params');
                var v = ji.Scop.Value;
                ji.dom.textContent = typeof v === 'string' ? v : p.Get(v || 0).Name;
            }
        });
        Corelib_11.bind.Register({
            Name: 'enum2string',
            OnInitialize: function (j, e) {
                var dm = j.dom;
                var c = dm.getAttribute('type');
                var lst = Corelib_11.basic.getEnum(c);
                j.addValue('params', lst);
                this.Todo(j, e);
            }, Todo: function (ji, e) {
                var p = ji.getValue('params');
                var v = ji.Scop.Value;
                ji.dom.textContent = typeof v === 'string' ? v : p.Get(v || 0).Name;
            }
        });
        Corelib_11.bind.Register({
            Name: 'adapter', OnInitialize: function (ji, e) {
                var dm = ji.dom;
                var itemTemplate = dm.getAttribute('item-template');
                var x = new UI_14.UI.ListAdapter(dm, itemTemplate);
                x.Parent = UI_14.UI.Desktop.Current;
                x.OnInitialized = function (x) { return x.Source = ji.Scop.Value; };
                ji.addValue('cnt', x);
                ji.Control = x;
            }, Todo: function (j, e) {
                var x = j.getValue('cnt');
                x.Source = j.Scop.Value;
            }, OnScopDisposing: function (j, e) {
                var x = j.getValue('cnt');
                x.Dispose();
            }
        });
        Binds.LabelJob = Corelib_11.bind.Register({
            Name: "hideIfNull",
            OnInitialize: function (ji, e) {
                this.Todo(ji, e);
            }, Todo: function (ji, e) {
                var dm = ji.dom;
                var d = dm.parentElement;
                var dsp = d.style.display;
                var val = ji.Scop.Value;
                if (val == null) {
                    if (dsp == 'none')
                        return;
                    ji.addValue('display', dsp);
                    d.style.display = 'none';
                }
                else
                    d.style.display = dsp == 'none' ? ji.getValue('display') : dsp;
            }
        });
        Binds.LabelJob = Corelib_11.bind.Register(new Corelib_11.bind.Job("prodprice", function (ji, x) {
            var v = ji.Scop.Value;
            if (!v) {
                v = 0;
            }
            else {
                v = v.IGetValue(userAbonment || 0) || 0;
            }
            var dm = ji.dom;
            dm.innerText = Corelib_11.math.round(v, 2) + ' DZD';
        }, null, null, function (ji, x) {
            this.Todo(ji, x);
            var c;
            prodprices.push(c = { ji: ji, job: this });
            ji.addValue('c', c);
        }, function (ji, e) {
            var i = prodprices.indexOf(ji.getValue('c'));
            if (i > -1)
                prodprices.splice(i, 1);
        }));
        Corelib_11.bind.Register({
            Name: "deleteItem", OnInitialize: function (ji, e) {
                ji.dom.addEventListener('click', function (e) {
                    var s = ji.Scop;
                    if (s instanceof Corelib_11.bind.Bind) {
                        if (s.Parent) {
                            var l = s.Parent.Value;
                            if (l instanceof Corelib_11.collection.List) {
                                l.Remove(s.Value);
                                return;
                            }
                        }
                    }
                    alert("remove");
                });
            }
        });
        Corelib_11.ScopicCommand.Register({
            Invoke: function (s, dom, scop, p) {
                var target = Jobs_1.getTargetFrom(dom);
                if (target != null) {
                    dom.addEventListener('click', {
                        handleEvent: function (e) {
                            var hin = target.classList.contains('in');
                            if (hin)
                                target.classList.remove('in');
                            else
                                target.classList.add('in');
                        }
                    });
                }
            }
        }, null, 'accordion');
        Corelib_11.ScopicCommand.Register({
            Invoke: function (s, dom, scop, p) {
                var templatePath = dom.getAttribute('as');
                if (!templatePath)
                    return UI_14.UI.InfoArea.push("command <template> required : as attribute ");
                var template = Corelib_11.mvc.MvcDescriptor.Get(templatePath);
                if (!templatePath)
                    return UI_14.UI.InfoArea.push("the template " + templatePath + "Cannot be found");
                dom.appendChild(template.Create());
            }
        }, null, 'template');
        function getPrice(p, a) {
            var pr = p.GetPrice(a);
            if (pr == 0) {
                for (var i = a - 1; i >= 0; i--) {
                    pr = p.GetPrice(i);
                    if (pr != 0)
                        return pr;
                }
                for (var i = a + 1; i < 4; i++) {
                    pr = p.GetPrice(i);
                    if (pr != 0)
                        return pr;
                }
                if (p.PSel != 0)
                    return p.PSel;
                return 0;
            }
            return pr;
        }
        Corelib_11.ScopicCommand.Register({
            Invoke: function (s, dom, scop, p) {
                var data = dom.getAttribute('db-data');
                dom.addEventListener('click', function (e) {
                    switch (data) {
                        case 'costume':
                            var t = scop.Value;
                            if (t.ApplyPrice === t || t.ApplyPrice == null)
                                var y = new Models_22.models.FakePrice(Corelib_11.basic.New());
                            else
                                y = t.ApplyPrice;
                            for (var i = 3; i >= 0; i--) {
                                y.ISetValue(i, t.GetPrice(i));
                            }
                            y.PSel = t.PSel;
                            y.Product = t.Product;
                            y.Qte = t.Product.Qte;
                            t.ApplyPrice = y;
                            break;
                        case 'current':
                            var val = scop.Value;
                            if (val instanceof Models_22.models.Product)
                                return;
                            fakePrice = scop.Value;
                            var prd = fakePrice.Product;
                            if (!prd)
                                return UI_14.UI.InfoArea.push('The product of this revage is not setted', false);
                            for (var i = 3; i >= 0; i--) {
                                fakePrice.ISetValue(i, prd.GetPrice(i));
                            }
                            break;
                        case 'calc':
                            var fakePrice = scop.Value;
                            var ps = fakePrice.PSel;
                            for (var i = 3; i >= 0; i--) {
                                fakePrice.ISetValue(i, ps = parseFloat(Corelib_11.math.round(ps * 1.33, 2)));
                            }
                            break;
                        case 'default':
                            var t = scop.Value;
                            t.ApplyPrice = t;
                            break;
                        case 'update':
                            var t = scop.Value;
                            GData.apis.Revage.Save(t.ApplyPrice, function (e) {
                                if (e.Error === Basics_8.basics.DataStat.Success) {
                                    t.ApplyPrice = null;
                                    UI_14.UI.InfoArea.push("The Product Price successfully Updated .", true);
                                }
                                else
                                    UI_14.UI.InfoArea.push("Error Occoured When Updating <h1>Product</h1> Price .", false);
                            });
                            break;
                        case 'restore':
                            var t = scop.Value;
                            t.ApplyPrice = null;
                            break;
                        default:
                    }
                }, false);
            }
        }, null, 'prdPrice');
    })(Binds || (Binds = {}));
    function OnSuccessCategory(cat, isNew) {
        GData.requester.Post(Models_21.models.FakePrice, cat, null, function (s, r, iss) {
            if (iss) {
                UI_14.UI.InfoArea.push("The Category Successfully Added", true);
                if (isNew) {
                    Models_21.models.FakePrice.pStore.Set(cat.Id, cat);
                    var p = Models_21.models.FakePrice.getById(cat.Id);
                    if (p == null) {
                        p = new Models_21.models.FakePrice(cat.Id);
                        Models_21.models.FakePrice.pStore.Set(cat.Id, p);
                    }
                }
                cat.Commit();
                return;
            }
            else
                UI_14.UI.InfoArea.push("AN Expected Error !!!!!<br>while Inserting The Category", false, 8000);
            cat.Rollback();
        });
        return true;
    }
    function OnErrorCategory(cat, isNew) {
        UI_14.UI.InfoArea.push("The Modification Aborded", false, 2500);
        return false;
    }
    var prodprices = [];
    var Filters;
    (function (Filters) {
        var _ = [];
        var FakePriceFilter = (function (_super) {
            __extends(FakePriceFilter, _super);
            function FakePriceFilter(scop, b) {
                var _this = _super.call(this, scop, b) || this;
                _this.fraction = -2;
                return _this;
            }
            FakePriceFilter.prototype.Initialize = function () {
                _super.prototype.Initialize.call(this);
            };
            Object.defineProperty(FakePriceFilter.prototype, "Fraction", {
                set: function (v) {
                    if (this.fraction === v)
                        return;
                    var f = this.source.Value;
                    if (f) {
                        var d = Models_21.models.FakePrice.GetDProperty(v);
                        if (!d)
                            return;
                        var ld = Models_21.models.FakePrice.GetDProperty(this.fraction);
                        if (this.dbe)
                            f.removeEvent(ld, this.dbe);
                        this.dbe = f.OnPropertyChanged(d, this.OntargetVC, this);
                    }
                    this.fraction = v;
                    this.Update();
                },
                enumerable: true,
                configurable: true
            });
            FakePriceFilter.prototype.Convert = function (data) {
                return data ? data.IGetValue(this.fraction || 0) : 0;
            };
            FakePriceFilter.prototype.ConvertBack = function (data) {
                var fake = this.source.Value;
                if (fake)
                    fake.ISetValue(this.fraction || 0, data);
                return fake;
            };
            FakePriceFilter.prototype.OntargetVC = function (s, e) {
                if (this.isChanging)
                    return;
                this.isChanging = true;
                this.Update();
                this.isChanging = false;
            };
            FakePriceFilter.prototype.SourceChanged = function (s, e) {
                _super.prototype.SourceChanged.call(this, s, e);
                var n = e._new;
                var o = e._old;
                var ld = Models_21.models.FakePrice.GetDProperty(this.fraction);
                if (this.dbe)
                    if (o) {
                        o.removeEvent(ld, this.dbe);
                        this.dbe = null;
                    }
                    else
                        throw "";
                if (n)
                    this.dbe = n.OnPropertyChanged(ld, this.OntargetVC, this);
            };
            FakePriceFilter.prototype.Dispose = function () {
                var ld = Models_21.models.FakePrice.GetDProperty(this.fraction);
                if (this.dbe)
                    this.source.Value.removeEvent(ld, this.dbe);
                if (this.source)
                    this.source.removeEvent(Corelib_11.bind.Scop.DPValue, this.dbsvc);
                var i = _.indexOf(this);
                if (i !== -1)
                    _.splice(i, 1);
                _super.prototype.Dispose.call(this);
            };
            return FakePriceFilter;
        }(Corelib_11.bind.Filter));
        Filters.FakePriceFilter = FakePriceFilter;
        Corelib_11.bind.RegisterFilter({
            BindingMode: 3, Name: 'fackeprice', CreateNew: function (s, m, p) {
                var e = new FakePriceFilter(s, m);
                e.Fraction = p == null ? userAbonment : isNaN(p) ? Models_21.models.Abonment[p] : parseFloat(p);
                _.push(e);
                return e;
            }
        });
        window['_'] = _;
        window['__'] = prodprices;
        function setAbonment(v) {
            userAbonment = v || 0;
            for (var _i = 0, _1 = _; _i < _1.length; _i++) {
                var i = _1[_i];
                i.Fraction = v;
            }
            for (var _a = 0, prodprices_1 = prodprices; _a < prodprices_1.length; _a++) {
                var j = prodprices_1[_a];
                j.job.Todo(j.ji, null);
            }
        }
        Filters.setAbonment = setAbonment;
        var pb;
        GData.user.OnMessage(function (s, e) {
            if (e._new) {
                var c = Corelib_11.bind.NamedScop.Get('User');
                pb = Corelib_11.bind.Scop.Create('Client.Abonment', c, Corelib_11.bind.BindingMode.SourceToTarget);
                pb.addListener(function (ev) {
                    Filters.setAbonment(ev._new);
                });
            }
            else {
            }
        });
    })(Filters = exports.Filters || (exports.Filters = {}));
    var userAbonment = GData.user.Client.Abonment || 0;
    function LoadJobs() {
    }
    exports.LoadJobs = LoadJobs;
    var redEx = /\0([\=\*\-\+\:\/]){0,1}([\-]{0,1}[\d]+(\.[\d]+){0,1})([\%]{0,1})\0/gmi;
    var rOut = {
        pa: NaN,
        pv: NaN,
        reduction: NaN,
    };
    function getValues(art, prd) {
        if (art) {
            var owner = art.Owner;
            var c = owner && owner.Client;
            rOut.pv = prd || (prd && !art.Price) ? prd.GetPrice((c && c.Abonment) || 0) : art.Price;
            rOut.pa = prd ? prd.PSel : art.PSel;
            rOut.reduction = ((rOut.pv / (rOut.pa || NaN) - 1) * 100);
        }
        else {
            rOut.pa = NaN;
            rOut.pv = NaN;
            rOut.reduction = NaN;
        }
        return rOut;
    }
    function calcReduction(art, prd, val) {
        var vls = getValues(art, prd);
        if (prd && art) {
            if (vls.pv < vls.pa)
                vls.pv = vls.pa;
            var v = val.Value;
            switch (val.Method) {
                case '=':
                    art.Price = v;
                    break;
                case '*':
                    art.Price = prd.PSel * v;
                    break;
                case ':':
                    art.Price = prd.GetPrice(v);
                    break;
                case '+':
                    if (val.IsPercent) {
                        art.Price = prd.PSel * (1 + v / 100);
                    }
                    else {
                        art.Price = vls.pv + v;
                    }
                    break;
                case '-':
                    if (val.IsPercent) {
                        art.Price = prd.PSel * (1 - v / 100);
                    }
                    else {
                        art.Price = vls.pv - v;
                    }
                    break;
                case '/':
                    art.Price = prd.PSel + Math.abs(vls.pv - vls.pa) / v;
                    break;
                default:
                    if (val.IsPercent) {
                        art.Price = prd.PSel * (1 + v / 100);
                    }
                    else {
                        art.Price = vls.pv + v;
                    }
                    break;
            }
        }
    }
    var reduction = Corelib_11.bind.Register({
        Name: 'reduction',
        _OnArtOrPrdChanged: function (ji, e) {
            var art = ji.getValue('parent');
            art = art && art.Value;
            var s = art && art.Reduction;
            if (ji.dom instanceof HTMLInputElement)
                ji.dom.value = isNaN(s) ? '' : String(s);
            else
                ji.dom.textContent = String(s);
        },
        _OnValueTextChanged: function (ji, e) {
            var d = ji.dom;
            var art = ji.getValue('parent');
            art = art && art.Value;
            if (!art)
                return;
            if (art.setReduction(d.value))
                d.classList.remove('error');
            else
                d.classList.add('error');
            return;
        },
        Todo: function (ji, e) {
            this.lock(ji, this, this._OnArtOrPrdChanged, [ji, e, true]);
        }, OnInitialize: function (ji, e) {
            var d = ji.dom, pscop = ji.Scop.getParent();
            d.addEventListener('change', function (e) { reduction.lock(ji, reduction, reduction._OnValueTextChanged, [ji, e]); });
            ji.addValue('parent', pscop);
            this.lock(ji, reduction, reduction._OnArtOrPrdChanged, [ji, e]);
        },
        lock: function (ji, owner, callback, params) {
            if (ji._store.lock)
                return;
            ji._store.lock = true;
            var r = Corelib_11.helper.TryCatch(owner, callback, null, params);
            ji._store.lock = false;
            return r;
        }
    }, true);
    var ProductCartJob = (function () {
        function ProductCartJob() {
            this.Name = 'productcart';
        }
        ProductCartJob.prototype.Todo = function (ji, e) {
            var t = ji._store;
            var n = e._new;
            var p = e._new.Picture;
            t.img.style.backgroundImage = p == null ? '' : 'url(' + p + ')';
            t.description.textContent = n.Description;
            t.name.textContent = n.Name;
            t.price.textContent = n.Revage == null ? '0' : n.Revage.Value + '';
        };
        ProductCartJob.prototype.Check = function (ji, e) {
        };
        ProductCartJob.prototype.OnError = function (ji, e) {
        };
        ProductCartJob.prototype.OnScopDisposing = function (ji, e) {
        };
        ProductCartJob.prototype.OnInitialize = function (ji, e) {
            var d = ji.dom;
            ji._store['img'] = $('img', d);
            ji._store['name'] = $('name', d);
            ji._store['description'] = $('description', d);
            ji._store['price'] = $('price', d);
            this.Todo(ji, e);
        };
        return ProductCartJob;
    }());
    exports.ProductCartJob = ProductCartJob;
    var defaultImg = 'url("' + context_2.context.GetPath('../assets/img/2.png') + '")';
    Corelib_11.bind.Register(new ProductCartJob());
    Corelib_11.bind.Register({
        Name: 'SelectImage',
        getTarget: function (j) {
            var t = j.getValue('target');
            if (t)
                return t;
            t = Jobs_1.getTargetFrom(j.dom);
            j.addValue('target', t);
            return t;
        },
        OnInitialize: function (j, e) {
            var _this = this;
            var input = j.dom;
            if (!(input instanceof HTMLInputElement))
                return console.log('dom must be a HtmlInput Element');
            var target = this.getTarget(j);
            input.type = 'file';
            input.multiple = false;
            input.accept = "image/*";
            j.addEventListener('change', 'change', function (e) {
                var t = _this.getTarget(j);
                if (!t)
                    return;
                if (input.files && input.files[0]) {
                    var reader = new FileReader();
                    reader.onload = function (e) { return t.setAttribute('src', e.target.result); };
                    reader.readAsDataURL(input.files[0]);
                }
            });
            this.Todo(j, e);
        }, Todo: function (j, e) {
            var target = this.getTarget(j);
            var v = j.Scop.Value;
            target.src = v == null || v == '' ? '' : '/_/Picture/' + v;
        }
    });
    var PictureEditor = (function (_super) {
        __extends(PictureEditor, _super);
        function PictureEditor(Adapter) {
            var _this = _super.call(this, 'Picture.edit', false) || this;
            _this.Adapter = Adapter;
            _this._btn = null;
            _this._img = null;
            _this.scop.Value = _this;
            window['tt'] = _this;
            return _this;
        }
        PictureEditor.prototype.initialize = function () {
            _super.prototype.initialize.call(this);
            this.Canceltitle("Close");
        };
        Object.defineProperty(PictureEditor.prototype, "Data", {
            set: function (v) {
            },
            enumerable: true,
            configurable: true
        });
        PictureEditor.prototype.Update = function () {
            var e = PictureEditor.getValue(this, ['Adapter', 'SelectedItem', 'Picture']);
            this._img.src = e == null || e == '' ? '' : '/_/Picture/' + e;
        };
        PictureEditor.getValue = function (o, s) {
            for (var i = 0; i < s.length; i++) {
                if (o == null)
                    return undefined;
                o = o[s[i]];
            }
            return o;
        };
        PictureEditor.prototype.setName = function (name, dom, cnt, e) {
            if (name === '_img') {
                this[name] = dom;
            }
            else if (name === '_btn') {
                this[name] = dom;
            }
        };
        PictureEditor.prototype.OnImageSubmit = function (e, dt, scop, ev) {
            this.Files = this._btn.files;
        };
        PictureEditor.prototype.OnKeyDown = function (e) {
            if (e.keyCode === UI_14.UI.Keys.F5)
                this.Update();
            if (e.ctrlKey) {
                if (e.keyCode == UI_14.UI.Keys.Down)
                    this.Adapter.SelectedIndex++;
                else if (e.keyCode == UI_14.UI.Keys.Up)
                    this.Adapter.SelectedIndex--;
                else if (e.keyCode == UI_14.UI.Keys.Left) {
                    var p = this.Adapter.Parent.Parent;
                    if (p instanceof UI_14.UI.Paginator)
                        p.Previous();
                }
                else if (e.keyCode == UI_14.UI.Keys.Right) {
                    var p = this.Adapter.Parent.Parent;
                    if (p instanceof UI_14.UI.Paginator)
                        p.Next();
                }
                else if (e.keyCode == 115 || e.keyCode == 83)
                    this.onSave && this.onSave(this);
                else
                    return _super.prototype.OnKeyDown.call(this, e);
            }
            else
                return _super.prototype.OnKeyDown.call(this, e);
            return true;
        };
        PictureEditor.__fields__ = function () { return [this.DPFiles, this.DPAdapter]; };
        PictureEditor.prototype.Open = function (onSave) {
            this.Files = null;
            if (this._btn)
                this._btn.value = '';
            _super.prototype.Open.call(this);
            this.onSave = onSave;
        };
        PictureEditor.prototype.Upload = function (prd, callback) {
            var f = this.Files && this.Files[0];
            if (!f)
                return UI_14.UI.InfoArea.push("Please Select a picture for upload");
            var reader = new FileReader();
            reader.onload = function (e) {
                GData.requester.Request(Models_22.models.Product, "AVATAR", e.target.result, { Operation: 'AVATAR', Name: f.name, Size: f.size, PID: prd.Id }, function (e, json, iss, req) {
                    if (iss)
                        prd.Picture = json;
                    callback && callback({ Api: void 0, Data: json, Error: iss ? Corelib_11.basic.DataStat.Success : Corelib_11.basic.DataStat.Fail });
                });
            };
            reader.readAsArrayBuffer(this.Files[0]);
        };
        PictureEditor.DPAdapter = Corelib_11.bind.DObject.CreateField("Adapter", UI_14.UI.ListAdapter);
        PictureEditor.DPFiles = Corelib_11.bind.DObject.CreateField("Files", FileList, null);
        return PictureEditor;
    }(UI_14.UI.Modals.EModalEditer));
    exports.PictureEditor = PictureEditor;
    window['pictue'] = PictureEditor;
    Corelib_11.bind.Register({
        Name: 'image',
        OnInitialize: function (ji, e) {
            this.Todo(ji, e);
        },
        Todo: function (ji, e) {
            var src = ji.Scop.Value;
            src = src == null ? "" : src;
            var dm = ji.dom;
            if (src instanceof Models_22.models.Picture)
                src = src.ImageUrl;
            dm.style.backgroundImage = src == null || src == "" ? defaultImg : 'url("/_/Picture/' + src + '")';
        }
    });
    Corelib_11.ScopicCommand.Register({
        Invoke: function (name, dom, scop, param) {
            if (!scop)
                return;
            applyImage(dom, scop.Value);
            scop.OnPropertyChanged(Corelib_11.bind.Scop.DPValue, function (s, e) {
                applyImage(dom, e._new);
            });
        }
    }, null, "image");
    function applyImage(dm, src) {
        src = src == null ? "" : src;
        if (src instanceof Models_22.models.Picture)
            src = src.ImageUrl;
        dm.style.backgroundImage = src == null || src == "" ? defaultImg : 'url("' + src + '")';
    }
    function shrinkIMG(data) {
        var x = new XMLHttpRequest();
        x.open('POST', 'api.tinify.com/shrink');
        x.setRequestHeader('Authorization', "YXBpOjFSeGc2bm9VMmprSnZ4LUxWU1lCalR5Q0dtVEZNYlVh");
        x.send(data);
    }
});
define("abstract/adminModels", ["require", "exports", "../lib/Q/sys/Corelib", "../lib/Q/sys/System", "abstract/Models"], function (require, exports, Corelib_12, System_11, Models_23) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ikmodels;
    (function (ikmodels) {
        var FactureSearch = (function (_super) {
            __extends(FactureSearch, _super);
            function FactureSearch() {
                var _this = _super.call(this) || this;
                _this.Date = new System_11.base.DateVecteur();
                _this.DateLivraison = new System_11.base.DateVecteur();
                _this.Total = new System_11.base.NumberVecteur();
                _this.Sold = new System_11.base.NumberVecteur();
                Object.freeze(_this);
                return _this;
            }
            FactureSearch.__fields__ = function () {
                return [FactureSearch.DPClient, FactureSearch.DPVendeur,
                    FactureSearch.DPDate, FactureSearch.DPDateLivraison,
                    FactureSearch.DPTotal, FactureSearch.DPSold,
                    FactureSearch.DPIsValidated];
            };
            Object.defineProperty(FactureSearch.prototype, "Client", {
                get: function () { return this.get(FactureSearch.DPClient); },
                set: function (v) { this.set(FactureSearch.DPClient, v); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FactureSearch.prototype, "Vendeur", {
                get: function () { return this.get(FactureSearch.DPVendeur); },
                set: function (v) { this.set(FactureSearch.DPVendeur, v); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FactureSearch.prototype, "Date", {
                get: function () { return this.get(FactureSearch.DPDate); },
                set: function (v) { this.set(FactureSearch.DPDate, v); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FactureSearch.prototype, "DateLivraison", {
                get: function () { return this.get(FactureSearch.DPDateLivraison); },
                set: function (v) { this.set(FactureSearch.DPDateLivraison, v); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FactureSearch.prototype, "Total", {
                get: function () { return this.get(FactureSearch.DPTotal); },
                set: function (v) { this.set(FactureSearch.DPTotal, v); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FactureSearch.prototype, "Sold", {
                get: function () { return this.get(FactureSearch.DPSold); },
                set: function (v) { this.set(FactureSearch.DPSold, v); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FactureSearch.prototype, "IsValidated", {
                get: function () { return this.get(FactureSearch.DPIsValidated); },
                set: function (v) { this.set(FactureSearch.DPIsValidated, v); },
                enumerable: true,
                configurable: true
            });
            FactureSearch.prototype.Check = function (s) {
                if (this.Client && this.Client != s.Client)
                    return false;
                if (this.Vendeur && this.Vendeur != s.Vendeur)
                    return false;
                if (this.IsValidated != null && this.IsValidated != s.IsValidated)
                    return false;
                if (!this.Date.Check(s.Date))
                    return false;
                if (!this.DateLivraison.Check(s.DateLivraison))
                    return false;
                if (!this.Total.Check(s.Total))
                    return false;
                return true;
            };
            FactureSearch.prototype.equals = function (p) {
                return p.Client === this.Client && p.Date === this.Date && p.DateLivraison === this.DateLivraison && this.IsValidated === p.IsValidated && p.Sold === this.Sold && p.Total === this.Total && p.Vendeur === this.Vendeur;
            };
            FactureSearch.prototype.ToInterface = function () {
                return {
                    Client: this.Client,
                    Date: this.Date,
                    DateLivraison: this.DateLivraison,
                    IsValidated: this.IsValidated,
                    Sold: this.Sold,
                    Total: this.Total,
                    Vendeur: this.Vendeur,
                    Check: this.Check,
                    equals: this.equals
                };
            };
            FactureSearch.DPClient = Corelib_12.bind.DObject.CreateField('Client', Models_23.models.Client);
            FactureSearch.DPVendeur = Corelib_12.bind.DObject.CreateField('Vendeur', Models_23.models.Agent);
            FactureSearch.DPDate = Corelib_12.bind.DObject.CreateField('Date', System_11.base.DateVecteur);
            FactureSearch.DPDateLivraison = Corelib_12.bind.DObject.CreateField('DateLivraison', System_11.base.DateVecteur);
            FactureSearch.DPTotal = Corelib_12.bind.DObject.CreateField('Total', System_11.base.NumberVecteur);
            FactureSearch.DPSold = Corelib_12.bind.DObject.CreateField('Sold', System_11.base.NumberVecteur);
            FactureSearch.DPIsValidated = Corelib_12.bind.DObject.CreateField('IsValidated', Boolean);
            return FactureSearch;
        }(Corelib_12.bind.DObject));
        ikmodels.FactureSearch = FactureSearch;
        var FSFilter = (function (_super) {
            __extends(FSFilter, _super);
            function FSFilter(fs) {
                var _this = _super.call(this) || this;
                _this.fs = fs;
                return _this;
            }
            FSFilter.prototype.convertFromString = function (x) {
                throw "invalide";
            };
            FSFilter.prototype.Begin = function (deb, count) {
                this.ifs = this.Patent;
            };
            FSFilter.prototype.IsMatch = function (index, item) {
                return !this.ifs || this.ifs.Check(item);
            };
            return FSFilter;
        }(Corelib_12.utils.Filter));
        ikmodels.FSFilter = FSFilter;
    })(ikmodels = exports.ikmodels || (exports.ikmodels = {}));
    (function (ikmodels) {
        var SFactureSearch = (function (_super) {
            __extends(SFactureSearch, _super);
            function SFactureSearch() {
                var _this = _super.call(this) || this;
                _this.Date = new System_11.base.DateVecteur();
                _this.Total = new System_11.base.NumberVecteur();
                _this.Sold = new System_11.base.NumberVecteur();
                Object.freeze(_this);
                return _this;
            }
            SFactureSearch.__fields__ = function () {
                return [SFactureSearch.DPFournisseur, SFactureSearch.DPAchteur, SFactureSearch.DPValidateur,
                    SFactureSearch.DPDate,
                    SFactureSearch.DPTotal, SFactureSearch.DPSold,
                    SFactureSearch.DPIsValidated];
            };
            Object.defineProperty(SFactureSearch.prototype, "Fournisseur", {
                get: function () { return this.get(SFactureSearch.DPFournisseur); },
                set: function (v) { this.set(SFactureSearch.DPFournisseur, v); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SFactureSearch.prototype, "Achteur", {
                get: function () { return this.get(SFactureSearch.DPAchteur); },
                set: function (v) { this.set(SFactureSearch.DPAchteur, v); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SFactureSearch.prototype, "Validateur", {
                get: function () { return this.get(SFactureSearch.DPValidateur); },
                set: function (v) { this.set(SFactureSearch.DPValidateur, v); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SFactureSearch.prototype, "Date", {
                get: function () { return this.get(SFactureSearch.DPDate); },
                set: function (v) { this.set(SFactureSearch.DPDate, v); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SFactureSearch.prototype, "Total", {
                get: function () { return this.get(SFactureSearch.DPTotal); },
                set: function (v) { this.set(SFactureSearch.DPTotal, v); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SFactureSearch.prototype, "Sold", {
                get: function () { return this.get(SFactureSearch.DPSold); },
                set: function (v) { this.set(SFactureSearch.DPSold, v); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SFactureSearch.prototype, "IsValidated", {
                get: function () { return this.get(SFactureSearch.DPIsValidated); },
                set: function (v) { this.set(SFactureSearch.DPIsValidated, v); },
                enumerable: true,
                configurable: true
            });
            SFactureSearch.prototype.Check = function (s) {
                if (this.Fournisseur && this.Fournisseur != s.Fournisseur)
                    return false;
                if (this.Achteur && this.Achteur != s.Achteur)
                    return false;
                if (this.Validateur && this.Validateur != s.Validator)
                    return false;
                if (this.IsValidated != null && this.IsValidated != s.IsValidated)
                    return false;
                if (!this.Date.Check(s.Date))
                    return false;
                if (!this.Total.Check(s.Total))
                    return false;
                return true;
            };
            SFactureSearch.prototype.equals = function (p) {
                return p.Fournisseur === this.Fournisseur && p.Date === this.Date && p.Achteur === this.Achteur && this.IsValidated === p.IsValidated && p.Sold === this.Sold && p.Total === this.Total && p.Validateur === this.Validateur;
            };
            SFactureSearch.prototype.ToInterface = function () {
                return {
                    Fournisseur: this.Fournisseur,
                    Date: this.Date,
                    Achteur: this.Achteur,
                    IsValidated: this.IsValidated,
                    Sold: this.Sold,
                    Total: this.Total,
                    Validateur: this.Validateur,
                    Check: this.Check,
                    equals: this.equals
                };
            };
            SFactureSearch.DPFournisseur = Corelib_12.bind.DObject.CreateField('Fournisseur', Models_23.models.Fournisseur);
            SFactureSearch.DPAchteur = Corelib_12.bind.DObject.CreateField('Achteur', Models_23.models.Agent);
            SFactureSearch.DPValidateur = Corelib_12.bind.DObject.CreateField('Vendeur', Models_23.models.Agent);
            SFactureSearch.DPDate = Corelib_12.bind.DObject.CreateField('Date', System_11.base.DateVecteur);
            SFactureSearch.DPTotal = Corelib_12.bind.DObject.CreateField('Total', System_11.base.NumberVecteur);
            SFactureSearch.DPSold = Corelib_12.bind.DObject.CreateField('Sold', System_11.base.NumberVecteur);
            SFactureSearch.DPIsValidated = Corelib_12.bind.DObject.CreateField('IsValidated', Boolean);
            return SFactureSearch;
        }(Corelib_12.bind.DObject));
        ikmodels.SFactureSearch = SFactureSearch;
        var SFSFilter = (function (_super) {
            __extends(SFSFilter, _super);
            function SFSFilter(fs) {
                var _this = _super.call(this) || this;
                _this.fs = fs;
                return _this;
            }
            SFSFilter.prototype.convertFromString = function (x) {
                throw "invalide";
            };
            SFSFilter.prototype.Begin = function (deb, count) {
                this.ifs = this.Patent;
            };
            SFSFilter.prototype.IsMatch = function (index, item) {
                return !this.ifs || this.ifs.Check(item);
            };
            return SFSFilter;
        }(Corelib_12.utils.Filter));
        ikmodels.SFSFilter = SFSFilter;
    })(ikmodels = exports.ikmodels || (exports.ikmodels = {}));
});
define("Desktop/Search", ["require", "exports", "abstract/Models", "../lib/Q/sys/Critere"], function (require, exports, Models_24, Critere_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SearchData;
    (function (SearchData) {
        var Client = (function (_super) {
            __extends(Client, _super);
            function Client() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Client.__fields__ = function () { return this.generateFieldsFrom(Models_24.models.Client); };
            return Client;
        }(Critere_1.Critere.ComplexCritere));
        SearchData.Client = Client;
        var Login = (function (_super) {
            __extends(Login, _super);
            function Login() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Login.__fields__ = function () { return this.generateFieldsFrom(Models_24.models.Login); };
            return Login;
        }(Critere_1.Critere.ComplexCritere));
        SearchData.Login = Login;
        var Category = (function (_super) {
            __extends(Category, _super);
            function Category() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Category.__fields__ = function () { return this.generateFieldsFrom(Models_24.models.Category); };
            return Category;
        }(Critere_1.Critere.ComplexCritere));
        SearchData.Category = Category;
        var Fournisseur = (function (_super) {
            __extends(Fournisseur, _super);
            function Fournisseur() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Fournisseur.__fields__ = function () { return this.generateFieldsFrom(Models_24.models.Client); };
            return Fournisseur;
        }(Critere_1.Critere.ComplexCritere));
        SearchData.Fournisseur = Fournisseur;
        var Versment = (function (_super) {
            __extends(Versment, _super);
            function Versment() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Versment.__fields__ = function () { return this.generateFieldsFrom(Models_24.models.Versment); };
            return Versment;
        }(Critere_1.Critere.ComplexCritere));
        SearchData.Versment = Versment;
        var Facture = (function (_super) {
            __extends(Facture, _super);
            function Facture() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Facture.__fields__ = function () { return this.generateFieldsFrom(Models_24.models.Facture); };
            return Facture;
        }(Critere_1.Critere.ComplexCritere));
        SearchData.Facture = Facture;
        var SFacture = (function (_super) {
            __extends(SFacture, _super);
            function SFacture() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            SFacture.__fields__ = function () { return this.generateFieldsFrom(Models_24.models.SFacture); };
            return SFacture;
        }(Critere_1.Critere.ComplexCritere));
        SearchData.SFacture = SFacture;
        var Product = (function (_super) {
            __extends(Product, _super);
            function Product() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Product.__fields__ = function () { return Product.generateFieldsFrom(Models_24.models.Product); };
            return Product;
        }(Critere_1.Critere.ComplexCritere));
        SearchData.Product = Product;
        var SMS = (function (_super) {
            __extends(SMS, _super);
            function SMS() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            SMS.__fields__ = function () { return this.generateFieldsFrom(Models_24.models.SMS); };
            return SMS;
        }(Critere_1.Critere.ComplexCritere));
        SearchData.SMS = SMS;
        var SVersment = (function (_super) {
            __extends(SVersment, _super);
            function SVersment() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            SVersment.__fields__ = function () { return Product.generateFieldsFrom(Models_24.models.SVersment); };
            return SVersment;
        }(Critere_1.Critere.ComplexCritere));
        SearchData.SVersment = SVersment;
        var Etats = (function (_super) {
            __extends(Etats, _super);
            function Etats() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Etats.__fields__ = function () { return Etats.generateFieldsFrom(Models_24.models.EtatTransfer); };
            return Etats;
        }(Critere_1.Critere.ComplexCritere));
        SearchData.Etats = Etats;
    })(SearchData = exports.SearchData || (exports.SearchData = {}));
});
define("Desktop/Admin/ListOfFactures", ["require", "exports", "../../lib/Q/sys/UI", "../../lib/Q/sys/Corelib", "abstract/Models", "abstract/extra/Common", "abstract/adminModels", "../../lib/Q/sys/Filters", "abstract/extra/Basics", "Desktop/Search", "../../lib/q/components/HeavyTable/script", "../../lib/Q/components/ActionButton/script", "assets/data/data", "../../lib/q/sys/Components"], function (require, exports, UI_15, Corelib_13, Models_25, Common_6, adminModels_1, Filters_1, Basics_9, Search_1, script_4, script_5, data_3, Components_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GData;
    var b = true;
    Common_6.GetVars(function (v) {
        GData = v;
        return false;
    });
    function crb(dom, icon, title, type, attri) {
        var t = document.createElement(dom);
        t.classList.add('btn', 'btn-' + type, 'glyphicon', 'glyphicon-' + icon);
        t.textContent = '  ' + title;
        for (var i in attri)
            t.setAttribute(i, attri[i]);
        return t;
    }
    var AdminNavs;
    (function (AdminNavs) {
        var FacturesReciption = (function (_super) {
            __extends(FacturesReciption, _super);
            function FacturesReciption() {
                var _this = _super.call(this, "facture_fournisseurs", "Journal des achats") || this;
                _this.actionBtn = new script_5.components.ActionButton();
                _this.group_tcnt = new UI_15.UI.Div().applyStyle('icontent-header');
                _this._caption = document.createTextNode("Les Factures ");
                _this.searchFilter = new Filters_1.filters.list.StringFilter();
                _this.frnFilter = new Filters_1.filters.list.PropertyFilter(Models_25.models.SFacture.DPFournisseur);
                _this.searchRequest = new adminModels_1.ikmodels.SFactureSearch();
                _this.service = new FactureBaseServices(_this);
                _this.OnInitialized = function (t) {
                    Corelib_13.Api.RiseApi('loadFournisseurs', {
                        callback: function () {
                            Corelib_13.Api.RiseApi('loadSFActures', void 0);
                        }, data: _this
                    });
                };
                return _this;
            }
            FacturesReciption.prototype.OnContextMenuFired = function (r, selected) {
                if (selected === 'Ouvrir' || selected === 'Supprimer')
                    this.OpenVersments(selected === 'Supprimer');
                else if (selected === 'Regler' || selected === 'Verser')
                    this.verser(selected === 'Regler');
            };
            FacturesReciption.prototype.OpenVersments = function (forDelete) {
                if (this.adapter.SelectedItem)
                    GData.apis.SVersment.OpenSVersmentsOfFacture(this.adapter.SelectedItem, function (results, selected, fournisseur, success) {
                        if (success && forDelete) {
                            if (selected) {
                                UI_15.UI.Modal.ShowDialog("Confirmation", "Voulez- vous vraiment supprimer ce veremnet", function (xx) {
                                    if (xx.Result === UI_15.UI.MessageResult.ok)
                                        GData.apis.SVersment.Delete(selected, function (e) {
                                            if (e.Error === Basics_9.basics.DataStat.Success) {
                                                UI_15.UI.InfoArea.push("Ce Virement Est bien Supprimé", true, 5000);
                                            }
                                            else {
                                                UI_15.UI.InfoArea.push("Une erreur s'est produite lorsque nous avons supprimé cette version", true, 5000);
                                            }
                                        });
                                }, "Supprimer", "Annuler");
                            }
                            else
                                UI_15.UI.InfoArea.push("Vous ne sélectionnez aucun Virement");
                        }
                    });
                else {
                    UI_15.UI.InfoArea.push("You Must Set first the client");
                }
            };
            FacturesReciption.prototype.verser = function (regler) {
                var data = this.adapter.SelectedItem;
                if (!data)
                    return UI_15.UI.Modal.ShowDialog("ERROR", "Selecter une Facture pour ajouter une versment");
                if (regler)
                    return GData.apis.SVersment.Regler(data, data.Client);
                GData.apis.SVersment.VerserTo(data, data.Client);
            };
            FacturesReciption.prototype.OnSearche = function (oldPatent, newPatent) {
                if (this.searchList.Filter != this.searchFilter)
                    this.searchList.Filter = this.searchFilter;
                this.searchFilter.Patent = new Filters_1.filters.list.StringPatent(newPatent);
            };
            FacturesReciption.prototype.OnFrnSearch = function (frn) {
                this.frnFilter.DP = Models_25.models.SFacture.DPFournisseur;
                this.frnFilter.Patent = new Filters_1.filters.list.PropertyPatent(frn);
                if (this.searchList.Filter != this.frnFilter)
                    this.searchList.Filter = this.frnFilter;
            };
            Object.defineProperty(FacturesReciption.prototype, "HasSearch", {
                get: function () { return UI_15.UI.SearchActionMode.Instantany; },
                set: function (v) { },
                enumerable: true,
                configurable: true
            });
            FacturesReciption.prototype.CalculateBenifite = function () {
                var si = this.adapter.SelectedItem;
                GData.requester.Request(Models_25.models.SFacture, 'BENIFIT', si, { Id: si.Id }, function (z, b, c) {
                    UI_15.UI.InfoArea.push('<h3 >Benefit est :</h3><h1>' + b.Benifit + 'DA  </h1><br><h3 >Precentage est :</h3><h1 style="color:yellow">' + (b.Benifit / b.Total) * 100 + '%  </h1>');
                });
            };
            FacturesReciption.prototype.OnKeyDown = function (e) {
                if (!this.paginator.OnKeyDown(e)) {
                    if (e.keyCode === UI_15.UI.Keys.F1)
                        this.getHelp({
                            "F2": "Add New",
                            "F3": "Deep Searche",
                            "F5": "Update",
                            "F9": "Settle Debts",
                            "F10": "Versments",
                            "Suppr": "Delete",
                            "Enter": "Edit"
                        });
                    else if (e.keyCode == 66 || e.keyCode == 98) {
                        this.CalculateBenifite();
                    }
                    else if (e.keyCode === UI_15.UI.Keys.F2)
                        this.New();
                    else if (this.adapter.SelectedIndex != -1)
                        if (e.keyCode === 13)
                            this.Open();
                        else if (e.keyCode === UI_15.UI.Keys.F9)
                            this.verser(true);
                        else if (e.keyCode === UI_15.UI.Keys.F10)
                            this.OpenVersments(false);
                        else
                            return _super.prototype.OnKeyDown.call(this, e);
                    else
                        return _super.prototype.OnKeyDown.call(this, e);
                }
                e.stopPropagation();
                e.preventDefault();
                return true;
            };
            FacturesReciption.prototype.initializeSBox = function () {
                var _this = this;
                this.group_tcnt.View.appendChild(this._caption);
                this.group_tcnt.Add(this.actionBtn);
                this.Add(this.group_tcnt);
                this.actionBtn.Source = GData.__data.Fournisseurs;
                this.actionBtn.OnInitialized = function (n) { return n.Box.View.setAttribute('handleClose', ''); };
                this.actionBtn.Caption.addEventListener('click', function (cp, e, p) { return _this.OnFrnSearch(_this.actionBtn.Value); }, null, this);
            };
            FacturesReciption.prototype.initialize = function () {
                _super.prototype.initialize.call(this);
                this.initializeSBox();
                this.initPaginator();
                var isc = false;
            };
            FacturesReciption.prototype.initPaginator = function () {
                if (this) {
                    this.adapter = new script_4.Material.HeavyTable(data_3.data.value.factureAchatTable.def);
                    this.adapter.setOrderHandler({ Invoke: this.OrderBy, Owner: this });
                }
                this.adapter.AcceptNullValue = false;
                this.Add(this.paginator = UI_15.UI.Paginator.createPaginator(this.adapter, this.searchList = GData.__data.SFactures.Filtred(this.searchFilter)));
            };
            FacturesReciption.prototype.OrderBy = function (e) {
                switch (e.orderBy) {
                    case "Ref":
                        return this.searchList.OrderBy(function (a, b) { return e.state.factor * (a.Ref || "").localeCompare(b.Ref || ""); });
                    case "Fournisseur":
                        return this.searchList.OrderBy(function (a, b) { return e.state.factor * (a.Fournisseur && a.Fournisseur.Name || "").localeCompare(b.Fournisseur && b.Fournisseur.Name || ""); });
                    case "Date":
                        return this.searchList.OrderBy(function (a, b) { return e.state.factor * (a.Date && a.Date.getTime() || 0) - (b.Date && b.Date.getTime() || 0); });
                    case "NArticles":
                        return this.searchList.OrderBy(function (a, b) { return e.state.factor * (a.NArticles - b.NArticles); });
                    case "Montant":
                        return this.searchList.OrderBy(function (a, b) { return e.state.factor * (a.Total - b.Total); });
                    case "Stat":
                        return this.searchList.OrderBy(function (a, b) { return e.state.factor * ((a.IsOpen && -1) - (b.IsOpen && -1)); });
                    case "Observation":
                        return this.searchList.OrderBy(function (a, b) { return e.state.factor * (a.Observation || "").localeCompare(b.Observation || ""); });
                    default:
                }
            };
            FacturesReciption.prototype.Search = function (f) {
                var t = GData.__data.Costumers.AsList();
                for (var i = 0, l = t.length; i < l; i++) {
                    var e = t[i];
                }
            };
            FacturesReciption.prototype.GetLeftBar = function () {
                return this.service.GetLeftBar(this);
            };
            FacturesReciption.prototype.GetRightBar = function () {
                return this.service.GetRightBar(this);
            };
            FacturesReciption.prototype.Print = function () {
                Corelib_13.Api.RiseApi('PrintSFacture', { data: this.adapter.SelectedItem });
            };
            FacturesReciption.prototype.Open = function () {
                Corelib_13.Api.RiseApi('OpenSFacture', { data: this.adapter.SelectedItem });
            };
            FacturesReciption.prototype.New = function () {
                Corelib_13.Api.RiseApi('NewSFacture', {
                    data: null, callback: function (p, f) {
                        GData.apis.SFacture.EOpenFacture(f);
                    }
                });
            };
            FacturesReciption.prototype.FsSave = function () {
                Corelib_13.Api.RiseApi('SaveSFacture', { data: this.adapter.SelectedItem });
            };
            FacturesReciption.prototype.Update = function () {
                GData.apis.SFacture.SmartUpdate();
            };
            FacturesReciption.prototype.FsUpdate = function () {
                Corelib_13.Api.RiseApi('UpdateSFacture', { data: this.adapter.SelectedItem });
            };
            FacturesReciption.prototype.Validate = function () {
                Corelib_13.Api.RiseApi('ValidateSFacture', { data: this.adapter.SelectedItem });
            };
            FacturesReciption.prototype.Delete = function () {
                Corelib_13.Api.RiseApi('DeleteSFacture', { data: this.adapter.SelectedItem });
            };
            FacturesReciption.prototype.OnDeepSearch = function () {
                var _this = this;
                if (!this._deepSearch)
                    this._deepSearch = new Search_1.SearchData.SFacture;
                this._deepSearch.Open(function (x) { return _this.OnDeepSearchTrigged(); });
            };
            FacturesReciption.prototype.OnDeepSearchTrigged = function () {
                if (this.searchList.Filter != this._deepSearch)
                    this.searchList.Filter = this._deepSearch;
                else
                    this.searchList.Reset();
            };
            FacturesReciption.prototype.getFrnName = function (a) {
                return (a && (a = a.Fournisseur) && a.FullName) || "";
            };
            return FacturesReciption;
        }(UI_15.UI.NavPanel));
        AdminNavs.FacturesReciption = FacturesReciption;
        var FacturesLivraison = (function (_super) {
            __extends(FacturesLivraison, _super);
            function FacturesLivraison() {
                var _this = _super.call(this, "facture_clientels", "Journal des Ventes") || this;
                _this.actionBtn = new script_5.components.ActionButton();
                _this.group_tcnt = new UI_15.UI.Div().applyStyle('icontent-header');
                _this._caption = document.createTextNode("Les Factures ");
                _this.searchFilter = new Filters_1.filters.list.StringFilter();
                _this.clientFilter = new Filters_1.filters.list.PropertyFilter(Models_25.models.SFacture.DPFournisseur);
                _this.service = new FactureBaseServices(_this);
                _this.rt = [
                    {
                        type: "icongroup", value: [
                            { iconName: 'attach_money', commandName: 'benifice' },
                            { iconName: 'card_giftcard', commandName: 'versements' },
                            { iconName: 'update', commandName: 'update' },
                            { iconName: 'print', commandName: 'print' }, { iconName: 'import_export', commandName: 'switch' }
                        ]
                    },
                    { type: "separator" },
                    { type: "menu-item", commandName: "freeze", label: "Freeze", iconName: "visibility_off" },
                    { type: "menu-item", commandName: "unfreeze", label: "UnFreeze", iconName: "visibility" },
                    { type: "menu-item", commandName: "loadfreezed", label: "Load Freezed Factures", iconName: "system_update" }
                ];
                _this._contextMenu = new Components_1.Components.MdContextMenu(_this.rt);
                _this._freezedFactures = new Models_25.models.Factures(null);
                _this._freezedFacturesloaded = false;
                _this.OnInitialized = function (t) { return Corelib_13.Api.RiseApi('loadFActures', void 0); };
                return _this;
            }
            FacturesLivraison.prototype.CalculateBenifite = function () {
                var si = this.adapter.SelectedItem;
                GData.requester.Request(Models_25.models.Facture, 'BENIFIT', si, { Id: si.Id }, function (z, b, c) {
                    UI_15.UI.InfoArea.push('<h3 >Benefit est :</h3><h1>' + b.Benifit + 'DA  </h1><br><h3 >Precentage est :</h3><h1 style="color:yellow">' + (b.Benifit / b.Total) * 100 + '%  </h1>');
                });
            };
            FacturesLivraison.prototype.OnDeepSearch = function () {
                var _this = this;
                if (!this._deepSearch)
                    this._deepSearch = new Search_1.SearchData.Facture;
                this._deepSearch.Open(function (x) { return _this.OnDeepSearchTrigged(); });
            };
            FacturesLivraison.prototype.OnSearche = function (oldPatent, newPatent) {
                if (this.searchList.Filter != this.searchFilter)
                    this.searchList.Filter = this.searchFilter;
                this.searchFilter.Patent = new Filters_1.filters.list.StringPatent(newPatent);
            };
            FacturesLivraison.prototype.OnClientSearch = function (frn) {
                this.clientFilter.DP = Models_25.models.Facture.DPClient;
                this.clientFilter.Patent = new Filters_1.filters.list.PropertyPatent(frn);
                if (this.searchList.Filter != this.clientFilter)
                    this.searchList.Filter = this.clientFilter;
            };
            FacturesLivraison.prototype.OnDeepSearchTrigged = function () {
                if (this.searchList.Filter != this._deepSearch)
                    this.searchList.Filter = this._deepSearch;
                else
                    this.searchList.Reset();
            };
            FacturesLivraison.prototype.Update = function () {
                this.searchList.Source = GData.__data.Factures;
                GData.apis.Facture.SmartUpdate();
            };
            FacturesLivraison.prototype.OnKeyDown = function (e) {
                if (!this.paginator.OnKeyDown(e)) {
                    if (e.keyCode === UI_15.UI.Keys.F1)
                        this.getHelp({
                            "F2": "Add New",
                            "F3": "Deep Searche",
                            "F5": "Update",
                            "F9": "Settle Debts",
                            "F10": "Versments",
                            "Suppr": "Delete",
                            "Enter": "Edit"
                        });
                    else if (e.keyCode == 66 || e.keyCode == 98) {
                        this.CalculateBenifite();
                    }
                    else if (e.keyCode === UI_15.UI.Keys.F2)
                        this.New();
                    else if (this.adapter.SelectedIndex != -1)
                        if (e.keyCode === 13)
                            this.Open();
                        else if (e.keyCode === UI_15.UI.Keys.F9)
                            this.verser(true);
                        else if (e.keyCode === UI_15.UI.Keys.F10)
                            this.OpenVersments(false);
                        else
                            return _super.prototype.OnKeyDown.call(this, e);
                    else
                        return _super.prototype.OnKeyDown.call(this, e);
                }
                e.stopPropagation();
                e.preventDefault();
                return true;
            };
            FacturesLivraison.prototype.initialize = function () {
                var _this = this;
                _super.prototype.initialize.call(this);
                this.group_tcnt.View.appendChild(this._caption);
                this.group_tcnt.Add(this.actionBtn);
                this.Add(this.group_tcnt);
                this.initPaginator();
                var isc = false;
                this.adapter.AcceptNullValue = false;
                this.actionBtn.Source = GData.__data.Costumers;
                this.actionBtn.Box.View.setAttribute('handleClose', '');
                this.actionBtn.Caption.addEventListener('click', function (s, e, p) {
                    _this.OnClientSearch(_this.actionBtn.Value);
                }, this);
            };
            Object.defineProperty(FacturesLivraison.prototype, "HasSearch", {
                get: function () { return UI_15.UI.SearchActionMode.Validated; },
                enumerable: true,
                configurable: true
            });
            FacturesLivraison.prototype.initPaginator = function () {
                var _this = this;
                this.paginator = new UI_15.UI.Paginator(10, undefined, true);
                this.paginator.OnInitialized = function (p) {
                    if (_this) {
                        _this.adapter = new script_4.Material.HeavyTable(data_3.data.value.factureVenteTable.def);
                        _this.adapter.setOrderHandler({ Invoke: _this.OrderBy, Owner: _this });
                    }
                    _this.adapter.OnInitialized = function (l) {
                        _this.paginator.Input = _this.searchList = GData.__data.Factures.Filtred(_this.searchFilter);
                        l.Source = _this.paginator.Output;
                    };
                    _this.paginator.Content = _this.adapter;
                };
                this.Add(this.paginator);
                this.applyStyle('fitHeight');
            };
            FacturesLivraison.prototype.OrderBy = function (e) {
                switch (e.orderBy) {
                    case "Ref":
                        return this.searchList.OrderBy(function (a, b) { return e.state.factor * (a.Ref || "").localeCompare(b.Ref || ""); });
                    case "Client":
                        return this.searchList.OrderBy(function (a, b) { return e.state.factor * (a.Client && a.Client.Name || "").localeCompare(b.Client && b.Client.Name || ""); });
                    case "Date":
                        return this.searchList.OrderBy(function (a, b) { return e.state.factor * (a.Date && a.Date.getTime() || 0) - (b.Date && b.Date.getTime() || 0); });
                    case "NArticles":
                        return this.searchList.OrderBy(function (a, b) { return e.state.factor * (a.NArticles - b.NArticles); });
                    case "Montant":
                        return this.searchList.OrderBy(function (a, b) { return e.state.factor * (a.Total - b.Total); });
                    case "Stat":
                        return this.searchList.OrderBy(function (a, b) { return e.state.factor * ((a.IsOpen && -1) - (b.IsOpen && -1)); });
                    case "Observation":
                        return this.searchList.OrderBy(function (a, b) { return e.state.factor * (a.Observation || "").localeCompare(b.Observation || ""); });
                    default:
                }
            };
            FacturesLivraison.prototype.GetLeftBar = function () {
                return this.service.GetLeftBar(this);
            };
            FacturesLivraison.prototype.GetRightBar = function () {
                return this.service.GetRightBar(this);
            };
            FacturesLivraison.prototype.Print = function () {
                Corelib_13.Api.RiseApi('PrintFacture', { data: this.adapter.SelectedItem });
            };
            FacturesLivraison.prototype.Open = function () {
                Corelib_13.Api.RiseApi('OpenFacture', { data: this.adapter.SelectedItem });
            };
            FacturesLivraison.prototype.New = function () {
                Corelib_13.Api.RiseApi("NewFacture", {
                    data: null,
                    callback: function (p, k) { }
                });
            };
            FacturesLivraison.prototype.FsSave = function () {
                Corelib_13.Api.RiseApi('SaveFacture', { data: this.adapter.SelectedItem });
            };
            FacturesLivraison.prototype.FsUpdate = function () {
                Corelib_13.Api.RiseApi('UpdateFacture', { data: this.adapter.SelectedItem });
            };
            FacturesLivraison.prototype.Validate = function () {
                Corelib_13.Api.RiseApi('ValidateFacture', { data: this.adapter.SelectedItem });
            };
            FacturesLivraison.prototype.Delete = function () {
                Corelib_13.Api.RiseApi('DeleteFacture', { data: this.adapter.SelectedItem });
            };
            FacturesLivraison.prototype.OnContextMenuFired = function (r, selected) {
                if (selected === 'Ouvrir' || selected === 'Supprimer')
                    this.OpenVersments(selected === 'Supprimer');
                else if (selected === 'Regler' || selected === 'Verser')
                    this.verser(selected === 'Regler');
            };
            FacturesLivraison.prototype.OpenVersments = function (forDelete) {
                if (this.adapter.SelectedItem)
                    GData.apis.Versment.OpenVersmentsOfFacture(this.adapter.SelectedItem, function (results, selected, fournisseur, success) {
                        if (success && forDelete) {
                            if (selected) {
                                UI_15.UI.Modal.ShowDialog("Confirmation", "Voulez- vous vraiment supprimer ce veremnet", function (xx) {
                                    if (xx.Result === UI_15.UI.MessageResult.ok)
                                        GData.apis.Versment.Delete(selected, function (e) {
                                            if (e.Error === Basics_9.basics.DataStat.Success) {
                                                UI_15.UI.InfoArea.push("Ce Virement Est bien Supprimé", true, 5000);
                                            }
                                            else {
                                                UI_15.UI.InfoArea.push("Une erreur s'est produite lorsque nous avons supprimé cette version", true, 5000);
                                            }
                                        });
                                }, "Supprimer", "Annuler");
                            }
                            else
                                UI_15.UI.InfoArea.push("Vous ne sélectionnez aucun Virement");
                        }
                    });
                else {
                    UI_15.UI.InfoArea.push("You Must Set first the client");
                }
            };
            FacturesLivraison.prototype.verser = function (regler) {
                var data = this.adapter.SelectedItem;
                if (!data)
                    return UI_15.UI.Modal.ShowDialog("ERROR", "Selecter une Facture pour ajouter une versment");
                if (regler)
                    return GData.apis.Versment.Regler(data, data.Client);
                GData.apis.Versment.VerserTo(data, data.Client);
            };
            FacturesLivraison.prototype.OnContextMenu = function (e) {
                var _this = this;
                UI_15.UI.Desktop.Current.CurrentApp.OpenContextMenu(this._contextMenu, {
                    callback: function (si) {
                        switch (si.selectedItem.commandName) {
                            case "freeze":
                                _this.FreezeFactures(true);
                                break;
                            case "unfreeze":
                                _this.FreezeFactures(false);
                                break;
                            case "loadfreezed":
                                _this.LoadFreeedFactures();
                                break;
                            case "update":
                                _this.Update();
                                break;
                            case "benifice":
                                _this.CalculateBenifite();
                                return;
                            case "versements":
                                _this.OpenVersments(false);
                                return;
                            case 'print':
                                _this.Print();
                                return;
                            case 'switch':
                                var dst = _this._freezedFactures;
                                _this.searchList.Source = dst = (_this.searchList.Source === dst ? GData.__data.Factures : dst);
                                return;
                        }
                    }, e: e, ObjectStat: this, x: 0, y: 0
                });
            };
            FacturesLivraison.prototype.LoadFreeedFactures = function () {
                var _this = this;
                GData.requester.Request(Models_25.models.Factures, "LOADFREEZED", this._freezedFactures, { Freezed: true, csv: true }, function (r, json, iss, q) {
                    if (iss) {
                        _this._freezedFactures.Clear();
                        _this._freezedFactures.FromCsv(q.Response, Corelib_13.encoding.SerializationContext.GlobalContext.reset());
                        _this.searchList.Source = _this._freezedFactures;
                    }
                    else {
                        UI_15.UI.InfoArea.push("Error Occured");
                    }
                });
            };
            FacturesLivraison.prototype.FreezeFactures = function (freeze) {
                var _this = this;
                var src = this.searchList.Source;
                var dst = this._freezedFactures;
                if (src === dst)
                    var dst = GData.__data.Factures;
                UI_15.UI.Modal.ShowDialog('Freeze Manager', "Do you want really to " + (freeze ? '' : 'un') + "freeze those factures", function (e) {
                    if (e.Result !== UI_15.UI.MessageResult.ok)
                        return;
                    var data = _this.adapter.Source.AsList().map(function (p) { return p.Id; });
                    GData.requester.Request(Models_25.models.Factures, 'FREEZED', data, { Freezed: freeze }, function (x, json, iss, req) {
                        if (iss) {
                            for (var _i = 0, data_4 = data; _i < data_4.length; _i++) {
                                var i = data_4[_i];
                                var f = src.GetById(i);
                                if (!f)
                                    continue;
                                src.Remove(f);
                                dst.Add(f);
                            }
                            _this.paginator.Next();
                            _this.paginator.Previous();
                        }
                    });
                }, 'Yes', 'No', null);
            };
            return FacturesLivraison;
        }(UI_15.UI.NavPanel));
        AdminNavs.FacturesLivraison = FacturesLivraison;
        var FactureLivraisonOrder = (function () {
            function FactureLivraisonOrder(getList) {
                this.getList = getList;
                this.obs = -1;
                this.ref = -1;
                this.clt = -1;
                this.dt = -1;
                this.nart = -1;
                this.mnt = -1;
                this.stat = -1;
            }
            Object.defineProperty(FactureLivraisonOrder.prototype, "list", {
                get: function () { return this.getList(); },
                enumerable: true,
                configurable: true
            });
            FactureLivraisonOrder.prototype.OrderByObservation = function (e, s) {
                var _this = this;
                this.obs = -this.obs;
                this.list.OrderBy(function (a, b) { return _this.obs * ((a && a.Observation) || "").localeCompare((b && b.Observation) || ""); });
            };
            FactureLivraisonOrder.prototype.OrderByRef = function (e, s) {
                var _this = this;
                this.ref = -this.ref;
                this.list.OrderBy(function (a, b) { return _this.ref * (a.Ref || "").localeCompare(b.Ref || ""); });
            };
            FactureLivraisonOrder.prototype.OrderByClient = function (e, s) {
                var _this = this;
                this.clt = -this.clt;
                this.list.OrderBy(function (a, b) { return _this.clt * _this.getclt(a).localeCompare(_this.getclt(b)); });
            };
            FactureLivraisonOrder.prototype.OrderByDate = function (e, s) {
                var _this = this;
                this.dt = -this.dt;
                this.list.OrderBy(function (a, b) { return _this.dt * (_this.getdt(a) - _this.getdt(b)); });
            };
            FactureLivraisonOrder.prototype.OrderByNArticles = function (e, s) {
                var _this = this;
                this.nart = -this.nart;
                this.list.OrderBy(function (a, b) { return _this.nart * (a.NArticles - b.NArticles); });
            };
            FactureLivraisonOrder.prototype.OrderByMontant = function (e, s) {
                var _this = this;
                this.mnt = -this.mnt;
                this.list.OrderBy(function (a, b) { return _this.mnt * (a.Total - b.Total); });
            };
            FactureLivraisonOrder.prototype.OrderByStat = function (e, s) {
                var _this = this;
                this.stat = -this.stat;
                this.list.OrderBy(function (a, b) { return _this.stat * (a.Stat - b.Stat); });
            };
            FactureLivraisonOrder.prototype.getclt = function (a) {
                var f = a;
                return (f && (f = f.Client) && (f = f.FullName)) || "";
            };
            FactureLivraisonOrder.prototype.getdt = function (a) {
                var f = a;
                return (f && (f = f.Date) && (f = f.getTime())) || 0;
            };
            return FactureLivraisonOrder;
        }());
    })(AdminNavs = exports.AdminNavs || (exports.AdminNavs = {}));
    var FactureBaseServices = (function () {
        function FactureBaseServices(target) {
            this.target = target;
        }
        FactureBaseServices.prototype.GetLeftBar = function (target) {
            var _this = this;
            if (this.lb)
                return this.lb;
            this.lb = new UI_15.UI.Navbar();
            var oldget = this.lb.getTemplate;
            this.rm;
            this.lb.getTemplate = function (c) {
                var x = new UI_15.UI.Anchore(c);
                var e = oldget(x);
                e.addEventListener('click', _this.callback, { t: _this, p: c });
                return e;
            };
            this.lb.OnInitialized = function (n) {
                var _creditCart;
                n.AddRange([
                    new UI_15.UI.Glyph(UI_15.UI.Glyphs.edit, false, 'Edit'),
                    new UI_15.UI.Glyph(UI_15.UI.Glyphs.plusSign, false, 'New'),
                    new UI_15.UI.Glyph(UI_15.UI.Glyphs.fire, false, 'Delete'),
                    Common_6.funcs.createSparator(),
                    new UI_15.UI.Glyph(UI_15.UI.Glyphs.print, false, 'Print'),
                    Common_6.funcs.createSparator(),
                    _creditCart = new UI_15.UI.Glyph(UI_15.UI.Glyphs.creditCard, false, 'Versment Manager'),
                ]);
                _this.rm = new UI_15.UI.RichMenu(undefined, ["Regler", "Verser", "Supprimer", "", "Ouvrir"], _creditCart);
            };
        };
        FactureBaseServices.prototype.GetRightBar = function (target) {
            var _this = this;
            if (this.rb)
                return this.rb;
            this.rb = new UI_15.UI.Navbar();
            var oldget = this.rb.getTemplate;
            this.rb.getTemplate = function (c) {
                var x = new UI_15.UI.Anchore(c);
                var e = oldget(x);
                e.addEventListener('click', _this.callback, { t: _this, p: c });
                return e;
            };
            this.rb.OnInitialized = function (n) { return n.AddRange([
                new UI_15.UI.Glyph(UI_15.UI.Glyphs.refresh, false, 'Update'),
                new UI_15.UI.Glyph(UI_15.UI.Glyphs.check, false, 'Validate'),
                new UI_15.UI.Glyph(UI_15.UI.Glyphs.floppyDisk, false, 'Save')
            ]); };
        };
        FactureBaseServices.prototype.callback = function (x, e, c) {
            var target = c.t.target;
            switch (c.p.Type) {
                case UI_15.UI.Glyphs.refresh:
                    return target.FsUpdate();
                case UI_15.UI.Glyphs.check:
                    return target.Validate();
                case UI_15.UI.Glyphs.floppyDisk:
                    return target.FsSave();
                case UI_15.UI.Glyphs.edit:
                    return target.Open();
                case UI_15.UI.Glyphs.plusSign:
                    return target.New();
                case UI_15.UI.Glyphs.fire:
                    return target.Delete();
                case UI_15.UI.Glyphs.print:
                    return target.Print();
                case UI_15.UI.Glyphs.creditCard:
                    c.t.rm.Open(e, { Owner: c.t, Invoke: c.t.OnContextMenuFired }, null, true);
                    break;
                default:
                    UI_15.UI.InfoArea.push("Unrechable Code");
                    return;
            }
        };
        FactureBaseServices.prototype.OnContextMenuFired = function (r, selected) {
            if (selected === 'Ouvrir' || selected === 'Supprimer')
                this.target.OpenVersments(selected === 'Supprimer');
            else if (selected === 'Regler' || selected === 'Verser')
                this.target.verser(selected === 'Regler');
        };
        FactureBaseServices.prototype.Print = function (g, m, t) { t.target.Print(); };
        FactureBaseServices.prototype.Open = function (g, m, t) { t.target.Open(); };
        FactureBaseServices.prototype.New = function (g, m, t) { t.target.New(); };
        FactureBaseServices.prototype.Versement = function (g, m, t) {
            t.rm.Open(m, { Owner: t.target, Invoke: t.target.OnContextMenuFired }, null, true);
        };
        FactureBaseServices.prototype.FsSave = function (g, m, t) { t.target.FsSave(); };
        FactureBaseServices.prototype.Update = function (g, m, t) { t.target.FsUpdate(); };
        FactureBaseServices.prototype.Validate = function (g, m, t) { t.target.Validate(); };
        FactureBaseServices.prototype.Delete = function (g, m, t) { t.target.Delete(); };
        return FactureBaseServices;
    }());
    var v;
    var ms;
});
define("Desktop/Admin/Costumers", ["require", "exports", "./../../lib/Q/sys/UI", "abstract/extra/Common", "abstract/extra/Basics", "../../lib/Q/sys/Filters", "Desktop/Search", "../../lib/Q/components/HeavyTable/script", "assets/data/data"], function (require, exports, UI_16, Common_7, Basics_10, Filters_2, Search_2, script_6, data_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GData;
    Common_7.GetVars(function (v) {
        GData = v;
        return false;
    });
    var Clients = (function (_super) {
        __extends(Clients, _super);
        function Clients() {
            var _this = _super.call(this, "Clients", "Clients") || this;
            _this.searchFilter = new Filters_2.filters.list.StringFilter();
            _this._creditCart = new UI_16.UI.Glyph(UI_16.UI.Glyphs.creditCard, false, 'Versments Manager');
            _this.rm = new UI_16.UI.RichMenu(undefined, ["Regler", "Verser", "Supprimer", "", "Ouvrir"], _this._creditCart);
            return _this;
        }
        Clients.prototype.OnSearche = function (oldPatent, newPatent) {
            var t = this.searchList.Filter == this.searchFilter;
            this.searchFilter.Patent = new Filters_2.filters.list.StringPatent(newPatent);
            if (!t)
                this.searchList.Filter = this.searchFilter;
        };
        Object.defineProperty(Clients.prototype, "HasSearch", {
            get: function () { return UI_16.UI.SearchActionMode.Instantany; },
            set: function (v) { },
            enumerable: true,
            configurable: true
        });
        Clients.prototype.OnKeyDown = function (e) {
            if (!this.paginator.OnKeyDown(e)) {
                if (e.keyCode === UI_16.UI.Keys.F1)
                    this.getHelp({
                        "F2": "Add New",
                        "F9": "Regler Les Versments",
                        "F10": "Open Versments",
                        "Enter": "Edit",
                        "Suppr": "Delete",
                    });
                else if (e.keyCode === UI_16.UI.Keys.F2)
                    this.AddClient();
                else if (this.adapter.SelectedIndex != -1)
                    if (e.keyCode === 13)
                        this.EditClient();
                    else if (e.keyCode === UI_16.UI.Keys.Delete)
                        this.RemoveClient();
                    else if (e.keyCode === UI_16.UI.Keys.F9)
                        this.verser(true);
                    else if (e.keyCode === UI_16.UI.Keys.F10)
                        this.OpenVersments(false);
                    else
                        return _super.prototype.OnKeyDown.call(this, e);
                else
                    return _super.prototype.OnKeyDown.call(this, e);
            }
            e.stopPropagation();
            e.preventDefault();
            return true;
        };
        Clients.prototype.initialize = function () {
            _super.prototype.initialize.call(this);
            this.Add(Common_7.funcs.initializeSBox("Clients").container);
            var tbl;
            this.adapter = (tbl = new script_6.Material.HeavyTable(data_5.data.value.clientTable.def)).applyStyle('row');
            this.paginator = UI_16.UI.Paginator.createPaginator(this.adapter, this.searchList = GData.__data.Costumers.Filtred(this.searchFilter), 10);
            this.adapter.AcceptNullValue = false;
            this.Add(this.paginator);
            tbl.setOrderHandler({ Invoke: this.OrderBy, Owner: this });
        };
        Clients.prototype.OrderBy = function (e) {
            switch (e.orderBy) {
                case "Ref":
                    return this.searchList.OrderBy(function (a, b) { return e.state.factor * (a.Id - b.Id); });
                case "FName":
                    return this.searchList.OrderBy(function (a, b) { return e.state.factor * (a.FullName || "").localeCompare(b.FullName || ""); });
                case "Tel":
                    return this.searchList.OrderBy(function (a, b) { return e.state.factor * (a.Tel || "").localeCompare(b.Tel || ""); });
                case "TotalM":
                    return this.searchList.OrderBy(function (a, b) { return e.state.factor * (a.MontantTotal - b.MontantTotal); });
                case "TotalV":
                    return this.searchList.OrderBy(function (a, b) { return e.state.factor * (a.VersmentTotal - b.VersmentTotal); });
                case "TotalS":
                    return this.searchList.OrderBy(function (a, b) { return e.state.factor * (a.SoldTotal - b.SoldTotal); });
                default:
            }
        };
        Clients.prototype.Update = function () {
            GData.apis.Client.SmartUpdate();
        };
        Clients.prototype.AddClient = function () {
            GData.apis.Client.CreateNew();
        };
        Clients.prototype.RemoveClient = function () {
            GData.apis.Client.Delete(this.adapter.SelectedItem, null);
        };
        Clients.prototype.EditClient = function () {
            GData.apis.Client.Edit(this.adapter.SelectedItem, void 0);
        };
        Clients.prototype.Search = function () {
        };
        Clients.prototype.GetLeftBar = function () {
            var _this = this;
            if (!this.lb) {
                this.lb = new UI_16.UI.Navbar();
                var oldget = this.lb.getTemplate;
                this.lb.getTemplate = function (c) {
                    var x = new UI_16.UI.Anchore(c);
                    var e = oldget(x);
                    e.addEventListener('click', _this.callback, { t: _this, p: c });
                    return e;
                };
                this.lb.OnInitialized = function (n) { return n.AddRange([
                    new UI_16.UI.Glyph(UI_16.UI.Glyphs.plusSign, false, 'Add'),
                    new UI_16.UI.Glyph(UI_16.UI.Glyphs.edit, false, 'Edit'),
                    new UI_16.UI.Glyph(UI_16.UI.Glyphs.fire, false, 'Delete'), Common_7.funcs.createSparator(), _this._creditCart
                ]); };
            }
            return this.lb;
        };
        Clients.prototype.GetRightBar = function () {
            var _this = this;
            if (!this.rb) {
                this.rb = new UI_16.UI.Navbar();
                var oldget = this.rb.getTemplate;
                this.rb.getTemplate = function (c) {
                    var x = new UI_16.UI.Anchore(c);
                    var e = oldget(x);
                    e.addEventListener('click', _this.callback, { t: _this, p: c });
                    return e;
                };
                this.rb.OnInitialized = function (n) { return n.AddRange([
                    new UI_16.UI.Glyph(UI_16.UI.Glyphs.search, false, 'Add')
                ]); };
            }
            return this.rb;
        };
        Clients.ctor = function () {
        };
        Clients.prototype.SendMessageToFacebook = function () {
        };
        Clients.prototype.sendInvitations = function () {
        };
        Clients.prototype.callback = function (x, v, c) {
            switch (c.p.Type) {
                case UI_16.UI.Glyphs.plusSign:
                    c.t.AddClient();
                    break;
                case UI_16.UI.Glyphs.edit:
                    c.t.EditClient();
                    break;
                case UI_16.UI.Glyphs.fire:
                    c.t.RemoveClient();
                    break;
                case UI_16.UI.Glyphs.search:
                    c.t.Search();
                    break;
                case UI_16.UI.Glyphs.creditCard:
                    c.t.rm.Open(v, { Owner: c.t, Invoke: c.t.OnContextMenuFired }, null, true);
                    break;
                default:
                    UI_16.UI.InfoArea.push("Unrechable Code");
                    return;
            }
        };
        Clients.prototype.OnDeepSearch = function () {
            var _this = this;
            if (!this._deepSearch)
                this._deepSearch = new Search_2.SearchData.Client;
            this._deepSearch.Open(function (x) { return _this.searchList.Filter = _this._deepSearch; });
        };
        Clients.prototype.OnContextMenuFired = function (r, selected) {
            if (selected === 'Ouvrir' || selected === 'Supprimer')
                this.OpenVersments(selected === 'Supprimer');
            else if (selected === 'Regler' || selected === 'Verser')
                this.verser(selected === 'Regler');
        };
        Clients.prototype.OpenVersments = function (forDelete) {
            if (this.adapter.SelectedItem)
                GData.apis.Versment.OpenVersmentsOfClient(this.adapter.SelectedItem, function (results, selected, fournisseur, success) {
                    if (success && forDelete) {
                        if (selected) {
                            UI_16.UI.Modal.ShowDialog("Confirmation", "Voulez- vous vraiment supprimer ce veremnet", function (xx) {
                                if (xx.Result === UI_16.UI.MessageResult.ok)
                                    GData.apis.Versment.Delete(selected, function (e) {
                                        if (e.Error === Basics_10.basics.DataStat.Success) {
                                            UI_16.UI.InfoArea.push("Ce Virement Est bien Supprimé", true, 5000);
                                        }
                                        else {
                                            UI_16.UI.InfoArea.push("Une erreur s'est produite lorsque nous avons supprimé cette version", true, 5000);
                                        }
                                    });
                            }, "Supprimer", "Annuler");
                        }
                        else
                            UI_16.UI.InfoArea.push("Vous ne sélectionnez aucun Virement");
                    }
                });
            else {
                UI_16.UI.InfoArea.push("You Must Set first the client");
            }
        };
        Clients.prototype.verser = function (regler) {
            var data = this.adapter.SelectedItem;
            if (!data)
                return UI_16.UI.Modal.ShowDialog("ERROR", "Selecter une Client pour ajouter une versment");
            if (regler)
                return GData.apis.Versment.Regler(null, data);
            GData.apis.Versment.VerserTo(null, data);
        };
        return Clients;
    }(UI_16.UI.NavPanel));
    exports.Clients = Clients;
});
define("Desktop/Admin/Fournisseurs", ["require", "exports", "../../lib/Q/sys/UI", "abstract/extra/Common", "../../lib/Q/sys/Corelib", "abstract/extra/Basics", "../../lib/Q/sys/Filters", "Desktop/Search", "../../lib/Q/components/HeavyTable/script", "assets/data/data"], function (require, exports, UI_17, Common_8, Corelib_14, Basics_11, Filters_3, Search_3, script_7, data_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GData;
    Common_8.GetVars(function (v) {
        GData = v;
        return false;
    });
    var Fournisseurs = (function (_super) {
        __extends(Fournisseurs, _super);
        function Fournisseurs() {
            var _this = _super.call(this, "Fournissurs", "Fournisseurs") || this;
            _this.searchFilter = new Filters_3.filters.list.StringFilter();
            _this._creditCart = new UI_17.UI.Glyph(UI_17.UI.Glyphs.creditCard, false, 'Add');
            _this.rm = new UI_17.UI.RichMenu(undefined, ["Regler", "Verser", "Supprimer", "", "Ouvrir"], _this._creditCart);
            UI_17.UI.Desktop.Current.KeyCombiner.On('O', 'M', function (s) { alert('Success'); }, _this, _this);
            _this.OnInitialized = function (t) { return Corelib_14.Api.RiseApi('loadFournisseurs', void 0); };
            return _this;
        }
        Object.defineProperty(Fournisseurs.prototype, "HasSearch", {
            get: function () { return UI_17.UI.SearchActionMode.Instantany; },
            set: function (v) { },
            enumerable: true,
            configurable: true
        });
        Fournisseurs.prototype.initialize = function () {
            _super.prototype.initialize.call(this);
            this.Add(Common_8.funcs.initializeSBox("Fournisseurs").container);
            var tbl;
            this.adapter = (tbl = new script_7.Material.HeavyTable(data_6.data.value.fournisseurTable.def)).applyStyle('row');
            this.paginator = UI_17.UI.Paginator.createPaginator(this.adapter, this.searchList = GData.__data.Fournisseurs.Filtred(this.searchFilter), 10);
            this.Add(this.paginator);
            tbl.setOrderHandler({ Invoke: this.OrderBy, Owner: this });
        };
        Fournisseurs.prototype.OrderBy = function (e) {
            switch (e.orderBy) {
                case "Id":
                    return this.searchList.OrderBy(function (a, b) { return e.state.factor * (a.Id - b.Id); });
                case "Name":
                    return this.searchList.OrderBy(function (a, b) { return e.state.factor * (a.Name || "").localeCompare(b.Name || ""); });
                case "Tel":
                    return this.searchList.OrderBy(function (a, b) { return e.state.factor * (a.Tel || "").localeCompare(b.Tel || ""); });
                case "TotalM":
                    return this.searchList.OrderBy(function (a, b) { return e.state.factor * (a.MontantTotal - b.MontantTotal); });
                case "TotalV":
                    return this.searchList.OrderBy(function (a, b) { return e.state.factor * (a.VersmentTotal - b.VersmentTotal); });
                case "TotalS":
                    return this.searchList.OrderBy(function (a, b) { return e.state.factor * (a.SoldTotal - b.SoldTotal); });
                default:
            }
        };
        Fournisseurs.prototype.OnDeepSearch = function () {
            var _this = this;
            if (!this._deepSearch)
                this._deepSearch = new Search_3.SearchData.Fournisseur;
            this._deepSearch.Open(function (x) { return _this.searchList.Filter = _this._deepSearch; });
        };
        Fournisseurs.prototype.OnKeyDown = function (e) {
            if (!this.paginator.OnKeyDown(e)) {
                if (e.keyCode === UI_17.UI.Keys.F1)
                    this.getHelp({
                        "F2": "Add New",
                        "F3": "Deep Searche",
                        "F5": "Update",
                        "F9": "Settle Debts",
                        "F10": "Versments",
                        "Suppr": "Delete",
                        "Enter": "Edit"
                    });
                else if (e.keyCode === UI_17.UI.Keys.F2)
                    this.AddFournisseur();
                else if (this.adapter.SelectedIndex != -1)
                    if (e.keyCode === 13)
                        this.EditFournisseur();
                    else if (e.keyCode === UI_17.UI.Keys.Delete)
                        this.RemoveFournisseur();
                    else if (e.keyCode === UI_17.UI.Keys.F9)
                        this.verser(true);
                    else if (e.keyCode === UI_17.UI.Keys.F10)
                        this.OpenVersments(false);
                    else
                        return _super.prototype.OnKeyDown.call(this, e);
                else
                    return _super.prototype.OnKeyDown.call(this, e);
            }
            e.stopPropagation();
            e.preventDefault();
            return true;
        };
        Fournisseurs.prototype.OnSearche = function (oldPatent, newPatent) {
            var t = this.searchList.Filter == this.searchFilter;
            this.searchFilter.Patent = new Filters_3.filters.list.StringPatent(newPatent);
            if (!t)
                this.searchList.Filter = this.searchFilter;
        };
        Fournisseurs.prototype.Update = function () {
            GData.apis.Fournisseur.SmartUpdate();
        };
        Fournisseurs.prototype.AddFournisseur = function () {
            GData.apis.Fournisseur.CreateNew(function (f) { });
        };
        Fournisseurs.prototype.RemoveFournisseur = function () {
            GData.apis.Fournisseur.Delete(this.adapter.SelectedItem);
        };
        Fournisseurs.prototype.EditFournisseur = function () {
            GData.apis.Fournisseur.Edit(this.adapter.SelectedItem);
        };
        Fournisseurs.prototype.GetLeftBar = function () {
            var _this = this;
            if (!this.lb) {
                this.lb = new UI_17.UI.Navbar();
                var oldget = this.lb.getTemplate;
                this.lb.getTemplate = function (c) {
                    var x = new UI_17.UI.Anchore(c);
                    var e = oldget(x);
                    e.addEventListener('click', _this.callback, { t: _this, p: c });
                    return e;
                };
                var _creditCart;
                this.lb.OnInitialized = function (n) { return n.AddRange([
                    new UI_17.UI.Glyph(UI_17.UI.Glyphs.plusSign, false, 'Add'),
                    new UI_17.UI.Glyph(UI_17.UI.Glyphs.edit, false, 'Edit'),
                    new UI_17.UI.Glyph(UI_17.UI.Glyphs.fire, false, "Delete")
                ]); };
            }
            return this.lb;
        };
        Fournisseurs.prototype.GetRightBar = function () {
            var _this = this;
            if (!this.rb) {
                this.rb = new UI_17.UI.Navbar();
                var oldget = this.rb.getTemplate;
                this.rb.getTemplate = function (c) {
                    var x = new UI_17.UI.Anchore(c);
                    var e = oldget(x);
                    e.addEventListener('click', _this.callback, { t: _this, p: c });
                    return e;
                };
                this.rb.OnInitialized = function (n) { return n.AddRange([
                    _this._creditCart
                ]); };
            }
            return this.rb;
        };
        Fournisseurs.prototype.callback = function (s, e, p) {
            var __this = p.t;
            switch (p.p.Type) {
                case UI_17.UI.Glyphs.plusSign:
                    __this.AddFournisseur();
                    break;
                case UI_17.UI.Glyphs.edit:
                    __this.EditFournisseur();
                    break;
                case UI_17.UI.Glyphs.fire:
                    __this.RemoveFournisseur();
                    break;
                case UI_17.UI.Glyphs.search:
                    __this.OnDeepSearch();
                    break;
                case UI_17.UI.Glyphs.creditCard:
                    p.t.rm.Open(e, { Owner: __this, Invoke: p.t.OnContextMenuFired }, null, true);
                    break;
            }
        };
        Fournisseurs.prototype.OnContextMenuFired = function (r, selected) {
            if (selected === 'Ouvrir' || selected === 'Supprimer')
                this.OpenVersments(selected === 'Supprimer');
            else if (selected === 'Regler' || selected === 'Verser')
                this.verser(selected === 'Regler');
        };
        Fournisseurs.prototype.OpenVersments = function (forDelete) {
            if (this.adapter.SelectedItem)
                GData.apis.SVersment.OpenSVersmentsOfFournisseur(this.adapter.SelectedItem, function (results, selected, fournisseur, success) {
                    if (success && forDelete) {
                        if (selected) {
                            UI_17.UI.Modal.ShowDialog("Confirmation", "Voulez- vous vraiment supprimer ce veremnet", function (xx) {
                                if (xx.Result === UI_17.UI.MessageResult.ok)
                                    GData.apis.SVersment.Delete(selected, function (e) {
                                        if (e.Error === Basics_11.basics.DataStat.Success) {
                                            UI_17.UI.InfoArea.push("Ce Virement Est bien Supprimé", true, 5000);
                                        }
                                        else {
                                            UI_17.UI.InfoArea.push("Une erreur s'est produite lorsque nous avons supprimé cette version", true, 5000);
                                        }
                                    });
                            }, "Supprimer", "Annuler");
                        }
                    }
                });
            else
                UI_17.UI.Modal.ShowDialog("Info", "Selectioner un fournisseur", void 0, "OK", null, null);
        };
        Fournisseurs.prototype.verser = function (regler) {
            var data = this.adapter.SelectedItem;
            if (!data)
                return UI_17.UI.Modal.ShowDialog("ERROR", "Selecter une Fournisseur pour ajouter une versment");
            if (regler)
                return GData.apis.SVersment.Regler(null, data);
            GData.apis.SVersment.VerserTo(null, data);
        };
        return Fournisseurs;
    }(UI_17.UI.NavPanel));
    exports.Fournisseurs = Fournisseurs;
});
define("Desktop/Admin/Logins", ["require", "exports", "../../lib/Q/sys/UI", "../../lib/Q/sys/Corelib", "abstract/Models", "abstract/extra/Common", "Desktop/Search", "../../lib/Q/sys/Filters"], function (require, exports, UI_18, Corelib_15, Models_26, Common_9, Search_4, Filters_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var b = true;
    var GData;
    Common_9.GetVars(function (v) {
        GData = v;
        return false;
    });
    var RegularUsersService = (function () {
        function RegularUsersService() {
        }
        RegularUsersService.prototype.GetLeftBar = function (target) {
            var _this = this;
            if (!this.lb) {
                this.lb = new UI_18.UI.Navbar();
                this.permission = new UI_18.UI.Glyph(UI_18.UI.Glyphs.flag, false, 'Permissions');
                this.validate = new UI_18.UI.Glyph(UI_18.UI.Glyphs.check, false, 'Validate');
                this.lock = new UI_18.UI.Glyph(UI_18.UI.Glyphs.lock, false, 'Lock');
                var oldget = this.lb.getTemplate;
                this.lb.getTemplate = function (c) {
                    var x = new UI_18.UI.Anchore(c);
                    var e = oldget(x);
                    e.addEventListener('click', _this.callback, { t: _this, p: c });
                    return e;
                };
                this.lb.OnInitialized = function (n) { return n.AddRange([_this.permission, _this.validate, _this.lock]); };
            }
            this._targer = target;
            return this.lb;
        };
        RegularUsersService.prototype.callback = function (s, e, p) {
            var t = p.t._targer;
            if (t)
                switch (p.p.Type) {
                    case UI_18.UI.Glyphs.flag:
                        t.ChangePermission();
                        return;
                    case UI_18.UI.Glyphs.check:
                        t.Validate();
                        return;
                    case UI_18.UI.Glyphs.lock:
                        t.Lock();
                        return;
                    default:
                        throw "Unreachable Code";
                }
        };
        RegularUsersService.prototype.callback_right = function (s, e, p) {
            var t = p.t._targer;
            if (t)
                switch (p.p.Type) {
                    case UI_18.UI.Glyphs.plusSign:
                        t.AddUser();
                        return;
                    case UI_18.UI.Glyphs.listAlt:
                        t.Edit();
                        return;
                    case UI_18.UI.Glyphs.trash:
                        t.Delete();
                        return;
                    case UI_18.UI.Glyphs.search:
                        t.Search();
                        return;
                    case UI_18.UI.Glyphs.filter:
                        t.Filter();
                    default:
                        throw "Unreachable Code";
                }
        };
        RegularUsersService.prototype.GetRightBar = function (target) {
            var _this = this;
            if (!this.rb) {
                this.rb = new UI_18.UI.Navbar();
                this.add = new UI_18.UI.Glyph(UI_18.UI.Glyphs.plusSign, false, 'Add');
                this.edit = new UI_18.UI.Glyph(UI_18.UI.Glyphs.listAlt, false, 'Edit');
                this.delete = new UI_18.UI.Glyph(UI_18.UI.Glyphs.trash, false, 'Delete');
                this.srch = new UI_18.UI.Glyph(UI_18.UI.Glyphs.search, false, 'Search');
                this.filter = new UI_18.UI.Glyph(UI_18.UI.Glyphs.filter, false, 'Filter');
                var oldget = this.rb.getTemplate;
                this.rb.getTemplate = function (c) {
                    var x = new UI_18.UI.Anchore(c);
                    var e = oldget(x);
                    e.addEventListener('click', _this.callback_right, { t: _this, p: c });
                    return e;
                };
                this.rb.OnInitialized = function (n) { return n.AddRange([_this.filter, _this.srch, Common_9.funcs.createSparator(), _this.add, _this.edit, _this.delete]); };
            }
            this._targer = target;
            return this.rb;
        };
        Object.defineProperty(RegularUsersService.prototype, "Target", {
            set: function (c) { this._targer = c; },
            enumerable: true,
            configurable: true
        });
        return RegularUsersService;
    }());
    var RegularUsers = (function (_super) {
        __extends(RegularUsers, _super);
        function RegularUsers() {
            var _this = _super.call(this, 'regular_users', "Regular Comptes") || this;
            _this.adapter = new UI_18.UI.ListAdapter('Client.Validation', 'UnRegUser.row');
            _this.searchFilter = new Filters_4.filters.list.StringFilter();
            _this.Title = "Regular Comptes";
            return _this;
        }
        RegularUsers.prototype.OnDeepSearch = function () {
            var _this = this;
            if (!this._deepSearch)
                this._deepSearch = new Search_4.SearchData.Login;
            this._deepSearch.Open(function (x) {
                var t = _this.searchList.Filter == _this._deepSearch;
                _this.searchList.Filter = _this._deepSearch;
                if (t)
                    _this.searchList.Reset();
            });
        };
        RegularUsers.prototype.OnSearche = function (oldPatent, newPatent) {
            var t = this.searchList.Filter == this.searchFilter;
            this.searchFilter.Patent = new Filters_4.filters.list.StringPatent(newPatent);
            if (!t)
                this.searchList.Filter = this.searchFilter;
            else
                this.searchList.Reset();
        };
        RegularUsers.prototype.OnKeyDown = function (e) {
            if (!this.adapter.OnKeyDown(e))
                _super.prototype.OnKeyDown.call(this, e);
        };
        RegularUsers.prototype.initialize = function () {
            var _this = this;
            _super.prototype.initialize.call(this);
            this.Add(this.adapter);
            this.adapter.OnInitialized = function (p) { return _this.Update(); };
            this.searchList = GData.validateLogins.Filtred(this.searchFilter);
        };
        RegularUsers.prototype.Update = function () {
            var _this = this;
            GData.validateLogins.Clear();
            GData.requester.Get(Models_26.models.Logins, GData.validateLogins, null, function (s, r, iss) {
                if (iss)
                    _this.adapter.Source = _this.searchList;
            }, function (r, t) { return r.Url = "/_/Users?Valide=True"; });
        };
        RegularUsers.prototype.GetLeftBar = function () { return userService.GetLeftBar(this); };
        RegularUsers.prototype.GetRightBar = function () { return userService.GetRightBar(this); };
        Object.defineProperty(RegularUsers.prototype, "SelectedUser", {
            get: function () { return this.adapter.SelectedItem; },
            enumerable: true,
            configurable: true
        });
        RegularUsers.prototype.ChangePermission = function () { UI_18.UI.InfoArea.push("The Functionality Is Not Implimented Yet"); };
        RegularUsers.prototype.Lock = function () {
            var t = this.SelectedUser;
            if (t)
                Corelib_15.Api.RiseApi('lockuser', { data: t });
        };
        RegularUsers.prototype.Validate = function () {
            var t = this.SelectedUser;
            if (t)
                Corelib_15.Api.RiseApi('validateuser', { data: t });
        };
        RegularUsers.prototype.Delete = function () {
            var t = this.SelectedUser;
            if (t)
                Corelib_15.Api.RiseApi('removeuser', { data: t });
        };
        RegularUsers.prototype.Edit = function () { UI_18.UI.InfoArea.push("The Functionality Is Not Implimented Yet"); };
        RegularUsers.prototype.AddUser = function () { UI_18.UI.InfoArea.push("The Functionality Is Not Implimented Yet"); };
        RegularUsers.prototype.Filter = function () { UI_18.UI.InfoArea.push("The Functionality Is Not Implimented Yet"); };
        RegularUsers.prototype.Search = function () { UI_18.UI.InfoArea.push("The Functionality Is Not Implimented Yet"); };
        return RegularUsers;
    }(UI_18.UI.NavPanel));
    exports.RegularUsers = RegularUsers;
    var UnRegularUsers = (function (_super) {
        __extends(UnRegularUsers, _super);
        function UnRegularUsers() {
            var _this = _super.call(this, 'blocked_users', "Blocked Comptes") || this;
            _this.adapter = new UI_18.UI.ListAdapter('Client.Validation', 'RegUser.row');
            _this.searchFilter = new Filters_4.filters.list.StringFilter();
            _this.Title = "Blocked Comptes";
            return _this;
        }
        UnRegularUsers.prototype.OnDeepSearch = function () {
            var _this = this;
            if (!this._deepSearch)
                this._deepSearch = new Search_4.SearchData.Login;
            this._deepSearch.Open(function (x) {
                var t = _this.searchList.Filter == _this._deepSearch;
                _this.searchList.Filter = _this._deepSearch;
                if (t)
                    _this.searchList.Reset();
            });
        };
        UnRegularUsers.prototype.OnSearche = function (oldPatent, newPatent) {
            this.searchFilter.Patent = new Filters_4.filters.list.StringPatent(newPatent);
        };
        UnRegularUsers.prototype.OnKeyDown = function (e) {
            if (!this.adapter.OnKeyDown(e))
                _super.prototype.OnKeyDown.call(this, e);
        };
        UnRegularUsers.prototype.initialize = function () {
            var _this = this;
            _super.prototype.initialize.call(this);
            this.Add(this.adapter);
            this.adapter.OnInitialized = function (p) { return _this.Update(); };
            this.searchList = GData.invalidateLogins.Filtred(this.searchFilter);
        };
        UnRegularUsers.prototype.Update = function () {
            var _this = this;
            GData.invalidateLogins.Clear();
            GData.requester.Get(Models_26.models.Logins, GData.invalidateLogins, null, function (s, r, iss) {
                if (iss)
                    _this.adapter.Source = _this.searchList;
            }, function (r, t) {
                r.Url = "/_/Users?Valide=False";
            });
        };
        UnRegularUsers.prototype.GetLeftBar = function () { return userService.GetLeftBar(this); };
        UnRegularUsers.prototype.GetRightBar = function () { return userService.GetRightBar(this); };
        UnRegularUsers.prototype.ChangePermission = function () { UI_18.UI.InfoArea.push("The Functionality Is Not Implimented Yet"); };
        UnRegularUsers.prototype.Lock = function () { var t = this.SelectedUser; if (t)
            Corelib_15.Api.RiseApi('lockuser', { data: t }); };
        UnRegularUsers.prototype.Validate = function () { var t = this.SelectedUser; if (t)
            Corelib_15.Api.RiseApi('validateuser', { data: t }); };
        UnRegularUsers.prototype.Delete = function () { var t = this.SelectedUser; if (t)
            Corelib_15.Api.RiseApi('removeuser', { data: t }); };
        UnRegularUsers.prototype.Edit = function () { UI_18.UI.InfoArea.push("The Functionality Is Not Implimented Yet"); };
        UnRegularUsers.prototype.AddUser = function () { UI_18.UI.InfoArea.push("The Functionality Is Not Implimented Yet"); };
        UnRegularUsers.prototype.Filter = function () { UI_18.UI.InfoArea.push("The Functionality Is Not Implimented Yet"); };
        UnRegularUsers.prototype.Search = function () { UI_18.UI.InfoArea.push("The Functionality Is Not Implimented Yet"); };
        Object.defineProperty(UnRegularUsers.prototype, "SelectedUser", {
            get: function () { return this.adapter.SelectedItem; },
            enumerable: true,
            configurable: true
        });
        return UnRegularUsers;
    }(UI_18.UI.NavPanel));
    exports.UnRegularUsers = UnRegularUsers;
    var userService = new RegularUsersService();
});
define("Desktop/Admin/Products", ["require", "exports", "../../lib/Q/sys/UI", "abstract/extra/Common", "abstract/Models", "../../lib/Q/sys/Filters", "../../lib/Q/sys/Corelib", "Desktop/Search", "Componenets/Forms", "Desktop/Jobs", "Componenets/PStat"], function (require, exports, UI_19, Common_10, Models_27, Filters_5, Corelib_16, Search_5, Forms_2, Jobs_2, PStat_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GData;
    Common_10.GetVars(function (v) {
        GData = v;
        return false;
    });
    var ProductsNav = (function (_super) {
        __extends(ProductsNav, _super);
        function ProductsNav() {
            var _this = _super.call(this, 'products', "Produits") || this;
            _this.btn_add = Common_10.extern.crb('plus', 'Add', 'primary');
            _this.btn_edit = Common_10.extern.crb('pencile', 'Edit', 'success');
            _this.btn_remove = Common_10.extern.crb('trash', 'Remove', 'danger');
            _this.group_cnt = new UI_19.UI.Div().applyStyle('pull-right', 'flat');
            _this.group_tcnt = new UI_19.UI.Div().applyStyle('icontent-header');
            _this.adapter = new UI_19.UI.ListAdapter('Products.table', null && 'Product.row');
            _this._caption = document.createTextNode("Products");
            _this.searchFilter = new Filters_5.filters.list.StringFilter();
            _this.serv = new ProductService();
            _this.__order = new order(_this);
            return _this;
        }
        ProductsNav.prototype.OnSearche = function (oldPatent, newPatent) {
            var t = this.searchList.Filter == this.searchFilter;
            this.searchFilter.Patent = new Filters_5.filters.list.StringPatent(newPatent);
            if (!t)
                this.searchList.Filter = this.searchFilter;
            else
                this.searchList.Reset();
        };
        ProductsNav.prototype.OnDeepSearch = function () {
            var _this = this;
            if (!this._deepSearch)
                this._deepSearch = new Search_5.SearchData.Product;
            this._deepSearch.Open(function (x) {
                var t = _this.searchList.Filter == _this._deepSearch;
                _this.searchList.Filter = _this._deepSearch;
                if (t)
                    _this.searchList.Reset();
            });
        };
        Object.defineProperty(ProductsNav.prototype, "HasSearch", {
            get: function () { return UI_19.UI.SearchActionMode.Instantany; },
            set: function (v) { },
            enumerable: true,
            configurable: true
        });
        ProductsNav.prototype.OnKeyDown = function (e) {
            if (!this.paginator.OnKeyDown(e)) {
                if (e.keyCode === UI_19.UI.Keys.F1)
                    this.getHelp({
                        "F2": "Add New",
                        "F3": "Deep Searche",
                        "F5": "Update",
                        "F9": "Add Revage",
                        "F10": "Edit Revage",
                        "Suppr": "Delete",
                        "Enter": "Edit"
                    });
                else if (e.keyCode === UI_19.UI.Keys.F2)
                    this.btnAddClick();
                else if (this.adapter.SelectedIndex != -1)
                    if (e.keyCode === 13)
                        if (e.ctrlKey)
                            this.showAvatar();
                        else
                            this.btnEditClick();
                    else if (e.keyCode === UI_19.UI.Keys.Delete)
                        this.btnRemoveClick();
                    else
                        return _super.prototype.OnKeyDown.call(this, e);
                else
                    return _super.prototype.OnKeyDown.call(this, e);
            }
            e.stopPropagation();
            e.preventDefault();
            return true;
        };
        ProductsNav.prototype.Update = function () {
            GData.apis.Product.SmartUpdate();
        };
        ProductsNav.prototype.initsec = function () {
            var div = this.group_cnt.View;
            div.appendChild(this.btn_add);
            div.appendChild(this.btn_edit);
            div.appendChild(this.btn_remove);
            this.group_tcnt.View.appendChild(this._caption);
            this.group_tcnt.Add(this.group_cnt);
            this.Add(this.group_tcnt);
            this.initPaginator();
            this.btn_add.addEventListener('click', { handleEvent: function (e) { this.self.btnAddClick(); }, self: this });
            this.btn_edit.addEventListener('click', { handleEvent: function (e) { this.self.btnEditClick(); }, self: this });
            this.btn_remove.addEventListener('click', { handleEvent: function (e) { this.self.btnRemoveClick(); }, self: this });
            this.adapter.AcceptNullValue = false;
        };
        ProductsNav.prototype.initPaginator = function () {
            var _this = this;
            this.paginator = new UI_19.UI.Paginator(10);
            this.paginator.OnInitialized = function (p) {
                _this.adapter.OnInitialized = function (l) {
                    var x = _this.searchList = Corelib_16.collection.ExList.New(GData.__data.Products, _this.searchFilter);
                    l.Source = Corelib_16.collection.ExList.New(x, _this.paginator.Filter);
                    _this.paginator.BindMaxToSourceCount(x);
                };
                _this.paginator.Content = _this.adapter;
            };
            this.Add(this.paginator);
        };
        ProductsNav.prototype.btnAddClick = function () {
            GData.apis.Product.CreateNew();
        };
        ProductsNav.prototype.btnEditClick = function () {
            GData.apis.Product.Edit(this.adapter.SelectedItem, null);
        };
        ProductsNav.prototype.btnRemoveClick = function () {
            GData.apis.Product.Delete(this.adapter.SelectedItem, null);
        };
        ProductsNav.prototype.initEvents = function () {
            this.btn_add.addEventListener('click', { handleEvent: function (e) { this.self.btnAddClick(e); }, self: this });
            this.btn_edit.addEventListener('click', { handleEvent: function (e) { this.self.btnEditClick(e); }, self: this });
            this.btn_remove.addEventListener('click', { handleEvent: function (e) { this.self.btnRemoveClick(e); }, self: this });
        };
        ProductsNav.prototype.initialize = function () {
            _super.prototype.initialize.call(this);
            this.initsec();
            UI_19.UI.Desktop.Current.KeyCombiner.On('S', 'R', function (s, e) {
                var _this = this;
                s.Cancel = true;
                var q = PStat_2.Statistique.Views.ListOfArticles.OpenQuery();
                q.OnInitialized = function (n) { return n.SelectedProduct = _this.adapter.SelectedItem; };
            }, this, this);
            UI_19.UI.Desktop.Current.KeyCombiner.On('S', 'D', function (s, e) { PStat_2.Statistique.Views.ListOfArticles.Open(); s.Cancel; }, this, this);
        };
        ProductsNav.prototype.OnPrint = function () {
            _super.prototype.OnPrint.call(this);
            var l = this.adapter.Source.Source.AsList();
            var x = new Array(l.length);
            for (var i = 0; i < x.length; i++)
                x[i] = l[i].Id;
            GData.requester.Request(Models_27.models.Products, "PRINT", JSON.stringify(x.join('|')), void 0, function (a, b, c) {
                if (b.Response && b.Response.Success) {
                    var url = __global.ApiServer.Combine('/_/$?Id=' + b.Response.FileName).FullPath;
                    Forms_2.Forms.PDFViewer.Show(url);
                }
            });
        };
        ProductsNav.prototype.selectavatar = function () {
            var _this = this;
            var r;
            if (!this.pictureEditor) {
                (this.pictureEditor = new Jobs_2.PictureEditor(this.adapter));
                r = true;
            }
            this.pictureEditor.Open(function (s) {
                s.Upload(_this.adapter.SelectedItem, function (e) {
                    if (e.Error == Corelib_16.basic.DataStat.Success) {
                        UI_19.UI.InfoArea.push('La picture successfully uploaded');
                    }
                    else if (e.Error == Corelib_16.basic.DataStat.OperationCanceled)
                        UI_19.UI.InfoArea.push('L\'Operation Annulé');
                    else
                        UI_19.UI.InfoArea.push('Une Error occure !!!!!!!!!');
                });
            });
            if (r)
                this.pictureEditor.OnInitialized = function (n) { return n.SetVisible(UI_19.UI.MessageResult.ok, false); };
        };
        ProductsNav.prototype.showAvatar = function () {
            if (!this.s) {
                var s = this.s = Corelib_16.bind.Scop.Create('SelectedItem', this.adapter, Corelib_16.bind.BindingMode.SourceToTarget, this.__Controller__);
                s.OnPropertyChanged(Corelib_16.bind.Scop.DPValue, function (s, e) {
                    var p = e._new;
                    if (Forms_2.Forms.ImageModal.Default.IsOpen) {
                        var t = p && p.Picture;
                        Forms_2.Forms.ImageModal.Default.Open(t == undefined || t == '' ? '' : '/_/Picture/' + t, p && p.toString());
                    }
                }, this);
                Forms_2.Test1();
            }
            var p = this.adapter.SelectedItem;
            if (p) {
                var t = p && p.Picture;
                Forms_2.Forms.ImageModal.Default.Open(t == undefined || t == '' ? '' : '/_/Picture/' + t, p && p.toString());
            }
        };
        ProductsNav.prototype.GetLeftBar = function () { return this.serv.GetLeftBar(this); };
        ProductsNav.prototype.GetRightBar = function () { return this.serv.GetRightBar(this); };
        return ProductsNav;
    }(UI_19.UI.NavPanel));
    exports.ProductsNav = ProductsNav;
    var order = (function () {
        function order(prd) {
            this.prd = prd;
            this.ctg = -1;
            this.nm = -1;
            this.dim = -1;
            this.ser = -1;
            this.qlt = -1;
            this.qte = -1;
            this.prx = -1;
        }
        Object.defineProperty(order.prototype, "list", {
            get: function () { return this.prd.adapter.Source; },
            enumerable: true,
            configurable: true
        });
        order.prototype.OrderByCategory = function (e, s) {
            var _this = this;
            this.ctg = -this.ctg;
            var t = function (a) { return (a && (a = a.Category) && a.Name) || ""; };
            this.list.OrderBy(function (a, b) { return _this.ctg * t(a).localeCompare(t(b)); });
        };
        order.prototype.OrderByName = function (e, s) {
            var _this = this;
            this.nm = -this.nm;
            this.list.OrderBy(function (a, b) { return _this.nm * (a.Name || "").localeCompare(b.Name || ""); });
        };
        order.prototype.OrderByDimention = function (e, s) {
            var _this = this;
            this.dim = -this.dim;
            this.list.OrderBy(function (a, b) { return _this.dim * (a.Dimention || "").localeCompare(b.Dimention || ""); });
        };
        order.prototype.OrderBySerieName = function (e, s) {
            var _this = this;
            this.ser = -this.ser;
            this.list.OrderBy(function (a, b) { return _this.ser * (a.SerieName || "").localeCompare(b.SerieName || ""); });
        };
        order.prototype.OrderByQuality = function (e, s) {
            var _this = this;
            this.qlt = -this.qlt;
            this.list.OrderBy(function (a, b) { return _this.qlt * (a.Quality - b.Quality); });
        };
        order.prototype.OrderByQte = function (e, s) {
            var _this = this;
            this.qte = -this.qte;
            this.list.OrderBy(function (a, b) { return _this.qte * (a.Qte - b.Qte); });
        };
        order.prototype.OrderByPrice = function (e, s) {
            var _this = this;
            this.prx = -this.prx;
            this.list.OrderBy(function (a, b) { return _this.prx * (a.Value - b.Value); });
        };
        return order;
    }());
    var ProductService = (function () {
        function ProductService() {
        }
        ProductService.prototype.handleSerices = function (s, e, p) {
            var t = p.t.target;
            if (!t)
                return;
            var c = UI_19.UI.Glyphs;
            switch (p.c) {
                case c.edit:
                    t.btnEditClick();
                    break;
                case c.plusSign:
                    t.btnAddClick();
                    break;
                case c.fire:
                    t.btnRemoveClick();
                    break;
                case c.flash:
                    break;
                case c.picture:
                    t.selectavatar();
                    break;
            }
        };
        ProductService.prototype.GetLeftBar = function (target) {
            var _this = this;
            this.target = target;
            if (!this.lb) {
                var r = this.lb = new UI_19.UI.Navbar();
                Common_10.funcs.setTepmlate(r, this, this.handleSerices);
                r.OnInitialized = function (r) {
                    _this._edit = new UI_19.UI.Glyph(UI_19.UI.Glyphs.edit, false, 'Edit');
                    _this._new = new UI_19.UI.Glyph(UI_19.UI.Glyphs.plusSign, false, 'New');
                    _this._delete = new UI_19.UI.Glyph(UI_19.UI.Glyphs.fire, false, 'Delete');
                    r.AddRange([_this._new, _this._edit, _this._delete, Common_10.funcs.createSparator(),
                    ]);
                };
            }
            return this.lb;
        };
        ProductService.prototype.GetRightBar = function (target) {
            var _this = this;
            this.target = target;
            if (!this.rb) {
                var r = this.rb = new UI_19.UI.Navbar();
                Common_10.funcs.setTepmlate(r, this, this.handleSerices);
                r.OnInitialized = function (r) {
                    r.AddRange([
                        _this.add2stock = new UI_19.UI.Glyph(UI_19.UI.Glyphs.flash, false, 'Add 2 Stock'),
                        Common_10.funcs.createSparator(),
                        _this.picture = new UI_19.UI.Glyph(UI_19.UI.Glyphs.picture, false, 'Select Avatar')
                    ]);
                };
            }
            return this.rb;
        };
        return ProductService;
    }());
});
define("Desktop/Admin/FacturesNonValider", ["require", "exports", "../../lib/Q/sys/UI", "../../lib/Q/sys/Corelib", "abstract/extra/Common", "abstract/extra/Basics", "../../lib/Q/sys/Filters", "Desktop/Search"], function (require, exports, UI_20, Corelib_17, Common_11, Basics_12, Filters_6, Search_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GData;
    Common_11.GetVars(function (v) {
        GData = v;
        return false;
    });
    var FactureNav = (function (_super) {
        __extends(FactureNav, _super);
        function FactureNav(app) {
            var _this = _super.call(this, 'factures_nonvalider', "Factures Non Valider") || this;
            _this.app = app;
            _this.adapter = new UI_20.UI.ListAdapter('Factures.InValidation', 'Factures.row');
            _this.searchFilter = new Filters_6.filters.list.StringFilter();
            _this.Title = "Les Facture Non Validé";
            return _this;
        }
        FactureNav.prototype.OnSearche = function (oldPatent, newPatent) {
            var t = this.searchList.Filter == this.searchFilter;
            this.searchFilter.Patent = new Filters_6.filters.list.StringPatent(newPatent);
            if (!t)
                this.searchList.Filter = this.searchFilter;
            else
                this.searchList.Reset();
        };
        FactureNav.prototype.OnDeepSearch = function () {
            var _this = this;
            if (!this._deepSearch)
                this._deepSearch = new Search_6.SearchData.Facture;
            this._deepSearch.Open(function (x) {
                var t = _this.searchList.Filter == _this._deepSearch;
                _this.searchList.Filter = _this._deepSearch;
                if (t)
                    _this.searchList.Reset();
            });
        };
        Object.defineProperty(FactureNav.prototype, "HasSearch", {
            get: function () { return UI_20.UI.SearchActionMode.Instantany; },
            set: function (v) { },
            enumerable: true,
            configurable: true
        });
        FactureNav.prototype.OnKeyDown = function (e) {
            if (!this.adapter.OnKeyDown(e)) {
                if (e.keyCode === UI_20.UI.Keys.F1)
                    this.getHelp({
                        "F2": "Add New",
                        "F3": "Deep Searche",
                        "F5": "Update",
                        "F9": "Settle Debts",
                        "F10": "Versments",
                        "Suppr": "Delete",
                        "Enter": "Edit"
                    });
                else if (e.keyCode === UI_20.UI.Keys.F2)
                    this.New();
                else if (this.adapter.SelectedIndex != -1)
                    if (e.keyCode === 13)
                        this.Open();
                    else if (e.keyCode === UI_20.UI.Keys.Delete)
                        this.Delete();
                    else if (e.keyCode === UI_20.UI.Keys.F9)
                        this.verser(true);
                    else if (e.keyCode === UI_20.UI.Keys.F10)
                        this.OpenVersments(false);
                    else
                        return _super.prototype.OnKeyDown.call(this, e);
                else
                    return _super.prototype.OnKeyDown.call(this, e);
            }
            e.stopPropagation();
            e.preventDefault();
            return true;
        };
        FactureNav.prototype.Open = function () {
            Corelib_17.Api.RiseApi('OpenFacture', { data: this.adapter.SelectedItem });
        };
        FactureNav.prototype.Delete = function () {
            Corelib_17.Api.RiseApi('DeleteFacture', { data: this.adapter.SelectedItem });
        };
        FactureNav.prototype.New = function () {
            Corelib_17.Api.RiseApi("NewFacture", {
                data: null,
                callback: function (p, k) { }
            });
        };
        FactureNav.prototype.OpenVersments = function (forDelete) {
            if (this.adapter.SelectedItem)
                GData.apis.Versment.OpenVersmentsOfFacture(this.adapter.SelectedItem, function (results, selected, fournisseur, success) {
                    if (success && forDelete) {
                        if (selected) {
                            UI_20.UI.Modal.ShowDialog("Confirmation", "Voulez- vous vraiment supprimer ce veremnet", function (xx) {
                                if (xx.Result === UI_20.UI.MessageResult.ok)
                                    GData.apis.Versment.Delete(selected, function (e) {
                                        if (e.Error === Basics_12.basics.DataStat.Success) {
                                            UI_20.UI.InfoArea.push("Ce Virement Est bien Supprimé", true, 5000);
                                        }
                                        else {
                                            UI_20.UI.InfoArea.push("Une erreur s'est produite lorsque nous avons supprimé cette version", true, 5000);
                                        }
                                    });
                            }, "Supprimer", "Annuler");
                        }
                        else
                            UI_20.UI.InfoArea.push("Vous ne sélectionnez aucun Virement");
                    }
                });
            else {
                UI_20.UI.InfoArea.push("You Must Set first the client");
            }
        };
        FactureNav.prototype.verser = function (regler) {
            var data = this.adapter.SelectedItem;
            if (!data)
                return UI_20.UI.Modal.ShowDialog("ERROR", "Selecter une Facture pour ajouter une versment");
            if (data.IsOpen)
                return UI_20.UI.Modal.ShowDialog("Error", 'Close the facture for you can make a versment');
            if (regler)
                return GData.apis.Versment.Regler(data, data.Client);
            GData.apis.Versment.VerserTo(data, data.Client);
        };
        FactureNav.prototype.initialize = function () {
            var _this = this;
            _super.prototype.initialize.call(this);
            this.Add(this.adapter);
            this.initJobs();
            this.adapter.OnInitialized = function (p) { return p.Source = _this.searchList = GData.__data.Factures.Filtred(_this.searchFilter); };
            this.adapter.AcceptNullValue = false;
        };
        FactureNav.prototype.initJobs = function () {
            var _this = this;
            var ser = new Corelib_17.encoding.SerializationContext(true);
            Corelib_17.bind.GetJob('SelectPage');
            Corelib_17.bind.Register({
                Name: 'openfacture', OnInitialize: function (j, e) {
                    j.addEventListener('dblclick', 'dblclick', function (e) {
                        var f = j.Scop.Value;
                        _this.app.OpenPage('Facture');
                    });
                }
            });
            Corelib_17.bind.Register({
                Name: 'facturevalidate', OnInitialize: function (j, e) {
                    j.addEventListener('onclick', 'dblclick', function (e) {
                        var f = j.Scop.Value;
                        GData.apis.Facture.Validate(f, false, function (n, x, i) {
                            if (i === Basics_12.basics.DataStat.Success) {
                                f.Freeze();
                                GData.invalidateFactures.Remove(f);
                                UI_20.UI.InfoArea.push('The Facture Is Valiated', true);
                            }
                            else
                                UI_20.UI.InfoArea.push('Error Occured When Validating The Facture', false);
                        });
                    });
                }
            });
        };
        FactureNav.prototype.Update = function () {
            GData.apis.Facture.SmartUpdate();
        };
        return FactureNav;
    }(UI_20.UI.NavPanel));
    exports.FactureNav = FactureNav;
});
define("Desktop/Admin/Categories", ["require", "exports", "../../lib/Q/sys/UI", "abstract/extra/Common", "../../lib/Q/sys/Corelib", "../../lib/Q/sys/Filters", "Desktop/Search"], function (require, exports, UI_21, Common_12, Corelib_18, Filters_7, Search_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GData;
    Common_12.GetVars(function (v) {
        GData = v;
        return false;
    });
    var ns = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '!', '"', '#', '%', '\'', '(', ')', ',', '/', ';'];
    function toRadix(n, r) {
        var t = [];
        if (r > 72)
            throw 'radix to big';
        if (r < 2)
            throw 'radix to small';
        do {
            var x = n % r;
            n = Math.floor(n / r);
            t.unshift(x);
        } while (n !== 0);
        return t;
    }
    function fromRadix(s, r) {
        var e = s[0];
        if (e == '+') {
            e = 1;
            s = s.substring(1);
        }
        if (e === '-') {
            e = -1;
            s = s.substring(1);
        }
        else
            1;
        if (r <= 36)
            s = s.toLowerCase();
        var t = 0;
        var x = 1;
        for (var i = s.length - 1; i >= 0; i--) {
            t += ns.indexOf(s[i]) * x;
            x *= r;
        }
        return t * e;
    }
    var CategoryNav = (function (_super) {
        __extends(CategoryNav, _super);
        function CategoryNav() {
            var _this = _super.call(this, 'categories', "Categories") || this;
            _this.btn_add = Common_12.extern.crb('plus', 'Add', 'primary');
            _this.btn_edit = Common_12.extern.crb('pencile', 'Edit', 'success');
            _this.btn_remove = Common_12.extern.crb('trash', 'Remove', 'danger');
            _this.group_cnt = new UI_21.UI.Div().applyStyle('pull-right', 'flat');
            _this.group_tcnt = new UI_21.UI.Div().applyStyle('icontent-header');
            _this.adapter = new UI_21.UI.ListAdapter('Categories.table', 'Category.row');
            _this._caption = document.createTextNode("Categories");
            _this.searchFilter = new Filters_7.filters.list.StringFilter();
            return _this;
        }
        CategoryNav.prototype.Update = function () {
            GData.apis.Category.SmartUpdate();
        };
        CategoryNav.prototype.initsec = function () {
            var div = this.group_cnt.View;
            div.appendChild(this.btn_add);
            div.appendChild(this.btn_edit);
            div.appendChild(this.btn_remove);
            this.group_tcnt.View.appendChild(this._caption);
            this.group_tcnt.Add(this.group_cnt);
            this.Add(this.group_tcnt);
            this.paginator = new UI_21.UI.Paginator(12);
            this.Add(this.paginator);
        };
        CategoryNav.prototype.OnSearche = function (oldPatent, newPatent) {
            var t = this.searchList.Filter == this.searchFilter;
            this.searchFilter.Patent = new Filters_7.filters.list.StringPatent(newPatent);
            if (!t)
                this.searchList.Filter = this.searchFilter;
            else
                this.searchList.Reset();
        };
        Object.defineProperty(CategoryNav.prototype, "HasSearch", {
            get: function () { return UI_21.UI.SearchActionMode.Instantany; },
            set: function (v) { },
            enumerable: true,
            configurable: true
        });
        CategoryNav.prototype.OnKeyDown = function (e) {
            if (!this.paginator.OnKeyDown(e)) {
                if (e.keyCode === UI_21.UI.Keys.F1)
                    this.getHelp({
                        "F2": "Add New",
                        "Enter": "Edit",
                        "Suppr": "Delete",
                    });
                else if (e.keyCode === UI_21.UI.Keys.Right)
                    this.paginator.Next();
                else if (e.keyCode === UI_21.UI.Keys.Left)
                    this.paginator.Previous();
                else if (e.keyCode === UI_21.UI.Keys.F2)
                    this.btnAddClick();
                else if (this.adapter.SelectedIndex != -1)
                    if (e.keyCode === 13)
                        this.btnEditClick();
                    else if (e.keyCode === UI_21.UI.Keys.Delete)
                        this.btnRemoveClick();
                    else
                        return _super.prototype.OnKeyDown.call(this, e);
                else
                    return _super.prototype.OnKeyDown.call(this, e);
            }
            e.stopPropagation();
            e.preventDefault();
            return true;
        };
        CategoryNav.prototype.btnAddClick = function () {
            GData.apis.Category.CreateNew();
        };
        CategoryNav.prototype.btnEditClick = function () {
            GData.apis.Category.Edit(this.adapter.SelectedItem);
        };
        CategoryNav.prototype.btnRemoveClick = function () {
            GData.apis.Category.Delete(this.adapter.SelectedItem);
        };
        CategoryNav.prototype.initEvents = function () {
            this.btn_add.addEventListener('click', { handleEvent: function (e) { this.self.btnAddClick(e); }, self: this });
            this.btn_edit.addEventListener('click', { handleEvent: function (e) { this.self.btnEditClick(e); }, self: this });
            this.btn_remove.addEventListener('click', { handleEvent: function (e) { this.self.btnRemoveClick(e); }, self: this });
        };
        CategoryNav.prototype.initialize = function () {
            var _this = this;
            _super.prototype.initialize.call(this);
            this.initsec();
            this.initEvents();
            this.paginator.OnInitialized = function (p) {
                _this.adapter.OnInitialized = function (l) {
                    var x = _this.searchList = Corelib_18.collection.ExList.New(GData.__data.Categories, _this.searchFilter);
                    l.Source = Corelib_18.collection.ExList.New(x, _this.paginator.Filter);
                    _this.paginator.BindMaxToSourceCount(x);
                };
                _this.paginator.Content = _this.adapter;
            };
            this.adapter.AcceptNullValue = false;
        };
        CategoryNav.prototype.GetLeftBar = function () {
            var _this = this;
            if (!this.lb) {
                var r = this.lb = new UI_21.UI.Navbar();
                Common_12.funcs.setTepmlate(r, this, this.handleSerices);
                r.OnInitialized = function (r) {
                    _this._edit = new UI_21.UI.Glyph(UI_21.UI.Glyphs.edit, false, 'Edit');
                    _this._new = new UI_21.UI.Glyph(UI_21.UI.Glyphs.plusSign, false, 'New');
                    _this._delete = new UI_21.UI.Glyph(UI_21.UI.Glyphs.fire, false, 'Delete');
                    r.AddRange([_this._new, _this._edit, _this._delete]);
                };
            }
            return this.lb;
        };
        CategoryNav.prototype.handleSerices = function (s, e, p) {
            var c = UI_21.UI.Glyphs;
            switch (p.c) {
                case c.edit:
                    return p.t.btnEditClick();
                case c.plusSign:
                    return p.t.btnAddClick();
                case c.fire:
                    return p.t.btnRemoveClick();
                default: throw "NotImplimented";
            }
        };
        CategoryNav.prototype.OnDeepSearch = function () {
            var _this = this;
            if (!this._deepSearch)
                this._deepSearch = new Search_7.SearchData.Category;
            this._deepSearch.Open(function (x) {
                var t = _this.searchList.Filter == _this._deepSearch;
                _this.searchList.Filter = _this._deepSearch;
                if (t)
                    _this.searchList.Reset();
            });
        };
        return CategoryNav;
    }(UI_21.UI.NavPanel));
    exports.CategoryNav = CategoryNav;
});
define("Desktop/Admin/Revages", ["require", "exports", "../../lib/Q/sys/UI", "../../lib/Q/sys/Corelib", "abstract/Models", "abstract/extra/Common", "../../lib/Q/sys/Filters", "Desktop/Search"], function (require, exports, UI_22, Corelib_19, Models_28, Common_13, Filters_8, Search_8) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GData;
    Common_13.GetVars(function (v) {
        GData = v;
        return false;
    });
    var EtatBases = (function (_super) {
        __extends(EtatBases, _super);
        function EtatBases(Name, Caption, Title, tableTemplate) {
            var _this = _super.call(this, Name, Caption) || this;
            _this.tableTemplate = tableTemplate;
            _this.HasSearch = UI_22.UI.SearchActionMode.Validated;
            _this.serv = new VersmentBaseServiceBar();
            return _this;
        }
        EtatBases.prototype.OnKeyDown = function (e) {
            if (!this.adapter.OnKeyDown(e)) {
                if (e.keyCode == UI_22.UI.Keys.F1) {
                    this.getHelp({
                        "Enter": "Open Transaction",
                        "Suppr": "Delete Transaction",
                        "F3": "Deep Searche",
                        "F4": "New Etat"
                    });
                }
                else if (e.keyCode === UI_22.UI.Keys.F4)
                    this.btnOpen();
                else if (e.keyCode == UI_22.UI.Keys.Enter) {
                    var x = this.adapter.SelectedItem;
                    if (x)
                        this.Open(x);
                }
                else if (e.keyCode === UI_22.UI.Keys.Delete) {
                    var x = this.adapter.SelectedItem;
                    if (x)
                        this.Delete();
                }
                if (e.keyCode == UI_22.UI.Keys.Left)
                    this.paginator.Previous();
                else if (e.keyCode == UI_22.UI.Keys.Right)
                    this.paginator.Next();
                else
                    return _super.prototype.OnKeyDown.call(this, e);
            }
            e.preventDefault();
            e.stopPropagation();
            return true;
        };
        EtatBases.prototype.initialize = function () {
            var _this = this;
            _super.prototype.initialize.call(this);
            this.adapter = new UI_22.UI.ListAdapter(this.tableTemplate);
            this.adapter.AcceptNullValue = false;
            this.adapter.ItemStyle = [];
            this.paginator = new UI_22.UI.Paginator(21);
            this.paginator.OnInitialized = function (p) {
                (_this.adapter).OnInitialized = function (l) {
                    l.Source =
                        _this.paginationList = Corelib_19.collection.ExList.New(_this.searchList = Corelib_19.collection.ExList.New(_this.getSource(), new Filters_8.filters.list.StringFilter()), _this.paginator.Filter);
                    _this.paginator.BindMaxToSourceCount(_this.searchList);
                };
                _this.paginator.Content = _this.adapter;
            };
            this.head = new UI_22.UI.TControl('templates.transferHeader', this.getSource());
            this.Add(this.head);
            this.Add(this.paginator);
        };
        EtatBases.prototype.OnDeepSearch = function () {
            var _this = this;
            if (!this._deepSearch)
                this._deepSearch = new Search_8.SearchData.Etats;
            this._deepSearch.Open(function (x) {
                var t = _this.searchList.Filter == _this._deepSearch;
                _this.searchList.Filter = _this._deepSearch;
                if (t)
                    _this.searchList.Reset();
                var xx;
            });
        };
        EtatBases.prototype.setSource = function (v) {
            { }
            this.head.Data = v;
            if (this.searchList)
                this.searchList.Source = v;
        };
        EtatBases.prototype.OnSearche = function (o, n) {
            this.searchList.Filter.Patent = new Filters_8.filters.list.StringPatent(n);
        };
        EtatBases.prototype.GetLeftBar = function () { return this.serv.GetLeftBar(this); };
        EtatBases.prototype.GetRightBar = function () { return this.serv.GetRightBar(this); };
        return EtatBases;
    }(UI_22.UI.NavPanel));
    exports.EtatBases = EtatBases;
    var Etats = (function (_super) {
        __extends(Etats, _super);
        function Etats(isFrn) {
            var _this = _super.call(this, isFrn ? "fournisseurEtat" : "clientEtat", isFrn ? "Situation Fournisseur" : "Situation  Clientele", isFrn ? "Situation  Fournisseur" : "Situation  Clientele", isFrn ? "etatTransfers.atable" : "etatTransfers.table") || this;
            _this.isFrn = isFrn;
            _this.source = new Models_28.models.EtatTransfers(null);
            return _this;
        }
        Etats.prototype.Delete = function () {
            deleteTransaction(this.adapter.SelectedItem, this.isFrn);
        };
        Etats.prototype.Open = function (v) {
            openTransaction(v, this.isFrn);
        };
        Etats.prototype.btnDeleteVersment = function () {
        };
        Etats.prototype.btnAddVersment = function () {
            throw new Error("Method not implemented.");
        };
        Etats.prototype.btnSearch = function () {
            throw new Error("Method not implemented.");
        };
        Etats.prototype.btnVersmentOfOwner = function () {
            throw new Error("Method not implemented.");
        };
        Etats.prototype.Update = function () {
            var o = this.source.Owner;
            if (o instanceof Models_28.models.Client)
                this.ExecuteCLient(o);
            else if (o instanceof Models_28.models.Fournisseur)
                this.ExecuteFournisseur(o);
            else
                this.btnOpen();
        };
        Etats.prototype.btnOpen = function () {
            var _this = this;
            if (this.isFrn)
                GData.apis.Fournisseur.Select(function (e) {
                    if (e.Error == Corelib_19.basic.DataStat.Success)
                        _this.ExecuteFournisseur(e.Data);
                }, null);
            else
                GData.apis.Client.Select(function (e) {
                    if (e.Error == Corelib_19.basic.DataStat.Success)
                        _this.ExecuteCLient(e.Data);
                }, null);
        };
        Etats.prototype.check = function (si) {
            throw new Error("Method not implemented.");
        };
        Etats.prototype.getSource = function () {
            return this.source;
        };
        Etats.prototype.ExecuteCLient = function (l) {
            var _this = this;
            this.setSource(this.source);
            this.source.Clear();
            GData.requester.Request(Models_28.models.EtatTransfers, "GET", this.source, { Id: l.Id, "IsAchat": false }, function (req, json, iss) {
                _this.source.Owner = l;
                _this.source.ReOrder();
            });
        };
        Etats.prototype.ExecuteFournisseur = function (l) {
            var _this = this;
            this.source.Clear();
            GData.requester.Request(Models_28.models.EtatTransfers, "GET", this.source, { Id: l.Id, "IsAchat": true }, function (req, json, iss) {
                _this.source.Owner = l;
                _this.source.ReOrder();
            });
        };
        return Etats;
    }(EtatBases));
    exports.Etats = Etats;
    var VersmentBaseServiceBar = (function () {
        function VersmentBaseServiceBar() {
        }
        VersmentBaseServiceBar.prototype.handleSerices = function (s, e, p) {
            var t = p.t.target;
            if (!t)
                return;
            var c = UI_22.UI.Glyphs;
            switch (p.c) {
                case c.search:
                    return t.btnOpen();
            }
        };
        VersmentBaseServiceBar.prototype.GetLeftBar = function (target) {
            var _this = this;
            this.target = target;
            if (!this.lb) {
                var r = this.lb = new UI_22.UI.Navbar();
                Common_13.funcs.setTepmlate(r, this, this.handleSerices);
                r.OnInitialized = function (r) { return r.AddRange([_this._search = new UI_22.UI.Glyph(UI_22.UI.Glyphs.search, false, 'Search')]); };
            }
            return this.lb;
        };
        VersmentBaseServiceBar.prototype.GetRightBar = function (target) {
            var _this = this;
            this.target = target;
            if (!this.rb) {
                var r = this.rb = new UI_22.UI.Navbar();
                Common_13.funcs.setTepmlate(r, this, this.handleSerices);
                r.OnInitialized = function (r) {
                    _this._delete = new UI_22.UI.Glyph(UI_22.UI.Glyphs.fire, false, 'Delete');
                    r.AddRange([_this._delete]);
                };
            }
            return this.rb;
        };
        return VersmentBaseServiceBar;
    }());
    Corelib_19.ScopicCommand.Register({
        Invoke: function (n, d, s) {
            d.addEventListener('click', function (e) { return openTransaction(s.Value); });
            return false;
        }
    }, null, 'openTransaction');
    function openTransaction(v, isFrn) {
        var data;
        if (isFrn) {
            if (v.Type == Models_28.models.TransferType.Facture) {
                data = GData.__data.SFactures.GetById(v.TransactionId);
                if (data)
                    Corelib_19.Api.RiseApi("OpenSFacture", { data: data });
            }
            else {
                GData.apis.SVersment.Show(GData.apis.SVersment.Get(v.TransactionId), void 0, false);
            }
        }
        else {
            if (v.Type == Models_28.models.TransferType.Facture) {
                data = GData.__data.Factures.GetById(v.TransactionId);
                if (data)
                    Corelib_19.Api.RiseApi("OpenFacture", { data: data });
            }
            else {
                GData.apis.Versment.Show(GData.apis.Versment.Get(v.TransactionId), undefined, false);
            }
        }
    }
    function deleteTransaction(v, isFrn) {
        if (isFrn) {
            if (v.Type == Models_28.models.TransferType.Facture) {
                GData.apis.SFacture.Delete(true, GData.__data.SFactures.GetById(v.TransactionId), null);
            }
            else {
                GData.apis.SVersment.Delete(GData.apis.SVersment.Get(v.TransactionId));
            }
        }
        else {
            if (v.Type == Models_28.models.TransferType.Facture) {
                GData.apis.Facture.Delete(true, GData.__data.Factures.GetById(v.TransactionId), null);
            }
            else {
                GData.apis.Versment.Delete(GData.apis.Versment.Get(v.TransactionId));
            }
        }
    }
    Corelib_19.ScopicCommand.Register({
        Invoke: function (n, d, s) {
            d.addEventListener('click', function (e) { return openTransaction(s.Value, true); });
            return false;
        }
    }, null, 'openaTransaction');
});
define("Modules/Charts", ["require", "exports", "../lib/q/sys/Corelib", "../lib/q/sys/UI", "../lib/Chart.bundle.js"], function (require, exports, Corelib_20, UI_23, Chart_bundle_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UIChart = (function (_super) {
        __extends(UIChart, _super);
        function UIChart(dom) {
            var _this = _super.call(this, dom || document.createElement('canvas')) || this;
            _this._hidden = [];
            _this.__data = [];
            _this.plots = {};
            _this.Change(function () {
                _this.Reset();
                _this.DataSource = new Corelib_20.collection.List(Object);
                _this.Labels = new Corelib_20.collection.List(String);
                return void 0;
            });
            return _this;
        }
        UIChart.prototype.OnDataSourceChanged = function (e) {
            for (var i in this.plots)
                this.plots[i].list.Source = e._new;
            this.Update();
        };
        UIChart.prototype.OnChartTypeChanged = function (e) {
            this.chart.config.type = e._new;
            this.Reset();
        };
        UIChart.prototype.initialize = function () {
        };
        UIChart.prototype.GetPlot = function (title) {
            return this.plots[title];
        };
        UIChart.prototype.AddPlot = function (title, selector, data) {
            this.RemovePlot(title);
            var plot = {
                data: data,
                title: title, selector: selector,
                list: new Corelib_20.collection.TransList(Number, { ConvertA2B: selector, ConvertB2A: void 0 }, this),
                Dispose: function () {
                    this.list.Source = void 0;
                    this.list.Dispose();
                    delete this.data;
                    delete this.list;
                    delete this.selector;
                    delete this.title;
                }
            };
            data.label = title;
            plot.list.Source = this.DataSource;
            this.plots[title] = plot;
        };
        UIChart.prototype.RemovePlot = function (title) {
            var plot = this.plots[title];
            delete this.plots[title];
            plot && plot.Dispose();
        };
        UIChart.prototype.Change = function (callback, owner, parms) {
            this._pauseUpdate = true;
            parms = parms || [];
            parms.unshift(this);
            var x = Corelib_20.helper.TryCatch(owner, callback, void 0, parms) === true;
            this._pauseUpdate = false;
            if (!x)
                this.Update();
        };
        UIChart.prototype.Update = function () {
            if (this._pauseUpdate || this._pauseReset || !this.IsInit)
                return;
            var x = [];
            for (var t in this.plots) {
                var p = this.plots[t];
                p.data.data = p.list.AsList();
                x.push(p.data);
            }
            this.chart.config.data = {
                datasets: x, labels: this.Labels.AsList(),
            };
            this.chart.update();
            this.chart.resize();
        };
        UIChart.prototype.Reset = function () {
            var _this = this;
            if (this._pauseReset)
                return;
            if (!this.IsInit) {
                this._pauseReset = true;
                this.OnInitialized = function (n) { delete n._pauseReset; n.Reset(); };
                return;
            }
            try {
                this.chart && this.chart.destroy();
            }
            catch (_a) { }
            this.chart = null;
            this.chart = new Chart_bundle_js_1.Chart(this.View, {
                type: this.ChartType || 'line',
                data: { datasets: [], labels: [] }, options: this.Options
            });
            this.chart.config.options.responsive = true;
            this.chart.config.options.onClick = function (e, x) {
                _this.Change(function () {
                    if (!x.length)
                        return true;
                    for (var _i = 0, x_1 = x; _i < x_1.length; _i++) {
                        var i = x_1[_i];
                        this.Labels.RemoveAt(i._index);
                        this.DataSource.RemoveAt(i._index);
                    }
                }, _this);
            };
            this.Update();
        };
        Object.defineProperty(UIChart.prototype, "Plots", {
            get: function () { return this.plots; },
            enumerable: true,
            configurable: true
        });
        UIChart.prototype.ClearPlots = function () {
            this.Change(function (t) {
                for (var i in this.plots) {
                    try {
                        this.RemovePlot(i);
                    }
                    catch (_a) { }
                }
                this.plots = {};
                return void 0;
            }, this);
        };
        __decorate([
            Corelib_20.attributes.property(String, 'line', void 0, UIChart.prototype.OnChartTypeChanged),
            __metadata("design:type", String)
        ], UIChart.prototype, "ChartType", void 0);
        __decorate([
            Corelib_20.attributes.property(Corelib_20.collection.List, void 0, void 0, UIChart.prototype.OnDataSourceChanged),
            __metadata("design:type", Corelib_20.collection.List)
        ], UIChart.prototype, "DataSource", void 0);
        __decorate([
            Corelib_20.attributes.property(Corelib_20.collection.List, void 0, void 0),
            __metadata("design:type", Corelib_20.collection.List)
        ], UIChart.prototype, "Labels", void 0);
        return UIChart;
    }(UI_23.UI.JControl));
    exports.UIChart = UIChart;
    var CharTemplates = (function () {
        function CharTemplates() {
        }
        CharTemplates.DrawNonNumeric = function (canvas, type, labels, dataset, options) {
        };
        CharTemplates.DrawArea = function (canvas, type, labels, dataset, options) {
            var ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            var ds = {
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
            };
            if (!(ds.data instanceof Array))
                throw "data in dataset null not allowed";
            for (var i in dataset)
                ds[i] = dataset[i] || ds[i];
            return new Chart_bundle_js_1.Chart(ctx, {
                type: type,
                data: {
                    labels: labels,
                    datasets: [ds]
                },
                options: options
            });
        };
        return CharTemplates;
    }());
    exports.CharTemplates = CharTemplates;
    Corelib_20.attributes.ComponentParser('ichart', function (x, p) {
        var dom = x.Dom;
        var c = document.createElement('canvas');
        var ctx = c.getContext('2d');
        var myChart = new Chart_bundle_js_1.Chart(ctx, {
            type: 'bar',
            data: {
                labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
                datasets: [{
                        label: '# of Votes',
                        data: [12, 19, 3, 5, 2, 3],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255,99,132,1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1
                    }]
            },
            options: {
                scales: {
                    yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                }
            }
        });
        window['myChart'] = myChart;
        dom.appendChild(c);
        return { Break: false };
    });
    Corelib_20.attributes.ComponentParser('chart', function (x, p) {
        var pdom = x.Dom;
        var dom = document.createElement('canvas');
        var ui = new UIChart(dom);
        pdom.appendChild(dom);
        ui.Parent = x.parent.Control || x.Control || UI_23.UI.Desktop.Current;
        x.e.Control = ui;
        ui.Options = {
            scales: {
                yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
            }
        };
        return { Break: false };
    });
});
define("Idea/FileManager", ["require", "exports", "template|../assets/templates/FileManager.html", "abstract/extra/Common", "../lib/Q/sys/Filters", "abstract/Models", "assets/data/data", "../lib/q/components/HeavyTable/script", "../lib/q/sys/Components", "abstract/Models", "./../lib/Chart.bundle.js", "../lib/q/Core", "Modules/Charts"], function (require, exports, FileManager_html_1, Common_14, Filters_9, Models_29, data_7, script_8, Components_2, Models_30, Chart_bundle_js_2, Core_1, Charts_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var qstore = new Core_1.collection.Dictionary("quee_sync_frame");
    var GData;
    Common_14.GetVars(function (v) { GData = clone(v); return false; });
    var store = { files: new Core_1.collection.Dictionary("files"), folders: new Core_1.collection.Dictionary("folders") };
    ValidateImport(Charts_1.CharTemplates);
    var models;
    (function (models) {
        var Permission;
        (function (Permission) {
            Permission[Permission["None"] = 0] = "None";
            Permission[Permission["View"] = 1] = "View";
            Permission[Permission["Read"] = 3] = "Read";
            Permission[Permission["Write"] = 7] = "Write";
            Permission[Permission["Delete"] = 15] = "Delete";
            Permission[Permission["Permissions"] = 31] = "Permissions";
        })(Permission = models.Permission || (models.Permission = {}));
        var PermissionFile = (function (_super) {
            __extends(PermissionFile, _super);
            function PermissionFile() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            PermissionFile.prototype.getStore = function () {
                return PermissionFile.store;
            };
            PermissionFile.prototype.Update = function () {
            };
            PermissionFile.prototype.Upload = function () {
            };
            PermissionFile.store = new Core_1.collection.Dictionary("PFiles");
            __decorate([
                Core_1.attributes.property(String),
                __metadata("design:type", String)
            ], PermissionFile.prototype, "FileName", void 0);
            __decorate([
                Core_1.attributes.property(Models_29.models.Client),
                __metadata("design:type", Models_29.models.Client)
            ], PermissionFile.prototype, "Client", void 0);
            __decorate([
                Core_1.attributes.property(Number, 0),
                __metadata("design:type", Number)
            ], PermissionFile.prototype, "Permission", void 0);
            return PermissionFile;
        }(Core_1.sdata.DataRow));
        models.PermissionFile = PermissionFile;
        var Segment = (function (_super) {
            __extends(Segment, _super);
            function Segment(name) {
                var _this = _super.call(this) || this;
                _this.Name = name;
                return _this;
            }
            Segment.prototype.toString = function () {
                return this.Name;
            };
            __decorate([
                Core_1.attributes.property(String),
                __metadata("design:type", String)
            ], Segment.prototype, "Name", void 0);
            return Segment;
        }(Core_1.bind.DObject));
        models.Segment = Segment;
        var File = (function (_super) {
            __extends(File, _super);
            function File() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            File.prototype.getStore = function () {
                return store.files;
            };
            File.prototype.toString = function () {
                return this.Name;
            };
            __decorate([
                Core_1.attributes.property(String),
                __metadata("design:type", String)
            ], File.prototype, "Name", void 0);
            __decorate([
                Core_1.attributes.property(String),
                __metadata("design:type", String)
            ], File.prototype, "Type", void 0);
            __decorate([
                Core_1.attributes.property(Number),
                __metadata("design:type", Number)
            ], File.prototype, "Size", void 0);
            __decorate([
                Core_1.attributes.property(Date),
                __metadata("design:type", Date)
            ], File.prototype, "Date", void 0);
            return File;
        }(Core_1.sdata.QShopRow));
        models.File = File;
        var Folder = (function (_super) {
            __extends(Folder, _super);
            function Folder() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Folder.prototype.getStore = function () {
                return store.folders;
            };
            __decorate([
                Core_1.attributes.property(String),
                __metadata("design:type", String)
            ], Folder.prototype, "Name", void 0);
            return Folder;
        }(Core_1.sdata.QShopRow));
        models.Folder = Folder;
        var Files = (function (_super) {
            __extends(Files, _super);
            function Files() {
                return _super.call(this, void 0, models.File, function (id) { return new File(id); }) || this;
            }
            return Files;
        }(Core_1.sdata.DataTable));
        models.Files = Files;
        var Folders = (function (_super) {
            __extends(Folders, _super);
            function Folders() {
                return _super.call(this, void 0, models.Folder, function (id) { return new Folder(id); }) || this;
            }
            return Folders;
        }(Core_1.sdata.DataTable));
        models.Folders = Folders;
    })(models = exports.models || (exports.models = {}));
    var FileManager = (function (_super) {
        __extends(FileManager, _super);
        function FileManager() {
            var _this = _super.call(this, FileManager_html_1.template.Folder.Manager, Core_1.UI.TControl.Me) || this;
            _this._imageCapture = new media.ImageCapture();
            _this.list = new Core_1.collection.List(models.PermissionFile);
            _this.xm = new PermissionsTable(_this.list);
            _this.rt = [
                {
                    type: 'icongroup',
                    value: [
                        { iconName: 'content_copy', commandName: 'cmd-copy' },
                        { iconName: 'content_paste', commandName: 'cmd-paste' },
                        { iconName: 'content_cut', commandName: 'cmd-cut' },
                        { iconName: 'settings', commandName: 'cmd-settings' }
                    ]
                },
                { type: "separator" },
                { type: "menu-item", commandName: "open_file", label: "Open", iconName: "visibility" },
                { type: "menu-item", commandName: "cmd-download", label: "Download", iconName: "file_download" },
                { type: "menu-item", commandName: "take-photo", label: "Take Photo", iconName: "add_a_photo" },
                { type: "menu-item", commandName: "cmd-upload", label: "Upload", iconName: "cloud_upload" },
            ];
            _this._contextMenu = new Components_2.Components.MdContextMenu(_this.rt);
            _this.Files = new Core_1.collection.ExList(models.File);
            _this.Folders = new models.Folders();
            _this.Path = new Core_1.collection.List(models.Segment);
            _this.XFiles = new models.Files();
            _this.Files.Filter = (new Filters_9.filters.list.StringFilter());
            _this.Files.Source = _this.XFiles;
            return _this;
        }
        FileManager.prototype.OnSearch = function (old, _new) {
            this.Files.Filter.Patent = new Filters_9.filters.list.StringPatent(_new);
        };
        FileManager.prototype.OnCurrentUrlChanged = function (e) {
            this.Update();
        };
        FileManager.prototype.OnCurrentUrlCheck = function (e) {
            var n = e._new;
            var o = e._old;
            n && (n = this.reduce(n));
            if (n && o && n.IsEquals(o)) {
                e._new = o;
                return;
            }
            e._new = n;
        };
        FileManager.prototype.setName = function (name, dom, cnt, e) {
            switch (name) {
                case '_folders':
                    this._folders = cnt;
                    this._folders.AcceptNullValue = false;
                    break;
                case '_files':
                    this._files = cnt;
                    this._folders.AcceptNullValue = true;
                    this.initializeDrop();
                    break;
                case '_path':
                    this._path = cnt;
                    break;
                default: return;
            }
        };
        FileManager.prototype.initializeDrop = function () {
            var _this = this;
            var target = this.View;
            target.addEventListener('drop', function (e) {
                e.stopPropagation();
                e.preventDefault();
                for (var i = 0; i < e.dataTransfer.files.length; i++) {
                    _this.Upload(e.dataTransfer.files.item(i));
                }
            });
            target.addEventListener('dragover', function (e) {
                e.stopPropagation();
                e.preventDefault();
                e.dataTransfer.dropEffect = 'copy';
            });
        };
        FileManager.prototype.GoBack = function () {
            var url = this.CurrentUrl;
            if (!url)
                return;
            url = url.ParentDirectory;
            if (!url)
                return;
            this.CurrentUrl = url;
        };
        FileManager.prototype.OpenFolder = function (f) {
            if (!f)
                return;
            var url = this.CurrentUrl;
            if (!url)
                url = new System.basics.Url(f.Name + "/");
            else
                url = url.Combine(f.Name + "/");
            this.CurrentUrl = url;
        };
        FileManager.prototype.GoToFolder = function (e, ed, scop, evnt) {
            this.OpenFolder(scop.Value);
        };
        FileManager.prototype.FolderKeyDown = function (e, ed, scop, evnt) {
            if (e.keyCode === 13)
                return this.OpenFolder(scop.Value);
            if (e.keyCode === Core_1.UI.Keys.Delete)
                return this.DeleteFolder(scop.Value);
        };
        FileManager.prototype.DeleteFolder = function (folder) {
        };
        FileManager.prototype.reduce = function (url) {
            var out = [];
            var p = url.path;
            var c = 0;
            for (var i = 0; i < p.length; i++) {
                var f = p[i];
                switch (f) {
                    case '..':
                        out.pop();
                        break;
                    case '':
                        out.splice(0, out.length);
                        break;
                    case '.':
                        break;
                    default:
                        out.push(f);
                }
            }
            return new System.basics.Url(out.join('/') + (out.length ? '/' : ''));
        };
        FileManager.prototype.getUrl = function (l) {
            var p = this.Path.AsList();
            var s = "./";
            for (var i = 0; i < l; i++)
                s += p[i].Name + "/";
            return s;
        };
        FileManager.prototype.GoToUrl = function (e, ed, scop, evnt) {
            var f = scop.Value;
            if (!f)
                return;
            var url = this.CurrentUrl;
            var s = this.getUrl(this.Path.IndexOf(f) + 1);
            if (!s)
                return;
            this.CurrentUrl = new System.basics.Url(s);
        };
        FileManager.prototype.OpenFile = function (e, ed, scop, evnt) {
            var f = scop.Value;
            if (!f)
                return;
            var c = this.CurrentUrl.Combine(f.Name);
            Core_1.UI.Modal.ShowDialog(c.FullPath, "You Just clicked to download a file");
        };
        FileManager.prototype.Update = function () {
            var _this = this;
            var url = this.CurrentUrl;
            GData.requester.Costume({ Url: "/_/explore?dir=" + url.FullPath, Method: Core_1.net.WebRequestMethod.Get }, null, null, function (reqdata, data, iss, req) {
                _this.Folders.Clear();
                _this.XFiles.Clear();
                _this.Path.Clear();
                if (url.path.length) {
                    _this.Folders.Add(FileManager.backFolder);
                    _this.Path.Add(FileManager.backSegment);
                }
                else {
                    _this.Path.Add(FileManager.currentSegment);
                }
                _this.Folders.FromCsv(data.Folders || []);
                _this.XFiles.FromCsv(data.Files || []);
                _this.Path.AddRange(url.path.map(function (v) { return new models.Segment(v); }));
                if (data.IsDeleted)
                    _this.CurrentUrl = url.ParentDirectory;
            }, this);
        };
        FileManager.prototype.XTakePhoto = function () {
            var _this = this;
            var f = new FileReader();
            var id = Date.now();
            f.addEventListener('loadend', function (e) {
                var vr = _this._imageCapture._videoRecorder;
                _this.UploadVideoBlob(f.result, "Video_" + vr.RecordID + "-" + id + ".mp4", vr.Cursor);
            });
            this._imageCapture._videoRecorder.OnPropertyChanged(this._imageCapture._videoRecorder.GetDPCurrentDataProperty(), function (s, e) {
                f.readAsArrayBuffer(e._new);
            });
            this._imageCapture.Open(function (e) {
                if (e.modalResult.Result == Core_1.UI.MessageResult.ok) {
                    var fileName = prompt("Entry the name of file", "Image_" + Date.now() + ".png");
                    if (fileName)
                        _this.UploadBlob(e.Buffer, fileName.lastIndexOf('.png') === fileName.length - 4 ? fileName : fileName + ".png");
                    else
                        Core_1.UI.InfoArea.push("Operation canceled", true);
                }
            });
        };
        FileManager.prototype.OnKeyDown = function (e) {
            var kc = e.keyCode;
            if (kc === Core_1.UI.Keys.F9) {
                this.XTakePhoto();
                return true;
            }
            if (kc === 37 || kc === 39) {
                this.selectedCNT = this._files;
                this.selectedCNT.View.focus();
                Object.defineProperty(e, 'keyCode', { value: kc + 1 });
                return this._files.OnKeyDown(e);
            }
            else if (kc === 38 || kc === 40) {
                this.selectedCNT = this._folders;
                this.selectedCNT.View.focus();
                return this._folders.OnKeyDown(e);
            }
            if (kc == 9)
                this.selectedCNT = this.selectedCNT === this._folders ? this._files : this._folders;
            else if (!this.selectedCNT)
                this.selectedCNT = this._folders;
            this.selectedCNT.View.focus();
            if (this.selectedCNT.OnKeyDown(e))
                return;
            if (kc === 27)
                this.selectedCNT.SelectedIndex = -1;
            else if (kc === 13)
                if (this.selectedCNT === this._folders)
                    return this.OpenFolder(this._folders.SelectedItem);
                else
                    this.loadPermissions();
            else if (kc === 9)
                e.stopPropagation();
            return true;
        };
        FileManager.prototype.loadPermissions = function () {
            var _this = this;
            var current_file = this._files.SelectedItem;
            var current_dir = this.CurrentUrl;
            var f = (current_file && current_file.Name) || '.';
            GData.requester.Request(models.PermissionFile, "LISTPERMISSIONS", void 0, { dir: current_dir.FullPath, file: f, cid: 0, per: 31 }, function (pcll, json, iss, req) {
                var i = 1;
                var js = { Client: void 0, FileName: void 0, Permission: 0 };
                _this.list.Clear();
                for (var x in json) {
                    var perm = json[x];
                    var n = parseInt(x);
                    if (isNaN(n))
                        continue;
                    var t = new models.PermissionFile(i++);
                    js.Client = n;
                    js.FileName = f;
                    if (typeof perm !== 'number' || typeof models.Permission[perm] !== 'string')
                        continue;
                    js.Permission = perm;
                    t.FromJson(js, Core_1.encoding.SerializationContext.GlobalContext);
                    _this.list.Add(t);
                }
                Core_1.UI.Modal.ShowDialog("Permissions", _this.xm.InitVars(current_dir, current_file), function (e) { ; }, "Close", null, null);
            });
        };
        FileManager.prototype.initialize = function () {
            _super.prototype.initialize.call(this);
            this.CurrentUrl = new System.basics.Url("./");
        };
        FileManager.ctor = function () {
            require("style|../assets/FileManager/font-awesome/css/font-awesome.min.css");
            this.backFolder.Name = "..";
        };
        FileManager.prototype.getContentOf = function (url) {
        };
        FileManager.prototype.GoNext = function (e, ed, scop, evnt) {
        };
        FileManager.prototype.NewFile = function (e, ed, scop, evnt) {
        };
        FileManager.prototype.XUploadFile = function () {
            var b = FileManager.button;
            if (!FileManager.button) {
                FileManager.button = b = document.createElement('input');
                var self = this;
                b.addEventListener('input', function (e) {
                    for (var i = 0; i < this.files.length; i++) {
                        self.Upload(this.files[i]);
                    }
                    try {
                        b.files = null;
                    }
                    catch (e) {
                    }
                });
            }
            b.type = 'file';
            var v = document.createEvent('MouseEvent');
            v.initEvent('click', false, false);
            b.dispatchEvent(v);
        };
        FileManager.prototype.UploadFile = function (e, ed, scop, evnt) {
            this.XUploadFile();
        };
        FileManager.prototype.UploadVideoBlob = function (buffer, file, seek) {
            var _this = this;
            var url = this.CurrentUrl;
            GData.requester.Costume({ Url: "/_/explore?push&seek=" + seek + "&id=" + -1 + "&slice_id=" + -1 + "&dir=" + url.FullPath + "&file=" + file + "&size=" + buffer.byteLength + "&lastm=" + new Date(Date.now()).toISOString() + "&type=image/png&slice_start=" + 0 + "&slice_size=" + buffer.byteLength, Method: Core_1.net.WebRequestMethod.Post, HasBody: true }, buffer, null, function (reqdata, data, iss, req) {
                if (iss) {
                    var n = file.toLowerCase();
                    for (var _i = 0, _a = _this.Files.AsList(); _i < _a.length; _i++) {
                        var v = _a[_i];
                        if (v.Name.toLowerCase() == n)
                            return;
                    }
                    var fl = new models.File(_this.Files.Count + 1);
                    fl.Name = file;
                    _this.Files.Add(fl);
                }
            }, this);
        };
        FileManager.prototype.UploadBlob = function (buffer, file) {
            var _this = this;
            var url = this.CurrentUrl;
            Core_1.UI.Spinner.Default.Start("Uploading " + file);
            GData.requester.Costume({ Url: "/_/explore?id=" + -1 + "&slice_id=" + -1 + "&dir=" + url.FullPath + "&file=" + file + "&size=" + buffer.byteLength + "&lastm=" + new Date(Date.now()).toISOString() + "&type=image/png&slice_start=" + 0 + "&slice_size=" + buffer.byteLength, Method: Core_1.net.WebRequestMethod.Post, HasBody: true }, buffer, null, function (reqdata, data, iss, req) {
                Core_1.UI.Spinner.Default.Pause();
                if (iss) {
                    Core_1.UI.InfoArea.push("L'image " + file + " est bien enregister");
                    var n = file.toLowerCase();
                    for (var _i = 0, _a = _this.Files.AsList(); _i < _a.length; _i++) {
                        var v = _a[_i];
                        if (v.Name.toLowerCase() == n)
                            return;
                    }
                    var fl = new models.File(_this.Files.Count + 1);
                    fl.Name = file;
                    _this.Files.Add(fl);
                }
                else {
                    Core_1.UI.InfoArea.push("Fatal error when upload file " + file + " to directory " + url.FullPath, false);
                }
            }, this);
        };
        FileManager.prototype.Upload = function (file) {
            var _this = this;
            var url = this.CurrentUrl;
            function onSliceCreated(e) {
                var _this = this;
                console.log(e.percentage);
                var file = e.file;
                GData.requester.Costume({ Url: "/_/explore?id=" + e.sender.id + "&slice_id=" + e.slice.id + "&dir=" + url.FullPath + "&file=" + e.file.name + "&size=" + file.size + "&lastm=" + file.lastModified + "&type=" + file.type + "&slice_start=" + e.slice.start + "&slice_size=" + e.data.byteLength, Method: Core_1.net.WebRequestMethod.Post, HasBody: true }, e.data, null, function (reqdata, data, iss, req) {
                    Core_1.UI.Spinner.Default.Start("Uploading " + file.name + " : " + e.percentage + "%");
                    if (iss) {
                        if (e.percentage >= 100) {
                            Core_1.UI.Spinner.Default.Pause();
                        }
                        e.onSuccess();
                    }
                    else {
                        Core_1.UI.InfoArea.push("Fatal error when upload file " + file.name + " to directory " + _this.CurrentUrl.FullPath, false);
                    }
                }, this);
            }
            var uploader = new BlobReader(file, onSliceCreated);
            uploader.OnDone = function (e) {
                var n = e.file.name.toLowerCase();
                for (var _i = 0, _a = _this.Files.AsList(); _i < _a.length; _i++) {
                    var v = _a[_i];
                    if (v.Name.toLowerCase() == n)
                        return;
                }
                var fl = new models.File(_this.Files.Count + 1);
                fl.Name = e.file.name;
                _this.Files.Add(fl);
                e.sender.Dispose();
            };
            uploader.StartUpload();
        };
        FileManager.prototype.XDownloadFile = function (file) {
            if (!file) {
                var url = this.CurrentUrl;
                var file = this._files.SelectedItem;
                if (!(file instanceof models.File))
                    return;
            }
            var furl = url.Combine(file.Name);
            var link = document.createElement('a');
            link.href = "/_/explore?file=" + furl.FullPath + "&dwn";
            link.download = 'Download.jpg';
            link.click();
        };
        FileManager.prototype.DownloadFile = function (e, ed, scop, evnt) {
            this.XDownloadFile();
        };
        FileManager.prototype.OnContextMenu = function (e) {
            var _this = this;
            if (this._files.View.contains(e.target))
                Core_1.UI.Desktop.Current.CurrentApp.OpenContextMenu(this._contextMenu, {
                    callback: function (e) {
                        return _this.OnContextMenuCallback(e, e.selectedItem);
                        if (e.selectedItem.type === 'separator' || e.selectedItem.type === 'label') {
                            e.cancel = true;
                            return;
                        }
                        switch (e.selectedItem) {
                            default:
                        }
                        Core_1.UI.InfoArea.push("Upgrade for full app");
                        var l = Core_1.UI.Modal.ShowDialog("Statistiques des Produit", new StatView());
                        l.OnInitialized = function (l) { return l.setWidth("98%").setHeight('90%'); };
                    }, e: e, ObjectStat: this._files.SelectedItem, x: 0, y: 0
                });
        };
        FileManager.prototype.OnContextMenuCallback = function (e, si) {
            if (si.type === 'separator' || si.type === 'label')
                return e.cancel = true;
            switch (si.commandName) {
                case "cmd-copy":
                    Core_1.UI.InfoArea.push("La command " + si.commandName + " n'est pas implimenter (DEMO VERSION)", false, 1000);
                    break;
                case "cmd-paste":
                    Core_1.UI.InfoArea.push("La command " + si.commandName + " n'est pas implimenter (DEMO VERSION)", false, 1000);
                    break;
                case "cmd-cut":
                    Core_1.UI.InfoArea.push("La command " + si.commandName + " n'est pas implimenter (DEMO VERSION)", false, 1000);
                    break;
                case "cmd-delete":
                    Core_1.UI.InfoArea.push("La command " + si.commandName + " n'est pas implimenter (DEMO VERSION)", false, 1000);
                    break;
                case "cmd-settings":
                    this.loadPermissions();
                    break;
                case "cmd-download":
                    this.XDownloadFile();
                    break;
                case "cmd-upload":
                    this.XUploadFile();
                    break;
                case "take-photo":
                    this.XTakePhoto();
                    break;
            }
        };
        FileManager.backFolder = new models.Folder(-1);
        FileManager.backSegment = new models.Segment("..");
        FileManager.currentSegment = new models.Segment(".");
        __decorate([
            Core_1.attributes.property1(System.basics.Url, { changed: FileManager.prototype.OnCurrentUrlChanged, check: FileManager.prototype.OnCurrentUrlCheck }),
            __metadata("design:type", System.basics.Url)
        ], FileManager.prototype, "CurrentUrl", void 0);
        __decorate([
            Core_1.attributes.property(Core_1.collection.List),
            __metadata("design:type", Core_1.collection.List)
        ], FileManager.prototype, "Path", void 0);
        __decorate([
            Core_1.attributes.property(Core_1.collection.ExList),
            __metadata("design:type", Core_1.collection.ExList)
        ], FileManager.prototype, "Files", void 0);
        __decorate([
            Core_1.attributes.property(models.Folders),
            __metadata("design:type", models.Folders)
        ], FileManager.prototype, "Folders", void 0);
        __decorate([
            Core_1.attributes.property(Boolean),
            __metadata("design:type", Boolean)
        ], FileManager.prototype, "IsOpening", void 0);
        return FileManager;
    }(Core_1.UI.TControl));
    exports.FileManager = FileManager;
    var StatisticDescription = (function (_super) {
        __extends(StatisticDescription, _super);
        function StatisticDescription() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        StatisticDescription.prototype.toString = function () {
            return this.Label || this.Name;
        };
        __decorate([
            Core_1.attributes.property(String),
            __metadata("design:type", String)
        ], StatisticDescription.prototype, "Name", void 0);
        __decorate([
            Core_1.attributes.property(String),
            __metadata("design:type", String)
        ], StatisticDescription.prototype, "Label", void 0);
        __decorate([
            Core_1.attributes.property(Core_1.collection.List),
            __metadata("design:type", Core_1.collection.List)
        ], StatisticDescription.prototype, "Params", void 0);
        return StatisticDescription;
    }(Core_1.bind.DObject));
    var StatView = (function (_super) {
        __extends(StatView, _super);
        function StatView() {
            var _this = _super.call(this, FileManager_html_1.template.Folder.stat, Core_1.UI.TControl.Me) || this;
            _this._handlers = {};
            _this.Actions = new Core_1.collection.List(Object);
            _this.Value = _this;
            _this.initHandlers();
            return _this;
        }
        StatView.prototype.register = function (h) {
            this._handlers[h.Name.toLowerCase()] = h;
        };
        StatView.prototype.initHandlers = function () {
            var unknowClient = new Models_30.models.Client(-1);
            unknowClient.Name = "unknown";
            var unknowProduct = new Models_30.models.Product(-1);
            unknowProduct.Name = "unknown";
            function reset(e, lbls, vls) {
                clear(e);
                var lst = e.chart.DataSource;
                var lbs = e.chart.Labels;
                lst.AddRange(vls);
                lbs.AddRange(lbls);
            }
            function clear(e) {
                var chart = e.chart;
                var lst = e.chart.DataSource;
                lst && lst.Clear();
                var lbs = e.chart.Labels;
                lbs && lbs.Clear();
            }
            function getKeys(data) {
                var ks = Object.keys(data);
                var i = ks.indexOf('@ref');
                if (i !== -1)
                    ks.splice(i, 1);
                return ks;
            }
            this.register({
                Name: 'NFactureAchatsBydate',
                Swap: function (data) {
                    var keys = getKeys(data);
                    var out = new Array(keys.length);
                    for (var i = 0; i < out.length; i++) {
                        var k = keys[i];
                        out[i] = { client: Models_30.models.Client.getById(parseInt(k) || -1) || unknowClient, nFactures: data[k] };
                    }
                    return out;
                },
                Clear: clear,
                Draw: function (e) {
                    e.chart.ClearPlots();
                    e.handler.Clear(e);
                    e.chart.AddPlot("N° Factures Acheter par clients", function (_, __, n) { return n.nFactures; }, StatView.options);
                    e.handler.Update(e);
                },
                Update: function (e) {
                    var data = e.data;
                    var vls = new Array(data.length);
                    var lbls = new Array(data.length);
                    for (var i = 0; i < data.length; i++) {
                        var d = data[i];
                        lbls[i] = (d.client && d.client.FirstName) || "unknown";
                        vls[i] = d;
                    }
                    reset(e, lbls, vls);
                },
                OnAction: function (e, name) {
                    if (name === 'Total') {
                        var t = 0;
                        for (var _i = 0, _a = e.data; _i < _a.length; _i++) {
                            var i = _a[_i];
                            t += i.nFactures;
                        }
                        Core_1.UI.InfoArea.push("N\u00B0 Factures est " + t);
                    }
                    else if (name == "Trie Par N° Factures (UP)") {
                        e.chart.Change(function () {
                            this.data.sort(function (a, b) { return a.nFactures - b.nFactures; });
                            this.handler.Update(this);
                            return false;
                        }, e);
                    }
                    else if (name == "Trie Par N° Factures (Down)") {
                        e.chart.Change(function () {
                            this.data.sort(function (a, b) { return b.nFactures - a.nFactures; });
                            this.handler.Update(this);
                            return false;
                        }, e);
                    }
                },
                Actions: ["Total", "Trie Par N° Factures (UP)", "Trie Par N° Factures (Down)"]
            });
            this.register({
                Name: 'TotalAchatsByClient',
                Clear: clear,
                Swap: function (data) {
                    var keys = getKeys(data);
                    var out = new Array(keys.length);
                    for (var i = 0; i < out.length; i++) {
                        var k = keys[i];
                        out[i] = { client: Models_30.models.Client.getById(parseInt(k) || -1) || unknowClient, total: data[k] };
                    }
                    return out;
                },
                Draw: function (e) {
                    var chart = e.chart;
                    chart.ClearPlots();
                    e.handler.Clear(e);
                    chart.AddPlot("Total des bon achats par clients", function (_, __, n) { return n.total; }, StatView.options);
                    e.handler.Update(e);
                },
                Update: function (e) {
                    var data = e.data;
                    var vls = new Array(data.length);
                    var lbls = new Array(data.length);
                    for (var i = 0; i < data.length; i++) {
                        var d = data[i];
                        lbls[i] = (d.client && d.client.FirstName) || "unknown";
                        vls[i] = d;
                    }
                    reset(e, lbls, vls);
                },
                OnAction: function (e, name) {
                    if (name === 'Total') {
                        var t = 0;
                        for (var _i = 0, _a = e.data; _i < _a.length; _i++) {
                            var i = _a[_i];
                            t += i.total;
                        }
                        Core_1.UI.InfoArea.push("<h1>Montant Total des Factures est<br> " + t + "</h1>", true, 5000);
                    }
                    else if (name == "Trie Par Total (UP)") {
                        e.chart.Change(function () {
                            this.data.sort(function (a, b) { return a.total - b.total; });
                            this.handler.Update(this);
                            return false;
                        }, e);
                    }
                    else if (name == "Trie Par Total (Down)") {
                        e.chart.Change(function () {
                            this.data.sort(function (a, b) { return b.total - a.total; });
                            this.handler.Update(this);
                            return false;
                        }, e);
                    }
                },
                Actions: ["Total", "Trie Par Total (UP)", "Trie Par Total (Down)"]
            });
            this.register({
                Name: 'TotalVersmentByClient',
                Clear: clear,
                Swap: function (data) {
                    var keys = getKeys(data);
                    var out = new Array(keys.length);
                    for (var i = 0; i < out.length; i++) {
                        var k = keys[i];
                        out[i] = { client: Models_30.models.Client.getById(parseInt(k) || -1) || unknowClient, versment: data[k] };
                    }
                    return out;
                },
                Draw: function (e) {
                    e.chart.ClearPlots();
                    e.handler.Clear(e);
                    e.chart.AddPlot("Total des versements par clients", function (_, __, n) { return n.versment; }, StatView.options);
                    e.handler.Update(e);
                },
                Update: function (e) {
                    var data = e.data;
                    var vls = new Array(data.length);
                    var lbls = new Array(data.length);
                    for (var i = 0; i < data.length; i++) {
                        var d = data[i];
                        lbls[i] = (d.client && d.client.FirstName) || "unknown";
                        vls[i] = d;
                    }
                    reset(e, lbls, vls);
                },
                OnAction: function (e, name) {
                    if (name === 'Total des Versement') {
                        var t = 0;
                        for (var _i = 0, _a = e.data; _i < _a.length; _i++) {
                            var i = _a[_i];
                            t += i.versment;
                        }
                        Core_1.UI.InfoArea.push("<h1>Total des versement est<br> " + t + "</h1>", true, 5000);
                    }
                    else if (name == "Trie Par Versement (UP)") {
                        e.chart.Change(function () {
                            this.data.sort(function (a, b) { return a.versment - b.versment; });
                            this.handler.Update(this);
                            return false;
                        }, e);
                    }
                    else if (name == "Trie Par Versement (Down)") {
                        e.chart.Change(function () {
                            this.data.sort(function (a, b) { return b.versment - a.versment; });
                            this.handler.Update(this);
                            return false;
                        }, e);
                    }
                },
                Actions: ["Total des Versement", "Trie Par Versement (UP)", "Trie Par Versement (Down)"]
            });
            this.register({
                Name: 'ProduitAcheter',
                Clear: clear,
                Swap: function (data) {
                    var keys = getKeys(data);
                    var out = new Array(keys.length);
                    for (var i = 0; i < out.length; i++) {
                        var k = keys[i];
                        out[i] = {
                            product: Models_30.models.Product.getById(parseInt(k) || -1) || unknowProduct,
                            data: data[k]
                        };
                    }
                    return out;
                },
                Draw: function (e) {
                    var chart = e.chart;
                    chart.ClearPlots();
                    e.handler.Clear(e);
                    chart.AddPlot("Qte total", function (_, __, n) { return n[0]; }, StatView.options);
                    chart.AddPlot("Total Acheter", function (_, __, n) { return n[1]; }, StatView.options);
                    chart.AddPlot("Benifice Total ", function (_, __, n) { return n[2]; }, StatView.options);
                    e.handler.Update(e);
                },
                OnAction: function (e, name) {
                    if (name === 'Total') {
                        var tq = 0;
                        var ta = 0;
                        var tb = 0;
                        for (var _i = 0, _a = e.data; _i < _a.length; _i++) {
                            var i = _a[_i];
                            tq += i.data[0],
                                ta += i.data[1],
                                tb += i.data[2];
                        }
                        Core_1.UI.InfoArea.push("<h1>Qte total Acheter est " + tq + "<br>Montant Total est " + ta + "<br>Benifice Total est " + tb + "</h1>", true, 5000);
                    }
                    else if (name == "Trie Par Qte (UP)") {
                        e.chart.Change(function () {
                            this.data.sort(function (a, b) { return a.data[0] - b.data[0]; });
                            this.handler.Update(this);
                            return false;
                        }, e);
                    }
                    else if (name == "Trie Par Qte (Down)") {
                        e.chart.Change(function () {
                            this.data.sort(function (a, b) { return b.data[0] - a.data[0]; });
                            this.handler.Update(this);
                            return false;
                        }, e);
                    }
                    else if (name == "Trie Par Montant (UP)") {
                        e.chart.Change(function () {
                            this.data.sort(function (a, b) { return a.data[1] - b.data[1]; });
                            this.handler.Update(this);
                            return false;
                        }, e);
                    }
                    else if (name == "Trie Par Montant (Down)") {
                        e.chart.Change(function () {
                            this.data.sort(function (a, b) { return b.data[1] - a.data[1]; });
                            this.handler.Update(this);
                            return false;
                        }, e);
                    }
                    else if (name == "Trie Par Benifice (UP)") {
                        e.chart.Change(function () {
                            this.data.sort(function (a, b) { return a.data[2] - b.data[2]; });
                            this.handler.Update(this);
                            return false;
                        }, e);
                    }
                    else if (name == "Trie Par Benifice (Down)") {
                        e.chart.Change(function () {
                            this.data.sort(function (a, b) { return b.data[2] - a.data[2]; });
                            this.handler.Update(this);
                            return false;
                        }, e);
                    }
                },
                Actions: ["Total", "Trie Par Qte (UP)", "Trie Par Qte (Down)",
                    "Trie Par Montant (UP)", "Trie Par Montant (Down)",
                    "Trie Par Benifice (UP)", "Trie Par Benifice (Down)"],
                Update: function (e) {
                    var data = e.data;
                    var vls = new Array(data.length);
                    var lbls = new Array(data.length);
                    for (var i = 0; i < data.length; i++) {
                        var d = data[i];
                        lbls[i] = (d.product && d.product.toString()) || "unknown";
                        vls[i] = d.data;
                    }
                    reset(e, lbls, vls);
                }
            });
        };
        StatView.prototype.OnAction = function (e) {
            if (!e._new)
                return;
            this.currentArgs.handler.OnAction(this.currentArgs, e._new);
            Core_1.thread.Dispatcher.call(this, function () { this.CurrentAction = null; });
        };
        StatView.prototype._hasValue_ = function () { return true; };
        StatView.prototype.setName = function (name, dom, cnt, e) {
            var _this = this;
            this[name] = cnt;
            Core_1.bind.NamedScop.Create('ChartTypes', new Core_1.collection.List(String, ["bar", "bubble", "doughnut", "horizontalBar", "line", "pie", "polarArea", "radar", "scatter"]));
            if (name === '_charttype') {
                e.Scop.OnPropertyChanged(Core_1.bind.Scop.DPValue, function (s, e) {
                    _this.ChartType = e._new;
                }, this);
            }
        };
        StatView.prototype.initialize = function () {
            _super.prototype.initialize.call(this);
            this.OnCompiled = function (n) {
                return GData.requester.Request(Models_30.models.Statstics, 'methods', void 0, void 0, function (x, j, i, r) {
                    if (!i)
                        return;
                    var list = j && j.__list__;
                    if (!list)
                        return;
                    list = list.map(function (v) { return new StatisticDescription().FromJson(v, Core_1.encoding.SerializationContext.GlobalContext.reset()); });
                    Core_1.bind.NamedScop.Create('productStatistics').Value = new Core_1.collection.List(Object, list);
                });
            };
        };
        StatView.ctor = function () {
            Core_1.bind.NamedScop.Create('productStatistics', void 0, Core_1.bind.BindingMode.TwoWay);
        };
        StatView.prototype.Update = function () {
            var _this = this;
            function getId(d) { return (d && d.Id) || -1; }
            var data = { Client: this.Client, Product: this.Product, Method: this.Method, From: this.From, To: this.To };
            GData.requester.Request(Models_30.models.Statstics, 'out', void 0, {
                from: this.From.toISOString(), to: this.To.toISOString(), cid: getId(this.Client), pid: getId(this.Product), method: (this.Method && this.Method.Name) || "TotalAchatsByClient"
            }, function (xr, json, iss, req) {
                _this._chart.Change(function (t, json, iss) {
                    var methodName = ((data.Method && data.Method.Name) || "TotalAchatsByClient").toLowerCase();
                    var handler = this._handlers[methodName];
                    if (handler) {
                        json = handler.Swap(json);
                        var e = { chart: this._chart, sender: this, handler: handler, data: json, previousArgs: this.currentArgs };
                        Core_1.helper.TryCatch(handler, handler.Draw, void 0, [e]);
                        this.Actions.Clear();
                        this.Actions.AddRange(handler.Actions);
                        this.currentArgs = e;
                    }
                    else
                        return true;
                }, _this, [json, iss]);
            });
        };
        StatView.prototype.Refresh = function () {
            this._chart.Update();
        };
        StatView.prototype.OnKeyDown = function (e) {
            var h = this.currentArgs;
            if (!h)
                return;
            switch (e.keyCode) {
                case Core_1.UI.Keys.F1:
                    h.handler.OnAction(h, 'arg1');
                default:
            }
        };
        Object.defineProperty(StatView, "options", {
            get: function () {
                return clone({
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                });
            },
            enumerable: true,
            configurable: true
        });
        StatView.prototype.OnChartTypeChanged = function (e) {
            this._chart.ChartType = e._new;
        };
        __decorate([
            Core_1.attributes.property(StatisticDescription, void 0, void 0),
            __metadata("design:type", StatisticDescription)
        ], StatView.prototype, "Method", void 0);
        __decorate([
            Core_1.attributes.property(String, void 0, void 0, StatView.prototype.OnAction),
            __metadata("design:type", String)
        ], StatView.prototype, "CurrentAction", void 0);
        __decorate([
            Core_1.attributes.property(Date, new Date()),
            __metadata("design:type", Date)
        ], StatView.prototype, "From", void 0);
        __decorate([
            Core_1.attributes.property(Date, new Date()),
            __metadata("design:type", Date)
        ], StatView.prototype, "To", void 0);
        __decorate([
            Core_1.attributes.property(Models_30.models.Product),
            __metadata("design:type", Models_30.models.Product)
        ], StatView.prototype, "Product", void 0);
        __decorate([
            Core_1.attributes.property(Models_30.models.Client, void 0, void 0, function (e) { debugger; }),
            __metadata("design:type", Models_30.models.Client)
        ], StatView.prototype, "Client", void 0);
        __decorate([
            Core_1.attributes.property(String, "", void 0, StatView.prototype.OnChartTypeChanged),
            __metadata("design:type", String)
        ], StatView.prototype, "ChartType", void 0);
        __decorate([
            Core_1.attributes.property(Core_1.collection.List),
            __metadata("design:type", Core_1.collection.List)
        ], StatView.prototype, "Actions", void 0);
        return StatView;
    }(Core_1.UI.TControl));
    exports.StatView = StatView;
    var PermissionsTable = (function (_super) {
        __extends(PermissionsTable, _super);
        function PermissionsTable(source) {
            var _this = _super.call(this, data_7.data.value.FilePermissionsTable.def) || this;
            _this.Source = source;
            return _this;
        }
        PermissionsTable.prototype.InitVars = function (dir, file) {
            this.dir = dir;
            this.file = file;
            return this;
        };
        PermissionsTable.prototype.OnKeyDown = function (e) {
            if (e.keyCode === Core_1.UI.Keys.F2)
                this.Source.Add(new models.PermissionFile(Core_1.basic.GuidManager.Next));
            else
                return false;
            return true;
        };
        PermissionsTable.prototype.DeletePermission = function (e, ed, scop, evnt) {
            var _this = this;
            var dt = scop.Value;
            GData.requester.Request(models.PermissionFile, "DELETEPERMISSION", void 0, { dir: this.dir.FullPath, file: this.file.Name, cid: dt.Client.Id, per: dt.Permission }, function (qll, json, iss, req) {
                if (iss)
                    _this.Source.Remove(dt);
                else
                    return Core_1.UI.InfoArea.push("The attribute doesnt deleted !!!!", false);
                Core_1.UI.InfoArea.push("The attribute deleted !!!!", true);
            });
        };
        PermissionsTable.prototype.SavePermission = function (e, ed, scop, evnt) {
            var dt = scop.Value;
            if (dt.Client == null)
                return Core_1.UI.InfoArea.push("The client cannot be null");
            GData.requester.Request(models.PermissionFile, "SETPERMISSION", void 0, { dir: this.dir.FullPath, file: this.file && this.file.Name, cid: dt.Client.Id, per: dt.Permission }, function (qll, json, iss, req) {
                if (iss)
                    Core_1.UI.InfoArea.push("The attribute saved !!!!", true);
                else
                    return Core_1.UI.InfoArea.push("The attribute doesnt saved !!!!", false);
            });
        };
        return PermissionsTable;
    }(script_8.Material.HeavyTable));
    exports.PermissionsTable = PermissionsTable;
    var BlobReader = (function () {
        function BlobReader(file, onSliceCreated, slice_size) {
            if (slice_size === void 0) { slice_size = 1024 * 100; }
            this.file = file;
            this.onSliceCreated = onSliceCreated;
            this.slice_size = slice_size;
            this.reader = new FileReader();
            this.id = Core_1.basic.GuidManager.Next + "UP" + Core_1.basic.GuidManager.Next;
        }
        BlobReader.prototype.Dispose = function () {
            this.reader = null;
            this.file = null;
        };
        BlobReader.prototype.StartUpload = function () {
            this.nextBlobSlice(0);
        };
        BlobReader.prototype.nextBlobSlice = function (start) {
            var _this = this;
            var next_slice = start + this.slice_size;
            var blob = this.file.slice(start, next_slice);
            this.reader.onloadend = function (event) {
                if (event.target.readyState !== FileReader.DONE) {
                    return;
                }
                var ajax = {
                    sender: _this,
                    data: event.target.result,
                    get file() { return this.sender.file; },
                    slice: {
                        start: start,
                        size: _this.slice_size,
                        next: next_slice, id: Core_1.basic.GuidManager.Next + "slice" + 34
                    },
                    get percentage() {
                        var size_done = start + this.slice.size;
                        return Math.floor((size_done / this.file.size) * 100);
                    },
                    onError: function (reset) {
                        if (reset)
                            this.sender.nextBlobSlice(start);
                    },
                    onSuccess: function () {
                        var size_done = this.slice.start + this.slice.size;
                        var percent_done = Math.floor((size_done / this.file.size) * 100);
                        if (this.slice.next < this.file.size) {
                            this.sender.nextBlobSlice(this.slice.next);
                        }
                        else
                            this.sender.OnDone(this);
                    }
                };
                _this.onSliceCreated(ajax);
            };
            this.reader.readAsArrayBuffer(blob);
        };
        BlobReader.prototype.UploadBlob = function (blob) {
        };
        return BlobReader;
    }());
    exports.BlobReader = BlobReader;
    var SyncQuee = (function (_super) {
        __extends(SyncQuee, _super);
        function SyncQuee(handler) {
            var _this = _super.call(this) || this;
            _this.quee = [];
            _this._isExecuting = false;
            if (!_this.handler || !_this.handler.Invoke)
                throw "argument (handler) null";
            _this.handler = { Invoke: handler.Invoke, Owner: handler.Owner };
            Object.preventExtensions(_this);
            return _this;
        }
        SyncQuee.prototype.push = function (data) {
            this.quee.push(data);
            if (!this._isExecuting)
                this.EndOperation(void 0);
        };
        SyncQuee.prototype.EndOperation = function (e) {
            if (qstore.Get(this) !== e)
                throw new Error("Unknown frame");
            if (this.quee.length) {
                this._isExecuting = true;
                this.CurrentData = this.quee.shift();
                var e = {
                    data: this.CurrentData, quee: this
                };
                qstore.Set(this, e);
                Core_1.helper.TryCatch(this.handler.Owner || this, this.handler.Invoke, function (error, e) { e.quee.EndOperation(e); }, [e]);
            }
            else {
                this._isExecuting = false;
                this.CurrentData = void 0;
                qstore.Set(this, void 0);
            }
        };
        __decorate([
            Core_1.attributes.property(Object),
            __metadata("design:type", Object)
        ], SyncQuee.prototype, "CurrentData", void 0);
        return SyncQuee;
    }(Core_1.bind.DObject));
    exports.SyncQuee = SyncQuee;
    var API;
    (function (API) {
        function serialize(obj) {
            var str = [];
            for (var p in obj)
                if (obj.hasOwnProperty(p)) {
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                }
            return str.join("&");
        }
        var PermissionApi = (function (_super) {
            __extends(PermissionApi, _super);
            function PermissionApi() {
                var _this = _super.call(this, true) || this;
                _this._root = '/_/explore';
                _this.ERegister(Core_1.net.WebRequestMethod.Open, 'LISTPERMISSIONS', "method=list&dir=@dir&file=@file", false);
                _this.ERegister(Core_1.net.WebRequestMethod.Open, 'SETPERMISSION', "method=set&dir=@dir&file=@file&cid=@cid&per=@per", false);
                _this.ERegister(Core_1.net.WebRequestMethod.Open, 'DELETEPERMISSION', "method=delete&dir=@dir&file=@file&cid=@cid", false);
                return _this;
            }
            Object.defineProperty(PermissionApi.prototype, "Url", {
                get: function () {
                    return __global.GetApiAddress(this._root);
                },
                enumerable: true,
                configurable: true
            });
            PermissionApi.prototype.GetType = function () { return models.PermissionFile; };
            PermissionApi.prototype.GetRequest = function (idata, xshema, params) {
                var shema = this.GetMethodShema(xshema);
                if (shema && shema.ParamsFormat) {
                    var qs = shema.ParamsFormat.apply(params || {});
                }
                else if (params)
                    qs = serialize(params);
                return new Core_1.net.RequestUrl(qs ? this.Url + "?" + qs : this.Url, null, null, shema ? shema.Method : 0, shema.SendData);
            };
            PermissionApi.prototype.OnResponse = function (response, data, context) {
                return data;
            };
            return PermissionApi;
        }(Core_1.Controller.Api));
        API.PermissionApi = PermissionApi;
        new PermissionApi();
    })(API = exports.API || (exports.API = {}));
    var media;
    (function (media) {
        var VideoRecorder = (function (_super) {
            __extends(VideoRecorder, _super);
            function VideoRecorder(intervalFrame) {
                if (intervalFrame === void 0) { intervalFrame = 1000; }
                var _this = _super.call(this) || this;
                _this.intervalFrame = intervalFrame;
                _this._chunks = [];
                _this._handler = {
                    handleEvent: function (e) {
                        switch (e.type) {
                            case 'error': return this.owner.OnError(e);
                            case 'warning': return this.owner.OnWarning(e);
                            case 'stop': return this.owner.OnStop(e);
                            case 'pause': return this.owner.OnPause(e);
                            case 'resume': return this.owner.OnResume(e);
                            case 'start': return this.owner.OnPlay(e);
                            case 'stop': return this.owner.OnStop(e);
                            default:
                        }
                    }, owner: _this
                };
                return _this;
            }
            Object.defineProperty(VideoRecorder.prototype, "NativeStat", {
                get: function () {
                    return this._recorder.state;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(VideoRecorder.prototype, "IsRecording", {
                get: function () {
                    return this._recorder ? this._recorder.state === 'recording' : false;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(VideoRecorder.prototype, "IsInactive", {
                get: function () {
                    return this._recorder ? this._recorder.state === 'inactive' : true;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(VideoRecorder.prototype, "IsPaused", {
                get: function () {
                    return this._recorder ? this._recorder.state === 'paused' : true;
                },
                enumerable: true,
                configurable: true
            });
            VideoRecorder.prototype.Play = function () {
                if (this.IsPaused)
                    return this.Resume();
                if (!this.IsInactive)
                    return;
                this._recorder && this._recorder.start();
            };
            VideoRecorder.prototype.Pause = function () {
                if (!this.IsRecording)
                    return;
                return this._recorder && this._recorder.pause();
            };
            VideoRecorder.prototype.Stop = function () {
                if (this.IsInactive)
                    return;
                this._recorder && this._recorder.stop();
            };
            VideoRecorder.prototype.Resume = function () {
                if (this.IsInactive)
                    return this.Play();
                if (this.IsRecording)
                    return;
                this._recorder && this._recorder.resume();
            };
            VideoRecorder.prototype._startThread = function () {
                clearInterval(this.thread);
                if (this._recorder)
                    this.thread = setInterval(function (t) { t.onThread(); }, this.intervalFrame || 200, this);
            };
            VideoRecorder.prototype._stopThread = function () {
                this.thread = clearInterval(this.thread);
            };
            VideoRecorder.prototype.onThread = function () {
                this._recorder && this._recorder.requestData();
            };
            VideoRecorder.prototype.grabDate = function () {
                this._recorder && this._recorder.requestData();
            };
            VideoRecorder.prototype.OnPause = function (e) {
                this.grabDate();
                this.State = 'paused';
                this._stopThread();
            };
            VideoRecorder.prototype.OnStop = function (e) {
                this.State = 'inactive';
                this._stopThread();
            };
            VideoRecorder.prototype.OnResume = function (e) {
                this.State = 'recording';
                this._startThread();
            };
            VideoRecorder.prototype.OnPlay = function (e) {
                this.State = 'recording';
                this.RecordID++;
                this._startThread();
            };
            VideoRecorder.prototype.OnError = function (e) {
                this.State = this.NativeStat;
            };
            VideoRecorder.prototype.OnWarning = function (e) {
                this.State = this.NativeStat;
            };
            VideoRecorder.prototype.handleEvent = function (e) {
                if (e.data.size == 0)
                    return;
                this.CurrentData = e.data;
            };
            VideoRecorder.getCodec = function () {
                for (var _i = 0, _a = this.codecs; _i < _a.length; _i++) {
                    var i = _a[_i];
                    if (MediaRecorder.isTypeSupported(i))
                        return i;
                }
            };
            VideoRecorder.prototype.onSuccessStream = function (stream) {
                this.Stream = stream;
                this._recorder = new MediaRecorder(stream, { mimeType: VideoRecorder.getCodec() });
                this._recorder.addEventListener("dataavailable", this);
                this.Avaible = true;
                for (var _i = 0, _a = VideoRecorder.events; _i < _a.length; _i++) {
                    var i = _a[_i];
                    this._recorder.addEventListener(i, this._handler);
                }
            };
            VideoRecorder.prototype.onFailStream = function (error) {
                this.Avaible = false;
            };
            VideoRecorder.prototype.OnStateChanged = function (e) {
                if (this._recorder.state === e._new)
                    return;
                switch (e._new) {
                    case 'inactive':
                        this.Stop();
                        break;
                    case 'paused':
                        this.Pause();
                        break;
                    case 'recording':
                        this.Play();
                        break;
                }
            };
            VideoRecorder.prototype.OnBlobChanaged = function (e) {
                this.FragmentID++;
                if (e._old)
                    this.Cursor += e._old.size;
            };
            VideoRecorder.prototype.GetDPCurrentDataProperty = function () {
                return this.GetProperty("CurrentData");
            };
            VideoRecorder.prototype.OnRecordIDChanged = function (e) {
                this.FragmentID = 0;
            };
            VideoRecorder.prototype.TakePicture = function (args) {
                if (!this.picture)
                    this.picture = {
                        _video: document.createElement('video'),
                        _canvas: document.createElement('canvas')
                    };
                if (args.video && !args.canvas)
                    args.canvas = document.createElement('canvas');
                var video = args.video || this.picture._video;
                var canvas = args.video ? args.canvas : this.picture._canvas;
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                canvas.getContext('2d').drawImage(video, 0, 0);
                var self = this;
                var img = canvas.toBlob(function (blob) {
                    var fileReader = new FileReader();
                    fileReader.onload = function (event) {
                        if (args.detacheVideoSource)
                            args.video.srcObject = void 0;
                        args.callback && args.callback({ sender: self, blob: blob, buffer: event.target.result, error: false, args: args });
                    };
                    function onerror(e) {
                        if (args.detacheVideoSource)
                            args.video.srcObject = void 0;
                        args.callback && args.callback({ sender: self, blob: blob, args: args, error: true });
                    }
                    fileReader.onerror = onerror;
                    fileReader.onabort = onerror;
                    fileReader.readAsArrayBuffer(blob);
                }, 'image/png');
            };
            VideoRecorder.getImage = function (args) {
                var self = this;
                var img = args.canvas.toBlob(function (blob) {
                    var fileReader = new FileReader();
                    fileReader.onload = function (event) {
                        args.callback && args.callback({ sender: void 0, blob: blob, buffer: event.target.result, error: false, args: args });
                    };
                    function onerror(e) {
                        args.callback && args.callback({ sender: void 0, blob: blob, args: args, error: true });
                    }
                    fileReader.onerror = onerror;
                    fileReader.onabort = onerror;
                    fileReader.readAsArrayBuffer(blob);
                }, 'image/png');
            };
            VideoRecorder.prototype.Dispose = function () {
                if (this.Initialized === false)
                    return;
                this._stopThread();
                this.Stop();
                try {
                    if (this.Stream) {
                        this.Stream.getTracks().every(function (v) { v.stop(); return false; });
                        this.Stream.stop();
                        this.Stream = null;
                    }
                }
                catch (_a) { }
                if (this._recorder)
                    for (var _i = 0, _b = VideoRecorder.events; _i < _b.length; _i++) {
                        var i = _b[_i];
                        this._recorder.removeEventListener(i, this._handler);
                    }
                this._recorder = void 0;
                this.Stream = void 0;
                this.Initialized = false;
            };
            VideoRecorder.prototype.Setup = function () {
                if (this.Initialized)
                    return;
                var getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
                var callback = (function (b) {
                    if (b instanceof MediaStream)
                        return this.onSuccessStream(b);
                    return this.onFailStream(b);
                }).bind(this);
                if (getUserMedia) {
                    navigator.getUserMedia({ video: { width: { exact: 640 }, height: { exact: 480 } } }, callback, callback);
                }
                else {
                    alert("The browser does not support Media Interface");
                }
                this.Initialized = true;
            };
            VideoRecorder.events = ['error', 'pause', 'resume', 'start', 'stop', 'warning'];
            VideoRecorder.labels = { paused: "Resume Recorder", inactive: 'Start Recorder', recording: "Pause Recorder" };
            VideoRecorder.codecs = ['video/webm;codecs=vp9', 'video/webm;codecs=h264', 'video/webm;codecs=vp8'];
            __decorate([
                Core_1.attributes.property(String, "inactive", void 0, VideoRecorder.prototype.OnStateChanged),
                __metadata("design:type", String)
            ], VideoRecorder.prototype, "State", void 0);
            __decorate([
                Core_1.attributes.property(Number, 0, void 0, VideoRecorder.prototype.OnRecordIDChanged),
                __metadata("design:type", Object)
            ], VideoRecorder.prototype, "RecordID", void 0);
            __decorate([
                Core_1.attributes.property(Number, 0),
                __metadata("design:type", Object)
            ], VideoRecorder.prototype, "FragmentID", void 0);
            __decorate([
                Core_1.attributes.property(Blob, void 0, void 0, VideoRecorder.prototype.OnBlobChanaged),
                __metadata("design:type", Blob)
            ], VideoRecorder.prototype, "CurrentData", void 0);
            __decorate([
                Core_1.attributes.property(Number, 0),
                __metadata("design:type", Number)
            ], VideoRecorder.prototype, "Cursor", void 0);
            __decorate([
                Core_1.attributes.property(Boolean),
                __metadata("design:type", Boolean)
            ], VideoRecorder.prototype, "Avaible", void 0);
            __decorate([
                Core_1.attributes.property(Boolean, undefined),
                __metadata("design:type", Boolean)
            ], VideoRecorder.prototype, "Initialized", void 0);
            __decorate([
                Core_1.attributes.property(MediaStream),
                __metadata("design:type", MediaStream)
            ], VideoRecorder.prototype, "Stream", void 0);
            return VideoRecorder;
        }(Core_1.bind.DObject));
        media.VideoRecorder = VideoRecorder;
        var ImageCapture = (function (_super) {
            __extends(ImageCapture, _super);
            function ImageCapture() {
                var _this = _super.call(this, FileManager_html_1.template.Folder.Picture, Core_1.UI.TControl.Me) || this;
                _this._videoRecorder = new VideoRecorder();
                window['icc'] = _this;
                return _this;
            }
            ImageCapture.prototype.__takePic = function (e, ed, scop, evnt) {
                if (this.IsPlaying) {
                    this.pause();
                    ed.dom.textContent = "Resume";
                }
                else {
                    ed.dom.textContent = "Pause";
                    this.play();
                }
            };
            ImageCapture.prototype.__recordeVid = function (e, ed, scop, evnt) {
                if (this._videoRecorder.IsRecording) {
                    this._videoRecorder.Pause();
                    ed.dom.textContent = "Resume Video";
                }
                else {
                    this._videoRecorder.Play();
                    ed.dom.textContent = "Recording";
                }
            };
            ImageCapture.prototype.setName = function (name, dom, cnt, e) {
                var _this = this;
                switch (name) {
                    case '_video':
                        this._video = dom;
                        this._videoRecorder.OnPropertyChanged(this._videoRecorder.GetProperty("Stream"), function (s, e) {
                            _this._video.srcObject = e._new;
                            _this.play();
                        }, this);
                        this._video.srcObject = this._videoRecorder.Stream;
                    default: return;
                }
            };
            Object.defineProperty(ImageCapture.prototype, "IsPlaying", {
                get: function () {
                    return !!(this._video.currentTime > 0 && !this._video.paused && !this._video.ended && this._video.readyState > 2);
                },
                enumerable: true,
                configurable: true
            });
            ImageCapture.prototype.TakePicture = function (callback) {
                this._videoRecorder.TakePicture({
                    callback: function (e) {
                        callback({ sender: e.args.objectStat, blob: e.blob, Buffer: e.buffer });
                    },
                    video: this._video,
                    canvas: this._canvas, detacheVideoSource: false, objectStat: this
                });
            };
            ImageCapture.prototype.Open = function (callback) {
                var _this = this;
                var isexecuting = false;
                var waits = [];
                var e = {
                    sender: this, blob: void 0, Buffer: void 0, modalResult: void 0,
                    grabContent: function (callback) {
                        var _this = this;
                        if (Object.isFrozen(this))
                            return callback(this);
                        waits.push(callback);
                        if (waits.length > 1)
                            return;
                        this.sender.TakePicture(function (e) {
                            Object.freeze(_this);
                            for (var _i = 0, waits_1 = waits; _i < waits_1.length; _i++) {
                                var i = waits_1[_i];
                                try {
                                    i(e);
                                }
                                catch (_a) { }
                            }
                            waits = void 0;
                        });
                    }
                };
                this.OnCompiled = function (n) { return n._videoRecorder.Setup(); };
                Core_1.UI.Modal.ShowDialog("Image Capture", this, function (e1) {
                    if (e1.Result === Core_1.UI.MessageResult.ok)
                        e.grabContent(function (e) {
                            e.sender._videoRecorder.Dispose();
                            e.sender.pause();
                            e.modalResult = e1;
                            callback && callback(e);
                        });
                    else {
                        e.sender._videoRecorder.Dispose();
                        callback({ blob: void 0, Buffer: void 0, sender: _this, modalResult: e1, grabContent: function (e) { } });
                    }
                }, "Save", "Discart", null);
                return this;
            };
            ImageCapture.prototype.play = function (callback) {
                if (this.IsPlaying)
                    return;
                this._video.play()
                    .then(function (a) { return typeof callback === 'function' && callback(true, a); })
                    .catch(function (a) { return typeof callback === 'function' && callback(true, a); });
            };
            ImageCapture.prototype.pause = function () {
                this.Number = [Math.random() * Math.PI];
                if (!this._video.paused)
                    this._video.pause();
            };
            ImageCapture.prototype.refresh = function () {
                this._videoRecorder.Dispose();
                this._videoRecorder.Setup();
            };
            ImageCapture.prototype.trim = function (p) {
                return p.substr(3);
            };
            ImageCapture.prototype.test = function (x) {
                return x + " from test";
            };
            __decorate([
                Core_1.attributes.property(String),
                __metadata("design:type", String)
            ], ImageCapture.prototype, "Path", void 0);
            __decorate([
                Core_1.attributes.property(Array, 0),
                __metadata("design:type", Array)
            ], ImageCapture.prototype, "Number", void 0);
            return ImageCapture;
        }(Core_1.UI.TControl));
        media.ImageCapture = ImageCapture;
    })(media = exports.media || (exports.media = {}));
    var IO;
    (function (IO) {
        var FileUploader = (function () {
            function FileUploader(dir, file) {
                this.Quee = new SyncQuee({ Invoke: this.OnDataAvaible, Owner: this });
            }
            FileUploader.prototype.OnDataAvaible = function (e) {
                this.syncAr = e;
                this.Upload(e);
            };
            FileUploader.prototype.Upload = function (e) {
                var reader = new FileReader();
                reader.addEventListener('loadend', function (e) {
                    var r = e.target.result;
                });
                reader.readAsArrayBuffer(e.data);
            };
            return FileUploader;
        }());
        IO.FileUploader = FileUploader;
    })(IO = exports.IO || (exports.IO = {}));
});
define("Desktop/Admin/Agents", ["require", "exports", "../../lib/Q/sys/UI", "abstract/extra/Common", "../../lib/Q/sys/corelib", "Idea/FileManager"], function (require, exports, UI_24, Common_15, corelib_8, FileManager_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GData;
    Common_15.GetVars(function (v) {
        GData = v;
        return false;
    });
    var Agents = (function (_super) {
        __extends(Agents, _super);
        function Agents() {
            var _this = _super.call(this, 'agents_info', "Agents") || this;
            _this.Title = "Agents";
            return _this;
        }
        Object.defineProperty(Agents.prototype, "HasSearch", {
            get: function () { return UI_24.UI.SearchActionMode.NoSearch; },
            set: function (v) { },
            enumerable: true,
            configurable: true
        });
        Agents.prototype.Update = function () {
            GData.apis.Agent.SmartUpdate();
        };
        Agents.prototype.OnKeyDown = function (e) {
            if (!this.adapter.OnKeyDown(e)) {
                if (e.keyCode === UI_24.UI.Keys.F1)
                    this.getHelp({
                        "Enter": "Edit",
                        "Suppr": "Delete",
                        "F2": "Add New",
                    });
                else if (e.keyCode === UI_24.UI.Keys.F2)
                    GData.apis.Agent.CreateNew(function (e) {
                        if (e.Error !== corelib_8.basic.DataStat.Success)
                            UI_24.UI.InfoArea.push("The " + e.Data.toString() + " not Saved");
                        else
                            UI_24.UI.InfoArea.push("The " + e.Data.toString() + " successfully created");
                    });
                else if (this.adapter.SelectedIndex != -1)
                    if (e.keyCode === 13)
                        GData.apis.Agent.Edit(this.adapter.SelectedItem, function (e) {
                            if (e.Error !== corelib_8.basic.DataStat.Success)
                                UI_24.UI.InfoArea.push("The " + e.Data.toString() + " not Saved");
                            else
                                UI_24.UI.InfoArea.push("The " + e.Data.toString() + " successfully Saved");
                        });
                    else if (e.keyCode === UI_24.UI.Keys.Delete)
                        GData.apis.Agent.Delete(this.adapter.SelectedItem, null);
                    else
                        return _super.prototype.OnKeyDown.call(this, e);
                else
                    return _super.prototype.OnKeyDown.call(this, e);
            }
            e.stopPropagation();
            e.preventDefault();
            return true;
        };
        Agents.prototype.initialize = function () {
            _super.prototype.initialize.call(this);
            this.adapter = new UI_24.UI.ListAdapter('Agents.table');
            this.adapter.AcceptNullValue = false;
            this.Add(this.adapter);
            this.adapter.OnInitialized = function (p) { return p.Source = GData.__data.Agents; };
        };
        Agents.prototype.GetLeftBar = function () {
            var _this = this;
            if (!this.lb) {
                var l = new UI_24.UI.Navbar();
                var add_1 = new UI_24.UI.Glyph(UI_24.UI.Glyphs.plusSign, false, 'Add');
                var edit_1 = new UI_24.UI.Glyph(UI_24.UI.Glyphs.edit, false, 'Edit');
                var remove_1 = new UI_24.UI.Glyph(UI_24.UI.Glyphs.fire, false, 'Remove');
                var oldget_1 = l.getTemplate;
                l.getTemplate = function (c) {
                    var e = oldget_1(new UI_24.UI.Anchore(c));
                    if (c.Enable === false)
                        e.Enable = false;
                    else
                        e.addEventListener('click', _this.handleSerices, { t: _this, c: c.Type });
                    return e;
                };
                l.OnInitialized = function (l) { return l.AddRange([add_1, edit_1, remove_1]); };
                this.lb = l;
            }
            return this.lb;
        };
        Agents.prototype.handleSerices = function (s, e, p) {
            var c = UI_24.UI.Glyphs;
            switch (p.c) {
                case c.plusSign:
                    return GData.apis.Agent.CreateNew();
                case c.edit:
                    return GData.apis.Agent.Edit(p.t.adapter.SelectedItem, null);
                case c.fire:
                    return GData.apis.Agent.Delete(p.t.adapter.SelectedItem, null);
            }
        };
        return Agents;
    }(UI_24.UI.NavPanel));
    exports.Agents = Agents;
    var StatisticsPanel = (function (_super) {
        __extends(StatisticsPanel, _super);
        function StatisticsPanel() {
            var _this = _super.call(this, 'statistics_panel', "Statistiques") || this;
            _this.Title = "Statistiques";
            return _this;
        }
        StatisticsPanel.prototype.initialize = function () {
            _super.prototype.initialize.call(this);
            this.Add(this._content = new FileManager_1.StatView());
        };
        return StatisticsPanel;
    }(UI_24.UI.NavPanel));
    exports.StatisticsPanel = StatisticsPanel;
});
define("Desktop/Admin/Command", ["require", "exports", "../../lib/Q/sys/UI", "abstract/Models", "assets/data/data", "../../lib/q/components/HeavyTable/script", "abstract/extra/Common", "../../lib/Q/sys/corelib", "Componenets/Forms", "Componenets/PStat"], function (require, exports, UI_25, Models_31, data_8, script_9, Common_16, corelib_9, Forms_3, PStat_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GData;
    Common_16.GetVars(function (v) { GData = clone(v); return false; });
    var views;
    (function (views) {
        var Command = (function (_super) {
            __extends(Command, _super);
            function Command() {
                var _this = _super.call(this, "Command", "Command") || this;
                _this.x = new UI_25.UI.Modals.EModalEditer("templates.carticleedit", false);
                return _this;
            }
            Command.prototype._hasValue_ = function () { return true; };
            Command.prototype.initialize = function () {
                var _this = this;
                _super.prototype.initialize.call(this);
                corelib_9.Api.RiseApi('loadFournisseurs', void 0);
                var f = this.adapter = new script_9.Material.HeavyTable(data_8.data.value.CommandDef.def).applyStyle('fitHeight');
                this.Add(this.adapter = f);
                this.Update();
                var oldkeydown = this.x.OnKeyDown;
                this.x['pressKey'] = function (e, dt, scop, ev) {
                    if (e.keyCode == 116) {
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        e.stopPropagation();
                        _this.GetLastArticlePrice(scop.Value);
                    }
                };
                UI_25.UI.Desktop.Current.KeyCombiner.On('S', 'R', function (s, e) {
                    var _this = this;
                    s.Cancel = true;
                    var q = PStat_3.Statistique.Views.ListOfFakePrices.OpenQuery();
                    q.OnInitialized = function (n) { return n.SelectedProduct = _this.adapter.SelectedItem.Product; };
                }, this, this);
            };
            Command.prototype.OnKeyDown = function (e) {
                if (this.Value.IsOpen) {
                    if (e.keyCode == 13)
                        return this.NewArticle();
                    else if (e.keyCode == 113)
                        return this.EditArticle();
                    else if (e.keyCode == 46)
                        return this.DeleteArticle(this.adapter.SelectedItem);
                }
                var c = this.adapter.OnKeyDown(e);
                if (!c)
                    return _super.prototype.OnKeyDown.call(this, e);
                return c;
            };
            Command.prototype.OpenInfo = function (e, dt, scop, x) {
                var xm = PStat_3.Statistique.Views.ListOfFakePrices.Default;
                var c = scop.Value;
                this.GetLastArticlePrice(c);
            };
            Command.prototype.GetLastArticlePrice = function (p) {
                corelib_9.Api.RiseApi('getLastArticlePrice', {
                    data: { Dealer: undefined, Product: p.Product, Before: new Date(Date.now() + 2231536000000), IsAchat: true, asRecord: true },
                    callback: function (a, prc) {
                        if (prc) {
                            p.Price = prc.PSel || p.Product.PSel;
                            p.Fournisseur = GData.__data.Fournisseurs.GetById(prc.Facture.Fournisseur);
                            if (!p.Qte)
                                p.Qte = prc.Qte;
                        }
                        else
                            GData.apis.Fournisseur.Select(function (a) {
                                if (a.Error == corelib_9.basic.DataStat.Success) {
                                    p.Fournisseur = a.Data;
                                }
                            });
                    }
                });
            };
            ;
            Command.prototype.NewArticle = function () {
                var _this = this;
                var edit = function (cc) {
                    _this._editArticle(cc, function (a, e) {
                        if (e.E.Result == UI_25.UI.MessageResult.ok) {
                            if (cc.Label == null || cc.Label.trim() == "") {
                                e.E.StayOpen();
                                return;
                            }
                            GData.requester.Request(Models_31.models.CArticle, "SAVE", cc, void 0, function (q, json, b, x) {
                                if (b) {
                                    _this.adapter.Source.Add(cc);
                                    _this.adapter.SelectedItem = cc;
                                }
                                else
                                    edit(cc);
                            });
                        }
                    });
                };
                corelib_9.basic.GuidManager.New(function (id) {
                    var cc = new Models_31.models.CArticle(id);
                    cc.Product = null;
                    cc.Fournisseur = null;
                    cc.Command = _this.Value;
                    edit(cc);
                }, null);
            };
            Command.prototype.EditArticle = function () {
                var cc = this.adapter.SelectedItem;
                if (!cc)
                    return;
                this._editArticle(cc, function (a, e) {
                    if (e.E.Result == UI_25.UI.MessageResult.ok)
                        GData.requester.Request(Models_31.models.CArticle, "SAVE", cc, void 0, function (q, json, b, x) {
                            !b && UI_25.UI.InfoArea.push("UnExpected Error");
                        });
                });
            };
            Command.prototype._editArticle = function (p, action) {
                this.x.edit(p, false, action, this.Value.IsOpen);
            };
            Command.prototype.DeleteArticle = function (art) {
                var _this = this;
                GData.requester.Request(Models_31.models.CArticle, "DELETE", void 0, { Id: art.Id }, function (e, p, d, q) {
                    if (d)
                        _this.adapter.Source.Remove(art);
                });
            };
            Command.prototype.Update = function () {
                var _this = this;
                if (!this.Value) {
                    this.Value = new Models_31.models.Command(corelib_9.basic.New());
                    this.adapter.Source = this.Value.Articles;
                }
                GData.requester.Request(Models_31.models.Command, "UPDATEDC", this.Value, void 0, function (e, p, d, q) {
                    GData.requester.Request(Models_31.models.CArticles, "UPDATEDC", _this.adapter.Source, void 0, function (e, p, d, q) {
                    });
                });
            };
            Object.defineProperty(Command.prototype, "Source", {
                get: function () {
                    return this.adapter.getScop().Value;
                },
                enumerable: true,
                configurable: true
            });
            Command.prototype.OnPrint = function () {
                var responce = {};
                GData.requester.Request(Models_31.models.Command, "PRINT", responce, void 0, function (a, b, c) {
                    if (b.Response && b.Response.Success) {
                        var url = __global.ApiServer.Combine('/_/$?Id=' + b.Response.FileName).FullPath;
                        Forms_3.Forms.PDFViewer.Show(url);
                    }
                });
            };
            return Command;
        }(UI_25.UI.NavPanel));
        views.Command = Command;
    })(views = exports.views || (exports.views = {}));
    corelib_9.bind.Register({
        Name: "loadCArticle",
        OnInitialize: function (ji, e) {
        },
        Todo: function (ji, e) {
            var art = ji.Scop.getParent().Value;
            var prd = !e ? art.Product : e._new;
            if (!prd)
                return;
            corelib_9.Api.RiseApi('getLastArticlePrice', {
                data: { Dealer: undefined, Product: prd, Before: new Date(Date.now() + 3333333333333333333), IsAchat: true, asRecord: true },
                callback: function (a, prc) {
                    if (prc) {
                        art.Price = prc.PSel || prd.PSel;
                        art.Fournisseur = GData.__data.Fournisseurs.GetById(prc.Facture.Fournisseur);
                        if (!art.Qte)
                            art.Qte = prc.Qte;
                    }
                }
            });
        }
    });
});
define("Desktop/Services/QServices", ["require", "exports", "../../lib/Q/sys/UI", "abstract/Models", "abstract/extra/Common"], function (require, exports, UI_26, Models_32, Common_17) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GData;
    Common_17.GetVars(function (vars) {
        GData = vars;
        return false;
    });
    var Services;
    (function (Services) {
        function OnItemSelected(m) {
            if (this.s)
                this.s.Callback(m.Source);
        }
        var SearchServices = (function (_super) {
            __extends(SearchServices, _super);
            function SearchServices() {
                var _this = _super.call(this) || this;
                _this.OnItemSelectedDlgt = { Invoke: OnItemSelected, Owner: _this };
                return _this;
            }
            SearchServices.prototype.initialize = function () {
                _super.prototype.initialize.call(this);
                this.Items.Add(new UI_26.UI.CItem('add', 'Add', '#', this.OnItemSelectedDlgt));
                this.Items.Add(new UI_26.UI.CItem('modify', 'Modify', '#', this.OnItemSelectedDlgt));
                this.Items.Add(new UI_26.UI.CItem('remove', 'Remove', '#', this.OnItemSelectedDlgt));
                this.Items.Add(new UI_26.UI.CItem('suggest', 'Suggests', '#', this.OnItemSelectedDlgt));
            };
            SearchServices.prototype.ApplyTo = function (s) {
                this.s = s;
            };
            return SearchServices;
        }(UI_26.UI.Navbar));
        Services.SearchServices = SearchServices;
        function CreateIcon(icon, title) {
            var t = document.createElement('sapn');
            t.classList.add('glyphicon', 'bgr', 'glyphicon-' + icon);
            t.title = title;
            return t;
        }
        var RFactureServices = (function (_super) {
            __extends(RFactureServices, _super);
            function RFactureServices() {
                var _this = _super.call(this) || this;
                _this.OnItemSelectedDlgt = { Invoke: OnItemSelected, Owner: _this };
                return _this;
            }
            RFactureServices.prototype.initialize = function () {
                _super.prototype.initialize.call(this);
                this.OnItemSelected = this.OnItemSelected;
                this.Items.Add(new UI_26.UI.CItem('save', CreateIcon('save', 'Save'), '#', this.OnItemSelectedDlgt));
                this.Items.Add(new UI_26.UI.CItem('refresh', CreateIcon('refresh', 'Refresh'), '#', this.OnItemSelectedDlgt));
                this.Items.Add(new UI_26.UI.CItem('check', CreateIcon('check', 'Validate'), '#', this.OnItemSelectedDlgt));
            };
            RFactureServices.prototype.OnItemSelected = function (m) {
                if (this.s)
                    this.s.Callback(m.Source);
            };
            RFactureServices.prototype.ApplyTo = function (s) {
                this.s = s;
            };
            return RFactureServices;
        }(UI_26.UI.Navbar));
        Services.RFactureServices = RFactureServices;
        var FactureService = (function (_super) {
            __extends(FactureService, _super);
            function FactureService() {
                var _this = _super.call(this) || this;
                _this.OnItemSelectedDlgt = { Invoke: OnItemSelected, Owner: _this };
                return _this;
            }
            FactureService.prototype.initialize = function () {
                var _this = this;
                _super.prototype.initialize.call(this);
                this.Items.Add(new UI_26.UI.CItem('add', UI_26.UI.Glyph.CreateGlyphDom(UI_26.UI.Glyphs.edit, 'Add Products'), '#', this.OnItemSelectedDlgt));
                var t;
                GData.user.OnMessage(function (s, e) {
                    onLogged(e._new);
                });
                var onLogged = function (v) {
                    if (v) {
                        GData.requester.Push(Models_32.models.IsAdmin, new Models_32.models.IsAdmin(), null, function (s, r, iss) {
                            if (iss) {
                                t = t || new UI_26.UI.CItem('select', UI_26.UI.Glyph.CreateGlyphDom(UI_26.UI.Glyphs.user, 'Select Client'), '#', _this.OnItemSelectedDlgt);
                                if (_this.Items.IndexOf(t) == -1)
                                    _this.Items.Insert(1, t);
                            }
                            else {
                                if (!t)
                                    return;
                                var o;
                                if ((o = _this.Items.IndexOf(t)) !== -1)
                                    _this.Items.RemoveAt(o);
                            }
                        });
                    }
                    else {
                    }
                };
                onLogged(GData.user.IsLogged);
                this.Items.Add(new UI_26.UI.CItem('delete', UI_26.UI.Glyph.CreateGlyphDom(UI_26.UI.Glyphs.fire, 'Delete This Facture'), '#', this.OnItemSelectedDlgt));
            };
            FactureService.prototype.ApplyTo = function (s) {
                this.s = s;
            };
            return FactureService;
        }(UI_26.UI.Navbar));
        Services.FactureService = FactureService;
        var CostumersService = (function (_super) {
            __extends(CostumersService, _super);
            function CostumersService() {
                var _this = _super.call(this) || this;
                _this.OnItemSelectedDlgt = { Invoke: OnItemSelected, Owner: _this };
                return _this;
            }
            CostumersService.prototype.initialize = function () {
                _super.prototype.initialize.call(this);
            };
            CostumersService.prototype.ApplyTo = function (s) {
                this.s = s;
                return this;
            };
            return CostumersService;
        }(UI_26.UI.Navbar));
        Services.CostumersService = CostumersService;
        var FacturesService = (function (_super) {
            __extends(FacturesService, _super);
            function FacturesService() {
                var _this = _super.call(this) || this;
                _this.OnItemSelectedDlgt = { Invoke: OnItemSelected, Owner: _this };
                return _this;
            }
            FacturesService.prototype.initialize = function () {
                _super.prototype.initialize.call(this);
                this.Items.Add(new UI_26.UI.CItem('select', UI_26.UI.Glyph.CreateGlyphDom(UI_26.UI.Glyphs.shareAlt, 'Open this Facture', 'bgr'), '#', this.OnItemSelectedDlgt));
                this.Items.Add(new UI_26.UI.CItem('new', UI_26.UI.Glyph.CreateGlyphDom(UI_26.UI.Glyphs.plusSign, 'Ceate New Facture '), '#', this.OnItemSelectedDlgt));
            };
            FacturesService.prototype.ApplyTo = function (s) {
                this.s = s;
            };
            return FacturesService;
        }(UI_26.UI.Navbar));
        Services.FacturesService = FacturesService;
        var MyClientsService = (function (_super) {
            __extends(MyClientsService, _super);
            function MyClientsService() {
                var _this = _super.call(this) || this;
                _this.OnItemSelectedDlgt = { Invoke: OnItemSelected, Owner: _this };
                return _this;
            }
            MyClientsService.prototype.initialize = function () {
                _super.prototype.initialize.call(this);
                this.Items.Add(new UI_26.UI.CItem('new', UI_26.UI.Glyph.CreateGlyphDom(UI_26.UI.Glyphs.plusSign, 'Create New Client'), '#', this.OnItemSelectedDlgt));
                this.Items.Add(new UI_26.UI.CItem('edit', UI_26.UI.Glyph.CreateGlyphDom(UI_26.UI.Glyphs.edit, 'Edit'), '#', this.OnItemSelectedDlgt));
                this.Items.Add(new UI_26.UI.CItem('delete', UI_26.UI.Glyph.CreateGlyphDom(UI_26.UI.Glyphs.fire, 'Delete'), '#', this.OnItemSelectedDlgt));
            };
            MyClientsService.prototype.ApplyTo = function (s) {
                this.s = s;
            };
            return MyClientsService;
        }(UI_26.UI.Navbar));
        Services.MyClientsService = MyClientsService;
    })(Services = exports.Services || (exports.Services = {}));
});
define("Desktop/SMS", ["require", "exports", "../lib/q/sys/UI", "../lib/q/sys/Corelib", "abstract/Models", "abstract/extra/Common", "Desktop/Services/QServices", "abstract/extra/Basics", "assets/data/data", "../lib/q/components/HeavyTable/script", "Idea/FileManager"], function (require, exports, UI_27, Corelib_21, Models_33, Common_18, QServices_1, Basics_13, data_9, script_10, FileManager_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GData;
    Common_18.GetVars(function (v) { GData = v; return false; });
    var smsRowTemplate = UI_27.UI.help.createTemplate(data_9.data.value.smsTable.def);
    var SMSsView = (function (_super) {
        __extends(SMSsView, _super);
        function SMSsView(source) {
            var _this = _super.call(this, data_9.data.value.smsTable.def) || this;
            _this.Source = source;
            _this.View.style.overflowX = "auto";
            function getf(a) {
                return ((a = a.From) && a.FullName || "");
            }
            function gett(a) {
                return ((a = a.To) && a.FullName || "");
            }
            function getd(a) {
                return ((a = a.Date) && a.getTime() || 0);
            }
            function getl(a) {
                return (a.Title || "");
            }
            function getm(a) {
                return a.Message || "";
            }
            _this.setOrderHandler({
                Owner: _this, Invoke: function (e) {
                    switch (e.orderBy) {
                        case "IsReaded":
                            return _this.Source.OrderBy(function (a, b) { return e.state.factor * ((b.IsReaded ? 1 : 0) - (a.IsReaded ? 1 : 0)); });
                        case "From":
                            return _this.Source.OrderBy(function (a, b) { return e.state.factor * getf(a).localeCompare(getf(b)); });
                        case "To":
                            return _this.Source.OrderBy(function (a, b) { return e.state.factor * gett(a).localeCompare(gett(b)); });
                            ;
                        case "Date":
                            return _this.Source.OrderBy(function (a, b) { return e.state.factor * (getd(a) - getd(b)); });
                        case "Title":
                            return _this.Source.OrderBy(function (a, b) { return e.state.factor * getl(a).localeCompare(getl(b)); });
                        case "Message":
                            _this.Source.OrderBy(function (a, b) { return e.state.factor * getm(a).localeCompare(getm(b)); });
                    }
                }
            });
            return _this;
        }
        Object.defineProperty(SMSsView.prototype, "Paginator", {
            get: function () {
                if (this._paginator)
                    return this._paginator;
                this._paginator = UI_27.UI.Paginator.createPaginator(this, this.Source);
                return this._paginator;
            },
            enumerable: true,
            configurable: true
        });
        return SMSsView;
    }(script_10.Material.HeavyTable));
    exports.SMSsView = SMSsView;
    function getSMSFilter(f) { return new Corelib_21.utils.CostumeFilter(f); }
    var SMSPage = (function (_super) {
        __extends(SMSPage, _super);
        function SMSPage() {
            var _this = _super.call(this, 'SMS', 'SMS') || this;
            _this.allSMS = new Models_33.models.SMSs("All Message", "all");
            _this.fs = new QServices_1.Services.SearchServices();
            if (SMSPage.Default)
                throw new Error("this is SignleIton Class");
            SMSPage.Default = _this;
            return _this;
        }
        SMSPage.prototype.initializeVars = function () {
            this.converter = {
                ConvertA2B: function (tarnsList, index, item) {
                    return new UI_27.UI.TabControlItem(item.category, item);
                }, ConvertB2A: function (tarnsList, index, item) {
                    return item.Content;
                }
            };
            this.smsByCategory = new Corelib_21.collection.List(Models_33.models.SMSs);
            this.smssToTabItem = new Corelib_21.collection.TransList(Object, this.converter);
            this.smssToTabItem.Source = this.smsByCategory;
            this._paginator = (this._smssView = new SMSsView(null)).Paginator;
            window["pg"] = this._paginator;
            this.smsTabControl = new UI_27.UI.UniTabControl("smsTabControl", "SMS Manager", this.smssToTabItem, this._paginator, function (tabControl, view, tabCntData) {
                view.Input = tabCntData.Content;
                return tabCntData.Title;
            });
            this._smssView.AcceptNullValue = false;
        };
        SMSPage.prototype.getSuggessions = function () { return GData.__data.Products; };
        SMSPage.prototype.initialize = function () {
            _super.prototype.initialize.call(this);
            this.initializeVars();
            this.Add(this.smsTabControl);
            this.smsTabControl.OnTabClosed.On = function (e) {
                e.Cancel = true;
            };
            this.initializeTabs();
        };
        SMSPage.prototype.initializeTabs = function () {
            var InBoxNonReaded;
            var InBoxReaded;
            var outBoxNonReaded;
            var outBoxReaded;
            GData.user.OnMessage(function (prop, e) {
                connectionChanged(e._new, e.__this.Client);
            });
            GData.apis.Client.GetMyId(function (e) {
                connectionChanged(GData.user.IsLogged, e.Data);
            });
            var self = this;
            function connectionChanged(b, client) {
                var all = self.allSMS;
                if (b) {
                    var getID_1 = function (m) { return m && m.Id; };
                    var mid = getID_1(client);
                    if (!InBoxNonReaded) {
                        InBoxNonReaded = all.Filtred(getSMSFilter(function (_, sms) { return !sms.IsReaded && getID_1(sms.To) === mid; }));
                        InBoxNonReaded['category'] = "InBox Unreaded";
                        InBoxNonReaded['Tag'] = "NonReaded";
                        InBoxReaded = all.Filtred(getSMSFilter(function (_, sms) { return sms.IsReaded && getID_1(sms.To) === mid; }));
                        InBoxReaded['category'] = "InBox Readed";
                        InBoxReaded['Tag'] = "Readed";
                        outBoxNonReaded = all.Filtred(getSMSFilter(function (_, sms) { return !sms.IsReaded && getID_1(sms.From) === mid; }));
                        outBoxNonReaded['category'] = "OutBox Non Readed";
                        outBoxNonReaded['Tag'] = "SendedNonReaded";
                        outBoxReaded = all.Filtred(getSMSFilter(function (_, sms) { return sms.IsReaded && getID_1(sms.From) === mid; }));
                        outBoxReaded['category'] = "OutBox Readed";
                        outBoxReaded['Tag'] = "Sended";
                        var arr = [InBoxNonReaded, outBoxNonReaded, InBoxReaded, outBoxReaded, all];
                        self.smsByCategory.AddRange(arr);
                    }
                    GData.apis.Sms.Update(self.allSMS);
                }
                else
                    self.allSMS.Clear();
            }
        };
        SMSPage.prototype.OnKeyDown = function (e) {
            if (e.keyCode == UI_27.UI.Keys.F2) {
                this.addNewSMS();
                return true;
            }
            else if (e.keyCode === UI_27.UI.Keys.Enter) {
                this.showSMS();
            }
            else if (e.keyCode === UI_27.UI.Keys.Delete) {
                this.deleteSMS();
            }
            return this.smsTabControl.OnKeyDown(e);
        };
        SMSPage.prototype.deleteSMS = function () {
            var sms = this._smssView.SelectedItem;
            var p = this._paginator.Input;
            if (sms) {
                GData.apis.Sms.Delete(sms, function (e) {
                    var sms = e.Data;
                    if (e.Error === Basics_13.basics.DataStat.Success) {
                        p.Remove(sms);
                    }
                });
            }
        };
        SMSPage.prototype.showSMS = function () {
            var sms = this._smssView.SelectedItem;
            if (sms) {
                GData.apis.Sms.EditData.edit(sms, false, function (s, e) {
                    var sms = e.Data;
                    e.Data.Rollback(e.BackupData);
                    e.CommitOrBackupHandled = true;
                    if (!sms.IsReaded && e.E.Result == UI_27.UI.MessageResult.ok) {
                        GData.requester.Request(Models_33.models.SMS, Corelib_21.net.WebRequestMethod.Post, void 0, { Id: e.Data.Id, MakeReaded: true }, function (e1, json, iss) {
                            if (iss) {
                                e.Data.IsReaded = true;
                            }
                        });
                    }
                }, true);
            }
        };
        SMSPage.prototype.addNewSMS = function () {
            var _this = this;
            var d = new Date();
            d.toLocaleString();
            GData.apis.Sms.CreateNew(function (e) {
                if (e.Error === Basics_13.basics.DataStat.Success) {
                    _this.allSMS.Add(e.Data);
                    var t = e.Data.To;
                    UI_27.UI.Modal.ShowDialog('Success', "Votre message a " + (t && t.FullName) + " est bien envoyer", void 0, "OK", null, null);
                }
            });
        };
        SMSPage.prototype.OnSearche = function (o, n) {
        };
        Object.defineProperty(SMSPage.prototype, "HasSearch", {
            get: function () { return UI_27.UI.SearchActionMode.Instantany; },
            enumerable: true,
            configurable: true
        });
        SMSPage.prototype.GetLeftBar = function () {
            return null;
        };
        SMSPage.prototype.Update = function () {
            var _this = this;
            var lst = this.smsTabControl.SelectedItem.Content;
            if (lst === this.allSMS)
                return GData.apis.Sms.Update(this.allSMS);
            UI_27.UI.Modal.ShowDialog("", "Do you want to update all sms", function (e) {
                switch (e.Result) {
                    case UI_27.UI.MessageResult.ok:
                        return GData.apis.Sms.Update(_this.allSMS);
                    case UI_27.UI.MessageResult.cancel:
                        var lst_1 = _this.smsTabControl.SelectedItem.Content;
                        GData.apis.Sms.Update(lst_1, lst_1.Tag);
                        return;
                }
            }, "Yes", "No", "Abort");
        };
        return SMSPage;
    }(UI_27.UI.NavPanel));
    exports.SMSPage = SMSPage;
    var FilePage = (function (_super) {
        __extends(FilePage, _super);
        function FilePage() {
            var _this = _super.call(this, "File Manager", "Explorer") || this;
            _this.manager = new FileManager_2.FileManager();
            return _this;
        }
        FilePage.prototype.OnKeyDown = function (e) {
            return this.manager.OnKeyDown(e);
        };
        FilePage.prototype.initialize = function () {
            _super.prototype.initialize.call(this);
            var t = new UI_27.UI.Dom('text');
            this.Add(t);
            this.Add(this.manager);
        };
        FilePage.prototype.Update = function () {
            this.manager.Update();
        };
        FilePage.prototype.OnSearche = function (old, _new) {
            return this.manager.OnSearch(old, _new);
        };
        Object.defineProperty(FilePage.prototype, "HasSearch", {
            get: function () { return UI_27.UI.SearchActionMode.Instantany; },
            enumerable: true,
            configurable: true
        });
        FilePage.prototype.OnContextMenu = function (e) {
            return this.manager.OnContextMenu(e) || _super.prototype.OnContextMenu.call(this, e);
        };
        return FilePage;
    }(UI_27.UI.NavPanel));
    exports.FilePage = FilePage;
});
define("Desktop/AdminPage", ["require", "exports", "../lib/q/sys/UI", "../lib/q/sys/Corelib", "abstract/Models", "Desktop/Jobs", "Desktop/Admin/ListOfFactures", "Desktop/Admin/Costumers", "Desktop/Admin/Fournisseurs", "Desktop/Admin/Facture", "Desktop/Admin/Logins", "Desktop/Admin/Products", "Desktop/Admin/Categories", "Desktop/Admin/Revages", "Desktop/Admin/Agents", "Componenets/Forms", "Desktop/Admin/Command", "abstract/extra/Common", "Desktop/SMS"], function (require, exports, UI_28, Corelib_22, Models_34, Jobs_3, ListOfFactures_1, Costumers_1, Fournisseurs_1, Facture_1, Logins_1, Products_1, Categories_1, Revages_1, Agents_1, Forms_4, Command_1, Common_19, SMS_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Jobs_3.LoadJobs();
    var userAbonment = Corelib_22.bind.NamedScop.Get('UserAbonment');
    var GData;
    Common_19.GetVars(function (v) { GData = v; return false; });
    var Admin;
    (function (Admin) {
        var AdminPage = (function (_super) {
            __extends(AdminPage, _super);
            function AdminPage(app) {
                var _this = _super.call(this, app, 'Administration', 'Administration') || this;
                _this.factureHistory = new FactureHistory();
                _this.sfactureHistory = new SFactureHistory();
                _this.ca = _this.sfactureHistory;
                _this.cv = _this.factureHistory;
                return _this;
            }
            AdminPage.prototype.initialize = function () {
                var _this = this;
                _super.prototype.initialize.call(this);
                this.Caption = "";
                this.app.HideTopNavBar(true);
                UI_28.UI.Desktop.Current.KeyCombiner.On('O', 'T', function (s, e) {
                    this.app.HideTopNavBar(!this.app.IsTopNavBarhidden());
                }, void 0, this);
                UI_28.UI.Desktop.Current.KeyCombiner.On('O', 'S', function (s, e) {
                    if (this.initStat)
                        return;
                    this.initStat = true;
                    this.SetSeparator();
                    this.SetPanel(new Logins_1.RegularUsers());
                    this.SetPanel(new Logins_1.UnRegularUsers());
                    this.SetSeparator();
                    this.SetPanel(new Agents_1.Agents());
                    this.SetSeparator();
                }, void 0, this);
                this.createPanel(new ListOfFactures_1.AdminNavs.FacturesLivraison(), 'CJ')
                    .createPanel(this.factureHistory.Control, 'CB')
                    .createPanel(new Costumers_1.Clients(), 'CL')
                    .createPanel(new Revages_1.Etats(false), 'CE')
                    .createPanel()
                    .createPanel(new ListOfFactures_1.AdminNavs.FacturesReciption(), 'FJ')
                    .createPanel(this.sfactureHistory.Control, 'FB')
                    .createPanel(new Fournisseurs_1.Fournisseurs(), 'FL')
                    .createPanel(new Revages_1.Etats(true), 'FE')
                    .createPanel()
                    .createPanel(new Products_1.ProductsNav(), 'SP')
                    .createPanel(new Categories_1.CategoryNav(), 'SC')
                    .createPanel(new Command_1.views.Command(), 'SM')
                    .createPanel()
                    .createPanel(new Agents_1.StatisticsPanel())
                    .createPanel(new SMS_1.SMSPage())
                    .createPanel(new SMS_1.FilePage());
                Corelib_22.bind.Register({
                    Name: 'openafacture', OnInitialize: function (j, e) {
                        j.addEventListener('dblclick', 'dblclick', function (e) {
                            var f = j.Scop.Value;
                            _this.cv.Open(f);
                            _this.factureHistory.Show(f);
                            _this.Select(_this.factureHistory.Control.Name);
                        });
                    }
                });
                Corelib_22.bind.Register({
                    Name: 'openasfacture', OnInitialize: function (j, e) {
                        j.addEventListener('dblclick', 'dblclick', function (e) {
                            var f = j.Scop.Value;
                            _this.ca.Open(f);
                            _this.Select('facture_achat');
                        });
                    }
                });
                this.initAchatCmd();
                this.initVentsCmd();
                this.initVersmentCmd();
                this.initSVersmentCmd();
            };
            AdminPage.prototype.createPanel = function (n, shortcut) {
                if (n == undefined)
                    this.SetSeparator();
                else {
                    if (shortcut && shortcut.length == 2) {
                        shortcut = shortcut.toUpperCase();
                        UI_28.UI.Desktop.Current.KeyCombiner.On(shortcut[0], shortcut[1], this._select, this, n);
                        n.ToolTip = "CTRL+" + shortcut[0] + ", CTRL+" + shortcut[1];
                    }
                    this.SetPanel(n);
                }
                return this;
            };
            AdminPage.prototype._select = function (owner, e) {
                owner.Cancel = true;
                e.target.SelectedItem = e.Owner;
            };
            AdminPage.prototype.initAchatCmd = function () {
                var _this = this;
                Corelib_22.Api.RegisterApiCallback({
                    Name: 'OpenSFacture', DoApiCallback: function (j, e, p) {
                        _this.ca.Open(p.data);
                        _this.Select('facture_achat');
                    }, Owner: this
                });
                Corelib_22.Api.RegisterApiCallback({
                    Name: 'SaveSFacture', DoApiCallback: function (j, e, p) {
                        var d = p.data;
                        var apis = GData.apis.SFacture;
                        if (!apis.Check(d))
                            return;
                        apis.Save(p.data, undefined, function (data, isNew, error_data_notsuccess_iss) {
                            switch (error_data_notsuccess_iss) {
                                case Corelib_22.basic.DataStat.Success:
                                    UI_28.UI.InfoArea.push('The Facture <h1>Successfully</H1> Saved', true);
                                    break;
                                case Corelib_22.basic.DataStat.DataCheckError:
                                    UI_28.UI.InfoArea.push('Check your <h1 style="color:yellow">Data</h1>  of <h2 style="color:red">Facture</h2> <br> UnSaved', false);
                                    break;
                                default:
                                    UI_28.UI.InfoArea.push("UnExpected Error Occurred ", false);
                                    break;
                            }
                        });
                    }, Owner: this
                });
                Corelib_22.Api.RegisterApiCallback({
                    Name: 'DeleteSFacture', DoApiCallback: function (j, e, p) {
                        UI_28.UI.Modal.ShowDialog("Confirmation", "Do you want realy to delete this facture", function (xx) {
                            if (xx.Result === UI_28.UI.MessageResult.ok) {
                                var apis = GData.apis.SFacture;
                                apis.Delete(true, p.data, function (data, isNew, error_data_notsuccess_iss) {
                                    if (error_data_notsuccess_iss == Corelib_22.basic.DataStat.Success) {
                                        UI_28.UI.InfoArea.push('The Facture Successfully Deleted');
                                    }
                                    else
                                        UI_28.UI.InfoArea.push('An Error Happened When deleting The Facture');
                                });
                            }
                        }, "DELETE", 'CANCEL');
                    }, Owner: this
                });
                var sfm;
                Corelib_22.Api.RegisterApiCallback({
                    Name: 'NewSFacture', DoApiCallback: function (j, e, p) {
                        if (!sfm)
                            sfm = new Forms_4.Forms.InitSFacture();
                        var apis = GData.apis.SFacture;
                        var callback1 = function (data, success) {
                            p.callback && p.callback(p, data);
                            if (!success)
                                return;
                            GData.__data.SFactures.Add(data);
                            _this.ca.Open(data);
                            _this.Select('facture_achat');
                        };
                        sfm.Show(callback1);
                    }, Owner: this
                });
                Corelib_22.Api.RegisterApiCallback({
                    Name: 'UpdateSFacture', DoApiCallback: function (j, e, p) {
                        var t = p.data;
                        if (!t)
                            UI_28.UI.InfoArea.push("Please . Select one facture");
                        if (t.IsOpen) {
                            UI_28.UI.Modal.ShowDialog('Confirmation', "This Facture IsOpened .If You Update It You Will loss all changes data<br> Do you wand realy to Update it", function (xx) {
                                if (xx.Result === UI_28.UI.MessageResult.ok)
                                    GData.apis.SFacture.Update(t);
                            }, "Update");
                        }
                        else
                            GData.apis.SFacture.Update(t);
                    }, Owner: this
                });
                Corelib_22.Api.RegisterApiCallback({
                    Name: 'ValidateSFacture', DoApiCallback: function (j, e, p) {
                        var d = p.data;
                        var apis = GData.apis.SFacture;
                        if (!apis.Check(d))
                            return;
                        apis.Validate(p.data, undefined, function (data, isNew, error_data_notsuccess_iss) {
                            switch (error_data_notsuccess_iss) {
                                case Corelib_22.basic.DataStat.Success:
                                    UI_28.UI.InfoArea.push('The Facture <h1>Successfully</H1> Validated', true);
                                    break;
                                case Corelib_22.basic.DataStat.DataCheckError:
                                    UI_28.UI.InfoArea.push('Check your <h1 style="color:yellow">Data</h1>  of <h2 style="color:red">Facture</h2> <br> UnValidated', false);
                                    break;
                                default:
                                    UI_28.UI.InfoArea.push("UnExpected Error Occurred ", false);
                                    break;
                            }
                        });
                    }, Owner: this
                });
                Corelib_22.Api.RegisterApiCallback({
                    Name: 'PrintSFacture', DoApiCallback: function (j, e, p) {
                        var d = p.data;
                        var apis = GData.apis.SFacture;
                        if (!apis.Check(d))
                            return;
                        if (d.IsOpen)
                            UI_28.UI.InfoArea.push("We annot print The Facture While It's open");
                        else
                            apis.Print(p.data, function (data, isNew, error_data_notsuccess_iss) {
                                switch (error_data_notsuccess_iss) {
                                    case Corelib_22.basic.DataStat.Success:
                                        UI_28.UI.InfoArea.push('The Facture <h1> Is Printing Successfully</H1> Saved', true);
                                        break;
                                    default:
                                        UI_28.UI.InfoArea.push("UnExpected Error Occurred ", false);
                                        break;
                                }
                            });
                    }, Owner: this
                });
            };
            AdminPage.prototype.initVentsCmd = function () {
                var _this = this;
                Corelib_22.Api.RegisterApiCallback({
                    Name: 'OpenFacture', DoApiCallback: function (j, e, p) {
                        _this.cv.Open(p.data);
                        _this.factureHistory.Show(p.data);
                        _this.Select(_this.factureHistory.Control.Name);
                    }, Owner: this
                });
                Corelib_22.Api.RegisterApiCallback({
                    Name: 'SaveFacture', DoApiCallback: function (j, e, p) {
                        var d = p.data;
                        var apis = GData.apis.Facture;
                        if (!apis.Check(d))
                            return;
                        apis.Save(p.data, undefined, function (data, isNew, error_data_notsuccess_iss) {
                            switch (error_data_notsuccess_iss) {
                                case Corelib_22.basic.DataStat.Success:
                                    UI_28.UI.InfoArea.push('The Facture <h1>Successfully</H1> Saved', true);
                                    break;
                                case Corelib_22.basic.DataStat.DataCheckError:
                                    UI_28.UI.InfoArea.push('Check your <h1 style="color:yellow">Data</h1>  of <h2 style="color:red">Facture</h2> <br> UnSaved', false);
                                    break;
                                default:
                                    UI_28.UI.InfoArea.push("UnExpected Error Occurred ", false);
                                    break;
                            }
                        });
                    }, Owner: this
                });
                Corelib_22.Api.RegisterApiCallback({
                    Name: 'DeleteFacture', DoApiCallback: function (j, e, p) {
                        UI_28.UI.Modal.ShowDialog("Confirmation", "Do you want realy to delete this facture", function (xx) {
                            if (xx.Result == UI_28.UI.MessageResult.ok) {
                                var apis = GData.apis.Facture;
                                apis.Delete(true, p.data, function (data, isNew, error_data_notsuccess_iss) {
                                    if (error_data_notsuccess_iss == Corelib_22.basic.DataStat.Success) {
                                        UI_28.UI.InfoArea.push('The Facture Successfully Deleted');
                                    }
                                    else
                                        UI_28.UI.InfoArea.push('An Error Happened When deleting The Facture');
                                });
                            }
                        }, "DELETE", 'CANCEL');
                    }, Owner: this
                });
                var fm;
                Corelib_22.Api.RegisterApiCallback({
                    Name: 'NewFacture', DoApiCallback: function (j, e, p) {
                        var apis = GData.apis.Facture;
                        var callback1 = function (data, iss) {
                            if (!iss)
                                return;
                            GData.__data.Factures.Add(data);
                            p.callback && p.callback(p, data);
                            _this.cv.Open(data);
                            _this.Select('facture_vent');
                        };
                        if (!fm)
                            fm = new Forms_4.Forms.InitFacture();
                        fm.Show(callback1);
                    }, Owner: this
                });
                Corelib_22.Api.RegisterApiCallback({
                    Name: 'UpdateFacture', DoApiCallback: function (j, e, p) {
                        var t = p.data;
                        if (!t)
                            UI_28.UI.InfoArea.push("Please . Select one facture");
                        if (t.IsOpen) {
                            UI_28.UI.Modal.ShowDialog('Confirmation', "This Facture IsOpened .If You Update It You Will loss all changes data<br> Do you wand realy to Update it", function (xx) {
                                if (xx.Result == UI_28.UI.MessageResult.ok)
                                    GData.apis.Facture.Update(t);
                            }, "Update");
                        }
                        else
                            GData.apis.Facture.Update(t);
                    }, Owner: this
                });
                Corelib_22.Api.RegisterApiCallback({
                    Name: 'ValidateFacture', DoApiCallback: function (j, e, p) {
                        var d = p.data;
                        var apis = GData.apis.Facture;
                        if (!apis.Check(d))
                            return;
                        apis.Validate(p.data, undefined, function (data, isNew, error_data_notsuccess_iss) {
                            switch (error_data_notsuccess_iss) {
                                case Corelib_22.basic.DataStat.Success:
                                    UI_28.UI.InfoArea.push('The Facture <h1>Successfully</H1> Validated', true);
                                    break;
                                case Corelib_22.basic.DataStat.DataCheckError:
                                    UI_28.UI.InfoArea.push('Check your <h1 style="color:yellow">Data</h1>  of <h2 style="color:red">Facture</h2> <br> UnValidated', false);
                                    break;
                                default:
                                    UI_28.UI.InfoArea.push("UnExpected Error Occurred ", false);
                                    break;
                            }
                        });
                    }, Owner: this
                });
                Corelib_22.Api.RegisterApiCallback({
                    Name: 'PrintFacture', DoApiCallback: function (j, e, p) {
                        var d = p.data;
                        var apis = GData.apis.Facture;
                        if (d.IsOpen)
                            UI_28.UI.InfoArea.push("We annot print The Facture While It's open");
                        else
                            apis.Print(p.data, function (data, isNew, error_data_notsuccess_iss) {
                                switch (error_data_notsuccess_iss) {
                                    case Corelib_22.basic.DataStat.Success:
                                        UI_28.UI.InfoArea.push('The Facture <h1> Is Printing Successfully</H1> Saved', true);
                                        break;
                                    default:
                                        UI_28.UI.InfoArea.push("UnExpected Error Occurred ", false);
                                        break;
                                }
                            });
                    }, Owner: this
                });
            };
            AdminPage.prototype.initVersmentCmd = function () {
                Corelib_22.Api.RegisterApiCallback({
                    Name: 'OpenVersment', DoApiCallback: function (j, e, p) {
                        GData.apis.Versment.Edit(p.data);
                    }, Owner: this
                });
                Corelib_22.Api.RegisterApiCallback({
                    Name: 'DeleteVersment', DoApiCallback: function (j, e, p) {
                        GData.apis.Versment.Delete(p.data);
                    }, Owner: this
                });
                Corelib_22.Api.RegisterApiCallback({
                    Name: 'NewVersment', DoApiCallback: function (j, e, p) {
                        GData.apis.Versment.New(function (e) {
                            var data = e.Data;
                            if (!p || !p.data) {
                                GData.apis.Client.Select(function (e) {
                                    var item = e.Data;
                                    if (item && e.Error === Corelib_22.basic.DataStat.Success) {
                                        data.Client = item;
                                        GData.apis.Versment.Edit(data);
                                    }
                                }, null);
                            }
                            else {
                                data.Client = p.data;
                                GData.apis.Versment.Edit(data, function (e) { if (p.callback)
                                    p.callback(p, e.Data); });
                            }
                        });
                    }, Owner: this
                });
                Corelib_22.Api.RegisterApiCallback({
                    Name: 'UpdateVersments', DoApiCallback: function (j, e, p) {
                        GData.apis.Versment.Update(p.data);
                    }, Owner: this
                });
            };
            AdminPage.prototype.initSVersmentCmd = function () {
                Corelib_22.Api.RegisterApiCallback({
                    Name: 'OpenSVersment', DoApiCallback: function (j, e, p) {
                        GData.apis.SVersment.Edit(p.data);
                    }, Owner: this
                });
                Corelib_22.Api.RegisterApiCallback({
                    Name: 'DeleteSVersment', DoApiCallback: function (j, e, p) {
                        GData.apis.SVersment.Delete(p.data);
                    }, Owner: this
                });
                Corelib_22.Api.RegisterApiCallback({
                    Name: 'NewSVersment', DoApiCallback: function (j, e, p) {
                        GData.apis.SVersment.New(function (e) {
                            var data = e.Data;
                            data.Fournisseur = p.data;
                            GData.apis.SVersment.Edit(data);
                        });
                    }, Owner: this
                });
                Corelib_22.Api.RegisterApiCallback({
                    Name: 'UpdateSVersments', DoApiCallback: function (j, e, p) {
                        GData.apis.SVersment.Update(p.data);
                    }, Owner: this
                });
            };
            AdminPage.prototype.OnKeyDown = function (e) {
                if (e.keyCode == 112)
                    UI_28.UI.showSPTooltips(!Corelib_22.basic.Settings.get('show-sp-tooltips'));
                else
                    return _super.prototype.OnKeyDown.call(this, e);
                return true;
            };
            return AdminPage;
        }(UI_28.UI.NavPage));
        Admin.AdminPage = AdminPage;
        var Test = (function () {
            function Test() {
            }
            Test.initialize = function () {
                return new UI_28.UI.TabControl("TabControl", "Tab Control", [
                    { Title: "Fournisseurs", Content: new Fournisseurs_1.Fournisseurs() },
                    { Title: "Clients", Content: new Costumers_1.Clients() },
                    { Title: "Products", Content: new Products_1.ProductsNav() },
                ]);
            };
            Test.initialize1 = function () {
                var c = new Facture_1.FactureVent();
                var x = new Corelib_22.collection.TransList(UI_28.UI.TabControlItem, new Converter(), null);
                x.Source = GData.__data.Factures;
                var sx = new UI_28.UI.UniTabControl("UniTabControl", "UniTab Control", x, c, function (utc, cnt, selctd) { var d = selctd.Content; c.Open(d); return selctd.Title = (d.Client && (d.Client.Name || d.Client.FullName) || d.Ref); });
            };
            return Test;
        }());
        Admin.Test = Test;
        var Converter = (function () {
            function Converter() {
            }
            Converter.prototype.ConvertA2B = function (sender, index, a, d) {
                return new UI_28.UI.TabControlItem((d.Client && (d.Client.Name || d.Client.FullName) || d.Ref), a);
            };
            Converter.prototype.ConvertB2A = function (sender, index, b, d) {
                return b.Content;
            };
            return Converter;
        }());
        var FactureHistory = (function () {
            function FactureHistory() {
                var _this = this;
                this.History = new Corelib_22.collection.List(Models_34.models.Facture);
                this.factureView = new Facture_1.FactureVent();
                this.transList = new Corelib_22.collection.TransList(Object, new Converter(), this);
                this.transList.Source = this.History;
                this.tabControl = new UI_28.UI.UniTabControl("facture_vent", "Bon Livraison", this.transList, this.factureView, this.OnItemSelected);
                this.tabControl.OnInitialized = function (n) { return _this.OnLoad(); };
                this.tabControl.OnTabClosed.Add(function (e) {
                    var f = e.Target.Content;
                    if (e.Stat == "closing" && f.IsOpen) {
                        UI_28.UI.InfoArea.push("La facture " + f.Ref + " est ouvert. fermez la d'abord");
                        e.Cancel = true;
                    }
                });
            }
            FactureHistory.prototype.translator = function (sender, i, d, objectStat) {
                return new UI_28.UI.TabControlItem((d.Client && (d.Client.Name || d.Client.FullName) || d.Ref), d);
            };
            FactureHistory.prototype.OnhistoryChanged = function () {
                Corelib_22.basic.Settings.set('opened_factures', this.History.AsList().map(function (v) { return v.Id; }));
            };
            FactureHistory.prototype.OnLoad = function () {
                var _this = this;
                var dt = GData.__data.Factures;
                var v = Corelib_22.basic.Settings.get('opened_factures');
                var pt = this.tabControl.SelectedItem;
                if (v instanceof Array) {
                    for (var i = 0; i < v.length; i++) {
                        var f = dt.GetById(v[i]);
                        if (f && this.History.IndexOf(f) == -1)
                            this.History.Add(f);
                    }
                }
                var id = Corelib_22.basic.Settings.get('opened_facture');
                if (id && pt == null) {
                    var c = dt.GetById(id);
                    if (c && this.History.IndexOf(c) == -1)
                        return;
                    this.Show(c);
                }
                this.reloadTitles();
                this.History.Listen = function (n) { return _this.OnhistoryChanged(); };
            };
            FactureHistory.prototype.reloadTitles = function () {
                var l = this.transList.AsList();
                var o = this.History.AsList();
                if (o && l)
                    for (var i = 0; i < l.length; i++) {
                        var d = o[i];
                        if (!d)
                            continue;
                        l[i].Title = (d.Client && (d.Client.Name || d.Client.FullName) || d.Ref);
                    }
                this.transList.Get(0);
            };
            FactureHistory.prototype.OnItemSelected = function (sndr, cnt, selectedItem) {
                var d = selectedItem && selectedItem.Content;
                cnt.Open(d);
                Corelib_22.basic.Settings.set('opened_facture', d.Id && d.Id);
                return selectedItem.Title = (d.Client && (d.Client.Name || d.Client.FullName) || d.Ref);
            };
            FactureHistory.prototype.Show = function (fact) {
                var _this = this;
                var i = this.History.IndexOf(fact);
                if (i === -1) {
                    this.History.Add(fact);
                    i = this.History.Count - 1;
                }
                if (this.tabControl.IsInit)
                    this.tabControl.SelectedItem = this.transList.Get(i);
                else
                    this.tabControl.OnInitialized = function (n) { return n.SelectedItem = _this.transList.Get(i); };
            };
            Object.defineProperty(FactureHistory.prototype, "Control", {
                get: function () { return this.tabControl; },
                enumerable: true,
                configurable: true
            });
            FactureHistory.prototype.Open = function (fact) {
                this.Show(fact);
            };
            return FactureHistory;
        }());
        var SFactureHistory = (function () {
            function SFactureHistory() {
                var _this = this;
                this.History = new Corelib_22.collection.List(Models_34.models.SFacture);
                this.factureView = new Facture_1.FactureAchat();
                this.transList = new Corelib_22.collection.TransList(Object, new Converter(), this);
                this.transList.Source = this.History;
                this.tabControl = new UI_28.UI.UniTabControl("facture_achat", "Bon Réception", this.transList, this.factureView, this.OnItemSelected);
                this.tabControl.OnInitialized = function (n) { return _this.OnLoad(); };
                this.tabControl.OnTabClosed.Add(function (e) {
                    var f = e.Target.Content;
                    if (e.Stat == "closing" && f.IsOpen) {
                        UI_28.UI.InfoArea.push("La facture " + f.Ref + " est ouvert. fermez la d'abord");
                        e.Cancel = true;
                    }
                });
            }
            SFactureHistory.prototype.translator = function (sender, i, d, objectStat) {
                return new UI_28.UI.TabControlItem((d.Fournisseur && (d.Fournisseur.Name || d.Fournisseur.Tel) || d.Ref), d);
            };
            SFactureHistory.prototype.OnhistoryChanged = function () {
                Corelib_22.basic.Settings.set('opened_sfactures', this.History.AsList().map(function (v) { return v.Id; }));
            };
            SFactureHistory.prototype.OnLoad = function () {
                var _this = this;
                var dt = GData.__data.SFactures;
                var v = Corelib_22.basic.Settings.get('opened_sfactures');
                var pt = this.tabControl.SelectedItem;
                if (v instanceof Array) {
                    for (var i = 0; i < v.length; i++) {
                        var f = dt.GetById(v[i]);
                        if (f && this.History.IndexOf(f) == -1)
                            this.History.Add(f);
                    }
                }
                var id = Corelib_22.basic.Settings.get('opened_sfacture');
                if (id && pt) {
                    var c = dt.GetById(id);
                    if (c && this.History.IndexOf(c) == -1)
                        return;
                    this.Show(c);
                }
                this.reloadTitles();
                this.History.Listen = function (n) { return _this.OnhistoryChanged(); };
            };
            SFactureHistory.prototype.reloadTitles = function () {
                var l = this.transList.AsList();
                var o = this.History.AsList();
                if (o && l)
                    for (var i = 0; i < l.length; i++) {
                        var d = o[i];
                        if (!d)
                            continue;
                        l[i].Title = (d.Fournisseur && (d.Fournisseur.Name || d.Fournisseur.Tel) || d.Ref);
                    }
                this.transList.Get(0);
            };
            SFactureHistory.prototype.OnItemSelected = function (sndr, cnt, selectedItem) {
                var d = selectedItem && selectedItem.Content;
                cnt.Open(d);
                Corelib_22.basic.Settings.set('opened_sfacture', d.Id && d.Id);
                return selectedItem.Title = (d.Fournisseur && (d.Fournisseur.Name || d.Fournisseur.Tel) || d.Ref);
            };
            SFactureHistory.prototype.Open = function (fact) {
                this.Show(fact);
            };
            SFactureHistory.prototype.Show = function (fact) {
                var i = this.History.IndexOf(fact);
                if (i === -1) {
                    this.History.Add(fact);
                    i = this.History.Count - 1;
                }
                if (this.tabControl.IsInit)
                    this.tabControl.SelectedItem = this.transList.Get(i);
                else {
                    var c = this.transList.Get(i);
                    this.tabControl.OnInitialized = function (n) { return n.SelectedItem = c; };
                }
            };
            Object.defineProperty(SFactureHistory.prototype, "Control", {
                get: function () { return this.tabControl; },
                enumerable: true,
                configurable: true
            });
            return SFactureHistory;
        }());
    })(Admin = exports.Admin || (exports.Admin = {}));
});
define("Desktop/Pages", ["require", "exports", "../lib/q/sys/UI", "../lib/q/sys/Corelib", "abstract/extra/Common", "../lib/q/sys/Filters", "Desktop/Services/QServices", "abstract/extra/Basics", "Desktop/Search"], function (require, exports, UI_29, Corelib_23, Common_20, Filters_10, QServices_2, Basics_14, Search_9) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var key;
    var event = new Corelib_23.bind.EventListener(key = Math.random() * 2099837662);
    var chooseClient;
    var GData;
    Common_20.GetVars(function (v) {
        GData = v;
        return false;
    });
    var Pages;
    (function (Pages) {
        var SearchPage = (function (_super) {
            __extends(SearchPage, _super);
            function SearchPage(app) {
                var _this = _super.call(this, app, 'Recherche', 'Search') || this;
                _this.fs = new QServices_2.Services.SearchServices();
                return _this;
            }
            SearchPage.prototype.getSuggessions = function () { return GData.__data.Products; };
            SearchPage.prototype.initialize = function () {
                var _this = this;
                _super.prototype.initialize.call(this);
                this.paginator = new UI_29.UI.Paginator(3 * 4 * 5);
                this.paginator.OnInitialized = function (p) {
                    (_this.pstore = new UI_29.UI.ListAdapter('Products.card', window.outerWidth < 768 ? 'Product.DynCard1' : 'Product.card')).OnInitialized = function (l) {
                        l.Source =
                            _this.paginationList = Corelib_23.collection.ExList.New(_this.searchList = Corelib_23.collection.ExList.New(GData.__data.Products, new Filters_10.filters.list.StringFilter()), _this.paginator.Filter);
                        _this.paginator.BindMaxToSourceCount(_this.searchList);
                    };
                    _this.paginator.Content = _this.pstore;
                };
                this.Add(this.paginator);
            };
            SearchPage.prototype.OnKeyDown = function (e) {
                var _this = this;
                switch (e.keyCode) {
                    case UI_29.UI.Keys.Left:
                        if (e.ctrlKey)
                            this.paginator.Previous();
                        else {
                            this.pstore.SelectedIndex--;
                            return true;
                        }
                        break;
                    case UI_29.UI.Keys.Right:
                        if (e.ctrlKey)
                            this.paginator.Next();
                        else {
                            this.pstore.SelectedIndex++;
                            return true;
                        }
                        break;
                    case UI_29.UI.Keys.Home:
                        if (e.ctrlKey) {
                            this.paginator.paginator.Index = 0;
                            break;
                        }
                        return _super.prototype.OnKeyDown.call(this, e);
                    case UI_29.UI.Keys.End:
                        if (e.ctrlKey) {
                            this.paginator.paginator.Index = 1e6;
                            break;
                        }
                        return _super.prototype.OnKeyDown.call(this, e);
                    case UI_29.UI.Keys.Enter:
                        UI_29.UI.InfoArea.push("L'option n'est pas disponiple en Verssion  d'essayer");
                        return true;
                    default:
                        return _super.prototype.OnKeyDown.call(this, e);
                }
                Corelib_23.UIDispatcher.OnIdle(function () { _this.pstore.SelectedIndex = 0; });
                e.preventDefault();
                e.stopImmediatePropagation();
                return true;
            };
            SearchPage.prototype.OnSearche = function (o, n) {
                this.HasSearch;
                this.searchList.Filter.Patent = new Filters_10.filters.list.StringPatent(n);
            };
            Object.defineProperty(SearchPage.prototype, "HasSearch", {
                get: function () { return UI_29.UI.SearchActionMode.Instantany; },
                enumerable: true,
                configurable: true
            });
            SearchPage.prototype.GetLeftBar = function () {
                return null;
            };
            SearchPage.prototype.Update = function () {
                GData.apis.Product.SmartUpdate();
            };
            SearchPage.prototype.Callback = function (args) {
            };
            SearchPage.prototype.Handled = function () {
                return true;
            };
            SearchPage.prototype.OnDeepSearche = function () {
                var _this = this;
                if (!this._deepSearch)
                    this._deepSearch = new Search_9.SearchData.Product();
                this._deepSearch.Open(function (x) {
                    var c = _this.searchList.Filter;
                    var t = c == _this._deepSearch;
                    _this.searchList.Filter = _this._deepSearch;
                    if (t)
                        _this.searchList.Reset();
                });
            };
            return SearchPage;
        }(UI_29.UI.Page));
        Pages.SearchPage = SearchPage;
    })(Pages = exports.Pages || (exports.Pages = {}));
    function Open(si, edit) {
        if (si == null)
            return UI_29.UI.InfoArea.push("There no Facture to Open", false);
        GData.spin.Start("The Facture Is Loading");
        if (edit && !si.Validator)
            si.IsOpen = true;
        GData.apis.Facture.LoadArticlesOf(si, function (d, v, k) {
            if (k == Basics_14.basics.DataStat.Success) {
                GData.__data.SelectedFacture = null;
                GData.__data.SelectedFacture = si;
                UI_29.UI.App.CurrentApp.OpenPage('Search');
            }
            else
                UI_29.UI.InfoArea.push("An Expected Error Happened When Trying Open Facture");
            GData.spin.Pause();
        });
    }
});
define("Desktop/Apps", ["require", "exports", "../lib/Q/sys/Corelib", "../lib/q/sys/UI", "../lib/q/sys/System", "abstract/Models", "abstract/extra/Common", "Desktop/AdminPage", "Desktop/Pages", "abstract/QShopApis", "abstract/extra/Common", "abstract/Services", "Apps/Login", "../lib/Q/sys/db", "abstract/extra/ShopApis"], function (require, exports, Corelib_24, UI_30, System_12, Models_35, Common_21, AdminPage_1, Pages_1, QShopApis_1, Common_22, Services_3, Login_1, db_2, ShopApis_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GData;
    QShopApis_1.Apis.Load();
    Common_22.InitModule();
    Common_21.GetVars(function (v) { GData = v; return !true; });
    var Apps;
    (function (Apps) {
        var QShop = (function (_super) {
            __extends(QShop, _super);
            function QShop() {
                var _this = _super.call(this, 'QShop') || this;
                Corelib_24.Api.RegisterApiCallback({
                    Name: "Settings", DoApiCallback: function (a, b, c) {
                        UI_30.UI.Modal.ShowDialog("Settings", 'Do you want realy to make backup to this Shop', function (e) {
                            { }
                            if (e.Result == UI_30.UI.MessageResult.ok) {
                                GData.requester.Request(Window, "START");
                                setTimeout(function () {
                                    GData.requester.Request(Window, "BACKUP");
                                    setTimeout(function () { c.callback && c.callback(c, _this); }, 6000);
                                }, 5000);
                            }
                            else
                                c.callback && c.callback(c, _this);
                        }, "Backup", "Cancel");
                    }
                });
                if (!envirenment.isChromeApp)
                    window.addEventListener('beforeunload', window.onbeforeunload = function (e) {
                        return "Merci de ne pas quitter la page!";
                    }, { capture: true, passive: true });
                return _this;
            }
            QShop.prototype.Update = function () {
                this.SelectedPage.Update();
            };
            QShop.prototype.initialize = function () {
                var _this = this;
                _super.prototype.initialize.call(this);
                this.Add(this.Search = new Pages_1.Pages.SearchPage(this));
                this.Head.Header.Brand.addEventListener('click', function (s, e, p) {
                    Corelib_24.Api.RiseApi("ReAuth", {
                        callback: function (p, arg) {
                            {
                            }
                        }, data: _this
                    });
                }, this);
                var adminPage;
                GData.user.OnMessage(function (s, e) {
                    isLogged(e._new);
                });
                if (GData.user.IsLogged)
                    isLogged(true);
                else
                    isLogged(false);
                var t = this;
                var thread;
                var self = this;
                function isLogged(value) {
                    if (value) {
                        if (AdminPage_1.Admin && AdminPage_1.Admin.AdminPage) {
                            GData.requester.Push(Models_35.models.IsAdmin, new Models_35.models.IsAdmin(), null, function (s, r, iss) {
                                var page = Corelib_24.basic.Settings.get('selectedPage');
                                var toSelect;
                                if (iss) {
                                    if (!adminPage) {
                                        t.Add(adminPage = new AdminPage_1.Admin.AdminPage(t));
                                        toSelect = adminPage;
                                        toSelect = adminPage;
                                    }
                                }
                                else {
                                    if (adminPage != null) {
                                        t.Remove(adminPage);
                                    }
                                }
                                if (!self.OpenPage(page))
                                    self.SelectedPage = toSelect;
                            });
                        }
                        else {
                        }
                    }
                    else
                        clearInterval(thread);
                }
                this.OnPropertyChanged(UI_30.UI.Layout.DPSelectedPage, function (v, e) {
                    if (e._new)
                        Corelib_24.basic.Settings.set('selectedPage', e._new.Name);
                });
                Corelib_24.Notification.on("UserSetting.selectedPageChanged", {
                    callback: function (e, a, dp) {
                        this.OpenPage(dp._new);
                    }, owner: this
                });
                Window['Ntf'] = Corelib_24.Notification;
            };
            return QShop;
        }(UI_30.UI.App));
        Apps.QShop = QShop;
    })(Apps || (Apps = {}));
    var Init;
    (function (Init) {
        function Main(desk) {
            var qshop = new Apps.QShop();
            var auth = new Login_1.Apps.AuthentificationApp(qshop);
            desk.Add(auth);
            desk.Add(qshop);
            Corelib_24.thread.Dispatcher.call(auth, qshop.Show);
        }
        Init.Main = Main;
    })(Init = exports.Init || (exports.Init = {}));
    var updateServiceCallback;
    (function (updateServiceCallback) {
        Services_3.eServices.registerUpdater({
            ops: [],
            Name: 'products',
            del: function (id) {
                var p = Models_35.models.Product.getById(id) || GData.__data.Products.GetById(id);
                Models_35.models.Product.pStore.Remove(id);
                if (p) {
                    GData.__data.Products.Remove(p);
                    if (typeof __LOCALSAVE__ !== 'undefined')
                        this.ops.push({ op: db_2.db.Operation.Delete, row: p });
                }
            },
            edit: function (id, json, c) {
                var p = Models_35.models.Product.getById(id) || GData.__data.Products.GetById(id);
                if (p) {
                    p.Stat = System_12.sdata.DataStat.Updating;
                    p.FromJson(json, Corelib_24.encoding.SerializationContext.GlobalContext, true);
                    p.Stat = System_12.sdata.DataStat.Updated;
                    if (typeof __LOCALSAVE__ !== 'undefined')
                        this.ops.push({ op: db_2.db.Operation.Update, row: p });
                }
                else {
                    p = new Models_35.models.Product(id);
                    p.FromJson(json, c);
                    GData.__data.Products.Add(p);
                    if (typeof __LOCALSAVE__ !== 'undefined')
                        this.ops.push({ op: db_2.db.Operation.Insert, row: p });
                }
            },
            onfinish: function (json) {
                var _this = this;
                if (typeof __LOCALSAVE__ !== 'undefined') {
                    GData.db.Get('Products').table.ExecuteOperations(this.ops, function (scc, nfails) {
                        if (scc) {
                            GData.db.MakeUpdate('Products', _this.date);
                        }
                    });
                }
            }, onstart: function (json) {
                this.date = json && json.date && new Date(json.date) || new Date(0);
            }, add: function (id, json) {
            }
        });
        var updater = (function () {
            function updater(table, Name) {
                this.table = table;
                this.Name = Name;
            }
            updater.prototype.del = function (id) {
                var d = System_12.sdata.DataRow.getById(id, this.table.ArgType) || this.table.GetById(id);
                if (d) {
                    this.table.Remove(d);
                    d.Dispose();
                }
            };
            updater.prototype.edit = function (id, json, context) {
                var d = System_12.sdata.DataRow.getById(id, this.table.ArgType) || this.table.GetById(id);
                if (d) {
                    d.Stat = System_12.sdata.DataStat.Updating;
                    d.FromJson(json, context, true);
                    d.Stat = System_12.sdata.DataStat.Updated;
                }
                else {
                    d = this.table.CreateNewItem(id);
                    d.FromJson(json, context, false);
                    this.table.Add(d);
                }
            };
            return updater;
        }());
        updateServiceCallback.updater = updater;
        Services_3.eServices.registerUpdater(new updater(GData.__data.Costumers, 'clients'));
        Services_3.eServices.registerUpdater(new updater(GData.__data.Agents, 'agents'));
        Services_3.eServices.registerUpdater(new updater(GData.__data.Factures, 'factures'));
        Services_3.eServices.registerUpdater(new updater(GData.__data.SFactures, 'sfactures'));
        Services_3.eServices.registerUpdater(new updater(GData.__data.Categories, 'categories'));
        Services_3.eServices.registerUpdater(new updater(GData.__data.Fournisseurs, 'fournisseurs'));
    })(updateServiceCallback || (updateServiceCallback = {}));
    Corelib_24.Api.RegisterApiCallback({
        Name: "log", DoApiCallback: function (a) {
            var t = document.location.pathname;
            if (t.lastIndexOf('/') != t.length - 1)
                t += "/";
            console.log("%c" + "", "color:White; background:url('" + (document.location.origin + t) + "_/Picture/logo');");
        }
    });
    function initApis() {
        var sapi = new ShopApis_2.ShopApis();
        sapi.Init(GData);
        GData.requester.Get(Corelib_24.basic.iGuid, [], null, function (s, r, iss) { });
        GData.requester.Get(Corelib_24.basic.SessionId, {}, null, function (s, r, iss) { Corelib_24.basic.SessionId.parse(r); });
        Corelib_24.Api.RegisterTrigger({
            Name: 'AddPrice',
            Filter: function (x, params) {
                return false;
            },
            CheckAccess: function (o) { return true; },
            Params: null
        });
        Corelib_24.Api.RegisterApiCallback({ DoApiCallback: function (x, p) { return true; }, Name: 'AddPrice' });
        Corelib_24.Api.RegisterApiCallback({ DoApiCallback: function (x, p) { return true; }, Name: 'RemovePrice' });
        Corelib_24.Api.RegisterTrigger({
            Name: 'RemovePrice',
            Filter: function (x, params) {
                return false;
            },
            CheckAccess: function (o) { return true; },
            Params: null
        });
    }
    initApis();
});
define("Desktop/ModelsViews", ["require", "exports", "../lib/q/sys/Corelib", "abstract/Models", "../lib/q/sys/UI", "template|../assets/templates/Templates.html", "template|../assets/templates/AdminTemplates.html"], function (require, exports, Corelib_25, Models_36, UI_31, tmp, tmp1) {
    "use strict";
    var _this = this;
    Object.defineProperty(exports, "__esModule", { value: true });
    ValidateImport(tmp, tmp1);
    var init = Corelib_25.mvc.Initializer.Instances;
    var _system = init.System;
    function Init() {
        init.getDescriptor('Article', Models_36.models.Article).Add(new Article());
        init.getDescriptor('Article', Models_36.models.Article).Add(new Article()).Add(new OArticle());
        init.getDescriptor('RegUser', Models_36.models.Login).Add(new RegUser());
        init.getDescriptor('UnRegUser', Models_36.models.Login).Add(new UnRegUser());
        init.getDescriptor('Factures', Models_36.models.Factures).Add(new FactureRow());
        init.getDescriptor('Mail', Models_36.models.Mail).Add(new Mail());
        init.getDescriptor('Product', Models_36.models.Product).Add(new Product());
        init.getDescriptor('Category', Models_36.models.Category).Add(new Category());
        init.getDescriptor('Price', Models_36.models.FakePrice).Add(new FakePricePrices());
        init.getDescriptor('FProduct', Models_36.models.FakePrice).Add(new FakePrice());
        init.getDescriptor('SFacture', Models_36.models.SFacture).Add(new SFactureRow());
        init.getDescriptor('Agents', Models_36.models.Agents).Add(new Agents());
    }
    exports.Init = Init;
    function crt(_dom, dbbind, dbbjob, dbtwoway, attributes, styles, child) {
        var dom;
        if (typeof _dom === 'string')
            dom = document.createElement(_dom);
        else
            dom = _dom;
        if (dbbind)
            dom.setAttribute('db-bind', dbbind);
        if (dbbjob)
            dom.setAttribute('db-job', dbbjob);
        if (dbtwoway != undefined)
            dom.setAttribute('db-twoway', dbtwoway);
        if (attributes)
            for (var i_1 in attributes)
                dom.setAttribute(i_1, attributes[i_1]);
        if (styles)
            for (var i in styles)
                dom.style[i] = styles[i];
        if (child)
            for (var i_2 = 0; i_2 < child.length; i_2++)
                dom.appendChild(child[i_2]);
        return dom;
    }
    var d;
    Corelib_25.bind.Register({
        Name: 'checkok', OnInitialize: (d = function (j, i) {
            if (j.Scop.Value)
                j.dom.classList.add('glyphicon', 'glyphicon-ok');
            else
                j.dom.classList.remove('glyphicon-ok');
        }), Todo: d
    });
    Corelib_25.bind.Register({
        Name: 'openmail', OnInitialize: (d = function (j, i) {
            j.addEventListener('onclick', 'dblclick', {
                handleEvent: function (e) {
                    var t = j.Scop.Value;
                    if (t) {
                        UI_31.UI.Modal.ShowDialog(t.Subject, t.Body, undefined, "Close", null);
                    }
                }, Owner: _this
            });
        }), Todo: d
    });
    Corelib_25.bind.Register({
        Name: 'tostring', OnInitialize: (d = function (ji, i) {
            var b = ji.Scop.Value || '';
            if (typeof b !== 'string')
                b = (b && b.toString()) || '';
            if (b.length > 45)
                b = b.substring(0, 45) + '...';
            ji.dom.textContent = b;
        }), Todo: d
    });
    var Article = (function (_super) {
        __extends(Article, _super);
        function Article() {
            var _this = _super.call(this, 'cart') || this;
            var t = document.createElement('tr');
            var th = document.createElement('td');
            t.setAttribute('scope', 'row');
            var an = crt(document.createElement('td'), 'Product.Name', 'label');
            var qt = crt(document.createElement('td'), 'Count', 'label');
            var pr = crt(document.createElement('td'), 'Price', 'price');
            var cn = document.createElement('td');
            cn.innerHTML = '<h4 class="pull-right activeShadow glyphicon glyphicon-open" style="margin-left:5px;margin-right:5px" db-job="art-add"></h4><h4 class="pull-right activeShadow glyphicon glyphicon-plus-sign" style="margin-left:5px;margin-right:5px" db-job="art-plus"></h4>    <h4 class="pull-right glyphicon fa-book glyphicon-minus-sign" style="margin-left: 5px; margin-right: 5px" db-job="art-minus"></h4>    <h4 class="pull-right glyphicon fa-book glyphicon-remove-circle" style="margin-left: 5px; margin-right: 5px" db-job="art-remove"></h4><span db-job="showIf" db-bind="$modify" />';
            cn.style.maxWidth = '100px';
            t.appendChild(th);
            t.appendChild(an);
            t.appendChild(qt);
            t.appendChild(pr);
            t.appendChild(cn);
            _this._Shadow = t;
            return _this;
        }
        Article.prototype.Create = function () {
            return this._Shadow.cloneNode(true);
        };
        return Article;
    }(Corelib_25.mvc.ITemplate));
    var RegUser = (function (_super) {
        __extends(RegUser, _super);
        function RegUser() {
            var _this = _super.call(this, 'row') || this;
            var t = document.createElement('tr');
            t.setAttribute('scope', 'row');
            var vu;
            var cols = [
                crt(document.createElement('td'), 'Username', 'label', false),
                crt(document.createElement('td'), 'Client.FullName', 'label', false),
                crt(document.createElement('td'), 'Client.Tel', 'label', false),
                crt(document.createElement('td'), 'Client.Email', 'label', false),
                crt(document.createElement('td'), 'Client.Job', 'label', false),
                crt(vu = document.createElement('td'), undefined, undefined),
            ];
            vu.innerHTML =
                '<span class="pull-right activeShadow glyphicon glyphicon-check" style="margin-left:5px;margin-right:5px" db-job="validateuser"></span>' +
                    '<span class="pull-right glyphicon glyphicon-fire" style="margin-left: 5px; margin-right: 5px" db-job="removeuser"></span>';
            for (var i = 0; i < cols.length; i++)
                t.appendChild(cols[i]);
            _this._Shadow = t;
            return _this;
        }
        RegUser.prototype.Create = function () {
            return this._Shadow.cloneNode(true);
        };
        return RegUser;
    }(Corelib_25.mvc.ITemplate));
    var UnRegUser = (function (_super) {
        __extends(UnRegUser, _super);
        function UnRegUser() {
            var _this = _super.call(this, 'row') || this;
            var t = document.createElement('tr');
            t.setAttribute('scope', 'row');
            var vu;
            var cols = [
                crt(document.createElement('td'), 'Username', 'label', false),
                crt(document.createElement('td'), 'Client.FullName', 'label', false),
                crt(document.createElement('td'), 'Client.Tel', 'label', false),
                crt(document.createElement('td'), 'Client.Email', 'label', false),
                crt(document.createElement('td'), 'Client.Job', 'label', false),
                crt(vu = document.createElement('td'), undefined, undefined),
            ];
            vu.innerHTML =
                '<span class="pull-right activeShadow glyphicon glyphicon-lock" style="margin-left:5px;margin-right:5px" db-job="lockuser"></span>' +
                    '<span class="pull-right glyphicon glyphicon-fire" style="margin-left: 5px; margin-right: 5px" db-job="removeuser"></span>';
            vu.style.maxWidth = "auto";
            for (var i = 0; i < cols.length; i++)
                t.appendChild(cols[i]);
            _this._Shadow = t;
            return _this;
        }
        UnRegUser.prototype.Create = function () {
            return this._Shadow.cloneNode(true);
        };
        return UnRegUser;
    }(Corelib_25.mvc.ITemplate));
    var Mail = (function (_super) {
        __extends(Mail, _super);
        function Mail() {
            var _this = _super.call(this, 'row') || this;
            var t = crt(document.createElement('tr'), undefined, 'openmail', false);
            t.setAttribute('scope', 'row');
            var vu;
            var t1 = document.createElement('td');
            t1.appendChild(crt(document.createElement('span'), 'Visited', 'checkok', false));
            var cols = [
                t1,
                crt(document.createElement('td'), 'From.FullName', 'label', false),
                crt(document.createElement('td'), 'To', 'label', false),
                crt(document.createElement('td'), 'Subject', 'label', false),
                crt(document.createElement('td'), 'Body', 'tostring', false),
                crt(document.createElement('td'), 'TargetId', 'label', false),
                crt(vu = document.createElement('td'), undefined, undefined),
            ];
            vu.innerHTML =
                '<span class="pull-right activeShadow glyphicon glyphicon-lock" style="margin-left:5px;margin-right:5px" db-job="mailvisite"></span>' +
                    '<span class="pull-right glyphicon glyphicon-fire" style="margin-left: 5px; margin-right: 5px" db-job="maildelete"></span>';
            vu.style.maxWidth = "auto";
            for (var i = 0; i < cols.length; i++)
                t.appendChild(cols[i]);
            _this._Shadow = t;
            return _this;
        }
        Mail.prototype.Create = function () {
            return this._Shadow.cloneNode(true);
        };
        return Mail;
    }(Corelib_25.mvc.ITemplate));
    var FactureRow = (function (_super) {
        __extends(FactureRow, _super);
        function FactureRow() {
            var _this = _super.call(this, 'row') || this;
            var t = crt(document.createElement('tr'), undefined, 'openafacture', false, { 'db-exec': '.IsValidated->factureStat' });
            t.setAttribute('scope', 'row');
            var vu;
            var cols = [
                crt(document.createElement('td'), 'Ref', 'label', false),
                crt(document.createElement('td'), 'Date', 'date', false),
                crt(document.createElement('td'), 'Client.FullName', 'label', false),
                crt(document.createElement('td'), 'NArticles', 'label', false),
                crt(document.createElement('td'), 'Total', 'label', false),
                crt(vu = document.createElement('td'), undefined, undefined),
            ];
            vu.innerHTML =
                '<span class="pull-right activeShadow glyphicon glyphicon-check" style="margin-left:5px;margin-right:5px" db-job="show" db-bind="IsValidated" target="0" db-data="none,"></span>' +
                    '<span class="pull-right glyphicon glyphicon-record" style="margin-left: 5px; margin-right: 5px" db-job="show" db-bind="IsOpen" target="0" db-data="none,"></span>';
            vu.style.maxWidth = "auto";
            for (var i = 0; i < cols.length; i++)
                t.appendChild(cols[i]);
            _this._Shadow = t;
            return _this;
        }
        FactureRow.prototype.Create = function () {
            return this._Shadow.cloneNode(true);
        };
        return FactureRow;
    }(Corelib_25.mvc.ITemplate));
    var SFactureRow = (function (_super) {
        __extends(SFactureRow, _super);
        function SFactureRow() {
            var _this = _super.call(this, 'row') || this;
            var t = crt(document.createElement('tr'), undefined, 'openasfacture', false, { 'db-exec': '.IsValidated->sfactureStat' });
            t.setAttribute('scope', 'row');
            var vu;
            var cols = [
                crt(document.createElement('td'), 'Ref', 'label', false),
                crt(document.createElement('td'), 'Fournisseur.Name', 'label', false),
                crt(document.createElement('td'), 'Date', 'date', false),
                crt(document.createElement('td'), 'NArticles', 'label', false),
                crt(document.createElement('td'), 'Total', 'price', false),
                crt(document.createElement('td'), 'Observation', 'label', false),
                crt(vu = document.createElement('td'), undefined, undefined),
            ];
            vu.innerHTML =
                '<span class="pull-right activeShadow glyphicon glyphicon-check" style="margin-left:5px;margin-right:5px" db-job="show" db-bind="IsValidated" target="0" db-data="none,"></span>' +
                    '<span class="pull-right glyphicon glyphicon-record" style="margin-left: 5px; margin-right: 5px" db-job="show" db-bind="IsOpen" target="0" db-data="none,"></span>';
            vu.style.maxWidth = "auto";
            for (var i = 0; i < cols.length; i++)
                t.appendChild(cols[i]);
            _this._Shadow = t;
            return _this;
        }
        SFactureRow.prototype.Create = function () {
            return this._Shadow.cloneNode(true);
        };
        return SFactureRow;
    }(Corelib_25.mvc.ITemplate));
    var Product = (function (_super) {
        __extends(Product, _super);
        function Product() {
            var _this = _super.call(this, 'row') || this;
            var t = crt(document.createElement('tr'), undefined, 'openproduct', false);
            t.setAttribute('scope', 'row');
            var z;
            var cols = [
                crt(document.createElement('td'), 'Category', 'tostring', false),
                crt(document.createElement('td'), 'Name', 'label', false),
                crt(document.createElement('td'), 'Dimention', 'label', false),
                crt(document.createElement('td'), 'SerieName', 'tostring', false),
                crt(document.createElement('td'), 'Quality', 'enum2string', false, { type: 'models.Quality', rtype: 'number' }, { maxWidth: '70px' }),
                crt(document.createElement('td'), 'Qte', 'label', false),
                crt(document.createElement('td'), 'Value', 'price', false),
                z = crt(document.createElement('td'))
            ];
            z.innerHTML = '<span type="button" db-job="openfsprice" class="btn btn-sm btn-danger glyphicon glyphicon-usd pull-right"></span>';
            for (var i = 0; i < cols.length; i++)
                t.appendChild(cols[i]);
            _this._Shadow = t;
            return _this;
        }
        Product.prototype.Create = function () {
            return this._Shadow.cloneNode(true);
        };
        return Product;
    }(Corelib_25.mvc.ITemplate));
    var OArticle = (function (_super) {
        __extends(OArticle, _super);
        function OArticle() {
            var _this = _super.call(this, 'orow') || this;
            var t = crt(document.createElement('tr'));
            t.setAttribute('scope', 'row');
            if (typeof fastEdit !== 'undefined' && fastEdit) {
                var cols = [
                    crt('td', null, null, true, null, null, [crt('input', 'Count', 'number', true, { class: "form-control unborder", placeholder: "Qte" })]),
                    crt('td', null, null, true, null, null, [crt('input', void 0, 'TLabel', true, { "text-transform": "uppercase", class: "form-control unborder", placeholder: "Enter the Product Name" })]),
                    crt('td', null, null, true, null, null, [crt('label', 'Product', 'number', true, { 'readonly': '', 'db-filter': "fackeprice:0", class: "form-control unborder", placeholder: "Help" })]),
                    crt('td', null, null, true, null, null, [crt('input', 'Product', 'reduction', true, { class: "form-control unborder", placeholder: "Help" })]),
                    crt('td', null, null, true, null, null, [crt('label', 'Price', 'number', true, { class: "form-control unborder" })]),
                    crt('td', null, null, true, null, null, [crt('button', 'Product', 'openfprice', false, { type: "button", autofocus: "true", class: "btn btn-sm btn-danger glyphicon glyphicon-usd pull-right" })])
                ];
            }
            else {
                var cols = [
                    crt('td', 'Count', 'number', false, { class: "tdPadding" }),
                    crt('td', 'Label', 'label', false, { "text-transform": "uppercase", class: "tdPadding" }),
                    crt('td', 'PSel', 'number', false, { 'readonly': '', class: "tdPadding" }),
                    crt('td', 'Price', 'number', false, { class: "tdPadding" }),
                    crt('td', null, null, true, null, null, [crt('button', 'Product', 'openfprice', false, { type: "button", autofocus: "true", class: "btn btn-sm btn-danger glyphicon glyphicon-usd pull-right" })])
                ];
            }
            for (var i = 0; i < cols.length; i++)
                t.appendChild(cols[i]);
            _this._Shadow = t;
            return _this;
        }
        OArticle.prototype.Create = function () {
            return this._Shadow.cloneNode(true);
        };
        return OArticle;
    }(Corelib_25.mvc.ITemplate));
    var FakePrice = (function (_super) {
        __extends(FakePrice, _super);
        function FakePrice() {
            var _this = _super.call(this, 'row') || this;
            var t = crt(document.createElement('tr'), null, null, null);
            t.setAttribute('scope', 'row');
            var app = crt('span', 'ApplyPrice', "applyPriceStat", false, null, { display: 'none' });
            t.appendChild(app);
            var z, p, q, ps;
            if (typeof fastEdit !== 'undefined' && fastEdit) {
                var cols = [
                    q = crt('td', null, null, true, null, null, [crt('input', 'Qte', 'number', true, { class: "form-control unborder", placeholder: "Qte" })]),
                    p = crt('td', null, null, true, null, null, [crt('input', 'Product', 'auto-product', true, { "text-transform": "uppercase", class: "form-control unborder", placeholder: "Enter the Product Name" })]),
                    ps = crt('td', null, null, true, null, null, [crt('input', 'PSel', 'number', true, { class: "form-control unborder", placeholder: "Prix D\'Achat" })]),
                    ps = crt('td', null, null, true, null, null, [crt('input', undefined, 'number', true, { 'db-filter': 'fackeprice:0', class: "form-control unborder", placeholder: "Prix D\'Vent" })]),
                ];
            }
            else {
                cols = [
                    q = crt('td', 'Qte', 'number', false, { class: "tdPadding" }),
                    p = crt('td', 'Product', 'label', false, { "text-transform": "uppercase", class: "tdPadding" }),
                    ps = crt('td', 'PSel', 'number', false, { class: "tdPadding" }),
                    ps = crt('td', undefined, 'number', false, { 'db-filter': 'fackeprice:0', class: "tdPadding" })
                ];
            }
            for (var i = 0; i < cols.length; i++)
                t.appendChild(cols[i]);
            _this._Shadow = t;
            return _this;
        }
        FakePrice.prototype.Create = function () {
            return this._Shadow.cloneNode(true);
        };
        return FakePrice;
    }(Corelib_25.mvc.ITemplate));
    var FakePricePrices = (function (_super) {
        __extends(FakePricePrices, _super);
        function FakePricePrices() {
            var _this = _super.call(this, 'price') || this;
            var t = crt(document.createElement('tr'), undefined, 'dopenfprice', false);
            t.setAttribute('scope', 'row');
            var cols = [
                crt(document.createElement('td'), 'Facture.Fournisseur.Name', 'label', false),
                crt(document.createElement('td'), 'Product.Name', 'label', false),
                crt(document.createElement('td'), 'Qte', 'number', false),
                crt(document.createElement('td'), 'PSel', 'number', false),
                crt(document.createElement('td'), 'Value', 'price', false),
                crt(document.createElement('td'), 'PValue', 'price', false),
                crt(document.createElement('td'), 'HWValue', 'price', false),
                crt(document.createElement('td'), 'WValue', 'price', false),
            ];
            for (var i = 0; i < cols.length; i++)
                t.appendChild(cols[i]);
            _this._Shadow = t;
            return _this;
        }
        FakePricePrices.prototype.Create = function () {
            return this._Shadow.cloneNode(true);
        };
        return FakePricePrices;
    }(Corelib_25.mvc.ITemplate));
    var Category = (function (_super) {
        __extends(Category, _super);
        function Category() {
            var _this = _super.call(this, 'row') || this;
            var t = crt(document.createElement('tr'), undefined, 'opencategory', false);
            t.setAttribute('scope', 'row');
            var cols = [
                crt(document.createElement('td'), "Name", 'tostring', true),
                crt(document.createElement('td'), 'Base', 'tostring', true),
                crt(document.createElement('td'), 'Base.Base', 'tostring', true)
            ];
            for (var i = 0; i < cols.length; i++)
                t.appendChild(cols[i]);
            _this._Shadow = t;
            return _this;
        }
        Category.prototype.Create = function () {
            return this._Shadow.cloneNode(true);
        };
        return Category;
    }(Corelib_25.mvc.ITemplate));
    var Agents = (function (_super) {
        __extends(Agents, _super);
        function Agents() {
            var _this = _super.call(this, 'row') || this;
            var t = crt(document.createElement('tr'), undefined, 'opencategory', false);
            t.setAttribute('scope', 'row');
            var cols = [
                crt(document.createElement('td'), 'Person.FullName', 'tostring', false),
                crt(document.createElement('td'), 'Person.Tel', 'tostring', false),
                crt(document.createElement('td'), 'Person.Email', 'tostring', false),
                crt('td', null, null, null, null, { 'max-width': '75px' }, [
                    crt('button', 'Person', 'openclient', false, { type: "button", class: "btn b btn-default pull-right" }, null, [document.createTextNode('Edit')])
                ])
            ];
            for (var i = 0; i < cols.length; i++)
                t.appendChild(cols[i]);
            _this._Shadow = t;
            return _this;
        }
        Agents.prototype.Create = function () {
            return this._Shadow.cloneNode(true);
        };
        return Agents;
    }(Corelib_25.mvc.ITemplate));
});
define("Desktop/Main", ["require", "exports", "../lib/Q/sys/UI", "../lib/Q/sys/Jobs", "../lib/Q/sys/Corelib", "Desktop/ModelsViews", "Desktop/Apps"], function (require, exports, UI_32, Jobs_4, Corelib_26, ModelsViews_1, Apps_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ModelsViews_1.Init();
    function Main() {
        Corelib_26.mvc.Initializer.Instances.
            then(function (p) { return Corelib_26.thread.Dispatcher.call(Apps_1.Init, Apps_1.Init.Main, UI_32.UI.Desktop.Current); });
    }
    exports.Main = Main;
    var load = false;
    function initialize() {
        if (load)
            return;
        Corelib_26.thread.Dispatcher.call(null, _load);
    }
    exports.initialize = initialize;
    function _load() {
        if (load)
            return;
        load = true;
        Jobs_4.Jobs.Load();
        Main();
    }
});
define("Mobile/Core", ["require", "exports", "../lib/q/sys/UI", "../lib/q/sys/Corelib", "../lib/q/sys/Filters", "abstract/Models", "../lib/q/sys/System", "context", "Mobile/Resources"], function (require, exports, UI_33, Corelib_27, Filters_11, Models_37, System_13, context_3, Resources_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var controls;
    (function (controls) {
        var Pop = (function (_super) {
            __extends(Pop, _super);
            function Pop(isemutable) {
                var _this = _super.call(this) || this;
                _this.View.addEventListener('touchstart', _this);
                _this.applyStyle('pop', 'card-container');
                _this.OnClosed = new Corelib_27.bind.FEventListener('', isemutable);
                return _this;
            }
            Pop.prototype.Open = function (callback, owner) {
                if (callback)
                    if (owner != null)
                        this.OnClosed.Add({ Invoke: callback, Owner: owner });
                    else
                        this.OnClosed.Add(callback);
                this.View.style.zIndex = String(++Pop.zindex);
                document.body.appendChild(this.View);
                this.Parent = UI_33.UI.Desktop.Current;
                this.date = performance.now();
            };
            Pop.prototype.Hide = function (msg, data) {
                this.date = -1;
                var e = { Result: msg, Pop: this, Data: data, Cancel: void 0 };
                this.OnClosed.PInvok('', [e], this);
                if (!e.Cancel)
                    try {
                        this.View.remove();
                    }
                    catch (e) {
                    }
            };
            Pop.prototype.handleEvent = function (e) {
                if (e.srcElement != this.View)
                    return;
                if (this.date == -1 || performance.now() - this.date < 1000)
                    return;
                this.Hide(UI_33.UI.MessageResult.abort, null);
            };
            Pop.zindex = 13224000000;
            Pop.Default = new Pop(true);
            return Pop;
        }(UI_33.UI.ContentControl));
        controls.Pop = Pop;
        var Options = (function (_super) {
            __extends(Options, _super);
            function Options() {
                var _this = _super.call(this, 'mobile.nav-bottom', UI_33.UI.TControl.Me) || this;
                _this.Items = new Corelib_27.collection.List(Object, [{ Title: "add" }, { Title: Resources_1.resources.MdIcon[Resources_1.resources.MdIcon.remove] }, { Title: Resources_1.resources.MdIcon[Resources_1.resources.MdIcon.unarchive] }, { Title: Resources_1.resources.MdIcon[Resources_1.resources.MdIcon.delete_sweep] }]);
                _this.pop = new Pop(false);
                _this.OnClosed = new Corelib_27.bind.FEventListener('');
                _this.pop.OnClosed.Add({ Invoke: _this.OnPopClosed, Owner: _this });
                return _this;
            }
            Options.prototype.initialize = function () {
                _super.prototype.initialize.call(this);
            };
            Options.prototype.setName = function (name, dom, cnt, e) {
                if (name == 'ListView') {
                    this.ListView = cnt;
                    this.ListView.AcceptNullValue = true;
                }
            };
            Options.prototype.OnClicked = function (e, data, scop, v) {
                this.pop.Hide(UI_33.UI.MessageResult.ok, scop.Value);
            };
            Options.prototype.Open = function () {
                this.pop.Content = this;
                this.pop.Open();
            };
            Options.prototype.OnPopClosed = function (e) {
                this.OnClosed.PInvok('', [this, e], this);
            };
            Options.prototype.OkClick = function (e, data, scop, v) {
                this.pop.Hide(UI_33.UI.MessageResult.Exit, {});
            };
            Options.prototype.CancelClick = function (e, data, scop, v) {
                this.pop.Hide(UI_33.UI.MessageResult.cancel, {});
            };
            return Options;
        }(UI_33.UI.TControl));
        controls.Options = Options;
        var SimpleEdit = (function (_super) {
            __extends(SimpleEdit, _super);
            function SimpleEdit(imutable) {
                var _this = _super.call(this, Resources_1.resources.mobile.get('simpleedit'), UI_33.UI.TControl.Me) || this;
                _this._view.addEventListener('click', function (e) { _this.OnMouseDown(e); }, false);
                _this.card = _this._view.getElementsByClassName('green-card')[0];
                _this.OnClosed = new Corelib_27.bind.FEventListener('', imutable);
                return _this;
            }
            SimpleEdit.prototype._hasValue_ = function () { return true; };
            SimpleEdit.prototype.OkClicked = function (e, data, scop, v) {
                this.Close(true);
            };
            SimpleEdit.prototype.CancelClicked = function (e, data, scop, v) {
                this.Close(false);
            };
            SimpleEdit.prototype.OnMouseDown = function (e) {
                if (performance.now() - this.start < 1000)
                    return;
                var t = e.srcElement;
                if (this.card.contains(t))
                    return true;
                this.Close(false);
                e.stopImmediatePropagation();
                e.preventDefault();
                return true;
            };
            SimpleEdit.prototype.Close = function (isok) {
                this.isOpen = false;
                UI_33.UI.Desktop.Current.ReleaseKeyControl();
                try {
                    if (document.body.contains(this._view))
                        this.View.remove();
                    this.OnClosed.PInvok('', [this, this.Value, isok], null);
                }
                catch (e) { }
            };
            SimpleEdit.prototype.setName = function (name, dom, cnt) {
                if (name == 'box')
                    this.box = dom;
            };
            SimpleEdit.prototype.Open = function (value, editable) {
                var _this = this;
                if (this.isOpen)
                    return;
                this.isOpen = true;
                UI_33.UI.Desktop.Current.GetKeyControl(this, this.OnKeyDown, []);
                this.start = performance.now();
                if (typeof value == 'number')
                    this.Value = value;
                if (this.box)
                    this.box.disabled = editable == undefined ? false : !editable;
                else
                    this.OnCompiled = function (n) { _this.box.disabled = editable == undefined ? false : !editable; };
                Corelib_27.thread.Dispatcher.call(this, this.asyncOpen);
            };
            SimpleEdit.prototype.asyncOpen = function () {
                this.Parent = UI_33.UI.Desktop.Current;
                document.body.appendChild(this.View);
            };
            SimpleEdit.prototype.OnKeyDown = function (e) {
                if (e.keyCode == 13)
                    this.Close(true);
                else if (e.keyCode == 27)
                    this.Close(false);
                else
                    return UI_33.UI.KeyboardControllerResult.Release;
                e.stopImmediatePropagation();
                e.preventDefault();
                return UI_33.UI.KeyboardControllerResult.Handled;
            };
            SimpleEdit.DPTitle = Corelib_27.bind.DObject.CreateField("Title", String);
            return SimpleEdit;
        }(UI_33.UI.TControl));
        controls.SimpleEdit = SimpleEdit;
        var abstracts;
        (function (abstracts) {
            var AppBase = (function (_super) {
                __extends(AppBase, _super);
                function AppBase(dom, Teta) {
                    var _this = _super.call(this, dom) || this;
                    _this.Teta = Teta;
                    _this.__Controller__ = Corelib_27.bind.Controller.Attach(_this, _this);
                    _this.Value = _this;
                    return _this;
                }
                AppBase.prototype.Search = function (data) {
                    var p = this.SelectedPage;
                    data = data.trim();
                    if (p instanceof MobilePage)
                        p.Search(data);
                };
                AppBase.prototype.OnDispose = function () {
                    Corelib_27.helper.TryCatch(this.__Controller__, this.__Controller__.Dispose);
                    return _super.prototype.OnDispose.call(this);
                };
                return AppBase;
            }(UI_33.UI.Layout));
            abstracts.AppBase = AppBase;
            var MobilePage = (function (_super) {
                __extends(MobilePage, _super);
                function MobilePage(template, Name, Url, Glyph) {
                    var _this = _super.call(this, template, UI_33.UI.TControl.Me) || this;
                    _this.Name = Name;
                    _this.Url = Url;
                    _this.Glyph = Glyph;
                    _this.OnSelected = new Corelib_27.bind.EventListener(0);
                    _this.Options = new Corelib_27.collection.List(Object);
                    _this.Items = new Corelib_27.collection.ExList(Object);
                    _this.ServiceType = UI_33.UI.ServiceType.Main;
                    _this.lts = 0;
                    _this._view.classList.add('panel', 'left');
                    _this._view.addEventListener('touchstart', function (e) { _this.TouchStart(e); });
                    return _this;
                }
                MobilePage.prototype.OnSearche = function () {
                };
                MobilePage.prototype.OnDeepSearche = function () {
                };
                MobilePage.prototype.OnContextMenu = function () {
                };
                MobilePage.prototype.OnPrint = function () {
                };
                MobilePage.prototype.GetLeftBar = function () { return null; };
                MobilePage.prototype.GetRightBar = function () { return null; };
                MobilePage.prototype.Callback = function (args) {
                    return void 0;
                };
                MobilePage.prototype.Handled = function () {
                    return false;
                };
                MobilePage.prototype.initialize = function () {
                    _super.prototype.initialize.call(this);
                    this.Items.Filter = new Filters_11.filters.list.LStringFilter();
                };
                MobilePage.prototype.setName = function (name, dom, cnt, e) {
                    if (name == 'ListView') {
                        this.ListView = cnt;
                        this.ListView.AcceptNullValue = false;
                        this.ListView.activateClass = this.activeClass();
                        return true;
                    }
                };
                MobilePage.prototype.Search = function (data) {
                    this.Items.Filter.Patent = new Filters_11.filters.list.StringPatent(data == "*" ? "" : data);
                };
                MobilePage.prototype.OnKeyDown = function (e) {
                    if (e.keyCode == 13) {
                        this.OnDoubleTab(this.ListView.SelectedItem);
                        e.stopImmediatePropagation();
                        e.preventDefault();
                        return true;
                    }
                    else
                        return this.ListView.OnKeyDown(e);
                };
                MobilePage.prototype.OnAttached = function () {
                    var t = this.ListView && this.ListView.SelectedChild;
                    if (t)
                        t.View.scrollIntoViewIfNeeded();
                };
                MobilePage.prototype.OnDetached = function () {
                };
                MobilePage.prototype.Update = function () {
                };
                MobilePage.prototype.OnOptionExecuted = function (e) {
                };
                MobilePage.prototype.TouchEnd = function (e, data, scop, v) {
                    var now = performance.now();
                    var def = now - this.lastAccess;
                    var node = this.lastCnt;
                    this.lastAccess = now;
                    this.lastCnt = data.dom;
                    if (def <= 350 && def >= 100)
                        if (node == data.dom)
                            this.OnDoubleTab(this.ListView.SelectedItem);
                    if (this.ListView.SelectedIndex == -1)
                        return;
                    var lts = this.lts;
                    var elt = performance.now();
                    if (elt - lts > 500) {
                        if (this.dist(e.changedTouches[0], this.lct) > 10)
                            return;
                        var x = this.SearchParents(EMobileApp);
                        x && x.OpenOptions();
                    }
                    this.lts = elt + 1000;
                };
                MobilePage.prototype.dist = function (a, b) {
                    return Math.sqrt((a.screenX - b.screenX) * (a.screenX - b.screenX) + (a.screenY - b.screenY) * (a.screenY - b.screenY));
                };
                MobilePage.prototype.GetSubsOptions = function () { return; };
                MobilePage.prototype.OnSubsOptionExecuted = function (o) {
                    return false;
                };
                MobilePage.prototype.TouchStart = function (e) {
                    this.lts = performance.now();
                    this.lct = e.touches[0];
                };
                MobilePage.prototype.OnDoubleTab = function (item) {
                };
                MobilePage.prototype.OnOptionOpening = function () { return false; };
                return MobilePage;
            }(UI_33.UI.TControl));
            abstracts.MobilePage = MobilePage;
        })(abstracts = controls.abstracts || (controls.abstracts = {}));
        var EMobileApp = (function (_super) {
            __extends(EMobileApp, _super);
            function EMobileApp(dom, Teta) {
                var _this = _super.call(this, dom, Teta) || this;
                _this.Items = new Corelib_27.collection.List(Object);
                _this.Foot = new UI_33.UI.ServiceNavBar(_this, true);
                _this.subOptions = new Options();
                var x = function (e) {
                };
                _this.Items.Listen = function (e) {
                    if (e.event == Corelib_27.collection.CollectionEvent.Added) {
                        if (e.newItem)
                            e.newItem.OnSelected.Add(x, context_3.context.NameOf(EMobileApp));
                    }
                    else if (e.event == Corelib_27.collection.CollectionEvent.Removed) {
                        if (e.oldItem)
                            e.oldItem.OnSelected.Remove(context_3.context.NameOf(EMobileApp));
                    }
                    else if (e.event === Corelib_27.collection.CollectionEvent.Replace) {
                        if (e.newItem)
                            e.newItem.OnSelected.Add(x, context_3.context.NameOf(EMobileApp));
                        if (e.oldItem)
                            e.oldItem.OnSelected.Remove(context_3.context.NameOf(EMobileApp));
                    }
                    else if (e.event == Corelib_27.collection.CollectionEvent.Cleared) {
                        for (var i = 0; i < e.collection.length; i++) {
                            var t = e.collection[i];
                            if (t)
                                t.OnSelected.Remove(context_3.context.NameOf(EMobileApp));
                        }
                    }
                    else if (e.event == Corelib_27.collection.CollectionEvent.Reset) {
                        for (var i = 0; i < e.collection.length; i++) {
                            var t = e.collection[i];
                            if (t)
                                t.OnSelected.Add(x, context_3.context.NameOf(EMobileApp));
                        }
                    }
                };
                return _this;
            }
            EMobileApp.prototype.toString = function () {
                return "EMobileApp";
            };
            EMobileApp.prototype.showPage = function (page) {
                var _this = this;
                if (!this.Main) {
                    this.__Controller__.OnCompiled = {
                        Invoke: function (a) {
                            _this.showPage(page);
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
            };
            EMobileApp.prototype.Check = function (child) {
                return child instanceof UI_33.UI.JControl;
            };
            EMobileApp.prototype._hasValue_ = function () { return true; };
            EMobileApp.prototype.setName = function (name, dom, cnt) {
                var _this = this;
                if (name === '_panels') {
                    this._panels = new UI_33.UI.DivControl(dom);
                    return;
                }
                if (name == '_main') {
                    this.Main = new UI_33.UI.ContentControl(dom);
                    this.Main.Parent = this;
                    return;
                }
                else if (name == 'slogan')
                    dom.addEventListener('click', function () { return _this.ToggleMenu(); });
                else if (name == "menuContent") {
                    this.menuContent = cnt;
                    return;
                }
                else if (name == 'Header') {
                }
                else if (name == 'searchBar') {
                    this.searchBar = new UI_33.UI.UISearch(dom);
                    this.searchBar.OnSearch = this.Search.bind(this);
                    this.searchBar.Parent = this;
                    var tt = this.searchBar.handleEvent;
                    this.searchBar.handleEvent = function (e) {
                        _this.Search(_this.searchBar.inputEl.value);
                        tt.call(_this.searchBar, e);
                    };
                    return;
                }
                else if (name == "NavList") {
                    this.NavList = cnt;
                    this.line = new Corelib_27.bind.TwoDBind(Corelib_27.bind.BindingMode.TwoWay, this, this.NavList, abstracts.AppBase.DPSelectedPage, UI_33.UI.ListAdapter.DPSelectedItem, function (a) { return a; }, function (b) { return b; });
                    return;
                }
                else
                    return;
                this[name] = dom;
            };
            EMobileApp.prototype.Add = function (child) {
                return this;
            };
            EMobileApp.prototype.OnOptionClicked = function (e, data, scop, v) {
                if (!this.Header.classList.contains('menu-opened'))
                    return;
                this.Header.classList.remove('menu-opened');
                var op = scop.Value;
                if (op && op.OnOptionClicked)
                    Corelib_27.helper.TryCatch(op, op.OnOptionClicked, void 0, [op, this, this.SelectedPage]);
                Corelib_27.helper.TryCatch(this.SelectedPage, this.SelectedPage.OnOptionExecuted, void 0, [op]);
            };
            EMobileApp.prototype.navClicked = function (e, c, d, events) {
                if (!document.webkitIsFullScreen) {
                    var bd = document.body;
                    bd.requestFullscreen && bd.requestFullscreen();
                    bd.webkitRequestFullScreen && bd.webkitRequestFullScreen();
                    bd.webkitRequestFullscreen && bd.webkitRequestFullscreen();
                }
                this.SelectedPage = d.Value;
            };
            EMobileApp.prototype.ToggleMenu = function () {
                Corelib_27.$$(this.Header).toggleClass('menu-opened');
            };
            EMobileApp.prototype.SelectNaxtPage = function () { this.NavList.SelectedIndex++; };
            EMobileApp.prototype.SelectPrevPage = function () { this.NavList.SelectedIndex--; };
            EMobileApp.prototype.OpenOptions = function () {
                if (this.SelectedPage && this.SelectedPage.OnOptionOpening())
                    this.subOptions.Open();
            };
            EMobileApp.prototype.OnSubsOptionClosed = function (option, e) {
                var p = this.SelectedPage;
                p && p.OnOptionExecuted(e);
            };
            EMobileApp.prototype.initialize = function () {
                Corelib_27.ScopicCommand.Register({ Invoke: this.reRenderNavitem, Owner: this }, null, 'initNav');
                this.subOptions.OnClosed.Add({ Invoke: this.OnSubsOptionClosed, Owner: this });
                _super.prototype.initialize.call(this);
            };
            EMobileApp.prototype.Update = function () {
                this.SelectedPage && this.SelectedPage.Update();
            };
            EMobileApp.prototype.OnKeyDown = function (e) {
                if (this.searchBar && this.searchBar.IsOpen)
                    return true;
                return _super.prototype.OnKeyDown.call(this, e);
            };
            EMobileApp.prototype.OnDeepSearche = function () {
                this.searchBar.open();
            };
            EMobileApp.prototype.Search = function (data) {
                var p = this.SelectedPage;
                data = data.trim();
                if (p && p.Search)
                    p.Search(data);
            };
            EMobileApp.prototype.OnAttached = function () {
                var p = this.SelectedPage;
                if (p)
                    p.OnAttached();
            };
            EMobileApp.prototype.reRenderNavitem = function (name, dom, scop, param) {
                var val = scop;
                var a = dom;
                var i = a.firstElementChild;
                a.href = "#" + val.Url;
                val.dom = dom;
                i.innerText = val.Glyph;
                if (this.SelectedPage == null)
                    this.SelectedPage = val;
            };
            __decorate([
                Corelib_27.attributes.property(Corelib_27.collection.List, void 0),
                __metadata("design:type", Corelib_27.collection.List)
            ], EMobileApp.prototype, "Options", void 0);
            return EMobileApp;
        }(abstracts.AppBase));
        controls.EMobileApp = EMobileApp;
        var AuthApp = (function (_super) {
            __extends(AuthApp, _super);
            function AuthApp(teta) {
                var _this = _super.call(this, Resources_1.resources.mobile.get('login-form').content.firstElementChild, teta) || this;
                _this.i = true;
                _this.firstTime = true;
                _this.Value = new Models_37.models.Login();
                return _this;
            }
            AuthApp.prototype._hasValue_ = function () { return true; };
            AuthApp.prototype.initialize = function () {
                _super.prototype.initialize.call(this);
            };
            AuthApp.prototype.setName = function (name, dom, cnt) {
                this[name] = dom;
            };
            AuthApp.prototype._login = function (e, c, d, events) { this.login(); };
            AuthApp.prototype.login = function () {
                var _this = this;
                if (this.hors_conn.checked) {
                    this.Teta.Setting.offline = true;
                    this.Teta.Setting.Stat = Resources_1.Common.ServerStat.Connected;
                    return;
                }
                this.Teta.Setting.Stat = Resources_1.Common.ServerStat.Connecting;
                Resources_1.resources.GData.requester.Post(Models_37.models.Login, this.Value, null, function (s, r, iss, hndl) {
                    if (!s.IsSuccess) {
                        return _this.Teta.Setting.Stat = Resources_1.Common.ServerStat.UnAvaible;
                    }
                    _this.Teta.Setting.Stat = iss ? Resources_1.Common.ServerStat.Connected : Resources_1.Common.ServerStat.Disconnected;
                    if (iss) {
                        _this.Teta.Setting.saveAuth();
                        Resources_1.resources.GData.requester.SetAuth('id', AuthApp.id = hndl.GetHeader('id'));
                    }
                    if (_this.firstTime)
                        delete _this.firstTime;
                });
            };
            AuthApp.prototype._signup = function (e, c, d, events) {
                alert("Signup");
            };
            AuthApp.prototype.pwdForgotten = function (e, c, d, events) {
                alert("Pwd Forgotten");
            };
            AuthApp.prototype.hello = function (e, c, d, events) {
                alert("Hello ");
            };
            AuthApp.toogle = function (log, sing) {
                sing.style.opacity = '0';
                sing.style.height = "1px";
                sing.style.display = '';
                var pd = window.getComputedStyle(log, null).getPropertyValue('padding-top');
                var pdb = window.getComputedStyle(log, null).getPropertyValue('padding-bottom');
                return Corelib_27.css.animation.animates({
                    animations: [{
                            dom: log,
                            props: [Corelib_27.css.animation.constats.hideOpacity, Corelib_27.css.animation.trigger('padding-top', parseInt(pd), 0, '', 'px'), Corelib_27.css.animation.trigger('padding-bottom', parseInt(pdb), 0, '', 'px'), Corelib_27.css.animation.trigger('height', log.clientHeight, 0, '', 'px')],
                            timespan: 1000,
                            oncomplete: function (e) {
                                e.dom.style.display = 'none';
                            }
                        }, {
                            dom: sing,
                            props: [Corelib_27.css.animation.constats.showOpacity, Corelib_27.css.animation.trigger('height', 0, sing.scrollHeight + 1, '', 'px')],
                            timespan: 1000,
                            onstart: function (e) {
                                e.dom.style.display = 'block';
                            }
                        }], interval: 100, timespan: 700
                });
            };
            AuthApp.prototype._toggle = function (e, c, d, events) {
                this.toggleIcon.innerText = this.i ? 'create' : 'person';
                UI_33.UI.JControl.toggleClass(this.toggleIcon, 'glyphicon-user');
                if (this.anim)
                    Corelib_27.css.animation.stopAnimations(this.anim);
                if (this.i = !this.i)
                    this.anim = AuthApp.toogle(this.signupForm, this.loginForm);
                else
                    this.anim = AuthApp.toogle(this.loginForm, this.signupForm);
            };
            AuthApp.prototype.ExcuteOnCompiled = function (Invoke, Owner) {
                if (this.__Controller__)
                    this.__Controller__.OnCompiled = { Invoke: Invoke, Owner: Owner };
                else
                    Invoke.call(Owner, null);
            };
            AuthApp.prototype.Show = function () {
                if (this.firstTime) {
                    this.firstTime = false;
                    if (this.Teta.Setting.loadAuth()) {
                        this.ExcuteOnCompiled(this.login, this);
                        return;
                    }
                }
                var d = UI_33.UI.Desktop.Current;
                var i = 0, c = d.getChild(i);
                while (c) {
                    if (c == this) {
                        break;
                    }
                    c = d.getChild(++i);
                }
                if (!c)
                    d.Add(this);
                d.Show(this);
            };
            return AuthApp;
        }(EMobileApp));
        controls.AuthApp = AuthApp;
        var Settings = (function (_super) {
            __extends(Settings, _super);
            function Settings(teta) {
                var _this = _super.call(this, Resources_1.resources.mobile.get('settings').content.firstElementChild, teta) || this;
                _this.i = true;
                _this.connectionCheker = new ECommon.checkConnection(_this);
                _this.loadIP();
                return _this;
            }
            Settings.__fields__ = function () { return [this.DPServerAddress, this.DPPort, this.DPStat]; };
            Settings.prototype.connect = function (e, c, d, events) {
                this.connectionCheker.request();
            };
            Settings.prototype._show = function (app) {
                var d = UI_33.UI.Desktop.Current;
                var i = 0, c = d.getChild(i);
                while (c) {
                    if (c == app) {
                        break;
                    }
                    c = d.getChild(++i);
                }
                if (!c)
                    d.Add(app);
                d.Show(app);
            };
            Settings.prototype.setName = function (name, dom, cnt) {
                this[name] = dom;
                if (name === 'toggleIcon')
                    this.toggleIcon.innerText = 'settings';
            };
            Settings.prototype._toggle = function (e, c, d, events) {
                if (this.anim)
                    Corelib_27.css.animation.stopAnimations(this.anim);
                if (this.i = !this.i)
                    this.anim = AuthApp.toogle(this.signupForm, this.loginForm);
                else
                    this.anim = AuthApp.toogle(this.loginForm, this.signupForm);
                this.toggleIcon.innerText = this.i ? 'settings' : 'sms';
            };
            Settings.prototype.AddRessChanged = function (e) {
                var _this = this;
                var n = e._new || "";
                if (!n)
                    return;
                var i0 = n.indexOf(':');
                var i1 = n.lastIndexOf(':');
                if (i1 > i0)
                    Corelib_27.thread.Dispatcher.call(this, function () { _this.ServerAddress = n.substring(0, i1); });
            };
            Settings.prototype.OnStatChanged = function (e) {
                var d = UI_33.UI.Desktop.Current;
                switch (e._new) {
                    case Resources_1.Common.ServerStat.UnAvaible:
                        this.connectionCheker.stopThread();
                        if (this.offline == true)
                            return Corelib_27.thread.Dispatcher.call(this, function () { this.Teta.Setting.Stat = Resources_1.Common.ServerStat.Connected; });
                        if (this.offline != null && Corelib_27.basic.Settings.get('offline')) {
                            return Corelib_27.thread.Dispatcher.call(this, function () {
                                if (confirm('Do you want to run offline mode')) {
                                    this.offline = true;
                                    this.Teta.Setting.Stat = Resources_1.Common.ServerStat.Connected;
                                    return;
                                }
                                else
                                    this.offline = false;
                            });
                        }
                        this._show(this);
                        break;
                    case Resources_1.Common.ServerStat.Disconnected:
                        this.connectionCheker.stopThread();
                        this.saveIP();
                        this.Teta.Auth.Show();
                        break;
                    case Resources_1.Common.ServerStat.Connected:
                        this.connectionCheker.startThread();
                        this.saveAuth();
                        this.saveIP();
                        this._show(this.Teta.App);
                        break;
                    default:
                }
            };
            Settings.prototype.initialize = function () {
                _super.prototype.initialize.call(this);
                this.loadIP();
            };
            Settings.prototype.Recheck = function (callback) {
                this.connectionCheker.request(callback);
                return this;
            };
            Object.defineProperty(Settings.prototype, "Address", {
                get: function () {
                    return this.ServerAddress + (this.Port ? ':' + this.Port : '');
                },
                enumerable: true,
                configurable: true
            });
            Settings.prototype.Connect = function () {
                if (this.hors_conn.checked) {
                    this.Teta.Setting.offline = true;
                    this.Teta.Setting.Stat = Resources_1.Common.ServerStat.Connected;
                    return;
                }
                try {
                    if (this.ServerAddress.lastIndexOf('/') == this.ServerAddress.length - 1)
                        this.ServerAddress = this.ServerAddress.substring(0, this.ServerAddress.length - 1);
                    var t = new System.basics.Url(this.Address);
                    if (!t.IsExternal)
                        return alert("L'address doit etre commencer par (http://) ou par (https://) ou par autres shemas ");
                    __global.ApiServer = t;
                }
                catch (e) {
                    alert('Un Error Occured check your entities');
                    return;
                }
                this.Recheck();
            };
            Settings.prototype.Show = function () {
                var _this = this;
                this.connectionCheker.stopThread();
                this.connectionCheker.request(function (a, b, c, d) {
                    _this.OnStatChanged({ _new: b == null ? Resources_1.Common.ServerStat.UnAvaible : b == true ? Resources_1.Common.ServerStat.Connected : Resources_1.Common.ServerStat.Disconnected });
                });
                _super.prototype.Show.call(this);
            };
            Settings.prototype.saveIP = function () {
                try {
                    localStorage.setItem('ip', this.ServerAddress);
                    localStorage.setItem('port', String(this.Port));
                }
                catch (e) {
                }
            };
            Settings.prototype.loadIP = function () {
                this.ServerAddress = localStorage.getItem('ip');
                this.Port = parseInt(localStorage.getItem('port'));
            };
            Settings.prototype.saveAuth = function () {
                try {
                    localStorage.setItem('auth', JSON.stringify(Corelib_27.encoding.SerializationContext.GlobalContext.reset().ToJson(this.Teta.Auth.Value)));
                }
                catch (e) {
                }
            };
            Settings.prototype.loadAuth = function () {
                var v = localStorage.getItem('auth');
                if (v)
                    try {
                        __global.ApiServer = new System.basics.Url(localStorage.getItem('ip') || 'http://192.168.1.2');
                        this.Teta.Auth.Value.FromJson(JSON.parse(v), Corelib_27.encoding.SerializationContext.GlobalContext.reset());
                        return true;
                    }
                    catch (e) {
                    }
                return false;
            };
            Settings.DPServerAddress = Corelib_27.bind.DObject.CreateField("ServerAddress", String, "", null, Settings.prototype.AddRessChanged);
            Settings.DPStat = Corelib_27.bind.DObject.CreateField("Stat", Number, 0, Settings.prototype.OnStatChanged);
            Settings.DPPort = Corelib_27.bind.DObject.CreateField("Port", Number);
            return Settings;
        }(EMobileApp));
        controls.Settings = Settings;
    })(controls = exports.controls || (exports.controls = {}));
    var ECommon;
    (function (ECommon) {
        var checkConnection = (function (_super) {
            __extends(checkConnection, _super);
            function checkConnection(settings) {
                var _this = _super.call(this, true) || this;
                _this.settings = settings;
                _this.http = new XMLHttpRequest();
                _this._shema = { Method: Corelib_27.net.WebRequestMethod.Get, Name: 'CHECKCONNECTION', SendData: false, ParamsFormat: Corelib_27.basic.StringCompile.Compile("") };
                return _this;
            }
            checkConnection.prototype.request = function (callback) {
                Resources_1.resources.GData.requester.Request(controls.Settings, "CHECKCONNECTION", null, null, callback);
            };
            checkConnection.prototype.startThread = function () {
                var _this = this;
                clearInterval(this.thread);
                this.thread = setInterval(function () { _this.request(); }, 10000);
            };
            checkConnection.prototype.stopThread = function () {
                clearInterval(this.thread);
                this.thread = -1;
            };
            checkConnection.prototype.Register = function (method) {
            };
            checkConnection.prototype.ERegister = function (method, name, paramsFormat, sendData) {
            };
            checkConnection.prototype.GetMethodShema = function (m) {
                return this._shema;
            };
            checkConnection.prototype.GetType = function () {
                return controls.Settings;
            };
            checkConnection.prototype.GetRequest = function (data, shema, params) {
                return new Corelib_27.net.RequestUrl(__global.GetApiAddress('/~checklogging'), null, null, Corelib_27.net.WebRequestMethod.Get, false);
            };
            checkConnection.prototype.OnResponse = function (response, data, context) {
                if (response === false)
                    this.settings.Stat = Resources_1.Common.ServerStat.Disconnected;
                else if (response === true)
                    this.settings.Stat = Resources_1.Common.ServerStat.Connected;
                else
                    this.settings.Stat = Resources_1.Common.ServerStat.UnAvaible;
            };
            return checkConnection;
        }(System_13.Controller.Api));
        ECommon.checkConnection = checkConnection;
    })(ECommon = exports.ECommon || (exports.ECommon = {}));
});
define("Mobile/Resources", ["require", "exports", "template|../assets/mobile/templates/templates.mobile.html", "context", "../lib/q/sys/UI", "../lib/q/sys/Services", "abstract/extra/Common"], function (require, exports, tmp, context_4, UI_34, Services_4, Common_23) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function loadCss(callback, onerror) {
        var styles = ['Roboto', "style", "uisearch"];
        for (var _i = 0, styles_1 = styles; _i < styles_1.length; _i++) {
            var i = styles_1[_i];
            require('style|../assets/mobile/css/' + i + ".css", callback, onerror, context_4.context);
        }
    }
    exports.loadCss = loadCss;
    UI_34.LoadDefaultCSS();
    loadCss();
    var resources;
    (function (resources) {
        resources.mobile = tmp.template['mobile'];
        Common_23.GetVars(function (vars) { resources.GData = clone(vars); return false; });
        var MdIcon;
        (function (MdIcon) {
            MdIcon[MdIcon["local_pharmacy"] = 0] = "local_pharmacy";
            MdIcon[MdIcon["check_circle"] = 1] = "check_circle";
            MdIcon[MdIcon["chrome_reader_mode"] = 2] = "chrome_reader_mode";
            MdIcon[MdIcon["class"] = 3] = "class";
            MdIcon[MdIcon["code"] = 4] = "code";
            MdIcon[MdIcon["compare_arrows"] = 5] = "compare_arrows";
            MdIcon[MdIcon["copyright"] = 6] = "copyright";
            MdIcon[MdIcon["credit_card"] = 7] = "credit_card";
            MdIcon[MdIcon["dashboard"] = 8] = "dashboard";
            MdIcon[MdIcon["local_airport"] = 9] = "local_airport";
            MdIcon[MdIcon["link"] = 10] = "link";
            MdIcon[MdIcon["inbox"] = 11] = "inbox";
            MdIcon[MdIcon["gesture"] = 12] = "gesture";
            MdIcon[MdIcon["forward"] = 13] = "forward";
            MdIcon[MdIcon["font_download"] = 14] = "font_download";
            MdIcon[MdIcon["flag"] = 15] = "flag";
            MdIcon[MdIcon["filter_list"] = 16] = "filter_list";
            MdIcon[MdIcon["drafts"] = 17] = "drafts";
            MdIcon[MdIcon["local_library"] = 18] = "local_library";
            MdIcon[MdIcon["local_laundry_service"] = 19] = "local_laundry_service";
            MdIcon[MdIcon["local_hotel"] = 20] = "local_hotel";
            MdIcon[MdIcon["local_hospital"] = 21] = "local_hospital";
            MdIcon[MdIcon["local_grocery_store"] = 22] = "local_grocery_store";
            MdIcon[MdIcon["local_gas_station"] = 23] = "local_gas_station";
            MdIcon[MdIcon["local_florist"] = 24] = "local_florist";
            MdIcon[MdIcon["local_drink"] = 25] = "local_drink";
            MdIcon[MdIcon["local_dining"] = 26] = "local_dining";
            MdIcon[MdIcon["reply"] = 27] = "reply";
            MdIcon[MdIcon["reply_all"] = 28] = "reply_all";
            MdIcon[MdIcon["report"] = 29] = "report";
            MdIcon[MdIcon["save"] = 30] = "save";
            MdIcon[MdIcon["select_all"] = 31] = "select_all";
            MdIcon[MdIcon["send"] = 32] = "send";
            MdIcon[MdIcon["sort"] = 33] = "sort";
            MdIcon[MdIcon["text_format"] = 34] = "text_format";
            MdIcon[MdIcon["layers"] = 35] = "layers";
            MdIcon[MdIcon["layers_clear"] = 36] = "layers_clear";
            MdIcon[MdIcon["my_location"] = 37] = "my_location";
            MdIcon[MdIcon["navigation"] = 38] = "navigation";
            MdIcon[MdIcon["low_priority"] = 39] = "low_priority";
            MdIcon[MdIcon["mail"] = 40] = "mail";
            MdIcon[MdIcon["markunread"] = 41] = "markunread";
            MdIcon[MdIcon["move_to_inbox"] = 42] = "move_to_inbox";
            MdIcon[MdIcon["next_week"] = 43] = "next_week";
            MdIcon[MdIcon["redo"] = 44] = "redo";
            MdIcon[MdIcon["remove"] = 45] = "remove";
            MdIcon[MdIcon["remove_circle"] = 46] = "remove_circle";
            MdIcon[MdIcon["format_strikethrough"] = 47] = "format_strikethrough";
            MdIcon[MdIcon["format_size"] = 48] = "format_size";
            MdIcon[MdIcon["format_shapes"] = 49] = "format_shapes";
            MdIcon[MdIcon["format_quote"] = 50] = "format_quote";
            MdIcon[MdIcon["format_paint"] = 51] = "format_paint";
            MdIcon[MdIcon["format_list_numbered"] = 52] = "format_list_numbered";
            MdIcon[MdIcon["format_list_bulleted"] = 53] = "format_list_bulleted";
            MdIcon[MdIcon["format_line_spacing"] = 54] = "format_line_spacing";
            MdIcon[MdIcon["format_italic"] = 55] = "format_italic";
            MdIcon[MdIcon["rv_hookup"] = 56] = "rv_hookup";
            MdIcon[MdIcon["location_city"] = 57] = "location_city";
            MdIcon[MdIcon["mood"] = 58] = "mood";
            MdIcon[MdIcon["mood_bad"] = 59] = "mood_bad";
            MdIcon[MdIcon["flash_auto"] = 60] = "flash_auto";
            MdIcon[MdIcon["sync_disabled"] = 61] = "sync_disabled";
            MdIcon[MdIcon["sync_problem"] = 62] = "sync_problem";
            MdIcon[MdIcon["subdirectory_arrow_right"] = 63] = "subdirectory_arrow_right";
            MdIcon[MdIcon["subdirectory_arrow_left"] = 64] = "subdirectory_arrow_left";
            MdIcon[MdIcon["refresh"] = 65] = "refresh";
            MdIcon[MdIcon["more_vert"] = 66] = "more_vert";
            MdIcon[MdIcon["more_horiz"] = 67] = "more_horiz";
            MdIcon[MdIcon["menu"] = 68] = "menu";
            MdIcon[MdIcon["last_page"] = 69] = "last_page";
            MdIcon[MdIcon["place"] = 70] = "place";
            MdIcon[MdIcon["rate_review"] = 71] = "rate_review";
            MdIcon[MdIcon["local_phone"] = 72] = "local_phone";
            MdIcon[MdIcon["bluetooth_audio"] = 73] = "bluetooth_audio";
            MdIcon[MdIcon["confirmation_number"] = 74] = "confirmation_number";
            MdIcon[MdIcon["disc_full"] = 75] = "disc_full";
            MdIcon[MdIcon["local_pizza"] = 76] = "local_pizza";
            MdIcon[MdIcon["local_play"] = 77] = "local_play";
            MdIcon[MdIcon["local_post_office"] = 78] = "local_post_office";
            MdIcon[MdIcon["local_printshop"] = 79] = "local_printshop";
            MdIcon[MdIcon["near_me"] = 80] = "near_me";
            MdIcon[MdIcon["person_pin"] = 81] = "person_pin";
            MdIcon[MdIcon["person_pin_circle"] = 82] = "person_pin_circle";
            MdIcon[MdIcon["pin_drop"] = 83] = "pin_drop";
            MdIcon[MdIcon["system_update"] = 84] = "system_update";
            MdIcon[MdIcon["tap_and_play"] = 85] = "tap_and_play";
            MdIcon[MdIcon["time_to_leave"] = 86] = "time_to_leave";
            MdIcon[MdIcon["vibration"] = 87] = "vibration";
            MdIcon[MdIcon["voice_chat"] = 88] = "voice_chat";
            MdIcon[MdIcon["casino"] = 89] = "casino";
            MdIcon[MdIcon["child_friendly"] = 90] = "child_friendly";
            MdIcon[MdIcon["fitness_center"] = 91] = "fitness_center";
            MdIcon[MdIcon["free_breakfast"] = 92] = "free_breakfast";
            MdIcon[MdIcon["golf_course"] = 93] = "golf_course";
            MdIcon[MdIcon["hot_tub"] = 94] = "hot_tub";
            MdIcon[MdIcon["kitchen"] = 95] = "kitchen";
            MdIcon[MdIcon["pool"] = 96] = "pool";
            MdIcon[MdIcon["room_service"] = 97] = "room_service";
            MdIcon[MdIcon["directions_car"] = 98] = "directions_car";
            MdIcon[MdIcon["directions_bus"] = 99] = "directions_bus";
            MdIcon[MdIcon["sms"] = 100] = "sms";
            MdIcon[MdIcon["sms_failed"] = 101] = "sms_failed";
            MdIcon[MdIcon["sync"] = 102] = "sync";
            MdIcon[MdIcon["battery_unknown"] = 103] = "battery_unknown";
            MdIcon[MdIcon["bluetooth"] = 104] = "bluetooth";
            MdIcon[MdIcon["bluetooth_connected"] = 105] = "bluetooth_connected";
            MdIcon[MdIcon["flash_on"] = 106] = "flash_on";
            MdIcon[MdIcon["flash_off"] = 107] = "flash_off";
            MdIcon[MdIcon["restaurant_menu"] = 108] = "restaurant_menu";
            MdIcon[MdIcon["satellite"] = 109] = "satellite";
            MdIcon[MdIcon["store_mall_directory"] = 110] = "store_mall_directory";
            MdIcon[MdIcon["streetview"] = 111] = "streetview";
            MdIcon[MdIcon["subway"] = 112] = "subway";
            MdIcon[MdIcon["terrain"] = 113] = "terrain";
            MdIcon[MdIcon["traffic"] = 114] = "traffic";
            MdIcon[MdIcon["train"] = 115] = "train";
            MdIcon[MdIcon["tram"] = 116] = "tram";
            MdIcon[MdIcon["check_box"] = 117] = "check_box";
            MdIcon[MdIcon["check_box_outline_blank"] = 118] = "check_box_outline_blank";
            MdIcon[MdIcon["indeterminate_check_box"] = 119] = "indeterminate_check_box";
            MdIcon[MdIcon["radio_button_checked"] = 120] = "radio_button_checked";
            MdIcon[MdIcon["radio_button_unchecked"] = 121] = "radio_button_unchecked";
            MdIcon[MdIcon["star"] = 122] = "star";
            MdIcon[MdIcon["star_border"] = 123] = "star_border";
            MdIcon[MdIcon["map"] = 124] = "map";
            MdIcon[MdIcon["transfer_within_a_station"] = 125] = "transfer_within_a_station";
            MdIcon[MdIcon["zoom_out_map"] = 126] = "zoom_out_map";
            MdIcon[MdIcon["apps"] = 127] = "apps";
            MdIcon[MdIcon["arrow_back"] = 128] = "arrow_back";
            MdIcon[MdIcon["arrow_downward"] = 129] = "arrow_downward";
            MdIcon[MdIcon["school"] = 130] = "school";
            MdIcon[MdIcon["sentiment_dissatisfied"] = 131] = "sentiment_dissatisfied";
            MdIcon[MdIcon["sentiment_neutral"] = 132] = "sentiment_neutral";
            MdIcon[MdIcon["sentiment_satisfied"] = 133] = "sentiment_satisfied";
            MdIcon[MdIcon["sentiment_very_dissatisfied"] = 134] = "sentiment_very_dissatisfied";
            MdIcon[MdIcon["sentiment_very_satisfied"] = 135] = "sentiment_very_satisfied";
            MdIcon[MdIcon["share"] = 136] = "share";
            MdIcon[MdIcon["whatshot"] = 137] = "whatshot";
            MdIcon[MdIcon["local_taxi"] = 138] = "local_taxi";
            MdIcon[MdIcon["add_to_photos"] = 139] = "add_to_photos";
            MdIcon[MdIcon["add_a_photo"] = 140] = "add_a_photo";
            MdIcon[MdIcon["watch"] = 141] = "watch";
            MdIcon[MdIcon["videogame_asset"] = 142] = "videogame_asset";
            MdIcon[MdIcon["tv"] = 143] = "tv";
            MdIcon[MdIcon["local_activity"] = 144] = "local_activity";
            MdIcon[MdIcon["star_half"] = 145] = "star_half";
            MdIcon[MdIcon["local_atm"] = 146] = "local_atm";
            MdIcon[MdIcon["local_bar"] = 147] = "local_bar";
            MdIcon[MdIcon["local_cafe"] = 148] = "local_cafe";
            MdIcon[MdIcon["local_car_wash"] = 149] = "local_car_wash";
            MdIcon[MdIcon["local_convenience_store"] = 150] = "local_convenience_store";
            MdIcon[MdIcon["add_location"] = 151] = "add_location";
            MdIcon[MdIcon["fullscreen_exit"] = 152] = "fullscreen_exit";
            MdIcon[MdIcon["fullscreen"] = 153] = "fullscreen";
            MdIcon[MdIcon["first_page"] = 154] = "first_page";
            MdIcon[MdIcon["expand_more"] = 155] = "expand_more";
            MdIcon[MdIcon["child_care"] = 156] = "child_care";
            MdIcon[MdIcon["notifications"] = 157] = "notifications";
            MdIcon[MdIcon["notifications_active"] = 158] = "notifications_active";
            MdIcon[MdIcon["notifications_none"] = 159] = "notifications_none";
            MdIcon[MdIcon["notifications_off"] = 160] = "notifications_off";
            MdIcon[MdIcon["notifications_paused"] = 161] = "notifications_paused";
            MdIcon[MdIcon["arrow_drop_down"] = 162] = "arrow_drop_down";
            MdIcon[MdIcon["local_see"] = 163] = "local_see";
            MdIcon[MdIcon["local_shipping"] = 164] = "local_shipping";
            MdIcon[MdIcon["cake"] = 165] = "cake";
            MdIcon[MdIcon["domain"] = 166] = "domain";
            MdIcon[MdIcon["group"] = 167] = "group";
            MdIcon[MdIcon["group_add"] = 168] = "group_add";
            MdIcon[MdIcon["content_cut"] = 169] = "content_cut";
            MdIcon[MdIcon["content_paste"] = 170] = "content_paste";
            MdIcon[MdIcon["create"] = 171] = "create";
            MdIcon[MdIcon["delete_sweep"] = 172] = "delete_sweep";
            MdIcon[MdIcon["smoke_free"] = 173] = "smoke_free";
            MdIcon[MdIcon["smoking_rooms"] = 174] = "smoking_rooms";
            MdIcon[MdIcon["spa"] = 175] = "spa";
            MdIcon[MdIcon["image_aspect_ratio"] = 176] = "image_aspect_ratio";
            MdIcon[MdIcon["image"] = 177] = "image";
            MdIcon[MdIcon["healing"] = 178] = "healing";
            MdIcon[MdIcon["hdr_weak"] = 179] = "hdr_weak";
            MdIcon[MdIcon["hdr_strong"] = 180] = "hdr_strong";
            MdIcon[MdIcon["hdr_on"] = 181] = "hdr_on";
            MdIcon[MdIcon["hdr_off"] = 182] = "hdr_off";
            MdIcon[MdIcon["grid_on"] = 183] = "grid_on";
            MdIcon[MdIcon["directions_railway"] = 184] = "directions_railway";
            MdIcon[MdIcon["directions_run"] = 185] = "directions_run";
            MdIcon[MdIcon["directions_subway"] = 186] = "directions_subway";
            MdIcon[MdIcon["directions_transit"] = 187] = "directions_transit";
            MdIcon[MdIcon["directions_walk"] = 188] = "directions_walk";
            MdIcon[MdIcon["edit_location"] = 189] = "edit_location";
            MdIcon[MdIcon["ev_station"] = 190] = "ev_station";
            MdIcon[MdIcon["flight"] = 191] = "flight";
            MdIcon[MdIcon["hotel"] = 192] = "hotel";
            MdIcon[MdIcon["unarchive"] = 193] = "unarchive";
            MdIcon[MdIcon["undo"] = 194] = "undo";
            MdIcon[MdIcon["weekend"] = 195] = "weekend";
            MdIcon[MdIcon["access_alarm"] = 196] = "access_alarm";
            MdIcon[MdIcon["access_alarms"] = 197] = "access_alarms";
            MdIcon[MdIcon["access_time"] = 198] = "access_time";
            MdIcon[MdIcon["add_alarm"] = 199] = "add_alarm";
            MdIcon[MdIcon["airplanemode_active"] = 200] = "airplanemode_active";
            MdIcon[MdIcon["airplanemode_inactive"] = 201] = "airplanemode_inactive";
            MdIcon[MdIcon["restaurant"] = 202] = "restaurant";
            MdIcon[MdIcon["directions_boat"] = 203] = "directions_boat";
            MdIcon[MdIcon["directions_bike"] = 204] = "directions_bike";
            MdIcon[MdIcon["directions"] = 205] = "directions";
            MdIcon[MdIcon["beenhere"] = 206] = "beenhere";
            MdIcon[MdIcon["business_center"] = 207] = "business_center";
            MdIcon[MdIcon["beach_access"] = 208] = "beach_access";
            MdIcon[MdIcon["all_inclusive"] = 209] = "all_inclusive";
            MdIcon[MdIcon["airport_shuttle"] = 210] = "airport_shuttle";
            MdIcon[MdIcon["ac_unit"] = 211] = "ac_unit";
            MdIcon[MdIcon["wifi"] = 212] = "wifi";
            MdIcon[MdIcon["wc"] = 213] = "wc";
            MdIcon[MdIcon["vpn_lock"] = 214] = "vpn_lock";
            MdIcon[MdIcon["format_textdirection_l_to_r"] = 215] = "format_textdirection_l_to_r";
            MdIcon[MdIcon["grid_off"] = 216] = "grid_off";
            MdIcon[MdIcon["grain"] = 217] = "grain";
            MdIcon[MdIcon["gradient"] = 218] = "gradient";
            MdIcon[MdIcon["flip"] = 219] = "flip";
            MdIcon[MdIcon["local_parking"] = 220] = "local_parking";
            MdIcon[MdIcon["local_offer"] = 221] = "local_offer";
            MdIcon[MdIcon["local_movies"] = 222] = "local_movies";
            MdIcon[MdIcon["local_mall"] = 223] = "local_mall";
            MdIcon[MdIcon["battery_alert"] = 224] = "battery_alert";
            MdIcon[MdIcon["battery_charging_full"] = 225] = "battery_charging_full";
            MdIcon[MdIcon["battery_full"] = 226] = "battery_full";
            MdIcon[MdIcon["battery_std"] = 227] = "battery_std";
            MdIcon[MdIcon["public"] = 228] = "public";
            MdIcon[MdIcon["poll"] = 229] = "poll";
            MdIcon[MdIcon["plus_one"] = 230] = "plus_one";
            MdIcon[MdIcon["person_outline"] = 231] = "person_outline";
            MdIcon[MdIcon["person_add"] = 232] = "person_add";
            MdIcon[MdIcon["person"] = 233] = "person";
            MdIcon[MdIcon["people_outline"] = 234] = "people_outline";
            MdIcon[MdIcon["people"] = 235] = "people";
            MdIcon[MdIcon["party_mode"] = 236] = "party_mode";
            MdIcon[MdIcon["pages"] = 237] = "pages";
            MdIcon[MdIcon["remove_circle_outline"] = 238] = "remove_circle_outline";
            MdIcon[MdIcon["flare"] = 239] = "flare";
            MdIcon[MdIcon["filter_vintage"] = 240] = "filter_vintage";
            MdIcon[MdIcon["filter_tilt_shift"] = 241] = "filter_tilt_shift";
            MdIcon[MdIcon["adb"] = 242] = "adb";
            MdIcon[MdIcon["airline_seat_flat"] = 243] = "airline_seat_flat";
            MdIcon[MdIcon["airline_seat_flat_angled"] = 244] = "airline_seat_flat_angled";
            MdIcon[MdIcon["airline_seat_individual_suite"] = 245] = "airline_seat_individual_suite";
            MdIcon[MdIcon["airline_seat_legroom_extra"] = 246] = "airline_seat_legroom_extra";
            MdIcon[MdIcon["airline_seat_legroom_normal"] = 247] = "airline_seat_legroom_normal";
            MdIcon[MdIcon["airline_seat_legroom_reduced"] = 248] = "airline_seat_legroom_reduced";
            MdIcon[MdIcon["airline_seat_recline_extra"] = 249] = "airline_seat_recline_extra";
            MdIcon[MdIcon["airline_seat_recline_normal"] = 250] = "airline_seat_recline_normal";
            MdIcon[MdIcon["cast"] = 251] = "cast";
            MdIcon[MdIcon["cast_connected"] = 252] = "cast_connected";
            MdIcon[MdIcon["computer"] = 253] = "computer";
            MdIcon[MdIcon["desktop_mac"] = 254] = "desktop_mac";
            MdIcon[MdIcon["arrow_drop_down_circle"] = 255] = "arrow_drop_down_circle";
            MdIcon[MdIcon["arrow_drop_up"] = 256] = "arrow_drop_up";
            MdIcon[MdIcon["arrow_forward"] = 257] = "arrow_forward";
            MdIcon[MdIcon["arrow_upward"] = 258] = "arrow_upward";
            MdIcon[MdIcon["cancel"] = 259] = "cancel";
            MdIcon[MdIcon["check"] = 260] = "check";
            MdIcon[MdIcon["chevron_left"] = 261] = "chevron_left";
            MdIcon[MdIcon["chevron_right"] = 262] = "chevron_right";
            MdIcon[MdIcon["close"] = 263] = "close";
            MdIcon[MdIcon["expand_less"] = 264] = "expand_less";
            MdIcon[MdIcon["bluetooth_disabled"] = 265] = "bluetooth_disabled";
            MdIcon[MdIcon["bluetooth_searching"] = 266] = "bluetooth_searching";
            MdIcon[MdIcon["brightness_auto"] = 267] = "brightness_auto";
            MdIcon[MdIcon["brightness_high"] = 268] = "brightness_high";
            MdIcon[MdIcon["brightness_low"] = 269] = "brightness_low";
            MdIcon[MdIcon["brightness_medium"] = 270] = "brightness_medium";
            MdIcon[MdIcon["data_usage"] = 271] = "data_usage";
            MdIcon[MdIcon["developer_mode"] = 272] = "developer_mode";
            MdIcon[MdIcon["devices"] = 273] = "devices";
            MdIcon[MdIcon["dvr"] = 274] = "dvr";
            MdIcon[MdIcon["gps_fixed"] = 275] = "gps_fixed";
            MdIcon[MdIcon["gps_not_fixed"] = 276] = "gps_not_fixed";
            MdIcon[MdIcon["gps_off"] = 277] = "gps_off";
            MdIcon[MdIcon["graphic_eq"] = 278] = "graphic_eq";
            MdIcon[MdIcon["location_disabled"] = 279] = "location_disabled";
            MdIcon[MdIcon["location_searching"] = 280] = "location_searching";
            MdIcon[MdIcon["network_cell"] = 281] = "network_cell";
            MdIcon[MdIcon["network_wifi"] = 282] = "network_wifi";
            MdIcon[MdIcon["nfc"] = 283] = "nfc";
            MdIcon[MdIcon["screen_lock_landscape"] = 284] = "screen_lock_landscape";
            MdIcon[MdIcon["screen_lock_portrait"] = 285] = "screen_lock_portrait";
            MdIcon[MdIcon["screen_lock_rotation"] = 286] = "screen_lock_rotation";
            MdIcon[MdIcon["screen_rotation"] = 287] = "screen_rotation";
            MdIcon[MdIcon["sd_storage"] = 288] = "sd_storage";
            MdIcon[MdIcon["settings_system_daydream"] = 289] = "settings_system_daydream";
            MdIcon[MdIcon["signal_cellular_4_bar"] = 290] = "signal_cellular_4_bar";
            MdIcon[MdIcon["signal_cellular_connected_no_internet_4_bar"] = 291] = "signal_cellular_connected_no_internet_4_bar";
            MdIcon[MdIcon["signal_cellular_no_sim"] = 292] = "signal_cellular_no_sim";
            MdIcon[MdIcon["signal_cellular_null"] = 293] = "signal_cellular_null";
            MdIcon[MdIcon["signal_cellular_off"] = 294] = "signal_cellular_off";
            MdIcon[MdIcon["signal_wifi_4_bar"] = 295] = "signal_wifi_4_bar";
            MdIcon[MdIcon["signal_wifi_4_bar_lock"] = 296] = "signal_wifi_4_bar_lock";
            MdIcon[MdIcon["signal_wifi_off"] = 297] = "signal_wifi_off";
            MdIcon[MdIcon["storage"] = 298] = "storage";
            MdIcon[MdIcon["usb"] = 299] = "usb";
            MdIcon[MdIcon["wallpaper"] = 300] = "wallpaper";
            MdIcon[MdIcon["widgets"] = 301] = "widgets";
            MdIcon[MdIcon["wifi_lock"] = 302] = "wifi_lock";
            MdIcon[MdIcon["wifi_tethering"] = 303] = "wifi_tethering";
            MdIcon[MdIcon["attach_file"] = 304] = "attach_file";
            MdIcon[MdIcon["attach_money"] = 305] = "attach_money";
            MdIcon[MdIcon["border_all"] = 306] = "border_all";
            MdIcon[MdIcon["border_bottom"] = 307] = "border_bottom";
            MdIcon[MdIcon["border_clear"] = 308] = "border_clear";
            MdIcon[MdIcon["border_color"] = 309] = "border_color";
            MdIcon[MdIcon["border_horizontal"] = 310] = "border_horizontal";
            MdIcon[MdIcon["border_inner"] = 311] = "border_inner";
            MdIcon[MdIcon["border_left"] = 312] = "border_left";
            MdIcon[MdIcon["border_outer"] = 313] = "border_outer";
            MdIcon[MdIcon["border_right"] = 314] = "border_right";
            MdIcon[MdIcon["border_style"] = 315] = "border_style";
            MdIcon[MdIcon["border_top"] = 316] = "border_top";
            MdIcon[MdIcon["border_vertical"] = 317] = "border_vertical";
            MdIcon[MdIcon["bubble_chart"] = 318] = "bubble_chart";
            MdIcon[MdIcon["drag_handle"] = 319] = "drag_handle";
            MdIcon[MdIcon["format_align_center"] = 320] = "format_align_center";
            MdIcon[MdIcon["format_align_justify"] = 321] = "format_align_justify";
            MdIcon[MdIcon["format_align_left"] = 322] = "format_align_left";
            MdIcon[MdIcon["format_align_right"] = 323] = "format_align_right";
            MdIcon[MdIcon["format_bold"] = 324] = "format_bold";
            MdIcon[MdIcon["format_clear"] = 325] = "format_clear";
            MdIcon[MdIcon["format_color_fill"] = 326] = "format_color_fill";
            MdIcon[MdIcon["format_color_reset"] = 327] = "format_color_reset";
            MdIcon[MdIcon["format_color_text"] = 328] = "format_color_text";
            MdIcon[MdIcon["format_indent_decrease"] = 329] = "format_indent_decrease";
            MdIcon[MdIcon["format_indent_increase"] = 330] = "format_indent_increase";
            MdIcon[MdIcon["sim_card_alert"] = 331] = "sim_card_alert";
            MdIcon[MdIcon["sd_card"] = 332] = "sd_card";
            MdIcon[MdIcon["priority_high"] = 333] = "priority_high";
            MdIcon[MdIcon["power"] = 334] = "power";
            MdIcon[MdIcon["phone_paused"] = 335] = "phone_paused";
            MdIcon[MdIcon["phone_missed"] = 336] = "phone_missed";
            MdIcon[MdIcon["phone_locked"] = 337] = "phone_locked";
            MdIcon[MdIcon["phone_in_talk"] = 338] = "phone_in_talk";
            MdIcon[MdIcon["phone_forwarded"] = 339] = "phone_forwarded";
            MdIcon[MdIcon["phone_bluetooth_speaker"] = 340] = "phone_bluetooth_speaker";
            MdIcon[MdIcon["personal_video"] = 341] = "personal_video";
            MdIcon[MdIcon["ondemand_video"] = 342] = "ondemand_video";
            MdIcon[MdIcon["no_encryption"] = 343] = "no_encryption";
            MdIcon[MdIcon["network_locked"] = 344] = "network_locked";
            MdIcon[MdIcon["network_check"] = 345] = "network_check";
            MdIcon[MdIcon["more"] = 346] = "more";
            MdIcon[MdIcon["mms"] = 347] = "mms";
            MdIcon[MdIcon["live_tv"] = 348] = "live_tv";
            MdIcon[MdIcon["folder_special"] = 349] = "folder_special";
            MdIcon[MdIcon["event_note"] = 350] = "event_note";
            MdIcon[MdIcon["event_busy"] = 351] = "event_busy";
            MdIcon[MdIcon["event_available"] = 352] = "event_available";
            MdIcon[MdIcon["enhanced_encryption"] = 353] = "enhanced_encryption";
            MdIcon[MdIcon["drive_eta"] = 354] = "drive_eta";
            MdIcon[MdIcon["do_not_disturb_on"] = 355] = "do_not_disturb_on";
            MdIcon[MdIcon["do_not_disturb_off"] = 356] = "do_not_disturb_off";
            MdIcon[MdIcon["do_not_disturb_alt"] = 357] = "do_not_disturb_alt";
            MdIcon[MdIcon["do_not_disturb"] = 358] = "do_not_disturb";
            MdIcon[MdIcon["fiber_smart_record"] = 359] = "fiber_smart_record";
            MdIcon[MdIcon["forward_10"] = 360] = "forward_10";
            MdIcon[MdIcon["forward_30"] = 361] = "forward_30";
            MdIcon[MdIcon["forward_5"] = 362] = "forward_5";
            MdIcon[MdIcon["games"] = 363] = "games";
            MdIcon[MdIcon["hd"] = 364] = "hd";
            MdIcon[MdIcon["hearing"] = 365] = "hearing";
            MdIcon[MdIcon["high_quality"] = 366] = "high_quality";
            MdIcon[MdIcon["library_add"] = 367] = "library_add";
            MdIcon[MdIcon["library_books"] = 368] = "library_books";
            MdIcon[MdIcon["library_music"] = 369] = "library_music";
            MdIcon[MdIcon["loop"] = 370] = "loop";
            MdIcon[MdIcon["mic"] = 371] = "mic";
            MdIcon[MdIcon["mic_none"] = 372] = "mic_none";
            MdIcon[MdIcon["mic_off"] = 373] = "mic_off";
            MdIcon[MdIcon["movie"] = 374] = "movie";
            MdIcon[MdIcon["music_video"] = 375] = "music_video";
            MdIcon[MdIcon["new_releases"] = 376] = "new_releases";
            MdIcon[MdIcon["not_interested"] = 377] = "not_interested";
            MdIcon[MdIcon["note"] = 378] = "note";
            MdIcon[MdIcon["pause"] = 379] = "pause";
            MdIcon[MdIcon["pause_circle_filled"] = 380] = "pause_circle_filled";
            MdIcon[MdIcon["pause_circle_outline"] = 381] = "pause_circle_outline";
            MdIcon[MdIcon["play_arrow"] = 382] = "play_arrow";
            MdIcon[MdIcon["play_circle_filled"] = 383] = "play_circle_filled";
            MdIcon[MdIcon["play_circle_outline"] = 384] = "play_circle_outline";
            MdIcon[MdIcon["playlist_add"] = 385] = "playlist_add";
            MdIcon[MdIcon["playlist_add_check"] = 386] = "playlist_add_check";
            MdIcon[MdIcon["playlist_play"] = 387] = "playlist_play";
            MdIcon[MdIcon["queue"] = 388] = "queue";
            MdIcon[MdIcon["queue_music"] = 389] = "queue_music";
            MdIcon[MdIcon["queue_play_next"] = 390] = "queue_play_next";
            MdIcon[MdIcon["radio"] = 391] = "radio";
            MdIcon[MdIcon["recent_actors"] = 392] = "recent_actors";
            MdIcon[MdIcon["remove_from_queue"] = 393] = "remove_from_queue";
            MdIcon[MdIcon["repeat"] = 394] = "repeat";
            MdIcon[MdIcon["repeat_one"] = 395] = "repeat_one";
            MdIcon[MdIcon["replay"] = 396] = "replay";
            MdIcon[MdIcon["replay_10"] = 397] = "replay_10";
            MdIcon[MdIcon["replay_30"] = 398] = "replay_30";
            MdIcon[MdIcon["replay_5"] = 399] = "replay_5";
            MdIcon[MdIcon["shuffle"] = 400] = "shuffle";
            MdIcon[MdIcon["skip_next"] = 401] = "skip_next";
            MdIcon[MdIcon["skip_previous"] = 402] = "skip_previous";
            MdIcon[MdIcon["slow_motion_video"] = 403] = "slow_motion_video";
            MdIcon[MdIcon["snooze"] = 404] = "snooze";
            MdIcon[MdIcon["sort_by_alpha"] = 405] = "sort_by_alpha";
            MdIcon[MdIcon["stop"] = 406] = "stop";
            MdIcon[MdIcon["subscriptions"] = 407] = "subscriptions";
            MdIcon[MdIcon["subtitles"] = 408] = "subtitles";
            MdIcon[MdIcon["surround_sound"] = 409] = "surround_sound";
            MdIcon[MdIcon["video_call"] = 410] = "video_call";
            MdIcon[MdIcon["video_label"] = 411] = "video_label";
            MdIcon[MdIcon["video_library"] = 412] = "video_library";
            MdIcon[MdIcon["videocam"] = 413] = "videocam";
            MdIcon[MdIcon["videocam_off"] = 414] = "videocam_off";
            MdIcon[MdIcon["volume_down"] = 415] = "volume_down";
            MdIcon[MdIcon["volume_mute"] = 416] = "volume_mute";
            MdIcon[MdIcon["volume_off"] = 417] = "volume_off";
            MdIcon[MdIcon["volume_up"] = 418] = "volume_up";
            MdIcon[MdIcon["web"] = 419] = "web";
            MdIcon[MdIcon["web_asset"] = 420] = "web_asset";
            MdIcon[MdIcon["business"] = 421] = "business";
            MdIcon[MdIcon["call"] = 422] = "call";
            MdIcon[MdIcon["call_end"] = 423] = "call_end";
            MdIcon[MdIcon["call_made"] = 424] = "call_made";
            MdIcon[MdIcon["call_merge"] = 425] = "call_merge";
            MdIcon[MdIcon["call_missed"] = 426] = "call_missed";
            MdIcon[MdIcon["call_missed_outgoing"] = 427] = "call_missed_outgoing";
            MdIcon[MdIcon["call_received"] = 428] = "call_received";
            MdIcon[MdIcon["call_split"] = 429] = "call_split";
            MdIcon[MdIcon["chat"] = 430] = "chat";
            MdIcon[MdIcon["chat_bubble"] = 431] = "chat_bubble";
            MdIcon[MdIcon["chat_bubble_outline"] = 432] = "chat_bubble_outline";
            MdIcon[MdIcon["clear_all"] = 433] = "clear_all";
            MdIcon[MdIcon["comment"] = 434] = "comment";
            MdIcon[MdIcon["contact_mail"] = 435] = "contact_mail";
            MdIcon[MdIcon["contact_phone"] = 436] = "contact_phone";
            MdIcon[MdIcon["contacts"] = 437] = "contacts";
            MdIcon[MdIcon["dialer_sip"] = 438] = "dialer_sip";
            MdIcon[MdIcon["dns"] = 439] = "dns";
            MdIcon[MdIcon["delete"] = 440] = "delete";
            MdIcon[MdIcon["delete_forever"] = 441] = "delete_forever";
        })(MdIcon = resources.MdIcon || (resources.MdIcon = {}));
        Services_4.Load(resources.GData.requester);
    })(resources = exports.resources || (exports.resources = {}));
    var Common;
    (function (Common) {
        var ServerStat;
        (function (ServerStat) {
            ServerStat[ServerStat["Undefinned"] = 0] = "Undefinned";
            ServerStat[ServerStat["UnAvaible"] = 1] = "UnAvaible";
            ServerStat[ServerStat["Connecting"] = 2] = "Connecting";
            ServerStat[ServerStat["Disconnected"] = 14] = "Disconnected";
            ServerStat[ServerStat["Connected"] = 22] = "Connected";
        })(ServerStat = Common.ServerStat || (Common.ServerStat = {}));
    })(Common = exports.Common || (exports.Common = {}));
});
define("Mobile/Common", ["require", "exports", "../lib/q/sys/Corelib", "Mobile/Resources", "Mobile/Core", "../lib/q/sys/UI"], function (require, exports, Corelib_28, Resources_2, Core_2, UI_35) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ArticleManager = (function () {
        function ArticleManager() {
        }
        ArticleManager.createNewArticle = function (f, p, count) {
            var _this = this;
            Resources_2.resources.GData.apis.Article.New(function (e) {
                var a = e.Data;
                if (a) {
                    a.Price = p.Value;
                    a.Owner = f;
                    p.CurrentArticle = a;
                    a.Product = p;
                    a.Price = p.Value || p.PValue || p.HWValue || p.WValue;
                    f.Articles.Add(a);
                    _this.saveArticle(f, a, count);
                }
                else
                    alert('failed to create new article');
            });
        };
        ArticleManager.saveArticle = function (f, a, count) {
            var bc = a.CreateBackup();
            a.Count = count;
            if (count)
                Resources_2.resources.GData.apis.Article.Save(a, function (e) {
                    if (e.Error == Corelib_28.basic.DataStat.Success) {
                        a.Commit(bc);
                    }
                    else {
                        alert('L\'article n\'est pas sauvegarder');
                        a.Rollback(bc);
                    }
                });
            else
                Resources_2.resources.GData.apis.Article.Delete(a, function (e) {
                    if (e.Error == Corelib_28.basic.DataStat.Success) {
                        a.Commit(bc);
                        f.Articles.Remove(a);
                        a.Product.CurrentArticle = null;
                    }
                    else {
                        alert('L\'article n\'est pas sauvegarder');
                        a.Rollback(bc);
                    }
                });
        };
        ArticleManager.deleteArticle = function (f, a, bc) {
            Resources_2.resources.GData.apis.Article.Delete(a, function (e) {
                if (e.Error == Corelib_28.basic.DataStat.Success) {
                    if (bc)
                        a.Commit(bc);
                    f.Articles.Remove(a);
                    a.Product.CurrentArticle = null;
                }
                else {
                    alert('L\'article n\'est pas supprimer');
                    if (bc)
                        a.Rollback(bc);
                }
            });
        };
        ArticleManager.editArticle = function (f, a, p) {
            var _this = this;
            if (!p || !f)
                return;
            this.t.Open((a && a.Count) || 0, true);
            if (f.IsOpen)
                this.t.OnClosed.Add(function (s, count, is) {
                    if (!is)
                        return;
                    if (!a)
                        _this.createNewArticle(f, p, count);
                    else
                        _this.saveArticle(f, a, count);
                });
        };
        ArticleManager.t = new Core_2.controls.SimpleEdit(true);
        return ArticleManager;
    }());
    exports.ArticleManager = ArticleManager;
    var factureOpers = (function () {
        function factureOpers() {
        }
        factureOpers.prototype.Init = function (Facture, art, prd, t) {
            this.Facture = Facture;
            this.art = art;
            this.prd = prd;
            this.t = t;
        };
        factureOpers.prototype.OnOptionOpening = function () {
            var f = this.Facture;
            if (!f || !f.IsOpen || !this.prd)
                return;
            this.bl = this.art && this.art.CreateBackup();
            return true;
        };
        factureOpers.prototype.OnOptionExecuted = function (e) {
            var _this = this;
            var p = this.prd;
            var a = this.art;
            var f = this.Facture;
            if (f && f.IsOpen && p)
                if (e.Result == UI_35.UI.MessageResult.cancel) {
                    a && this.bl && a.Rollback(this.bl);
                    this.bl = null;
                    return;
                }
                else if (e.Result == UI_35.UI.MessageResult.Exit) {
                    e.Cancel = true;
                    var pop = e.Pop;
                    Resources_2.resources.GData.apis.Article.Save(p.CurrentArticle, function (a) {
                        if (a.Error == Corelib_28.basic.DataStat.Success) {
                            a.Data.Commit(_this.bl);
                            _this.bl = null;
                            f.Recalc();
                            UI_35.UI.InfoArea.push('The article wass successfully saved');
                            pop.Hide(UI_35.UI.MessageResult.cancel, null);
                        }
                        else {
                            alert("Error while saving the article");
                        }
                    });
                }
                else if (e.Result == UI_35.UI.MessageResult.ok) {
                    e.Cancel = e.Data.Title != 'delete_sweep' && e.Data.Title != 'unarchive';
                    if (a)
                        this.exec(a, e.Data);
                    else {
                        Resources_2.resources.GData.apis.Article.New(function (e1) {
                            var a = e1.Data;
                            if (a) {
                                a.Owner = f;
                                p.CurrentArticle = a;
                                a.Product = p;
                                a.Price = p.Value || p.PValue || p.HWValue || p.WValue;
                                _this.Facture.Articles.Add(a);
                                f.Recalc();
                                _this.exec(a, e.Data);
                            }
                            else
                                alert('failed to create new article');
                        });
                    }
                }
        };
        factureOpers.prototype.exec = function (a, o) {
            var f = this.Facture;
            if (o.Title == 'add')
                a.Count++;
            else if (o.Title == 'remove')
                a.Count--;
            else if (o.Title == 'unarchive')
                ArticleManager.editArticle(f, a, a && a.Product);
            else if (o.Title == 'delete_sweep') {
                ArticleManager.deleteArticle(f, a);
            }
        };
        return factureOpers;
    }());
    exports.factureOpers = factureOpers;
});
define("Mobile/Pages/Home", ["require", "exports", "Mobile/Core", "abstract/Models", "../../lib/q/sys/Corelib", "Mobile/Resources", "Mobile/Common", "../../lib/q/sys/UI", "../../lib/q/sys/Filters"], function (require, exports, Core_3, Models_38, Corelib_29, Resources_3, Common_24, UI_36, Filters_12) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Pages;
    (function (Pages) {
        var Home = (function (_super) {
            __extends(Home, _super);
            function Home(app) {
                var _this = _super.call(this, Resources_3.resources.mobile.get('home'), "Shop", "", 'home') || this;
                _this.app = app;
                _this.Products = Resources_3.resources.GData.__data.Products;
                _this.t = new Core_3.controls.SimpleEdit(true);
                _this.articleChanged = { Owner: _this, Invoke: _this.OnArticleChanged };
                _this.fop = new Common_24.factureOpers();
                return _this;
            }
            Home.__fields__ = function () { return [this.DPFacture]; };
            Home.prototype.initialize = function () {
                _super.prototype.initialize.call(this);
                this.Options.Add({ Title: 'Update', OnOptionClicked: this.Update.bind(this) });
            };
            Home.prototype.activeClass = function () { return "selectedProduct"; };
            Home.prototype.OnFullInitialized = function () { _super.prototype.OnFullInitialized.call(this); };
            Home.prototype.OnCompileEnd = function (cnt) {
                var _this = this;
                _super.prototype.OnCompileEnd.call(this, cnt);
                Resources_3.resources.GData.apis.Category.Update();
                Resources_3.resources.GData.requester.Request(Models_38.models.Products, "GETCSV", void 0, void 0, function (ths, json, iss, req) {
                    Resources_3.resources.GData.__data.Products.FromCsv(req.Response, Corelib_29.encoding.SerializationContext.GlobalContext);
                    _this.Items.Source = Resources_3.resources.GData.__data.Products;
                });
            };
            Home.prototype.Update = function () { this.SmartUpdate(); };
            Home.prototype.SmartUpdate = function (callback) {
                var prd = Resources_3.resources.GData.db.Get('Products');
                if (prd == null) {
                    Resources_3.resources.GData.db.CreateTable('Products', Models_38.models.Product);
                }
                prd.table.LoadTableFromDB(Resources_3.resources.GData.__data.Products, function () {
                    var dt = Date.now();
                    Resources_3.resources.GData.apis.Product.SmartUpdate(new Date(prd.info.LastUpdate || 0));
                });
            };
            Home.prototype.OnAttached = function () {
            };
            Home.prototype.FactureChanged = function (e) {
                this.unobserve(e._old);
                this.observe(e._new);
            };
            Home.prototype.unobserve = function (f) {
                if (f) {
                    f.UnObserve(Models_38.models.Facture.DPArticles, this.OnArticlesChanged);
                    this.rebuild(f.Articles, null);
                }
            };
            Home.prototype.observe = function (f) {
                if (f) {
                    f.Observe(Models_38.models.Facture.DPArticles, this.OnArticlesChanged, this);
                    this.rebuild(null, f.Articles);
                }
            };
            Home.prototype.OnArticlesChanged = function (s, e) {
                this.rebuild(e._old, e._new);
            };
            Home.prototype.rebuild = function (o, n) {
                if (o) {
                    o.Unlisten = this.articleChanged;
                    for (var i = o.Count - 1; i >= 0; i--) {
                        var p = void 0;
                        (p = (p = o.Get(i)) && p.Product) && (p.CurrentArticle = null);
                    }
                }
                if (n) {
                    n.Listen = this.articleChanged;
                    for (var i = n.Count - 1; i >= 0; i--) {
                        var a = n.Get(i);
                        var p = void 0;
                        (p = a && a.Product) && (p.CurrentArticle = a);
                    }
                }
            };
            Home.prototype.OnArticleChanged = function (e) {
                this.rebuild(this.Facture.Articles, this.Facture.Articles);
            };
            Home.prototype.exec = function (a, o) {
                debugger;
                if (o.Title == 'add')
                    a.Count++;
                else if (o.Title == 'remove')
                    a.Count--;
                else if (o.Title == 'unarchive') {
                    this.t;
                    Corelib_29.thread.Dispatcher.call(this, function (a) {
                        this.t.Open(a.Count);
                        this.t.OnClosed.Add(function (s, v, is) {
                            if (!is)
                                return;
                            a.Count = v;
                        });
                    }, a);
                }
                else if (o.Title == 'delete_sweep') {
                    a.Count = 0;
                }
            };
            Home.prototype.OnOptionOpening = function () {
                var f = this.Facture;
                var p = this.ListView.SelectedItem;
                if (!p)
                    return;
                this.fop.Init(this.Facture, p && p.CurrentArticle, p, this.t);
                return this.fop.OnOptionOpening();
            };
            Home.prototype.OnOptionExecuted = function (e) {
                var f = this.Facture;
                var p = this.ListView.SelectedItem;
                this.fop.Init(this.Facture, p && p.CurrentArticle, p, this.t);
                return this.fop.OnOptionExecuted(e);
            };
            Home.prototype.OnSweep = function (item) {
            };
            Home.DPFacture = Corelib_29.bind.DObject.CreateField("Facture", Models_38.models.Facture, null, Home.prototype.FactureChanged);
            return Home;
        }(Core_3.controls.abstracts.MobilePage));
        Pages.Home = Home;
        var Factures = (function (_super) {
            __extends(Factures, _super);
            function Factures(app) {
                var _this = _super.call(this, Resources_3.resources.mobile.get('factures'), "Factures", "", "library_books") || this;
                _this.app = app;
                return _this;
            }
            Factures.prototype.initialize = function () {
                debugger;
                _super.prototype.initialize.call(this);
                this.Options.Add({ Title: "Update ", OnOptionClicked: this.Update.bind(this) });
                this.Options.Add({ Title: "Ouvrir ", OnOptionClicked: this.ShowFacture.bind(this) });
                this.Options.Add({ Title: "Modifier ", OnOptionClicked: this.EditFacture.bind(this) });
                this.Options.Add({ Title: "Nouveau ", OnOptionClicked: this.NewFacture.bind(this) });
                this.Options.Add({ Title: "Delete ", OnOptionClicked: this.DeleteFacture.bind(this) });
                this.Items.Source = Resources_3.resources.GData.__data.Factures;
            };
            Factures.prototype.activeClass = function () { return "profile-cart-active"; };
            Factures.prototype.OnFullInitialized = function () { _super.prototype.OnFullInitialized.call(this); };
            Factures.prototype.OnCompileEnd = function (cnt) {
                _super.prototype.OnCompileEnd.call(this, cnt);
                Resources_3.resources.GData.apis.Client.Update();
                Resources_3.resources.GData.apis.Agent.Update();
                Resources_3.resources.GData.requester.Request(Models_38.models.Factures, "GETCSV", void 0, void 0, function (ths, json, iss, req) {
                    Resources_3.resources.GData.__data.Factures.FromCsv(req.Response, Corelib_29.encoding.SerializationContext.GlobalContext);
                });
            };
            Factures.prototype.OnDoubleTab = function (item) {
                this.app.ShowFacture(item);
            };
            Factures.prototype.Update = function () {
                Resources_3.resources.GData.apis.Facture.SmartUpdate();
            };
            Factures.prototype.NewFacture = function () {
                this.app.NewFacture();
            };
            Factures.prototype.DeleteFacture = function () {
                this.app.DeleteFacture();
            };
            Factures.prototype.ShowFacture = function () {
                this.app.ShowFacture(this.ListView.SelectedItem);
            };
            Factures.prototype.EditFacture = function () {
                this.app.OpenFacture(this.ListView.SelectedItem);
            };
            return Factures;
        }(Core_3.controls.abstracts.MobilePage));
        Pages.Factures = Factures;
        var Facture = (function (_super) {
            __extends(Facture, _super);
            function Facture(app) {
                var _this = _super.call(this, Resources_3.resources.mobile.get('facture'), "Facture", "", "receipt") || this;
                _this.app = app;
                _this.fop = new Common_24.factureOpers();
                _this.t = new Core_3.controls.SimpleEdit(true);
                _this.OnServerResponse = _this.OnServerResponse.bind(_this);
                return _this;
            }
            Facture.__fields__ = function () { return [this.DPSelectedFacture]; };
            Facture.prototype.initialize = function () {
                _super.prototype.initialize.call(this);
                this.Options.Add({ Title: 'Metre a jour', OnOptionClicked: this.Update.bind(this) });
                this.Options.Add({ Title: 'Modifier', OnOptionClicked: this.EditFacture.bind(this) });
                this.Options.Add({ Title: 'Ouvrir', OnOptionClicked: this.ShowFacture.bind(this) });
                this.Options.Add({ Title: 'Fermer', OnOptionClicked: this.CloseFacture.bind(this) });
            };
            Facture.prototype.activeClass = function () { return "selectedProduct"; };
            Facture.prototype.OnFullInitialized = function () { _super.prototype.OnFullInitialized.call(this); };
            Facture.prototype.Update = function () {
                if (this.SelectedFacture)
                    Resources_3.resources.GData.apis.Facture.UpdateArticlesOf(this.SelectedFacture, this.OnServerResponse);
            };
            Facture.prototype.DeleteFacture = function () {
                this.app.DeleteFacture();
            };
            Facture.prototype.ShowFacture = function () {
                this.app.ShowFacture(this.SelectedFacture);
            };
            Facture.prototype.CloseFacture = function () {
                this.app.CloseFacture(this.SelectedFacture);
            };
            Facture.prototype.EditFacture = function () {
                this.app.OpenFacture(this.SelectedFacture);
            };
            Facture.prototype.OnServerResponse = function (f, iss, c) {
                if (c !== Corelib_29.basic.DataStat.Success)
                    alert('Fail to load facture due to :' + Corelib_29.basic.DataStat[c]);
            };
            Facture.prototype.OnDoubleTab = function (a) {
                Common_24.ArticleManager.editArticle(this.SelectedFacture, a, a && a.Product);
            };
            Facture.prototype.saveArticle = function (a, count) {
                var bc = a.CreateBackup();
                var f = this.SelectedFacture;
                a.Count = count;
                if (count)
                    Resources_3.resources.GData.apis.Article.Save(a, function (e) {
                        if (e.Error == Corelib_29.basic.DataStat.Success) {
                            a.Commit(bc);
                        }
                        else {
                            alert('L\'article n\'est pas sauvegarder');
                            a.Rollback(bc);
                        }
                    });
                else
                    Resources_3.resources.GData.apis.Article.Delete(a, function (e) {
                        if (e.Error == Corelib_29.basic.DataStat.Success) {
                            a.Commit(bc);
                            f.Articles.Remove(a);
                            a.Product.CurrentArticle = null;
                        }
                        else {
                            alert('L\'article n\'est pas sauvegarder');
                            a.Rollback(bc);
                        }
                    });
            };
            Facture.prototype.OnFactureChanged = function (e) {
                var f = e._new;
                this.Items.Source = f && f.Articles;
                this.Update();
            };
            Facture.prototype.OnOptionOpening = function () {
                var f = this.SelectedFacture;
                var p = this.ListView.SelectedItem;
                if (!p)
                    return;
                this.fop.Init(f, p, p && p.Product, this.t);
                return this.fop.OnOptionOpening();
            };
            Facture.prototype.OnOptionExecuted = function (e) {
                var f = this.SelectedFacture;
                var a = this.ListView.SelectedItem;
                if (!a)
                    return;
                this.fop.Init(f, a, a.Product, this.t);
                return this.fop.OnOptionExecuted(e);
            };
            Facture.DPSelectedFacture = Corelib_29.bind.DObject.CreateField("SelectedFacture", Models_38.models.Facture, null, Facture.prototype.OnFactureChanged);
            return Facture;
        }(Core_3.controls.abstracts.MobilePage));
        Pages.Facture = Facture;
        var App = (function (_super) {
            __extends(App, _super);
            function App(teta) {
                var _this = _super.call(this, Resources_3.resources.mobile.get('app').content.firstElementChild, teta) || this;
                _this.list = Resources_3.resources.GData.__data.Costumers.Filtred(window['fltr'] = new Filters_12.filters.list.LStringFilter());
                _this.Foot = new UI_36.UI.ServiceNavBar(_this, true);
                return _this;
            }
            App.prototype.DeleteFacture = function () {
                throw new Error("Method not implemented.");
            };
            App.prototype.initialize = function () {
                debugger;
                _super.prototype.initialize.call(this);
                this.Items.Add(this.factures = new Pages.Factures(this));
                this.Items.Add(this.facture = new Pages.Facture(this));
                this.Items.Add(this.home = new Pages.Home(this));
                this.__Controller__.OnCompiled = {
                    Owner: this, Invoke: this.OnFullCompilled
                };
                this.dbHfFf = new Corelib_29.bind.TwoDBind(Corelib_29.bind.BindingMode.TwoWay, this.home, this.facture, Home.DPFacture, Facture.DPSelectedFacture, function (a) { return a; }, function (a) { return a; });
                this.initApis();
            };
            App.prototype.OnFullCompilled = function (t) {
                this.SelectedPage = this.home;
            };
            App.prototype.ShowFacture = function (facture) {
                this.facture.SelectedFacture = facture;
                this.SelectedPage = this.facture;
            };
            App.prototype.EditFacture = function (facture) {
                this.facture.SelectedFacture = facture;
                this.SelectedPage = this.home;
            };
            App.prototype.OpenFacture = function (f) {
                var _this = this;
                if (!f)
                    return;
                Resources_3.resources.GData.apis.Facture.OpenFacture(f, function (item, su) {
                    if (su) {
                        item.IsOpen = true;
                        _this.EditFacture(item);
                        UI_36.UI.InfoArea.push("La Facture est bien ouvrir", true);
                    }
                    else
                        alert("Failed to open facture .Sory");
                });
            };
            App.prototype.CloseFacture = function (f) {
                if (!f)
                    return;
                Resources_3.resources.GData.apis.Facture.CloseFacture(f, function (item, su) {
                    if (su) {
                        UI_36.UI.InfoArea.push("La Facture est bien fermer", true);
                        item.IsOpen = false;
                    }
                    else
                        alert("Failed to close facture .Sory");
                });
            };
            App.prototype.initializeNF = function () {
                var _this = this;
                this.t = new Core_3.controls.Pop(true);
                var d = new UI_36.UI.TControl('mobile.newFacture', {
                    data: this.list, OkClicked: function (a, b, c, d) {
                        _this.t.Hide(UI_36.UI.MessageResult.ok, void 0);
                    }, CancelClicked: function (a, b, c, d) {
                        _this.t.Hide(UI_36.UI.MessageResult.cancel, void 0);
                    }
                });
                d.setName = function (name, dom, cnt, e) {
                    if (name == 'ListView') {
                        _this.ListView = cnt;
                        _this.ListView.AcceptNullValue = true;
                    }
                };
                Resources_3.resources.GData.apis.Client.Update();
                this.t.Content = d;
            };
            App.prototype.NewFacture = function () {
                var _this = this;
                if (!this.t)
                    this.initializeNF();
                this.t.Open(function (e) {
                    if (e.Result == UI_36.UI.MessageResult.ok) {
                        var client = _this.ListView.SelectedItem;
                        if (!client) {
                            e.Cancel = true;
                            UI_36.UI.InfoArea.push("Select One Client Please");
                            return;
                        }
                        var f = new Models_38.models.Facture(0);
                        Resources_3.resources.GData.requester.Request(Models_38.models.Facture, "CREATE", f, { CId: client.Id, Type: Models_38.models.BonType.Bon, Abonment: Models_38.models.Abonment.Detaillant, TType: Models_38.models.TransactionType.Vente }, function (a, b, c) {
                            if (!c) {
                                UI_36.UI.InfoArea.push("Creation of Facture Failed");
                            }
                            else {
                                Resources_3.resources.GData.__data.Factures.Add(a.data);
                                _this.EditFacture(f);
                            }
                        });
                    }
                }, this);
            };
            App.prototype.initApis = function () {
                Corelib_29.bind.NamedScop.Create("qdata", Resources_3.resources.GData.__data);
                var self = this;
                Corelib_29.Api.RegisterApiCallback({
                    Name: "ShowFacture",
                    DoApiCallback: function (t, a, b) {
                        self.ShowFacture(b.data);
                    }
                });
                Corelib_29.Api.RegisterApiCallback({
                    Name: "OpenFacture",
                    DoApiCallback: function (t, a, b) {
                        self.OpenFacture(b.data);
                    }
                });
                Corelib_29.Api.RegisterApiCallback({
                    Name: "CloseFacture",
                    DoApiCallback: function (t, a, b) {
                        self.CloseFacture(b.data);
                    }
                });
            };
            return App;
        }(Core_3.controls.EMobileApp));
        Pages.App = App;
    })(Pages = exports.Pages || (exports.Pages = {}));
    Corelib_29.bind.Register({
        Name: "search",
        OnInitialize: function (j, e) {
            window['srch'] = this;
            var d = j.dom;
            if (!(d instanceof HTMLInputElement))
                console.debug("Un Expected Value Type");
            var fltr = j.Scop.Value;
            d.addEventListener(d.hasAttribute('autosearch') ? 'input' : 'change', function (e) {
                fltr.Filter.Patent = new Filters_12.filters.list.StringPatent(this.value.toString());
            });
        },
        Todo: function (j, e) {
        }
    });
});
define("Mobile/Main", ["require", "exports", "Mobile/Core", "abstract/QShopApis", "Mobile/Pages/Home", "../lib/q/sys/UI"], function (require, exports, Core_4, QShopApis_2, Home_1, UI_37) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    QShopApis_2.Apis.Load();
    var Teta = (function () {
        function Teta() {
            this.Setting = new Core_4.controls.Settings(this);
            this.Auth = new Core_4.controls.AuthApp(this);
            this.App = new Home_1.Pages.App(this);
            UI_37.UI.Spinner.Default.Pause();
            this.Setting.Show();
        }
        return Teta;
    }());
    exports.Teta = Teta;
    function initialize() {
        setTimeout(function () {
            new Teta();
        }, 0);
    }
    exports.initialize = initialize;
});
define("abstract/Printing", ["require", "exports", "../lib/Q/sys/Corelib"], function (require, exports, Corelib_30) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Printing;
    (function (Printing) {
        var PageSettings = (function (_super) {
            __extends(PageSettings, _super);
            function PageSettings() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Object.defineProperty(PageSettings.prototype, "Color", {
                get: function () { return this.get(PageSettings.DPColor); },
                set: function (v) { this.set(PageSettings.DPColor, v); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PageSettings.prototype, "Landscape", {
                get: function () { return this.get(PageSettings.DPLandscape); },
                set: function (v) { this.set(PageSettings.DPLandscape, v); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PageSettings.prototype, "Margins", {
                get: function () { return this.get(PageSettings.DPMargins); },
                set: function (v) { this.set(PageSettings.DPMargins, v); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PageSettings.prototype, "PaperSize", {
                get: function () { return this.get(PageSettings.DPPaperSize); },
                set: function (v) { this.set(PageSettings.DPPaperSize, v); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PageSettings.prototype, "PaperSource", {
                get: function () { return this.get(PageSettings.DPPaperSource); },
                set: function (v) { this.set(PageSettings.DPPaperSource, v); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PageSettings.prototype, "PrinterResolution", {
                get: function () { return this.get(PageSettings.DPPrinterResolution); },
                set: function (v) { this.set(PageSettings.DPPrinterResolution, v); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PageSettings.prototype, "PrinterSettings", {
                get: function () { return this.get(PageSettings.DPPrinterSettings); },
                set: function (v) { this.set(PageSettings.DPPrinterSettings, v); },
                enumerable: true,
                configurable: true
            });
            PageSettings.__fields__ = function () { return [this.DPColor, this.DPLandscape, this.DPMargins, this.DPPaperSize, this.DPPaperSource, this.DPPrinterResolution, this.DPPrinterSettings]; };
            PageSettings.ctor = function () {
                this.DPColor = Corelib_30.bind.DObject.CreateField("Color", Boolean);
                this.DPLandscape = Corelib_30.bind.DObject.CreateField("Landscape", Boolean);
                this.DPMargins = Corelib_30.bind.DObject.CreateField("Margins", Margins);
                this.DPPaperSize = Corelib_30.bind.DObject.CreateField("PaperSize", PaperSize);
                this.DPPaperSource = Corelib_30.bind.DObject.CreateField("PaperSource", PaperSource);
                this.DPPrinterResolution = Corelib_30.bind.DObject.CreateField("PrinterResolution", PrinterResolution);
                this.DPPrinterSettings = Corelib_30.bind.DObject.CreateField("PrinterSettings", PrinterSettings);
            };
            return PageSettings;
        }(Corelib_30.bind.DObject));
        Printing.PageSettings = PageSettings;
        var PaperSize = (function (_super) {
            __extends(PaperSize, _super);
            function PaperSize() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Object.defineProperty(PaperSize.prototype, "Height", {
                get: function () { return this.get(PaperSize.DPHeight); },
                set: function (v) { this.set(PaperSize.DPHeight, v); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PaperSize.prototype, "PaperName", {
                get: function () { return this.get(PaperSize.DPPaperName); },
                set: function (v) { this.set(PaperSize.DPPaperName, v); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PaperSize.prototype, "RawKind", {
                get: function () { return this.get(PaperSize.DPRawKind); },
                set: function (v) { this.set(PaperSize.DPRawKind, v); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PaperSize.prototype, "Width", {
                get: function () { return this.get(PaperSize.DPWidth); },
                set: function (v) { this.set(PaperSize.DPWidth, v); },
                enumerable: true,
                configurable: true
            });
            PaperSize.__fields__ = function () { return [this.DPHeight, this.DPPaperName, this.DPRawKind, this.DPWidth]; };
            PaperSize.ctor = function () {
                this.DPHeight = Corelib_30.bind.DObject.CreateField("Height", Number);
                this.DPPaperName = Corelib_30.bind.DObject.CreateField("PaperName", String);
                this.DPRawKind = Corelib_30.bind.DObject.CreateField("RawKind", Number);
                this.DPWidth = Corelib_30.bind.DObject.CreateField("Width", Number);
            };
            return PaperSize;
        }(Corelib_30.bind.DObject));
        Printing.PaperSize = PaperSize;
        var Margins = (function (_super) {
            __extends(Margins, _super);
            function Margins() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Object.defineProperty(Margins.prototype, "Left", {
                get: function () { return this.get(Margins.DPLeft); },
                set: function (v) { this.set(Margins.DPLeft, v); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Margins.prototype, "Right", {
                get: function () { return this.get(Margins.DPRight); },
                set: function (v) { this.set(Margins.DPRight, v); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Margins.prototype, "Top", {
                get: function () { return this.get(Margins.DPTop); },
                set: function (v) { this.set(Margins.DPTop, v); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Margins.prototype, "Bottom", {
                get: function () { return this.get(Margins.DPBottom); },
                set: function (v) { this.set(Margins.DPBottom, v); },
                enumerable: true,
                configurable: true
            });
            Margins.__fields__ = function () { return [this.DPLeft, this.DPRight, this.DPTop, this.DPBottom]; };
            Margins.ctor = function () {
                this.DPLeft = Corelib_30.bind.DObject.CreateField("Left", Number);
                this.DPRight = Corelib_30.bind.DObject.CreateField("Right", Number);
                this.DPTop = Corelib_30.bind.DObject.CreateField("Top", Number);
                this.DPBottom = Corelib_30.bind.DObject.CreateField("Bottom", Number);
            };
            return Margins;
        }(Corelib_30.bind.DObject));
        Printing.Margins = Margins;
        var PaperSource = (function (_super) {
            __extends(PaperSource, _super);
            function PaperSource() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Object.defineProperty(PaperSource.prototype, "RawKind", {
                get: function () { return this.get(PaperSource.DPRawKind); },
                set: function (v) { this.set(PaperSource.DPRawKind, v); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PaperSource.prototype, "SourceName", {
                get: function () { return this.get(PaperSource.DPSourceName); },
                set: function (v) { this.set(PaperSource.DPSourceName, v); },
                enumerable: true,
                configurable: true
            });
            PaperSource.__fields__ = function () { return [this.DPRawKind, this.DPSourceName]; };
            PaperSource.ctor = function () {
                this.DPRawKind = Corelib_30.bind.DObject.CreateField("RawKind", Number);
                this.DPSourceName = Corelib_30.bind.DObject.CreateField("SourceName", String);
            };
            return PaperSource;
        }(Corelib_30.bind.DObject));
        Printing.PaperSource = PaperSource;
        var PrinterResolution = (function (_super) {
            __extends(PrinterResolution, _super);
            function PrinterResolution() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Object.defineProperty(PrinterResolution.prototype, "Kind", {
                get: function () { return this.get(PrinterResolution.DPKind); },
                set: function (v) { this.set(PrinterResolution.DPKind, v); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PrinterResolution.prototype, "X", {
                get: function () { return this.get(PrinterResolution.DPX); },
                set: function (v) { this.set(PrinterResolution.DPX, v); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PrinterResolution.prototype, "Y", {
                get: function () { return this.get(PrinterResolution.DPY); },
                set: function (v) { this.set(PrinterResolution.DPY, v); },
                enumerable: true,
                configurable: true
            });
            PrinterResolution.__fields__ = function () { return [this.DPKind, this.DPX, this.DPY]; };
            PrinterResolution.ctor = function () {
                this.DPKind = Corelib_30.bind.DObject.CreateField("Kind", Number);
                this.DPX = Corelib_30.bind.DObject.CreateField("X", Number);
                this.DPY = Corelib_30.bind.DObject.CreateField("Y", Number);
            };
            return PrinterResolution;
        }(Corelib_30.bind.DObject));
        Printing.PrinterResolution = PrinterResolution;
        var PrinterResolutionKind;
        (function (PrinterResolutionKind) {
            PrinterResolutionKind[PrinterResolutionKind["High"] = -4] = "High";
            PrinterResolutionKind[PrinterResolutionKind["Medium"] = -3] = "Medium";
            PrinterResolutionKind[PrinterResolutionKind["Low"] = -2] = "Low";
            PrinterResolutionKind[PrinterResolutionKind["Draft"] = -1] = "Draft";
            PrinterResolutionKind[PrinterResolutionKind["Custom"] = 0] = "Custom";
        })(PrinterResolutionKind = Printing.PrinterResolutionKind || (Printing.PrinterResolutionKind = {}));
        var PrinterSettings = (function (_super) {
            __extends(PrinterSettings, _super);
            function PrinterSettings() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Object.defineProperty(PrinterSettings.prototype, "Copies", {
                get: function () { return this.get(PrinterSettings.DPCopies); },
                set: function (v) { this.set(PrinterSettings.DPCopies, v); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PrinterSettings.prototype, "Collate", {
                get: function () { return this.get(PrinterSettings.DPCollate); },
                set: function (v) { this.set(PrinterSettings.DPCollate, v); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PrinterSettings.prototype, "Duplex", {
                get: function () { return this.get(PrinterSettings.DPDuplex); },
                set: function (v) { this.set(PrinterSettings.DPDuplex, v); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PrinterSettings.prototype, "FromPage", {
                get: function () { return this.get(PrinterSettings.DPFromPage); },
                set: function (v) { this.set(PrinterSettings.DPFromPage, v); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PrinterSettings.prototype, "MaximumPage", {
                get: function () { return this.get(PrinterSettings.DPMaximumPage); },
                set: function (v) { this.set(PrinterSettings.DPMaximumPage, v); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PrinterSettings.prototype, "MinimumPage", {
                get: function () { return this.get(PrinterSettings.DPMinimumPage); },
                set: function (v) { this.set(PrinterSettings.DPMinimumPage, v); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PrinterSettings.prototype, "PrintFileName", {
                get: function () { return this.get(PrinterSettings.DPPrintFileName); },
                set: function (v) { this.set(PrinterSettings.DPPrintFileName, v); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PrinterSettings.prototype, "PrintRange", {
                get: function () { return this.get(PrinterSettings.DPPrintRange); },
                set: function (v) { this.set(PrinterSettings.DPPrintRange, v); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PrinterSettings.prototype, "PrintToFile", {
                get: function () { return this.get(PrinterSettings.DPPrintToFile); },
                set: function (v) { this.set(PrinterSettings.DPPrintToFile, v); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PrinterSettings.prototype, "PrinterName", {
                get: function () { return this.get(PrinterSettings.DPPrinterName); },
                set: function (v) { this.set(PrinterSettings.DPPrinterName, v); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PrinterSettings.prototype, "ToPage", {
                get: function () { return this.get(PrinterSettings.DPToPage); },
                set: function (v) { this.set(PrinterSettings.DPToPage, v); },
                enumerable: true,
                configurable: true
            });
            PrinterSettings.__fields__ = function () { return [this.DPCopies, this.DPCollate, this.DPDuplex, this.DPFromPage, this.DPMaximumPage, this.DPMinimumPage, this.DPPrintFileName, this.DPPrintRange, this.DPPrintToFile, this.DPPrinterName, this.DPToPage]; };
            PrinterSettings.ctor = function () {
                this.DPCopies = Corelib_30.bind.DObject.CreateField("Copies", Number);
                this.DPCollate = Corelib_30.bind.DObject.CreateField("Collate", Boolean);
                this.DPDuplex = Corelib_30.bind.DObject.CreateField("Duplex", Number);
                this.DPFromPage = Corelib_30.bind.DObject.CreateField("FromPage", Number);
                this.DPMaximumPage = Corelib_30.bind.DObject.CreateField("MaximumPage", Number);
                this.DPMinimumPage = Corelib_30.bind.DObject.CreateField("MinimumPage", Number);
                this.DPPrintFileName = Corelib_30.bind.DObject.CreateField("PrintFileName", String);
                this.DPPrintRange = Corelib_30.bind.DObject.CreateField("PrintRange", Number);
                this.DPPrintToFile = Corelib_30.bind.DObject.CreateField("PrintToFile", Boolean);
                this.DPPrinterName = Corelib_30.bind.DObject.CreateField("PrinterName", String);
                this.DPToPage = Corelib_30.bind.DObject.CreateField("ToPage", Number);
            };
            return PrinterSettings;
        }(Corelib_30.bind.DObject));
        Printing.PrinterSettings = PrinterSettings;
        var Duplex;
        (function (Duplex) {
            Duplex[Duplex["Default"] = -1] = "Default";
            Duplex[Duplex["Simplex"] = 1] = "Simplex";
            Duplex[Duplex["Vertical"] = 2] = "Vertical";
            Duplex[Duplex["Horizontal"] = 3] = "Horizontal";
        })(Duplex = Printing.Duplex || (Printing.Duplex = {}));
        var PrintRange;
        (function (PrintRange) {
            PrintRange[PrintRange["AllPages"] = 0] = "AllPages";
            PrintRange[PrintRange["Selection"] = 1] = "Selection";
            PrintRange[PrintRange["SomePages"] = 2] = "SomePages";
            PrintRange[PrintRange["CurrentPage"] = 4194304] = "CurrentPage";
        })(PrintRange = Printing.PrintRange || (Printing.PrintRange = {}));
        var PrintDocument = (function (_super) {
            __extends(PrintDocument, _super);
            function PrintDocument() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Object.defineProperty(PrintDocument.prototype, "Handler", {
                get: function () { return this.get(PrintDocument.DPHandler); },
                set: function (v) { this.set(PrintDocument.DPHandler, v); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PrintDocument.prototype, "OwnerId", {
                get: function () { return this.get(PrintDocument.DPOwnerId); },
                set: function (v) { this.set(PrintDocument.DPOwnerId, v); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PrintDocument.prototype, "Owner", {
                get: function () { return this.get(PrintDocument.DPOwner); },
                set: function (v) { this.set(PrintDocument.DPOwner, v); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PrintDocument.prototype, "Params", {
                get: function () { return this.get(PrintDocument.DPParams); },
                set: function (v) { this.set(PrintDocument.DPParams, v); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PrintDocument.prototype, "PrinterSettings", {
                get: function () { return this.get(PrintDocument.DPPrinterSettings); },
                set: function (v) { this.set(PrintDocument.DPPrinterSettings, v); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PrintDocument.prototype, "PageSettings", {
                get: function () { return this.get(PrintDocument.DPPageSettings); },
                set: function (v) { this.set(PrintDocument.DPPageSettings, v); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PrintDocument.prototype, "Response", {
                get: function () { return this.get(PrintDocument.DPResponse); },
                set: function (v) { this.set(PrintDocument.DPResponse, v); },
                enumerable: true,
                configurable: true
            });
            PrintDocument.__fields__ = function () { return [this.DPHandler, this.DPOwnerId, this.DPOwner, this.DPParams, this.DPPrinterSettings, this.DPPageSettings, this.DPResponse]; };
            PrintDocument.ctor = function () {
                this.DPHandler = Corelib_30.bind.DObject.CreateField("Handler", String);
                this.DPOwnerId = Corelib_30.bind.DObject.CreateField("OwnerId", Number);
                this.DPOwner = Corelib_30.bind.DObject.CreateField("Owner", String);
                this.DPParams = Corelib_30.bind.DObject.CreateField("Params", Array);
                this.DPPrinterSettings = Corelib_30.bind.DObject.CreateField("PrinterSettings", PrinterSettings);
                this.DPPageSettings = Corelib_30.bind.DObject.CreateField("PageSettings", PageSettings);
                this.DPResponse = Corelib_30.bind.DObject.CreateField("Response", Object);
            };
            return PrintDocument;
        }(Corelib_30.bind.DObject));
        Printing.PrintDocument = PrintDocument;
    })(Printing = exports.Printing || (exports.Printing = {}));
});
define("abstract/Apis/FakePrice", ["require", "exports", "abstract/Models", "abstract/extra/AdminApis"], function (require, exports, Models_39, AdminApis_13) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FakePrice1 = (function (_super) {
        __extends(FakePrice1, _super);
        function FakePrice1(_vars) {
            var _this = _super.call(this, _vars, 'FakePrice.edit') || this;
            _this.d = new Models_39.models.FakePrices(null);
            return _this;
        }
        FakePrice1.prototype.GetArrayType = function () {
            return Models_39.models.FakePrices;
        };
        FakePrice1.prototype.GetArgType = function () {
            return Models_39.models.FakePrice;
        };
        FakePrice1.prototype.NativeCreateItem = function (id) {
            return new Models_39.models.FakePrice(id);
        };
        FakePrice1.prototype.Check = function (data, callback) {
            this.callback(callback, data, (data && data.Product) != null);
        };
        FakePrice1.prototype.getDefaultList = function () {
            return this.d;
        };
        return FakePrice1;
    }(AdminApis_13.EMyApi));
    exports.FakePrice1 = FakePrice1;
});
define("lib/Q/initQLib", ["require", "exports", "./sys/AI"], function (require, exports, AI_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(AI_1);
});
