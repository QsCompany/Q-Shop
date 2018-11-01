import { UI } from '../../lib/Q/sys/UI';
import { basic } from '../../lib/Q/sys/corelib';
import { models } from '../Models';
import { MyApi, EMyApi, DBCallback, APIEventArgs, APIEventHandler } from '../extra/AdminApis';
import { basics } from '../extra/Basics';
import { sdata } from '../../lib/q/sys/System';


export class Projet extends EMyApi<models.Projet, models.Projets> {
    protected GetArrayType() {
        return models.Projets;
    }
    protected GetArgType() {
        return models.Projet;
    }
    constructor(_vars: basics.vars) {
        super(_vars, 'Projet.edit', {
            templateName: "Projet.table1",
            itemTemplateName: null
        });
    }
    getDefaultList() { return this._vars.__data.Projets; }

}