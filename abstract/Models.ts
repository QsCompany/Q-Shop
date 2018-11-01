import { math, crypto, net, basic, encoding, bind, reflection, thread, utils, collection, attributes, helper, Api, Notification, mvc } from "../lib/q/sys/Corelib";
import { sdata, Controller } from '../lib/q/sys/System';
import { models as qmodels } from '../lib/q/sys/QModel';
import { UI } from "../lib/Q/sys/UI";
import { FactureAchat, FactureVent } from "../Desktop/Admin/Facture";
import { Material } from "../lib/q/components/QUI/script";
import { Material as c3d } from "../lib/q/components/Canvas3D/script";
import { GetVars } from "./extra/Common";
var DPIsLogged = bind.DObject.CreateField<boolean, models.Login>("CheckLogging", Boolean, null, null, null, bind.PropertyAttribute.NonSerializable);

declare var context : basic.IContext;
export namespace models {

    export enum Job {
        Detaillant = 0,
        Proffessional = 1,
        WGrossit,
        Grossist = 2,
        Entrepreneur
    }
    export enum Abonment {
        Detaillant = 0,
        Proffessionnal = 1,
        DemiGrossist = 2,
        Grossist = 3,
        Importateur = 4,
        Exportateur = 5,
    }
    export function get() {
        delete models.get; return DPIsLogged;
    }

    export enum VersmentType {
        Espece,
        CCP,
        CIB,
        Cheque,
        EPay,
        QPay,
    }
    const Validable = 0, UnValidable = 4096;
    export enum BonType {
        Bon = 2,
        Facture = 4,

        Devise = 4096 + 2,
        ProFormat = 4096 + 4,
    }

    export enum TransactionType {
        Vente = 0,
        Neutre = 1,
        Avoir = 2,
    }
    export enum FTransactionType {
        Achat = 0,
        Neutre = 1,
        Avoir = 2,
    }

    
    export enum AgentPermissions {

        None = 0,
        Agent = 1,
        Vendeur = Agent | 2,
        Achteur = Agent | 4,
        Cassier = Agent | 8,
        Validateur = Agent | 16,
        Admin = -1
    }
    export enum Quality {
        None,
        Low,
        Medium,
        High,
    }

    export interface ISFacture {
        Articles: models.Articles | models.FakePrices;
        Fournisseur: models.Client;
        Achteur: models.Client;
        Validator: models.Client;
        IsValidated: models.Client;
        LastModified?: Date;
        Date: Date;
        Total: number;
        Versments: Versments;
    }

    export interface IloginCallback {
        Id: number;
        IsLogged: boolean;
        hash: number;
    }
    export class SMS extends sdata.QShopRow {
        private static store = new collection.Dictionary<number, SMS>("sms");
        protected getStore(): collection.Dictionary<number, any> {
            return SMS.store;
        }
        Update() {
            
        }
        Upload() {
            
        }

        public static DPFrom: bind.DProperty<Client, SMS>;
        public static DPTo: bind.DProperty<Client, SMS>;
        public static DPIsReaded: bind.DProperty<Boolean, SMS>;
        public static DPTitle: bind.DProperty<string, SMS>;
        public static DPMessage: bind.DProperty<string, SMS>;
        public static DPDate: bind.DProperty<Date, SMS>;
        public get From() { return this.get<Client>(SMS.DPFrom); }
        public set From(v: Client) { this.set(SMS.DPFrom, v); }
        public get To() { return this.get<Client>(SMS.DPTo); }
        public set To(v: Client) { this.set(SMS.DPTo, v); }
        public get IsReaded() { return this.get<Boolean>(SMS.DPIsReaded); }
        public set IsReaded(v: Boolean) { this.set(SMS.DPIsReaded, v); }
        public get Title() { return this.get<string>(SMS.DPTitle); }
        public set Title(v: string) { this.set(SMS.DPTitle, v); }
        public get Message() { return this.get<string>(SMS.DPMessage); }
        public set Message(v: string) { this.set(SMS.DPMessage, v); }
        public get Date() { return this.get<Date>(SMS.DPDate); }
        public set Date(v: Date) { this.set(SMS.DPDate, v); }
        static __fields__() { return [this.DPFrom, this.DPTo, this.DPIsReaded, this.DPTitle, this.DPMessage, this.DPDate]; }
        static ctor() {
            this.DPFrom = bind.DObject.CreateField<Client, SMS>("From", Client, null,null, null, bind.PropertyAttribute.SerializeAsId);
            this.DPTo = bind.DObject.CreateField<Client, SMS>("To", Client, null, null, null, bind.PropertyAttribute.SerializeAsId);
            this.DPIsReaded = bind.DObject.CreateField<Boolean, SMS>("IsReaded", Boolean);
            this.DPTitle = bind.DObject.CreateField<string, SMS>("Title", String);
            this.DPMessage = bind.DObject.CreateField<string, SMS>("Message", String);
            this.DPDate = bind.DObject.CreateField<Date, SMS>("Date", Date);
            
        }
        //protected onPropertyChanged(ev:bind. EventArgs<any, any>) {
        //    super.onPropertyChanged(ev);
        //    this.Save(ev.prop);
        //}
        //Save(prop: bind.DProperty<string, this>) {
            
        //    if (prop == SMS.DPTitle || prop === SMS.DPMessage)
        //        Api.RiseApi("SMSProperty.Changed", { data: { sms: this, prop: prop } });
        //}
    }
    export class SMSs extends sdata.DataTable<models.SMS>{
        constructor(public readonly category: string, public readonly Tag: string) {
            super(null, models.SMS, (id) => new models.SMS(id));
        }
        public get ArgType() { return models.SMS; }
        protected getArgType(json) { return models.SMS; }
        GetType() { return SMSs; }
    }

    
}

export namespace models {


    var sfpStore = new collection.Dictionary<number, SFacture>("sfactures", false);

    export abstract class SiegeSocial extends sdata.QShopRow {
        public static DPAddress: bind.DProperty<String, SiegeSocial>;
        public static DPVille: bind.DProperty<String, SiegeSocial>;
        public static DPCodePostal: bind.DProperty<String, SiegeSocial>;
        public static DPSiteWeb: bind.DProperty<String, SiegeSocial>;
        public static DPEmail: bind.DProperty<String, SiegeSocial>;
        public static DPTel: bind.DProperty<string, SiegeSocial>;
        public static DPMobile: bind.DProperty<String, SiegeSocial>;
        public get Address() { return this.get<String>(SiegeSocial.DPAddress); }
        public set Address(v: String) { this.set(SiegeSocial.DPAddress, v); }
        public get Ville() { return this.get<String>(SiegeSocial.DPVille); }
        public set Ville(v: String) { this.set(SiegeSocial.DPVille, v); }
        public get CodePostal() { return this.get<String>(SiegeSocial.DPCodePostal); }
        public set CodePostal(v: String) { this.set(SiegeSocial.DPCodePostal, v); }
        public get SiteWeb() { return this.get<String>(SiegeSocial.DPSiteWeb); }
        public set SiteWeb(v: String) { this.set(SiegeSocial.DPSiteWeb, v); }
        public get Email() { return this.get<String>(SiegeSocial.DPEmail); }
        public set Email(v: String) { this.set(SiegeSocial.DPEmail, v); }
        public get Tel() { return this.get<string>(SiegeSocial.DPTel); }
        public set Tel(v: string) { this.set(SiegeSocial.DPTel, v); }
        public get Mobile() { return this.get<String>(SiegeSocial.DPMobile); }
        public set Mobile(v: String) { this.set(SiegeSocial.DPMobile, v); }
        static __fields__() { return [this.DPAddress, this.DPVille, this.DPCodePostal, this.DPSiteWeb, this.DPEmail, this.DPTel, this.DPMobile]; }
        static ctor() {
            this.DPAddress = bind.DObject.CreateField<String, SiegeSocial>("Address", String);
            this.DPVille = bind.DObject.CreateField<String, SiegeSocial>("Ville", String);
            this.DPCodePostal = bind.DObject.CreateField<String, SiegeSocial>("CodePostal", String);
            this.DPSiteWeb = bind.DObject.CreateField<String, SiegeSocial>("SiteWeb", String);
            this.DPEmail = bind.DObject.CreateField<String, SiegeSocial>("Email", String);
            this.DPTel = bind.DObject.CreateField<string, SiegeSocial>("Tel", String);
            this.DPMobile = bind.DObject.CreateField<String, SiegeSocial>("Mobile", String);
        }
    }
    export abstract class Shop extends SiegeSocial {
        public static DPRIB: bind.DProperty<String, Shop>;
        public static DPNRC: bind.DProperty<String, Shop>;
        public static DPNIF: bind.DProperty<String, Shop>;
        public static DPNCompte: bind.DProperty<String, Shop>;
        public static DPCapitalSocial: bind.DProperty<String, Shop>;
        public static DPNAI: bind.DProperty<String, Shop>;
        public static DPNIS: bind.DProperty<String, Shop>;
        public get RIB() { return this.get<String>(Shop.DPRIB); }
        public set RIB(v: String) { this.set(Shop.DPRIB, v); }
        public get NRC() { return this.get<String>(Shop.DPNRC); }
        public set NRC(v: String) { this.set(Shop.DPNRC, v); }
        public get NIF() { return this.get<String>(Shop.DPNIF); }
        public set NIF(v: String) { this.set(Shop.DPNIF, v); }
        public get NCompte() { return this.get<String>(Shop.DPNCompte); }
        public set NCompte(v: String) { this.set(Shop.DPNCompte, v); }
        public get CapitalSocial() { return this.get<String>(Shop.DPCapitalSocial); }
        public set CapitalSocial(v: String) { this.set(Shop.DPCapitalSocial, v); }
        public get NAI() { return this.get<String>(Shop.DPNAI); }
        public set NAI(v: String) { this.set(Shop.DPNAI, v); }
        public get NIS() { return this.get<String>(Shop.DPNIS); }
        public set NIS(v: String) { this.set(Shop.DPNIS, v); }
        static __fields__() { return [this.DPRIB, this.DPNRC, this.DPNIF, this.DPNCompte, this.DPCapitalSocial, this.DPNAI, this.DPNIS]; }
        static ctor() {
            this.DPRIB = bind.DObject.CreateField<String, Shop>("RIB", String);
            this.DPNRC = bind.DObject.CreateField<String, Shop>("NRC", String);
            this.DPNIF = bind.DObject.CreateField<String, Shop>("NIF", String);
            this.DPNCompte = bind.DObject.CreateField<String, Shop>("NCompte", String);
            this.DPCapitalSocial = bind.DObject.CreateField<String, Shop>("CapitalSocial", String);
            this.DPNAI = bind.DObject.CreateField<String, Shop>("NAI", String);
            this.DPNIS = bind.DObject.CreateField<String, Shop>("NIS", String);
        }
    }


    export abstract class Dealer extends Shop {
        static __fields__() {
            return [this.DPName, this.DPAvatar, this.DPObservation,
            this.DPVersmentTotal, this.DPMontantTotal, this.DPNFactures, this.DPSoldTotal] as any[];
        }
        public static DPName: bind.DProperty<string, Dealer>;
        public static DPAvatar: bind.DProperty<string, Dealer>;
        public static DPMontantTotal: bind.DProperty<number, Dealer>;
        public MontantTotal: number;


        public static DPVersmentTotal: bind.DProperty<number, Dealer>;
        public VersmentTotal: number;


        

        public static DPObservation: bind.DProperty<string, Dealer>;
        public Observation: string;


        public static DPNFactures: bind.DProperty<number, Dealer>;
        public NFactures: number;


        public static DPSoldTotal: bind.DProperty<number, Dealer>;

        public get SoldTotal(): number { return this.get(Dealer.DPSoldTotal); }
        public Name: string;
        public Avatar: string;

        static ctor() {
            //this.DPEmail = bind.DObject.CreateField<string, Dealer>("Email", String);
            //this.DPTel = bind.DObject.CreateField<string, Dealer>("Tel", String);
            this.DPName = bind.DObject.CreateField<string, Dealer>("Name", String);
            //this.DPAddress = bind.DObject.CreateField<string, Dealer>("Address", String);
            this.DPAvatar = bind.DObject.CreateField<string, Dealer>("Avatar", String);

            Dealer.DPObservation = bind.DObject.CreateField<string, Dealer>('Observation', String);
            Dealer.DPVersmentTotal = bind.DObject.CreateField<number, Dealer>('VersmentTotal', Number, null, calcSold);
            Dealer.DPMontantTotal = bind.DObject.CreateField<number, Dealer>('MontantTotal', Number, null, calcSold);
            Dealer.DPNFactures = bind.DObject.CreateField<number, Dealer>('NFactures', Number, null);
            Dealer.DPSoldTotal = bind.DObject.CreateField<number, Dealer>('SoldTotal', Number, 0, null, null, bind.PropertyAttribute.Private);
        }
    }
    function calcSold(e: bind.EventArgs<number, Dealer>) {
        e.__this.SetValue(Dealer.DPSoldTotal, (e.__this.MontantTotal || 0) - (e.__this.VersmentTotal || 0));
    }
    export type Message = qmodels.Message;
   
    export class Picture extends sdata.QShopRow {

        public static DPImageUrl = bind.DObject.CreateField<string, Picture>("ImageUrl", String, "");
        public ImageUrl: string;
        static __fields__() { return [Picture.DPImageUrl]; }

        private _region: basic.Rectangle = new basic.Rectangle();
        public get Region(): basic.Rectangle {
            return this._region;
        }
        constructor(id: number, url?: string) {
            super(id);
            this.ImageUrl = url;
        }

        public static getById(id: number, type: Function): Picture {
            return Picture.pstore.Get(id);
        }
        public getStore(): collection.Dictionary<number, any> { return Picture.pstore; }

        private static pstore = new collection.Dictionary<number, Picture>("Pictures", true);
    }

    export class Pictures extends sdata.DataTable<Picture>{
        constructor(_parent: sdata.DataRow, items?: Picture[]) {
            super(_parent, Picture, (id) => new Picture(id), items);
        }
        public get ArgType() { return Picture; }
        protected getArgType(json) { return Picture; }
        GetType() { return Pictures; }
    }

    export abstract class FactureBase extends sdata.QShopRow implements net.IRequestParams {
        [name: string]: any;
        static __fields__() {
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
        }
        public static DPTotal = bind.DObject.CreateField<number, FactureBase>('Total', Number, 0, (e) => {
            var x = e.__this;
            x.Sold = x.Total - x.Versment;
        }, null, bind.PropertyAttribute.NonSerializable);
        public Total: number;

        public static DPDateLivraison = bind.DObject.CreateField<Date, FactureBase>('DateLivraison', Date, null);
        public DateLivraison: Date;

        public static DPDate = bind.DObject.CreateField<Date, FactureBase>('Date', Date, null);
        public Date: Date;

        public static DPEditeur: bind.DProperty<models.Client, FactureBase>;
        public Editeur: models.Client;
        public static DPValidator: bind.DProperty<Agent, FactureBase>;
        public Validator: Agent;
        public static DPObservation = bind.DObject.CreateField<string, FactureBase>('Observation', String, null);
        public Observation: string;
        public static DPLockedBy: bind.DProperty<Agent, FactureBase>;
        public LockedBy: Agent;
        public static DPLockedAt: bind.DProperty<Date, FactureBase>;
        public LockedAt: Date;
        public static DPType = bind.DObject.CreateField<BonType, FactureBase>('Type', Number, BonType.Bon, FactureBase.prototype.factureTypeChanged, (e) => { if (BonType[e._new] == undefined) e._new = e._old || BonType.Bon; }, bind.PropertyAttribute.NonSerializable);
        public Type: BonType;

        public static DPTransaction = bind.DObject.CreateField<TransactionType, FactureBase>("Transaction", Number, TransactionType.Vente,
            FactureBase.prototype.factureTypeChanged, FactureBase.prototype.onTransactionChanging, bind.PropertyAttribute.NonSerializable);

        public Transaction: TransactionType;


        public get Factor() { return this.Type < 4096 ? this.Transaction == TransactionType.Avoir ? -1 : 1 : 1; }
        private onTransactionChanging(e: bind.EventArgs<TransactionType, FactureBase>) {
            if (TransactionType[e._new] == undefined) e._new = e._old || TransactionType.Vente;
            else
                switch (this.Type) {
                    case BonType.Bon:
                    case BonType.Facture:
                        if (e._new == TransactionType.Neutre) e._new = TransactionType.Vente;
                        break;
                    default:
                        if (e._new !== TransactionType.Neutre) e._new = TransactionType.Neutre;
                        break;
                }
        }
        public SetFactureType(bonType: BonType, transaction: TransactionType) {
            bonType = bonType == undefined ? this.Type : bonType;
            transaction = transaction == undefined ? this.Transaction : transaction;

            if (bonType > 4096) transaction = TransactionType.Neutre;
            else {
                if (transaction == TransactionType.Neutre)
                    transaction = TransactionType.Vente;
            }

            this.set(FactureBase.DPTransaction, transaction);
            this.set(FactureBase.DPType, bonType);
        }
        private factureTypeChanged(e: bind.EventArgs<any, FactureBase>) {
            if (e.prop === FactureBase.DPType) this.SetFactureType(e._new, undefined);
            else this.SetFactureType(undefined, e._new);
        }
        public static DPIsValidated = bind.DObject.CreateField<boolean, FactureBase>('IsValidated', Boolean, null, null, null, bind.PropertyAttribute.NonSerializable);
        public IsValidated: boolean;


        public static DPVersments = bind.DObject.CreateField<sdata.DataTable<VersmentBase>, FactureBase>("Versments", sdata.DataTable, null, null, null, bind.PropertyAttribute.Private);
        public Versments: sdata.DataTable<VersmentBase>;
        public ClearVersments() {
            this.MakeChange(function () { var v = this.Versments; if (v) v.Clear(); else this.Versments = this.createNewVersments() }, this);
            return this.Versments;
        }
        protected abstract createNewVersments(): sdata.DataTable<VersmentBase>;
        public IsFrozen() {
            return !this.IsOpen;
        }
        public Freeze() {
            this.IsOpen = false;
        }
        public UnFreeze() {
            this.IsOpen = true;
        }
        
        public static DPIsOpen = bind.DObject.CreateField<boolean, FactureBase>('IsOpen', Boolean, false, function (this:any,e) {
            if (!!e._new) {
                //helper.TryCatch(this.Articles, this.Articles.UnFreeze);
                //bind.DObject.prototype.UnFreeze.call(this);
            }
            else {
                //helper.TryCatch(this.Articles, this.Articles.Freeze);
                //bind.DObject.prototype.Freeze.call(this);
            }
        }, (e) => {
            if (typeof e._new !== 'boolean') e._new = !!e._new;
        }, bind.PropertyAttribute.NonSerializable | bind.PropertyAttribute.Private);
        set<T>(prop: bind.DProperty<T, this>, value: T, keepEvent?: boolean) {
            var isopen = prop === FactureBase.DPIsOpen as any;
            if (isopen && this._isFrozen)
                this._isFrozen = false;
            var e = super.set<T>(prop, value, keepEvent);
            if (isopen && !value)
                this._isFrozen = true;

            return e;
        }
        public get IsOpen(): boolean { return this.get(FactureBase.DPIsOpen); }
        public set IsOpen(c: boolean) { this.set(FactureBase.DPIsOpen, c); }

        public static DPNArticles = bind.DObject.CreateField<number, FactureBase>('NArticles', Number, 0, null, null, bind.PropertyAttribute.NonSerializable);
        public NArticles: number;


        public static DPRef = bind.DObject.CreateField<string, FactureBase>('Ref', String, null, null, null, bind.PropertyAttribute.NonSerializable);
        public Ref: string;


        public static DPSold = bind.DObject.CreateField<number, FactureBase>('Sold', Number, null, null, null, bind.PropertyAttribute.NonSerializable);
        public Sold: number;

        public static DPVersment = bind.DObject.CreateField<number, FactureBase>('Versment', Number, 0, (e) => {
            var x = e.__this;
            x.Sold = x.Total - x.Versment;
        }, null, bind.PropertyAttribute.NonSerializable);
        public Versment: number;

        public MakeChange<A1, A2, A3, A4>(callback: (a: A1, b: A2, c: A3, d: A4) => void, a?: A1, b?: A2, c?: A3, d?: A4) {
            var isf = this._isFrozen;
            if (isf) this._isFrozen = false;
            try {
                callback.call(this, a, b, c, d);
            } catch (e) {
            }
            this._isFrozen = isf;
        }

        static ctor() {
            FactureBase.DPLockedAt = bind.DObject.CreateField<Date, FactureBase>('LockedAt', Date, null, null, null, bind.PropertyAttribute.NonSerializable);
            FactureBase.DPLockedBy = bind.DObject.CreateField<Agent, FactureBase>('LockedBy', Agent, null, null, null, bind.PropertyAttribute.NonSerializable);
            FactureBase.DPEditeur = bind.DObject.CreateField<models.Client, FactureBase>('Editeur', models.Client, null, null, null, bind.PropertyAttribute.SerializeAsId);
            FactureBase.DPValidator = bind.DObject.CreateField<Agent, FactureBase>('Validator', Agent, null, null, null, bind.PropertyAttribute.SerializeAsId);
        }
        protected abstract CalcTotal(): number;
        public Recalc(results?: sdata.DataTable<VersmentBase>) {
            this.MakeChange(FactureBase._recalc, results);
        }
        private static _recalc = function (results: sdata.DataTable<VersmentBase>) {
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
                } else if (this.Versement != undefined) {
                    this.Sold = NaN;
                    this.Sold = tot - this.Versment;
                }
            } catch (e) {
            }
        }

        FromJson(json: any, context: encoding.SerializationContext, update?: boolean): this {
            if (json) {
                super.FromJson(json, context, update);
                if (typeof json.IsFrozen === 'boolean')
                    this.IsOpen = !json.IsFrozen;
            }
            return this;
        }
    }

    export class Client extends Dealer {

        public static DPAbonment = bind.DObject.CreateField<models.Abonment, Client>("Abonment", Number, 0, null, (e) => { if (e._new == null) e._new = Abonment.Detaillant; });
        public Abonment: models.Abonment;

        public static DPFirstName = bind.DObject.CreateField<string, Client>("FirstName", String, null, (e) => {
            e.__this.set(Client.DPFullName, (e._new || '') + ' ' + (e.__this.LastName || ''));
        });
        public FirstName: string;

        public static DPLastName = bind.DObject.CreateField<string, Client>("LastName", String, null, (e) => { e.__this.set(Client.DPFullName, (e.__this.FirstName || '') + ' ' + (e._new || '')); });
        public LastName: string;

        public static DPFullName = bind.DObject.CreateField<string, Client>("FullName", String, null, null, null, bind.PropertyAttribute.Private);
        public get FullName(): string { return this.get<string>(Client.DPFullName); }

        public static DPJob = bind.DObject.CreateField<models.Job, Client>("Job", Number, models.Job.Detaillant);
        public Job: models.Job;


        public static DPWorkAt: bind.DProperty<string, Client>;
        public WorkAt: string;

        constructor(id) {
            super(id);
        }
        
        toString() {
            return (this.get(Client.DPFullName) || '') + ' \tTel:' + (this.get(SiegeSocial.DPTel) || '');
        }

        public static __fields__(): bind.DProperty<any, any>[] {
            return [
                Client.DPFirstName,
                Client.DPLastName,
                Client.DPJob,
                Client.DPWorkAt, Client.DPFullName, Client.DPAbonment
            ];
        }


        public static getById(id: number, type?: Function): Client {
            return Client.pstore.Get(id as number);
        }
        public getStore(): collection.Dictionary<number, any> { return Client.pstore; }

        private static pstore = new collection.Dictionary<number, Client>("Clients", true);
        static ctor() {
            this.DPWorkAt = bind.DObject.CreateField<string, Client>("WorkAt", String, null, null, null, bind.PropertyAttribute.SerializeAsId);

        }
    }

    export class Projet extends models.SiegeSocial {

        public static DPName: bind.DProperty<String, Projet>;
        public get Name() { return this.get<String>(Projet.DPName); }
        public set Name(v: String) { this.set(Projet.DPName, v); }
        static __fields__() { return [this.DPName]; }
        static ctor() {
        this.DPName = bind.DObject.CreateField<String, Projet>("Name", String);
        }
        getStore() {
            return Projet._pstore;
        }
        static _pstore = new collection.Dictionary<any, any>("Projets");
    }

    export class SFacture extends FactureBase {
        public ArticlesListener = <basic.ITBindable<any>>{ Invoke: this.OnArticlesChanged, Owner: this };
        static __fields__() { return [this.DPFournisseur, this.DPAchteur, this.DPArticles] as any; }
        constructor(id?: number) {
            super(id);
            this.set(SFacture.DPArticles, new FakePrices(this));
        }
        protected createNewVersments(): sdata.DataTable<VersmentBase> { return new SVersments(this); }
        public OnArticlesChanged(e: utils.ListEventArgs<number, FakePrice>) {
            var a = this.get(SFacture.DPArticles);
            var c = 0;
            if (a)
                for (var i = 0, l = a.Count; i < l; i++) {
                    var t = a.Get(i);
                    c += t.Qte * t.PSel;
                }
            this.set(SFacture.DPTotal, c);
        }
        protected CalcTotal() {
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
        }
        public getStore() { return sfpStore as any; }
        private static _flds;

        static getById(i: number) {
            return sfpStore.Get(i);
        }

        _str: string;
        toString() {
            return this._str || (this._str = BonType[this.Type] + " " + this.Ref + ": " + ' [' + Facture.getString(this.get(SFacture.DPFournisseur)) + '\rdate:' + Facture.getString(this.get(Facture.DPDate)) + '\rdatelivraison:' + Facture.getString(this.get(Facture.DPDateLivraison)) + ']');
        }

        public static DPFournisseur: bind.DProperty<Fournisseur, SFacture>;
        public static DPAchteur: bind.DProperty<Agent, SFacture>;
        public static DPArticles: bind.DProperty<FakePrices, SFacture>;

        public Fournisseur: Fournisseur;
        public Achteur: Agent;
        public Articles: FakePrices;

        static ctor() {
            this.DPFournisseur = bind.DObject.CreateField<Fournisseur, SFacture>('Fournisseur', Fournisseur, null, null, null, bind.PropertyAttribute.NonSerializable);
            this.DPAchteur = bind.DObject.CreateField<Agent, SFacture>('Achteur', Agent, null, null, null, bind.PropertyAttribute.SerializeAsId);
            this.DPArticles = bind.DObject.CreateField<FakePrices, SFacture>('Articles', FakePrices, null, null, (e) => {
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
            }, bind.PropertyAttribute.NonSerializable);
        }
    }

    export class Price extends sdata.QShopRow {
        static CalclMoyen(_old: Price, _new: Price): any {
            var o = _old.Qte || 0;
            var n = _new.Qte || 0;
            var sum = o + n;
            if (sum == 0) { o = 1; n = 1; sum = 2; }
            var props = Price.__fields__() as bind.DProperty<number, Price>[];
            var no = new FakePrice();
            for (var i = 0; i < props.length - 1; i++) {
                var prop = props[i];

                no.set(prop, ((_old.get(prop) || 0) * o + (_new.get(prop) || 0) * n) / sum);
            }
            if (_new instanceof FakePrice)
                no.Product = _new.Product;
            return no;
        }
        public static DPPSel = bind.DObject.CreateField<number, Price>("PSel", Number, 0);
        public static DPValue = bind.DObject.CreateField<number, Price>("Value", Number, 0);
        public static DPPValue = bind.DObject.CreateField<number, Price>("PValue", Number, 0);
        public static DPHWValue = bind.DObject.CreateField<number, Price>("HWValue", Number, 0);
        public static DPWValue = bind.DObject.CreateField<number, Price>("WValue", Number, 0);
        public static DPQte = bind.DObject.CreateField<number, Price>("Qte", Number, null);
        static __fields__() { return [Price.DPPSel, Price.DPValue, Price.DPPValue, Price.DPHWValue, Price.DPWValue, Price.DPQte] as any[]; }

        public PSel: number;
        public Value: number;
        public PValue: number;
        public HWValue: number;
        public WValue: number;
        public Qte: number;

        public GetPrice(abonment: Abonment) {
            if (abonment < 4 && abonment >= 0)
                return this.get<number>(this.GetDProperty(abonment));
            return this.Value;
        }

        public GetDProperty(abonment: Abonment) {
            if (abonment < 4 && abonment >= 0)
                return bind.DObject.GetDPropertyAt(this.constructor, Price.DPValue.Index + abonment);
            return Price.DPValue;

        }
        public static GetDProperty(abonment: Abonment): bind.DProperty<number, Price> {
            if (abonment < 4 && abonment >= 0)
                return bind.DObject.GetDPropertyAt(this, Price.DPValue.Index + abonment);
            return Price.DPValue;
        }
        public static GetAbonment(prop: bind.DProperty<number, any>) {
            var t = prop.Index - Price.DPValue.Index;
            return (t < 0 || t > 3) ? Abonment.Detaillant : t;
        }

        public ISetValue(abonment: Abonment, price: number) {
            var prop = this.GetDProperty(abonment) as bind.DProperty<any, any>;
            if (prop)
                this.set(prop, price);
            else this.set(Price.DPValue, price);
        }
        public IGetValue(abonment: Abonment): number {
            var prop = this.GetDProperty(abonment) as bind.DProperty<any, any>;
            if (prop)
                return this.get(prop);
            return undefined;
        }

        public ClonePrices(to: Price, alsoPSet?: boolean) {
            to.Value = this.Value;
            to.PValue = this.PValue;
            to.HWValue = this.HWValue;
            to.WValue = this.WValue;
            if (alsoPSet) to.PSel = this.PSel;
        }

        getStore() { return Price.pStore as any as collection.Dictionary<number, this>; }
        public static pStore = new collection.Dictionary<number, Price>("prices");
    }

    export class FakePrice extends Price {
        public IsEditable: boolean;
        public static DPProduct: bind.DProperty<Product, FakePrice>;
        public static DPSFacture: bind.DProperty<SFacture, FakePrice>;
        public static DPNextRevage: bind.DProperty<FakePrice, FakePrice>;

        public static DPApplyPrice: bind.DProperty<FakePrice, FakePrice>;

        static __fields__() { return [FakePrice.DPProduct, FakePrice.DPNextRevage, FakePrice.DPSFacture, FakePrice.DPApplyPrice]; }
        static ctor() {
            this.DPApplyPrice = bind.DObject.CreateField<FakePrice, FakePrice>('ApplyPrice', FakePrice);
            this.DPProduct = bind.DObject.CreateField<models.Product, FakePrice>("Product", Product, null, null, null, bind.PropertyAttribute.SerializeAsId);
            this.DPNextRevage = bind.DObject.CreateField<FakePrice, FakePrice>("NextRevage", FakePrice, null, null, null, bind.PropertyAttribute.NonSerializable);
            this.DPSFacture = bind.DObject.CreateField<SFacture, FakePrice>("Facture", SFacture, null, null, null, bind.PropertyAttribute.SerializeAsId);
        }
        public Facture: ISFacture | SFacture;
        public Product: Product;
        public NextRevage: FakePrice;
        public ApplyPrice: FakePrice;
        getStore() { return FakePrice.pStore as any; }
        public static pStore = new collection.Dictionary<number, FakePrice>("fakes");
        static getById(id: number) {
            return FakePrice.pStore.Get(id);
        }

        test(e: KeyboardEvent, dt: bind.EventData, scop: bind.Scop, event: bind.events) {
            switch (e.keyCode) {
                case UI.Keys.F2:
                    this.calc("current");
                    break;

                case UI.Keys.F3:
                    this.calc("calc");
                    break;

                case UI.Keys.F5:
                    
                    this.applyPrice("moyen");
                    break;

                case UI.Keys.F6:
                    this.applyPrice("percent");
                    break;

                case UI.Keys.F7:
                    this.applyPrice("new");
                    break;

                case UI.Keys.F8:
                    this.applyPrice("old");                    
                    break;
                default: return;
            }
            e.stopImmediatePropagation();
            e.stopPropagation();
            e.preventDefault();
        }
        private calcPrices(data: string) {

        }
        private applyPrice(method:string) {
            var art = this;
            var f = art.Facture as models.FactureBase;
            if (f && !f.IsOpen)
                return UI.Modal.ShowDialog("Apprentissage", 'La Facture Is Clossed donc vous ne pouver pas executer cette command', null, "Ok", null);
            var old = art.Product;
            if (old == null)
                return UI.Modal.ShowDialog('Apprentissage', "Vous dever selectioner un produit pour appliquer le prix");
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
                    UI.InfoArea.push("this option is depricated");
                    break;
            }
        }

        private calc(data: string) {
            switch (data) {
                case 'costume':
                    var t = this;
                    if (t.ApplyPrice === t || t.ApplyPrice == null)
                        var y = new FakePrice(basic.New());
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
                        return UI.InfoArea.push('The product of this revage is not setted', false);
                    for (var i = 3; i >= 0; i--) {
                        fakePrice.ISetValue(i, prd.GetPrice(i));
                    }
                    break;
                case 'calc':
                    var fakePrice = this;
                    var ps = fakePrice.PSel;
                    for (var i = 3; i >= 0; i--) {
                        fakePrice.ISetValue(i, ps = parseFloat(math.round(ps * 1.33, 2)));
                    }
                    break;
                case 'default':
                    var t = this;
                    t.ApplyPrice = t;
                    break;
                //case 'update':
                //    var t = this;
                //    GData.apis.Revage.Save(t.ApplyPrice, true, function (item, isNew, err) {
                //        if (err === Basics_13.basics.DataStat.Success) {
                //            t.ApplyPrice = null;
                //            UI_16.UI.InfoArea.push("The Product Price successfully Updated .", true);
                //        }
                //        else
                //            UI_16.UI.InfoArea.push("Error Occoured When Updating <h1>Product</h1> Price .", false);
                //    });
                //    break;
                //case 'restore':
                //    //requester.Post(models.FakePrice, y, null,
                //    //    (s, r, iss) => {
                //    //    },
                //    //    (r, t) => {
                //    //        r.Url='/_/Price'
                //    //    });
                //    //var t = scop.Value;
                //    //t.ApplyPrice = null;
                //    //break;
            }
        }
        public ToList() {
            var x = []
            var t: FakePrice = this;
            do {
                if (x.indexOf(t) !== -1) break;
                x.push(t);
                t = t.NextRevage;
            } while (t != null);
            return new collection.List<FakePrice>(FakePrice, x);
        }

        toString() { return (this.get(FakePrice.DPProduct) || '').toString(); }
        Freeze() { }
        UnFreeze() { }
    }

    export class FakePrices extends sdata.DataTable<FakePrice>{
        constructor(owner: sdata.DataRow, array?: FakePrice[]) {
            super(owner, FakePrice, (id) => new FakePrice(id), array);
        }
        public get ArgType() { return FakePrice; }
        protected getArgType(json) { return FakePrice; }
        GetType() { return FakePrices; }
        //UnFreeze(): any {
        //    super.UnFreeze();
        //    for (var i = 0; i < this._list.length; i++) {
        //        var f = this._list[i];
        //        f && f.UnFreeze();
        //    }
        //}
        //Freeze() {
        //    for (var i = 0; i < this._list.length; i++) {
        //        var f = this._list[i];
        //        f && f.Freeze();
        //    }
        //}

        Freeze() { }
        UnFreeze() { }
    }

    export abstract class VersmentBase extends sdata.QShopRow {



        public static DPCassier: bind.DProperty<Agent, VersmentBase>;;
        public Cassier: Agent


        public static DPObservation: bind.DProperty<string, VersmentBase>
        public Observation: string;
        public static DPType: bind.DProperty<VersmentType, VersmentBase>;
        public static DPMontant: bind.DProperty<number, VersmentBase>;
        public static DPDate: bind.DProperty<Date, VersmentBase>;
        public Type: VersmentType;
        public Date: Date;
        public static DPRef = bind.DObject.CreateField<string, VersmentBase>('Ref', String, null);
        public Ref: string;

        static ctor() {
            this.DPMontant = bind.DObject.CreateField<number, VersmentBase>("Montant", Number, 0);
            this.DPType = bind.DObject.CreateField<VersmentType, VersmentBase>("Type", Number, VersmentType.Espece);
            this.DPDate = bind.DObject.CreateField<Date, VersmentBase>("Date", Date, new Date());

            this.DPCassier = bind.DObject.CreateField<Agent, VersmentBase>('Cassier', Agent, null, null, null, bind.PropertyAttribute.SerializeAsId);
            this.DPObservation = bind.DObject.CreateField<string, VersmentBase>('Observation', String, null);
        }

        public Montant: number;
        public static __fields__() { return [VersmentBase.DPType, VersmentBase.DPMontant, VersmentBase.DPDate, this.DPCassier, this.DPObservation, this.DPRef] as any; }
        public abstract getStore(): collection.Dictionary<number, any>;

        protected abstract get Partner(): Dealer;
    }

    export class Versment extends VersmentBase {

        public static DPFacture: bind.DProperty<Facture, Versment>;
        public Facture: Facture;

        public static __fields__() { return [this.DPClient, this.DPFacture] as any; }
        public static DPClient: bind.DProperty<Client, Versment>;
        public Client: Client;
        public get Partner() { return this.get(Versment.DPClient); }
        static ctor() {
            this.DPClient = bind.DObject.CreateField<Client, Versment>('Client', Client, null, null, null, bind.PropertyAttribute.SerializeAsId);
            this.DPFacture = bind.DObject.CreateField<Facture, Versment>('Facture', Facture, null);
        }
        constructor(id: number) { super(id); }

        public static getById(id: number, type: Function): Versment {
            return Versment.pstore.Get(id);
        }
        public getStore(): collection.Dictionary<number, any> { return Versment.pstore; }

        public static pstore = new collection.Dictionary<number, Versment>("Versments", true);
        toString() {
            var c = (c = this.Client) && (c = c.FullName || "");
            var s = ((s = this.Cassier) && (s = s.Name)) || "";
            return `Le client ${c} Verser à ${s} a la date ${this.Date} le montant ${this.Montant} DZD en ${VersmentType[this.Type]} \r\n et remarquer que "${this.Observation}" `;
        }

    }

    export class SVersment extends VersmentBase {
        public static DPFournisseur: bind.DProperty<Fournisseur, SVersment>;

        public static DPFacture: bind.DProperty<SFacture, SVersment>;
        public Facture: SFacture;


        public Fournisseur: Fournisseur;
        public get Partner() { return this.get(SVersment.DPFournisseur); }
        static ctor() {
            this.DPFournisseur = bind.DObject.CreateField<Fournisseur, SVersment>('Fournisseur', Fournisseur, null, null, null, bind.PropertyAttribute.SerializeAsId);
            this.DPFacture = bind.DObject.CreateField<SFacture, SVersment>('Facture', SFacture, null, null, null, bind.PropertyAttribute.SerializeAsId);
        }
        public static __fields__() { return [this.DPFournisseur, this.DPFacture]; }
        constructor(id: number) { super(id); }

        public static getById(id: number, type: Function): SVersment {
            return SVersment.pstore.Get(id);
        }
        public getStore(): collection.Dictionary<number, any> { return SVersment.pstore; }

        public static pstore = new collection.Dictionary<number, SVersment>("SVersments", true);
    }

    export abstract class BVersments<T extends VersmentBase> extends sdata.DataTable<T>{
    }

    export class Versments extends BVersments<Versment>{
        constructor(_parent: sdata.DataRow) {
            super(_parent, Versment, (id) => new Versment(id));
            this.Owner = _parent;
        }
        public get ArgType() { return Versment; }
        protected getArgType(json) { return Versment; }
        GetType() { return Versments; }
    }
    export class SVersments extends BVersments<SVersment>{
        constructor(_parent: sdata.DataRow) {
            super(_parent, Versment, (id) => new SVersment(id));
            this.Owner = _parent;
        }
        public get ArgType() { return SVersment; }
        protected getArgType(json) { return SVersment; }
        GetType() { return SVersments; }
    }
    export class Costumers extends sdata.DataTable<models.Client>{
        constructor(_parent: sdata.DataRow, items?: models.Client[]) {
            super(_parent, models.Client, (id) => new models.Client(id), items);
        }
        public get ArgType() { return models.Client; }
        protected getArgType(json) { return models.Client; }
        GetType() { return Costumers; }
        Freeze() {
        }

        OnDeserialize(list: Client[]) {
            this.Order(<any>((a, b) => <any>(a.Name || "").localeCompare(b.Name || "")));
        }
    }


    export class Fournisseur extends Dealer {

        static __fields__() { return [this.DPRef]; }
        public static DPRef = bind.DObject.CreateField<string, Fournisseur>('Ref', String, null);
        public Ref: string;

        constructor(id?: number) {
            super(id);
        }

        public getStore() { return Fournisseur._mystore as any; }
        private static _mystore = new collection.Dictionary<number, Fournisseur>("Fournisseurs", false);
        toString() {
            return (this.Name || '') + ' / ' + (this.Tel || '');
        }

        public static getById(id: number, type: Function) {
            return Fournisseur._mystore.Get(id) || super.getById(id, type);
        }
    }

    export class Fournisseurs extends sdata.DataTable<Fournisseur>{
        constructor(_parent: sdata.DataRow, items?: Fournisseur[]) {
            super(_parent, models.Client, (id) => new Fournisseur(id), items);
        }
        public get ArgType() { return Fournisseur; }
        protected getArgType(json) { return Fournisseur; }
        GetType() { return Fournisseurs; }

        OnDeserialize(list: Fournisseur[]) {
            this.Order(((a, b) => (a.Name || "").localeCompare(b.Name || "")));
        }
    }

    export class Clients extends sdata.DataTable<models.Client>{
        constructor(_parent: sdata.DataRow, items?: models.Client[]) {
            super(_parent, models.Client, (id) => new models.Client(id), items);
        }
        public get ArgType() { return models.Client; }
        protected getArgType(json) { return models.Client; }
        GetType() { return Clients; }
    }

    export class Projets extends sdata.DataTable<models.Projet> {

        static __fields__() { return []; }

        constructor(_parent: sdata.DataRow, items?: models.Projet[]) {
            super(_parent, models.Projet, (id) => new models.Projet(id), items);
        }

        public get ArgType() { return models.Projet; }
        protected getArgType(json) { return models.Projet; }
        GetType() { return Projets; }
    }

    export class Mails extends sdata.DataTable<Mail>{
        constructor(parent: sdata.DataRow, array: Mail[]) {
            super(parent, Mail, (id) => { return new Mail(id); }, array);
        }
    }

    export class Categories extends sdata.DataTable<Category>{

        constructor(_parent: sdata.DataRow) {
            super(_parent, Category, (id) => new Category(id));
        }
        public get ArgType() { return Category; }
        protected getArgType(json) { return Category; }
        GetType() { return Categories; }
    }

    export class Category extends sdata.QShopRow {

        public static DPName: bind.DProperty<string, Category>;
        public static DPBase: bind.DProperty<Category, Category>;
        public Base: Category;
        public Name: string;

        public static __fields__() {
            return [
                Category.DPName,
                Category.DPBase
            ];
        }

        public static GetCategory(id: number) {
            var c = Category._categoriesStore.Get(id);

            if (c == null) {
                c = new Category(id);
                c.Update();
            }
            return c;
        }

        private static _categoriesStore: Categories = new Categories(null);
        public static get Categories(): Categories {
            return Category._categoriesStore;
        }
        constructor(id: number) {
            super(id);
        }
        toString() {
            return this.Name;
        }
        private _s = null;
        public getStore(): collection.Dictionary<number, any> { return Category.pstore; }
        public static getById(id: number, type: Function) { return Category.pstore.Get(id); }
        public static pstore = new collection.Dictionary<number, Category>('categories', true);
        static ctor() {
            this.DPName = bind.DObject.CreateField<string, Category>("Name", String, null);
            this.DPBase = bind.DObject.CreateField<Category, Category>("Base", Category, null, null, null, bind.PropertyAttribute.SerializeAsId);
        }
    }

    export class Product extends Price {

        public static DPCategory: bind.DProperty<Category, Product>;
        public static DPName: bind.DProperty<string, Product>;
        public static DPDescription: bind.DProperty<string, Product>;
        public static DPPicture: bind.DProperty<string, Product>;
        public static DPDimention: bind.DProperty<string, Product>;
        public static DPQuality: bind.DProperty<number, Product>;
        public static DPSerieName: bind.DProperty<string, Product>;

        //public static DPLastModified: bind.DProperty<Date, Product>;
        public static DPRevage: bind.DProperty<FakePrice, Product>;
        public static DPCurrentArticle: bind.DProperty<Article, Product>;
        public CurrentArticle: Article;
        public Category: Category;
        public Name: string;
        public Description: string;
        public Picture: string;
        public Dimention: string;
        public Revage: FakePrice;
        public Quality: number;
        public SerieName: string;
        private _toString: string;
        toString() {
            return this._toString;
        }
        public static __fields__(): Array<any> {
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

        }
        protected onPropertyChanged(ev: bind.EventArgs<any, any>): void {
            if (ev.prop.Index >= Product.DPName.Index && ev.prop.Index <= Product.DPSerieName.Index) {
                this._toString = (this.Name || '') + '  ' + (this.Dimention || '') + ' ' + (this.SerieName || '');
            }
            super.onPropertyChanged(ev);
        }
        constructor(id: number) {
            super(id);

        }
        
        public static getById(id: number, type?: Function): Product {
            return Product.pstore.Get(id);
        }

        public getStore(): collection.Dictionary<number, any> { return Product.pstore; }
        private static pstore = new collection.Dictionary<number, Product>("Products", true);

        FromJson(json: any, context: encoding.SerializationContext, update?: boolean): this {
            return super.FromJson(json, context, update) as this;
        }
        static ctor() {
            this.DPCategory = bind.DObject.CreateField<Category, Product>("Category", Category, null, null, null, bind.PropertyAttribute.SerializeAsId);
            this.DPName = bind.DObject.CreateField<string, Product>("Name", String, null);
            this.DPDescription = bind.DObject.CreateField<string, Product>("Description", String);
            this.DPPicture = bind.DObject.CreateField<string, Product>("Picture", String);
            this.DPDimention = bind.DObject.CreateField<string, Product>("Dimention", String);
            this.DPQuality = bind.DObject.CreateField<number, Product>("Quality", Number);
            this.DPSerieName = bind.DObject.CreateField<string, Product>("SerieName", String);
            this.DPRevage = bind.DObject.CreateField<FakePrice, Product>('Revage', FakePrice, null, null, null, bind.PropertyAttribute.NonSerializable);
            this.DPCurrentArticle = bind.DObject.CreateField<Article, Product>('CurrentArticle', Article, null, null, null, bind.PropertyAttribute.Private | bind.PropertyAttribute.Optional);
        }
    }

    export class Products extends sdata.DataTable<Product>{
        constructor(_parent: sdata.DataRow, items?: Product[]) {
            super(_parent, Product, (id) => new Product(id), items);
        }
        public get ArgType() { return Product; }
        protected getArgType(json) { return Product; }
        GetType() { return Products; }

        OnDeserialize(list: Product[]) {
            var t = new Date(Date.now());
            console.profile("DeserializeProducts");
            this.Order(((a, b) => <any>(a.Name || "").localeCompare(b.Name || "")));
            console.log(`Statr DeserializeProducts ${t} to ${new Date(Date.now())}`);
            console.profileEnd();
        }
    }

    export class Article extends sdata.QShopRow {
        public toString() {
            return this.Product.toString() + ' Count:' + this.Count;
        }

        public static DPProduct: bind.DProperty<Product, Article>;
        public Product: Product;

        public static DPProductName: bind.DProperty<string, Article>;
        public ProductName: string;

        public static DPOwner: bind.DProperty<Facture, Article>;
        public Owner: Facture;


        public static DPPrice: bind.DProperty<number, Article>;
        public Price: number;

        public static DPPSel: bind.DProperty<number, Article>;
        public PSel: number;

        public static DPCount: bind.DProperty<number, Article>;
        public Count: number;

        public OCount: number = 0;

        public static DPReduction: bind.DProperty<number, Article>;
        public get Reduction(): number { return this.get(Article.DPReduction); }


        public static DPOPrice: bind.DProperty<number, Article>;
        public OPrice: number; 

        public static __fields__() {
            return [
                Article.DPOwner,
                Article.DPProduct,
                Article.DPPrice,
                Article.DPCount,
                Article.DPPSel, this.DPProductName, this.DPLabel, this.DPReduction, this.DPOPrice
            ];
        }
        constructor(id: number) {
            super(id);
        }

        public static getById(id: number, type: Function): any {
            return Article.pstore.Get(id);
        }
        public getStore(): collection.Dictionary<number, any> { return Article.pstore; }
        private static pstore = new collection.Dictionary<number, Article>("Articles", true);

        FromJson(json: any, context: encoding.SerializationContext, update?: boolean): this {
            super.FromJson(json, context, update) as this;
            this.OCount = this.Count;
            return this;
        }
        static ctor() {
            this.DPProduct = bind.DObject.CreateField<Product, Article>('Product', Product, null, this.prototype.WhenProductChanged, null, bind.PropertyAttribute.SerializeAsId);
            this.DPProductName = bind.DObject.CreateField<string, Article>('ProductName', String, null, this.prototype.WhenProductNameChanged, null);
            this.DPOwner = bind.DObject.CreateField<Facture, Article>('Owner', Facture, null, null, null, bind.PropertyAttribute.SerializeAsId);
            this.DPPrice = bind.DObject.CreateField<number, Article>('Price', Number, null, this.prototype.onPriceChanged);
            this.DPCount = bind.DObject.CreateField<number, Article>("Count", Number, 0);
            this.DPPSel = bind.DObject.CreateField<number, Article>("PSel", Number, 0);
            this.DPOPrice = bind.DObject.CreateField<number, Article>("OPrice", Number, 0, this.prototype.onOPriceChanged);
            this.DPReduction = bind.DObject.CreateField<number, Article>("Reduction", Number, 0, void 0, void 0, bind.PropertyAttribute.Private);
        }
        private onPriceChanged(e: bind.EventArgs<number, this>) {
            this.set(Article.DPReduction, (e._new || 0) - (this.OPrice || 0));
        }
        private onOPriceChanged(e: bind.EventArgs<number, this>) {
            this.set(Article.DPReduction, (this.Price || 0) - (e._new || 0));
        }

        public IsEditable: boolean;

        private isNullOrWhiteSpace(s: string) {
            return s == null || s.trim() == "";
        }
        private WhenProductNameChanged(e: bind.EventArgs<string, this>) {
            this._setLabel(this.Product, e._new);
        }
        private WhenProductChanged(e: bind.EventArgs<Product, this>) {
            this.updateReduction(e._new);
            this._setLabel(e._new, this.ProductName);
        }
        private _setLabel(p: models.Product, name: string) {
            if (this.isNullOrWhiteSpace(name))
                this.Label = (p && p.toString()) || "";
            else this.Label = name;
        }

        public static DPLabel = bind.DObject.CreateField<string, Article>("Label", String, "", void 0, void 0, bind.PropertyAttribute.Private);
        public Label: string;

        Freeze() { }
        UnFreeze() { }
        getValues(prd: models.Product) {
            return {
                pv: this.OPrice || (prd ? prd.GetPrice(this.Owner && this.Owner.Abonment || 0) || prd.Value : 0) || 0,
                pa: this.PSel || (prd && prd.PSel) || 0
            };
        }
        updateReduction(prd: models.Product) {
            var { pv } = this.getValues(prd);
            this.set(Article.DPReduction, this.Price - pv);
        }

        static readonly redEx = /\0([\=\*\-\+\:\/]){0,1}([\-]{0,1}[\d]+(\.[\d]+){0,1})([\%]{0,1})\0/gmi
        
        public setProduct(p: models.Product) {
            this.PSel = p && p.PSel;
            this.OPrice = p && p.IGetValue((this.Owner && this.Owner.Abonment) || Abonment.Detaillant);
            this.Price = this.OPrice;
            this.Product = p;
        }

        public setReduction(s: string): boolean {
            Article.redEx.exec(null);
            var rslt = Article.redEx.exec('\0' + s + '\0');
            return rslt && this.calcReduction({ Method: rslt[1], Value: parseFloat(rslt[2]), IsPercent: (rslt[4] || "").trim() == "%" });
        }
        calcReduction(this: models.Article, val: IValue) {
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
                    if (!prd) return false;
                    v = prd.GetPrice(v as models.Abonment);
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
        }
    }

    interface IValue {
        Method: string;
        Value: number;
        IsPercent: boolean;
    }
    export class Articles extends sdata.DataTable<Article>{
        //UnFreeze(): any {
        //    super.UnFreeze();
        //    //for (var i = 0; i < this._list.length; i++) {
        //    //    var f = this._list[i];
        //    //    f && f.UnFreeze();
        //    //}
        //}
        //Freeze() {
            
        //    for (var i = 0; i < this._list.length; i++) {
        //        var f = this._list[i];
        //        f && f.Freeze();
        //    }
        //}
        Freeze() { }
        UnFreeze() {}
        constructor(_parent: sdata.DataRow, items?: Article[]) {
            super(_parent, Article, (id) => new Article(id), items);
        }
        public get ArgType() { return Article; }
        protected getArgType(json) { return Article; }
        GetType() { return Articles; }

        OnDeserialize(list: Article[]) {
            function toNum(d: Date) {
                return (d && d.getTime()) || 0;
            }
            this.Order(((a, b) => toNum(a.LastModified) - toNum(b.LastModified)));
        }
        
    }

    export class Facture extends FactureBase {
        private static pstore: collection.Dictionary<number, Facture> = new collection.Dictionary<number, Facture>("Factures", true);

        public static DPClient: bind.DProperty<models.Client, Facture>;
        public static DPArticles: bind.DProperty<Articles, Facture>;
        public static DPAgent: bind.DProperty<Agent, Facture>;
        public static DPAbonment: bind.DProperty<Abonment, Facture>;
        public static DPPour: bind.DProperty<Projet, Facture>;
        protected createNewVersments(): sdata.DataTable<VersmentBase> { return new Versments(this);}


        public Abonment: Abonment;
        public Client: models.Client;
        public Vendeur: Agent;
        public Articles: Articles;
        public Pour: Projet;
        public static getString(obj) {
            if (obj == null) return "null";
            return obj.toString();
        }
        _str: string;
        toString() {
            return this._str || (this._str = BonType[this.Type] + " " + this.Ref + ": " + ' [' + Facture.getString(this.get(Facture.DPClient)) + '\rdate:' + Facture.getString(this.get(Facture.DPDate)) + '\rdatelivraison:' + this.get(Facture.DPDateLivraison) + ']');
        }
        public static __fields__() {
            return [
                Facture.DPAbonment,
                Facture.DPClient,
                Facture.DPAgent,
                Facture.DPArticles, this.DPPour
            ] as any;
        }

        constructor(id: number) {
            super(id);
            this.Articles = new Articles(this);
        }
        protected CalcTotal(): number {
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

        }
        public static getById(id: number, type: Function): Facture {
            return Facture.pstore.Get(id);
        }
        public getStore(): collection.Dictionary<number, any> { return Facture.pstore; }
        static freezeArray(e) {
            if (e._new == null)
                if (e._old == null) return;
                else {
                    e._old.Clear();
                    e._new = e._old;
                }
        }
        static _ctor() {
            this.DPAgent = bind.DObject.CreateField<Agent, Facture>("Vendeur", Agent, null, null, null, bind.PropertyAttribute.SerializeAsId);
            this.DPClient = bind.DObject.CreateField<models.Client, Facture>("Client", models.Client, null, null, null, bind.PropertyAttribute.NonSerializable);
            this.DPArticles = bind.DObject.CreateField<Articles, Facture>("Articles", Articles, null, null, this.freezeArray, bind.PropertyAttribute.NonSerializable);
            this.DPAbonment = bind.DObject.CreateField<Abonment, Facture>('Abonment', Number, Abonment.Detaillant, null, (e) => {
                if (e._new == null) e._new = Abonment.Detaillant;
                else if (Abonment[e._new] == undefined) e._new = e._old;
            }, bind.PropertyAttribute.NonSerializable);
            Facture.DPPour = bind.DObject.CreateField<Projet, Facture>('Pour', Projet, null, null, null, bind.PropertyAttribute.SerializeAsId);
        }
        Update() {
        }
    }

    export class SFactures extends sdata.DataTable<SFacture>{
        constructor(owner: sdata.DataRow, array?: SFacture[]) {
            super(owner, SFacture, (id) => new SFacture(id), array);
        }
        public get ArgType() { return SFacture; }
        protected getArgType(json) { return SFacture; }
        GetType() { return SFactures; }

        FromJson(json: any, x: encoding.SerializationContext, update?: boolean, callback?: (prop: string, val: any) => Object): this {
            if (json) {
                if (json.__list__ instanceof Array)
                    (<Array<any>>json.__list__).sort((a: any, b: any) => (b.Date as number) - (a.Date as number));
                return super.FromJson(json, x, update, callback);
            }
            return this;
        }
        OnDeserialize(list: SFacture[]) {
            this.Order((a, b) => a.Date > b.Date);
        }
        Freeze() {

        }
    }

    export class Factures extends sdata.DataTable<Facture>{
        constructor(_parent: sdata.DataRow, items?: Facture[]) {
            super(_parent, Facture, (id) => new Facture(id), items);
        }
        public get ArgType() { return Facture; }
        protected getArgType(json) { return Facture; }
        GetType() { return Factures; }

        OnDeserialize(list: Facture[]) {
            this.Order((a, b) => a.Date > b.Date);
        }
        FromJson(json: any, x: encoding.SerializationContext, update?: boolean, callback?: (prop: string, val: any) => Object): this {
            if (json) {
                if (json.__list__ instanceof Array)
                    (<Array<any>>json.__list__).sort((a: any, b: any) => (b.Date as number) - (a.Date as number));
                return super.FromJson(json, x, update, callback);
            }
            return this;
        }

        Freeze() {

        }
    }

    export class ii { }

    export class Logout extends sdata.QShopRow {
        getStore(): any { }
    }
    function getCookie(cookiename: string): string {
        var cookiestring = RegExp("" + cookiename + "[^;,]+$").exec(document.cookie);
        return decodeURIComponent(!!cookiestring ? cookiestring.toString().replace(/^[^=]+./, "") : "");
    }
    function getKey() {
        var id = getCookie('id');
        if (id && (id = id.trim()) != '')
            return id;
        return 'new_account';
    }
    export class Login extends sdata.QShopRow {

        public get IsLogged(): boolean { return this.get<boolean>(DPIsLogged); }

        Freeze() {
        }

        public static DPUsername = bind.DObject.CreateField<string, Login>("Username", String, null);
        public Username: string;


        public static DPPwd = bind.DObject.CreateField<string, Login>("Pwd", String, "", (e) => e.__this.ReGenerateEncPwd(e.__this instanceof Agent ? getKey() : e._new, e._new), undefined, bind.PropertyAttribute.NonSerializable | bind.PropertyAttribute.Private);
        public Pwd: string;
        private static copy(source: Array<number>, dest: Array<number>, startIdx: number, max: number = 16) {

            var mx = Math.min(source.length, max);
            for (var i = 0; i < source.length; i++)
                dest[i + startIdx] = source[i] == 0 ? 128 : source[i];
            for (; i < max; i++) {
                dest[startIdx + i] = 128;
            }
        }
        private getEncripter(pwd: string) {

        }
        private static byte2Hex(ns: number[]) {
            var s = "";
            for (var i = 0; i < ns.length; i++) {
                var n = ns[i];
                if (n < 16) s += "0" + n.toString(16);
                else s += n.toString(16);
            }
            return s.toUpperCase();
        }
        private static getKey(keyString: string, keySize: number = 32) {
            var key = new Array<number>(keySize);
            var key1 = this.getBytes(keyString);
            Login.copy(key1.slice(0, keySize), key, 0, keySize);
            return key;
        }
        private static getBytes(str: string) {
            var key1 = encoding.UTF8.GetBytes(encoding.Utf8.encode(str || ""));
            if (key1[key1.length - 1] == 0) key1.pop();
            return key1;
        }
        public ReGenerateEncPwd(key: string, password: string) {
            var x = new crypto.AesCBC(Login.getKey(key).slice());
            var encX = x.Encrypt(Login.getBytes(password));
            this.EncPwd = Login.byte2Hex(encX);
        }
        public static DPEncPwd = bind.DObject.CreateField<string, Login>("EncPwd", String, null);
        public EncPwd: string;


        public static DPIdentification = bind.DObject.CreateField<string, Login>("Identification", String, undefined);
        public Identification: string;


        public static DPClient = bind.DObject.CreateField<models.Client, Login>("Client", models.Client, null);
        public Client: models.Client;


        public static __fields__() { return [DPIsLogged, Login.DPUsername, Login.DPPwd, Login.DPIdentification, Login.DPClient, Login.DPEncPwd]; }
        constructor(id?) {
            super(id || basic.New());
        }
        public getStore() { return Login.pStore; }
        //public GetType() { return Login; }
        public OnMessage(invoke: (s: bind.PropBinding, e: bind.EventArgs<boolean, Login>) => void) {
            this.OnPropertyChanged(DPIsLogged, invoke);
        }
        public static update: boolean;
        private static pStore = new collection.Dictionary<number, any>("Signup", false);
        FromJson(json: any, context: encoding.SerializationContext, update?: boolean): this {
            if (typeof json === 'number') {
                if (this.Stat >= sdata.DataStat.Updating)
                    return this;

                this.Id = json;
                this.set(sdata.DataRow.DPStat, sdata.DataStat.Updating);
                Controller.ProxyData.Default.Request(this.constructor, "UPDATE", this, this as any);
                //Controller.ProxyData.Default.Push(this.constructor, this, null);

            } else {
                bind.DObject.prototype.FromJson.call(this, json, context, update);
                if (json != null && json.IsFrozen == true) {
                    this.Freeze();
                }
            }
            return this;
        }



    }
    
    export class Agent extends Login {

        public static DPIsDisponible: bind.DProperty<boolean, Agent>;
        public IsDisponible: boolean;


        public static DPName: bind.DProperty<string, Agent>;
        public Name: string;

        public static DPPermission: bind.DProperty<AgentPermissions, Agent>;
        public Permission: AgentPermissions;

        public static __fields__() {
            return [
                Agent.DPIsDisponible,
                Agent.DPPermission,
                Agent.DPName
            ] as any;
        }

        constructor(id: number) {
            super(id);
        }


        public static getById(id: number, type: Function): Agent {
            return Agent.pstore.Get(id);
        }
        private static pstore = new collection.Dictionary<number, Agent>("Agents", true);

        public getStore(): collection.Dictionary<number, any> { return Agent.pstore; }
        static ctor() {
            this.DPIsDisponible = bind.DObject.CreateField<boolean, Agent>("IsDisponible", Boolean, null);
            this.DPPermission = bind.DObject.CreateField<AgentPermissions, Agent>('Permission', Number, 0);
            this.DPName = bind.DObject.CreateField<string, Agent>("Name", String);
        }
        toString() {
            var l = this;
            var c = l && l.Client;
            var fn = c && c.FullName || '';
            var tel = c && c.Tel || '';
            return AgentPermissions[this.Permission || 1] + ' : ' + fn + ' / ' + tel;
        }
        
    }

    export class Agents extends sdata.DataTable<Agent>{
        constructor(_parent: sdata.DataRow) {
            super(_parent, Agent, (id) => new Agent(id));
        }
        public get ArgType() { return Agent; }
        protected getArgType(json) { return Agent; }
        GetType() { return Agents; }
    }

    export class Signup extends Login {
    }

    export class Signout extends sdata.QShopRow {
        public static __fields__() {
            return [
            ];
        }
        public getStore() { return Signout.pStore; }
        public GetType() { return Signout; }
        private static pStore = new collection.Dictionary<number, any>("Signout", false);
        constructor() { super(basic.New()); }
    }

    export class Logins extends sdata.DataTable<Login>{
        constructor(_parent: sdata.DataRow, items?: Login[]) {
            super(_parent, Login, (id) => new Login(), items);
        }
        public get ArgType() { return Facture; }
        protected getArgType(json) { return Facture; }
        GetType() { return Factures; }

        OnDeserialize(list: Login[]) {
            this.Order((a, b) => a.Client.Id > b.Client.Id);
        }
    }

    export class QData extends sdata.QShopRow {
        QteLimited: boolean;
        private static pStore = new collection.Dictionary<number, any>("QData", true);
        public getStore(): collection.Dictionary<number, any> { return QData.pStore; }
        static __fields__() {
            return [QData.DPProducts, QData.DPSelectedFacture, QData.DPFactures, QData.DPAgents,this.DPCostmers,
            /*QData.DPArticles,*/ QData.DPCategories, /*QData.DPPrices,*/ QData.DPSFactures, QData.DPFournisseurs, /*QData.DPVersments, QData.DPSVersments*/];
        }

        public static DPProducts = bind.DObject.CreateField<Products, QData>("Products", Products, null);
        public get Products(): Products { return this.get<Products>(QData.DPProducts); }

        //public static DPPrices = bind.DObject.CreateField<FakePrices, QData>("Prices", FakePrices, null);
        //public get Prices(): FakePrices { return this.get<FakePrices>(QData.DPPrices); }

        public static DPCategories = bind.DObject.CreateField<Categories, QData>("Categories", Categories);
        public get Categories(): Categories { return this.get<Categories>(QData.DPCategories); }

        /*
        public static DPArticles = bind.DObject.CreateField<Articles, QData>("Articles", Articles, null);
        public get Articles(): Articles { return this.get<Articles>(QData.DPArticles); }
        */

        public static DPSelectedFacture = bind.DObject.CreateField<Facture, QData>("SelectedFacture", Facture, null, (e) => e.__this.onCurrentFactureChanged(e));
        public SelectedFacture: Facture;


        public static DPFactures = bind.DObject.CreateField<Factures, QData>("Factures", Factures, null);
        public get Factures(): Factures { return this.get<Factures>(QData.DPFactures); }

        public static DPSFactures = bind.DObject.CreateField<SFactures, QData>("SFactures", SFactures, null);
        public get SFactures(): SFactures { return this.get<SFactures>(QData.DPSFactures); }


        public static DPCostmers = bind.DObject.CreateField<Costumers, QData>("Costumers", Costumers, null);
        public get Costumers(): Costumers { return this.get<Costumers>(QData.DPCostmers); }


        public static DPProjets = bind.DObject.CreateField<Projets, QData>("Projets", Projets, null);
        public get Projets(): Projets { return this.get<Projets>(QData.DPProjets); }

        public static DPFournisseurs = bind.DObject.CreateField<Fournisseurs, QData>("Fournisseurs", Fournisseurs, null);
        public get Fournisseurs(): Fournisseurs { return this.get<Fournisseurs>(QData.DPFournisseurs); }


        private static DPAgents = bind.DObject.CreateField<Agents, QData>("Agents", Agents, null);
        public get Agents(): Agents { return this.get<Agents>(QData.DPAgents); }

        public static DPSMSs = bind.DObject.CreateField<models.SMSs, QData>("SMSs", models.SMSs);
        public get SMSs(): models.SMSs { return this.get<SMSs>(QData.DPSMSs); }
        /*
        public static DPVersments = bind.DObject.CreateField<Versments, QData>('Versments', Versments, null);
        public get Versments(): Versments { return this.get(QData.DPVersments); }
        

        public static DPSVersments = bind.DObject.CreateField<SVersments, QData>('SVersments', SVersments, null);
        public get SVersments(): SVersments { return this.get(QData.DPSVersments); }
        */

        private onCurrentFactureChanged(e: bind.EventArgs<Facture, QData>) {
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
        }
        private oacd: basic.IBindable = { Owner: this, Invoke: this.OnArticlesChanged };
        private articles = new Articles(this);
        private OnArticlesChanged(e: utils.ListEventArgs<number, Article>) {
            switch (e.event) {
                case collection.CollectionEvent.Added:
                    e.newItem.Product.CurrentArticle = e.newItem;
                    this.articles.Insert(e.startIndex, e.newItem);
                    break;
                case collection.CollectionEvent.Cleared:
                    var o = this.articles;
                    for (var i = 0, l = o.Count; i < l; i++) {
                        var j = o.Get(i);
                        j.Product.CurrentArticle = null;
                    }
                    this.articles.Clear();
                    break;
                case collection.CollectionEvent.Removed:
                    e.oldItem.Product.CurrentArticle = null;
                    this.articles.RemoveAt(e.startIndex);
                    break;
                case collection.CollectionEvent.Replace:
                    e.oldItem.Product.CurrentArticle = null;
                    e.newItem.Product.CurrentArticle = e.newItem;
                    this.articles.Set(e.startIndex, e.newItem);
                    break;
                case collection.CollectionEvent.Reset:
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
        }

        Clear() {
            var c = this.GetValues();
            for (var i = 0; i < c.length; i++) {
                var j = c[i];
                if (j instanceof sdata.DataTable) {
                    j.Clear();
                }
            }
        }
        constructor() {
            super(basic.New());
            this.set(QData.DPAgents, new models.Agents(this));
            this.set(QData.DPProducts, new Products(this));
            this.set(QData.DPFactures, new Factures(this));
            //this.set(QData.DPArticles, new Articles(this));
            this.set(QData.DPCostmers, new Costumers(this));
            this.set(QData.DPCategories, new Categories(this));
            this.set(QData.DPFournisseurs, new Fournisseurs(this));
            this.set(QData.DPProducts, new Products(this));
            models.SVersment
            /*this.set(QData.DPVersments, new Versments(this));
            this.set(QData.DPSVersments, new SVersments(this));*/
            this.set(QData.DPProjets, new Projets(this));

            //var cc = new FakePrices(this);
            //this.set(QData.DPPrices, cc);
            this.set(QData.DPSFactures, new SFactures(this));
            this.set(QData.DPSMSs, new models.SMSs("General", "all"));
            bind.NamedScop.Create("qdata", this);
        }
    }

    export class IsAdmin extends sdata.QShopRow {
        public getStore() { return null; }
    }

    export class IsSecured extends sdata.QShopRow {
        public getStore() { return null; }
    }
    export enum TransferType {
        Versment,
        Facture
    }

    export class EtatTransfer extends sdata.DataRow {
        private static _store = new collection.Dictionary<any, any>("EtatTransfer");
        protected getStore(): collection.Dictionary<number, this> {
            return EtatTransfer._store;
        }
        Update() {
        }
        Upload() {
        }
        public static DPType = bind.DObject.CreateField<TransferType, EtatTransfer>('Type', Number, TransferType.Facture);
        public Type: TransferType;

        public static DPDate = bind.DObject.CreateField<Date, EtatTransfer>('Date', Date);
        public Date: Date;

        public static DPMontantEntree = bind.DObject.CreateField<number, EtatTransfer>('MontantEntree', Number, 0);
        public MontantEntree: number;

        public static DPMontantSortie = bind.DObject.CreateField<number, EtatTransfer>('MontantSortie', Number, 0);
        public MontantSortie: number;

        public static DPTransactionId = bind.DObject.CreateField<number, EtatTransfer>('TransactionId', Number, 0);
        public TransactionId: number;


        public static DPActualSold = bind.DObject.CreateField<number, EtatTransfer>('ActualSold', Number, 0);
        public ActualSold: number;


        static __fields__() {
            return [this.DPType, this.DPDate, this.DPMontantEntree, this.DPMontantSortie, this.DPTransactionId, this.DPActualSold] as any;
        }
    }
    export class EtatTransfers extends sdata.DataTable<models.EtatTransfer> {

        public static DPTotalEntree = bind.DObject.CreateField<Number, EtatTransfers>('TotalEntree', Number, 0, (e) => {
            e.__this.Recalc();
        });
        public TotalEntree: number;


        public static DPTotalSortie = bind.DObject.CreateField<number, EtatTransfers>('TotalSortie', Number, 0, (e) => {
            e.__this.Recalc();
        });
        public TotalSortie: number;


        public static DPSold = bind.DObject.CreateField<number, EtatTransfers>('Sold', Number, 0);
        public Sold: number;



        public static DPIsVente = bind.DObject.CreateField<boolean, EtatTransfers>('IsVente', Boolean, true);
        public IsVente: boolean;

        FromJson(json: any, x: encoding.SerializationContext, update?: boolean, callback?: (prop: string, val: any) => Object) {
            super.FromJson(json, x, update, callback);
            this.Recalc();
            return this;
        }

        public Recalc() {
            this.Sold = (this.TotalSortie || 0) - (this.TotalEntree || 0);
        }

        static __fields__() {
            return [this.DPTotalEntree, this.DPTotalSortie, this.DPIsVente, this.DPSold] as any;
        }
        constructor(parent: sdata.DataRow) {

            super(parent, EtatTransfer, (id) => new EtatTransfer(id));
        }

        public ReOrder() {
            this.OrderBy((a, b) => (b.Date.getTime() - a.Date.getTime()) as any);
            var l = this.AsList();
            var c = 0;
            for (var i = l.length - 1; i >= 0; i--) {
                var v = l[i];
                var d = (v.MontantSortie || 0) - (v.MontantEntree || 0);
                c += d;
                v.ActualSold = this.IsVente ? c : -c;
            }
        }
    }
}
export namespace models {
    export class Mail extends sdata.QShopRow {
        protected getStore(): collection.Dictionary<number, this> {
            return null;
        }

        public static DPFrom: bind.DProperty<Client, Mail>;
        public static DPTo: bind.DProperty<Client, Mail>;
        public static DPSubject: bind.DProperty<string, Mail>;
        public static DPBody: bind.DProperty<string, Mail>;
        public static DPReaded: bind.DProperty<boolean, Mail>;
        public static DPDate: bind.DProperty<string, Mail>;
        public get From() { return this.get<Client>(Mail.DPFrom); }
        public set From(v: Client) { this.set(Mail.DPFrom, v); }
        public get To() { return this.get<Client>(Mail.DPTo); }
        public set To(v: Client) { this.set(Mail.DPTo, v); }
        public get Subject() { return this.get<string>(Mail.DPSubject); }
        public set Subject(v: string) { this.set(Mail.DPSubject, v); }
        public get Body() { return this.get<string>(Mail.DPBody); }
        public set Body(v: string) { this.set(Mail.DPBody, v); }
        public get Readed() { return this.get<boolean>(Mail.DPReaded); }
        public set Readed(v: boolean) { this.set(Mail.DPReaded, v); }
        public get Date() { return this.get<string>(Mail.DPDate); }
        public set Date(v: string) { this.set(Mail.DPDate, v); }
        static __fields__() { return [this.DPFrom, this.DPTo, this.DPSubject, this.DPBody, this.DPReaded, this.DPDate]; }
        static ctor() {
            this.DPFrom = bind.DObject.CreateField<Client, Mail>("From", Client, null, null, null, bind.PropertyAttribute.SerializeAsId);
            this.DPTo = bind.DObject.CreateField<Client, Mail>("To", Client, null, null, null, bind.PropertyAttribute.SerializeAsId);
            this.DPSubject = bind.DObject.CreateField<string, Mail>("Subject", String);
            this.DPBody = bind.DObject.CreateField<string, Mail>("Body", String);
            this.DPReaded = bind.DObject.CreateField<boolean, Mail>("Readed", Boolean, null, null, null, bind.PropertyAttribute.NonSerializable);
            this.DPDate = bind.DObject.CreateField<string, Mail>("Date", String, null, null, null, bind.PropertyAttribute.NonSerializable);
        }
        constructor(id?) {
            super(id);
        }
        public static New() {
            return new Mail(basic.GuidManager.Next);
        }
    }
}
export namespace models {
    export class CArticle extends sdata.QShopRow {
        private static pstore = new collection.Dictionary<number, CArticle>("CARTICLES");
        protected getStore(): collection.Dictionary<number, this> {
            return CArticle.pstore as any;
        }

        public static DPCommand: bind.DProperty<Command, CArticle>;
        public static DPFournisseur: bind.DProperty<Fournisseur, CArticle>;
        public static DPProduct: bind.DProperty<Product, CArticle>;
        public static DPQte: bind.DProperty<Number, CArticle>;
        public static DPPrice: bind.DProperty<Number, CArticle>;
        public static DPPriceMin: bind.DProperty<Number, CArticle>;
        public static DPPriceMax: bind.DProperty<Number, CArticle>;
        public static DPDateSel: bind.DProperty<Date, CArticle>;
        public static DPProductName: bind.DProperty<string, CArticle>;
        public static DPLabel: bind.DProperty<string, CArticle>;
        public Command: Command;
        Fournisseur: Fournisseur;
        Product: Product;
        Qte: number;
        Price: number;
        PriceMin: number;
        PriceMax: number;
        DateSel: Date;
        ProductName: string;

        public Label: string;
        public OnNameChanged
        static __fields__() { return [this.DPCommand, this.DPFournisseur, this.DPProduct, this.DPQte, this.DPPrice, this.DPPriceMin, this.DPPriceMax, this.DPDateSel, this.DPProductName, this.DPLabel]; }
        static ctor() {
            this.DPCommand = bind.DObject.CreateField<Command, CArticle>("Command", Command, null, null, null, bind.PropertyAttribute.SerializeAsId);
            this.DPFournisseur = bind.DObject.CreateField<Fournisseur, CArticle>("Fournisseur", Fournisseur, null, null, null, bind.PropertyAttribute.SerializeAsId);
            this.DPProduct = bind.DObject.CreateField<Product, CArticle>("Product", Product, null, this.prototype.ProductChanged, null, bind.PropertyAttribute.SerializeAsId);
            this.DPQte = bind.DObject.CreateField<Number, CArticle>("Qte", Number);
            this.DPPrice = bind.DObject.CreateField<Number, CArticle>("Price", Number);
            this.DPPriceMin = bind.DObject.CreateField<Number, CArticle>("PriceMin", Number);
            this.DPPriceMax = bind.DObject.CreateField<Number, CArticle>("PriceMax", Number);
            this.DPDateSel = bind.DObject.CreateField<Date, CArticle>("DateSel", Date);
            this.DPProductName = bind.DObject.CreateField<string, CArticle>("ProductName", String, void 0, this.prototype.ProductNameChanged);
            this.DPLabel = bind.DObject.CreateField<string, CArticle>("Label", String, void 0, void 0, void 0, bind.PropertyAttribute.Private);
        }
        toString() {
            return this.Label || (this.Product && this.Product.toString());
        }
        private isNullOrWhiteSpace(s: string) {
            return s == null || s.trim() == "";
        }
        private ProductNameChanged(e: bind.EventArgs<string, this>) {
            this.setProduct(this.Product, e._new);
        }
        private ProductChanged(e: bind.EventArgs<Product, this>) {
            this.setProduct(e._new, this.ProductName);
        }
        private setProduct(p: models.Product, name: string) {
            if (this.isNullOrWhiteSpace(name))
                this.Label = (p && p.toString()) || "";
            else this.Label = name;
        }
        constructor(id?: number) {
            super(id);
            if (!window['arr']) window['arr'] = [this];
            else window['arr'].push(this);
        }
    }


    bind.Register({
        Name: "TLabel",
        Todo(this: bind.Job, ji, e: bind.EventArgs<Article, any>) {
            
            var _new = e._new;
            var _old = e._old;
            var obs = ji.getValue('obs') as bind.Observer;
            obs.Me = _new;
        },

        OnInitialize(this: bind.Job, ji, e) {
            var getLabel = (ji.dom as Element).getAttribute('get-label') || 'Label';
            var setLabel = (ji.dom as Element).getAttribute('set-label') || 'ProductName';

            var obs = new bind.Observer(ji.Scop.Value, [getLabel]);
            function setValue(dom: Node, value: any) {
                if (dom instanceof HTMLInputElement)
                    dom.value = value || "";
                else
                    (dom as HTMLElement).innerText = value || "";
            }
            obs.OnPropertyChanged(bind.Observer.DPValue, function (this: bind.JobInstance, s, e) { setValue(this.dom, e._new); }, ji);
            setValue(ji.dom, obs.Value);
            if (ji.dom instanceof HTMLInputElement) {
                ji.dom.addEventListener('change', (e) => {
                    var c = ji.Scop.Value as Article;
                    if (c)
                        c[setLabel] = (ji.dom as HTMLInputElement).value;
                }, { capture: true });
            }
            ji.addValue('obs', obs);
            this.Todo(ji, <any>{ _new: ji.Scop.Value });
        },
    });

    export class CArticles extends sdata.DataTable<CArticle> {

        public static DPCommand: bind.DProperty<Command, CArticles>;
        public get Command() { return this.get<Command>(CArticles.DPCommand); }
        public set Command(v: Command) { this.set(CArticles.DPCommand, v); }
        static __fields__() { return [this.DPCommand]; }
        static ctor() {
            this.DPCommand = bind.DObject.CreateField<Command, CArticles>("Command", Command);
        }
        constructor(parent:sdata.DataRow) {
            super(parent, models.CArticle, (id) => new CArticle(id));
        }
        FromJson(json: any, x: encoding.SerializationContext, update?: boolean, callback?: (prop: string, val: any) => Object): this {
            this.Clear();
            return super.FromJson(json, x, update, callback);
        }
    }
    export class Command extends sdata.QShopRow {
        private static pstore = new collection.Dictionary<number, Command>("Command");
        protected getStore(): collection.Dictionary<number, this> {
            return Command.pstore as any;
        }

        public static DPArticles: bind.DProperty<CArticles, Command>;
        public static DPDate: bind.DProperty<Date, Command>;
        public static DPIsOpen: bind.DProperty<boolean, Command>;
        public static DPLockedBy: bind.DProperty<Agent, Command>;
        public get Articles() { return this.get<CArticles>(Command.DPArticles); }
        public set Articles(v: CArticles) { this.set(Command.DPArticles, v); }
        public get Date() { return this.get<Date>(Command.DPDate); }
        public set Date(v: Date) { this.set(Command.DPDate, v); }
        public get IsOpen() { return this.get<boolean>(Command.DPIsOpen); }
        public set IsOpen(v: boolean) { this.set(Command.DPIsOpen, v); }
        public get LockedBy() { return this.get<Agent>(Command.DPLockedBy); }
        public set LockedBy(v: Agent) { this.set(Command.DPLockedBy, v); }
        static __fields__() { return [this.DPArticles, this.DPDate, this.DPIsOpen, this.DPLockedBy]; }
        static ctor() {
            this.DPArticles = bind.DObject.CreateField<CArticles, Command>("Articles", CArticles);
            this.DPDate = bind.DObject.CreateField<Date, Command>("Date", Date);
            this.DPIsOpen = bind.DObject.CreateField<boolean, Command>("IsOpen", Boolean);
            this.DPLockedBy = bind.DObject.CreateField<Agent, Command>("LockedBy", Agent);
        }
        constructor(id?: number) {
            super(id);
            this.Articles = new CArticles(this);
        }
    }
    export class Commands extends sdata.DataTable<Command> {

        static __fields__() { return []; }
        static ctor() { }
    }

    export class Statstics extends sdata.DataRow {
        protected getStore(): collection.Dictionary<number, this> { return null; }
        Update() { }
        Upload() { }
    }
}

export namespace models {
    export class Ticket extends bind.DObject {
        public static DPLabel: bind.DProperty<string, Ticket>;
        public static DPPrixAchat: bind.DProperty<number, Ticket>;
        public static DPPrixVent: bind.DProperty<number, Ticket>;
        public static DPCount: bind.DProperty<number, Ticket>;
        PrixAchat: number;
        PrixVent: number;
        Count: number;
        Label: string;

        static ctor() {
            this.DPPrixAchat = bind.DObject.CreateField<number, Ticket>("PrixAchat", Number, 0);
            this.DPPrixVent = bind.DObject.CreateField<number, Ticket>("PrixVent", Number, 0);
            this.DPCount = bind.DObject.CreateField<number, Ticket>("Count", Number, 0);
            this.DPLabel = bind.DObject.CreateField<string, Ticket>("Label", String, "");
        }
        static __fields__() { return [this.DPPrixAchat, this.DPPrixVent, this.DPCount, this.DPLabel]; }
        public static New(pa, pv, c, l) {
            var t = new Ticket();
            t.PrixAchat = pa;
            t.PrixVent = pv;
            t.Count = c;
            t.Label = l;
            return t;
        }
    }
    export class Tickets extends bind.DObject {
        Clear() {
            this.Values.Clear();
            this.Response = null;
            return this;
        }
        public static DPPrinterName: bind.DProperty<string, Tickets>;
        public static DPValues: bind.DProperty<collection.List<Ticket>, Tickets>;

        public static DPResponse = bind.DObject.CreateField<Object, Tickets>("Response", Object, null, null, null, bind.PropertyAttribute.NonSerializable);
        public PrinterName: string;
        public Values: collection.List<Ticket>;

        public Response: { FileName: string, Success: boolean };

        static ctor() {
            this.DPPrinterName = bind.DObject.CreateField<string, Tickets>("PrinterName", String, undefined);
            this.DPValues = bind.DObject.CreateField<collection.List<Ticket>, Tickets>("Values", reflection.GenericType.GetType(collection.List, [Ticket]), undefined);
        }
        static __fields__() { return [this.DPPrinterName, this.DPValues, this.DPResponse]; }
        constructor() {
            super();
            this.Values = new collection.List<Ticket>(Ticket);
        }
        public static test() {
            var t = new Tickets();
            for (var i = 0; i < 200; i++)
                t.Values.Add(Ticket.New(12, 23, 4, "Coude 110"));
            t.Values.Add(Ticket.New(12, 23, 4, "PVC 50"));
            t.Values.Add(Ticket.New(12, 123, 4, "Junker 10L"));
            t.Values.Add(Ticket.New(122, 23, 14, "Slimane Achour"));
            t.PrinterName = "Microsoft Print to PDF";
            return t;
        }

        public From(f: SFacture | SFactures) {
            if (f instanceof SFactures) {
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
        }

        public static From(f: SFacture | SFactures, t?: Tickets) {
            var t = t || new Tickets();
            if (f instanceof SFactures) {
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
        }
    }
    export interface IResponse {
        FileId: string;
        Success: boolean;
    }

    export class Printer extends bind.DObject {

        public static DPPrinters = bind.DObject.CreateField<collection.List<string>, Printer>("Printers", reflection.GenericType.GetType(collection.List, [String]), null, null, null, bind.PropertyAttribute.NonSerializable);
        public Printers: collection.List<string>;

        public static DPSelectedPrinter = bind.DObject.CreateField<string, Printer>("SelectedPrinter", String);
        public SelectedPrinter: string;

        public static DPPrintToFile = bind.DObject.CreateField<boolean, Printer>("PrintToFile", Boolean);
        public PrintToFile: boolean;


        public static DPResponse = bind.DObject.CreateField<IResponse, Printer>("Response", Object, null, null, null, bind.PropertyAttribute.NonSerializable);
        public Response: IResponse;

        static __fields__() { return [this.DPPrinters, this.DPSelectedPrinter, this.DPPrintToFile, this.DPResponse]; }
        static ctor() {
        }
    }

    export class PrintService extends bind.DObject {

        public static DPModel = bind.DObject.CreateField<string, PrintService>("Model", String);
        public Model: string;

        public static DPData = bind.DObject.CreateField<object, PrintService>("Data", Object);
        public Data: object;

        public static DPDataId = bind.DObject.CreateField<number, PrintService>("DataId", Number);
        public DataId: number;

        public static DPResponse = bind.DObject.CreateField<IResponse, PrintService>("Response", Object);
        public Response: IResponse;
        
        public static DPHandlerId = bind.DObject.CreateField<string, PrintService>("HandlerId", String);
        public HandlerId: string; 
    }
}
export namespace Printing {

    export interface IResponse {
        FileName: string;
        Success: boolean;
    }


    export class PrintData extends bind.DObject {

        public static DPHandlerId: bind.DProperty<String, PrintData>;
        public static DPModel: bind.DProperty<String, PrintData>;
        public static DPData: bind.DProperty<bind.DObject, PrintData>;
        public static DPDataId: bind.DProperty<Number, PrintData>;
        public static DPResponse: bind.DProperty<IResponse, PrintData>;
        public get HandlerId() { return this.get<String>(PrintData.DPHandlerId); }
        public set HandlerId(v: String) { this.set(PrintData.DPHandlerId, v); }
        public get Model() { return this.get<String>(PrintData.DPModel); }
        public set Model(v: String) { this.set(PrintData.DPModel, v); }
        public get Data() { return this.get<bind.DObject>(PrintData.DPData); }
        public set Data(v: bind.DObject) { this.set(PrintData.DPData, v); }
        public get DataId() { return this.get<Number>(PrintData.DPDataId); }
        public set DataId(v: Number) { this.set(PrintData.DPDataId, v); }
        public get Response() { return this.get<IResponse>(PrintData.DPResponse); }
        public set Response(v: IResponse) { this.set(PrintData.DPResponse, v); }
        static __fields__() { return [this.DPHandlerId, this.DPModel, this.DPData, this.DPDataId, this.DPResponse]; }
        static ctor() {
            this.DPHandlerId = bind.DObject.CreateField<String, PrintData>("HandlerId", String);
            this.DPModel = bind.DObject.CreateField<String, PrintData>("Model", String);
            this.DPData = bind.DObject.CreateField<bind.DObject, PrintData>("Data", bind.DObject);
            this.DPDataId = bind.DObject.CreateField<Number, PrintData>("DataId", Number);
            this.DPResponse = bind.DObject.CreateField<IResponse, PrintData>("Response", Object);
        }
    }

    
}
export namespace models {
    export class UserSetting extends sdata.DataRow {
        static _store = new collection.Dictionary<number, any>("UserSettings");
        protected getStore(): collection.Dictionary<number, this> {
            return UserSetting._store as any;
        }
        Update() {
            
        }
        Upload() {
        }
        @attributes.property(Boolean) TopNavBarVisibility: boolean;

        @attributes.property(Boolean) OfflineMode: boolean;

        @attributes.property(Boolean) AppTitleHidden: boolean;

        @attributes.property(Boolean, void 0, 'show-sp-tooltips') ShowSPTooltips: boolean;

        @attributes.property(Number) opened_facture: number;
        @attributes.property(Number) opened_sfacture: number;

        @attributes.property(String) selectedPage: String;

        @attributes.property(String) opened_factures: string;

        @attributes.property(String) opened_sfactures: string;

        onPropertyChanged(e: bind.EventArgs<any, any>) {
            basic.Settings.set("UserSetting." + e.prop.Name, e._new);
            Notification.fire("UserSetting." + e.prop.Name + "Changed", [this, e]);
            Notification.fire("UserSettingChanged", [this, e]);
            return super.onPropertyChanged(e);
        }
        constructor() {
            super(basic.New());
            var t = bind.DObject.getFields(this.GetType());
            for (var i = 0; i < t.length; i++) {
                var p = t[i];
                super.set(p, basic.Settings.get("UserSetting." + p.Name));
            }
        }
        public static Default: UserSetting;
    }
    UserSetting.Default = new UserSetting();
}
function total(a: models.Versments) {
    
    if (a == null) return 0;
    var r = 0;
    for (var i = 0, l = a.Count; i < l; i++)
        r += a.Get(i).Montant;
    return r;
}
bind.Register(new bind.Job('totalarray', (ji, e) => {
    var c = ji.Scop.Value;
    var dm = ji.dom as HTMLElement;
    dm.innerHTML = (c == null ? '<span style="color:red">0.00 DZD</span>' : (total(c)) + ' DZD');
}, null, null, (ji, e) => {
    var c = ji.Scop.Value;
    var dm = ji.dom as HTMLElement;
    dm.innerHTML = (c == null ? '<span style="color:red">0.00 DZD</span>' : (total(c)) + ' DZD');
}, null));
bind.Register(new bind.Job('jobi', (ji, e) => {
    var dm = ji.dom;
    dm.textContent = (ji.Scop.Value || 0) + ' Articles';
}, null, null, (ji, e) => {
    var dm = ji.dom;
    dm.textContent = (ji.Scop.Value || 0) + ' Articles';
}, null));
