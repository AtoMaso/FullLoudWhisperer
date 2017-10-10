///<reference path="../../../typings/jquery.d.ts" />
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { RouteParams, Router, RouteConfig, RouterLink, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from '@angular/router-deprecated';
import { Http, Response, HTTP_PROVIDERS, HTTP_BINDINGS, Headers, RequestOptions } from '@angular/http';
import { FormBuilder, Validators, CORE_DIRECTIVES, FORM_DIRECTIVES, NgClass, NgStyle} from '@angular/common';
import { Observable } from 'rxjs/Observable';

import { ControlMessages } from '../controls/control-messages.component';
import { ValidationService } from '../../services/validation.service';
import { LoggerService } from '../../services/logger.service';
import { MemberService } from '../../services/member.service';
import { AuthorService } from '../../services/author.service';
import { LevelService } from '../../services/level.service';
import { PositionService } from '../../services/position.service';
import { LocationService } from '../../services/location.service';
import { TeamMemberService } from '../../services/teammember.service';
import { ProcessMessageService } from '../../services/processmessage.service';
import { PageTitleService } from '../../services/pagetitle.service';

import { ApplicationUser, UserSession, UserIdentity, Team, Locality, Level, Position, TeamMember,  PageTitle } from '../../helpers/classes';

@Component({
    selector: 'Add-Member-Form',
    templateUrl: './app/views/members/add.member.component.html',
    directives: [ROUTER_DIRECTIVES, ControlMessages],
    providers: [Http, HTTP_BINDINGS, MemberService, AuthorService, LocationService, LevelService, PositionService, TeamMemberService]
})

export class AddMemberComponent implements AfterViewInit{

    private memberForm: any;
    private newMember: ApplicationUser = new ApplicationUser();
    private returnedMember: ApplicationUser = new ApplicationUser();
   
    private _members: ApplicationUser[] = [];  
    private _authors: ApplicationUser[] = [];  
    private _teams: Team[] = [];
    private _locations: Locality[] = [];
    private _levels: Level[] = [];
    private _positions: Position[] = []; 
    private _teammembers: TeamMember[] = [];
    private session: UserSession;

    private isSubmitted: boolean = false;
    private isAuthenticated: boolean = false;
    private isAllowed: boolean = false;
    private isRequesting: boolean = false;

    //*****************************************************
    // CONSTRUCTOR IMPLEMENTAION
    //*****************************************************
    constructor(private _routeParams: RouteParams,
                      private _router: Router,
                      private _memberService: MemberService,         
                      private _authorService: AuthorService,                            
                      private _locationService: LocationService,
                      private _levelService: LevelService,
                      private _positionService: PositionService,
                      private _pmService: ProcessMessageService,
                      private _pageTitleService: PageTitleService,
                      private _teamMembersService: TeamMemberService,
                      private _loggerService: LoggerService,
                      private _formBuilder: FormBuilder) {

          this.memberForm = this._formBuilder.group({
                  'Name': ['', Validators.compose([Validators.required, ValidationService.nameValidator] )],
                  'Username': ['', Validators.compose([Validators.required, ValidationService.usernameValidator])],
                  'Email': ['', Validators.compose([Validators.required, ValidationService.emailValidator, ValidationService.emailDomainValidator])] ,
                  'Phone': ['', Validators.compose([Validators.required, ValidationService.phoneValidator])],
                  'Workpoint': ['', Validators.compose([Validators.required,ValidationService.workpointValidator])],
                  'Manager': ['', Validators.required ],
                  'Level': ['', Validators.required],
                  'Position': ['', Validators.required],
                  'Location': ['', Validators.required ],
                });
    }

    ngOnInit() {

        this._pageTitleService.emitPageTitle(new PageTitle("Add Member"));
        this._pmService.emitRoute("nill");

        this.isRequesting = true;
        this.newMember.TeamId = +this._routeParams.get('teamid');
        this.getMembers();
        this.getAuthors();       
        this.getLocations();
        this.getLevels();
        this.getPositions();
        this.getTeamMembers();
    }

    public ngAfterViewInit() {
      //$('#contact').validate({
      //  errorClass: 'error has-error',
      //  validClass: 'valid has-success'
      //});
    }
   

    //****************************************************
    // GET DATA
    //****************************************************
    private getMembers() {
        this._memberService.getMembers()
            .subscribe((returnedMembers: ApplicationUser[]) => {
                this._members = returnedMembers
            }, (err: Response) => this.onError(err, "Members"));
    }

    private getAuthors() {
      this._authorService.getAuthors()
        .subscribe((returnedAuthors: ApplicationUser[]) => {
          this._authors = returnedAuthors
          this._members.concat(this._authors)
        }, (err: Response) => this.onError(err, "Authors"));
    }

    // get the locations based on the observable stream
    private getLocations() {
        this._locationService.getLocalities()
          .subscribe((returnedLocations: Locality[]) => {
                      this._locations = returnedLocations
                  }, (err: Response) => this.onError(err, "Locations"));
    }

    // get the levels based on the observable stream
    private getLevels() {
        this._levelService.getLevels()
          .subscribe((returnedLevels: Level[]) => {
                      this._levels = returnedLevels
                  }, (err: Response) => this.onError(err, "Levels"));
      }

    // get the positions based on the observable stream
    private getPositions() {
        this._positionService.getPositions()
            .subscribe((returnedPositions: Position[]) => {
                        this._positions = returnedPositions
                        this.isRequesting = false
                    }, (err: Response) => this.onError(err, "Positions"));
    }


    // this is needed to check is the user already in the team
    // based on the email and the record in the teammember table
    // not only on team id as the member can be a member of other teams
    // but will have only one record for the team id
    private getTeamMembers() {
      this._teamMembersService.getTeamMembers()
        .subscribe((returnedTeamMembers: TeamMember[]) => {
          this._teammembers = returnedTeamMembers
          this.isRequesting = false
        }, (err: Response) => this.onError(err, "TeamMembers"));
    }


   //****************************************************
    // SUBMIT REQUEST
    //****************************************************
    private saveMember() {
        if (this.memberForm.dirty && this.memberForm.valid) {
            // if we are adding a member in the team
            if (this.newMember.TeamId !== null) {
                    if (this.doesMemberExistsInTeam()) { this._pmService.emitProcessMessage("PMME");}
                    else { this.addMember(this.newMember); }
            }
        }
    }

    // try to add the member to the team
    private addMember(member: ApplicationUser) {
            if (!member) { return; }
            this.isRequesting = true;
            
            this._memberService.addMember(member)
                  .subscribe((retmember: ApplicationUser) => {
                        this._members.push(retmember);
                        this.onSuccessAddMember(retmember);
                  }
                  , (error:any) => this.onError(error, "AddMember"));
    }


    // toggles the submitted flag which should disable the form and show the succes small form
    private onSubmit() { this.isSubmitted = true; }



    //****************************************************
    // PRIVATE METHODS
    //****************************************************
    // success, the member has been added to the team
    private onSuccessAddMember(passedMember: ApplicationUser) {
        this.isSubmitted = true;
        this.isRequesting = false;      
        this.returnedMember = passedMember; 
        this._pmService.emitProcessMessage("PMAMS");
    }

    // does member already exists in the list of team members, based on the username and email provided
    // the members are all members of all teams , the teammember are records of a individual members in all teams
    private doesMemberExistsInTeam(): boolean {    
          let flag: boolean = false;    
          // Busesiness Rule: User with same user name or email can be set in a different team
          this._members.forEach(x => {
                this._teammembers.forEach(y => {
                      if (x.Email == this.newMember.Email && y.TeamId == this.newMember.TeamId) { flag = true;}
                });       
           });         
          return flag;
    }

    // an error has occured
    private onError(err: any, type: string) {

      let message: string;
      // stop the spinner
      this.isRequesting = false;

      // we will log the error in the server side by calling the logger, or that is already 
      // done on the server side if the error has been caught
      this._loggerService.logErrors(err, "add member page");

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
            case "Members":
              this._pmService.emitProcessMessage("PMGMs");
              break;          
            case "TeamMembers":
              this._pmService.emitProcessMessage("PMGTMs");
              break;                    
            case "Authors":
              this._pmService.emitProcessMessage("PMGAUs");
              break;       
            case "Levels":
              this._pmService.emitProcessMessage("PMGLs");
              break;
            case "Positions":
              this._pmService.emitProcessMessage("PMGPs");
              break;
            case "Locations":
              this._pmService.emitProcessMessage("PMGLos");
              break;
            case "AddMember":
              this._pmService.emitProcessMessage("PMAM");
              break;
            default:
              this._pmService.emitProcessMessage("PMG");
          }
        }
      }
    }
}
