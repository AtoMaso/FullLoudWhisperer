/// <reference path="../../../typings/tsd.d.ts" />
import { Component, OnInit } from '@angular/core';
import { RouteParams, Router, RouteConfig, RouterLink, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from '@angular/router-deprecated';
import { Http, Response, HTTP_PROVIDERS, HTTP_BINDINGS, Headers, RequestOptions } from '@angular/http';
import { FormBuilder, Validators, CORE_DIRECTIVES, FORM_DIRECTIVES, NgClass, NgStyle} from '@angular/common';
import { Observable } from 'rxjs/Observable';

import { ControlMessages } from '../controls/control-messages.component';
import { ValidationService } from '../../services/validation.service';
import { LoggerService } from '../../services/logger.service';
import { MemberService } from '../../services/member.service';
import { LocationService } from '../../services/location.service';
import { TeamService } from '../../services/team.service';
import { BusinessLineService } from '../../services/businessline.service';
import { ProcessMessageService } from '../../services/processmessage.service';
import { PageTitleService } from '../../services/pagetitle.service';

import { Team, Locality, ApplicationUser, BusinessLine, UserSession, UserIdentity, PageTitle } from '../../helpers/classes';

@Component({
    selector: 'Add-Team-Form',
    templateUrl: './app/views/teams/add.team.component.html',
    directives: [ROUTER_DIRECTIVES, ControlMessages],
    providers: [Http, HTTP_BINDINGS, TeamService, BusinessLineService, LocationService, MemberService]
})

export class AddTeamComponent {

    private isRequesting: boolean;

    private _newTeam: Team = new Team();
    private _teams: Team[] = [];
    private _locations: Locality[] = [];
    private _members: ApplicationUser[] = [];
    private _businesslines: BusinessLine[] = [];
    private isSubmitted = false;
    private teamForm: any;

    private returnedTeam: Team = new Team();

    private session: UserSession;
    private isAuthenticated: boolean = false;
    private isAllowed: boolean = false;

    private default: string = "NOT ON THE LIST";

    //*****************************************************
    // CONSTRUCTOR IMPLEMENTAION
    //*****************************************************
    constructor(private _routeParams: RouteParams,
                      private _router: Router,
                      private _teamService: TeamService,
                      private _locationService: LocationService,
                      private _memberService: MemberService,
                      private _businessLineService: BusinessLineService,
                      private _pmService: ProcessMessageService,
                      private _pageTitleService: PageTitleService,
                      private _loggerService: LoggerService,
                      private _formBuilder: FormBuilder) {

                this.teamForm = this._formBuilder.group({
                          'TeamName': ['', Validators.compose([Validators.required, ValidationService.teamNameValidator])],
                          'Description': ['', Validators.compose([Validators.required,])],
                          'TeamLead': ['', Validators.required],
                          'ProjectManager': ['', Validators.required],
                          'ProjectDirector': ['', Validators.required],
                          'Location': ['', Validators.required],
                          'BusinessLine': ['', Validators.required]
                    });
    }

    private ngOnInit() {
        this._pageTitleService.emitPageTitle(new PageTitle("Add Team"));
        this._pmService.emitRoute("nill");

        this.isRequesting = true;
        this.getMembers();
        this.getLocations();
        this.getBusinessLines();
        this.getTeams();                     
    }


    //****************************************************
    // GET DATA
    //****************************************************
    // get users
    private getMembers() {
        this._memberService.getMembers()
            .subscribe((returnedMembers: ApplicationUser[]) => {
                  this._members = returnedMembers             
                }, (error: Response) => this.onError(error, "Members"));
    }

    // get the locations
    private getLocations() {
        this._locationService.getLocalities()
            .subscribe((returnedLocations: Locality[]) => {
                  this._locations = returnedLocations       
                }, (error: Response) => this.onError(error, "Locations"));
    }

    // get the locations
    private getBusinessLines() {
        this._businessLineService.getBusinessLines()
            .subscribe((returnedBusinessLines: BusinessLine[]) => {
                  this._businesslines = returnedBusinessLines          
                }, (error: Response) => this.onError(error, "BLs"));
    }

    // get the teams
    private getTeams() {
        this._teamService.getTeams()
            .subscribe((returnedTeams: Team[]) => {
                this._teams = returnedTeams,
                this.isRequesting = false
            }, (error: Response) => this.onError(error, "Teams"));
    }


   //****************************************************
    // SUBMIT REQUEST
    //****************************************************
    private saveTeam() {
      if (this.teamForm.dirty && this.teamForm.valid) {
            if (this.doesTeamExists()) { this._pmService.emitProcessMessage("PMTE"); }
            else { this.addTeam(this._newTeam);}
        }
    }

    // add the new team
    private addTeam(team: Team) {
            if (!team) { return; }
            this.isRequesting = true;
            this._teamService.addTeam(team)
                  .subscribe((team: Team) => {
                        this._teams.push(team);
                        this.onSuccessAddTeam();
                  }
                  , (error:any) => this.onError(error, "AddTeam"));
    }

    // navigate to generic add member view
    private addNewMember() {
        if (this.isAuthenticated) {
          this._router.navigate(['AddMember']);
        }
        else { this._router.navigate(['Login']); }
    }

    // toggles the submitted flag which should disable the form and
    // show the succes small form
    private onSubmit() { this.isSubmitted = true; }


    //****************************************************
    // PRIVATE METHODS
    //****************************************************
    // success, the member has been added to the team
    private onSuccessAddTeam() {
      this.isSubmitted = true;
      this.isRequesting = false

      this.returnedTeam = this._teams.find(x => x.TeamName === this._newTeam.TeamName)
      this._pmService.emitProcessMessage("PMATS");

    }

    // does member already exists in the list of team members
    private doesTeamExists(): boolean {
        let team = this._teams.find((x: Team) => (x.TeamName === this._newTeam.TeamName))
      if (team) { return true; }
      else { return false; }
    }

    // an error has occured
    private onError(err: any, type: string) {
      let message: string = "";
      // stop the spinner
      this.isRequesting = false;

      // we will log the error in the server side by calling the logger, or that is already 
      // done on the server side if the error has been caught
      this._loggerService.logErrors(err, "add team page");

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
            case "Users":
              this._pmService.emitProcessMessage("PMGUs");
              break;
            case "BLs":
              this._pmService.emitProcessMessage("PMGBLs");
              break;
            case "Teams":
              this._pmService.emitProcessMessage("PMGTs");
              break;
            case "Locations":
              this._pmService.emitProcessMessage("PMGLos");
              break;
            case "AddTeam":
              this._pmService.emitProcessMessage("PMAT");
              break;
            default:
              this._pmService.emitProcessMessage("PMG");
          }
        }
      }


    }

}
