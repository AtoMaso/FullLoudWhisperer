///<reference path="../../../typings/jquery.d.ts" />
import { Component, Input, OnInit, Inject, Injectable, AfterViewInit } from '@angular/core';
import { Http, Response, HTTP_PROVIDERS, HTTP_BINDINGS } from '@angular/http';
import { RouteParams, Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { CORE_DIRECTIVES, FORM_DIRECTIVES, NgClass, NgIf } from '@angular/common';
import { Observable } from 'rxjs/Observable';

import { PaginatePipe, PaginationService, PaginationControlsCmp, IPaginationInstance} from 'ng2-pagination';
import { NG_TABLE_DIRECTIVES } from 'ng2-table';
import { PAGINATION_DIRECTIVES } from 'ng2-bootstrap/ng2-bootstrap';
import { SpinnerOneComponent } from '../../blocks/spinner/spinnerone.component';

import { ArticleService } from '../../services/article.service';
import { LoggerService } from '../../services/logger.service';
import { ProcessMessageService } from '../../services/processmessage.service';
import { PageTitleService } from '../../services/pagetitle.service';

import { CapsPipe } from '../../helpers/pipes';
import {UserSession, UserIdentity, Authentication, Article, PageTitle } from '../../helpers/classes';

@Component({
    selector: 'articles-view',
    templateUrl: './app/views/articles/article-list.component.html',
    pipes: [CapsPipe, PaginatePipe],
    directives: [ROUTER_DIRECTIVES, PAGINATION_DIRECTIVES , PaginationControlsCmp, SpinnerOneComponent,
                     NG_TABLE_DIRECTIVES, CORE_DIRECTIVES, FORM_DIRECTIVES, NgClass, NgIf],
    providers: [ArticleService, PaginationService]
})


// implement OnInit to get the initiall lsit of articles
export class ArticleListComponent implements AfterViewInit, OnInit {
    private authorid: string;   
    private removedArticleId: string;
    private articleIdToBeRemoved: string;   
    private articleToRemove: Article;    

    private session: UserSession;
    private identity: UserIdentity = new UserIdentity;

    private isRequesting: boolean = false;
    private isAuthenticated: boolean = false;
    private isAllowedToAddArticle: boolean = false;
    private isAllowedToRemoveArticle: boolean = false;
    private isOwner: boolean = false;

    // constructor which injects the services
    constructor(private _routeParams: RouteParams,
                     private _articleService: ArticleService,
                     private _pmService: ProcessMessageService,
                     private _pageTitleService: PageTitleService,
                     private _router: Router,
                     private _loggerService: LoggerService) {
         
    };

    // implement OnInit to get the initial list of articles
    public ngOnInit() {
            
              if (sessionStorage["UserSession"] != "null") {
                      try {
                        this.session = JSON.parse(sessionStorage["UserSession"])
                        this.isAuthenticated = this.session.authentication.isAuthenticated;
                        this.identity.roles = this.session.userIdentity.roles;
                        this.IsAllowedToAddArticle();
                        this.IsAllowedToRemoveArticle();
                      }
                      catch (ex) {
                        this._pmService.emitProcessMessage("PMG");
                      }
              }
              this._pmService.emitRoute("nill");
              this.isRequesting = true;
              this.authorid = this._routeParams.get('id');
              // set proper title depending of what we displaying
              if (this.authorid) {
                  this._pageTitleService.emitPageTitle(new PageTitle("Author's Articles"));
              }
              else {
                  this._pageTitleService.emitPageTitle(new PageTitle("All Articles"));
              }
              // get all or author's articles
              this.getArticles(this.authorid);
    }

    public ngAfterViewInit() {
      // ONE WAY OF PASSING VALUES TO MODAL
      //triggered when modal is about to be shown
      $('#removeAllowed').on('show.bs.modal', function (event) {
        //get data-articleid attribute of the clicked element
        var artId = $(event.relatedTarget).data('articleid');
        var modal = $(this)
        //populate the textbox
        modal.find('input[name="articleid"]').val(artId);
        //modal.find('.modal-body input').val(artId);
      });
    }


    private passToModal(article:Article) {
      if (article.AuthorId == this.session.userIdentity.userId) {
        this.isOwner = true;
        this.articleIdToBeRemoved = article.ArticleId;
      }
      else {
        this.isOwner = false;
        this.articleIdToBeRemoved = null;
      }
    }

    private IsAllowedToAddArticle() {
        // in TYPESCRIPT call to class methods containing call to "this" have to be created
        // and relevant parameters passed (roles in thsi case) and then method called on
        // that instance of the class, in this instance "identity" object. The reason for this is
        // the "this" keyword is the one of the object calling the method
        if (this.isAuthenticated && this.identity.isInRole("Author") && this.identity.isInRole("Admin")) {
              this.isAllowedToAddArticle = true;
        }
    }

    private IsAllowedToRemoveArticle() {
      // in TYPESCRIPT call to class methods containing call to "this" have to be created
      // and relevant parameters passed (roles in thsi case) and then method called on
      // that instance of the class, in this instance "identity" object. The reason for this is
      // the "this" keyword is the one of the object calling the method
      if (this.isAuthenticated && this.identity.isInRole("Author")) {
            this.isAllowedToRemoveArticle = true;
      }
    }

    //*****************************************************
    // GET ARTICLES
    //*****************************************************
    private getArticles(id:string) {       
          this._articleService.getArticles(id)
            .subscribe((returnedArticles: any) => {
                if (returnedArticles.length === 0) { this._pmService.emitProcessMessage("PMNOAs"); }
                this.data = returnedArticles,
                this.isRequesting = false,
                this.ChangeTable(this.configTwo)
            } , (res: Response) => this.onError(res, "GetArticles"));
    }


    // get set of records of articles service method
    private getPageOfArticles(id:number, page: number, total: number) {    
        this._articleService.getPageOfArticles(id, page, total)
          .subscribe((returnedArticles: Article[]) => {
                if (returnedArticles.length === 0) { this._pmService.emitProcessMessage("PMNOAs"); }           
                this.data = returnedArticles,
                this.isRequesting = false,
                this.ChangeTable(this.configTwo);           
            }, (res: Response) => this.onError(res, "GetArticles"));
    }
    

    //****************************************************
    // ADD ARTICLE
    //****************************************************
    private addArticle() {            
       this._router.navigate(['AddArticle']);                    
    }


    //****************************************************
    // REMOVE ARTICLE
    //****************************************************
    private removeArticle(articleId: string) {      
          this._articleService.removeArticle(articleId)
              .subscribe((removedArticle: Article) => this.onSuccessRemoveArticle(removedArticle)
              , error => this.onError(error, "RemoveArticle"));       
    }
   
    //*****************************************************
    // PRIVATE METHODS ARTICLES
    //*****************************************************
    private onSuccessRemoveArticle(article: Article) {
      if (article) {
              this.removedArticleId = article.ArticleId;
              this.ChangeTable(this.configTwo);
              // reset the removed article after the data has been updated
              // so it is ready for the next filtering or sorting of the list
              this.removedArticleId = null;
              
              this._pmService.emitProcessMessage("PMRAS");
          }
          else {
              this._pmService.emitProcessMessage("PMRA");
          }
    }


    // an error has occured
    private onError(err: any, type:string) {
        // stop the spinner
        this.isRequesting = false;
        let message: string = "";

        // we will log the error in the server side by calling the logger, or that is already 
        // done on the server side if the error has been caught
        this._loggerService.logErrors(err, "article list page");

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
                  case "RemoveArticle":
                        this._pmService.emitProcessMessage("PMRA");
                        break;
                  case "GetArticles":
                        this._pmService.emitProcessMessage("PMGAs");
                        break;
                  default:
                        this._pmService.emitProcessMessage("PMG");
            }   
          }
        } //end if              
    }



    /**********************************************/
    //ng2-pagination methods
    /***********************************************/
    private isTitleAsc = true;
    private isCategoryAsc = true;
    private isNameAsc = true;
    private isDateAsc = true;
    private sortTitle: string = 'desc';
    private sortCategory: string = 'desc';
    private sortName: string = 'desc';
    private sortDate: string = 'desc';
    public maxSize: number = 5;
    //public directionLinks: boolean = true;
    //public autoHide: boolean = true;

    public config: IPaginationInstance = {
        id: 'advanced',
        itemsPerPage: 5,
        currentPage: 1
    };
    public numPages: number = 1;
    public length: number = 0;
    private data: Array<any> = [];
    public rows: Array<any> = [];
    public columns: Array<any> = [];
    public configTwo: any = {
        paging: true,
        sorting: { columns: [] },
        filtering: { filterString: '', columnName: 'Title' }
    };


    // method on page change of the pagination controls
    private onPageChange(passedpage: number) {
        this.config.currentPage = passedpage;
    }

    // method to toggle the desc and asc sorting of date
    private sortTable(column: string) {
        // reset the array of columns
        this.configTwo.sorting.columns = [];
        switch (column) {
            case 'Title':
                this.configTwo.sorting.columns = [{ name: 'Title', sort: this.sortTitle }];
                this.ChangeTable(this.configTwo);
                this.isTitleAsc = !this.isTitleAsc;
                this.sortTitle = this.isTitleAsc ? 'desc' : 'asc';
                break;
            case 'CategoryName':
                this.configTwo.sorting.columns = [{ name: 'CategoryName', sort: this.sortCategory }];
                this.ChangeTable(this.configTwo);
                this.isCategoryAsc = !this.isCategoryAsc;
                this.sortCategory = this.isCategoryAsc ? 'desc' : 'asc';
                break;
            case 'AuthorName':
                this.configTwo.sorting.columns = [{ name: 'AuthorName', sort: this.sortName }];
                this.ChangeTable(this.configTwo);
                this.isNameAsc = !this.isNameAsc;
                this.sortName = this.isNameAsc ? 'desc' : 'asc';
                break;
            case 'DatePublished':
                this.configTwo.sorting.columns = [{ name: 'DatePublished', sort: this.sortDate }];
                this.ChangeTable(this.configTwo);
                this.isDateAsc = !this.isDateAsc;
                this.sortDate = this.isDateAsc ? 'desc' : 'asc';
                break;
            default:
        }
    }

    // sorting of any array of any
    private changeSort(data: any, config: any) {
        if (!config.sorting) {
            return data;
        }

        let columns = this.configTwo.sorting.columns || [];
        let columnName: string = null;
        let sort: string = null;

        for (let i = 0; i < columns.length; i++) {
            if (columns[i].sort != '') {
                columnName = columns[i].name;
                sort = columns[i].sort;
            }
        }
        if (!columnName) {
            return data;
        }

        // simple sorting
        return data.sort((previous: any, current: any) => {
            if (previous[columnName] > current[columnName]) {
                return sort === 'desc' ? -1 : 1;
            } else if (previous[columnName] < current[columnName]) {
                return sort === 'asc' ? -1 : 1;
            }
            return 0;
        });
    }

    // filtering of array of any data by column name
    private changeFilter(data: any, config: any): any {
        if (!config.filtering) {
            return data;
        }
        let filteredData: Array<any> = data.filter((item: any) =>
                item[config.filtering.columnName].match(this.configTwo.filtering.filterString));

        return filteredData;
    }

    // filter the removed user from the list
    private changeRemove(data: any, config: any): any {
      if (this.removedArticleId == null) { return data; }

      let removedData: Array<any> = data.filter((item: Article) => item.ArticleId !== this.removedArticleId);
      this.data = null;
      this.data = removedData;
      return this.data;
    }


    // change of the table due to filtering and sorting
    private ChangeTable(config: any, page: any = { page: this.config.currentPage, itemsPerPage: this.config.itemsPerPage }) {
        if (config.filtering) {
            Object.assign(this.configTwo.filtering, config.filtering);
        }
        if (config.sorting) {
            Object.assign(this.configTwo.sorting, config.sorting);
        }

        let removedData = this.changeRemove(this.data, this.configTwo);
        let filteredData = this.changeFilter(removedData, this.configTwo);
        let sortedData = this.changeSort(filteredData, this.configTwo);
        this.rows = sortedData;
        this.length = sortedData.length;
    }

}



