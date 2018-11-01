import { UI } from '../../lib/Q/sys/UI';
import { basic } from '../../lib/Q/sys/corelib';
import { models } from '../Models';
import { MyApi, EMyApi, DBCallback, APIEventArgs, APIEventHandler } from '../extra/AdminApis';
import { basics } from '../extra/Basics';
import { sdata } from '../../lib/q/sys/System';


export class Product extends EMyApi<models.Product, models.Products> {
    protected GetArrayType() {
        return models.Products;
    }
    protected GetArgType() {
        return models.Product;
    }
    public SmartUpdate(date?: Date) {
        this._vars.requester.Request(models.Products, "SUPDATE", null, { Date: (date && date.toLocaleString()) || "12/12/2016" });
    }
    
    constructor(vars: basics.vars) {
        super(vars, 'iProduct.edit');
    }
    getDefaultList() { return this._vars.__data.Products; }

}
