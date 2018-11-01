import * as x from 'json|./data.json';
import { UI } from '../../lib/Q/sys/UI';

export var data = { value: x.value as dataType, require: x.require };

export interface IPropertyType {
    def: UI.help.IColumnTableDef[];
    visibleCol: number[];
}
interface dataType {
    CommandDef: IPropertyType;
    ProductStatDef: IPropertyType;
    ProductStatDef1: IPropertyType;
    ticketTableDef: IPropertyType;
    clientTable: IPropertyType;
    fournisseurTable: IPropertyType;
    factureAchatTable: IPropertyType;
    factureVenteTable: IPropertyType;
    smsTable: IPropertyType;
    FilePermissionsTable: IPropertyType
}
