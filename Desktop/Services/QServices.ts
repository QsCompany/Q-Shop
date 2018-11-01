import { Controller } from '../../lib/Q/sys/System';
import { UI } from '../../lib/Q/sys/UI';
import { models } from '../../abstract/Models';
import { funcs, GetVars } from '../../abstract/extra/Common';
import { basics } from '../../abstract/extra/Basics';
var GData: basics.vars;
GetVars((vars) => {
    GData = vars;
    return false;
});
export namespace Services {
    function OnItemSelected(m: UI.MenuItem) {
        if (this.s)
            this.s.Callback(m.Source);
    }

    export class SearchServices extends UI.Navbar<UI.CItem> {
        constructor() {
            super();
        }
        initialize() {
            super.initialize();
            this.Items.Add(new UI.CItem('add', 'Add', '#', this.OnItemSelectedDlgt));
            this.Items.Add(new UI.CItem('modify', 'Modify', '#', this.OnItemSelectedDlgt));
            this.Items.Add(new UI.CItem('remove', 'Remove', '#', this.OnItemSelectedDlgt));
            this.Items.Add(new UI.CItem('suggest', 'Suggests', '#', this.OnItemSelectedDlgt));
        }
        private OnItemSelectedDlgt = { Invoke: OnItemSelected, Owner: this };

        public ApplyTo(s: UI.IService) {
            this.s = s as UI.Page;
        }
        private s: UI.Page;
    }
    function CreateIcon(icon, title?): HTMLSpanElement {
        var t = document.createElement('sapn');
        t.classList.add('glyphicon', 'bgr', 'glyphicon-' + icon);
        t.title = title;
        return t;
    }
    export class RFactureServices extends UI.Navbar<UI.CItem> {
        constructor() {
            super();
        }
        initialize() {
            super.initialize();
            this.OnItemSelected = this.OnItemSelected;
            this.Items.Add(new UI.CItem('save', CreateIcon('save', 'Save'), '#', this.OnItemSelectedDlgt));
            this.Items.Add(new UI.CItem('refresh', CreateIcon('refresh', 'Refresh'), '#', this.OnItemSelectedDlgt));
            this.Items.Add(new UI.CItem('check', CreateIcon('check', 'Validate'), '#', this.OnItemSelectedDlgt));
        }

        private OnItemSelectedDlgt = { Invoke: OnItemSelected, Owner: this };
        private OnItemSelected(m: UI.MenuItem) {
            if (this.s)
                this.s.Callback(m.Source);
        }
        public ApplyTo(s: UI.IService) {
            this.s = s as UI.Page;
        }
        private s: UI.Page;
    }
    export class FactureService extends UI.Navbar<UI.CItem> {
        constructor() {
            super();
        }
        initialize() {
            super.initialize();
            this.Items.Add(new UI.CItem('add', UI.Glyph.CreateGlyphDom(UI.Glyphs.edit, 'Add Products'), '#', this.OnItemSelectedDlgt));
            var t: UI.CItem;
            GData.user.OnMessage((s, e) => {
                onLogged(e._new);
            });
            var onLogged = (v: boolean) => {
                if (v) {
                    GData.requester.Push(models.IsAdmin, new models.IsAdmin(), null, (s, r, iss) => {
                        if (iss) {
                            t = t || new UI.CItem('select', UI.Glyph.CreateGlyphDom(UI.Glyphs.user, 'Select Client'), '#', this.OnItemSelectedDlgt);
                            if (this.Items.IndexOf(t) == -1)
                                this.Items.Insert(1, t);
                        } else {
                            if (!t) return;
                            var o: number;
                            if ((o = this.Items.IndexOf(t)) !== -1)
                                this.Items.RemoveAt(o);
                        }
                    });
                }
                else {

                }
            }
            onLogged(GData.user.IsLogged);
            this.Items.Add(new UI.CItem('delete', UI.Glyph.CreateGlyphDom(UI.Glyphs.fire, 'Delete This Facture'), '#', this.OnItemSelectedDlgt));
        }
        private OnItemSelectedDlgt = { Invoke: OnItemSelected, Owner: this };
        public ApplyTo(s: UI.IService) {
            this.s = s as UI.Page;
        }
        private s: UI.Page;

    }

    export class CostumersService extends UI.Navbar<UI.CItem>{
        constructor() {
            super();
        }
        initialize() {
            super.initialize();
            //this.Items.Add(new UI.CItem('get', UI.Glyph.CreateGlyphDom(UI.Glyphs.user, 'Get Friends List'), '#', this.OnItemSelectedDlgt));
            //this.Items.Add(new UI.CItem('send', UI.Glyph.CreateGlyphDom(UI.Glyphs.envelope, 'Send Invitation to my friends'), '#', this.OnItemSelectedDlgt));
        }
        private OnItemSelectedDlgt = { Invoke: OnItemSelected, Owner: this };
        public ApplyTo(s: UI.IService) {
            this.s = s as UI.Page;
            return this;
        }
        private s: UI.Page;
    }

    export class FacturesService extends UI.Navbar<UI.CItem> {
        constructor() {
            super();
        }
        initialize() {
            super.initialize();
            this.Items.Add(new UI.CItem('select', UI.Glyph.CreateGlyphDom(UI.Glyphs.shareAlt, 'Open this Facture', 'bgr'), '#', this.OnItemSelectedDlgt));
            this.Items.Add(new UI.CItem('new', UI.Glyph.CreateGlyphDom(UI.Glyphs.plusSign, 'Ceate New Facture '), '#', this.OnItemSelectedDlgt));
        }
        private OnItemSelectedDlgt = { Invoke: OnItemSelected, Owner: this };
        public ApplyTo(s: UI.IService) {
            this.s = s as UI.Page;
        }
        private s: UI.Page;

    }


    export class MyClientsService extends UI.Navbar<UI.CItem> {
        constructor() {
            super();
        }
        initialize() {
            super.initialize();
            this.Items.Add(new UI.CItem('new', UI.Glyph.CreateGlyphDom(UI.Glyphs.plusSign, 'Create New Client'), '#', this.OnItemSelectedDlgt));
            this.Items.Add(new UI.CItem('edit', UI.Glyph.CreateGlyphDom(UI.Glyphs.edit, 'Edit'), '#', this.OnItemSelectedDlgt));
            this.Items.Add(new UI.CItem('delete', UI.Glyph.CreateGlyphDom(UI.Glyphs.fire, 'Delete'), '#', this.OnItemSelectedDlgt));
        }
        private OnItemSelectedDlgt = { Invoke: OnItemSelected, Owner: this };
        public ApplyTo(s: UI.IService) {
            this.s = s as UI.Page;
        }
        private s: UI.Page;

    }
}