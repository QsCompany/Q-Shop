import { UI } from '../../lib/Q/sys/UI';
import { basic } from '../../lib/Q/sys/corelib';
import { models } from '../Models';
import { MyApi, EMyApi, DBCallback, APIEventArgs, APIEventHandler, dateToUTC } from '../extra/AdminApis';
import { basics } from '../extra/Basics';
import { sdata } from '../../lib/q/sys/System';


export class Revage extends EMyApi<models.FakePrice, models.FakePrices> {
    protected GetArrayType() {
        return models.FakePrices;
    }
    protected GetArgType() {
        return models.FakePrice;
    }
    protected NativeCreateItem(id: number): models.FakePrice {
        return new models.FakePrice(id);
    }
    Check(data: models.FakePrice, callback: APIEventHandler<models.FakePrice, models.FakePrices>) {
        var d = true;
        if (data.Product == null) d = false;
        if (data.PSel > data.Value) d = false;
        else {
            if (data.Value > data.PValue) data.PValue = data.Value;
            if (data.PValue > data.HWValue) data.HWValue = data.PValue;
            if (data.HWValue > data.WValue) data.WValue = data.HWValue;
        }        
        this.callback(callback, data, d);
    }

    constructor(_vars: basics.vars) {
        super(_vars, 'Price.edit');
    }
    getDefaultList() {
        return void 0;
        //return this._vars.__data.Prices;
    }
}