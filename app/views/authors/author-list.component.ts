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

import { AuthorService } from '../../services/author.service';
import { LoggerService } from '../../services/logger.service';
import { ProcessMessageService } from '../../services/processmessage.service';
import { PageTitleService } from '../../services/pagetitle.service';

import { CapsPipe } from '../../helpers/pipes';
import { UserSession, UserIdentity, Authentication, ApplicationUser, PageTitle } from '../../helpers/classes';

@Component({
    selector: 'my-content',
    templateUrl: './app/views/authors/author-list.component.html',
    pipes: [CapsPipe, PaginatePipe],
    directives: [ROUTER_DIRECTIVES, PAGINATION_DIRECTIVES, PaginationControlsCmp, SpinnerOneComponent,
									   NG_TABLE_DIRECTIVES, CORE_DIRECTIVES, FORM_DIRECTIVES, NgClass, NgIf],
    providers: [AuthorService, PaginationService]
})


// implement OnInit to get the initiall lsit of articles
export class AuthorListComponent implements OnInit {
    private isRequesting: boolean;
    private removedAuthorId: string = null;
    private authorIdToBeRemoved: string;

    private session: UserSession;
    private identity: UserIdentity = new UserIdentity;

    private isAuthenticated: boolean = false;
    private isAllowed: boolean = false;
    private isHimself: boolean = false;

    // constructor which injects the service
    constructor(private _router: Router,
                      private _authorService: AuthorService,      
                      private _pmService: ProcessMessageService,
                      private _pageTitleService: PageTitleService,            
                      private _loggerService: LoggerService) { };

    // implement OnInit to get the initiall lsit of articles
    public  ngOnInit() {
       
          if (sessionStorage["UserSession"] != "null") {
              try {
                  this.session = JSON.parse(sessionStorage["UserSession"])
                  this.isAuthenticated = this.session.authentication.isAuthenticated;
                  this.identity.roles = this.session.userIdentity.roles;
                  this.IsAllowedToAddAuthor();
              }
              catch (ex) {                  
                this._pmService.emitProcessMessage("PMG");
              }
        }

        this._pageTitleService.emitPageTitle(new PageTitle("All Authors"));
        this._pmService.emitRoute("nill");
        this.isRequesting = true;
        this.getAuthors();
  }

    public ngAfterViewInit() {
      // ONE WAY OF PASSING VALUES TO MODAL
      //triggered when modal is about to be shown
      $('#removeAllowed').on('show.bs.modal', function (event) {
        //get data-articleid attribute of the clicked element
        var autId = $(event.relatedTarget).data('authorid');
        var modal = $(this)
        //populate the textbox
        modal.find('input[name="authorid"]').val(autId);
        //modal.find('.modal-body input').val(autId);
      });
    }

    private passToModal(id: string) {
      if (this.session.userIdentity.userId == id) {
        this.isHimself = true;
        this.authorIdToBeRemoved = null;
      }
      else {
        this.isHimself = false;
        this.authorIdToBeRemoved = id;
      }
    }

      private IsAllowedToAddAuthor() {
          // in TYPESCRIPT call to class methods containing call to "this" have to be created
          // and relevant parameters passed (roles in thsi case) and then method called on
          // that instance of the class, in this instance "identity" object. The reason for this is
          // the "this" keyword is the one of the object calling the method
          if (this.isAuthenticated && this.identity.isInRole("Admin")) {
              this.isAllowed = true;
          }
      }


    //****************************************************
    // GET AUTHORS METHODS
    //****************************************************
    getAuthors() {       
        this._authorService.getAuthors()
          .subscribe((returnedAuthors: ApplicationUser[]) => {
                 if (returnedAuthors.length === 0) { this._pmService.emitProcessMessage("PMNOAUs"); }
                  this.data = returnedAuthors,
                  this.ChangeTable(this.configTwo),
                  this.isRequesting = false
              }, (res: Response) => this.onError(res, "Get"));      
    }
 

    //****************************************************
    // ADD AUTHOR
    //****************************************************
    private addAuthor() {
       // the check to do this operation is done on the html page
        this._router.navigate(['AddAuthor']);         
    }


    //****************************************************
    // REMOVE AUTHOR
    //****************************************************
    private removeAuthor(authorId: string) {
          // the check to do this operation is done on the html page
          this._authorService.removeAuthor(authorId)
              .subscribe((removedAuthor: ApplicationUser) => this.onSuccessRemoveAuthor(removedAuthor)
              , error => this.onError(error, "Remove"));         
    }

    // handel the response of the removing the selected member
    private onSuccessRemoveAuthor(passedAuthor: ApplicationUser) {
      if (passedAuthor) {
              this.removedAuthorId = passedAuthor.Id;
              this.ChangeTable(this.configTwo);
              // reset the removed member after the data has been updated
              // so it is ready for the next filtering or sorting of the list
              this.removedAuthorId = null;         
              this._pmService.emitProcessMessage("PMRAUS");        
        }
        else {           
              this._pmService.emitProcessMessage("PMRAU");        
        }
    }

    //****************************************************
    // PRIVATE METHODS
    //****************************************************
    // an error has occured
    private onError(err: any, type: string) {

       let message: string = "";
        // stop the spinner
        this.isRequesting = false;

        // we will log the error in the server side by calling the logger, or that is already 
        // done on the server side if the error has been caught
        this._loggerService.logErrors(err, "authors list page");

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
              case "Remove":
                this._pmService.emitProcessMessage("PMRAU");
                break;
              case "Get":
                this._pmService.emitProcessMessage("PMGAUs");
                break;
              default:
                this._pmService.emitProcessMessage("PMG");
            }
          }
        }
    }



    //**********************************************
    //ng2-pagination methods
    //**********************************************
    private isNameAsc = true;
    private isUsernameAsc = true;
    private isTeamnameAsc = true;
    private sortName: string = 'desc';
    private sortUsername: string = 'desc';
    private sortTeamname: string = 'desc';

    public maxSize: number = 5;
    public directionLinks: boolean = true;
    public autoHide: boolean = true;
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
        filtering: { filterString: '', columnName: 'Name' }
    };


    // method on page change of the pagination controls
    private onPageChange(passedpage: number) {
        this.config.currentPage = passedpage;
    }

    // change of the table due to filtering and sorting
    private ChangeTable(config: any, page: any = { page: this.config.currentPage, itemsPerPage: this.config.itemsPerPage }) {
      if (config.filtering) {
            Object.assign(this.configTwo.filtering, config.filtering);
      }
      if (config.sorting) {
            Object.assign(this.configTwo.sorting, config.sorting);
      }

      //let changeLoggon = this.changeLoggonUser(this.data, this.configTwo);
      let removedData = this.changeRemove(this.data, this.configTwo);
      let filteredData = this.changeFilter(removedData, this.configTwo);
      let sortedData = this.changeSort(filteredData, this.configTwo);
      this.rows = sortedData;
      this.length = sortedData.length;
    }

    // method to toggle the desc and asc sorting of date
    private sortTable(column: string) {
        // reset the array of columns
        this.configTwo.sorting.columns = [];
        switch (column) {
            case 'Name':
                this.configTwo.sorting.columns = [{ name: 'Name', sort: this.sortName }];
                this.ChangeTable(this.configTwo);
                this.isNameAsc = !this.isNameAsc;
                this.sortName = this.isNameAsc ? 'desc' : 'asc';
                break;
            case 'Username':
                this.configTwo.sorting.columns = [{ name: 'Username', sort: this.sortUsername }];
                this.ChangeTable(this.configTwo);
                this.isUsernameAsc = !this.isUsernameAsc;
                this.sortUsername = this.isUsernameAsc ? 'desc' : 'asc';
                break;
            case 'TeamName':
                this.configTwo.sorting.columns = [{ name: 'TeamName', sort: this.sortTeamname }];
                this.ChangeTable(this.configTwo);
                this.isTeamnameAsc = !this.isTeamnameAsc;
                this.sortTeamname = this.isTeamnameAsc ? 'desc' : 'asc';
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

    // filter the removed member from the list
    private changeRemove(data: any, config: any): any {
      if (this.removedAuthorId == null) { return data; }

      let removedData: Array<any> = data.filter((item: any) => item.Id !== this.removedAuthorId);
      this.data = null;
      this.data = removedData;
      return this.data;
    }

    // filter the loggon user from the list if it is an author
    private changeLoggonUser(data: any, config: any): any {    
      if (this.session != null) {

        let removedData: Array<any> = data.filter((item: any) => item.Id !== this.session.userIdentity.userId);
        this.data = null;
        this.data = removedData;
        return this.data;
      }
      else {
        return this.data;
      }
    }

    

}
