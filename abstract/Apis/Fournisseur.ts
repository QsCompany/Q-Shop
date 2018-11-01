import { UI } from '../../lib/Q/sys/UI';
import { basic } from '../../lib/Q/sys/corelib';
import { models } from '../Models';
import { MyApi, EMyApi, DBCallback, APIEventArgs, APIEventHandler } from '../extra/AdminApis';
import { basics } from '../extra/Basics';
import { sdata } from '../../lib/q/sys/System';

export class Fournisseur extends EMyApi<models.Fournisseur, models.Fournisseurs> {
    protected GetArrayType() {
        return models.Fournisseurs;
    }
    protected GetArgType() {
        return models.Fournisseur;
    }
    getDefaultList() { return this._vars.__data.Fournisseurs; }
    constructor(_vars: basics.vars) {
        super(_vars, 'Fournisseur.edit', {
            templateName: "Fournisseur.table",
            itemTemplateName: null
        });
    }
}