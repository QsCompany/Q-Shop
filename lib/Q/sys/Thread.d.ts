export declare namespace Workers {
    namespace WebWorker {
        interface IMessageAction {
            Id: number;
            Handler: string;
            Data: any;
        }
        interface IMessageResult {
            Id: number;
            IsError?: boolean;
            Data?: any;
            keepAlive: boolean;
        }
        interface MessageEventArgs {
            e: MessageEvent;
            Msg: IMessageAction;
            Handled: boolean;
            Result: any;
            Error?: boolean;
            Thread: Server;
            keepAlive?: boolean;
        }
        interface ThreadPacket {
            handler: string;
            data: any;
            callback(owner: ThreadPacket, data: IMessageResult): void;
            Id: number;
        }
        function registerHandler(name: string, handler: (e: MessageEventArgs) => any): boolean;
        function getHandler(name: string): false | ((e: MessageEventArgs) => any);
        function unregisterHandler(name: string): boolean;
        class Server {
            private _worker;
            constructor();
            Start(): void;
            private _onerror(e);
            private _onmessage(e);
            private _onHandlerError(e, v);
            postMessage(data: IMessageResult, targetOrigin?: string, transfers?: any[], ports?: MessagePort[]): void;
            private onPostMessageError;
            static Default: Server;
            static Start(): void;
        }
        class Client {
            private _url;
            private _worker;
            private _quee;
            private static counter;
            constructor(_url: string);
            Start(): void;
            Send(packet: ThreadPacket): void;
            private _onmessage(e);
            private _onerror(e);
        }
    }
}
export declare class ServiceWorker {
    static Start(url: string, scope: string): Promise<void>;
    static postMessageToSW(data: Workers.WebWorker.IMessageAction): Promise<{
        Action: Workers.WebWorker.IMessageAction;
        Result: Workers.WebWorker.IMessageResult;
    }>;
}
