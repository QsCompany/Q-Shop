// https://codyhouse.co Sites for good controls
import { UI } from '../lib/Q/sys/UI';
import { Jobs } from '../lib/Q/sys/Jobs';
import { mvc, thread } from '../lib/Q/sys/Corelib';
import { Init as mvInit } from '../Desktop/ModelsViews';
import { Init } from '../Desktop/Apps';

mvInit();

export function Main() {
    mvc.Initializer.Instances.
        then((p: mvc.Initializer) => thread.Dispatcher.call(Init, Init.Main, UI.Desktop.Current));
}
var load = false;
export function initialize() {
    if (load) return;
    thread.Dispatcher.call(null, _load);
}
function _load() {
    if (load) return;
    
    load = true;
    Jobs.Load();
    Main();
}
//asyncLoad();