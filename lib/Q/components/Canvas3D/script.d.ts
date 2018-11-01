import { mvc, bind, collection } from "./../../sys/Corelib";
import { UI } from '../../sys/UI';
import { Material as mtr } from '../QUI/script';
export declare module Material {
    class Canvas3D extends UI.TControl<Canvas3D> {
        Items: collection.List<mtr.ICard>;
        private cnt_galleryItems;
        private galleryItems;
        constructor();
        private count;
        setName(name: string, dom: HTMLElement, cnt: UI.JControl, e: bind.IJobScop): void;
        initialize(): void;
        static ctor(): void;
    }
    class GalleryItem extends UI.ScopicTemplateShadow {
        private data;
        private selectedIndex;
        static _template: mvc.ITemplate;
        private itemsWrapper;
        private visionTrigger;
        private Next;
        private Prev;
        private items;
        static _createScop(item: any): any;
        constructor(data?: any | bind.Scop, dom?: HTMLElement);
        setName(name: string, dom: HTMLElement, cnt: UI.JControl, e: bind.IJobScop): void;
        handleEvent(e: Event): void;
        private onVisionTriggerClick(e);
        hideNavigation(): void;
        updateNavigation(): void;
        ActiveNext: boolean;
        ActivePrev: boolean;
        readonly IsPrevActive: boolean;
        readonly IsNextActive: boolean;
        SelectedIndex: number;
        private Update();
        GoNext(): boolean;
        GoPrev(): boolean;
        private updateCss(index, remove, add);
        private showNextSlide(itemToHide, itemToShow, itemMiddle, itemToBack);
        private showPreviousSlide(itemToMiddle, itemToBack, itemToShow, itemToOut);
        private myTimer(itemToShow, stop);
        private createEvent<T>(itemToHide, events, callback, data);
        private swap();
    }
    class Template extends UI.Template {
        CreateShadow<T>(data?: T | bind.Scop): UI.TemplateShadow;
    }
}
