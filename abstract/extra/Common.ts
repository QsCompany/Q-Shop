/// <reference path="../../lib/QLoader.d.ts" />
import { UI, conv2template } from '../../lib/q/sys/UI';
import { mvc, utils, basic, Api, thread, encoding, net, bind, collection, reflection, attributes } from '../../lib/q/sys/Corelib';
import { context } from 'context';
import { models } from "../../abstract/Models";
import { sdata, Controller } from '../../lib/q/sys/System';
import { filters } from '../../lib/q/sys/Filters';
import { init } from '../../lib/q/sys/Encoding';
import { Load } from '../Services';
import { basics } from './Basics';

import { db } from '../../lib/q/sys/db';
import { Material } from '../../lib/q/components/HeavyTable/script';
import { components } from '../../lib/Q/components/ActionButton/script';
import { ShopApis } from './ShopApis';
import { data } from '../../assets/data/data';

declare var stop: () => void;
declare var s;
declare var clone: (a) => any;
declare var $;
declare var require: (modules: string, onsuccss?: (result: any) => void, onerror?: (result: any) => void, context?: any) => void;
var abonEnum = context.GetEnum('models.Abonment');
var GData: basics.vars = {
    __data: new models.QData(),
    modify: bind.NamedScop.Create("modify", false, 3),
    user: (() => { var t = new models.Login(); t.Client = new models.Client(basic.New()); return t; })(),
    requester: Controller.ProxyData.Default,
    invalidateFactures: new collection.List<any>(models.Facture),
    invalidateLogins: new collection.List<any>(models.Login),
    validateLogins: new collection.List<any>(models.Login),
    mails: new collection.List<any>(models.Mail),
    spin: UI.Spinner.Default,
    apis: new ShopApis(),
    db: new db.Database().initialize(),
};
function initializeDB() {
    var fields = bind.DObject.getFields(models.QData);
    for (var i of fields) {
        if (GData.db.Get(i.Name)) continue;
        if (reflection.IsInstanceOf(i.Type, sdata.DataTable)) {
            GData.db.CreateTable(i.Name, GData.__data.GetValue(i).getArgType());
        }
    }
}
//initializeDB();
GData.apis.Init(GData);
var userAbonment = bind.NamedScop.Create('UserAbonment', models.Abonment.Detaillant, bind.BindingMode.TwoWay);
var cgv;

export function GetVars(call: (vars: basics.vars) => boolean): void {
    if (cgv) return;
    cgv = call(GData);
}

export function InitModule() {
    UI.Desktop.Current.OnInitialized = (d) => GData.spin.Parent = d;
    init();
    Load(GData);
    initialize();
}


function initialize() {

    (window as any).data = GData.__data;
    thread.Dispatcher.call(GData.__data, GData.__data.OnPropertyChanged, models.QData.DPSelectedFacture, function (s, e) {
        var f = e._new as models.Facture;
        if (e._new)
            this.Value = f.IsOpen && !f.Validator;
        else this.Value = false;
    }, GData.modify);

    bind.NamedScop.Create('qdata', GData.__data);
    bind.NamedScop.Create('User', GData.user, 0);

    internal.initializeOprs();
    var LabelJob = bind.Register(new bind.Job("showIfModifiable",
        (ji, e) => {

            var t: sdata.DataRow = ji.Scop.Value;
            var dm = ji.dom;
            dm.parentElement.style.display = (t ? t.IsFrozen() : false) ? 'none' : '';
        }, null, null,
        (ji, e) => {
            var dm = ji.dom;
            var t: sdata.DataRow = ji.Scop.Value;
            dm.parentElement.style.display = (t ? t.IsFrozen() : false) ? 'none' : '';
        },
        (ji, e) => {
        }));

    var LabelJob = bind.Register(new bind.Job("ilabel",
        (ji, e) => {
            var dm = ji.dom as HTMLElement;
            (dm as HTMLElement).innerText = ji.Scop.Value || 'Personal';
        }, null, null,
        (ji, e) => {
            var dm = ji.dom as HTMLElement;
            dm.innerText = ji.Scop.Value || 'Personal';
        },
        (ji, e) => {
        }));

    var LabelJob = bind.Register(new bind.Job("dosave", null, null, null,
        (ji, e) => {
            var dm = ji.dom as HTMLElement;
            dm.click = () => {
                var v = ji.Scop.Value as sdata.DataRow;
                if (v instanceof sdata.DataRow)
                    UI.Modal.ShowDialog('Confirm', 'Are you sure save data ?', (xx) => { if (xx.Result === UI.MessageResult.ok) v.Upload(); }, 'Yes', 'No');
            }
        }, null));
    var LabelJob = bind.Register(new bind.Job("dodiscart",
        null, null, null,
        (ji, e) => {
            var dm = ji.dom as HTMLElement;
            dm.click = () => {
                var v = ji.Scop.Value as sdata.DataRow;
                if (v instanceof sdata.DataRow)
                    UI.Modal.ShowDialog('Confirm', 'Are you sure discart data ?', (xx) => { if (xx.Result === UI.MessageResult.ok) v.Update(); }, 'Yes', 'No');
            }
        }, null));


    bind.Register({
        Name: 'openfournisseur', OnInitialize(ji, e) {
            ji.addEventListener('ondblclick', 'dblclick', () => GData.apis.Fournisseur.Edit(ji.Scop.Value));
        }
    });
    bind.Register({
        Name: 'opencostumer', OnInitialize(ji, e) {
            ji.addEventListener('ondblclick', 'dblclick', () => {
                GData.apis.Client.Edit(ji.Scop.Value, void 0);
            });
        }
    });
}


export namespace funcs {

    export interface ITParam<T> {
        t: T;
        c: UI.Glyphs;
    }
    export function setTepmlate<T>(lb: UI.Navbar<any>, owner: T, handleService: (s, e, p: ITParam<T>) => void) {
        var oldget = lb.getTemplate;
        lb.getTemplate = (c: UI.JControl) => {
            var e = oldget(new UI.Anchore(c));
            if (e.Enable === false)
                e.Enable = false;
            else e.addEventListener('click', handleService, { t: owner, c: (c as UI.Glyph).Type as UI.Glyphs });
            return e;
        }
    }
    export function createSparator() {
        var separ0 = new UI.Glyph(UI.Glyphs.none, false);
        separ0.Enable = false;
        return separ0;
    }

    
    
    var _priceModal;
    export function priceModal(): UI.Modals.ModalEditer<any> {
        return _priceModal || (_priceModal = new UI.Modals.ModalEditer<any>('Price.edit'));
    }


    var _pricesModal: UI.Modals.ModalList<models.FakePrice>;
    export function pricesModal(): UI.Modals.ModalList<models.FakePrice> {
        return _pricesModal || (_pricesModal = new UI.Modals.ModalList(<models.FakePrices>undefined, 'Price.info', 'Price.price'));
    }

    export function initializeSBox<T>(caption:string,hasSearch?: boolean, source?: collection.List<T>) {
            if(hasSearch) {
                var actionBtn = new components.ActionButton<T>();
                var btn_filter = UI.Modals.CreateGlyph('label', 'filter', '', 'default', {});
            }
            var group_tcnt = new UI.Div().applyStyle('icontent-header');
            var _caption = document.createTextNode(caption);
            group_tcnt.View.appendChild(_caption);
            if(hasSearch) {
                group_tcnt.Add(actionBtn);
                actionBtn.Source = source;
            }
            return {
                BtnFilter: btn_filter,
                BtnAction: actionBtn,
                txtCaption: _caption,
                container: group_tcnt
            }
    }
    export function toNum(a: Date) {
        return (a && a.getTime()) || 0;
    }
}
namespace internal {
    function getPrd(p) {
        return p instanceof models.Article ? p.Product : p;
    }  
    function newArticle(prd: models.Product, count?: number) {
        var art = new models.Article(basic.New());
        art.Product = prd;
        if (count)
            art.Count = count;
        art.Price = prd.IGetValue(GData.__data.SelectedFacture.Abonment || GData.user.Client.Abonment || models.Abonment.Detaillant);
        art.Owner = GData.__data.SelectedFacture;
        GData.__data.SelectedFacture.Articles.Add(art);
        //GData.__data.Articles.Add(art);
        return art;
    }
    function removeArticle(prd: models.Product, art?: models.Article) {
        var art = art || prd.CurrentArticle;
        if (!art) return;
        var sf = GData.__data.SelectedFacture;
        sf.Articles.Remove(art);
        //GData.__data.Articles.Remove(art);
        prd.CurrentArticle = null;
    }
    function setValue(prd: models.Product, val?: number, def?: number) {
        if (!GData.__data.QteLimited) return setValueUnlimited(prd, val, def);
        var art = prd.CurrentArticle;
        val = val != null ? val : ((art && art.Count || 0) + def);
        var tq = prd.Qte;
        if (art)
            tq += art.OCount;
        else
            if (val <= 0) return;
            else art = newArticle(prd);
        if (val <= 0)
            removeArticle(prd, art);
        else if (val <= tq)
            art.Count = val;
        else {
            art.Count = tq;
        }
    }
    function setValueUnlimited(prd: models.Product, val?: number, def?: number) {
        var art = prd.CurrentArticle;
        val = val != undefined ? val : ((art && art.Count || 0) + def);
        if (val == 0) return art && removeArticle(prd, art);
        if (!art) art = newArticle(prd, val);
        else art.Count = val;
    }
    var types: enumsMap = {};
    interface enumMap {
        type;
        list: collection.List<string>;
    }
    interface enumsMap {
        [s: string]: enumMap;
    }
    function getEnumList(tname): enumMap {
        var lst = types[tname];
        if (lst) return lst;
        var type = tname && context.GetEnum(tname);
        if (type == undefined) throw 'type not found';
        var _lst = [];
        for (var i in type) {
            if (isNaN(parseFloat(i)))
                _lst.push(i);
        }
        lst = { list: new collection.List(String, _lst), type: type };
        lst.list.Freeze();
        Object.freeze(lst);
        Object.freeze(lst.list);
        Object.defineProperty(types, tname, { value: lst, writable: false, enumerable: false, configurable: false });
        return lst;
    }
    interface enumInfo {
        rIsNumber: boolean;
        map: enumMap;
        dom?: UI.ComboBox;
    }

    function swip(v, x) {
        return GData.__data.QteLimited ? v >= 0 && v <= x ? v : (v < 0 ? 0 : x) : v;
    }
    class ProdOpr implements basic.IJob {
        private modadd: UI.Modal;
        private selectedJobInstance: bind.JobInstance;
        private t: UI.NumericUpDown;
        constructor(public Name: string) {
            switch (Name) {
                case 'prod-add':
                    var t: UI.NumericUpDown;
                    this.modadd = new UI.Modal();
                    this.modadd.OnInitialized = (m) =>
                        m.Add(this.t = new UI.NumericUpDown());
                    this.modadd.OnClosed.On = (e) => this.addr(e.Modal, e.msg);
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
        Todo(ji, e) { }
        Check(ji, e) { }
        OnError(ji, e) { }
        OnInitialize(ji: bind.JobInstance, e) {
            ji.dom.addEventListener('click', (e) => this.oper(ji));
        }
        oper: (ji: bind.JobInstance) => void;
        OnScopDisposing(ji, e) { }

        addr(e: UI.Modal, r: string) {
            if (r == 'ok')
                setValue(getPrd(this.selectedJobInstance.Scop.Value), this.t.Value);
        }

        add(ji: bind.JobInstance) {
            var t = GData.__data.SelectedFacture;
            if (t == null) return UI.InfoArea.push('<p><h1>Select</h1> a facture</p>');
            this.selectedJobInstance = ji;
            this.modadd.Open();
            this.modadd.OnInitialized = (m) => {
                this.t.Focus();
                var prd:models.Product|models.Article = ji.Scop.Value as models.Product;
                prd = prd && prd.CurrentArticle;
                this.t.Value = prd && prd.Count || 0;
                this.t.SelectAll();
            }
        }

        plus(ji: bind.JobInstance) {
            return setValue(<models.Product>ji.Scop.Value, undefined, +1);
        }
        minus(ji: bind.JobInstance) {
            return setValue(<models.Product>ji.Scop.Value, undefined, -1);
        }
        remove(ji: bind.JobInstance) {
            var prod = <models.Product>ji.Scop.Value;
            var art = prod.CurrentArticle;
            if (art != null)
                UI.Modal.ShowDialog('Confirmation', "Do you want realy  to delete this Article", (xx) => {
                    if (xx.Result === UI.MessageResult.ok)
                        removeArticle(prod, art);
                });
        }
    }
    class ArtOpr implements basic.IJob {

        private modadd: UI.Modal;
        private selectedScop: bind.JobInstance;
        private t: UI.NumericUpDown;
        constructor(public Name: string) {
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
                    this.modadd = new UI.Modal();
                    this.modadd.OnInitialized = (m) =>
                        m.Add(this.t = new UI.NumericUpDown());
                    this.modadd.OnClosed.On = (e) => this.addr(e.Modal, e.msg);
                    this.oper = this.add;
                    return;
            }
            throw '';
        }
        Todo(ji, e) { }
        Check(ji, e) { }
        OnError(ji, e) { }
        OnInitialize(ji: bind.JobInstance, e) {
            var dm = ji.dom;
            dm.addEventListener('click', (e) => { this.oper(ji); });
        }
        oper: (ji: bind.JobInstance) => void;
        OnScopDisposing(ji, e) { }


        addr(e: UI.Modal, r: string) {
            if (r == 'ok')
                setValue(getPrd(<models.Article>this.selectedScop.Scop.Value), this.t.Value);

        }


        add(ji: bind.JobInstance) {
            var t = GData.__data.SelectedFacture;
            if (t == null) return UI.InfoArea.push('<p><h1>Select</h1> a facture</p>');
            this.selectedScop = ji;
            this.modadd.Open();
            this.t.Focus();
            this.t.SelectAll();
        }

        plus(ji: bind.JobInstance) {
            setValue(getPrd(ji.Scop.Value), undefined, +1);
        }
        minus(ji: bind.JobInstance) {
            setValue(getPrd(ji.Scop.Value), undefined, -1);
        }
        remove(ji: bind.JobInstance) {
            var art = <models.Article>ji.Scop.Value;
            if (art != null)
                UI.Modal.ShowDialog('Confirmation', "Do you want realy  to delete this Article", (xx) => {
                    if (xx.Result === UI.MessageResult.ok)
                        removeArticle(art.Product, art);
                });
        }
    }
    export function initializeOprs() {
        bind.Register(new ProdOpr('prod-add'));
        bind.Register(new ProdOpr('prod-plus'));
        bind.Register(new ProdOpr('prod-remove'));
        bind.Register(new ProdOpr('prod-minus'));

        bind.Register(new ArtOpr('art-add'));
        bind.Register(new ArtOpr('art-plus'));
        bind.Register(new ArtOpr('art-remove'));
        bind.Register(new ArtOpr('art-minus'));

        bind.Register(new bind.Job('calctotal', null, null, null, (ji, e) => {

            var dm = ji.dom as HTMLElement;
            dm.onclick = (e) => {
                var v = ji.Scop.Value as models.Facture;
                if (v)
                    v.Recalc();
            };
            var v = ji.Scop.Value as models.Facture;
            if (v)
                v.Recalc();

        }, null));

        bind.Register(new bind.Job('calcsold', null, null, null, (ji, e) => {
            var dm = ji.dom as HTMLElement;
            dm.onclick = (e) => {
                var v = ji.Scop.Value;
                if (v)
                    (ji.dom as HTMLElement).nextElementSibling.textContent = v.CalcTotal() || '0.00';
            };
            var v = ji.Scop.Value;
            if (v)
                (ji.dom as HTMLElement).nextElementSibling.textContent = v.CalcTotal() || '0.00';

        }, null));
    }

    function removeUser(p: models.Login) {
        UI.Modal.ShowDialog("Confirmation", "Are you Sure To <b>Delete</b> This Client", (xx) => {
            if (xx.Result === UI.MessageResult.ok)
                GData.requester.Request(Number, "REMOVE", p, p as any, (s, r, iss) => {
                    if (iss) {
                        GData.invalidateLogins.Remove(p);
                        if (GData.validateLogins.IndexOf(p) == -1)
                            GData.validateLogins.Remove(p);
                        UI.InfoArea.push('The Client Successffuly <h2>Removed</h2>', true, 3000);
                    } else {
                        UI.InfoArea.push("A <h2 style='color:red'>Error</h2> Occured When Removing A Client", false);
                    }
                });
        }, "DELETE", "Cancel")
    }
    function validateUser(p: models.Login) {
        GData.requester.Request(Number, "VALIDATE", p, p as any, (s, r, iss) => {
            if (iss) {
                GData.invalidateLogins.Remove(p);
                if (GData.validateLogins.IndexOf(p) == -1)
                    GData.validateLogins.Add(p);
                UI.InfoArea.push('The Client Successffuly <h2>Validated</h2>', true, 3000);
            } else {
                UI.InfoArea.push("A Error Occured When Validating A Client", false);
            }
        });
    }
    function lockUser(p: models.Login) {
        if (p instanceof models.Login == false) throw 'invalid param';
        GData.requester.Request(Number, 'LOCK', p, p as any, (s, r, iss) => {
            if (iss) {
                GData.validateLogins.Remove(p);
                GData.invalidateLogins.Add(p);
                UI.InfoArea.push('The Client Successffuly <h2>Locke</h2>', true, 3000);
            } else {
                UI.InfoArea.push("A <h2 style='color:red'>Error</h2> Occured When Locking A Client", false);
            }
        });
    }

    Api.RegisterApiCallback({
        Name: 'validateuser',
        DoApiCallback(c, n, p) { validateUser(p.data); }
    });
    bind.Register({
        Name: 'validateuser',
        OnInitialize: (j, e) => {
            j.addEventListener('onclick', 'click', (e) => validateUser(j.Scop.Value));
        }
    });
    (function () {
        var obsModal: UI.Modal;
        
        class obsObject extends bind.DObject {

            public static DPObservation: bind.DProperty<string, obsObject>;
            public Observation: string;
            static ctor() {
                obsObject.DPObservation = bind.DObject.CreateField<string, obsObject>('Observation', String, null);
            }
            static __fields__() { return [this.DPObservation]; }

        }
        var obsValue = new obsObject();
        var Scop = new bind.ValueScop(obsValue, bind.BindingMode.TwoWay);
        Api.RegisterApiCallback({
            Name: "OpenObservation", DoApiCallback: (c, n, p) => {
                if (!obsModal) {
                    obsModal = new UI.Modal(); obsModal.OnInitialized = n => {
                        n.setStyle("minWidth", "50%").setStyle('minHeight', "50%");
                        obsModal.Add(new UI.TControl("templates.Observation", Scop));
                    }
                }
                obsValue.Observation = p.data;
                obsModal.Open();
                obsModal.OnClosed.Add((e) => {
                    try {
                        e.Modal.OnClosed.Remove('');
                        if (e.Result === UI.MessageResult.ok)
                            p.callback(p, obsValue.Observation);
                    } catch (e) {

                    }
                }, '');
            }
        });
    })();
    
    export function createApiEdit<T extends bind.DObject>(template, apiName) {
        var editSFacture: UI.Modals.ModalEditer<T>;
        var p: Api.IApiParam;
        var callback = {
            OnSuccess: {
                Invoke: (data, isNew) => {
                    p.callback(p, { data: data, iss: true });
                    return true;
                }, Owner: null
            },
            OnError: {
                Invoke: (data, isNew) => {
                    p.callback(p, { data: data, iss: false });
                    return true;
                }, Owner: null
            },
        }
        Api.RegisterApiCallback({
            Name: apiName, DoApiCallback: (c, n, px) => {
                if (!editSFacture)
                    editSFacture = new UI.Modals.ModalEditer<T>(template);
                p = px;
                editSFacture.edit(p.data, false, callback, !(p.data as T).IsFrozen());
            }
        });
    }

    createApiEdit<models.SFacture>('templates.sfactureInfo', 'OpenSFactureInfo');
    createApiEdit<models.Facture>('templates.factureInfo', 'OpenFactureInfo');

    Api.RegisterApiCallback({
        Name: 'removeuser', DoApiCallback(c, n, p) {            
            removeUser(p.data);
        }
    });


    bind.Register({
        Name: 'removeuser', OnInitialize: (j, e) => {
            j.addEventListener('onclick', 'click', (e) => removeUser(j.Scop.Value));
        }
    });

    Api.RegisterApiCallback({
        Name: 'lockuser', DoApiCallback(a, v, p) {
            lockUser(p.data);
        }
    });

    bind.Register({
        Name: 'lockuser', OnInitialize: (j, e) => { j.addEventListener('onclick', 'click', (e) => lockUser(j.Scop.Value)); }
    });

    bind.Register({
        Name: 'openclient', OnInitialize: (j, p) => {
            j.addEventListener('click', 'click', {
                Owner: j,
                handleEvent(e) {
                    GData.apis.Client.Edit((this.Owner as bind.JobInstance).Scop.Value as models.Client, void 0);
                    //Client.Edit((this.Owner as bind.JobInstance).Scop.Value as models.Client, false);
                }
            });
        }
    });
    bind.Register({
        Name: 'selectclient', OnInitialize: (j, e) => {
            j.addEventListener('click', 'click', {
                Owner: j,
                handleEvent(e) {
                    var t = j.Scop.Value as models.Client;
                    GData.apis.Client.Select((e) => {
                        if (e.Error == basic.DataStat.Success)
                            j.Scop.Value = e.Data;
                            //t.Login.Client = i;
                    }, t);
                }
            });
        }
    });


    bind.Register({
        Name: 'selectprojet', OnInitialize: (j, e) => {
            j.addEventListener('click', 'click', {
                Owner: j,
                handleEvent(e) {
                    var t = j.Scop.Value as models.Client;
                    GData.apis.Projet.Select((e) => {
                        if (e.Error==basic.DataStat.Success)
                            j.Scop.Value = e.Data;
                    }, t);
                }
            });
        }
    });
    bind.Register({
        Name: "proj.new",
        OnInitialize: (j, e) => {
            j.addEventListener('click', 'click', {
                Owner: j,
                handleEvent(e) {
                    GData.apis.Projet.CreateNew();
                }
            });
        }
    });
    bind.Register({
        Name: "proj.del",
        OnInitialize: (j, e) => {
            j.addEventListener('click', 'click', {
                Owner: j,
                handleEvent(e) {
                    alert(j);
                }
            });
        }
    });
    bind.Register({
        Name: 'openproduct', OnInitialize: (j, e) => {
            j.addEventListener('dblclick', 'dblclick', {
                Owner: j,
                handleEvent(e) {                    
                    var t = (this.Owner as bind.JobInstance).Scop.Value as models.Product;
                    GData.apis.Product.Edit(t, null);
                }
            });
        }
    });
    bind.Register({
        Name: 'opencategory', OnInitialize(j, e) {
            j.addEventListener('dblclick', 'dblclick', {
                handleEvent(e) {
                    var t = (this.self as bind.JobInstance).Scop.Value as models.Category;
                    GData.apis.Category.Edit(t);
                }, self: j
            });
        }
    });
    bind.Register({
        Name: 'enum2string',
        OnInitialize(ji, e) {
            var dm = ji.dom as HTMLElement;
            ji.addValue('info', <enumInfo>{ map: getEnumList(dm.getAttribute('type')), rIsNumber: dm.getAttribute('rtype') === 'number' });
            this.Todo(ji, e);
        },
        Todo(ji, e) {
            var info = ji.getValue('info') as enumInfo;
            var vl = ji.Scop.Value;
            var dm = ji.dom;
            dm.textContent = info.rIsNumber ? (info.map.type[vl || 0] || (vl || 0).toString()) : vl || info.map.type[0];
        }
    });
    bind.Register({
        Name: 'selectcategory',
        OnInitialize: (j, e) => {
            if (!(j.dom instanceof HTMLSelectElement))
                throw "Dom must be Select";
            var k = new UI.ComboBox(j.dom as HTMLSelectElement, GData.__data.Categories);
            var parent = j.Control || j.Scop.__Controller__ && j.Scop.__Controller__.CurrentControl || UI.Desktop.Current;
            k.Parent = parent;
            k.addEventListener('change', (s, e: any, k: UI.ComboBox) => {
                var x = k.Content.getChild(e.target.selectedIndex) as UI.TemplateShadow;
                if (x) {
                    var c = x.getDataContext() as models.Category;
                    if (c) {
                        j.Scop.Value = c;
                    }
                }
            }, k);
        }
    });

}
export namespace extern {
    export function crb(icon, title, type, attr?) {
        var t = document.createElement('button');
        t.classList.add('btn', 'btn-' + type, 'glyphicon', 'glyphicon-' + icon);
        t.textContent = '  ' + title;
        if (attr)
            for (var i in attr)
                t.setAttribute(i, attr[i]);
        return t;
    }
}

export abstract class Facture<I, Fact extends models.FactureBase> extends UI.NavPanel implements basic.IJob {
    abstract CalculateBenifite();
    abstract GetLastArticlePrice();
    
    @attributes.property(String, "")
    public Title: string;
    public static DPTitle;

    public static DPData: bind.DProperty<models.FactureBase, Facture<any, any>>;
    @attributes.property(models.FactureBase)
    public Data: Fact;

    
    static __fields__() { return [this.DPData, this.DPTitle]; }
    Name: string;
    
    private header = UI.Template.ToTemplate('templates.facturePageHeader', false).CreateShadow(null);

    abstract edit();
    private _caption = document.createTextNode("Facture D'Achat");
    protected abonment: UI.ProxyAutoCompleteBox<basic.EnumValue> = new UI.ProxyAutoCompleteBox(new UI.Input(document.createElement('input')), basic.getEnum('models.Abonment'));
    protected adapter: UI.ListAdapter<I, Fact>;
    private tb: bind.TwoBind<Fact>;
    private scp;
    protected abstract LoadArticles();
    protected abstract OpenPrdStatistics();
    protected abstract OpenPrdStatisticsRslt();
    
    public Open(x: Fact) {
        this.OnInitialized = (me) => {
            var lx = me.Data;
            me.Data = x;
            me.LoadArticles();
            if (me.scp) return;
            var _scop = bind.Scop.Create('Data.IsOpen', me, 1);
            _scop.AddJob(me, me.View);
            this.tb = new bind.TwoBind(3, me, me.adapter, Facture.DPData, UI.TControl.DPData);
            me.scp = this;
        }
    }
    protected abstract OpenInfo();
    private focuser: basic.focuser;
    public getHelp() {
        var t = {
            "Enter":"New Article",
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
        var l = ["primary", "success", "danger", "info", "warning"]; var k = 0;
        var s = "";
        for (var i in t) {
            s += '<div class="input-group" style="background:gray"> <span class="input-group-btn"> <label class="btn btn-' + l[(k++) % l.length] + '">' + i + '</label> </span> <label class="form-control" >' + t[i] + '</label> </div>';                
        }
        UI.InfoArea.push(s, true, 10000);
    }
    OnKeyDown(e: KeyboardEvent) {
        if (this.Data && this.Data.IsOpen && e.keyCode == UI.Keys.Enter) {
            this.AddNewArticle();
        }
        else
        if (!this.adapter.OnKeyDown(e)) {
            switch (e.keyCode) {
                case 86:
                    this.GetLastArticlePrice();
                    return;
                case UI.Keys.F1:
                    this.getHelp();
                    break;
                case 13:
                    if (this.focuseOrEdit)
                        this.focuser.focuseNext(true);
                    else
                        this.edit();
                    break;
                case UI.Keys.F2:
                    this.edit();
                    break;
                case UI.Keys.F3:
                    this.OnDeepSearch();
                    break;
                case UI.Keys.F4:
                    this.OpenInfo();
                    break;
                case UI.Keys.F5:
                    this.Update();
                    break;
                case UI.Keys.F6:
                    break;
                case UI.Keys.F7:
                    this.OpenCloseFacture();
                    break;
                case UI.Keys.F8:
                    if (this.Data.IsOpen)
                        this.SaveFacture();
                    break;
                case UI.Keys.F9:
                    this.ReglerFacture();
                    break;
                case UI.Keys.F10:
                    this.OpenVersments(false);
                    break;
                case 13:
                    this.edit();
                    break;
                default:
                    return super.OnKeyDown(e);
            }
            e.preventDefault();
            e.stopPropagation();
        }
    }
    constructor(name: string, caption: string, private template: conv2template,  Data: Fact, protected focuseOrEdit: boolean) {
        super(name, caption);
        this.Title = caption;
        this.Data = Data;
    }
    
    
    ToggleFactureStat(e: Event, dt: bind.EventData, scopValue: bind.Scop, events: bind.events) {
        var data = this.Data;
        var v = dt.dom as HTMLButtonElement;        
        if (data)
            GData.apis.Facture.EOpenFacture(data);
        if (v) v.blur();
    }

    initialize() {
        super.initialize();
        this._view.style.minWidth = '750px';
        this.Add(this.header);
        this.Add(this.adapter = (new UI.ListAdapter<I, Fact>(this.template, undefined, this.Data, true)).applyStyle('fitHeight'));
        this.adapter.AcceptNullValue = false;
        this.adapter.OnItemSelected.On = (n) => {
            var t = n.SelectedChild;
            if (t && t.View)
                thread.Dispatcher.call(null, basic._focuseOn, t.View);
        }

        this.focuser = new basic.focuser(this.adapter.View, true);

        UI.Desktop.Current.KeyCombiner.On('S', 'R', function (this:Facture<any,any>,s, e) {
            this.OpenPrdStatistics();
            s.Cancel = true;
        }, this, this);
        UI.Desktop.Current.KeyCombiner.On('S', 'D', function(s, e) {
            this.OpenPrdStatisticsRslt();
            s.Cancel = true;
        }, this, this);
        UI.Desktop.Current.KeyCombiner.On('S', 'B', function(s, e) {
            this.CalculateBenifite();
            s.Cancel = true;
        }, this, this);
    }
    
    private get IsOpen(): boolean { var d = this.Data; if (d) return d.IsOpen; return false; }
    protected abstract OnAbonmentChanged(b: UI.IAutoCompleteBox, o: basic.EnumValue, n: basic.EnumValue);
    protected abstract AddNewArticle();
    protected abstract DeleteArticle();
    protected abstract SaveFacture();
    protected abstract ReglerFacture();
    protected abstract OpenVersments(forDelete: boolean);
    
    protected OpenCloseFacture() {
        GData.apis.Facture.EOpenFacture(this.Data);
    }
}
Api.RegisterApiCallback({
    Name: 'loadFournisseurs',
    Params: {},
    DoApiCallback(a, b, c) {
        if (this.Params.loaded) return c && c.callback && c.callback(c, true);
        this.Params.loaded = true;
        GData.spin.Start("Load la list des fournisseurs");
        GData.requester.Push(models.Fournisseurs, GData.__data.Fournisseurs, null, (d, r, iss) => {
            GData.spin.Pause();
            c && c.callback && c.callback(c, iss);
        });
    }
});

Api.RegisterApiCallback({
    Name: 'loadSFActures',
    Params: {},
    DoApiCallback(a, b, c) {
        if (this.Params.loaded) return c && c.callback && c.callback(c, true);
        this.Params.loaded = true;
        GData.spin.Start("Load la list des factures de reciption");
        GData.requester.Push(models.SFactures, GData.__data.SFactures, null, (d, r, iss) => {
            GData.spin.Pause();
            c && c.callback && c.callback(c, iss);
        });
    }
});
Api.RegisterApiCallback({
    Name: 'loadFActures',
    Params: {},
    DoApiCallback(a, b, c) {
        if (this.Params.loaded) return c && c.callback && c.callback(c, true);
        this.Params.loaded = true;
        GData.spin.Start("Load la list des factures de livraison");
        GData.requester.Request(models.Factures, "GETCSV", null, null, (d, r, iss, req) => {
            GData.spin.Pause();
            GData.__data.Factures.FromCsv(req.Response);
            c && c.callback && c.callback(c, iss);
        });
    }
});


export interface IGetLastArticlePrice {
    IsAchat?: boolean;
    Product: models.Product;
    Dealer: models.Client | models.Fournisseur;
    Before: Date;
    asRecord?: boolean
}


Api.RegisterApiCallback({
    Name: 'getLastArticlePrice',
    Params: {},
    DoApiCallback(a, b, c) {
        var p = c.data as IGetLastArticlePrice;
        if (p.Dealer) p.IsAchat = p.Dealer instanceof models.Fournisseur;
        var t: any = p.IsAchat ? GData.apis.SFacture : GData.apis.Facture;
        t.GetLastArticlePrice(p.Dealer, p.Product, p.Before, (prc) => c && c.callback && c.callback(c, prc),p.asRecord);
    }
});

declare var __data: models.QData;
if (typeof __data !== 'undefined')
    Api.RiseApi('getLastArticlePrice', { data: <IGetLastArticlePrice>{ Dealer: __data.Costumers.Get(0), Product: __data.Products.Get(0), Before: new Date(0) }, callback: (a, r) => {  } });
window['api'] = Api;

UI