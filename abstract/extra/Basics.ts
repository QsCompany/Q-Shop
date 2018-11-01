import { models } from "../../abstract/Models";
import { bind, collection, basic, Api } from "../../lib/Q/sys/Corelib";
import { Controller } from "../../lib/Q/sys/System";
import { UI } from "../../lib/Q/sys/UI";
import { db } from "../../lib/Q/sys/db";
import { ShopApis } from "./ShopApis";


export namespace basics {
    export interface vars {
        __data: models.QData;
        modify: bind.Scop;
        user: models.Login;
        requester: Controller.ProxyData;
        invalidateFactures: collection.List<models.Facture>;
        invalidateLogins: collection.List<models.Login>;
        validateLogins: collection.List<models.Login>;
        mails: collection.List<models.Mail>;
        spin: UI.Spinner;
        apis: ShopApis;
        db: db.Database;
    }
    export var DataStat = basic.DataStat;
}