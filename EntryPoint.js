/// <reference path="./lib/qloader.d.ts" />
var ua = navigator.userAgent;
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
var device = detectmob() ? 'Mobile' : 'Desktop';
window.addEventListener('load', function () {
    var min = parseFloat("0")===2 ? '.min' : '';
    function load() {
        define('qshop', ['require', `lib:q|./lib/q/InfiniteJs${min}.js`], (require,q) => {
            require(`e-shop${min}.js`, (e) => {
                require(`./${device}/Main`, function (app) {
                    app.initialize();
                });
            });
        });
    }
    if (navigator.serviceWorker)
        navigator.serviceWorker.register(`./lib/q/assets/modules/sw${min}.js`, { scope: "/" }).then(reg => {
            console.log("SW registration succeeded. Scope is " + reg.scope);
            load();
        }).catch(err => { console.error("SW registration failed with error " + err); load(); });
    else
        load();
    console.clear();
});