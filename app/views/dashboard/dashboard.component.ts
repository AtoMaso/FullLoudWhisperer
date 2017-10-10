import { Component,  OnInit, Inject, Injectable } from '@angular/core';
import { Http, Response, HTTP_PROVIDERS, HTTP_BINDINGS } from '@angular/http';
import { ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from '@angular/router-deprecated';
import { Observable } from 'rxjs/Rx';

import { ArticleService } from '../../services/article.service';
import { SpinnerOneComponent } from '../../blocks/spinner/spinnerone.component';
import { LoggerService } from '../../services/logger.service';
import { ProcessMessageService } from '../../services/processmessage.service';
import { PageTitleService } from '../../services/pagetitle.service';

//import our Carousel Component
import { CSSCarouselComponent } from '../controls/carousel.component';
import { ArticleComponent } from '../articles/article.component';
import { AuthorComponent } from '../authors/author.component';

import { TopArticlesPipe, SortDatePipe } from '../../helpers/pipes';
import { Article, PageTitle } from '../../helpers/classes';

@Component({
    selector: 'dashboard-view',
    templateUrl: './app/views/dashboard/dashboard.component.html',
    styles: ['../../../assets/css/carousel.css'],
    pipes: [TopArticlesPipe, SortDatePipe] ,
    directives: [ROUTER_DIRECTIVES, SpinnerOneComponent, CSSCarouselComponent],
    providers: [ArticleService]
})

// implement OnInit to get the initiall lsit of articles
export class DashboardComponent implements OnInit {

    private componentArticles: Array<Article> = new Array<Article>();
    public isRequesting: boolean;
    private itself: DashboardComponent = this;

    // constructor which injects the service
    constructor(private _articleService: ArticleService,
                      private _pmService: ProcessMessageService,
                      private _pageTitleService:PageTitleService,
                      private _loggerService: LoggerService) {};

    // component cycle event
   public ngOnInit()  {
          this._pmService.emitRoute("nill");
          this._pageTitleService.emitPageTitle(new PageTitle("Whisperer Latest"));   
          this.isRequesting = true;       
          this.getArticles();
    }


    //*****************************************************
    // GET ARTICLES
    //*****************************************************
    private getArticles() {      
          this._articleService.getArticles()
            .subscribe(
            (returnedArticles: Article[]) => {
                this.componentArticles = returnedArticles,
                this.isRequesting = false
            }
            ,(res: Response) => this.onError(res));    
    }


    //******************************************************
    // PRIVATE METHODS
    //******************************************************
    // an error has occured
    private onError(res: any) {

        // stop the spinner
        this.isRequesting = false;

        // we will log the error in the server side by calling the logger, or that is already 
        // done on the server side if the error has been caught
        this._loggerService.logErrors(res, "dashboard page");

        // we will display a fiendly process message using the process message service             
        this._pmService.emitProcessMessage("PMGA");

      
    } 
}
