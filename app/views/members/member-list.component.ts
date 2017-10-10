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

import { MemberService } from '../../services/member.service';
import { LoggerService } from '../../services/logger.service';
import { TeamService } from '../../services/team.service';
import { ProcessMessageService } from '../../services/processmessage.service';
import { PageTitleService } from '../../services/pagetitle.service';

import { CapsPipe } from '../../helpers/pipes';
import { UserSession, UserIdentity, Authentication} from '../../helpers/classes';
import { Team, ApplicationUser, PageTitle } from '../../helpers/classes';

@Component({
    selector: 'member-list',
    templateUrl: './app/views/members/member-list.component.html',
    pipes: [CapsPipe, PaginatePipe],
    directives: [ROUTER_DIRECTIVES, PAGINATION_DIRECTIVES, PaginationControlsCmp, SpinnerOneComponent,
                     NG_TABLE_DIRECTIVES, CORE_DIRECTIVES, FORM_DIRECTIVES, NgClass, NgIf],
    providers: [MemberService, TeamService, PaginationService]
})


// implement OnInit to get the initiall lsit of articles
export class MemberListComponent implements OnInit, AfterViewInit {

    private teamid: number;
    private removedMemberId: string = null;
    private memberIdToBeRemoved: string;
    private isRequesting: boolean;
    private team: Team = new Team();

    private session: UserSession;
    private identity: UserIdentity = new UserIdentity;
    private isAuthenticated: boolean = false;
    private isAllowed: boolean = false;
    private isManager: boolean = false;

    // constructor which injects the service
    constructor(private _memberService: MemberService,
                        private _teamService: TeamService,
                        private _pmService: ProcessMessageService,
                        private _pageTitleService: PageTitleService,
                        private _loggerService: LoggerService,
                        private _router: Router,
                        private _routeParams: RouteParams) { };

    // implement OnInit to get the initiall lsit of articles
    public ngOnInit() {
        this._pmService.emitRoute("nill");
        this.teamid = +this._routeParams.get('teamid');
        this.getMembers(this.teamid);
              
        if (sessionStorage["UserSession"] != 'null') {                    
                try {
                        this.session = JSON.parse(sessionStorage["UserSession"])
                        this.isAuthenticated = this.session.authentication.isAuthenticated;
                        this.identity.roles = this.session.userIdentity.roles;                        
                }
                catch (ex) {
                        this._pmService.emitProcessMessage("PMG");
                }
        }        
    }


    public ngAfterViewInit() {
      // ONE WAY OF PASSING VALUES TO MODAL
      //triggered when modal is about to be shown
      $('#removeAllowed').on('show.bs.modal', function (event) {
        //get data-memberid attribute of the clicked element
        var memId = $(event.relatedTarget).data('memberid');
        var modal = $(this)
        //populate the textbox
        modal.find('input[name="memberid"]').val(memId);
        //modal.find('.modal-body input').val(memId);

      });
    }

    // passes the neccessary member to be removed butchecks if the member is manager
    private passToModal(memberToDelete: ApplicationUser) {     
       // Business Rule : the managers can not be removed before the manager of that team is updated
      if (memberToDelete.Id == this.team.TeamLeadId ||
          memberToDelete.Id == this.team.ProjectDirectorId ||
          memberToDelete.Id == this.team.ProjectManagerId) {        

            this.isManager = true;
            this.memberIdToBeRemoved = null;
      }
      else {
            this.isManager = false;
            this.memberIdToBeRemoved = memberToDelete.Id;
      }
    }

    // checks is the logged on user allowed to delete member
    private IsAllowedToAddRemoveMember() {
        // in TYPESCRIPT call to class methods containing call to "this" have to be created
        // and relevant parameters passed (roles in thsi case) and then method called on
        // that instance of the class, in this instance "identity" object. The reason for this is
        // the "this" keyword is the one of the object calling the method
        if (this.isAuthenticated) {
              // Business Rule: A member can be added or removed by the Admin or teamlead, director or manager
              if (this.identity.isInRole("Admin") ||
                  this.session.userIdentity.userId.includes(this.team.TeamLeadId) ||           
                  this.session.userIdentity.userId.includes(this.team.ProjectManagerId) ||
                  this.session.userIdentity.userId.includes(this.team.ProjectDirectorId)) {            
                    // Business Rule : the team member can be added/removed by the team lead, director, manager or Admin user of the app
                    this.isAllowed = true;          
            }
        }
    }


    //****************************************************
    // GET MEMBERS
    //****************************************************
    private getMembers(passedTeamId:number) {        
        this._memberService.getMembers(passedTeamId)
          .subscribe((returnedMembers: ApplicationUser[]) => {
                if (returnedMembers.length === 0) { this._pmService.emitProcessMessage("PMNOMs"); }
                this.data = returnedMembers,
                this.getTeam(passedTeamId);}   // called here as we need to get complete data
            , (error: Response) => this.onError(error, "GetMembers"));        
    }


    private getTeam(passedTeamId: number) {
        this._teamService.getTeam(passedTeamId)
          .subscribe((returnedTeam: Team) => { 
                    this.isRequesting = false,
                    this.team = returnedTeam,
                    this.ChangeTable(this.configTwo),
                    this._pageTitleService.emitPageTitle(new PageTitle("Team Members", returnedTeam.TeamName));
                    // called here because it needs the teamleadid of the team we are removing the member from    
                    this.IsAllowedToAddRemoveMember();              
            }), (error: Response) => this.onError(error, "GetTeam");          
    }


    //****************************************************
    // ADD MEMBER
    //****************************************************
    private addMember(passedTeamId: number) {     
      this._router.navigate(['AddMember', { teamid: passedTeamId }]);          
    }


    //****************************************************
    // REMOVE MEMBER // member is ApplicationUser
    //****************************************************
    private removeMember(memberId: string) {           
      this._memberService.removeMember(memberId, this.teamid)
          .subscribe((removedMember: ApplicationUser) => this.onSuccessRemoveMember(removedMember)
          , error => this.onError(error, "RemoveMember"));    
    }

    //****************************************************
    // PRIVATE METHODS // member is ApplicationUser
    //****************************************************
    private onSuccessRemoveMember(passedMember: ApplicationUser) {
      if (passedMember) {
                this.removedMemberId = passedMember.Id;
                this.ChangeTable(this.configTwo);
                // reset the removed member after the data has been updated
                // so it is ready for the next filtering or sorting of the list
                this.removedMemberId = null;
                this._pmService.emitProcessMessage("PMRMS");
          }
          else {
                this._pmService.emitProcessMessage("PMRM");
          }
    }

    // an error has occured
    private onError(err: any, type:string) {

       let message: string = "";
        // stop the spinner regardless of the results
        this.isRequesting = false;

        // we will log the error in the server side by calling the logger
        this._loggerService.logErrors(err, "memberlist");

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
              case "RemoveMember":
                this._pmService.emitProcessMessage("PMRM");
                break;
              case "GetMembers":
                this._pmService.emitProcessMessage("PMGMs");
                break;
              case "GetTeam":
                this._pmService.emitProcessMessage("PMGT");
                break;
              default:
                this._pmService.emitProcessMessage("PMG");
            }
          }
        }
    }

    

    //***********************************************
    //ng2-pagination methods
    //***********************************************
    private isNameAsc = true;
    private isUsernameAsc = true;
    private isLevelAsc = true;
    private isPositionAsc = true;
    private isManagerAsc = true;
    private sortName: string = 'desc';
    private sortUsername: string = 'desc';
    private sortLevel: string = 'desc';
    private sortPosition: string = 'desc';
    private sortManager: string = 'desc';

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
            case 'LevelTitle':
                this.configTwo.sorting.columns = [{ name: 'LevelTitle', sort: this.sortLevel }];
                this.ChangeTable(this.configTwo);
                this.isLevelAsc = !this.isLevelAsc;
                this.sortLevel = this.isLevelAsc ? 'desc' : 'asc';
                break;
            case 'PositionTitle':
                this.configTwo.sorting.columns = [{ name: 'PositionTitle', sort: this.sortPosition }];
                this.ChangeTable(this.configTwo);
                this.isPositionAsc = !this.isPositionAsc;
                this.sortPosition = this.isPositionAsc ? 'desc' : 'asc';
                break;
            case 'MemberManager':
                this.configTwo.sorting.columns = [{ name: 'MemberManager', sort: this.sortManager }];
                this.ChangeTable(this.configTwo);
                this.isManagerAsc = !this.isManagerAsc;
                this.sortManager = this.isManagerAsc ? 'desc' : 'asc';
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
      if (this.removedMemberId == null) { return data; }

      let removedData: Array<any> = data.filter((item: any) => item.Id !== this.removedMemberId);
      this.data= null;
      this.data = removedData;
      return this.data;
    }

    // remove the managers from the list of members
    private changeManagers(data: any, config: any): any {
      
      // Business Rule: the director can not be deleted 
      // Business Rule: the manager can not be deleted
      // Business Rule: the team lead can not be deleted
      // Business Rule: the director can be updated by Admin or itself
      // Business Rule: the manager can be updated by director, Admin or itself   
      // Business Rule: the team lead can be updated by director, manager, Admin or itself   
      let changedData: Array<ApplicationUser> = data.filter((item: any) => item.Id !== this.team.TeamLeadId);
      changedData = changedData.filter((item: any) => item.Id !== this.team.ProjectManagerId);
      changedData = changedData.filter((item: any) => item.Id !== this.team.ProjectDirectorId);

      this.data = null;
      this.data = changedData;
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

        // TODO we will show the team lead, manager and director but we will stop of deleting them
        //let managersData = this.changeManagers(this.data, this.configTwo);
        let removedData = this.changeRemove(this.data, this.configTwo);
        let filteredData = this.changeFilter(removedData, this.configTwo);
        let sortedData = this.changeSort(filteredData, this.configTwo);           
        this.rows = sortedData;
        this.length = sortedData.length;
    }

}
