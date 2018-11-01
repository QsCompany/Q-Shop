import { models } from "../abstract/Models";
import { UI } from "../lib/Q/sys/UI";
//import { GetVars } from '../Desktop/Common';
//import { basics } from "../Desktop/Basics";
import { bind, thread } from "../lib/Q/sys/Corelib";
import { GetVars } from "../abstract/extra/Common";
import { basics } from "../abstract/extra/Basics";

var GData: basics.vars;
GetVars((c) => { GData = c; return false });
export namespace Forms {
    export class InitFacture extends UI.TControl<models.Facture> {
        constructor() {
            super("Facture.new", UI.TControl.Me);
        }
        SelectClient() {
            GData.apis.Client.Select((e) => {
                if (e.Error == basics.DataStat.Success) {
                    var selected = e.Data;
                    this.Value.Client = selected;
                    if (selected) {
                        this.Value.Abonment = selected.Abonment;
                    }
                }
            }, this.Value.Client, GData.__data.Costumers);

        }
        public Show(callback?: (data: models.Facture, success: boolean) => void) {
            this.Value = new models.Facture(0);
            this.Data = this.Value;
            if (callback)
                this.OnSuccess.Add(callback);
            (this.Value as models.Facture).Type = models.BonType.Bon;
            (this.Value as models.Facture).Transaction = models.TransactionType.Vente;
            (this.Value as models.Facture).Abonment = this.Value.Client && this.Value.Client.Abonment || 0;
            UI.Modal.ShowDialog("Creation Facture Vente", this, (e) => this.onModalCosed(e), "Create", "Discart");
            return this;
        }
        public Value: models.Facture;
        private onModalCosed(e: UI.MessageEventArgs) {
            this.Parent = null;
            if (e.Result == UI.MessageResult.ok) {
                var f = this.Value as models.Facture;
                if (!f.Client) return e.StayOpen();
                GData.requester.Request(models.Facture, "CREATE", this.Value, { CId: f.Client.Id, Type: f.Type, Abonment: f.Abonment, Transaction: f.Transaction }, (s, r, iss) => {
                    this.OnSuccess.PInvok(0, [this.Value, iss], this);
                });
            }
        }
        public OnSuccess = new bind.EventListener<(data: models.Facture, success: boolean) => void>(0, true);
    }

    export class PDFViewer extends UI.TControl<string>{
        private static modal = new UI.Modal();
        private static pdf: PDFViewer;
        public static DPUrl = bind.DObject.CreateField<string, PDFViewer>("Url", String, null, PDFViewer.prototype.UrlChanged);
        public Url: string;
        static __fields__() { return [this.DPUrl]; }
        constructor() {
            super("templates.PDFViewer", UI.TControl.Me);
            if (PDFViewer.pdf != null) throw null;
            PDFViewer.pdf = this;
            PDFViewer.modal.OnInitialized = n => { n.setWidth('95vw').setHeight('90vh').Content = this; }
            PDFViewer.modal.OnClosed.On = (e) => {
                if (this.quee.length == 0) return;
                e.StayOpen();
                this.Url = this.quee.pop();
            }
        }
        static ctor() {
            PDFViewer.modal = new UI.Modal();
        }
        UrlChanged(e: bind.EventArgs<string, this>) {
            this.OnInitialized = n => thread.Dispatcher.call(n, n.asyncUrl, e._new);
        }
        private asyncUrl(url) {
            this.pdfDom.src = '';
            setTimeout(function (ths: PDFViewer, url: string) {
                ths.pdfDom.src = url;
            }, 200, this, url);
        }
        public setName(name: string, dom: HTMLElement, cnt: UI.JControl, e: bind.IJobScop) {
            if (name == "pdfDom") {
                this.pdfDom = dom as HTMLEmbedElement;
                this.pdfDom.addEventListener('error', (e) => { this.Refech(); });
                return true;
            }
        }
        pdfDom: HTMLEmbedElement;
        public static Show(url: string) {
            if (!this.pdf) new PDFViewer();
            if (!this.modal.IsOpen) {
                this.modal.Open();
                this.pdf.OnCompiled = (pdf) => pdf.Url = url;
            } else PDFViewer.pdf.quee.push(url);
        }
        private quee: string[] = [];
        Refech() {
            var d = this.Url;
            this.Url = '';
            this.Url = d;
        }
    }

    export class InitSFacture extends UI.TControl<models.SFacture> {
        constructor() {
            super("SFacture.new", UI.TControl.Me);
        }
        SelectFournisseur() {
            GData.apis.Fournisseur.Select((e) => {
                if (e.Error === basics.DataStat.Success) {
                    this.Value.Fournisseur = e.Data;
                }
            }, this.Value.Fournisseur);
        }
        SelectAchteur() {
            GData.apis.Agent.Select((e) => {
                var selected: models.Agent = e.Data;
                if (e.Error == basics.DataStat.Success)
                    this.Value.Achteur = selected;
            }, this.Value.Achteur, GData.__data.Agents);
        }
        public Show(callback?: (data: models.SFacture, success: boolean) => void) {
            this.Value = new models.SFacture(0);
            this.Data = this.Value;
            if (callback)
                this.OnSuccess.Add(callback);
            this.Value.Type = models.BonType.Bon;
            this.Value.Transaction = models.TransactionType.Vente;
            this.Value.Abonment = this.Value.Client && this.Value.Client.Abonment || 0;
            UI.Modal.ShowDialog("Creation Facture Achat", this, (e) => this.onModalCosed(e), "Create", "Discart");
            return this;
        }
        public Value: models.SFacture;
        private onModalCosed(e: UI.MessageEventArgs) {
            this.Parent = null;
            if (e.Result == UI.MessageResult.ok) {
                var f = this.Value;
                if (!f.Fournisseur || !f.Achteur) return e.StayOpen();
                GData.requester.Request(models.SFacture, "CREATE", this.Value, { FId: f.Fournisseur.Id, AId: f.Achteur.Id, Type: f.Type, Transaction: f.Transaction }, (s, r, iss) => {
                    this.OnSuccess.PInvok(0, [this.Value, iss], this);
                });
            }
        }
        public OnSuccess = new bind.EventListener<(data: models.SFacture, success: boolean) => void>(0, true);
    }

    export class PictureViewer extends UI.TControl<string> {
        private openDlg: HTMLInputElement;
        constructor() {
            super('templates.PictureViewer', UI.TControl.Me);
            var f = new FileReader();
            this.openDlg.multiple = false;
            this.openDlg.pattern = "[\w\d\s].png";
            f.readAsText(this.openDlg.files[0]);

        }
    }

    export class ImageModal extends UI.JControl {
        private btnClose: HTMLSpanElement;
        private imgContent: HTMLImageElement;
        private txtCaption: HTMLDivElement;

        constructor() {
            super(ImageModal.createElement('div','ImageModal'));
        }
        initialize() {
            this._view.appendChild(this.btnClose = ImageModal.createElement('span', 'close'));
            this._view.appendChild(this.txtCaption = ImageModal.createElement('div', void 0, 'caption'));
            this._view.appendChild(this.imgContent = ImageModal.createElement('img', 'modal-content'));            
            this.btnClose.addEventListener('click', this);
            this._view.style.zIndex = "9007199254740991";
            this.btnClose.innerText = 'Fermer';
            require('style|../assets/Forms.css');
        }
        static createElement(tag: string, css?: string, id?: string) :any {
            var t = document.createElement(tag);
            if (css)
                t.classList.add(css);
            if (id)
                t.id = id;
            return t;
        }
        Open(img: string, caption: string) {
            if (this.Parent == null) {
                this.Parent = UI.Desktop.Current;
                UI.Desktop.Current.View.appendChild(this._view);
            } else
                this.Parent.View.classList.add('modal-open');
            UI.Desktop.Current.GetKeyControl(this, (e) => {
                if (e.keyCode == UI.Keys.Esc)
                    this.Close();
                if (e.keyCode > 36 && e.keyCode < 41 && !e.altKey && !e.ctrlKey && !e.shiftKey)
                    return 2 as any;
                e.preventDefault();
                e.stopImmediatePropagation();
                return 0 as any;
            }, []);
            this._view.style.display = "block";
            this.imgContent.src = img;
            this.txtCaption.innerHTML = caption;
        }
        get IsOpen() {
            return this._view.style.display == "block";
        }
        Close() {
            this.Parent.View.classList.remove('modal-open');
            this._view.style.display = "none";
            UI.Desktop.Current.ReleaseKeyControl();
        }
        handleEvent(e:MouseEvent) {
            if (e.type == 'click' && e.srcElement === this.btnClose)
                this.Close();
        }
        public static Default = new ImageModal();
    }
    window['ImageModal'] = ImageModal;
}


export function Test() {
    var t = new Forms.InitFacture();
    t.Show();
    return t;
}
export function Test1() {
    var t = new Forms.InitSFacture();
    t.Show();
    return t;
}