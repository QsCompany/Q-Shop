import { UI } from '../../lib/Q/sys/UI';
import { basic } from '../../lib/Q/sys/corelib';
import { models } from '../Models';
import { MyApi, EMyApi, DBCallback, APIEventArgs, APIEventHandler } from '../extra/AdminApis';
import { basics } from '../extra/Basics';
import { sdata } from '../../lib/q/sys/System';



export class Category extends EMyApi<models.Category, models.Categories> {
    protected GetArrayType() {
        return models.Categories;
    }
    protected GetArgType() {
        return models.Category;
    }
    Check(data: models.Category, callback: APIEventHandler<models.Category, models.Categories>) {
        this.callback(callback, data, data.Name != null && data.Name.trim() != '');
    }
    constructor(vars: basics.vars) {
        super(vars, 'Category.edit');
    }
    getDefaultList() { return this._vars.__data.Categories; }
}