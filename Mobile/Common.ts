import { BuckupList, basic } from "../lib/q/sys/Corelib";
import { models } from "../abstract/Models";
import { Common, resources } from "./Resources";
import { controls } from "./Core";
import { UI } from "../lib/q/sys/UI";
import { sdata } from "../lib/q/sys/System";


export class ArticleManager {
    private static t = new controls.SimpleEdit(true);
    static createNewArticle(f: models.Facture, p: models.Product, count: number) {
        resources.GData.apis.Article.New((e) => {
            var a = e.Data;
            if (a) {                
                a.Price = p.Value;
                a.Owner = f;
                p.CurrentArticle = a;
                a.Product = p;
                a.Price = p.Value || p.PValue || p.HWValue || p.WValue;
                f.Articles.Add(a);
                this.saveArticle(f, a, count);
            } else alert('failed to create new article');
        });
    }

    static saveArticle(f: models.Facture, a: models.Article, count: number) {
        var bc = a.CreateBackup();
        a.Count = count;
        if (count)
            resources.GData.apis.Article.Save(a, (e) => {
                if (e.Error == basic.DataStat.Success) {
                    a.Commit(bc);
                } else {
                    alert('L\'article n\'est pas sauvegarder');
                    a.Rollback(bc);
                }
            });
        else
            resources.GData.apis.Article.Delete(a, (e) => {
                if (e.Error == basic.DataStat.Success) {
                    a.Commit(bc);
                    f.Articles.Remove(a);
                    a.Product.CurrentArticle = null;
                } else {
                    alert('L\'article n\'est pas sauvegarder');
                    a.Rollback(bc);
                }
            });
    }
    static deleteArticle(f: models.Facture, a: models.Article, bc?: BuckupList<models.Article>) {
        resources.GData.apis.Article.Delete(a, (e) => {
            if (e.Error == basic.DataStat.Success) {
                if (bc)
                    a.Commit(bc);
                f.Articles.Remove(a);
                a.Product.CurrentArticle = null;
            } else {
                alert('L\'article n\'est pas supprimer');
                if (bc)
                    a.Rollback(bc);
            }
        });
    }
    static editArticle(f: models.Facture, a: models.Article, p: models.Product) {
        if (!p || !f) return;
        this.t.Open((a && a.Count) || 0, true);
        if (f.IsOpen)
            this.t.OnClosed.Add((s, count, is) => {
                if (!is)
                    return;
                if (!a)
                    this.createNewArticle(f, p, count);
                else
                    this.saveArticle(f, a, count);
            });
    }
}

export class factureOpers {
    bl: BuckupList<models.Article>;
    public Facture: models.Facture; public art: models.Article; public prd: models.Product;
    public t: controls.SimpleEdit;

    Init(Facture: models.Facture, art: models.Article, prd: models.Product, t: controls.SimpleEdit) {
        this.Facture = Facture;
        this.art = art;
        this.prd = prd;
        this.t = t;
    }
    OnOptionOpening() {
        var f = this.Facture;
        if (!f || !f.IsOpen || !this.prd) return;
        this.bl = this.art && this.art.CreateBackup();
        return true;
    }
    OnOptionExecuted(e: Common.IPopEventArgs<Common.IOption>) {
        var p = this.prd;
        var a = this.art;
        var f = this.Facture;
        if (f && f.IsOpen && p)
            //if user clicked on cancel button
            if (e.Result == UI.MessageResult.cancel) {
                a && this.bl && a.Rollback(this.bl);
                this.bl = null;
                return;
            }
            //if user clicked on ok button
            else if (e.Result == UI.MessageResult.Exit) {
                e.Cancel = true;
                var pop = e.Pop;
                resources. GData.apis.Article.Save(p.CurrentArticle, (a) => {
                    if (a.Error == basic.DataStat.Success) {
                        a.Data.Commit(this.bl);
                        this.bl = null;
                        f.Recalc();
                        UI.InfoArea.push('The article wass successfully saved');
                        pop.Hide(UI.MessageResult.cancel, null);
                    }
                    else {
                        alert("Error while saving the article");
                    }
                });
            }
            //if user clicked on others buttons
            else if (e.Result == UI.MessageResult.ok) {
                e.Cancel = e.Data.Title != 'delete_sweep' && e.Data.Title != 'unarchive';
                if (a) this.exec(a, e.Data);
                else {
                    resources.GData.apis.Article.New((e1) => {
                        var a = e1.Data;
                        if (a) {
                            
                            a.Owner = f;
                            p.CurrentArticle = a;
                            a.Product = p;
                            a.Price = p.Value || p.PValue || p.HWValue || p.WValue;
                            this.Facture.Articles.Add(a);
                            f.Recalc();

                            this.exec(a, e.Data);
                        } else alert('failed to create new article');
                    });
                }
            }
    }
    
    private exec(a: models.Article, o: Common.IOption) {
        var f = this.Facture;
        if (o.Title == 'add')
            a.Count++;
        else if (o.Title == 'remove')
            a.Count--;
        else if (o.Title == 'unarchive')
            ArticleManager.editArticle(f, a, a && a.Product);
        else if (o.Title == 'delete_sweep') {
            ArticleManager.deleteArticle(f, a);
        }
    }
}