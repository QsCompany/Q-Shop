export declare function init(): void;
export declare namespace Base64 {
    function byteLength(b64: any): number;
    function toByteArray(b64: any): any[] | Uint8Array;
    function fromByteArray(uint8: any): string;
}
export declare namespace IEEE754 {
    function read(buffer: any, offset: any, isLE: any, mLen: any, nBytes: any): number;
    function write(buffer: any, value: any, offset: any, isLE: any, mLen: any, nBytes: any): void;
}
