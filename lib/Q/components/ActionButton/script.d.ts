import { UI } from "../../sys/UI";
import { collection, bind } from "../../sys/Corelib";
export declare namespace components {
    class ActionButton<T> extends UI.JControl {
        static __fields__(): bind.DProperty<any, ActionButton<any>>[];
        static DPSource: bind.DProperty<collection.List<any>, ActionButton<any>>;
        static DPValue: bind.DProperty<any, ActionButton<any>>;
        Value: T;
        Source: collection.List<T>;
        Caption: UI.Label;
        Box: UI.Input;
        AutocompleteBox: UI.ProxyAutoCompleteBox<T>;
        constructor();
        initialize(): void;
        OnSourceChanged(e: bind.EventArgs<collection.List<T>, this>): void;
        OnValueChanged(box: UI.IAutoCompleteBox, oldValue: T, newValue: T): void;
    }
}
