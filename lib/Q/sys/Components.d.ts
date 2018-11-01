import { UI } from "./UI";
import { bind, collection } from "./corelib";
export declare namespace Components {
    class MdTextbox<T> extends UI.JControl {
        Label: string;
        Value: T;
        private _input;
        private _label;
        private _isChanging;
        _hasValue_(): boolean;
        _OnValueChanged(e: bind.EventArgs<any, this>): void;
        OnLabelChanged(e: bind.EventArgs<string, this>): void;
        constructor(_view?: HTMLElement);
        private createElemnt(tag, _class?);
        initialize(): void;
        handleEvent(e: Event): void;
        private onInputChanged(e);
        Type: string;
        private _auto;
        InputBox: UI.Input;
        readonly AutoCompleteBox: UI.ProxyAutoCompleteBox<T>;
        Suggestions: collection.List<T>;
        OnSuggesionsChanged(e: bind.EventArgs<collection.List<T>, this>): void;
    }
    interface MenuItem {
        type: string;
        nonSelectable: boolean;
    }
    interface MdMenuItem extends MenuItem {
        type: 'menu-item';
        iconName: string;
        label: string;
        commandName: string;
        control?: UI.JControl;
    }
    interface Separator extends MenuItem {
        type: 'separator';
        nonSelectable: false;
    }
    interface Label extends MenuItem {
        type: 'label';
        value: string;
        nonSelectable: false;
    }
    interface MdIconGroupItem {
        iconName: string;
        commandName: string;
    }
    interface IconGroup extends MenuItem {
        type: 'icongroup';
        value: MdIconGroupItem[];
    }
    class MdIconGroup extends UI.ListAdapter<MdIconGroupItem, any> implements UI.ITemplateShadow {
        private _data;
        setDataContext(data: IconGroup): void;
        getDataContext(): IconGroup;
        constructor();
        initialize(): void;
    }
    class ContextMenuTemplate extends UI.Template {
        private static _labelTemplate;
        private static _menuItemTemplate;
        private static store;
        private garbage;
        private static readonly EmptyArray;
        static ctor(): void;
        CreateShadow<T>(data: T | bind.Scop, cnt: UI.JControl): UI.TemplateShadow;
        CacheTemplateShadow(item: MenuItem, child: UI.TemplateShadow): void;
        constructor();
    }
    class MdContextMenu extends UI.ListAdapter<MenuItem, any> implements UI.IContextMenu<MenuItem> {
        OnClosed(result: MenuItem, e: UI.IContextMenuEventArgs<MenuItem>): boolean;
        getView(): UI.JControl;
        ItemsSource: collection.List<MdMenuItem | Separator | Label>;
        static ctor(): void;
        constructor(items?: MenuItem[]);
        protected getItemShadow(item: MenuItem, i: number): any;
        private OnIconGroupItemCliced(e);
        protected disposeItemShadow(item: MenuItem, child: UI.TemplateShadow, i: number): UI.TemplateShadow;
        protected disposeItemsShadow(items: MenuItem[], childs: UI.TemplateShadow[]): void;
        initialize(): void;
        getTarget(): UI.JControl;
        private _revalidate(e);
        OnAttached(e: UI.IContextMenuEventArgs<MenuItem>): void;
        OnItemClicked(s: UI.TemplateShadow, e: Event, t: UI.ListAdapter<MenuItem, MenuItem>): void;
    }
}
