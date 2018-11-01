import { UI } from '../../lib/Q/sys/UI';
import { basic } from '../../lib/Q/sys/corelib';
import { models } from '../Models';
import { MyApi, EMyApi, DBCallback, APIEventArgs, APIEventHandler } from '../extra/AdminApis';
import { basics } from '../extra/Basics';
import { sdata, Controller } from '../../lib/q/sys/System';



export class FakePrice1 extends EMyApi<models.FakePrice, models.FakePrices> {
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
        this.callback(callback, data, (data && data.Product) != null);
    }

    constructor(_vars: basics.vars) {
        super(_vars, 'FakePrice.edit');
    }
    getDefaultList() {
        return this.d;
    }
    private d = new models.FakePrices(null);
}