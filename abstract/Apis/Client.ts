import { UI } from '../../lib/Q/sys/UI';
import { basic, net } from '../../lib/Q/sys/corelib';
import { models } from '../Models';
import { MyApi, EMyApi, DBCallback, APIEventArgs, APIEventHandler } from '../extra/AdminApis';
import { basics } from '../extra/Basics';
import { sdata } from '../../lib/q/sys/System';

export class Client1 extends EMyApi<models.Client, models.Costumers> {
    GetMyId(e: APIEventHandler<models.Client, models.Costumers>): any {
        var client = this._vars.user.Client;
        this._vars.requester.Request(models.Client, net.WebRequestMethod.Get, client, { GetMyId: true }, (cll, json, iss) => {
            this.callback(e, client, iss);
        });
    }
    protected GetArrayType() {
        return models.Clients;
    }
    protected GetArgType() {
        return models.Client;
    }
    constructor(_vars: basics.vars) {
        super(_vars, 'Client.edit', {
            templateName: "Client.table1",
            itemTemplateName: null
        });
    }
    getDefaultList() { return this._vars.__data.Costumers; }

}