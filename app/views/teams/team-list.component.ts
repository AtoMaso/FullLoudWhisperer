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

import { AuthenticationService } from '../../services/authentication.service';
import { TeamService } from '../../services/team.service';
import { LoggerService } from '../../services/logger.service';
import { ProcessMessageService } from '../../services/processmessage.service';
import { PageTitleService } from '../../services/pagetitle.service';

import { CapsPipe } from '../../helpers/pipes';
import { UserSession, UserIdentity, Authentication, PageTitle } from '../../helpers/classes'
import { Team } from '../../helpers/classes';

@Component({
    selector: 'my-content',
    templateUrl: './app/views/teams/team-list.component.html',
    pipes: [CapsPipe, PaginatePipe],
    directives: [ROUTER_DIRECTIVES, PAGINATION_DIRECTIVES, PaginationControlsCmp, SpinnerOneComponent,
                     NG_TABLE_DIRECTIVES, CORE_DIRECTIVES, FORM_DIRECTIVES, NgClass, NgIf],
    providers: [TeamService, PaginationService]
})


// implement OnInit to get the initiall lsit of articles
export class TeamListComponent implements OnInit, AfterViewInit  {
   
    private componentTeams: Array<Team> = new Array<Team>();
    public isRequesting: boolean;
    private removedTeamId: number;
    private teamIdToBeRemoved: number;

    private session: UserSession;
    private identity: UserIdentity = new UserIdentity;
    private isAuthenticated: boolean = false;
    private isAllowedToAdd: boolean = false;
    private isAllowedToRemove: boolean = false;

    // constructor which injects the service
    constructor(private _teamService: TeamService,
                     private _router: Router,       
                     private _authenticationService: AuthenticationService,  
                     private _pmService: ProcessMessageService,
                     private _pageTitleService: PageTitleService,              
                     private _loggerService: LoggerService) {       
    };

    public ngOnInit() {

      this._pageTitleService.emitPageTitle(new PageTitle("All Teams"));
      this._pmService.emitRoute("nill");

        if (sessionStorage["UserSession"] != "null") {
          try {              
                this.session = JSON.parse(sessionStorage["UserSession"])
                this.isAuthenticated = this.session.authentication.isAuthenticated;
                this.identity.roles = this.session.userIdentity.roles;
                this.IsAllowedToAddTeam();
                this.IsAllowedToRemoveTeam();
            }
            catch (ex) {
                this._pmService.emitProcessMessage("PMG");
            }
        }
        this.isRequesting = true;
        this.getTeams();

    }

    public ngAfterViewInit() {
      // ONE WAY OF PASSING VALUES TO MODAL
      //triggered when modal is about to be shown
      $('#removeAllowed').on('show.bs.modal', function (event) {
        //get data-teamid attribute of the clicked element
        var teamId = $(event.relatedTarget).data('teamid');
        var modal = $(this)
        //populate the textbox
        modal.find('input[name="teamid"]').val(teamId);
        //modal.find('.modal-body input').val(teamId);
      });
    }


    private passToModal(id: number) {
      this.teamIdToBeRemoved = id;
    }

    private IsAllowedToAddTeam() {
      // in TYPESCRIPT call to class methods containing call to "this" have to be created
      // and relevant parameters passed (roles in thsi case) and then method called on
      // that instance of the class, in this instance "identity" object. The reason for this is
      // the "this" keyword is the one of the object calling the method
      // Business Rule: teamcan a
        if (this.isAuthenticated && (this.identity.isInRole("Admin") || this.identity.isInRole("Author"))) {
              this.isAllowedToAdd = true;
        }
    }
   
    private IsAllowedToRemoveTeam() {
      // Business Rule: A team can be removed only by the Admin guy
      if (this.isAuthenticated && this.identity.isInRole("Admin")) {
        this.isAllowedToRemove = true;
      }
    }


    //*****************************************************
    // GET ARTICLES
    //*****************************************************
    private getTeams() {
        this._teamService.getTeams()
          .subscribe((returnedTeams: Team[]) => {
                    if (returnedTeams.length === 0) { this._pmService.emitProcessMessage("PMNOTs"); }
                    this.data = returnedTeams,
                    this.ChangeTable(this.configTwo),
                    this.isRequesting = false
                }, (error: Response) => this.onError(error, "GetTeams"));
    }


    //****************************************************
    // ADD TEAM
    //****************************************************
    private addTeam() {                     
        this._router.navigate(['AddTeam']);      
    }

    //****************************************************
    // REMOVE TEAM
    //****************************************************
    private removeTeam(teamId: number) {      
          this._teamService.removeTeam(teamId)
              .subscribe((removedTeam: Team) => this.onRemoveTeamSuccess(removedTeam)
              , error => this.onError(error, "RemoveTeam"));                    
    }

    // handel the response of the removing the selected member
    private onRemoveTeamSuccess(passedTeam: Team) {
        if (passedTeam) {
            this.removedTeamId = passedTeam.TeamId;
            this.ChangeTable(this.configTwo);
            //reset the removed member after the data has been updated
            // so it is ready for the next filtering or sorting of the list
            this.removedTeamId = null;       
            this._pmService.emitProcessMessage("PMRTS");
        }
        else {
            this._pmService.emitProcessMessage("PMRT");
        }
    }


    //*****************************************************
    // PRIVATE METHODS TEAMS
    //*****************************************************
    // an error has occured
    private onError(err: any, type: string) {
      let message: string = "";
      // stop the spinner
      this.isRequesting = false;

      // we will log the error in the server side by calling the logger, or that is already 
      // done on the server side if the error has been caught
      this._loggerService.logErrors(err, "team-list page");

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
            case "RemoveTeam":
              this._pmService.emitProcessMessage("PMRT");
              break;
            case "GetTeams":
              this._pmService.emitProcessMessage("PMGTs");
              break;
            default:
              this._pmService.emitProcessMessage("PMG");
          }
        }
      }
    }


    //**********************************************
    //ng2-pagination methods
    //***********************************************
    private isTNameAsc = true;
    private isPManagerAsc = true;
    private isPDirectorAsc = true;
    private isTLeadAsc = true;
    private isBLineAsc = true;
    private sortTName: string = 'desc';
    private sortPManager: string = 'desc';
    private sortPDirector: string = 'desc';
    private sortTLead: string = 'desc';
    private sortBLine: string = 'desc';

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
        filtering: { filterString: '', columnName: 'TeamName' }
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
            case 'TeamName':
                this.configTwo.sorting.columns = [{ name: 'TeamName', sort: this.sortTName }];
                this.ChangeTable(this.configTwo);
                this.isTNameAsc = !this.isTNameAsc;
                this.sortTName = this.isTNameAsc ? 'desc' : 'asc';
                break;
            case 'ProjectManager':
                this.configTwo.sorting.columns = [{ name: 'ProjectManager', sort: this.sortPManager }];
                this.ChangeTable(this.configTwo);
                this.isPManagerAsc = !this.isPManagerAsc;
                this.sortPManager = this.isPManagerAsc ? 'desc' : 'asc';
                break;
            case 'ProjectDirector':
                this.configTwo.sorting.columns = [{ name: 'ProjectDirector', sort: this.sortPDirector }];
                this.ChangeTable(this.configTwo);
                this.isPDirectorAsc = !this.isPDirectorAsc;
                this.sortPDirector = this.isPDirectorAsc ? 'desc' : 'asc';
                break;
            case 'TeamLead':
                this.configTwo.sorting.columns = [{ name: 'TeamLead', sort: this.sortTLead }];
                this.ChangeTable(this.configTwo);
                this.isTLeadAsc = !this.isTLeadAsc;
                this.sortTLead = this.isTLeadAsc ? 'desc' : 'asc';
                break;
            case 'BusinessLine':
                this.configTwo.sorting.columns = [{ name: 'BusinessLine', sort: this.sortBLine }];
                this.ChangeTable(this.configTwo);
                this.isBLineAsc = !this.isBLineAsc;
                this.sortBLine = this.isBLineAsc ? 'desc' : 'asc';
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
    private changeRemove(data: any, config:any): any {
      if (this.removedTeamId === null) { return data; }

      let removedData: Array<any> = data.filter((item: any) => (item.TeamId !== this.removedTeamId));
      this.data= null;
      this.data = removedData;
      return this.data;
    }

    // filter the removed member from the list
    private changeDefault(data: any, config: any): any {
    
      let removedDefault: Array<any> = data.filter((item: Team) => (item.TeamName !== "NOT ON THE LIST"));
      this.data = null;
      this.data = removedDefault;
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

        let removeDefault = this.changeDefault(this.data, this.configTwo);
        let removedData = this.changeRemove(removeDefault, this.configTwo);        
        let filteredData = this.changeFilter(removedData, this.configTwo);
        let sortedData = this.changeSort(filteredData, this.configTwo);
      
        this.rows = removedData;
        this.length = removedData.length;
    }

}
