import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Http, Response, HTTP_PROVIDERS } from '@angular/http';
import { RouteParams, Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';

import { AuthorService } from '../../services/author.service';
import { LoggerService } from '../../services/logger.service';
import { ProcessMessageService } from '../../services/processmessage.service';
import { PageTitleService } from '../../services/pagetitle.service';

import { ApplicationUser, PageTitle } from '../../helpers/classes';

import { ArticleListComponent } from '../articles/article-list.component';
import { TeamComponent } from '../teams/team.component';


@Component({
    selector: 'my-author',
    templateUrl: './app/views/authors/author.component.html',
    directives: [ROUTER_DIRECTIVES],
    providers: [AuthorService]
})

export class AuthorComponent {
    private componentAuthor: ApplicationUser = new ApplicationUser();
    private authorid: string = null;
    public isRequesting: boolean;

    //*****************************************************
    // CONSTRUCTOR IMPLEMENTAION
    //*****************************************************
    constructor(private _routeParams: RouteParams,
                     private _router: Router,
                     private _authorService: AuthorService,
                     private _pmService: ProcessMessageService,
                     private _pageTitleService: PageTitleService,      
                     private _loggerService: LoggerService) { }


    ngOnInit() {
      
        this._pmService.emitRoute("nill");

        this.isRequesting = true;
        this.authorid = this._routeParams.get('id');
        this.getAnAuthor(this.authorid);
    }

    //****************************************************
    // GET AUTHOR
    //****************************************************
    private getAnAuthor(id: string) {
          this._authorService.getAuthor(id)
              .subscribe((returnedAuthor: ApplicationUser) => {
                         this.onSuccessGetAuthor(returnedAuthor),
                         this.isRequesting = false
                    }, (res: Response) => this.onError(res, "GetAuthor"));
    }


    //****************************************************
    // UPDATE AUTHOR
    //****************************************************
    private updateAuthor(id: string) {}


    //****************************************************
    // PRIVATE METHODS
    //**************************************************** 
    private onSuccessGetAuthor(passedauthor: ApplicationUser) {
        if (passedauthor) {
            this.componentAuthor = passedauthor;
            this._pageTitleService.emitPageTitle(new PageTitle("Author", this.componentAuthor.Name));
        }
        else { this._gotoAuthors(); }
    }

    // to navigate back if the article is nothing
    private _gotoAuthors() {
        let route = ['Authors', { id: this.componentAuthor ? this.componentAuthor.Id : null }]
        this._router.navigate(route);
    }

    private onError(err: any, type: string) {

      let message: string = "";
      // stop the spinner
      this.isRequesting = false;

      // we will log the error in the server side by calling the logger, or that is already 
      // done on the server side if the error has been caught
      this._loggerService.logErrors(err, "author page");


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
            case "GetAuthor":
              this._pmService.emitProcessMessage("PMGAU");
              break;
            case "UpdateAuthor":
              this._pmService.emitProcessMessage("PMUAU");
              break;
            default:
              this._pmService.emitProcessMessage("PMG");
          }
        }
      }

    }
}
