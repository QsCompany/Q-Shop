import { UI } from "../../sys/UI";
import { bind, basic } from "../../sys/Corelib";
export declare namespace Material {
    interface OrderMap {
        factorHandled?: boolean;
        factor: number;
        lastStat: any;
    }
    interface OrderByEventArgs<This> {
        sender: This;
        orderBy: string;
        col: UI.help.IColumnCellHeaderDef;
        view: HTMLTableHeaderCellElement;
        state: OrderMap;
        previous?: OrderByEventArgs<This>;
    }
    class HeavyTable<T> extends UI.ListAdapter<T, any> {
        private cols;
        Rebound: boolean;
        visibleCols: number[];
        private Controller;
        constructor(cols: UI.help.IColumnTableDef[]);
        initialize(): void;
        protected OnCompileEnd(cnt: bind.Controller): void;
        setName(name: string, dom: HTMLElement, cnt: UI.JControl, e: bind.IJobScop): void;
        OnOrderBy(sender: this, orderBy: string, col: UI.help.IColumnCellHeaderDef, view: HTMLTableHeaderCellElement): void;
        currentOrderMap: OrderByEventArgs<this>;
        private _orderHandler;
        private orderMap;
        setOrderHandler<Owner>(handler: basic.ITBindable<(e: OrderByEventArgs<this>) => void>): void;
        private endEdit(save);
        private beginEdit();
        edit(currentElement: HTMLTableDataCellElement): boolean;
        readonly EOF: boolean;
        OnKeyDown(e: KeyboardEvent): boolean;
        _x: number;
        _y: number;
        oldInnerText: any;
        private x;
        private ColCount();
        private y;
        private stat;
        private _selectedCell;
        setXY(x: number, y: number): boolean;
        private isfocussed;
        private getStat();
        getCurrentCell(): HTMLTableDataCellElement;
        selectCell(): HTMLTableDataCellElement;
        deselectCell(): void;
        private editCell;
        static ctor(): void;
    }
}
