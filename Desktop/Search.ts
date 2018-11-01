import { bind, collection, reflection } from "../lib/Q/sys/Corelib";
import { models } from "../abstract/Models";
import { Critere } from "../lib/Q/sys/Critere";
import { UI } from "../lib/Q/sys/UI";



export namespace SearchData {
    export class Client extends Critere.ComplexCritere<models.Client> {
        static __fields__() { return this.generateFieldsFrom(models.Client);}
    }
    export class Login extends Critere.ComplexCritere<models.Login> {
        static __fields__() { return this.generateFieldsFrom(models.Login); }
    }
    export class Category extends Critere.ComplexCritere<models.Category> {
        static __fields__() { return this.generateFieldsFrom(models.Category); }
    }

    export class Fournisseur extends Critere.ComplexCritere<models.Fournisseur> {
        static __fields__() { return this.generateFieldsFrom(models.Client); }
    }


    export class Versment extends Critere.ComplexCritere<models.Versment> {
        static __fields__() { return this.generateFieldsFrom(models.Versment); }
    }


    export class Facture extends Critere.ComplexCritere<models.Facture> {
        static __fields__() { return this.generateFieldsFrom(models.Facture); }
    }

    export class SFacture extends Critere.ComplexCritere<models.SFacture> {
        static __fields__() { return this.generateFieldsFrom(models.SFacture); }
    }
    export class Product extends Critere.ComplexCritere<models.Product> {
        static __fields__() { return Product.generateFieldsFrom(models.Product); }
    }
    export class SMS extends Critere.ComplexCritere<models.SMS> {
        static __fields__() { return this.generateFieldsFrom(models.SMS); }
    }


    export class SVersment extends Critere.ComplexCritere<models.SVersment> {
        static __fields__() { return Product.generateFieldsFrom(models.SVersment); }
    }
    export class Etats extends Critere.ComplexCritere<models.EtatTransfer> {
        static __fields__() { return Etats.generateFieldsFrom(models.EtatTransfer); }
    }

}