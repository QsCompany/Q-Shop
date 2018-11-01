import { bind } from "./../../sys/Corelib";
import { UI } from './../../sys/UI';
export declare class Replit {
    static url: string;
    auth: {
        "command": string;
        "data": string;
    };
    select: {
        "command": string;
        "data": string;
    };
    ws: WebSocket;
    private stat;
    constructor();
    send(data: any): void;
    _onopen(t: WebSocket, e: any): void;
    _onclose(t: WebSocket, e: any): void;
    _onmessage(t: WebSocket, e: Event): void;
    OnMessage(): void;
}
export declare module Material {
    class StrechyButton extends UI.TControl<StrechyButton> {
        private _Title;
        private _Items;
        private _Trigger;
        constructor();
        setName(name: string, dom: HTMLElement, cnt: UI.JControl, e: bind.IJobScop): void;
        initialize(): void;
        OnCompileEnd(): void;
        handleEvent(event: Event): void;
        static ctor(): void;
    }
}
export declare class Css {
    private style;
    private sheet;
    static create(): HTMLStyleElement;
    constructor(style: HTMLLinkElement | HTMLStyleElement);
    add(selector: any): void;
}
