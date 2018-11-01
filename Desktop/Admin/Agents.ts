import {UI, conv2template} from '../../lib/Q/sys/UI';
import { models} from "../../abstract/Models";
import { GetVars } from '../../abstract/extra/Common';
import { basic, collection, utils} from '../../lib/Q/sys/corelib';
import { basics } from '../../abstract/extra/Basics';
import { filters } from '../../lib/Q/sys/Filters';
import { SearchData } from '../Search';
import { StatView } from '../../Idea/FileManager';
var GData: basics.vars;
GetVars((v) => {
    GData = v;
    return false;
});


export class Agents extends UI.NavPanel {
    private adapter: UI.ListAdapter<models.Agent, any>;
    public get HasSearch(): UI.SearchActionMode { return UI.SearchActionMode.NoSearch; }
    public set HasSearch(v: UI.SearchActionMode) { }

    Update() {
        GData.apis.Agent.SmartUpdate();
    }
    OnKeyDown(e: KeyboardEvent) {
        if (!this.adapter.OnKeyDown(e)) {
            if (e.keyCode === UI.Keys.F1)
                this.getHelp({
                    "Enter": "Edit",
                    "Suppr": "Delete",
                    "F2": "Add New",
                });
            else if (e.keyCode === UI.Keys.F2)
                GData.apis.Agent.CreateNew((e) => {
                    if (e.Error !== basic.DataStat.Success)
                        UI.InfoArea.push(`The ${e.Data.toString()} not Saved`);
                    else UI.InfoArea.push(`The ${e.Data.toString()} successfully created`);
                });
            else if (this.adapter.SelectedIndex != -1)
                if (e.keyCode === 13)
                    GData.apis.Agent.Edit(this.adapter.SelectedItem, (e) => {
                        if (e.Error !== basic.DataStat.Success)
                            UI.InfoArea.push(`The ${e.Data.toString()} not Saved`);
                        else UI.InfoArea.push(`The ${e.Data.toString()} successfully Saved`);
                    });
                else if (e.keyCode === UI.Keys.Delete)
                    GData.apis.Agent.Delete(this.adapter.SelectedItem, null);
                else
                    return super.OnKeyDown(e);
            else return super.OnKeyDown(e);
        }
        e.stopPropagation();
        e.preventDefault();
        return true;
    }
    constructor() {
        super('agents_info', "Agents");
        this.Title = "Agents";
    }
    initialize() {
        super.initialize();
        this.adapter = new UI.ListAdapter<models.Agent, any>('Agents.table');
        this.adapter.AcceptNullValue = false;
        this.Add(this.adapter);
        this.adapter.OnInitialized = (p) => p.Source = GData.__data.Agents;
    }
    
    GetLeftBar() {
        if (!this.lb) {
            let l = new UI.Navbar<any>();
            let add = new UI.Glyph(UI.Glyphs.plusSign, false, 'Add');
            let edit = new UI.Glyph(UI.Glyphs.edit, false, 'Edit');
            let remove = new UI.Glyph(UI.Glyphs.fire, false, 'Remove');
            let oldget = l.getTemplate;
            l.getTemplate = (c: UI.JControl) => {
                var e = oldget(new UI.Anchore(c));
                if (c.Enable === false)
                    e.Enable = false;
                else
                    e.addEventListener('click', this.handleSerices, { t: this, c: (c as UI.Glyph).Type as UI.Glyphs });
                return e;
            }
            l.OnInitialized = l => l.AddRange([add, edit, remove]);
            this.lb = l;
        }
        return this.lb;
    }
    handleSerices(s, e, p: { t: Agents, c: UI.Glyphs }) {
        var c = UI.Glyphs;
        switch (p.c) {
            case c.plusSign:
                return GData.apis.Agent.CreateNew();
            case c.edit:
                return GData.apis.Agent.Edit(p.t.adapter.SelectedItem, null);
            case c.fire:
                return GData.apis.Agent.Delete(p.t.adapter.SelectedItem, null);
        }
    }
    private lb: UI.Navbar<any>;
}
export class StatisticsPanel extends UI.NavPanel {
    private _content: StatView;
    constructor() {
        super('statistics_panel', "Statistiques");
        this.Title = "Statistiques";
    }
    initialize() {
        super.initialize();
        this.Add(this._content = new StatView());
    }
}
