
import { mvc, utils, basic, thread, encoding, net, bind, reflection, collection } from '../lib/Q/sys/Corelib';
import { sdata, Controller, base } from '../lib/Q/sys/System';

import { models as imodels } from "./Models";
import {Apis } from './QShopApis';

export namespace ikmodels {
    export class FactureSearch extends bind.DObject implements utils.IPatent<imodels.Facture>, IFS {
        public static DPClient = bind.DObject.CreateField<imodels.Client, FactureSearch>('Client', imodels.Client);
        
        public static DPVendeur = bind.DObject.CreateField<imodels.Agent, FactureSearch>('Vendeur', imodels.Agent);

        public static DPDate = bind.DObject.CreateField<base.DateVecteur, FactureSearch>('Date', base.DateVecteur);
        public static DPDateLivraison = bind.DObject.CreateField<base.DateVecteur, FactureSearch>('DateLivraison', base.DateVecteur);

        public static DPTotal = bind.DObject.CreateField<base.NumberVecteur, FactureSearch>('Total', base.NumberVecteur);
        public static DPSold = bind.DObject.CreateField<base.NumberVecteur, FactureSearch>('Sold', base.NumberVecteur);

        public static DPIsValidated = bind.DObject.CreateField<boolean, FactureSearch>('IsValidated', Boolean);

        static __fields__() {
            return [FactureSearch.DPClient, FactureSearch.DPVendeur,
                FactureSearch.DPDate, FactureSearch.DPDateLivraison,
                FactureSearch.DPTotal, FactureSearch.DPSold,
                FactureSearch.DPIsValidated];
        }

        get Client() { return this.get(FactureSearch.DPClient); } set Client(v) { this.set(FactureSearch.DPClient, v); }
        
        get Vendeur() { return this.get(FactureSearch.DPVendeur); } set Vendeur(v) { this.set(FactureSearch.DPVendeur, v); }

        get Date() { return this.get(FactureSearch.DPDate); } set Date(v) { this.set(FactureSearch.DPDate, v); }
        get DateLivraison() { return this.get(FactureSearch.DPDateLivraison) as any; } set DateLivraison(v) { this.set(FactureSearch.DPDateLivraison, v); }

        get Total(): base.NumberVecteur { return this.get(FactureSearch.DPTotal) as any; } set Total(v) { this.set(FactureSearch.DPTotal, v); }
        get Sold(): base.NumberVecteur { return this.get(FactureSearch.DPSold) as any; } set Sold(v) { this.set(FactureSearch.DPSold, v); }

        get IsValidated() { return this.get(FactureSearch.DPIsValidated); } set IsValidated(v) { this.set(FactureSearch.DPIsValidated, v); }
        constructor() {
            super();
            this.Date = new base.DateVecteur();
            this.DateLivraison = new base.DateVecteur();
            this.Total = new base.NumberVecteur();
            this.Sold = new base.NumberVecteur();
            Object.freeze(this);
        }

        Check(s: imodels.Facture) {
            
            if (this.Client && this.Client != s.Client)
                return false;
            
            if (this.Vendeur && this.Vendeur != s.Vendeur)
                return false;

            if (this.IsValidated != null && this.IsValidated != s.IsValidated)
                return false;
            if (!this.Date.Check(s.Date)) return false;
            if (!this.DateLivraison.Check(s.DateLivraison)) return false;
            
            if (!this.Total.Check(s.Total)) return false;

            return true;
        }
        equals(p: IFS) {
            return p.Client === this.Client && p.Date === this.Date && p.DateLivraison === this.DateLivraison &&  this.IsValidated === p.IsValidated && p.Sold === this.Sold && p.Total === this.Total && p.Vendeur === this.Vendeur;
        }
        ToInterface(): IFS {
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
            }
        }
    }
    export interface IFS extends utils.IPatent<imodels.Facture> {
        Client: imodels.Client;
        Vendeur: imodels.Agent;
        Date: base.DateVecteur;
        DateLivraison: base.DateVecteur;
        Total: base.NumberVecteur;
        Sold: base.NumberVecteur;
        IsValidated: boolean;
        Check(s: imodels.Facture);
    }
    export class FSFilter extends utils.Filter<imodels.Facture, IFS> {
        private ifs: IFS;
        constructor(private fs: FactureSearch) {
            super();
        }
        protected convertFromString(x: string): IFS {
            throw "invalide";
        }
        public Begin(deb: number, count: number) {
            this.ifs = this.Patent as IFS;
        }
        public IsMatch(index: number, item: imodels.Facture) {
            return !this.ifs || this.ifs.Check(item);
        }
    }

}
export namespace ikmodels {

    export class SFactureSearch extends bind.DObject implements utils.IPatent<imodels.SFacture>, ISFS {
        public static DPFournisseur = bind.DObject.CreateField<imodels.Fournisseur, SFactureSearch>('Fournisseur', imodels.Fournisseur);
        public static DPAchteur = bind.DObject.CreateField<imodels.Agent, SFactureSearch>('Achteur', imodels.Agent);
        public static DPValidateur = bind.DObject.CreateField<imodels.Agent, SFactureSearch>('Vendeur', imodels.Agent);

        public static DPDate = bind.DObject.CreateField<base.DateVecteur, SFactureSearch>('Date', base.DateVecteur);        

        public static DPTotal = bind.DObject.CreateField<base.NumberVecteur, SFactureSearch>('Total', base.NumberVecteur);
        public static DPSold = bind.DObject.CreateField<base.NumberVecteur, SFactureSearch>('Sold', base.NumberVecteur);

        public static DPIsValidated = bind.DObject.CreateField<boolean, SFactureSearch>('IsValidated', Boolean);

        static __fields__() {
            return [SFactureSearch.DPFournisseur, SFactureSearch.DPAchteur, SFactureSearch.DPValidateur,
                SFactureSearch.DPDate,
                SFactureSearch.DPTotal, SFactureSearch.DPSold,
                SFactureSearch.DPIsValidated];
        }

        get Fournisseur() { return this.get(SFactureSearch.DPFournisseur); } set Fournisseur(v) { this.set(SFactureSearch.DPFournisseur, v); }
        get Achteur() { return this.get(SFactureSearch.DPAchteur); } set Achteur(v) { this.set(SFactureSearch.DPAchteur, v); }
        get Validateur() { return this.get(SFactureSearch.DPValidateur); } set Validateur(v) { this.set(SFactureSearch.DPValidateur, v); }

        get Date() { return this.get(SFactureSearch.DPDate); } set Date(v) { this.set(SFactureSearch.DPDate, v); }

        get Total(): base.NumberVecteur { return this.get(SFactureSearch.DPTotal) as any; } set Total(v) { this.set(SFactureSearch.DPTotal, v); }
        get Sold(): base.NumberVecteur { return this.get(SFactureSearch.DPSold) as any; } set Sold(v) { this.set(SFactureSearch.DPSold, v); }

        get IsValidated() { return this.get(SFactureSearch.DPIsValidated); } set IsValidated(v) { this.set(SFactureSearch.DPIsValidated, v); }
        constructor() {
            super();
            this.Date = new base.DateVecteur();
            this.Total = new base.NumberVecteur();
            this.Sold = new base.NumberVecteur();
            Object.freeze(this);
        }

        Check(s: imodels.SFacture) {

            if (this.Fournisseur && this.Fournisseur != s.Fournisseur)
                return false;
            if (this.Achteur && this.Achteur != s.Achteur)
                return false;
            if (this.Validateur && this.Validateur != s.Validator)
                return false;

            if (this.IsValidated != null && this.IsValidated != s.IsValidated)
                return false;
            if (!this.Date.Check(s.Date)) return false;

            if (!this.Total.Check(s.Total)) return false;

            return true;
        }
        equals(p: ISFS) {
            return p.Fournisseur === this.Fournisseur && p.Date === this.Date &&  p.Achteur === this.Achteur && this.IsValidated === p.IsValidated && p.Sold === this.Sold && p.Total === this.Total && p.Validateur === this.Validateur;
        }
        ToInterface(): ISFS {
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
            }
        }
    }

    export interface ISFS extends utils.IPatent<imodels.SFacture> {
        Fournisseur: imodels.Fournisseur;
        Achteur: imodels.Agent;
        Validateur: imodels.Agent;
        Date: base.DateVecteur;
        Total: base.NumberVecteur;
        Sold: base.NumberVecteur;
        IsValidated: boolean;
    }

    export class SFSFilter extends utils.Filter<imodels.SFacture, ISFS> {
        private ifs: ISFS;
        constructor(private fs: SFactureSearch) {
            super();
        }
        protected convertFromString(x: string): ISFS {
            throw "invalide";
        }
        public Begin(deb: number, count: number) {
            this.ifs = this.Patent as ISFS;
        }
        public IsMatch(index: number, item: imodels.SFacture) {
            return !this.ifs || this.ifs.Check(item);
        }
    }
}