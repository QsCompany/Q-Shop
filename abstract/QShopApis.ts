import {net, basic, encoding} from '../lib/q/sys/Corelib';
import { sdata, Controller} from '../lib/q/sys/System';
import { models, Printing} from './Models';
import { models as qModels } from '../lib/q/sys/QModel';
var array_user = models.Clients;
var array_product = models.Products;
var array_Facture = models.Factures;
var array_Article = models.Articles;
var array_Client = models.Clients;
var array_Agent = models.Agents;
var array_Versment = models.Versments
var array_Category = models.Categories;
var array_Picture = models.Pictures;
declare var context: basic.IContext;
function serialize (obj) {
    var str = [];
    for (var p in obj)
        if (obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
    return str.join("&");
}
export namespace Apis {
    export abstract class DataRow<T extends sdata.DataRow> extends Controller.Api<T>{
        get Url() {
            return __global.GetApiAddress(this._root)
        }
        constructor(public _root: string, costume?: boolean, private skipParseResponse?: boolean, costumApis?: boolean) {
            super(true);
            if (!costume)
                if (_root.indexOf('/_/') !== 0) this._root = '/_/' + _root;
            if (!costumApis) {
                this.ERegister(net.WebRequestMethod.Get, 'GET', "Id=@Id", false);
                this.ERegister(net.WebRequestMethod.Get, 'CREATE', "Id=@Id", false);
                this.ERegister(net.WebRequestMethod.Delete, 'DELETE', "Id=@Id", false);
                this.ERegister(net.WebRequestMethod.Post, 'SAVE', undefined, true);
                this.ERegister(net.WebRequestMethod.Get, 'UPDATE', "Id=@Id", false);
                this.ERegister(net.WebRequestMethod.Post, 'VALIDATE', "Id=@Id", true);
                this.ERegister(net.WebRequestMethod.Set, 'SetProperty', "Id=@Id", true);
                this.ERegister(net.WebRequestMethod.Create, 'CREATE', undefined, true);
            }
        }

        get ParseResponse() { return !this.skipParseResponse; }
        public abstract GetType();
        private static getId(idata) {
            return (idata instanceof sdata.DataRow)
                ? idata.Id.toString()
                : (typeof idata === 'number' ? <number>idata : idata.hasOwnProperty('Id') ? idata.Id : 0);
        }
        protected addQuestionMark() {
            return true;
        }
        public GetRequest(idata: T, xshema: string | net.RequestMethodShema | net.WebRequestMethod, params?: net.IRequestParams): net.RequestUrl {
            var shema = this.GetMethodShema(xshema);
            if (shema && shema.ParamsFormat) {
                var qs = shema.ParamsFormat.apply(params || {});
            }
            else if (params)
                qs = serialize(params)
            return new net.RequestUrl(qs ? this.Url + (this.addQuestionMark() ? "?" : '') + qs : this.Url, null, null, shema ? shema.Method : 0, shema.SendData);
        }
        public OnResponse(response: JSON, data: T, context: encoding.SerializationContext) {
            if (this.ParseResponse)
                return data && data.FromJson && data.FromJson(response, context, true);
            return data;
        }
    }
    export abstract class DataTable<T extends sdata.DataTable<P>, P extends sdata.DataRow> extends Controller.Api<T>{
        get Url() {
            return __global.GetApiAddress(this._root)
        }
        constructor(private _root: string, costume?: boolean) {
            super(true);
            if (!costume)
                if (_root.indexOf('/_/') !== 0) this._root = '/_/' + _root;
            this.ERegister(net.WebRequestMethod.Get, "UPDATE", "Id=@Id", false);
            this.ERegister(net.WebRequestMethod.SUPDATE, "SUPDATE", "Date=@Date", false);
            this.ERegister(net.WebRequestMethod.Get, "GETCSV", "csv=true", false);
        }

        public GetRequest(idata: T, xshema: string | net.RequestMethodShema | net.WebRequestMethod, params?: net.IRequestParams): net.RequestUrl {
            var shema = this.GetMethodShema(xshema);
            if (shema && shema.ParamsFormat)
                var qs = shema.ParamsFormat.apply(params || {});
            else if (params)
                qs = serialize(params)
            return new net.RequestUrl(qs ? this.Url + "?" + qs : this.Url, null, null, shema ? shema.Method : 0, shema && shema.SendData);
        }
        public abstract GetType();
        public OnResponse(response: JSON, data: T, _context: encoding.SerializationContext) {
            var ed = Date.now();
            if (response == null) return;
            if (data) {
                data.Stat = sdata.DataStat.Updating;
                data.FromJson(response, _context);
                data.Stat = sdata.DataStat.Updated;
            }
            return;
        }
    }
    export abstract class FactureBase<T extends models.FactureBase> extends DataRow<T> {
        constructor(root: string, costume?: boolean) {
            super(root, costume)
            this.ERegister(net.WebRequestMethod.Get, 'OPEN', "Id=@Id&Operation=Open", false);
            this.ERegister(net.WebRequestMethod.Get, 'BENIFIT', "Id=@Id&Operation=Benifit", false);
            this.ERegister(net.WebRequestMethod.Close, 'CLOSE', "Id=@Id&Operation=Close&Force=@Force", false);
            this.ERegister(net.WebRequestMethod.Get, 'ISOPEN', "Id=@Id&Operation=IsOpen", false);
            this.ERegister(net.WebRequestMethod.Open, 'OPEN', "Id=@Id", false);
            this.ERegister(net.WebRequestMethod.Print, 'PRINT', "Id=@Id", false);
            this.ERegister(net.WebRequestMethod.Close, 'FORCECLOSE', "Id=@Id&Force=true", false);

            this.ERegister(net.WebRequestMethod.Post, 'SetProperty', "Set=@Property&Id=@Id&value=@Value", false);
            this.ERegister(net.WebRequestMethod.Post, 'SetInfo', "SetInfo&Id=@Id", true);
            
        }
    }

    export class UserSetting extends DataRow<models.UserSetting>{
        constructor() { super('usersetting'); }
        GetType() { return models.UserSetting; }
    }
    export class Client extends DataRow<models.Client>{
        constructor() { super('Client'); }
        GetType() { return models.Client; }
    }
    export class SMS extends DataRow<models.SMS>{
        constructor() { super('SMS'); }
        GetType() { return models.SMS; }
    }
    export class Projet extends DataRow<models.Projet>{
        constructor() { super('Projet'); }
        GetType() { return models.Projet; }
    }
    export class Login extends DataRow<models.Login>{
        GetType() { return models.Login; }
        GetRequest(idata: models.Login, xshema: string | net.RequestMethodShema | net.WebRequestMethod, params?: net.IRequestParams) {
            if (xshema == "AutoLogin")
                return super.GetRequest(idata, xshema, params);
            return new net.RequestUrl(this.Url, null, null, net.WebRequestMethod.Post);
        }
        constructor() {
            super('/~login', true);
            this.ERegister(net.WebRequestMethod.Get, 'AutoLogin', "Identification=@Identification&Id=@Id", false);
        }
    }

    export class LoginO extends DataRow<models.Login>{
        GetType() { return Number; }
        constructor() {
            super('Login', false);
            this.ERegister(net.WebRequestMethod.Post, 'VALIDATE', "validate&Id=@Id", false);
            this.ERegister(net.WebRequestMethod.Post, 'LOCK', "lock&Id=@Id", false);
            this.ERegister(net.WebRequestMethod.Post, 'REMOVE', "remove&Id=@Id", false);
        }
    }
    export class OLogin extends DataRow<models.Login> {
        GetType() { return models.Login }
    }


	export class IsAdmin extends DataRow<models.IsAdmin> {

		GetType() { return models.IsAdmin; }
        GetRequest() { return new net.RequestUrl(this.Url, null, null, net.WebRequestMethod.Get); }
        constructor() {
            super('/~IsAdmin', true);
        }
    }

    export class IsSecured extends DataRow<models.IsAdmin> {

        GetType() { return models.IsSecured; }
        GetRequest() { return new net.RequestUrl(this.Url, null, null, net.WebRequestMethod.Get); }
        constructor() {
            super('/~IsSecured', true);
        }
    }
    export class Signup extends DataRow<models.Signup>{
        GetType() { return models.Signup; }
        GetRequest() { return new net.RequestUrl(this.Url, null, null, net.WebRequestMethod.Post); }
        constructor() {
            super('/~Signup', true);
        }
    }
    export class Guid extends Controller.Api<basic.iGuid>{
        GetType() { return basic.iGuid; }
        GetRequest() { return new net.RequestUrl(__global.GetApiAddress('/~Guid'), null, null, net.WebRequestMethod.Get); }
        public OnResponse(response: JSON, data: any, context: encoding.SerializationContext) {
            return data;
        }
    }
    export class SessionId extends Controller.Api<basic.SessionId>{
        GetType() { return basic.SessionId; }
        GetRequest() { return new net.RequestUrl(__global.GetApiAddress('/~SessionId'), null, null, net.WebRequestMethod.Get); }
        public OnResponse(response: JSON, data: any, context: encoding.SerializationContext) {
            basic.SessionId.parse(response as any);
            return response;
        }
    }
    export class Signout extends DataRow<models.Signout>{
        GetType() { return models.Signout; }
        GetRequest() { return new net.RequestUrl(this.Url, null, null, net.WebRequestMethod.Post); }

        constructor() {
            super('/Signout',true);
        }
    }
    export class Users extends DataTable<models.Clients, models.Client>{
        constructor() { super('Users'); super("Users"); }
        GetType() { return array_user; }
    }
    export class Fournisseur extends DataRow<models.Fournisseur>{
        constructor() { super("Fournisseur"); }
        GetType() { return models.Fournisseur; }
    }
    export class Fournisseurs extends DataTable<models.Fournisseurs, models.Fournisseur>{
        constructor() {
            super('Fournisseurs');
        }
        GetType() { return models.Fournisseurs; }
    }

    export class Message extends DataRow<models.Message>{
        constructor() {
            super("CallBack");
        }
        GetType() { return qModels.Message; }
        GetRequest(x: models.Message) { return new net.RequestUrl(__global.GetApiAddress("/_/CallBack?Id=" + x.Id), null, null, net.WebRequestMethod.Post); }
        public OnResponse(response: JSON, data: qModels.Message, context: encoding.SerializationContext) {
            if (data != null)
                if (data.privateDecompress) return;
            return data && data.FromJson(response, context, true);
        }
    }


    export class Product extends DataRow<models.Product>{
        constructor() {
            super("Product");
            this.ERegister(net.WebRequestMethod.Post, 'AVATAR', "Operation=@Operation&Name=@Name&Size=@Size&PID=@PID", true);
        }
        GetType() { return models.Product; }
        
    }

    export class Products extends DataTable<models.Products, models.Product>{
        constructor() {
            super('Products');
            this.ERegister(net.WebRequestMethod.Print, "PRINT", "", true);
        }
        GetType() { return array_product; }
    }

    export class FakePrices extends DataTable<models.FakePrices, models.FakePrice>{
        constructor() { super('Prices'); }
        GetType() { return models.FakePrices; }
    }
    export class Mails extends DataTable<models.Mails, models.Mail>{
        constructor() {
            super('Mails');
            this.ERegister(net.WebRequestMethod.Get, 'UNREADED', "from=@From&to=@To&unReader=true", false);
            this.ERegister(net.WebRequestMethod.Get, 'READED', "from=@From&to=@To&unReader=false", false);
        }
        GetType() { return models.Mails; }
    }
    export class ProductsUpdater extends DataTable<models.Products, models.Product>{
        constructor() { super('Products'); }
        GetType() { return array_product; }
    }


    export class Clients extends DataTable<models.Clients, models.Client>{
        constructor() { super('Clients'); }
        GetType() { return models.Clients; }
    }
    export class SMSs extends DataTable<models.SMSs, models.SMS>{
        constructor() { super('SMSs'); this.ERegister(net.WebRequestMethod.Get, "UPDATE", "@param", false);}
        GetType() { return models.SMSs; }
    }
    export class Projets extends DataTable<models.Projets, models.Projet>{
        constructor() {
            super('Projets');
        }
        GetType() { return models.Projets; }
    }
    export class FakePrice extends DataRow<models.FakePrice>{
        constructor() { super("FakePrice"); }
        GetType() { return models.FakePrice; }
    }
    export class Price extends DataRow<models.Price>{
        constructor() { super("Price"); }
        GetType() { return models.Price; }
    }
    export class Mail extends DataRow<models.Mail>{
        constructor() { super("Mail"); }
        GetType() {
            return models.Mail;
            
        }
    }

    export class Facture extends FactureBase<models.Facture>{
        constructor() {
            super("Facture");
            this.ERegister(net.WebRequestMethod.Create, 'CREATE', "CId=@CId&Type=@Type&Abonment=@Abonment&TType=@Transaction", false);
        }
        GetType() { return models.Facture; }
    }
    export class SFacture extends FactureBase<models.SFacture>{
        constructor() {
            super("SFacture");
            this.ERegister(net.WebRequestMethod.Create, 'CREATE', "FId=@FId&AId=@AId&Type=@Type&TType=@Transaction", false);
        }
        GetType() { return models.SFacture; }
    }
    export class Factures extends DataTable<models.Factures, models.Facture>{
        constructor() {
            super('Factures');
            this.ERegister(net.WebRequestMethod.Set, 'FREEZED', "Freezed=@Freezed", true);
            this.ERegister(net.WebRequestMethod.Get, 'LOADFREEZED', "Freezed=true&csv=@csv", true);
        }
        GetType() { return array_Facture; }
    }


    export class Command extends DataRow<models.Command>{
        constructor() {
            super("Command");
            this.ERegister(net.WebRequestMethod.Create, 'CREATE', "date=@Date", false);
            this.ERegister(net.WebRequestMethod.Get, 'OPEN', "operation=OPEN&Id=@Id", false);
            this.ERegister(net.WebRequestMethod.Get, 'CLOSE', "operation=CLOSE&Id=@Id", false);
            this.ERegister(net.WebRequestMethod.Get, 'GETARTICLES', "operation=GETARTICLES&Id=@Id", false);
            this.ERegister(net.WebRequestMethod.Get, "UPDATEDC", "", false);
            this.ERegister(net.WebRequestMethod.Print, "PRINT", "", false);
        }
        GetType() { return models.Command; }
    }
    export class Commands extends DataTable<models.Commands, models.Command>{
        constructor() { super('Commands'); }
        GetType() { return models.Commands; }
    }


    export class CArticle extends DataRow<models.CArticle>{
        constructor() {
            super("CArticle");
        }
        GetType() { return models.CArticle; }
    }
    export class CArticles extends DataTable<models.CArticles, models.CArticle>{
        constructor() {
            super('CArticles');
            this.ERegister(net.WebRequestMethod.Get, "UPDATEDC", "", false);
        }
        GetType() { return models.CArticles; }

    }



    export class Logins extends DataTable<models.Logins, models.Login>{
        constructor() { super('Users'); }
        GetType() { return models.Logins; }
    }

    export class Article extends DataRow<models.Article>{
        constructor() {
            super("Article"); }
        GetType() { return models.Article; }
    }
    export class Articles extends DataTable<models.Articles, models.Article>{
        constructor() { super('Articles'); }
        GetType() { return array_Article; }
    }


    export class Agent extends DataRow<models.Agent>{
        constructor() {
            super('Agent'); }
        GetType() { return models.Agent; }
    }
    export class Agents extends DataTable<models.Agents, models.Agent>{
        constructor() { super('Agents'); }
        GetType() { return array_Agent; }
    }

    export class Versment extends DataRow<models.Versment>{
        constructor() {
            super("Versment");
        }
        GetType() { return models.Versment; }
    }
    export class Versments extends DataTable<models.Versments, models.Versment>{
        constructor() {
            super('Versments');
            this.ERegister(net.WebRequestMethod.Get, "VFacture", "q=Facture&Facture=@Id", false);
            this.ERegister(net.WebRequestMethod.Get, "VClient", "q=Client&Client=@Id", false);
            this.ERegister(net.WebRequestMethod.Get, "VPeriod", "q=Period&From=@From&to=@To", false);
            this.ERegister(net.WebRequestMethod.Get, "VCassier", "q=Cassier&Cassier=@Id", false);
            this.ERegister(net.WebRequestMethod.Get, "VObservation", "q=Observation&Observation=@Observation", false);
            this.ERegister(net.WebRequestMethod.Get, "Facture.Total", "q=Facture&Facture=@Id&total", false);
        }
        GetType() { return models.Versments; }
    }
    export class SVersment extends DataRow<models.SVersment>{
        constructor() {
            super("SVersment"); }
        GetType() { return models.SVersment; }
    }
    export class SVersments extends DataTable<models.SVersments, models.SVersment>{
        constructor() {
            super('SVersments');

            this.ERegister(net.WebRequestMethod.Get, "VFacture", "q=Facture&Facture=@Id", false);
            this.ERegister(net.WebRequestMethod.Get, "VFournisseur", "q=Fournisseur&Fournisseur=@Id", false);
            this.ERegister(net.WebRequestMethod.Get, "VPeriod", "q=Period&From=@from&to=@to", false);
            this.ERegister(net.WebRequestMethod.Get, "VCassier", "q=Cassier&Cassier=@Id", false);
            this.ERegister(net.WebRequestMethod.Get, "VObservation", "q=Observation&Observation=@Observation", false);
            this.ERegister(net.WebRequestMethod.Get, "Facture.Total", "q=Facture&Facture=@Id&total", false);
        }
        GetType() { return models.SVersments; }
    }
    
    export class Costumers extends DataTable<models.Costumers, models.Client>{
        constructor() { super('Costumers'); }
        GetType() { return models.Costumers; }
    }

    export class Category extends DataRow<models.Category>{
        constructor() {
            super("Category"); }
        GetType() { return models.Category; }
    }
    export class Categories extends DataTable<models.Categories, models.Category>{
        constructor() { super('Categories'); }
        GetType() { return array_Category; }
    }

    export class Picture extends DataRow<models.Picture>{
        constructor() {
            super('Picture'); }
        GetType() { return models.Picture; }
    }
    export class Pictures extends DataTable<models.Pictures, models.Picture>{
        constructor() { super('Pictures'); }
        GetType() { return array_Picture; }
    }
    export class SFactures extends DataTable<models.SFactures, models.SFacture>{
        constructor() { super('SFactures'); }
        GetType() { return models.SFactures; }
    }
    export class EtatTransfers extends DataTable<models.EtatTransfers, models.EtatTransfer>{
        constructor() { super('EtatTransfers'); }
        GetType() { return models.EtatTransfers; }
    }
    
    export class Settings extends DataRow<any>{
        constructor() {
            super("Settings");
            this.ERegister(net.WebRequestMethod.Get, "START", null, false);
            this.ERegister(net.WebRequestMethod.Post, "BACKUP", null, false);
            this.ERegister(net.WebRequestMethod.Put, "RESTORE", null, false);
        }
        GetType() { return Window; }
    }
    export class Tickets extends DataRow<any>{
        constructor() {
            super("Tickets");
            this.ERegister(net.WebRequestMethod.Print, "PRINT", null, true);
            

        }
        GetType() { return models.Tickets; }
    }
    export class Print extends DataRow<any> {
        public GetType() { return Printing.PrintData; }
        constructor() {
            super("Print");
            this.ERegister(net.WebRequestMethod.Get, "MODELS", "HandlerId=@HandlerId", false);
            this.ERegister(net.WebRequestMethod.Print, "PRINT", null, true);
        }
    }
    export class UUID extends Controller.Api<string> {
        private static req = new net.RequestUrl('/~NewGuid', null, null, net.WebRequestMethod.Get, false);
        public GetType() {
            return 0;
        }
        public GetRequest(data: string, shema: string | net.WebRequestMethod | net.RequestMethodShema, params: net.IRequestParams): net.RequestUrl {
            UUID.req.Url = __global.GetApiAddress('/~NewGuid')
            return UUID.req;
        }
        public OnResponse(response: JSON, data: string, context: encoding.SerializationContext) {
            return new basic.iGuid(data);
        }
    }
    export class Statistics extends DataRow<models.Statstics>{
        public GetType() { return models.Statstics; }
        addQuestionMark() { return false; }
        constructor() {
            super('statistics', false, true, true);
            this.ERegister(net.WebRequestMethod.Get, 'out', '/@method?from=@from&to=@to&pid=@pid&cid=@cid', false);
            this.ERegister(net.WebRequestMethod.Get, 'methods', '?methods', false);
            this.ERegister(net.WebRequestMethod.Get, 'params', '?method=@method', false);

        }
    }
    export function Load() {
        new Client, new Users, new Product, new Products, new Facture, new Factures, new Article, new Articles, new Agent, new Agents, new Versment, new Versments, new Category, new Categories, new Picture, new Pictures,
            new Login, new Signout, new FakePrice, new Clients, new Costumers, new Signup, new Logins(), new Categories, new FakePrices, new SFactures, new Tickets
            , new SFacture(), new SVersment, new SVersments, new Fournisseur, new Fournisseurs, new Guid, new Message, new IsAdmin(), new Price(), new EtatTransfers(), new Settings, new SessionId(), new Print(), new LoginO, new Mail, new Mails, new Projet, new Projets, new IsSecured, new CArticle, new CArticles, new Command, new Commands, new UserSetting,new SMS,new SMSs,new Statistics
    };
}