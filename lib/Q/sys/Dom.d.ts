export declare module Dom {
    function offset(f: Element): {
        top: number;
        left: number;
    };
    function elementInViewport(el: HTMLElement): boolean;
    function elementEntirelyInViewport(el: HTMLElement): boolean;
}
