import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RouteParams, Router } from '@angular/router-deprecated';
import { Http, Response, HTTP_PROVIDERS } from '@angular/http';
import { CapsPipe} from '../../helpers/pipes';

import { Article, PageTitle, Attachement } from '../../helpers/classes';

import { ArticleService } from '../../services/article.service';
import { LoggerService } from '../../services/logger.service';
import { ProcessMessageService } from '../../services/processmessage.service';
import { PageTitleService } from '../../services/pagetitle.service';

@Component({
  selector: 'article-view',
  templateUrl: './app/views/articles/article.component.html',
  pipes: [CapsPipe],
  providers: [ArticleService]
})

export class ArticleComponent {
  private componentArticle: Article = new Article();
  private attachements: Attachement[] = [];
  private errorMessage: string = null;
  public isRequesting: boolean;
  private isVisible: boolean = false;
  private articleid: string;

  //*****************************************************
  // CONSTRUCTOR IMPLEMENTAION
  //*****************************************************
  constructor(private _routeParams: RouteParams,
    private _router: Router,
    private _articleService: ArticleService,
    private _pmService: ProcessMessageService,
    private _pageTitleService: PageTitleService,
    private _loggerService: LoggerService) { }


  ngOnInit() {

    this._pmService.emitRoute("nill");
    this.isRequesting = true;
    this.articleid =this._routeParams.get('id');
    this.getAnArticle(this.articleid);
  }

  

  //****************************************************
  // GET ARTICLE
  //****************************************************
  private getAnArticle(id: string) {
    this._articleService.getArticle(id)
      .subscribe((returnedArticle: Article) => {
        this.onSuccessGetArticle(returnedArticle)
        this.isRequesting = false
      }, (res: Response) => this.onError(res, "GetArticle"));
  }


  //****************************************************
  // UPDATE ARTICLE
  //****************************************************
  private updateArticle(id: string) { }

  //****************************************************
  // PRIVATE METHODS
  //****************************************************
  // determine the article object or go back
  private onSuccessGetArticle(passedarticle: Article) {
    if (passedarticle) {
      this.componentArticle = passedarticle;
      this.attachements = passedarticle.Attachements;
      if (this.attachements.length > 0) {
        this.isVisible = true;
      }
      this._pageTitleService.emitPageTitle(new PageTitle("Article", this.componentArticle.Title));
    }
    else { this.gotoArticles(); }
  }

  // to navigate back if the article is nothing
  private gotoArticles() {
    let route = ['Articles', { id: this.componentArticle ? this.componentArticle.ArticleId : null }]
    this._router.navigate(route);
  }

  // an error has occured
  private onError(err: any, type: string) {

        let message: string = "";
        // stop the spinner
        this.isRequesting = false;

        // we will log the error in the server side by calling the logger, or that is already 
        // done on the server side if the error has been caught
        this._loggerService.logErrors(err, "article page");

        // we will display a fiendly process message using the process message service   
        if (err.status !== 200 || err.status !== 300) {
          let data = err.json();

          if (data.ModelState) {
            for (var key in data.ModelState) {
              for (var i = 0; i < data.ModelState[key].length; i++) {
                //errors.push(data.modelState[key][i]);
                if (message == null) { message = data.ModelState[key][i]; }
                else { message = message + data.ModelState[key][i]; } // end if else
              }// end for
            } // end for
            this._pmService.emitProcessMessage("PME", message);
          } // end if
          else {
            // we will display a fiendly process message using the process message service    
            switch (type) {
              case "GetArticle":
                this._pmService.emitProcessMessage("PMGA");
                break;
              case "UpdateArticle":
                this._pmService.emitProcessMessage("PMUA");
                break;
              default:
                this._pmService.emitProcessMessage("PMG");
            }
          }
        }
    }
}