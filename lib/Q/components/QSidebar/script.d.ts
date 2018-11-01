import { basic } from "./../../sys/Corelib";
import { UI } from '../../sys/UI';
import { Material as Qui } from '../QUI/script';
export declare module Material {
    interface INavItem {
        Title: string;
        Badge: string | number;
        Icon?: string;
        Data?: any;
    }
    interface IGroupNavItem extends INavItem {
        mode?: 'pop' | 'sub';
        Children: INavItem[];
    }
    abstract class SideNavItem extends UI.JControl {
        item: INavItem;
        private anchore;
        private badge;
        private children;
        protected initialize(): void;
        static ctor(): void;
        constructor(item: INavItem);
        private buildBadge();
        private buildChildren();
        OnSelected: basic.ITBindable<(snItems: SideNavItem[]) => void>;
        abstract OnChildSelected(nitems: SideNavItem[]): any;
        handleEvent(e: Event): boolean | void;
        private _isActive;
        IsActive: boolean;
    }
    interface ISideNavData {
        Title: string;
        Items: INavItem[];
        Data?: any;
    }
    class SideNav extends UI.JControl {
        private data;
        constructor(data: ISideNavData[]);
        initialize(): void;
        OnChildSelected(nitems: SideNavItem[]): void;
        private buildChild(data);
        private currentItems;
        private OnItemSelected(items);
    }
}
export declare var counter: number;
export declare function test(): {
    app: Qui.App;
    container: UI.Dom;
    menu: any;
    canvas: any;
};
