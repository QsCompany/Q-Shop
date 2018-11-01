import { mvc, utils, basic, thread, encoding, net, bind, reflection, collection, ScopicCommand, ScopicControl, math, Api, helper } from '../lib/q/sys/Corelib';
import { sdata, Controller, base } from '../lib/q/sys/System';
import { getTarget, getTargetFrom } from '../lib/q/sys/Jobs';
import { models as imodels } from "../abstract/Models";
import { Apis } from '../abstract/QShopApis';
import { context } from 'context';
import { funcs, GetVars, extern, IGetLastArticlePrice } from './../abstract/extra/Common';
import { models } from '../abstract/Models';
import { UI } from './../lib/Q/sys/UI';
import { filters } from '../lib/q/sys/Filters';
import { basics } from './../abstract/extra/Basics';
import { APIEventHandler } from '../abstract/extra/AdminApis';
declare var $: (s: string, context?: Element) => Element;
var GData: basics.vars;
GetVars((v) => {
    GData = v;
    return false;
});
(window as any).__data = GData.__data;

var b = true;
var lc = [10, 10, 10, 10, 7.5, 6, 5.1, 4.4, 3.9, 3.4, 3.1, 2.8, 2.6, 2.6, 2.4, 2.3];
window['lc'] = lc;

namespace Binds {
    bind.Register({
        Name: 'trade',
        OnInitialize(j, e) {
            this.Todo(j, e);
        }, Todo(j, e) {
            var v = j.Scop.Value;
            var d = j.dom as HTMLElement;
            if (v != null) {
                var hasDot = v % 1 !== 0;
                var s: string = v.toString();
                if (s.length > 10)
                    s = s.slice(0, 10);
            } else s = "";
            d.style.fontSize = lc[s.length] + 'em';
            d.textContent = s;
        }
    });
    bind.Register({
        Name: 'getLastArticleTransactioned',
        OnInitialize(this: basic.IJob, j, e) {
            this.Todo(j, e);
        },
        Todo(this: basic.IJob, j, e) {

            var art = j.Scop.ParentValue as models.Article | models.FakePrice;
            var prd = j.Scop.Value as models.Product;
            if (!art || !prd) return;
            var f = art instanceof models.Article ? art.Owner : art.Facture;
            var d = f instanceof models.Facture ? f.Client : f instanceof models.SFacture ? f.Fournisseur : undefined;
            Api.RiseApi('getLastArticlePrice', {
                data: <IGetLastArticlePrice>{ Dealer: d, Product: prd, Before: f.Date, IsAchat: art instanceof models.Article },
                callback: (a, prc) => {
                    (j.dom as HTMLElement).innerHTML = prc == undefined ? "n y a aucune transaction " : "derniere prix : " + prc;
                }
            });
            
        }
    });
    bind.Register({
        Name: 'openprice', OnInitialize(j, e) {
            j.addEventListener('click', 'click', (e) => {
                var prd = j.Scop.Value as imodels.Product;
                if (!prd) return;
                var p = prd && prd.Revage;
                var isNew: boolean = false;
                if (!p) {
                    p = new imodels.FakePrice(basic.New());
                    p.Product = prd;
                    prd.Revage = p;
                    isNew = true;
                }
                else {
                    //p = imodels.FakePrice.getById(p.Id);
                    //if (t && t.Product !== prd) { UI.InfoArea.push("An Internal Error x5674"); return; }
                }

                if (!p) {
                    isNew = true;
                    UI.Spinner.Default.Start("Wait");
                    p = new imodels.FakePrice(p.Id);
                    p.Product = prd;
                    GData.requester.Get(imodels.FakePrice, p, null, (s, r, iss) => {
                        if (iss)
                            funcs.priceModal().edit(s.data, isNew, {
                                OnSuccess: { Invoke: OnSuccessCategory, Owner: prd },
                                OnError: { Invoke: OnErrorCategory, Owner: prd }
                            });
                        else UI.InfoArea.push("Fatal ERROR Occured !!!! ");
                        UI.Spinner.Default.Pause();
                    });
                } else
                    funcs.priceModal().edit(p, isNew, {
                        OnSuccess: { Invoke: OnSuccessCategory, Owner: p },
                        OnError: { Invoke: OnErrorCategory, Owner: p }
                    });
                if (prd.Revage == null)
                    prd.Revage = p;
            });
        }
    });

    bind.Register({
        Name: 'openfprice', OnInitialize(j, e) {
            j.addEventListener('click', 'click', (e) => {
                var pr = j.Scop.Value as imodels.FakePrice;
                if (!pr) return;
                if (pr.NextRevage)
                    funcs.pricesModal().show((s, i, r) => { }, pr.ToList());
                else funcs.priceModal().edit(pr, false, null);
            });
        }
    });
    bind.Register({
        Name: 'applyprice', OnInitialize(j, e) {
            var method = (j.dom as HTMLElement).getAttribute('method');
            j.addEventListener('click', 'click', (e) => {
                var art = j.Scop.Value as models.FakePrice;
                var f = art.Facture as models.SFacture;
                if (f && !f.IsOpen) return UI.Modal.ShowDialog("Apprentissage", 'La Facture Is Clossed donc vous ne pouver pas executer cette command', null, "Ok", null);
                var old = art.Product;
                if (old == null) return UI.Modal.ShowDialog('Apprentissage', "Vous dever selectioner un produit pour appliquer le prix");
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
                    case 'costum':
                        art.ApplyPrice = new models.FakePrice();
                        art.ClonePrices(art.ApplyPrice, true);
                        return GData.apis.Revage.Edit(art.ApplyPrice, void 0);
                    case 'percent':
                        UI.InfoArea.push("this option is depricated");
                        break;
                }
            });
        }
    });
    bind.Register({
        Name: 'openfprice', OnInitialize(j, e) {
            j.addEventListener('click', 'click', (e) => {
                var pr = j.Scop.Value as imodels.FakePrice;
                if (!pr) return;
                if (pr.NextRevage)
                    funcs.pricesModal().show((s, i, r) => { }, pr.ToList());
                else funcs.priceModal().edit(pr, false, null);
            });
        }
    });
    bind.Register({
        Name: 'openfsprice', OnInitialize(j, e) {
            j.addEventListener('click', 'click', (e) => {
                var p = j.Scop.Value as imodels.Product;
                if (!p) return;
                var pr = p.Revage;
                if (!pr) return UI.InfoArea.push('Cannot find Price for this item');
                if (pr.NextRevage)
                    funcs.pricesModal().show((s, i, r) => { }, pr.ToList());
                else GData.apis.Revage.Edit(pr, void 0);
            });
        }
    });
    bind.Register({
        Name: 'dopenfprice', OnInitialize(j, e) {
            j.addEventListener('dblclick', 'dblclick', (e) => {
                var p = j.Scop.Value as imodels.FakePrice;
                if (!p) UI.InfoArea.push('Cannot find Price for this item');
                else GData.apis.Revage.Edit(p, void 0);
            });
        }
    });

    bind.Register({
        Name: 'dopenfsprice', OnInitialize(j, e) {
            j.addEventListener('dblclick', 'dblclick', (e) => {
                var p = j.Scop.Value as imodels.FakePrice;
                if (!p) return;
                funcs.pricesModal().show((s, i, r) => { }, p && p.ToList());

            });
        }
    });
    bind.Register({
        Name: 'dopenfsprice', OnInitialize(j, e) {
            j.addEventListener('dblclick', 'dblclick', (e) => {
                var p = j.Scop.Value as imodels.FakePrice;
                if (!p) return;
                funcs.pricesModal().show((s, i, r) => { }, p && p.ToList());

            });
        }
    });
    bind.Register({
        Name: 'factureStat', OnInitialize(j, e) {
            this.Todo(j, e);
        }, Todo(j, e) {
            var d = j.dom as HTMLElement;
            if (j.Scop.Value) {
                d.style.backgroundColor = "#0F9D58";
            }
            else {
                d.style.backgroundColor = "var(--qshop-yellow-700)";
            }
        }
    });

    bind.Register({
        Name: 'applyPriceStat', OnInitialize(j, e) {
            this.Todo(j, e);
        }, Todo(j, e) {
            var ps = j.Scop.getParent();
            ps = ps && ps.Value;
            var cv = j.Scop.Value;
            var dom = j.dom.parentElement;

            if (!cv) {
                dom.classList.remove('btn-success', 'btn-primary');
            } else if (cv === ps) {
                dom.classList.remove('btn-primary');
                dom.classList.add('btn-success');
            } else {
                dom.classList.add('btn-primary');
                dom.classList.remove('btn-success');
            }
        }
    });
    bind.Register({
        Name: 'smsState', OnInitialize(j, e) {
            this.Todo(j, { _new: !!j.Scop.Value });
        }, Todo(j, e) {
            var cv = e._new;
            var dom = j.dom.parentElement;
            if (cv)
                dom.classList.remove('sms-no-readed');
            else
                dom.classList.add('sms-no-readed');
        }
    });
    ScopicCommand.Register({
        Invoke: (name, dom, scop,param) => {
            var cbox = getTargetFrom(dom as Element) as HTMLInputElement;
            dom.addEventListener('click', (e) => {
                cbox.checked = !cbox.checked;
            });
        },
        Owner: null
    }, null, 'checkboxTrigger');
    bind.Register({
        Name: 'sfactureStat', OnInitialize(j, e) {
            this.Todo(j, e);
        }, Todo(j, e) {
            var d = j.dom as HTMLElement;
            if (j.Scop.Value) {
                d.style.backgroundColor = "#0F9D58";
            }
            else {
                d.style.backgroundColor = "var(--qshop-yellow-700)";
            }
        }
    });

    bind.Register({
        Name: 'clientStat', OnInitialize(j, e) {
            this.Todo(j, e);
        }, Todo(j, e) {
            var t = j.Scop.Value || 0;
            if (t == 0)
                j.dom.parentElement.style.backgroundColor = "#0F9D58";
            else if (t > 0)
                j.dom.parentElement.style.backgroundColor = "var(--paper-red-500)";
            else
                j.dom.parentElement.style.backgroundColor = "var(--qshop-yellow-500)";
        }
    });
    bind.Register({
        Name: 'soldStatus', OnInitialize(j, e) {
            this.Todo(j, e);
        }, Todo(j, e) {
            var t = j.Scop.Value || 0;
            var n = (j.dom as HTMLElement).style;
            (j.dom as HTMLElement).innerText = String(t);
            if (t == 0)
                n.backgroundColor = "";
            else if (t > 0)
                n.backgroundColor = "var(--paper-red-500)";
            else
                n.backgroundColor = "var(--qshop-yellow-500)";
        }
    });


    bind.Register({
        Name: 'fournisseurStat', OnInitialize(j, e) {
            this.Todo(j, e);
        }, Todo(j, e) {
            var t = j.Scop.Value || 0;

            if (t == 0)
                j.dom.parentElement.style.backgroundColor = "#0F9D58";
            else if (t < 0)
                j.dom.parentElement.style.backgroundColor = "var(--paper-red-500)";
            else
                j.dom.parentElement.style.backgroundColor = "var(--qshop-yellow-500)";
        }
    });

    interface iap {
        ac: UI.IAutoCompleteBox;
        IsChanging: boolean;
    }
    bind.Register({
        Name: 'auto-product', OnInitialize(j, e) {
            var d = j.dom as HTMLElement;
            var inp = new UI.Input(d);
            
            var ac = new UI.ProxyAutoCompleteBox(inp, GData.__data.Products);
            var tmp = d.getAttribute('item-template');
            if (tmp != null) ac.Template = UI.Template.ToTemplate(tmp, true);

            inp.Parent = UI.Desktop.Current;
            function onTextboxChanged(this: bind.JobInstance, box: UI.AutoCompleteBox, old: models.Product, nw: models.Product) {
                var artScop = this.Scop.getParent() as bind.Scop;
                if (artScop) {
                    var art = artScop.Value as (models.FakePrice | models.Article);
                    if (art instanceof models.FakePrice) {
                        var f = art.Facture as imodels.SFacture;
                        if (art.Stat <= sdata.DataStat.Modified) {
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
                if (t.IsChanging) return;
                t.IsChanging = true;
                helper.TryCatch(j, onTextboxChanged, void 0, <any>[box, old, nw]);
                t.IsChanging = false;
            });
            ac.initialize();
            var t: iap = { ac: ac, IsChanging: false };
            j.Scop.BindingMode = bind.BindingMode.TwoWay;
            j.addValue('ac', t);
            if (!j.Control)
                j.Control = ac as any;
            this.Todo(j, e);
        }, Todo(ji, e) {
            var t = ji.getValue('ac') as iap;
            if (t.IsChanging) return;
            t.IsChanging = true;
            t.ac.Value = ji.Scop.Value;
            t.IsChanging = false;
        }
    });
    
    bind.Register({
        Name: 'autocomplet', OnInitialize(j, e) {
            var d = j.dom as HTMLElement;
            var s = d.getAttribute('db-source');
            var bts = d.hasAttribute('bind-to-scop');
            var sc = bind.Scop.Create(s, j.Scop, 1);
            var inp = new UI.Input(d);
            var data;
            if (sc) {
                data = sc.Value;
                var ac = new UI.ProxyAutoCompleteBox(inp, data);
                var tmp = d.getAttribute('item-template');
                if (tmp != null) ac.Template = UI.Template.ToTemplate(tmp, true);

                sc.OnPropertyChanged(bind.Scop.DPValue, function (s, e) {
                    (this as UI.ProxyAutoCompleteBox<any>).DataSource = e._new;
                }, ac);
                if (bts) {
                    ac.OnValueChanged(j, (box, old, nw) => {
                        j.Scop.Value = nw;
                    });
                    ac.Value = j.Scop.Value;
                    j.addValue('ac', ac);
                    j.addValue('bts', true);
                }
                inp.Parent = UI.Desktop.Current;
                ac.initialize();
                
                if (!j.Control)
                    j.Control = ac as any;

            } else throw "datasource not found";
        }, Todo(j, e) {
            if (!j.getValue('bts')) return;
            var ac = j.getValue('ac') as UI.ProxyAutoCompleteBox<any>;
            ac.Value = j.Scop.Value;
        }
    });

    function collapse(e) {
        var p: HTMLElement;
        var b = this.self;
        var d = p = b.parentElement;
        if (!d) return;
        d = d.nextElementSibling as HTMLElement;
        if (!d) return;
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
    ScopicCommand.Register({
        Invoke(n, dom, s, p) {
            dom.addEventListener('click', <any>{ handleEvent: collapse, self: dom });
        }
    }, null, 'collapse');
    ScopicCommand.Register({
        Invoke(n, dom, s, p) {
            dom.addEventListener('click', (e) => {
                var isopen = dom.classList.contains('open');
                if (isopen)
                    dom.classList.remove('open');
                else {
                    dom.classList.add('open');
                    var t = (e) => { dom.classList.remove('open'); document.removeEventListener('click', t, true); };
                    document.addEventListener('click', t,true);
                }
            },true);
            var dom = dom.parentElement;
        }
    }, null, 'opendropdown');


    ScopicCommand.Register({
        Invoke(n, dom, s, p) {
            dom.innerText = s.Value;
        }
    }, null, 'write');
    function setValue(s: bind.Scop | boolean, dom: HTMLElement, rev?) {
        var c;
        if (typeof s !== 'boolean') {
            c = s.getAttribute('activate');
            s.setAttribute('activate', c = !(c && c.Value));
        } else c = s;
        dom.style.backgroundColor = c ? '' : 'var(--qshop-grey-500)';
    }
    ScopicCommand.Register({
        Invoke(n, dom, s, p) {
            s = s.getParent();
            dom.addEventListener('click', () => {
                setValue(s, dom);
            });
            setValue(false, dom);
        }
    }, null, 'activateCrt');


    bind.Register({
        Name: 'auto-category', OnInitialize(j, e) {
            var d = j.dom;
            var inp = new UI.Input(d);
            var ac = new UI.ProxyAutoCompleteBox(inp, GData.__data.Categories);
            inp.Parent = UI.Desktop.Current;
            ac.OnValueChanged(j, (box, old, nw) => {
                (j.Scop.Value as imodels.Product).Category = nw as any;
            });
            ac.initialize();
            j.addValue('ac', ac);
            this.Todo(j, e);
        }, Todo(j, e) {
            var ac = j.getValue('ac') as UI.ProxyAutoCompleteBox<imodels.Category>;
            var p = j.Scop.Value as imodels.Product;
            ac.Value = p ? p.Category : null;
        },
        OnScopDisposing(j, e) {
            var ac = j.getValue('ac') as UI.ProxyAutoCompleteBox<any> as any;
            ac.Box.Dispose();
            ac.Dispose();

        }

    });
    var jobs: bind.JobInstance[] = [];

    bind.NamedScop.Create('UserAbonment', imodels.Abonment.Detaillant, 3).OnPropertyChanged(bind.Scop.DPValue, (e, c) => {
        var x = typeof c._new === 'number';
        if (x)
            Filters.setAbonment(c._new);
        if (c._new instanceof basic.EnumValue)
            Filters.setAbonment(c._new.Value);

    }, null);
    interface IEnumoptionParam {
        ac: UI.ProxyAutoCompleteBox<basic.EnumValue>;
        et: 'number' | 'string';
        lst: collection.List<basic.EnumValue>;
    }
    interface IEnumselectParam {
        ac: UI.ComboBox;
        lst: collection.List<basic.EnumValue>;
    }
    bind.Register({
        Name: 'enumoption',
        OnInitialize(j, e) {

            if (!(j.dom instanceof HTMLInputElement))
                throw "Dom must be Select";
            var dm = j.dom;
            var c = dm.getAttribute('enum');
            var et = dm.getAttribute('enum-type');
            if (et !== 'string')
                et = 'number';
            let lst: collection.List<basic.EnumValue> = basic.getEnum(c);
            var ac = new UI.ProxyAutoCompleteBox(new UI.Input(j.dom), lst);
            ac.Box.Parent = UI.Desktop.Current;
            ac.initialize();
            var p = { ac: ac, lst: lst, et: et } as IEnumoptionParam;
            j.addValue('params', p);
            this.Todo(j, e);
            ac.OnValueChanged(ac, (b, o, n) =>
                j.Scop.Value = et === 'string' ? (n ? n.Name : lst.Get(0)) : n ? n.Value : 0
            );
        }, Todo(ji, e) {
            var p = ji.getValue('params') as IEnumoptionParam;
            var v = ji.Scop.Value;
            p.ac.Value = p.et === 'number' ? basic.EnumValue.GetValue(p.lst, v || 0) : v;
        }
    });

    bind.Register({
        Name: 'enum',
        OnInitialize(j, e) {

            if (!(j.dom instanceof HTMLSelectElement))
                throw "Dom must be Select";
            var s = j.Scop;
            var dm = j.dom;
            dm.contentEditable = 'true';

            var c = dm.getAttribute('enum') || dm.getAttribute('type') || dm.getAttribute('rtype');

            let lst: collection.List<basic.EnumValue> = basic.getEnum(c);

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
                if (j._store.inter) return;
                j._store.inter = true;
                try {
                    var v: any = this.options[this.selectedIndex];
                    v = parseFloat(v && v.value);
                    j.Scop.Value = isFinite(v) ? v : null;
                } catch{ }
                j._store.inter = false;
            });
        }, Todo(ji, e) {
            if (ji._store.inter) return;
            ji._store.inter = true;
            try {
                var t = ji.getValue('list') as collection.List<basic.EnumValue>;
                var v: any = basic.EnumValue.GetValue(t, ji.Scop.Value);
                v = v && t.IndexOf(v);
                (ji.dom as HTMLSelectElement).selectedIndex = v;
            } catch{ }
            ji._store.inter = false;
        }
    });
    bind.Register({
        Name: 'enumstring',
        OnInitialize(j, e) {
            var dm = j.dom as HTMLElement;
            var c = dm.getAttribute('type');
            let lst: collection.List<basic.EnumValue> = basic.getEnum(c);
            j.addValue('params', lst);
            this.Todo(j, e);
        }, Todo(ji, e) {
            var p = ji.getValue('params') as collection.List<basic.EnumValue>;
            var v = ji.Scop.Value;
            ji.dom.textContent = typeof v === 'string' ? v : p.Get(v || 0).Name;
        }
    });
    bind.Register({
        Name: 'enum2string',
        OnInitialize(j, e) {
            var dm = j.dom as HTMLElement;
            var c = dm.getAttribute('type');
            let lst: collection.List<basic.EnumValue> = basic.getEnum(c);
            j.addValue('params', lst);
            this.Todo(j, e);
        }, Todo(ji, e) {
            var p = ji.getValue('params') as collection.List<basic.EnumValue>;
            var v = ji.Scop.Value;
            ji.dom.textContent = typeof v === 'string' ? v : p.Get(v || 0).Name;
        }
    });
    bind.Register({
        Name: 'adapter', OnInitialize(ji, e) {
            var dm = ji.dom as HTMLElement;
            var itemTemplate = dm.getAttribute('item-template');
            var x = new UI.ListAdapter<any,any>(dm, itemTemplate);
            x.Parent = UI.Desktop.Current;
            x.OnInitialized = x => x.Source = ji.Scop.Value;
            ji.addValue('cnt', x);
            ji.Control = x;
        }, Todo(j, e) {
            var x = j.getValue('cnt') as UI.ListAdapter<any, any>;
            x.Source = j.Scop.Value;
        }, OnScopDisposing(j, e) {
            var x = j.getValue('cnt') as UI.ListAdapter<any, any>;
            x.Dispose();
        }
    });
    

    export var LabelJob = bind.Register({
        Name: "hideIfNull",
        OnInitialize(ji, e) {
            this.Todo(ji, e);
        }, Todo(ji, e) {

            var dm = ji.dom;
            var d = dm.parentElement;
            var dsp = d.style.display;
            var val = ji.Scop.Value;
            if (val == null) {
                if (dsp == 'none') return;
                ji.addValue('display', dsp);
                d.style.display = 'none';
            } else
                d.style.display = dsp == 'none' ? ji.getValue('display') : dsp;
        }
    });

    export var LabelJob = bind.Register(new bind.Job("prodprice",
        (ji,x) => {
            var v = ji.Scop.Value as models.Product | number;
            if (!v) {
                v = 0;
            } else {                
                v = (v as models.Product).IGetValue(userAbonment || 0) || 0;
            }
            var dm = ji.dom as HTMLElement;
            dm.innerText = math.round(v as number, 2) + ' DZD';
        }, null, null,
        function(ji, x) {            
            this.Todo(ji, x);
            var c;
            prodprices.push(c = { ji: ji, job: this });
            ji.addValue('c',c);
        },
        (ji, e) => {
            var i = prodprices.indexOf(ji.getValue('c'));
            if (i > -1)
                prodprices.splice(i, 1);
        }));
    bind.Register({
        Name: "deleteItem", OnInitialize(ji, e) {
            ji.dom.addEventListener('click', function (e) {
                var s = ji.Scop as bind.Bind;
                if (s instanceof bind.Bind) {
                    if (s.Parent) {
                        var l = s.Parent.Value as collection.List<any>;
                        if (l instanceof collection.List) {
                            l.Remove(s.Value);
                            return;
                        }
                    }
                }
                alert("remove");
            });
        }
    });
    

    ScopicCommand.Register({
        Invoke(s, dom, scop, p) {
            var target = getTargetFrom(dom);
            if (target != null) {
                dom.addEventListener('click', {
                    handleEvent(e) {
                        var hin = target.classList.contains('in');
                        if (hin)
                            target.classList.remove('in');
                        else target.classList.add('in');
                    }
                });
            }
        }
    }, null, 'accordion');
    ScopicCommand.Register({
        Invoke(s, dom, scop, p) {
            var templatePath = dom.getAttribute('as');
            if (!templatePath) return UI.InfoArea.push("command <template> required : as attribute ");
            var template = mvc.MvcDescriptor.Get(templatePath);
            if (!templatePath) return UI.InfoArea.push("the template " + templatePath + "Cannot be found");
            dom.appendChild(template.Create());
        }
    }, null, 'template');

    function getPrice(p: models.Price, a: models.Abonment) {
        var pr = p.GetPrice(a);
        if (pr == 0) {
            for (var i = a - 1; i >= 0; i--)
            {
                pr = p.GetPrice(<models.Abonment>i);
                if (pr != 0) return pr;
            }
            for (var i = a + 1; i < 4; i++)
            {
                pr = p.GetPrice(<models. Abonment>i);
                if (pr != 0) return pr;
            }
            if (p.PSel != 0) return p.PSel;
            return 0;
        }
        return pr;
    }

    ScopicCommand.Register({
        Invoke(s, dom, scop, p) {
            var data = dom.getAttribute('db-data');
            dom.addEventListener('click', (e) => {
                switch (data) {                    
                    case 'costume':
                        var t = <models.FakePrice>scop.Value;
                        if (t.ApplyPrice === t || t.ApplyPrice == null)
                            var y = new models.FakePrice(basic.New());
                        else y = <any>t.ApplyPrice;

                        for (var i = 3; i >= 0; i--) {
                            y.ISetValue(<models.Abonment>i, t.GetPrice(<models.Abonment>i));
                        }
                        y.PSel = t.PSel;
                        y.Product = t.Product;
                        y.Qte = t.Product.Qte;
                        t.ApplyPrice = y;
                        break;
                    case 'current':
                        var val = scop.Value as models.Price;
                        if (val instanceof models.Product) return;
                        fakePrice = scop.Value ;
                        var prd = (<models.FakePrice>fakePrice).Product;
                        if (!prd) return UI.InfoArea.push('The product of this revage is not setted', false);                        
                        for (var i = 3; i >= 0; i--) {
                            fakePrice.ISetValue(<models.Abonment>i, prd.GetPrice(<models.Abonment>i));
                        }
                        break;
                    case 'calc':
                        var fakePrice = scop.Value as models.Price;
                        var ps = fakePrice.PSel;
                        for (var i = 3; i >= 0; i--) {
                            fakePrice.ISetValue(<models.Abonment>i, ps = parseFloat(math. round(ps * 1.33, 2)));
                        }                        
                        break;
                    case 'default':
                        var t = <models.FakePrice>scop.Value;
                        t.ApplyPrice = t;
                        break;
                    case 'update':
                        var t = <models.FakePrice>scop.Value;
                        GData.apis.Revage.Save(t.ApplyPrice, (e) => {
                            if (e.Error === basics.DataStat.Success) {
                                t.ApplyPrice = null;
                                UI.InfoArea.push("The Product Price successfully Updated .", true);
                            } else
                                UI.InfoArea.push("Error Occoured When Updating <h1>Product</h1> Price .", false);
                        });
                        break;
                    case 'restore':
                        //requester.Post(models.FakePrice, y, null,
                        //    (s, r, iss) => {
                        //    },
                        //    (r, t) => {
                        //        r.Url='/_/Price'
                        //    });
                        var t = <models.FakePrice>scop.Value;
                        t.ApplyPrice = null;
                        
                        break;
                    default:
                }
            }, false);
        }
    }, null, 'prdPrice');

}
function OnSuccessCategory(cat: imodels.FakePrice, isNew: boolean) {

    GData.requester.Post(imodels.FakePrice, cat, null, (s, r, iss) => {

        if (iss) {
            UI.InfoArea.push("The Category Successfully Added", true);
            if (isNew) {
                imodels.FakePrice.pStore.Set(cat.Id, cat);
                var p = imodels.FakePrice.getById(cat.Id) as imodels.FakePrice;
                if (p == null) {
                    p = new imodels.FakePrice(cat.Id);
                    imodels.FakePrice.pStore.Set(cat.Id, p);
                }
            }
            cat.Commit(); return;
        } else UI.InfoArea.push("AN Expected Error !!!!!<br>while Inserting The Category", false, 8000);
        cat.Rollback();
    });
    return true;
}
function OnErrorCategory(cat: imodels.FakePrice, isNew: boolean) {
    UI.InfoArea.push("The Modification Aborded", false, 2500);
    return false;
}
var prodprices: { ji: bind.JobInstance, job: basic.IJob }[] = [];
export namespace Filters {
    var _: FakePriceFilter[] = [];
    export class FakePriceFilter extends bind.Filter<imodels.FakePrice, number> {
        private dbsvc: bind.PropBinding;
        constructor(scop: bind.Scop, b: bind.BindingMode) {
            super(scop, b);
        }
        Initialize() {            
            super.Initialize();                                                                                  
        }
        public set Fraction(v: imodels.Abonment) {
            if (this.fraction === v) return;
            
            var f = this.source.Value as imodels.FakePrice;
            if (f) {
                var d = imodels.FakePrice.GetDProperty(v);
                if (!d) return;
                var ld = imodels.FakePrice.GetDProperty(this.fraction);                
                if (this.dbe)
                    f.removeEvent(ld, this.dbe);
                this.dbe = f.OnPropertyChanged<number>(d, this.OntargetVC, this);
            }
            this.fraction = v;
            this.Update();
        }
        private dbe: bind.PropBinding;
        private fraction: imodels.Abonment = -2;
        protected Convert(data: imodels.FakePrice): number {
            return data ? data.IGetValue(this.fraction || 0) : 0;
        }
        protected ConvertBack(data: number): imodels.FakePrice {
            var fake = this.source.Value as imodels.FakePrice;
            if (fake)
                fake.ISetValue(this.fraction || 0, data);
            return fake;
        }
        private OntargetVC(s: bind.PropBinding, e: bind.EventArgs<number, imodels.FakePrice>) {
            
            if (this.isChanging) return;
            this.isChanging = true;
            this.Update();
            this.isChanging = false;
        }
        protected SourceChanged(s: bind.PropBinding, e: bind.EventArgs<imodels.FakePrice, bind.Scop>) {
            super.SourceChanged(s, e);            
            var n = e._new;
            var o = e._old;
            var ld = imodels.FakePrice.GetDProperty(this.fraction);
            if (this.dbe)
                if (o) {
                    o.removeEvent(ld, this.dbe);
                    this.dbe = null;
                }
                else throw "";
            if (n)
                this.dbe = n.OnPropertyChanged<number>(ld, this.OntargetVC, this);
        }

        Dispose() {
            var ld = imodels.FakePrice.GetDProperty(this.fraction);
            if (this.dbe)
                this.source.Value.removeEvent(ld, this.dbe);
            if (this.source)
                this.source.removeEvent(bind.Scop.DPValue, this.dbsvc);
            var i = _.indexOf(this);
            if (i !== -1) _.splice(i, 1);
            super.Dispose();
        }
    }    
    bind.RegisterFilter({
        BindingMode: 3, Name: 'fackeprice', CreateNew(s, m, p) {            
            var e = new FakePriceFilter(s, m);
            e.Fraction = p == null ? userAbonment : isNaN(p as any) ? imodels.Abonment[p] : parseFloat(p);
            _.push(e);
            return e;
        }
    });

    window['_'] = _;
    window['__'] = prodprices;
    export function setAbonment(v: models.Abonment) {
        userAbonment = v || 0;
        for (var i of _)
            i.Fraction = v;
        for (var j of prodprices)
            j.job.Todo(j.ji, null);
    }
    var pb: bind.Scop;
    GData.user.OnMessage((s, e) => {
        if (e._new) {
            var c = bind.NamedScop.Get('User');
            pb = bind.Scop.Create('Client.Abonment', c, bind.BindingMode.SourceToTarget);
            pb.addListener((ev) => {
                Filters.setAbonment(ev._new);
            });
        } else {
            //pb.Dispose();
            //Filters.setAbonment(-1);
        }
    });
}
var userAbonment: models.Abonment = GData.user.Client.Abonment || 0;
export function LoadJobs() {
    
}
//var redEx = /\0([\+|\-]{0,1}[\d]+(\.[\d]+){0,1})([\%]{0,1})\0/gmi;

interface IRedEx extends basic.IJob {
    Calc(ji: bind.JobInstance, val: IValue);
    _OnArtOrPrdChanged(job: bind.JobInstance, e: bind.EventArgs<any, any>): void;
    _OnValueTextChanged(ji: bind.JobInstance, e: Event): void;
    lock?<T>(this: IRedEx, ji: bind.JobInstance, owner: any, callback: (...args: any[]) => T, params: Array<any>): T;
}

interface IValue {
    Method: string;
    Value: number;
    IsPercent: boolean;
}
var redEx = /\0([\=\*\-\+\:\/]){0,1}([\-]{0,1}[\d]+(\.[\d]+){0,1})([\%]{0,1})\0/gmi;
var rOut = {
    pa: NaN,
    pv: NaN,
    reduction: NaN,
};
function getValues(art: models.Article, prd: models.Product) {
    if (art) {
        var owner = art.Owner;
        var c = owner && owner.Client;
        rOut.pv = prd || (prd && !art.Price) ? prd.GetPrice((c && c.Abonment) || 0) : art.Price;
        rOut.pa = prd ? prd.PSel : art.PSel;
        rOut.reduction = ((rOut.pv / (rOut.pa || NaN) - 1) * 100);
    } else {
        rOut.pa = NaN;
        rOut.pv = NaN;
        rOut.reduction = NaN;
    }
    return rOut;
}
function calcReduction(art: models.Article, prd: models.Product, val: IValue) {
    var vls = getValues(art, prd);
    if (prd && art) {
        if (vls.pv < vls.pa) vls.pv = vls.pa;
        var v = val.Value;
        switch (val.Method) {
            case '=':
                art.Price = v;
                break;
            case '*':
                art.Price = prd.PSel * v;
                break;
            case ':':
                art.Price = prd.GetPrice(v as models.Abonment);
                break;
            case '+':
                if (val.IsPercent) {
                    art.Price = prd.PSel * (1 + v / 100);
                } else {
                    art.Price = vls.pv + v;
                }
                break;
            case '-':
                if (val.IsPercent) {
                    art.Price = prd.PSel * (1 - v / 100);
                } else {
                    art.Price = vls.pv - v;
                }
                break;
            case '/':
                art.Price = prd.PSel + Math.abs(vls.pv - vls.pa) / v;
                break;
            default:
                if (val.IsPercent) {
                    art.Price = prd.PSel * (1 + v / 100);
                } else {
                    art.Price = vls.pv + v;
                }
                break;
        }
    }
}
var reduction= <IRedEx>bind.Register(<IRedEx>{
    Name: 'reduction',
    _OnArtOrPrdChanged(ji, e) {
        var art = ji.getValue('parent') as models.Article;
        art = art && (art as any).Value;   
        var s = art && art.Reduction;
        if (ji.dom instanceof HTMLInputElement)
            (ji.dom as HTMLInputElement).value = isNaN(s) ? '' : String(s);
        else
            ji.dom.textContent = String(s);
    },
    _OnValueTextChanged(this: IRedEx, ji: bind.JobInstance, e: Event) {
        var d = ji.dom as HTMLInputElement;
        var art = ji.getValue('parent') as models.Article;
        art = art && (art as any).Value;
        if (!art) return;
        if (art.setReduction(d.value))
            d.classList.remove('error');
        else d.classList.add('error');
        return;
    },
    Todo(this: IRedEx, ji, e) {
        this.lock(ji, this, this._OnArtOrPrdChanged, [ji, e, true]);
    }, OnInitialize(this: IRedEx, ji, e) {
        var d = ji.dom, pscop = ji.Scop.getParent();
        d.addEventListener('change', function (e) { reduction.lock(ji, reduction, reduction._OnValueTextChanged, [ji, e]); });
        ji.addValue('parent', pscop);
        this.lock(ji, reduction, reduction._OnArtOrPrdChanged, [ji, e]);
    },
    lock<T>(this: IRedEx, ji: bind.JobInstance, owner: any, callback : (...args: any[]) => T, params: Array<any>) {
        if (ji._store.lock) return;
        ji._store.lock = true;
        var r = helper.TryCatch(owner, callback, null, params);
        ji._store.lock = false;
        return r;
    }

}, true);


interface IProductCart {
    img: HTMLSpanElement;
    name: HTMLAnchorElement;
    description: HTMLParagraphElement;
    price: HTMLDivElement;
}

export class ProductCartJob implements basic.IJob {
    Name = 'productcart';
    Todo(ji: bind.JobInstance, e: bind.EventArgs<models.Product, any>) {
        var t = ji._store as IProductCart;
        var n = e._new;
        var p = e._new.Picture;
        t.img.style.backgroundImage = p == null ? '' : 'url(' + p + ')';
        t.description.textContent = n.Description;
        t.name.textContent = n.Name;
        t.price.textContent = n.Revage == null ? '0' : n.Revage.Value + '';
    }
    Check(ji: bind.JobInstance, e: bind.EventArgs<any, any>) {
    }
    OnError(ji: bind.JobInstance, e: bind.EventArgs<any, any>) {
    }
    OnScopDisposing(ji: bind.JobInstance, e: bind.EventArgs<any, any>) {
    }
    OnInitialize(ji: bind.JobInstance, e: bind.EventArgs<models.Product, any>) {
        var d = ji.dom as HTMLDivElement;

        ji._store['img'] = $('img', d);
        ji._store['name'] = $('name', d);
        ji._store['description'] = $('description', d);
        ji._store['price'] = $('price', d);
        this.Todo(ji, e);
    }
}
var defaultImg = 'url("' + context.GetPath('../assets/img/2.png') + '")';
bind.Register(new ProductCartJob());
bind.Register(<any>{
    Name: 'SelectImage',
    getTarget(j: bind.JobInstance) {
        var t = j.getValue('target') as HTMLImageElement;
        if (t) return t;
        t = getTargetFrom(j.dom as HTMLElement) as any;
        j.addValue('target', t);
        return t;
    },
    OnInitialize(j:bind.JobInstance, e) {
        var input = j.dom as HTMLInputElement;
        if (!(input instanceof HTMLInputElement)) return console.log('dom must be a HtmlInput Element');
        var target = this.getTarget(j) as HTMLImageElement;
        input.type = 'file';
        input.multiple = false;
        input.accept = "image/*";
        j.addEventListener('change', 'change', (e) => {
            var t = this.getTarget(j) as HTMLImageElement;
            if (!t) return;
            if (input.files && input.files[0]) {
                var reader = new FileReader();
                reader.onload = e => t.setAttribute('src', (e.target as any).result);
                reader.readAsDataURL(input.files[0]);
            }
        });
        this.Todo(j, e);
    }, Todo(j: bind.JobInstance, e: bind.EventArgs<models.Picture, any>) {
        var target = this.getTarget(j) as HTMLImageElement;
        var v = j.Scop.Value;
        target.src = v == null || v == '' ? '' : '/_/Picture/' + v;
    }
});
export interface IPicture {
    Picture: string;
}

export class PictureEditor extends UI.Modals.EModalEditer<PictureEditor>{    
    private _btn: HTMLInputElement = null;
    private _img: HTMLImageElement = null;

    public static DPAdapter = bind.DObject.CreateField<UI.ListAdapter<IPicture, any>, PictureEditor>("Adapter", UI.ListAdapter);
    onSave: (s: this) => void;
    constructor(public Adapter: UI.ListAdapter<IPicture, any>) {
        super('Picture.edit',false);
        this.scop.Value = this;
        window['tt'] = this;
    }
    initialize() {
        super.initialize();
        //this.OkTitle("Save");
        this.Canceltitle("Close");
    }
    set Data(v) {
    }
    Update() {
        var e = PictureEditor.getValue(this, ['Adapter', 'SelectedItem', 'Picture']);
        this._img.src = e == null || e == '' ? '' : '/_/Picture/' + e;
    }
    private static getValue(o, s: string[]) {
        for (var i = 0; i < s.length; i++) {
            if (o == null) return undefined;
            o = o[s[i]];
        }
        return o;
    }
    setName(name: string, dom: HTMLElement, cnt: UI.JControl, e: bind.IJobScop) {
        if (name === '_img') {
            this[name] = dom as HTMLImageElement;
        }
        else if (name === '_btn') {
            this[name] = dom as any;
        }
    }
    OnImageSubmit(e: Event, dt: bind.EventData, scop: bind.Scop, ev: bind.events) {
        this.Files = this._btn.files;
    }
    OnKeyDown(e: KeyboardEvent) {
        if (e.keyCode === UI.Keys.F5) this.Update();
        if (e.ctrlKey) {
            if (e.keyCode == UI.Keys.Down)
                this.Adapter.SelectedIndex++;
            else if (e.keyCode == UI.Keys.Up)
                this.Adapter.SelectedIndex--;
            else if (e.keyCode == UI.Keys.Left) {
                var p = this.Adapter.Parent.Parent;
                if (p instanceof UI.Paginator)
                    p.Previous();
            }
            else if (e.keyCode == UI.Keys.Right) {
                var p = this.Adapter.Parent.Parent;
                if (p instanceof UI.Paginator)
                    p.Next();
            }
            else if (e.keyCode == 115 || e.keyCode == 83)
                this.onSave && this.onSave(this);
            else
                return super.OnKeyDown(e);
        } else return super.OnKeyDown(e);
        return true;
    }
    public static DPFiles = bind.DObject.CreateField<FileList, PictureEditor>("Files", FileList, null);
    public Files: FileList;

    static __fields__() { return [this.DPFiles, this.DPAdapter] as any; }
    Open(onSave?: (s: this) => void) {
        this.Files = null;
        if (this._btn) this._btn.value = '';
        super.Open();
        this.onSave = onSave;
    }
    public Upload(prd: models.Product, callback?: APIEventHandler<any,any>) {
        var f = this.Files && this.Files[0];
        if (!f) return UI.InfoArea.push("Please Select a picture for upload");
        var reader = new FileReader();
        reader.onload = e => {
            GData.requester.Request(models.Product, "AVATAR", (e.target as any).result, { Operation: 'AVATAR', Name: f.name, Size: f.size, PID: prd.Id }, (e, json, iss, req) => {
                if (iss)
                    prd.Picture = json as any;
                callback && callback({ Api: void 0, Data: json as any, Error: iss ? basic.DataStat.Success : basic.DataStat.Fail });
            });
        }
        reader.readAsArrayBuffer(this.Files[0]);
    }


}
window['pictue'] = PictureEditor;
//window['testPicture'] = () => {
//    var d = new models.Picture(basic.New());
//    var e = new PictureEditor();
//    e.edit(d, true, void 0, true);
//    return { e: e, d: d };
//}

bind.Register({
    Name: 'image',
    OnInitialize: function (ji, e) {
        this.Todo(ji, e);
    },
    Todo: function (ji, e) {
        var src = ji.Scop.Value;
        src = src == null ? "" : src;
        var dm = <HTMLImageElement>ji.dom;
        if (src instanceof models.Picture)
            src = src.ImageUrl;
        dm.style.backgroundImage = src == null || src == "" ? defaultImg : 'url("/_/Picture/' + src + '")';
    }
});
ScopicCommand.Register({
    Invoke: (name, dom, scop, param) => {
        if (!scop) return;
        applyImage(dom as HTMLImageElement, scop.Value);
        scop.OnPropertyChanged(bind.Scop.DPValue, (s, e) => {
            applyImage(dom as HTMLImageElement, e._new);
        });        
    }
}, null, "image");
function applyImage(dm: HTMLImageElement,src:models.Picture|string) {
    src = src == null ? "" : src;
    if (src instanceof models.Picture)
        src = src.ImageUrl;
    dm.style.backgroundImage = src == null || src == "" ? defaultImg : 'url("' + src + '")';
}

function shrinkIMG(data: any[]) {
    var x = new XMLHttpRequest();
    x.open('POST', 'api.tinify.com/shrink');
    x.setRequestHeader('Authorization', "YXBpOjFSeGc2bm9VMmprSnZ4LUxWU1lCalR5Q0dtVEZNYlVh");
    x.send(data as any);
    
}
