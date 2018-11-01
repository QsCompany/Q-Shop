import { bind, collection } from "./../../sys/Corelib";
import { UI } from './../../sys/UI';
import { Material as side } from './../QSidebar/script';
export declare module Material {
    interface IMenuitem {
        Title: string;
        Data: any;
    }
    interface ICard extends IMenuitem {
        Icon?: string;
    }
    class App extends UI.Layout<UI.Page> {
        readonly IsAuthentication: boolean;
        private Controller;
        Foot: UI.ServiceNavBar<UI.IItem>;
        SearchBox: UI.ActionText;
        protected showPage(page: UI.Page): void;
        OnKeyDown(e: KeyboardEvent): void;
        protected Check(child: UI.Page): boolean;
        private _getView(data?);
        private static _getView();
        constructor();
        private _sideMenu;
        private _body;
        static DPCategories: bind.DProperty<App, collection.List<IMenuitem>>;
        static DPFastLinks: bind.DProperty<App, collection.List<IMenuitem>>;
        static DPSuggestions: bind.DProperty<App, collection.List<ICard>>;
        static DPLogo: bind.DProperty<App, string>;
        private _pages;
        private _txt_search;
        private _navigationWrapper;
        private _navigation;
        private _searchForm;
        private _closeSuggetions;
        private _pageContent;
        private _searchTrigger;
        private _coverLayer;
        private _navigationTrigger;
        private _mainHeader;
        private searchWrapper;
        private Suggestions;
        private appTemplate;
        private _content;
        private _menu;
        private IsCompiled();
        Content: UI.JControl;
        private setContent(t);
        Menu: side.SideNav;
        handleEvent(event: Event): void;
        setName(name: string, dom: HTMLElement, cnt: UI.JControl, e: bind.IJobScop): void;
        private onSearch();
        toggleSearchForm(close?: boolean): boolean;
        static navbarFixedBottomHeightName: string;
        private mainRule;
        private NFBHeight;
        css(el: Element): any[];
        static links: HTMLLinkElement[];
        static BlackAppRule: CSSStyleRule;
        initialize(): void;
        protected OnCompileEnd(cnt: bind.Controller): void;
        checkResize(): void;
        checkWindowWidth(): string;
        moveNavigation(): void;
        resizing: boolean;
        static ctor(): void;
        CloseMenu(): void;
        OpenMenu(): void;
        readonly IsMenuOpen: boolean;
        static __fields__(): any;
    }
}
