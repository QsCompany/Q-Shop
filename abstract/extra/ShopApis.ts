

import { Agent, SMS } from '../Apis/Agent';
import { Article } from '../Apis/Article';
import { Category } from '../Apis/Category';
import { Client1 } from '../Apis/Client';
import { Projet } from '../Apis/Projet';
import { SFacture, Command } from '../Apis/FactureAchat';
import { Facture } from '../Apis/FactureVent';
import { Fournisseur } from '../Apis/Fournisseur';
import { Product } from '../Apis/Product';
import { Revage } from '../Apis/Revage';
import { Versment } from '../Apis/Versment';
import { SVersment } from '../Apis/SVersment';
import { basics } from './Basics';
import { net } from '../../lib/Q/sys/corelib';

export class ShopApis
{
    private vars:basics.vars;
    public Agent: Agent;
    public Article: Article;
    
    public Category: Category;
    public Client: Client1;
    public Projet: Projet;
    public SFacture: SFacture;
    public Facture: Facture;
    public Fournisseur: Fournisseur;
    public Product: Product;
    public Revage: Revage;
    public Versment: Versment;
    public SVersment: SVersment;
    public Command: Command;
    public Sms: SMS;
    constructor() {
    }
    Init(vars:basics.vars):this {
        this.vars = vars;
        this.Agent = new Agent(vars);
        this.Article = new Article(vars);
        this.Client = new Client1(vars);
        this.Category = new Category(vars);
        this.SFacture = new SFacture(vars);
        this.Facture = new Facture(vars);
        this.Fournisseur = new Fournisseur(vars);
        this.Product = new Product(vars);
        this.Revage = new Revage(vars);
        this.Versment = new Versment(vars);
        this.SVersment = new SVersment(vars);
        this.Projet = new Projet(vars);
        this.Command = new Command(vars);
        this.Sms = new SMS(vars);
        return this;
    }
}
