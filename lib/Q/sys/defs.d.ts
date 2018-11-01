import { bind } from './Corelib';
import { UI as _UI } from './UI';
export declare module defs {
    namespace UI {
        interface IPage extends _UI.JControl, _UI.IService {
            Name: string;
            HasSearch: _UI.SearchActionMode;
            OnSearche(o?: string, n?: string): any;
            OnDeepSearche(): any;
            OnContextMenu(e: MouseEvent): any;
            OnPrint(): any;
            OnSelected: bind.EventListener<(p: this) => void>;
            Update(): any;
            OnKeyDown(e: KeyboardEvent): any;
            ContextMenu?: _UI.ContextMenu;
        }
        interface IApp extends _UI.JControl {
            Name: string;
            SearchBox: _UI.ActionText;
            Foot: _UI.ServiceNavBar<_UI.IItem>;
            Update(): any;
            OnContextMenu(e: MouseEvent): any;
            OnKeyDown(e: KeyboardEvent): any | void;
            OnPrint(): any;
            OnDeepSearche(): any;
            OpenPage(pageNme: string): any;
            Logout(): any;
            Open(page: IPage): any;
            AddPage(child: IPage): any;
            Show(): any;
            SelectedPage: IPage;
            SelectNaxtPage(): any;
            SelectPrevPage(): any;
            CloseModal(m: _UI.Modal): any;
            OpenModal(m: _UI.Modal): any;
            CurrentModal: _UI.Modal;
            IsAuthentication: boolean;
            OpenContextMenu<T>(cm: _UI.IContextMenu<T>, e: _UI.IContextMenuEventArgs<T>): boolean;
            CloseContextMenu<T>(r?: T): any;
        }
        interface IAuthApp extends IApp {
            IsLogged<T>(callback: (v: boolean, param: T) => void, param: T): any;
            RedirectApp: IApp;
            OnStatStatChanged: bind.EventListener<(auth: this, isLogged: boolean) => void>;
        }
    }
}
