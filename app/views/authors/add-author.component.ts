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
import { AuthorService } from '../../services/author.service';
import { TeamService } from '../../services/team.service';
import { LevelService } from '../../services/level.service';
import { PositionService } from '../../services/position.service';
import { LocationService } from '../../services/location.service';
import { ProcessMessageService } from '../../services/processmessage.service';
import { PageTitleService } from '../../services/pagetitle.service';

import { ApplicationUser, UserSession, UserIdentity, Team, Locality, Level, Position, PageTitle } from '../../helpers/classes';

@Component({
  selector: 'Add-Author-Form',
  templateUrl: './app/views/authors/add-author.component.html',
  directives: [ROUTER_DIRECTIVES, ControlMessages],
  providers: [Http, HTTP_BINDINGS, MemberService, AuthorService, TeamService, LocationService, LevelService, PositionService]
})

export class AddAuthorComponent {

  private authorForm: any;
  private newAuthor: ApplicationUser = new ApplicationUser();
  private returnedAuthor: ApplicationUser = new ApplicationUser();

  private _members: ApplicationUser[] = [];
  private _authors: ApplicationUser[] = [];
  private _teams: Team[] = [];
  private _locations: Locality[] = [];
  private _levels: Level[] = [];
  private _positions: Position[] = []; 

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
    private _teamService: TeamService,
    private _locationService: LocationService,
    private _levelService: LevelService,
    private _positionService: PositionService,
    private _pmService: ProcessMessageService,
    private _pageTitleService: PageTitleService,
    private _loggerService: LoggerService,
    private _formBuilder: FormBuilder) {

    this.authorForm = this._formBuilder.group({
          'Name': ['', Validators.compose([Validators.required, ValidationService.nameValidator])],
          'Username': ['', Validators.compose([Validators.required, ValidationService.usernameValidator])],
          'Email': ['', Validators.compose([Validators.required, ValidationService.emailValidator, ValidationService.emailDomainValidator])],
          'Phone': ['', Validators.compose([Validators.required, ValidationService.phoneValidator])],
          'Workpoint': ['', Validators.compose([Validators.required, ValidationService.workpointValidator])],
          'Manager': ['', Validators.required],
          'Level': ['', Validators.required],
          'Position': ['', Validators.required],
          'Team': ['', Validators.required],       
          'Location': ['', Validators.required],       
        });
  }

  ngOnInit() {

    this._pageTitleService.emitPageTitle(new PageTitle("Add Author"));
    this._pmService.emitRoute("nill");

    this.isRequesting = true;
    this.newAuthor.TeamId = +this._routeParams.get('teamid');

    this.getMembers();
    this.getAuthors();  
    this.getLevels();
    this.getPositions()
    this.getTeams();
    this.getLocations();
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
        }, (err: Response) => this.onError(err, "Positions"));
  }

  private getTeams() {
    this._teamService.getTeams()
      .subscribe((returnedTeams: Team[]) => {
        this._teams = returnedTeams
      }, (err: Response) => this.onError(err, "Teams"));
  }

  // get the locations based on the observable stream
  private getLocations() {
    this._locationService.getLocalities()
      .subscribe((returnedLocations: Locality[]) => {
        this._locations = returnedLocations,
        this.isRequesting = false
      }, (err: Response) => this.onError(err, "Locations"));
  }

  //****************************************************
  // SUBMIT REQUEST
  //****************************************************
  private saveAuthor() {
    if (this.authorForm.dirty && this.authorForm.valid) {
          // if we are adding a member in the team
          if (this.doesAuthorExists()) { this._pmService.emitProcessMessage("PMAUE"); }
          else { this.addAuthor(this.newAuthor); }
    }
  }

  // try to add the member to the team
  private addAuthor(author: ApplicationUser) {
    if (!author) { return; }
    this.isRequesting = true;

    this._authorService.addAuthor(author)
          .subscribe((retAuthor: ApplicationUser) => {        
            this.onSuccessAddAuthor(retAuthor);
          }
          , (error: any) => this.onError(error, "AddAuthor"));
  }


  // toggles the submitted flag which should disable the form and show the succes small form
  private onSubmit() { this.isSubmitted = true; }



  //****************************************************
  // PRIVATE METHODS
  //****************************************************
  // success, the member has been added to the team
  private onSuccessAddAuthor(passedAuthor: ApplicationUser) {
    this.isSubmitted = true;
    this.isRequesting = false;
    this.returnedAuthor = passedAuthor;
    this._pmService.emitProcessMessage("PMAAUS");
  }

  // does member already exists in the list of team members, based on the username and email provided
  private doesAuthorExists(): boolean {
    let findauthor: ApplicationUser = null;
    // Busesiness Rule: User with same user name or email can be set in a different team
    findauthor = this._authors.find(x => x.Email == this.newAuthor.Email);//&& x.TeamId == this.newAuthor.TeamId);
    if (findauthor) { return true; }
    else { return false; }

  }

  // an error has occured
  private onError(err: any, type: string) {

    let message: string = "";
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
          case "Authors":
            this._pmService.emitProcessMessage("PMGAUs");
            break;        
          case "Teams":
            this._pmService.emitProcessMessage("PMGTs");
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
