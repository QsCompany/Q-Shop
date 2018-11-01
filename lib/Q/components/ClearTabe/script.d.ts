import { UI } from "../../sys/UI";
import { bind } from "../../sys/Corelib";
export declare class ClearTable extends UI.ListAdapter<any, any> {
    private cols;
    private Controller;
    private _tbl_head;
    private _tbl_rows;
    private _templateRoot;
    constructor(cols: UI.help.IColumnTableDef[]);
    protected OnCompileEnd(cnt: bind.Controller): void;
    setName(name: string, dom: HTMLElement, cnt: UI.JControl, e: bind.IJobScop): void;
    static ctor(): void;
}
export declare var counter: number;
export declare function test(): ClearTable;
