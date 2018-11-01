/// <reference path="../lib/qloader.d.ts" />
// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397705
// To debug code on page load in cordova-simulate or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
"use strict";
import { /*initialize as init,*/ECommon, controls } from '../Mobile/Core';
//import { initialize as init } from './App/QShopApp';
import { net, basic, encoding, bind } from '../lib/q/sys/Corelib';
import { Apis } from '../abstract/QShopApis';
import { Common, resources } from '../Mobile/Resources';
import { Controller } from '../lib/q/sys/System';
import { Pages } from '../Mobile/Pages/Home';
import { UI } from '../lib/q/sys/UI';
Apis.Load();

export class Teta implements Common.ITeta {
    Setting: controls.Settings;
    Auth: controls.AuthApp;
    App: controls.EMobileApp;

    constructor() {
        this.Setting = new controls.Settings(this as any);
        this.Auth = new controls.AuthApp(this as any);
        this.App = new Pages.App(this as any);
        UI.Spinner.Default.Pause();
        this.Setting.Show();
    }
}

export function initialize(): void {
    setTimeout(() => {
        new Teta();
    }, 0);
}