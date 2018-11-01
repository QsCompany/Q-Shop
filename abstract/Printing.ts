import { bind } from "../lib/Q/sys/Corelib";

export namespace Printing {

    export class PageSettings extends bind.DObject {

        public static DPColor: bind.DProperty<Boolean, PageSettings>;
        public static DPLandscape: bind.DProperty<Boolean, PageSettings>;
        public static DPMargins: bind.DProperty<Margins, PageSettings>;
        public static DPPaperSize: bind.DProperty<PaperSize, PageSettings>;
        public static DPPaperSource: bind.DProperty<PaperSource, PageSettings>;
        public static DPPrinterResolution: bind.DProperty<PrinterResolution, PageSettings>;
        public static DPPrinterSettings: bind.DProperty<PrinterSettings, PageSettings>;
        public get Color() { return this.get<Boolean>(PageSettings.DPColor); }
        public set Color(v: Boolean) { this.set(PageSettings.DPColor, v); }
        public get Landscape() { return this.get<Boolean>(PageSettings.DPLandscape); }
        public set Landscape(v: Boolean) { this.set(PageSettings.DPLandscape, v); }
        public get Margins() { return this.get<Margins>(PageSettings.DPMargins); }
        public set Margins(v: Margins) { this.set(PageSettings.DPMargins, v); }
        public get PaperSize() { return this.get<PaperSize>(PageSettings.DPPaperSize); }
        public set PaperSize(v: PaperSize) { this.set(PageSettings.DPPaperSize, v); }
        public get PaperSource() { return this.get<PaperSource>(PageSettings.DPPaperSource); }
        public set PaperSource(v: PaperSource) { this.set(PageSettings.DPPaperSource, v); }
        public get PrinterResolution() { return this.get<PrinterResolution>(PageSettings.DPPrinterResolution); }
        public set PrinterResolution(v: PrinterResolution) { this.set(PageSettings.DPPrinterResolution, v); }
        public get PrinterSettings() { return this.get<PrinterSettings>(PageSettings.DPPrinterSettings); }
        public set PrinterSettings(v: PrinterSettings) { this.set(PageSettings.DPPrinterSettings, v); }
        static __fields__() { return [this.DPColor, this.DPLandscape, this.DPMargins, this.DPPaperSize, this.DPPaperSource, this.DPPrinterResolution, this.DPPrinterSettings]; } static ctor() {
            this.DPColor = bind.DObject.CreateField<Boolean, PageSettings>("Color", Boolean);
            this.DPLandscape = bind.DObject.CreateField<Boolean, PageSettings>("Landscape", Boolean);
            this.DPMargins = bind.DObject.CreateField<Margins, PageSettings>("Margins", Margins);
            this.DPPaperSize = bind.DObject.CreateField<PaperSize, PageSettings>("PaperSize", PaperSize);
            this.DPPaperSource = bind.DObject.CreateField<PaperSource, PageSettings>("PaperSource", PaperSource);
            this.DPPrinterResolution = bind.DObject.CreateField<PrinterResolution, PageSettings>("PrinterResolution", PrinterResolution);
            this.DPPrinterSettings = bind.DObject.CreateField<PrinterSettings, PageSettings>("PrinterSettings", PrinterSettings);
        }
    }

    export class PaperSize extends bind.DObject {

        public static DPHeight: bind.DProperty<Number, PaperSize>;
        public static DPPaperName: bind.DProperty<String, PaperSize>;
        public static DPRawKind: bind.DProperty<Number, PaperSize>;
        public static DPWidth: bind.DProperty<Number, PaperSize>;
        public get Height() { return this.get<Number>(PaperSize.DPHeight); }
        public set Height(v: Number) { this.set(PaperSize.DPHeight, v); }
        public get PaperName() { return this.get<String>(PaperSize.DPPaperName); }
        public set PaperName(v: String) { this.set(PaperSize.DPPaperName, v); }
        public get RawKind() { return this.get<Number>(PaperSize.DPRawKind); }
        public set RawKind(v: Number) { this.set(PaperSize.DPRawKind, v); }
        public get Width() { return this.get<Number>(PaperSize.DPWidth); }
        public set Width(v: Number) { this.set(PaperSize.DPWidth, v); }
        static __fields__() { return [this.DPHeight, this.DPPaperName, this.DPRawKind, this.DPWidth]; } static ctor() {
            this.DPHeight = bind.DObject.CreateField<Number, PaperSize>("Height", Number);
            this.DPPaperName = bind.DObject.CreateField<String, PaperSize>("PaperName", String);
            this.DPRawKind = bind.DObject.CreateField<Number, PaperSize>("RawKind", Number);
            this.DPWidth = bind.DObject.CreateField<Number, PaperSize>("Width", Number);
        }
    }

    export class Margins extends bind.DObject {

        public static DPLeft: bind.DProperty<Number, Margins>;
        public static DPRight: bind.DProperty<Number, Margins>;
        public static DPTop: bind.DProperty<Number, Margins>;
        public static DPBottom: bind.DProperty<Number, Margins>;
        public get Left() { return this.get<Number>(Margins.DPLeft); }
        public set Left(v: Number) { this.set(Margins.DPLeft, v); }
        public get Right() { return this.get<Number>(Margins.DPRight); }
        public set Right(v: Number) { this.set(Margins.DPRight, v); }
        public get Top() { return this.get<Number>(Margins.DPTop); }
        public set Top(v: Number) { this.set(Margins.DPTop, v); }
        public get Bottom() { return this.get<Number>(Margins.DPBottom); }
        public set Bottom(v: Number) { this.set(Margins.DPBottom, v); }
        static __fields__() { return [this.DPLeft, this.DPRight, this.DPTop, this.DPBottom]; } static ctor() {
            this.DPLeft = bind.DObject.CreateField<Number, Margins>("Left", Number);
            this.DPRight = bind.DObject.CreateField<Number, Margins>("Right", Number);
            this.DPTop = bind.DObject.CreateField<Number, Margins>("Top", Number);
            this.DPBottom = bind.DObject.CreateField<Number, Margins>("Bottom", Number);
        }
    }

    export class PaperSource extends bind.DObject {
        public static DPRawKind: bind.DProperty<Number, PaperSource>;
        public static DPSourceName: bind.DProperty<String, PaperSource>;
        public get RawKind() { return this.get<Number>(PaperSource.DPRawKind); }
        public set RawKind(v: Number) { this.set(PaperSource.DPRawKind, v); }
        public get SourceName() { return this.get<String>(PaperSource.DPSourceName); }
        public set SourceName(v: String) { this.set(PaperSource.DPSourceName, v); }
        static __fields__() { return [this.DPRawKind, this.DPSourceName]; } static ctor() {
            this.DPRawKind = bind.DObject.CreateField<Number, PaperSource>("RawKind", Number);
            this.DPSourceName = bind.DObject.CreateField<String, PaperSource>("SourceName", String);
        }
    }

    export class PrinterResolution extends bind.DObject {

        public static DPKind: bind.DProperty<PrinterResolutionKind, PrinterResolution>;
        public static DPX: bind.DProperty<Number, PrinterResolution>;
        public static DPY: bind.DProperty<Number, PrinterResolution>;
        public get Kind() { return this.get<PrinterResolutionKind>(PrinterResolution.DPKind); }
        public set Kind(v: PrinterResolutionKind) { this.set(PrinterResolution.DPKind, v); }
        public get X() { return this.get<Number>(PrinterResolution.DPX); }
        public set X(v: Number) { this.set(PrinterResolution.DPX, v); }
        public get Y() { return this.get<Number>(PrinterResolution.DPY); }
        public set Y(v: Number) { this.set(PrinterResolution.DPY, v); }
        static __fields__() { return [this.DPKind, this.DPX, this.DPY]; } static ctor() {
            this.DPKind = bind.DObject.CreateField<PrinterResolutionKind, PrinterResolution>("Kind", Number);
            this.DPX = bind.DObject.CreateField<Number, PrinterResolution>("X", Number);
            this.DPY = bind.DObject.CreateField<Number, PrinterResolution>("Y", Number);
        }
    }

    export enum PrinterResolutionKind {
        //
        // Summary:
        //     High resolution.
        High = -4,
        //
        // Summary:
        //     Medium resolution.
        Medium = -3,
        //
        // Summary:
        //     Low resolution.
        Low = -2,
        //
        // Summary:
        //     Draft-quality resolution.
        Draft = -1,
        //
        // Summary:
        //     Custom resolution.
        Custom = 0
    }

    export class PrinterSettings extends bind.DObject {

        public static DPCopies: bind.DProperty<Number, PrinterSettings>;
        public get Copies() { return this.get<Number>(PrinterSettings.DPCopies); }
        public set Copies(v: Number) { this.set(PrinterSettings.DPCopies, v); }
        public static DPCollate: bind.DProperty<Boolean, PrinterSettings>;
        public get Collate() { return this.get<Boolean>(PrinterSettings.DPCollate); }
        public set Collate(v: Boolean) { this.set(PrinterSettings.DPCollate, v); }
        public static DPDuplex: bind.DProperty<Duplex, PrinterSettings>;
        public get Duplex() { return this.get<Duplex>(PrinterSettings.DPDuplex); }
        public set Duplex(v: Duplex) { this.set(PrinterSettings.DPDuplex, v); }
        public static DPFromPage: bind.DProperty<Number, PrinterSettings>;
        public get FromPage() { return this.get<Number>(PrinterSettings.DPFromPage); }
        public set FromPage(v: Number) { this.set(PrinterSettings.DPFromPage, v); }
        public static DPMaximumPage: bind.DProperty<Number, PrinterSettings>;
        public get MaximumPage() { return this.get<Number>(PrinterSettings.DPMaximumPage); }
        public set MaximumPage(v: Number) { this.set(PrinterSettings.DPMaximumPage, v); }
        public static DPMinimumPage: bind.DProperty<Number, PrinterSettings>;
        public get MinimumPage() { return this.get<Number>(PrinterSettings.DPMinimumPage); }
        public set MinimumPage(v: Number) { this.set(PrinterSettings.DPMinimumPage, v); }
        public static DPPrintFileName: bind.DProperty<String, PrinterSettings>;
        public get PrintFileName() { return this.get<String>(PrinterSettings.DPPrintFileName); }
        public set PrintFileName(v: String) { this.set(PrinterSettings.DPPrintFileName, v); }
        public static DPPrintRange: bind.DProperty<PrintRange, PrinterSettings>;
        public get PrintRange() { return this.get<PrintRange>(PrinterSettings.DPPrintRange); }
        public set PrintRange(v: PrintRange) { this.set(PrinterSettings.DPPrintRange, v); }
        public static DPPrintToFile: bind.DProperty<Boolean, PrinterSettings>;
        public get PrintToFile() { return this.get<Boolean>(PrinterSettings.DPPrintToFile); }
        public set PrintToFile(v: Boolean) { this.set(PrinterSettings.DPPrintToFile, v); }
        public static DPPrinterName: bind.DProperty<String, PrinterSettings>;
        public get PrinterName() { return this.get<String>(PrinterSettings.DPPrinterName); }
        public set PrinterName(v: String) { this.set(PrinterSettings.DPPrinterName, v); }
        public static DPToPage: bind.DProperty<Number, PrinterSettings>;
        public get ToPage() { return this.get<Number>(PrinterSettings.DPToPage); }
        public set ToPage(v: Number) { this.set(PrinterSettings.DPToPage, v); }
        static __fields__() { return [this.DPCopies, this.DPCollate, this.DPDuplex, this.DPFromPage, this.DPMaximumPage, this.DPMinimumPage, this.DPPrintFileName, this.DPPrintRange, this.DPPrintToFile, this.DPPrinterName, this.DPToPage]; }
        static ctor() {
            this.DPCopies = bind.DObject.CreateField<Number, PrinterSettings>("Copies", Number);
            this.DPCollate = bind.DObject.CreateField<Boolean, PrinterSettings>("Collate", Boolean);
            this.DPDuplex = bind.DObject.CreateField<Duplex, PrinterSettings>("Duplex", Number);
            this.DPFromPage = bind.DObject.CreateField<Number, PrinterSettings>("FromPage", Number);
            this.DPMaximumPage = bind.DObject.CreateField<Number, PrinterSettings>("MaximumPage", Number);
            this.DPMinimumPage = bind.DObject.CreateField<Number, PrinterSettings>("MinimumPage", Number);
            this.DPPrintFileName = bind.DObject.CreateField<String, PrinterSettings>("PrintFileName", String);
            this.DPPrintRange = bind.DObject.CreateField<PrintRange, PrinterSettings>("PrintRange", Number);
            this.DPPrintToFile = bind.DObject.CreateField<Boolean, PrinterSettings>("PrintToFile", Boolean);
            this.DPPrinterName = bind.DObject.CreateField<String, PrinterSettings>("PrinterName", String);
            this.DPToPage = bind.DObject.CreateField<Number, PrinterSettings>("ToPage", Number);
        }
    }

    export enum Duplex {
        //
        // Summary:
        //     The printer's default duplex setting.
        Default = -1,
        //
        // Summary:
        //     Single-sided printing.
        Simplex = 1,
        //
        // Summary:
        //     Double-sided, vertical printing.
        Vertical = 2,
        //
        // Summary:
        //     Double-sided, horizontal printing.
        Horizontal = 3
    }

    export enum PrintRange {
        //
        // Summary:
        //     All pages are printed.
        AllPages = 0,
        //
        // Summary:
        //     The selected pages are printed.
        Selection = 1,
        //
        // Summary:
        //     The pages between System.Drawing.Printing.PrinterSettings.FromPage and System.Drawing.Printing.PrinterSettings.ToPage
        //     are printed.
        SomePages = 2,
        //
        // Summary:
        //     The currently displayed page is printed
        CurrentPage = 4194304
    }

    export class PrintDocument extends bind.DObject {

        public static DPHandler: bind.DProperty<String, PrintDocument>;
        public static DPOwnerId: bind.DProperty<Number, PrintDocument>;
        public static DPOwner: bind.DProperty<String, PrintDocument>;
        public static DPParams: bind.DProperty<Array<any>, PrintDocument>;
        public static DPPrinterSettings: bind.DProperty<PrinterSettings, PrintDocument>;
        public static DPPageSettings: bind.DProperty<PageSettings, PrintDocument>;
        public static DPResponse: bind.DProperty<Object, PrintDocument>;
        public get Handler() { return this.get<String>(PrintDocument.DPHandler); }
        public set Handler(v: String) { this.set(PrintDocument.DPHandler, v); }
        public get OwnerId() { return this.get<Number>(PrintDocument.DPOwnerId); }
        public set OwnerId(v: Number) { this.set(PrintDocument.DPOwnerId, v); }
        public get Owner() { return this.get<String>(PrintDocument.DPOwner); }
        public set Owner(v: String) { this.set(PrintDocument.DPOwner, v); }
        public get Params() { return this.get<Array<any>>(PrintDocument.DPParams); }
        public set Params(v: Array<any>) { this.set(PrintDocument.DPParams, v); }
        public get PrinterSettings() { return this.get<PrinterSettings>(PrintDocument.DPPrinterSettings); }
        public set PrinterSettings(v: PrinterSettings) { this.set(PrintDocument.DPPrinterSettings, v); }
        public get PageSettings() { return this.get<PageSettings>(PrintDocument.DPPageSettings); }
        public set PageSettings(v: PageSettings) { this.set(PrintDocument.DPPageSettings, v); }
        public get Response() { return this.get<Object>(PrintDocument.DPResponse); }
        public set Response(v: Object) { this.set(PrintDocument.DPResponse, v); }
        static __fields__() { return [this.DPHandler, this.DPOwnerId, this.DPOwner, this.DPParams, this.DPPrinterSettings, this.DPPageSettings, this.DPResponse]; } static ctor() {
        this.DPHandler = bind.DObject.CreateField<String, PrintDocument>("Handler", String);
            this.DPOwnerId = bind.DObject.CreateField<Number, PrintDocument>("OwnerId", Number);
            this.DPOwner = bind.DObject.CreateField<String, PrintDocument>("Owner", String);
            this.DPParams = bind.DObject.CreateField<Array<any>, PrintDocument>("Params", Array);
            this.DPPrinterSettings = bind.DObject.CreateField<PrinterSettings, PrintDocument>("PrinterSettings", PrinterSettings);
            this.DPPageSettings = bind.DObject.CreateField<PageSettings, PrintDocument>("PageSettings", PageSettings);
            this.DPResponse = bind.DObject.CreateField<Object, PrintDocument>("Response", Object);
        }
    }

    
    
}