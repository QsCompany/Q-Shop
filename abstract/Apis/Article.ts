import { UI } from '../../lib/Q/sys/UI';
import { basic } from '../../lib/Q/sys/corelib';
import { models } from '../Models';
import { MyApi, EMyApi, DBCallback, APIEventArgs,APIEventHandler } from '../extra/AdminApis';
import { basics } from '../extra/Basics';



export class Article extends EMyApi<models.Article, models.Articles> {
    protected GetArrayType() {
        return models.Articles;
    }
    protected GetArgType() {
        return models.Article;
    }    
    protected NativeCreateItem(id: number): models.Article {
        return new models.Article(id);
    }
    Check(data: models.Article, callback: APIEventHandler<models.Article, models.Articles>) {
        this.callback(callback, data, (data && data.Product) != null);
    }
    constructor(_vars: basics.vars) {
        super(_vars, 'Article.edit');
    }
    getDefaultList() { return void 0; }

}