import * as context from 'context';
function detectmob() {
    return (navigator.userAgent.match(/Android/i)
        || navigator.userAgent.match(/webOS/i)
        || navigator.userAgent.match(/iPhone/i)
        || navigator.userAgent.match(/iPad/i)
        || navigator.userAgent.match(/iPod/i)
        || navigator.userAgent.match(/BlackBerry/i)
        || navigator.userAgent.match(/Windows Phone/i)
    );
}
var isMobole = detectmob();
var device = !detectmob() ? 'mobile/' : 'desktop/';

context.SetSuperVisor(url => {
    var p = url.FullPath.toLowerCase();
    if (isMobole) {
        if (p.indexOf(device) === 0 || p.indexOf("apps/") == 0 || p.indexOf('idea/') == 0 || p.indexOf('componenets') == 0) return true;
    } else {
        if (p.indexOf(device) === 0) return true;
    }
    
    return  false;
});