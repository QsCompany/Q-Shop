import { bind, attributes, collection, utils, helper } from '../lib/q/sys/Corelib';
import { UI } from '../lib/q/sys/UI';
import { Filters } from '../Desktop/Jobs.js';
import { filters } from '../lib/Q/sys/Filters.js';
import { Chart } from '../lib/Chart.bundle.js';
//import { template } from 'template|../assets/templates/FileManager.html';
interface IChartPoint {
    Label: string;
    Value: number;
    backgroundColor?: Chart.ChartColor;
    borderColor?:Chart. ChartColor;
    pointHoverBorderColor?:Chart. ChartColor;
    pointHoverBackgroundColor?:Chart. ChartColor;
}
export type IDataSelector<T> = (sender: collection.TransList<T, number>, index: number, data: T, uichart: UIChart<T>) => number;
export class UIChart<T> extends UI.JControl {
    OnDataSourceChanged(e: bind.EventArgs<collection.List<any>, this>) {
        for (var i in this.plots)
            this.plots[i].list.Source = e._new;
        this.Update();
    }
    OnChartTypeChanged(e: bind.EventArgs<Chart.ChartType, this>) {
        this.chart.config.type = e._new;
        this.Reset();
    }
    @attributes.property(String, <Chart.ChartType>'line', void 0, UIChart.prototype.OnChartTypeChanged)
    ChartType: Chart.ChartType;

    @attributes.property(collection.List, void 0, void 0, UIChart.prototype.OnDataSourceChanged)
    DataSource: collection.List<T>;

    @attributes.property(collection.List, void 0, void 0)
    Labels: collection.List<string>;

    View: HTMLCanvasElement;
    public chart: Chart;
    private _hidden: any[] = [];
    constructor(dom?: HTMLCanvasElement) {
        super(dom || document.createElement('canvas'));
        this.Change(() => {
            this.Reset();
            this.DataSource = new collection.List<T>(Object);
            this.Labels = new collection.List<string>(String);
            return void 0;
        })
    }
    initialize() {
    }
    public GetPlot(title: string) {
        return this.plots[title];
    }
    public AddPlot(title: string, selector: IDataSelector<T>, data: Chart.ChartDataSets) {
        this.RemovePlot(title);
        var plot = <IPlot<T>>{
            data: data,
            title: title, selector: selector,
            list: new collection.TransList<T, number>(Number, { ConvertA2B: selector, ConvertB2A: void 0 }, this),
            Dispose(this: IPlot<T>) {
                this.list.Source = void 0;
                this.list.Dispose();
                delete this.data; 
                delete this.list;
                delete this.selector;
                delete this.title;
            }
        };
        data.label = title;
        plot.list.Source = this.DataSource;
        this.plots[title] = plot;
    }
    public RemovePlot(title: string) {
        var plot = this.plots[title];
        delete this.plots[title];
        plot && plot.Dispose();
    }
    public Change<T>(callback: (t: this, ...args: any[]) => boolean, owner?: T, parms?: any[]) {
        this._pauseUpdate = true;
        parms = parms || [];
        parms.unshift(this);
        var x = helper.TryCatch<boolean>(owner, callback, void 0, parms) === true;
        this._pauseUpdate = false;
        if (!x) this.Update();
    }
    private _pauseUpdate: boolean;
    Update() {
        if (this._pauseUpdate || this._pauseReset || !this.IsInit) return;
        var x = <Chart.ChartDataSets[]>[];
        for (let t in this.plots) {
            var p = this.plots[t]; 
            p.data.data = p.list.AsList();
            x.push(p.data);
        }
        this.chart.config.data = <Chart.ChartData>{
            datasets: x, labels: this.Labels.AsList(),
        };
        this.chart.update();
        this.chart.resize();
    }
    private __data: Array<Chart.ChartDataSets> = [];
    private plots: { [name: string]: IPlot<T> } = {};
    private _pauseReset;
    Reset() {
        if (this._pauseReset) return;
        if (!this.IsInit) {
            this._pauseReset = true;
            this.OnInitialized = n => { delete n._pauseReset; n.Reset(); }
            return;
        }
        try {
            this.chart && this.chart.destroy();
        } catch{ }
        this.chart = null;
        this.chart = new Chart(this.View, {
            type: this.ChartType || 'line',
            data: { datasets: [], labels: [] }, options: this.Options
        });
        this.chart.config.options.responsive = true;
        this.chart.config.options.onClick = (e, x: any[]) => {
            this.Change(function (this: UIChart<T>) {
                if (!x.length) return true;
                for (var i of x) {
                    this.Labels.RemoveAt(i._index);
                    this.DataSource.RemoveAt(i._index);
                }
            }, this);
        };
        this.Update();
    }
    public Options: Chart.ChartOptions;
    get Plots() { return this.plots; }
    ClearPlots() {
        this.Change(function (this: UIChart<any>, t) {
            for (var i in this.plots) {
                try {
                    this.RemovePlot(i);
                } catch{ }
            }
            this.plots = {};
            return void 0;
        }, this);
    }
}

interface IPlot<T> {
    
    title: string;
    selector: IDataSelector<T>;
    list: collection.TransList<T, number>;
    data: Chart.ChartDataSets;
    Dispose(this: IPlot<T>);
}



export class CharTemplates {

    public static DrawNonNumeric(canvas: HTMLCanvasElement, type: Chart.ChartType, labels: string[], dataset: Chart.ChartDataSets, options?: Chart.ChartOptions) {
        //var ts = {
        //    type: 'line',
        //    data: {
        //        xLabels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        //        yLabels: ['', 'Request Added', 'Request Viewed', 'Request Accepted', 'Request Solved', 'Solving Confirmed'],
        //        datasets: [{
        //            label: 'My First dataset',
        //            data: ['', 'Request Added', 'Request Added', 'Request Added', 'Request Viewed', 'Request Viewed', 'Request Viewed'],
        //            fill: false,
        //            borderColor: window.chartColors.red,
        //            backgroundColor: window.chartColors.red
        //        }]
        //    },
        //    options: {
        //        responsive: true,
        //        title: {
        //            display: true,
        //            text: 'Chart with Non Numeric Y Axis'
        //        },
        //        scales: {
        //            xAxes: [{
        //                display: true,
        //                scaleLabel: {
        //                    display: true,
        //                    labelString: 'Month'
        //                }
        //            }],
        //            yAxes: [{
        //                type: 'category',
        //                position: 'left',
        //                display: true,
        //                scaleLabel: {
        //                    display: true,
        //                    labelString: 'Request State'
        //                },
        //                ticks: {
        //                    reverse: true
        //                }
        //            }]
        //        }
        //    }
        //}
        //return new Chart(canvas, config);

    }

    public static DrawArea(canvas: HTMLCanvasElement, type: Chart.ChartType, labels: string[], dataset: Chart.ChartDataSets, options?: Chart.ChartOptions) {
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var ds: Chart.ChartDataSets = {
            //label: title,
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            //data: void 0
        };
        if (!(ds.data instanceof Array)) throw "data in dataset null not allowed";
        for (var i in dataset)
            ds[i] = dataset[i] || ds[i];
        return new Chart(ctx, {
            type: type,
            data: {
                labels: labels,
                datasets: [ds]
            },
            options: options
        });
    }

}

attributes.ComponentParser('ichart', function (x, p) {
    var dom = x.Dom as HTMLElement;
    var c = document.createElement('canvas');
    var ctx = c.getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
            datasets: [{
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
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
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
    window['myChart'] = myChart;
    dom.appendChild(c);
    return { Break: false };
});


attributes.ComponentParser('chart', function (x, p) {
    var pdom = x.Dom as HTMLCanvasElement;
    var dom = document.createElement('canvas');
    var ui = new UIChart<number>(dom);
    //ui.Labels.AddRange(["a", "b", "c", "d", "e", "f"]);
    //ui.AddPlot('# of Votes', (_, __, a) => a, {
    //    backgroundColor: [
    //        'rgba(255, 99, 132, 0.2)',
    //        'rgba(54, 162, 235, 0.2)',
    //        'rgba(255, 206, 86, 0.2)',
    //        'rgba(75, 192, 192, 0.2)',
    //        'rgba(153, 102, 255, 0.2)',
    //        'rgba(255, 159, 64, 0.2)'
    //    ],
    //    borderColor: [
    //        'rgba(255,99,132,1)',
    //        'rgba(54, 162, 235, 1)',
    //        'rgba(255, 206, 86, 1)',
    //        'rgba(75, 192, 192, 1)',
    //        'rgba(153, 102, 255, 1)',
    //        'rgba(255, 159, 64, 1)'
    //    ],
    //    borderWidth: 1
    //});
    //ui.DataSource.AddRange([12, 19, 3, 5, 2, 3]);
    //window['myChart'] = ui;
    pdom.appendChild(dom);
    ui.Parent = x.parent.Control || x.Control || UI.Desktop.Current;
    x.e.Control = ui;
    ui.Options = {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
    return { Break: false };
});