import { UI } from '../../lib/Q/sys/UI';
import { basic, encoding } from '../../lib/Q/sys/corelib';
import { models } from '../Models';
import { MyApi, EMyApi,DBCallback, APIEventHandler } from '../extra/AdminApis';
import { basics } from '../extra/Basics';
import { sdata, Controller } from '../../lib/Q/sys/System';
import { context } from 'template|*';


export class Agent extends EMyApi<models.Agent, models.Agents> {
    protected GetArrayType() {
        return models.Agents;
    }
    protected GetArgType() {
        return models.Agent;
    }
    
    
    getDefaultList() { return this._vars.__data.Agents; }
    constructor(_vars: basics.vars) {
        super(_vars, 'Agent.edit', {
            templateName: "Agents.table",
            itemTemplateName: null
        });
    }


}


export class SMS extends EMyApi<models.SMS, models.SMSs> {
    Check(data: models.SMS, callback?: APIEventHandler<models.SMS, models.SMSs>) {
        var e = basic.DataStat.Success;
        if (data.To == null) e = basic.DataStat.DataCheckError;
        else if (!data.Title && !data.Message) e = basic.DataStat.DataCheckError;
        else if (data.To == this._vars.user.Client) e = basic.DataStat.DataCheckError;
        else if (data.To == data.From) e = basic.DataStat.DataCheckError;
        callback && callback({ Api: this, Data: data, Error: e });
    }
    protected GetArrayType() {
        return models.SMSs;
    }
    protected GetArgType() {
        return models.SMS;
    }


    getDefaultList() { return this._vars.__data.SMSs; }
    constructor(_vars: basics.vars) {
        super(_vars, 'SMS.edit'
            //, {
            //templateName: "Agents.table",
            //itemTemplateName: null
            //}
        );
    }
    Update(_data?: models.SMS | models.SMSs,tag?:string) {
        if (_data instanceof sdata.DataRow) return super.Update(_data);
        this._vars.requester.Request(models.SMSs, "Update", _data, { param: tag || _data.Tag }, (pcall, json, iss, req) => {
            if (iss)
                _data.Clear();
            _data.FromCsv(req.Response, encoding.SerializationContext.GlobalContext.reset());
        });
    }
    
    SaveProperty(_data: models.SMS, properties: {[s:string]:number|null|string|boolean|Array<any>}, callback: Controller.RequestCallback<models.SMS>) {
        this._vars.requester.Request(_data.getType(), "SetProperty", properties as any, { Id: _data.Id }, callback);
    }
}