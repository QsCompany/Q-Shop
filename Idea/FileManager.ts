import { template } from "template|../assets/templates/FileManager.html";
import { basics } from "../abstract/extra/Basics";
import { GetVars, funcs } from "../abstract/extra/Common";
import { context, NameOf } from 'context';
import { filters } from "../lib/Q/sys/Filters";
import { models as mdl } from "../abstract/Models";
import { data } from "../assets/data/data";
import { Material } from "../lib/q/components/HeavyTable/script";
import { Components } from '../lib/q/sys/Components';
import { models as _models } from '../abstract/Models';
import { Chart } from './../lib/Chart.bundle.js';

import { UI, bind, attributes, collection, reflection, net, utils, encoding, basic, thread, helper, sdata, Controller } from "../lib/q/Core";

var qstore = new collection.Dictionary<SyncQuee<any>, QueeEventArgs<any>>("quee_sync_frame");
var GData: basics.vars;
GetVars((v) => { GData = clone(v); return false; });
var store = { files: new collection.Dictionary<number, models.File>("files"), folders: new collection.Dictionary<number, models.Folder>("folders") };
import { CharTemplates, UIChart } from '../Modules/Charts';
ValidateImport(CharTemplates);

export namespace models {
    export enum Permission {
        None = 0,
        View = 1,
        Read = 3,
        Write = 7,
        Delete = 15,
        Permissions = 31
    }
    export class PermissionFile extends sdata.DataRow {
        private static store = new collection.Dictionary<number, any>("PFiles");
        protected getStore(): collection.Dictionary<number, this> {
            return PermissionFile.store;
        }
        Update() {

        }
        Upload() {

        }

        @attributes.property(String)
        public FileName: string;

        @attributes.property(mdl.Client)
        public Client: mdl.Client;

        @attributes.property(Number, 0)
        public Permission: Permission;

        public static
    }
    export class Segment extends bind.DObject {
        @attributes.property(String)
        Name: string;
        constructor(name: string) {
            super();
            this.Name = name;
        }
        toString() {
            return this.Name;
        }
    }
    export class File extends sdata.QShopRow {
        protected getStore(): collection.Dictionary<number, this> {
            return store.files as any;
        }

        @attributes.property(String)
        Name: string;

        @attributes.property(String)
        Type: string;

        @attributes.property(Number)
        Size: number;

        @attributes.property(Date)
        Date: Date;


        toString() {
            return this.Name;
        }
    }

    export class Folder extends sdata.QShopRow {
        protected getStore(): collection.Dictionary<number, this> {
            return store.folders as any;
        }
        @attributes.property(String)
        Name: string;

    }

    export class Files extends sdata.DataTable<File> {
        constructor() {
            super(void 0, models.File, (id) => new File(id));
        }
    }

    export class Folders extends sdata.DataTable<Folder> {
        constructor() {
            super(void 0, models.Folder, (id) => new Folder(id));
        }
    }
}

export class FileManager extends UI.TControl<models.Folder> {
    OnSearch(old: any, _new: any): any {
        this.Files.Filter.Patent = new filters.list.StringPatent(_new);
    }
    @attributes.property1(System.basics.Url, { changed: FileManager.prototype.OnCurrentUrlChanged, check: FileManager.prototype.OnCurrentUrlCheck })
    CurrentUrl: System.basics.Url;
    @attributes.property(collection.List)
    Path: collection.List<models.Segment>;

    @attributes.property(collection.ExList)
    Files: collection.ExList<models.File, filters.list.StringPatent<models.File>>;

    @attributes.property(models.Folders)
    Folders: models.Folders;


    @attributes.property(Boolean)
    IsOpening: boolean;

    private _files: UI.ListAdapter<models.File, this>;
    private _folders: UI.ListAdapter<models.Folder, this>;
    private _path: UI.ListAdapter<string, string>;


    OnCurrentUrlChanged(e: bind.EventArgs<System.basics.Url, this>) {
        this.Update();
    }
    OnCurrentUrlCheck(e: bind.EventArgs<System.basics.Url, this>) {
        var n = e._new;
        var o = e._old;
        n && (n = this.reduce(n));
        if (n && o && n.IsEquals(o)) {
            e._new = o;
            return;
        }
        e._new = n;
    }
    setName(name: string, dom: Element, cnt: UI.JControl, e: bind.events) {
        switch (name) {
            case '_folders':
                this._folders = cnt as any;
                this._folders.AcceptNullValue = false;
                break;
            case '_files':
                this._files = cnt as any;
                this._folders.AcceptNullValue = true;
                this.initializeDrop();
                break;
            case '_path':
                this._path = cnt as any;
                break;
            default: return;
        }
    }
    initializeDrop() {
        var target = this.View;
        target.addEventListener('drop', (e) => {
            e.stopPropagation();
            e.preventDefault();
            for (var i = 0; i < e.dataTransfer.files.length; i++) {
                this.Upload(e.dataTransfer.files.item(i));
            }
        });

        target.addEventListener('dragover', (e) => {
            e.stopPropagation();
            e.preventDefault();

            e.dataTransfer.dropEffect = 'copy';
        });
    }
    GoBack() {
        var url = this.CurrentUrl;
        if (!url) return;
        url = url.ParentDirectory;
        if (!url) return;
        this.CurrentUrl = url;
    }
    private OpenFolder(f: models.Folder) {
        if (!f) return;
        var url = this.CurrentUrl;
        if (!url) url = new System.basics.Url(f.Name + "/");
        else url = url.Combine(f.Name + "/");
        this.CurrentUrl = url;
    }
    GoToFolder(e: Event, ed: bind.EventData, scop: bind.Scop, evnt: bind.events) {
        this.OpenFolder(scop.Value as models.Folder);
    }
    FolderKeyDown(e: KeyboardEvent, ed: bind.EventData, scop: bind.Scop, evnt: bind.events) {
        if (e.keyCode === 13)
            return this.OpenFolder(scop.Value as models.Folder);
        if (e.keyCode === UI.Keys.Delete)
            return this.DeleteFolder(scop.Value as models.Folder);
    }
    DeleteFolder(folder: models.Folder): any {

    }
    private reduce(url: System.basics.Url) {
        var out = <string[]>[];
        var p = url.path;
        var c = 0;
        for (var i = 0; i < p.length; i++) {
            var f = p[i];
            switch (f) {
                case '..':
                    out.pop();
                    break;
                case '':
                    out.splice(0, out.length);
                    break;
                case '.':
                    break;
                default:
                    out.push(f);
            }
        }
        return new System.basics.Url(out.join('/') + (out.length ? '/' : ''));
    }
    private getUrl(l: number) {
        var p = this.Path.AsList();
        var s = "./";
        for (var i = 0; i < l; i++)
            s += p[i].Name + "/";
        return s;
    }
    GoToUrl(e: Event, ed: bind.EventData, scop: bind.Scop, evnt: bind.events) {
        var f = scop.Value as models.Segment;
        if (!f) return;
        var url = this.CurrentUrl;
        var s = this.getUrl(this.Path.IndexOf(f) + 1);
        if (!s) return;
        this.CurrentUrl = new System.basics.Url(s);
    }
    OpenFile(e: Event, ed: bind.EventData, scop: bind.Scop, evnt: bind.events) {
        var f: models.File = scop.Value as models.File;
        if (!f) return;
        var c = this.CurrentUrl.Combine(f.Name);
        UI.Modal.ShowDialog(c.FullPath, "You Just clicked to download a file");
    }
    private XFiles: models.Files;
    private static backFolder = new models.Folder(-1);
    private static backSegment = new models.Segment("..");
    private static currentSegment = new models.Segment(".");

    Update() {
        var url = this.CurrentUrl;
        GData.requester.Costume({ Url: `/_/explore?dir=${url.FullPath}`, Method: net.WebRequestMethod.Get }, null, null, (reqdata, data, iss, req) => {
            this.Folders.Clear();
            this.XFiles.Clear();
            this.Path.Clear();

            if (url.path.length) {
                this.Folders.Add(FileManager.backFolder);
                this.Path.Add(FileManager.backSegment);
            } else {
                this.Path.Add(FileManager.currentSegment);
            }

            this.Folders.FromCsv(data.Folders || []);
            this.XFiles.FromCsv(data.Files || []);

            this.Path.AddRange(url.path.map((v) => new models.Segment(v)));
            if (data.IsDeleted) this.CurrentUrl = url.ParentDirectory;
        }, this);
    }
    private selectedCNT: UI.JControl;
    private _imageCapture: media.ImageCapture = new media.ImageCapture();
    public XTakePhoto() {
        var f = new FileReader();
        var id = Date.now();
        f.addEventListener('loadend', (e) => {
            var vr = this._imageCapture._videoRecorder;
            this.UploadVideoBlob(f.result as ArrayBuffer, `Video_${vr.RecordID}-${id}.mp4`, vr.Cursor);
        });
        this._imageCapture._videoRecorder.OnPropertyChanged(this._imageCapture._videoRecorder.GetDPCurrentDataProperty(), (s, e) => {
            f.readAsArrayBuffer(e._new);
        });
        this._imageCapture.Open((e) => {
            if (e.modalResult.Result == UI.MessageResult.ok) {
                var fileName = prompt("Entry the name of file", `Image_${Date.now()}.png`);
                if (fileName)
                    this.UploadBlob(e.Buffer, fileName.lastIndexOf('.png') === fileName.length - 4 ? fileName : fileName + ".png");
                else UI.InfoArea.push("Operation canceled", true);
            }
        });
    }
    OnKeyDown(e: KeyboardEvent) {
        const kc = e.keyCode;
        if (kc === UI.Keys.F9) {
            this.XTakePhoto();
            return true;

        }
        if (kc === 37 || kc === 39) {
            this.selectedCNT = this._files;
            this.selectedCNT.View.focus();
            Object.defineProperty(e, 'keyCode', { value: kc + 1 });
            return this._files.OnKeyDown(e);
        }
        else if (kc === 38 || kc === 40) {
            this.selectedCNT = this._folders;
            this.selectedCNT.View.focus();
            return this._folders.OnKeyDown(e);
        }
        if (kc == 9) this.selectedCNT = this.selectedCNT === this._folders ? this._files : this._folders;
        else if (!this.selectedCNT) this.selectedCNT = this._folders;

        this.selectedCNT.View.focus();
        if (this.selectedCNT.OnKeyDown(e)) return;
        if (kc === 27)
            (this.selectedCNT as UI.ListAdapter<any, any>).SelectedIndex = -1;
        else if (kc === 13)
            if (this.selectedCNT === this._folders)
                return this.OpenFolder(this._folders.SelectedItem);
            else this.loadPermissions();
        else if (kc === 9)
            e.stopPropagation();
        return true;
    }


    private list = new collection.List<models.PermissionFile>(models.PermissionFile);
    private xm = new PermissionsTable(this.list);
    loadPermissions(): any {
        var current_file = this._files.SelectedItem;
        var current_dir = this.CurrentUrl;

        var f = (current_file && current_file.Name) || '.';

        GData.requester.Request(models.PermissionFile, "LISTPERMISSIONS", void 0, { dir: current_dir.FullPath, file: f, cid: 0, per: 31 }, (pcll, json, iss, req) => {
            var i = 1;
            var js = { Client: <number>void 0, FileName: void 0, Permission: 0 };
            this.list.Clear();
            for (var x in json) {
                var perm = json[x];
                var n: number = parseInt(x);
                if (isNaN(n)) continue;
                var t = new models.PermissionFile(i++);
                js.Client = n;
                js.FileName = f;

                if (typeof perm !== 'number' || typeof models.Permission[perm] !== 'string') continue;
                js.Permission = perm;
                t.FromJson(js, encoding.SerializationContext.GlobalContext);
                this.list.Add(t);
            }
            UI.Modal.ShowDialog("Permissions", this.xm.InitVars(current_dir, current_file), (e) => { ; }, "Close", null, null);

        });
    }
    public initialize() {
        super.initialize();
        this.CurrentUrl = new System.basics.Url("./");

    }
    static ctor() {
        require("style|../assets/FileManager/font-awesome/css/font-awesome.min.css");
        this.backFolder.Name = "..";
    }
    constructor() {
        super((template as any).Folder.Manager, UI.TControl.Me);
        this.Files = new collection.ExList<models.File, filters.list.StringPatent<models.File>>(models.File);
        this.Folders = new models.Folders();
        this.Path = new collection.List<models.Segment>(models.Segment);
        this.XFiles = new models.Files();
        this.Files.Filter = (new filters.list.StringFilter<models.File>());
        this.Files.Source = this.XFiles;
    }
    getContentOf(url: System.basics.Url) {

    }
    GoNext(e: Event, ed: bind.EventData, scop: bind.Scop, evnt: bind.events) {

    }
    NewFile(e: Event, ed: bind.EventData, scop: bind.Scop, evnt: bind.events) {

    }
    public XUploadFile() {
        var b = FileManager.button;
        if (!FileManager.button) {
            FileManager.button = b = document.createElement('input');
            var self = this;
            b.addEventListener('input', function (this: HTMLInputElement, e) {
                for (var i = 0; i < this.files.length; i++) {
                    self.Upload(this.files[i]);
                }
                try {
                    b.files = null;
                } catch (e) {

                }
            });
        }
        b.type = 'file';
        var v = document.createEvent('MouseEvent');
        v.initEvent('click', false, false);
        b.dispatchEvent(v);
    }
    private static button: HTMLInputElement;
    private UploadFile(e?: Event, ed?: bind.EventData, scop?: bind.Scop, evnt?: bind.events) {
        this.XUploadFile();
    }
    public UploadVideoBlob(buffer: ArrayBuffer, file: string, seek: number) {
        var url = this.CurrentUrl;
        GData.requester.Costume({ Url: `/_/explore?push&seek=${seek}&id=${-1}&slice_id=${-1}&dir=${url.FullPath}&file=${file}&size=${buffer.byteLength}&lastm=${new Date(Date.now()).toISOString()}&type=image/png&slice_start=${0}&slice_size=${buffer.byteLength}`, Method: net.WebRequestMethod.Post, HasBody: true }, buffer, null, (reqdata, data, iss, req) => {
            if (iss) {
                var n = file.toLowerCase();
                for (var v of this.Files.AsList())
                    if (v.Name.toLowerCase() == n) return;
                var fl = new models.File(this.Files.Count + 1);
                fl.Name = file;
                this.Files.Add(fl);
            }
        }, this);
    }
    public UploadBlob(buffer: ArrayBuffer, file: string) {
        var url = this.CurrentUrl;
        UI.Spinner.Default.Start(`Uploading ${file}`);
        GData.requester.Costume({ Url: `/_/explore?id=${-1}&slice_id=${-1}&dir=${url.FullPath}&file=${file}&size=${buffer.byteLength}&lastm=${new Date(Date.now()).toISOString()}&type=image/png&slice_start=${0}&slice_size=${buffer.byteLength}`, Method: net.WebRequestMethod.Post, HasBody: true }, buffer, null, (reqdata, data, iss, req) => {
            UI.Spinner.Default.Pause();
            if (iss) {
                UI.InfoArea.push(`L'image ${file} est bien enregister`);
                var n = file.toLowerCase();
                for (var v of this.Files.AsList())
                    if (v.Name.toLowerCase() == n) return;
                var fl = new models.File(this.Files.Count + 1);
                fl.Name = file;
                this.Files.Add(fl);
            } else {
                UI.InfoArea.push(`Fatal error when upload file ${file} to directory ${url.FullPath}`, false);
            }
        }, this);
    }
    Upload(file: File): any {
        var url = this.CurrentUrl;
        function onSliceCreated(e: BlobReaderEventArgs) {

            console.log(e.percentage);
            var file = e.file;
            GData.requester.Costume({ Url: `/_/explore?id=${e.sender.id}&slice_id=${e.slice.id}&dir=${url.FullPath}&file=${e.file.name}&size=${file.size}&lastm=${file.lastModified}&type=${file.type}&slice_start=${e.slice.start}&slice_size=${e.data.byteLength}`, Method: net.WebRequestMethod.Post, HasBody: true }, e.data, null, (reqdata, data, iss, req) => {
                UI.Spinner.Default.Start(`Uploading ${file.name} : ${e.percentage}%`);
                if (iss) {
                    if (e.percentage >= 100) {
                        UI.Spinner.Default.Pause();
                    }
                    e.onSuccess();
                } else {
                    UI.InfoArea.push(`Fatal error when upload file ${file.name} to directory ${this.CurrentUrl.FullPath}`, false);
                }
            }, this);
        }

        var uploader = new BlobReader(file, onSliceCreated);
        uploader.OnDone = (e: BlobReaderEventArgs) => {
            var n = e.file.name.toLowerCase();
            for (var v of this.Files.AsList())
                if (v.Name.toLowerCase() == n) return;
            var fl = new models.File(this.Files.Count + 1);
            fl.Name = e.file.name;
            this.Files.Add(fl);
            e.sender.Dispose();
        }
        uploader.StartUpload();
    }
    XDownloadFile(file?: models.File) {
        if (!file) {
            var url = this.CurrentUrl;
            var file = this._files.SelectedItem;
            if (!(file instanceof models.File)) return;
        }
        var furl = url.Combine(file.Name);
        var link = document.createElement('a');
        link.href = `/_/explore?file=${furl.FullPath}&dwn`;
        link.download = 'Download.jpg';
        link.click();
    }
    private DownloadFile(e?: Event, ed?: bind.EventData, scop?: bind.Scop, evnt?: bind.events) {
        this.XDownloadFile();
    }

    OnContextMenu(e: MouseEvent) {
        if (this._files.View.contains(e.target as HTMLElement))
            UI.Desktop.Current.CurrentApp.OpenContextMenu(this._contextMenu, {
                callback: (e) => {
                    return this.OnContextMenuCallback(e, e.selectedItem);
                    if (e.selectedItem.type === 'separator' || e.selectedItem.type === 'label') {
                        e.cancel = true;
                        return;
                    }
                    switch (e.selectedItem) {

                        default:
                    }
                    UI.InfoArea.push("Upgrade for full app");
                    var l = UI.Modal.ShowDialog("Statistiques des Produit", new StatView());
                    l.OnInitialized = l => l.setWidth("98%").setHeight('90%');
                }, e: e, ObjectStat: this._files.SelectedItem, x: 0, y: 0
            });
    }
    OnContextMenuCallback(e: UI.IContextMenuEventArgs<Components.MenuItem>, si: Components.MenuItem) {
        if (si.type === 'separator' || si.type === 'label')
            return e.cancel = true;
        switch ((si as any as Components.MdIconGroupItem).commandName) {
            case "cmd-copy":
                UI.InfoArea.push(`La command ${(si as any as Components.MdIconGroupItem).commandName} n'est pas implimenter (DEMO VERSION)`, false, 1000);
                break;
            case "cmd-paste":
                UI.InfoArea.push(`La command ${(si as any as Components.MdIconGroupItem).commandName} n'est pas implimenter (DEMO VERSION)`, false, 1000);
                break;
            case "cmd-cut":
                UI.InfoArea.push(`La command ${(si as any as Components.MdIconGroupItem).commandName} n'est pas implimenter (DEMO VERSION)`, false, 1000);
                break;
            case "cmd-delete":
                UI.InfoArea.push(`La command ${(si as any as Components.MdIconGroupItem).commandName} n'est pas implimenter (DEMO VERSION)`, false, 1000);
                break;
            case "cmd-settings":
                this.loadPermissions();
                break;
            case "cmd-download":
                this.XDownloadFile();
                break;
            case "cmd-upload":
                this.XUploadFile();
                break;
            case "take-photo":
                this.XTakePhoto();
                break;
        }
    }
    rt = [
        <Components.IconGroup>{
            type: 'icongroup',
            value: <Components.MdIconGroupItem[]>[
                { iconName: 'content_copy', commandName: 'cmd-copy' },
                { iconName: 'content_paste', commandName: 'cmd-paste' },
                { iconName: 'content_cut', commandName: 'cmd-cut' },
                { iconName: 'settings', commandName: 'cmd-settings' }
            ]
        },
        <Components.Separator>{ type: "separator" },
        <Components.MdMenuItem>{ type: "menu-item", commandName: "open_file", label: "Open", iconName: "visibility" },
        <Components.MdMenuItem>{ type: "menu-item", commandName: "cmd-download", label: "Download", iconName: "file_download" },        
        <Components.MdMenuItem>{ type: "menu-item", commandName: "take-photo", label: "Take Photo", iconName: "add_a_photo" },
        <Components.MdMenuItem>{ type: "menu-item", commandName: "cmd-upload", label: "Upload", iconName: "cloud_upload" },
    ];
    private _contextMenu = new Components.MdContextMenu(this.rt);
}

class StatisticDescription extends bind.DObject {
    @attributes.property(String)
    Name: string;
    @attributes.property(String)
    Label: string;
    @attributes.property(collection.List)
    Params: collection.List<any>;
    toString() {
        return this.Label || this.Name;
    }
}

interface OrderBy {
}

export interface IStatViewArgs {
    previousArgs?: IStatViewArgs;
    sender: StatView;
    handler: StatisticsDrawerHandler;
    data: any;
    chart: UIChart<any>;
}
export interface StatisticsDrawerHandler {
    Name: string;
    Draw(e: IStatViewArgs);
    OnAction(e: IStatViewArgs, name: string);
    Actions: string[];
    Swap(data: any): any
    Update(e: IStatViewArgs);
    Clear?(e:IStatViewArgs);
}
export class StatView extends UI.TControl<any> {
    private _handlers: { [s: string]: StatisticsDrawerHandler } = {};
    private _method: Components.MdTextbox<StatisticDescription>;
    private _actions: Components.MdTextbox<string>;
    private _from: Components.MdTextbox<Date>;
    private _to: Components.MdTextbox<Date>;
    private _client: Components.MdTextbox<_models.Client>;
    private _product: Components.MdTextbox<_models.Product>;
    private _charttype: Components.MdTextbox<Chart.ChartType>;
    currentArgs: IStatViewArgs;

    private register(h: StatisticsDrawerHandler) {
        this._handlers[h.Name.toLowerCase()] = h;
    }
    private initHandlers() {
        var unknowClient = new _models.Client(-1);
        unknowClient.Name = "unknown";
        var unknowProduct = new _models.Product(-1);
        unknowProduct.Name = "unknown";
        function reset(e: IStatViewArgs, lbls, vls) {
            clear(e);
            var lst = e.chart.DataSource;
            var lbs = e.chart.Labels;
            lst.AddRange(vls);
            lbs.AddRange(lbls);
        }
        function clear(e: IStatViewArgs) {
            var chart = e.chart;
            var lst = e.chart.DataSource;
            lst && lst.Clear();
            var lbs = e.chart.Labels;
            lbs && lbs.Clear();
        }
        function getKeys(data) {
            var ks = Object.keys(data);
            var i = ks.indexOf('@ref');
            if (i !== -1) ks.splice(i, 1);
            return ks;
        }
        interface INFactureAchatsBydate {
            client: _models.Client;
            nFactures: number
        }

        interface ITotalAchatsByClient {
            client: _models.Client;
            total: number;
        }

        interface ITotalVersmentByClient {
            client: _models.Client;
            versment: number;
        }


        interface IProduitAcheter {
            product: _models.Product,
            data: [ number, number, number]
        }

        this.register({
            Name: 'NFactureAchatsBydate',
            Swap(data) {
                var keys = getKeys(data);
                var out = new Array(keys.length);
                for (var i = 0; i < out.length; i++) {
                    var k = keys[i];
                    out[i] = { client: _models.Client.getById(parseInt(k) || -1) || unknowClient, nFactures: data[k] };
                }
                return out;
            },
            Clear: clear,
            Draw(e) {
                e.chart.ClearPlots();
                e.handler.Clear(e);
                e.chart.AddPlot("N° Factures Acheter par clients", (_, __, n: INFactureAchatsBydate) => n.nFactures, StatView.options);
                e.handler.Update(e);
            },
            Update(e) {
                var data: INFactureAchatsBydate[] = e.data;
                var vls = new Array(data.length);
                var lbls = new Array(data.length);
                for (var i = 0; i < data.length; i++) {
                    var d = data[i];
                    lbls[i] = (d.client && d.client.FirstName) || "unknown";
                    vls[i] = d;
                }
                reset(e, lbls, vls);
            },
            OnAction(e, name) {
                if (name === 'Total') {
                    var t = 0;
                    for (var i of e.data as INFactureAchatsBydate[])
                        t += i.nFactures;
                    UI.InfoArea.push(`N° Factures est ${t}`);
                }
                else if (name == "Trie Par N° Factures (UP)") {
                    e.chart.Change(function (this: IStatViewArgs) {
                        (this.data as INFactureAchatsBydate[]).sort((a, b) => a.nFactures - b.nFactures);
                        this.handler.Update(this); return false;
                    }, e);
                } else if (name == "Trie Par N° Factures (Down)") {
                    e.chart.Change(function (this: IStatViewArgs) {
                        (this.data as INFactureAchatsBydate[]).sort((a, b) => b.nFactures - a.nFactures);
                        this.handler.Update(this); return false;
                    }, e);
                }
            },
            Actions: ["Total", "Trie Par N° Factures (UP)", "Trie Par N° Factures (Down)"]
        });

        this.register({
            Name: 'TotalAchatsByClient',
            Clear: clear,
            Swap(data) {
                var keys = getKeys(data);
                var out = new Array(keys.length);
                for (var i = 0; i < out.length; i++) {
                    var k = keys[i];
                    out[i] = { client: _models.Client.getById(parseInt(k) || -1) || unknowClient, total: data[k] };
                }
                return out;
            },
            Draw(e) {
                var chart = e.chart;
                chart.ClearPlots();
                e.handler.Clear(e);
                chart.AddPlot("Total des bon achats par clients", (_, __, n: ITotalAchatsByClient) => n.total, StatView.options);                
                e.handler.Update(e);
            },
            Update(e) {
                var data: ITotalAchatsByClient[] = e.data;
                var vls = new Array(data.length);
                var lbls = new Array(data.length);
                for (var i = 0; i < data.length; i++) {
                    var d = data[i];
                    lbls[i] = (d.client && d.client.FirstName) || "unknown";
                    vls[i] = d;
                }
                reset(e, lbls, vls);
            },
            OnAction(e, name) {
                if (name === 'Total') {
                    var t = 0;
                    for (var i of e.data as ITotalAchatsByClient[])
                        t += i.total;
                    UI.InfoArea.push(`<h1>Montant Total des Factures est<br> ${t}</h1>`, true, 5000);
                } else if (name == "Trie Par Total (UP)") {
                    e.chart.Change(function (this: IStatViewArgs) {
                        (this.data as ITotalAchatsByClient[]).sort((a, b) => a.total - b.total);
                        this.handler.Update(this); return false;
                    }, e);
                } else if (name == "Trie Par Total (Down)") {
                    e.chart.Change(function (this: IStatViewArgs) {
                        (this.data as ITotalAchatsByClient[]).sort((a, b) => b.total - a.total);
                        this.handler.Update(this); return false;
                    }, e);
                }

            },
            Actions: ["Total", "Trie Par Total (UP)", "Trie Par Total (Down)"]
        });

        this.register({
            Name: 'TotalVersmentByClient',
            Clear: clear,
            Swap(data) {
                var keys = getKeys(data);
                var out = new Array(keys.length);
                for (var i = 0; i < out.length; i++) {
                    var k = keys[i];
                    out[i] = { client: _models.Client.getById(parseInt(k) || -1) || unknowClient, versment: data[k] };
                }
                return out;
            },
            Draw(e) {
                e.chart.ClearPlots();
                e.handler.Clear(e);
                e.chart.AddPlot("Total des versements par clients", (_, __, n: ITotalVersmentByClient) => n.versment, StatView.options);
                e.handler.Update(e);
            },
            Update(e: IStatViewArgs) {
                var data: ITotalVersmentByClient[] = e.data;
                var vls = new Array(data.length);
                var lbls = new Array(data.length);
                for (var i = 0; i < data.length; i++) {
                    var d = data[i];
                    lbls[i] = (d.client && d.client.FirstName) || "unknown";
                    vls[i] = d;
                }
                reset(e, lbls, vls);
            },
            OnAction(e, name) {
                if (name === 'Total des Versement') {
                    var t = 0;
                    for (var i of e.data as ITotalVersmentByClient[])
                        t += i.versment;
                    UI.InfoArea.push(`<h1>Total des versement est<br> ${t}</h1>`, true, 5000);
                }
                else if (name == "Trie Par Versement (UP)") {
                    e.chart.Change(function (this: IStatViewArgs) {
                        (this.data as ITotalVersmentByClient[]).sort((a, b) => a.versment - b.versment);
                        this.handler.Update(this); return false;
                    }, e);
                } else if (name == "Trie Par Versement (Down)") {
                    e.chart.Change(function (this: IStatViewArgs) {
                        (this.data as ITotalVersmentByClient[]).sort((a, b) => b.versment - a.versment);
                        this.handler.Update(this); return false;
                    }, e);
                }
            },
            Actions: ["Total des Versement", "Trie Par Versement (UP)", "Trie Par Versement (Down)"]
        });

        this.register({
            Name: 'ProduitAcheter',
            Clear: clear,
            Swap(data) {
                var keys = getKeys(data);
                var out = new Array(keys.length);
                for (var i = 0; i < out.length; i++) {
                    var k = keys[i];
                    out[i] = {
                        product: _models.Product.getById(parseInt(k) || -1) || unknowProduct,
                        data: data[k]
                    };
                }
                return out;
            },
            Draw(e) {
                var chart = e.chart;
                chart.ClearPlots();
                e.handler.Clear(e);
                chart.AddPlot("Qte total", (_, __, n) => n[0], StatView.options);
                chart.AddPlot("Total Acheter", (_, __, n) => n[1], StatView.options);
                chart.AddPlot("Benifice Total ", (_, __, n) => n[2], StatView.options);
                e.handler.Update(e);
            },
            OnAction(e, name) {
                if (name === 'Total') {
                    var tq = 0;
                    var ta = 0;
                    var tb = 0;
                    for (var i of e.data as IProduitAcheter[])
                        tq += i.data[0],
                            ta += i.data[1],
                            tb += i.data[2];
                    UI.InfoArea.push(`<h1>Qte total Acheter est ${tq}<br>Montant Total est ${ta}<br>Benifice Total est ${tb}</h1>`, true, 5000);
                }
                else if (name == "Trie Par Qte (UP)") {
                    e.chart.Change(function (this: IStatViewArgs) {
                        (this.data as IProduitAcheter[]).sort((a, b) => a.data[0] - b.data[0]);
                        this.handler.Update(this); return false;
                    }, e);
                } else if (name == "Trie Par Qte (Down)") {
                    e.chart.Change(function (this: IStatViewArgs) {
                        (this.data as IProduitAcheter[]).sort((a, b) => b.data[0] - a.data[0]);
                        this.handler.Update(this); return false;
                    }, e);
                } else if (name == "Trie Par Montant (UP)") {
                    e.chart.Change(function (this: IStatViewArgs) {
                        (this.data as IProduitAcheter[]).sort((a, b) => a.data[1] - b.data[1]);
                        this.handler.Update(this); return false;
                    }, e);
                } else if (name == "Trie Par Montant (Down)") {
                    e.chart.Change(function (this: IStatViewArgs) {
                        (this.data as IProduitAcheter[]).sort((a, b) => b.data[1] - a.data[1]);
                        this.handler.Update(this); return false;
                    }, e);
                } else if (name == "Trie Par Benifice (UP)") {
                    e.chart.Change(function (this: IStatViewArgs) {
                        (this.data as IProduitAcheter[]).sort((a, b) => a.data[2] - b.data[2]);
                        this.handler.Update(this); return false;
                    }, e);
                } else if (name == "Trie Par Benifice (Down)") {
                    e.chart.Change(function (this: IStatViewArgs) {
                        (this.data as IProduitAcheter[]).sort((a, b) => b.data[2] - a.data[2]);
                        this.handler.Update(this); return false;
                    }, e);
                }
            },
            Actions: ["Total", "Trie Par Qte (UP)", "Trie Par Qte (Down)"
                , "Trie Par Montant (UP)", "Trie Par Montant (Down)"
                , "Trie Par Benifice (UP)", "Trie Par Benifice (Down)"],
            Update(e: IStatViewArgs) {
                var data: IProduitAcheter[] = e.data;
                var vls = new Array(data.length);
                var lbls = new Array(data.length);
                for (var i = 0; i < data.length; i++) {
                    var d = data[i];
                    lbls[i] = (d.product && d.product.toString()) || "unknown";
                    vls[i] = d.data;
                }
                reset(e, lbls, vls);
            }
        });
    }
    @attributes.property(StatisticDescription, void 0, void 0)
    Method: StatisticDescription;
    @attributes.property(String, void 0, void 0,StatView.prototype.OnAction)
    CurrentAction: string;

    OnAction(e: bind.EventArgs<string, this>) {
        if (!e._new) return;
        this.currentArgs.handler.OnAction(this.currentArgs, e._new);
        thread.Dispatcher.call(this, function (this: StatView) { this.CurrentAction = null; });
    }

    @attributes.property(Date, new Date())
    From: Date;

    @attributes.property(Date, new Date())
    To: Date;

    @attributes.property(_models.Product)
    Product: _models.Product;

    @attributes.property(_models.Client, void 0, void 0, (e) => { debugger; })
    Client: _models.Client;

    @attributes.property(String, "", void 0, StatView.prototype.OnChartTypeChanged)
    ChartType: Chart.ChartType;
    @attributes.property(collection.List)
    Actions: collection.List<string>;

    _chart: UIChart<any>;

    _hasValue_() { return true; }

    constructor() {
        super((template as any).Folder.stat, UI.TControl.Me);
        this.Actions = new collection.List<string>(Object);
        this.Value = this;
        this.initHandlers();
    }

    setName(name: string, dom: Element, cnt: UI.JControl, e: bind.IJobScop) {
        this[name] = cnt;
        bind.NamedScop.Create('ChartTypes', new collection.List<Chart.ChartType>(String, ["bar", "bubble", "doughnut", "horizontalBar", "line", "pie", "polarArea", "radar", "scatter"]));
        if (name === '_charttype') {
            e.Scop.OnPropertyChanged(bind.Scop.DPValue, (s, e) => {
                this.ChartType = e._new;
            }, this);
        }
    }

    initialize() {
        super.initialize();
        this.OnCompiled = n =>
            GData.requester.Request(_models.Statstics, 'methods', void 0, void 0, (x, j, i, r) => {
                if (!i) return;
                var list = j && (j as any).__list__ as StatisticDescription[];
                if (!list) return;
                list = list.map(v => new StatisticDescription().FromJson(v, encoding.SerializationContext.GlobalContext.reset()));
                bind.NamedScop.Create('productStatistics').Value = new collection.List(Object, list);
            });
    }
    static ctor() {
        bind.NamedScop.Create('productStatistics', void 0, bind.BindingMode.TwoWay);
    }
    Update() {
        function getId(d: sdata.DataRow) { return (d && d.Id) || -1; }
        var data = { Client: this.Client, Product: this.Product, Method: this.Method, From: this.From, To: this.To };
        GData.requester.Request(_models.Statstics, 'out', void 0, {
            from: this.From.toISOString(), to: this.To.toISOString(), cid: getId(this.Client), pid: getId(this.Product), method: (this.Method && this.Method.Name) || "TotalAchatsByClient"
        }, (xr, json, iss, req) => {
            this._chart.Change(function (this: StatView, t, json, iss: true) {
                var methodName = ((data.Method && data.Method.Name) || "TotalAchatsByClient").toLowerCase();
                var handler = this._handlers[methodName];
                if (handler) {
                    json = handler.Swap(json);
                    var e = <IStatViewArgs>{ chart: this._chart, sender: this, handler: handler, data: json, previousArgs: this.currentArgs };
                    helper.TryCatch(handler, handler.Draw, void 0, [e]);
                    this.Actions.Clear();
                    this.Actions.AddRange(handler.Actions);
                    this.currentArgs = e;
                } else return true;
            }, this, [json, iss]);
        });
    }
    Refresh() {
        this._chart.Update();
    }
    private args;
    OnKeyDown(e: KeyboardEvent) {
        var h = this.currentArgs;
        if (!h) return;
        switch (e.keyCode) {
            case UI.Keys.F1:
                h.handler.OnAction(h, 'arg1');
            default:
        }
    }


    public static get options(): Chart.ChartDataSets {
        return clone<Chart.ChartOptions>(<any>{
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        });
    }


    OnChartTypeChanged(e: bind.EventArgs<Chart.ChartType, this>) {
        this._chart.ChartType = e._new;
    }
}

export class PermissionsTable extends Material.HeavyTable<models.PermissionFile> {
    public dir: System.basics.Url;
    public file: models.File;
    constructor(source: collection.List<models.PermissionFile>) {
        super(data.value.FilePermissionsTable.def);
        this.Source = source;
    }
    public InitVars(dir: System.basics.Url, file: models.File) {
        this.dir = dir;
        this.file = file;
        return this;
    }
    OnKeyDown(e: KeyboardEvent) {
        if (e.keyCode === UI.Keys.F2)
            this.Source.Add(new models.PermissionFile(basic.GuidManager.Next));
        else return false;
        return true;
    }
    DeletePermission(e: Event, ed: bind.EventData, scop: bind.Scop, evnt: bind.events) {
        var dt = scop.Value as models.PermissionFile;
        GData.requester.Request(models.PermissionFile, "DELETEPERMISSION", void 0,
            { dir: this.dir.FullPath, file: this.file.Name, cid: dt.Client.Id, per: dt.Permission },
            (qll, json, iss, req) => {
                if (iss)
                    this.Source.Remove(dt);
                else return UI.InfoArea.push("The attribute doesnt deleted !!!!", false);
                UI.InfoArea.push("The attribute deleted !!!!", true);
            });
    }
    SavePermission(e: Event, ed: bind.EventData, scop: bind.Scop, evnt: bind.events) {
        var dt = scop.Value as models.PermissionFile;
        if (dt.Client == null)
            return UI.InfoArea.push("The client cannot be null");

        GData.requester.Request(models.PermissionFile, "SETPERMISSION", void 0,
            { dir: this.dir.FullPath, file: this.file && this.file.Name, cid: dt.Client.Id, per: dt.Permission },
            (qll, json, iss, req) => {
                if (iss)
                    UI.InfoArea.push("The attribute saved !!!!", true);
                else return UI.InfoArea.push("The attribute doesnt saved !!!!", false);
            });
    }
}

export class BlobReader {
    Dispose(): any {
        this.reader = null;
        this.file = null;
    }
    reader: FileReader = new FileReader();
    id: string;
    public constructor(public file: File, private onSliceCreated: (e: BlobReaderEventArgs) => void, public slice_size = 1024 * 100) {
        this.id = basic.GuidManager.Next + "UP" + basic.GuidManager.Next;
    }
    public OnDone: (e: BlobReaderEventArgs) => void;
    public StartUpload() {
        this.nextBlobSlice(0);
    }
    private nextBlobSlice(start: number) {
        var next_slice = start + this.slice_size;
        var blob = this.file.slice(start, next_slice);
        this.reader.onloadend = (event) => {
            if ((event.target as any).readyState !== FileReader.DONE) {
                return;
            }
            var ajax: BlobReaderEventArgs = {
                sender: this,
                data: (event.target as any).result,
                get file(this: BlobReaderEventArgs) { return this.sender.file; },
                slice: {
                    start: start,
                    size: this.slice_size,
                    next: next_slice, id: basic.GuidManager.Next + "slice" + 34
                },
                get percentage(this: BlobReaderEventArgs) {
                    var size_done = start + this.slice.size;
                    return Math.floor((size_done / this.file.size) * 100);
                },
                onError: function (this: BlobReaderEventArgs, reset) {
                    if (reset)
                        this.sender.nextBlobSlice(start);
                },
                onSuccess: function (this: BlobReaderEventArgs) {
                    var size_done = this.slice.start + this.slice.size;
                    var percent_done = Math.floor((size_done / this.file.size) * 100);
                    if (this.slice.next < this.file.size) {
                        this.sender.nextBlobSlice(this.slice.next);
                    } else this.sender.OnDone(this);
                }
            };
            this.onSliceCreated(ajax);
        }
        this.reader.readAsArrayBuffer(blob);
    }
    public UploadBlob(blob: Blob) {

    }

}

export class SyncQuee<T> extends bind.DObject {
    public handler: basic.ITBindable<(e: QueeEventArgs<T>) => void>
    private quee: T[] = [];
    private _isExecuting: boolean = false;

    @attributes.property(Object)
    public CurrentData: T;

    public push(data: T) {
        this.quee.push(data);
        if (!this._isExecuting) this.EndOperation(void 0);
    }
    constructor(handler: basic.ITBindable<(e: QueeEventArgs<T>) => void>) {
        super();
        if (!this.handler || !this.handler.Invoke) throw "argument (handler) null";
        this.handler = { Invoke: handler.Invoke, Owner: handler.Owner };
        Object.preventExtensions(this);
    }
    public EndOperation(e: QueeEventArgs<T>) {
        if (qstore.Get(this) !== e)
            throw new Error("Unknown frame");
        if (this.quee.length) {
            this._isExecuting = true;
            this.CurrentData = this.quee.shift();

            var e = <QueeEventArgs<T>>{
                data: this.CurrentData, quee: this
            };
            qstore.Set(this, e);
            helper.TryCatch(this.handler.Owner || this,
                this.handler.Invoke,
                function (error, e: QueeEventArgs<T>) { e.quee.EndOperation(e); },
                [e]);

        } else {
            this._isExecuting = false;
            this.CurrentData = void 0;
            qstore.Set(this, void 0);
        }
    }
}

export namespace API {
    function serialize(obj) {
        var str = [];
        for (var p in obj)
            if (obj.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
        return str.join("&");
    }
    export class PermissionApi extends Controller.Api<any>{
        _root: string;
        get Url() {
            return __global.GetApiAddress(this._root)
        }
        constructor() {
            super(true);
            this._root = '/_/explore';
            this.ERegister(net.WebRequestMethod.Open, 'LISTPERMISSIONS', "method=list&dir=@dir&file=@file", false);
            this.ERegister(net.WebRequestMethod.Open, 'SETPERMISSION', "method=set&dir=@dir&file=@file&cid=@cid&per=@per", false);
            this.ERegister(net.WebRequestMethod.Open, 'DELETEPERMISSION', "method=delete&dir=@dir&file=@file&cid=@cid", false);
        }

        public GetType() { return models.PermissionFile; }
        public GetRequest(idata: any, xshema: string | net.RequestMethodShema | net.WebRequestMethod, params?: net.IRequestParams): net.RequestUrl {
            var shema = this.GetMethodShema(xshema);
            if (shema && shema.ParamsFormat) {
                var qs = shema.ParamsFormat.apply(params || {});
            }
            else if (params)
                qs = serialize(params)

            return new net.RequestUrl(qs ? this.Url + "?" + qs : this.Url, null, null, shema ? shema.Method : 0, shema.SendData);
        }
        public OnResponse(response: JSON, data: any, context: encoding.SerializationContext) {
            return data;
        }
    }
    new PermissionApi();
}

export namespace media {
    export class VideoRecorder extends bind.DObject {
        private static events = ['error', 'pause', 'resume', 'start', 'stop', 'warning'];
        private static labels = { paused: "Resume Recorder", inactive: 'Start Recorder', recording: "Pause Recorder" };

        @attributes.property(String, "inactive", void 0, VideoRecorder.prototype.OnStateChanged)
        public State: 'inactive' | 'recording' | 'paused';

        @attributes.property(Number, 0, void 0, VideoRecorder.prototype.OnRecordIDChanged)
        public RecordID;

        @attributes.property(Number, 0)
        public FragmentID;

        @attributes.property(Blob, void 0, void 0, VideoRecorder.prototype.OnBlobChanaged)
        public CurrentData: Blob;

        @attributes.property(Number, 0)
        public Cursor: number;

        @attributes.property(Boolean)
        Avaible: boolean;

        @attributes.property(Boolean, undefined)
        Initialized: boolean;

        @attributes.property(MediaStream)
        public Stream: MediaStream;

        private _recorder: MediaRecorder;
        private _chunks: Blob[] = [];
        private thread: number;
        get NativeStat() {
            return this._recorder.state;
        }
        get IsRecording() {
            return this._recorder ? this._recorder.state === 'recording' : false;
        }
        get IsInactive() {
            return this._recorder ? this._recorder.state === 'inactive' : true;
        }
        get IsPaused() {
            return this._recorder ? this._recorder.state === 'paused' : true;
        }
        Play() {
            if (this.IsPaused) return this.Resume();
            if (!this.IsInactive) return;

            this._recorder && this._recorder.start();
        }
        Pause() {
            if (!this.IsRecording) return;
            return this._recorder && this._recorder.pause();
        }
        Stop() {
            if (this.IsInactive) return;
            this._recorder && this._recorder.stop();
        }
        Resume() {
            if (this.IsInactive)
                return this.Play();
            if (this.IsRecording) return;
            this._recorder && this._recorder.resume();
        }
        constructor(public intervalFrame = 1000) {
            super();
        }

        private _startThread() {
            clearInterval(this.thread);
            if (this._recorder) this.thread = setInterval((t: this) => { t.onThread(); }, this.intervalFrame || 200, this);
        }
        private _stopThread() {
            this.thread = <any>clearInterval(this.thread);
        }
        private onThread() {
            this._recorder && this._recorder.requestData();
        }
        private grabDate() {
            this._recorder && this._recorder.requestData();
        }
        private OnPause(e?) {
            this.grabDate();
            this.State = 'paused';
            this._stopThread();
        }

        private OnStop(e?) {
            this.State = 'inactive';
            this._stopThread();
        }

        private OnResume(e?) {
            this.State = 'recording';
            this._startThread();
        }
        private OnPlay(e?) {
            this.State = 'recording';
            this.RecordID++;
            this._startThread();
        }
        private OnError(e?) {
            this.State = this.NativeStat;
        }
        private OnWarning(e?) {
            this.State = this.NativeStat;
        }

        handleEvent(e: MediaRecorderDataAvailableEvent) {
            if ((e.data as Blob).size == 0) return;
            this.CurrentData = e.data;
        }

        private _handler: EventListenerObject = <any>{
            handleEvent(this: { owner: VideoRecorder }, e) {
                switch (e.type) {
                    case 'error': return this.owner.OnError(e);
                    case 'warning': return this.owner.OnWarning(e);
                    case 'stop': return this.owner.OnStop(e);
                    case 'pause': return this.owner.OnPause(e);
                    case 'resume': return this.owner.OnResume(e);
                    case 'start': return this.owner.OnPlay(e);
                    case 'stop': return this.owner.OnStop(e);
                    default:
                }
            }, owner: this
        };
        private static codecs = ['video/webm;codecs=vp9', 'video/webm;codecs=h264', 'video/webm;codecs=vp8'];
        private static getCodec() {
            for (var i of this.codecs)
                if (MediaRecorder.isTypeSupported(i))
                    return i;
        }
        private onSuccessStream(stream: MediaStream) {
            this.Stream = stream;
            this._recorder = new MediaRecorder(stream, { mimeType: VideoRecorder.getCodec() });
            this._recorder.addEventListener("dataavailable", this);
            this.Avaible = true;
            for (var i of VideoRecorder.events)
                this._recorder.addEventListener(i, this._handler);
        }
        private onFailStream(error: Error) {
            this.Avaible = false;
        }

        OnStateChanged(e: bind.EventArgs<string, this>) {
            if (this._recorder.state === e._new) return;
            switch (e._new) {
                case 'inactive':
                    this.Stop();
                    break;
                case 'paused':
                    this.Pause();
                    break;
                case 'recording':
                    this.Play();
                    break;
            }
        }
        OnBlobChanaged(e: bind.EventArgs<Blob, this>) {
            this.FragmentID++;
            if (e._old)
                this.Cursor += e._old.size;
        }
        public GetDPCurrentDataProperty() {
            return this.GetProperty("CurrentData");
        }
        OnRecordIDChanged(e: bind.EventArgs<Number, this>) {
            this.FragmentID = 0;
        }
        private picture: { _video: HTMLVideoElement, _canvas: HTMLCanvasElement };
        public TakePicture(args: TakePictureArgs) {
            if (!this.picture)
                this.picture = {
                    _video: document.createElement('video'),
                    _canvas: document.createElement('canvas')
                }
            if (args.video && !args.canvas) args.canvas = document.createElement('canvas');
            var video = args.video || this.picture._video;
            var canvas = args.video ? args.canvas : this.picture._canvas;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d').drawImage(video, 0, 0);
            var self = this;
            var img = canvas.toBlob((blob) => {
                var fileReader = new FileReader();
                fileReader.onload = function (event: any) {
                    if (args.detacheVideoSource) args.video.srcObject = void 0;
                    args.callback && args.callback({ sender: self, blob: blob, buffer: event.target.result as ArrayBuffer, error: false, args: args });
                };
                function onerror(e) {
                    if (args.detacheVideoSource) args.video.srcObject = void 0;
                    args.callback && args.callback({ sender: self, blob: blob, args: args, error: true });
                }
                fileReader.onerror = onerror;
                fileReader.onabort = onerror;
                fileReader.readAsArrayBuffer(blob);
            }, 'image/png');
        }
        public static getImage(args: TakePictureArgs) {
            var self = this;
            var img = args.canvas.toBlob((blob) => {
                var fileReader = new FileReader();
                fileReader.onload = function (event: any) {
                    args.callback && args.callback({ sender: void 0, blob: blob, buffer: event.target.result as ArrayBuffer, error: false, args: args });
                };
                function onerror(e) {
                    args.callback && args.callback({ sender: void 0, blob: blob, args: args, error: true });
                }
                fileReader.onerror = onerror;
                fileReader.onabort = onerror;
                fileReader.readAsArrayBuffer(blob);
            }, 'image/png');
        }

        Dispose() {
            if (this.Initialized === false) return;
            this._stopThread();
            this.Stop();
            try {
                if (this.Stream) {
                    this.Stream.getTracks().every(v => { v.stop(); return false; });
                    this.Stream.stop();
                    this.Stream = null;
                }
            } catch{ }
            if (this._recorder)
                for (var i of VideoRecorder.events) {
                    this._recorder.removeEventListener(i, this._handler);
                }
            this._recorder = void 0;
            this.Stream = void 0;
            this.Initialized = false;
        }

        Setup() {
            if (this.Initialized) return;
            var getUserMedia = ((navigator as any).getUserMedia || (navigator as any).webkitGetUserMedia || (navigator as any).mozGetUserMedia || (navigator as any).msGetUserMedia);
            var callback = (function (this: VideoRecorder, b) {
                if (b instanceof MediaStream) return this.onSuccessStream(b);
                return this.onFailStream(b as any);
            }).bind(this);
            if (getUserMedia) {
                navigator.getUserMedia({ video: { width: { exact: 640 }, height: { exact: 480 } } }, callback, callback);
            } else {
                alert("The browser does not support Media Interface");
            }
            this.Initialized = true;
        }
    }

    export interface TakePictureArgs {
        callback: (e: TakePictureEventArgs) => void;
        objectStat: any;
        video: HTMLVideoElement;
        canvas: HTMLCanvasElement;
        detacheVideoSource?: boolean;
    }
    export interface TakePictureEventArgs {
        sender: VideoRecorder;
        blob?: Blob;
        buffer?: ArrayBuffer;
        error: boolean;
        args: TakePictureArgs;
    }


    export class ImageCapture extends UI.TControl<models.File> implements EventListenerObject {
        @attributes.property(String)
        Path: string;

        @attributes.property(Array, 0)
        Number: number[];

        public _videoRecorder = new VideoRecorder();
        private _video: HTMLVideoElement;
        private _canvas: HTMLCanvasElement;

        __takePic(e: Event, ed: bind.EventData, scop: bind.Scop, evnt: bind.events) {
            if (this.IsPlaying) {
                this.pause();
                ed.dom.textContent = "Resume";
            } else {
                ed.dom.textContent = "Pause";
                this.play();
            }
        }
        __recordeVid(e: Event, ed: bind.EventData, scop: bind.Scop, evnt: bind.events) {
            if (this._videoRecorder.IsRecording) {
                this._videoRecorder.Pause();
                ed.dom.textContent = "Resume Video";
            } else {
                this._videoRecorder.Play();
                ed.dom.textContent = "Recording";
            }
        }

        setName(name: string, dom: Element, cnt: UI.JControl, e: bind.events) {
            switch (name) {
                case '_video':
                    this._video = dom as HTMLVideoElement;
                    this._videoRecorder.OnPropertyChanged(this._videoRecorder.GetProperty("Stream"), (s, e) => {
                        this._video.srcObject = e._new;
                        this.play();
                    }, this);
                    this._video.srcObject = this._videoRecorder.Stream;
                default: return;
            }
        }

        constructor() {
            super((template as any).Folder.Picture, UI.TControl.Me);
            window['icc'] = this;
        }
        
        public get IsPlaying(): boolean {
            return !!(this._video.currentTime > 0 && !this._video.paused && !this._video.ended && this._video.readyState > 2);
        }
        public TakePicture(callback?: (e: ImageCaptureEventArgs) => void) {
            this._videoRecorder.TakePicture({
                callback: function (e) {
                    callback({ sender: e.args.objectStat, blob: e.blob, Buffer: e.buffer });
                },
                video: this._video,
                canvas: this._canvas, detacheVideoSource: false, objectStat: this
            });
        }        
        public Open(callback: (e: ImageCaptureEventArgs) => void) {
            var isexecuting = false;
            var waits = <((e: ImageCaptureEventArgs) => void)[]>[];
            var e: ImageCaptureEventArgs = {
                sender: this, blob: void 0, Buffer: void 0, modalResult: void 0,
                grabContent(this: ImageCaptureEventArgs, callback: (t: ImageCaptureEventArgs) => void): void {
                    if (Object.isFrozen(this)) return callback(this);
                    waits.push(callback);
                    if (waits.length > 1) return;
                    this.sender.TakePicture((e) => {
                        Object.freeze(this);
                        for (var i of waits)
                            try { i(e); } catch  { }
                        waits = void 0;
                    });
                }
            };
            this.OnCompiled = n => n._videoRecorder.Setup();
            UI.Modal.ShowDialog("Image Capture", this, (e1) => {
                if (e1.Result === UI.MessageResult.ok)
                    e.grabContent((e) => {
                        e.sender._videoRecorder.Dispose();
                        e.sender.pause();
                        e.modalResult = e1;
                        callback && callback(e);
                    });
                else {
                    e.sender._videoRecorder.Dispose();
                    callback({ blob: void 0, Buffer: void 0, sender: this, modalResult: e1, grabContent: (e) => { } });
                }
            }, "Save", "Discart", null);
            return this;
        }

        public play(callback?: (success: boolean, a: void | any) => void) {
            if (this.IsPlaying) return;
            this._video.play()
                .then((a) => typeof callback === 'function' && callback(true, a))
                .catch(a => typeof callback === 'function' && callback(true, a));
        }
        public pause() {
            this.Number = [Math.random() * Math.PI];
            if (!this._video.paused)
                this._video.pause();
        }
        public refresh() {
            this._videoRecorder.Dispose();
            this._videoRecorder.Setup();
        }

        public trim(p: string) {
            return p.substr(3);
        }
        public test(x: string) {
            return x + " from test";
        }
    }
}

export namespace IO {
    export class FileUploader {
        public readonly Quee: SyncQuee<Blob>;
        private syncAr: QueeEventArgs<Blob>;
        OnDataAvaible(e: QueeEventArgs<Blob>) {
            this.syncAr = e;
            this.Upload(e);
        }
        constructor(dir: string, file: string) {
            this.Quee = new SyncQuee<Blob>({ Invoke: this.OnDataAvaible, Owner: this });
        }


        Upload(e: QueeEventArgs<Blob>): any {
            var reader = new FileReader();
            reader.addEventListener('loadend', (e) => {
                var r = (e.target as any).result;

            });
            reader.readAsArrayBuffer(e.data);
        }
    }
}

export interface QueeEventArgs<T> {
    quee: SyncQuee<T>;
    data: T;
}

export interface BlobReaderEventArgs {
    sender: BlobReader;
    data: ArrayBuffer;
    file: File;
    slice: { id: string, start: number, size: number, next: number },
    percentage: number;
    onError(reset: boolean);
    onSuccess();
}

export interface ImageCaptureEventArgs {
    sender: media.ImageCapture;
    blob: Blob;
    Buffer: ArrayBuffer;
    modalResult?: UI.MessageEventArgs;
    grabContent?(callback: (e: ImageCaptureEventArgs) => void);
}


declare interface MediaRecorderErrorEvent extends Event {
    name: string;
}

declare interface MediaRecorderDataAvailableEvent extends Event {
    data: any;
}

interface MediaRecorderEventMap {
    'dataavailable': MediaRecorderDataAvailableEvent;
    'error': MediaRecorderErrorEvent;
    'pause': Event;
    'resume': Event;
    'start': Event;
    'stop': Event;
    'warning': MediaRecorderErrorEvent;
}

export interface MediaRecorderOptions {
    mimeType?: string;
    audioBitsPerSecond?: number;
    videoBitsPerSecond?: number;
    bitsPerSecond?: number;
}

declare class MediaRecorder extends EventTarget {
    static isTypeSupported(mimeType: string): boolean;

    readonly mimeType: string;
    readonly state: 'inactive' | 'recording' | 'paused';
    readonly stream: MediaStream;
    ignoreMutedMedia: boolean;
    videoBitsPerSecond: number;
    audioBitsPerSecond: number;

    ondataavailable: (event: MediaRecorderDataAvailableEvent) => void;
    onerror: (event: MediaRecorderErrorEvent) => void;
    onpause: () => void;
    onresume: () => void;
    onstart: () => void;
    onstop: () => void;

    constructor(stream: MediaStream, options?: MediaRecorderOptions);

    start();

    stop();

    resume();

    pause();

    isTypeSupported(type: string): boolean;

    requestData();


    addEventListener<K extends keyof MediaRecorderEventMap>(type: K, listener: (this: MediaStream, ev: MediaRecorderEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;

    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;

    removeEventListener<K extends keyof MediaRecorderEventMap>(type: K, listener: (this: MediaStream, ev: MediaRecorderEventMap[K]) => any, options?: boolean | EventListenerOptions): void;

    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}



/*
 * imgs = $('img');
reg = /playsurah\((\d+)\,(\d*)(\,(\'[^']*\'))?/;
xx = imgs.toArray().map(a=>a.getAttribute('onclick')).filter(a=>a && a.indexOf('playsurah(') == 0);
p = xx.map(x=>{
    r = x.match(reg);debugger;
    var vtype=parseInt(r[2]);
    var path=r[1];
    if( vtype==4)
		var filepath="http://dl.islamweb.net/audiopath/audio/"+path+".mp3";
	else
		filepath="http://dl.islamweb.net/audiopath/Audio3/"+path+".mp3";
    return {
        id: path,
        title: r[3],
        url: filepath
    }
}
);
 */