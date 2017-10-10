import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RouteParams, Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { Http, Response, HTTP_PROVIDERS } from '@angular/http';
import { CapsPipe} from '../../helpers/pipes';

import { TeamService } from '../../services/team.service';
import { LoggerService } from '../../services/logger.service';
import { ProcessMessageService } from '../../services/processmessage.service';
import { PageTitleService } from '../../services/pagetitle.service';

import { Team, PageTitle } from '../../helpers/classes';

@Component({
  selector: 'my-article',
  templateUrl: './app/views/teams/team.component.html',
  pipes: [CapsPipe],
  directives: [ROUTER_DIRECTIVES],
  providers: [TeamService]
})

export class TeamComponent {
  private componentTeam: Team = new Team();
  private errorMessage: string = null;
  private isRequesting: boolean;

  //*****************************************************
  // CONSTRUCTOR IMPLEMENTAION
  //*****************************************************
  constructor(private _routeParams: RouteParams,
    private _router: Router,
    private _teamService: TeamService,
    private _pmService: ProcessMessageService,
    private _pageTitleService: PageTitleService,
    private _loggerService: LoggerService) { }

  ngOnInit() {

    this._pmService.emitRoute("nill");
    this.isRequesting = true;
    let teamid = +this._routeParams.get('id');
    this.getTeam(teamid);
  }

  //****************************************************
  // GET TEAM
  //****************************************************   
  // get an team normal
  private getTeam(passedTeamId: number) {
    this._teamService.getTeam(passedTeamId)
      .subscribe((returnedteam: Team) => {
        this.onSuccessGetTeam(returnedteam),
          this.isRequesting = false;
      }, (error: Response) => this.onError(error, "GetTeam"));
  }


  //****************************************************
  // UPDATE TEAM
  //****************************************************   
  private updateTeam(passedTeamId: number) { }


  //****************************************************
  // PRIVATE METHODS
  //****************************************************
  // determine the team object or go back
  private onSuccessGetTeam(passedteam: Team) {
    if (passedteam) {
      this.componentTeam = passedteam;
      // called here as we need to get the team data first
      this._pageTitleService.emitPageTitle(new PageTitle("Team", this.componentTeam.TeamName));
    }
    else { this.gotoTeams(); }
  }

  // to navigate back if the article is nothing
  private gotoTeams() {
    let route = ['Teams', { id: this.componentTeam ? this.componentTeam.TeamId : null }]
    this._router.navigate(route);
  }

  // an error has occured
  private onError(err: any, type: string) {
    let message: string = "";
    // stop the spinner
    this.isRequesting = false;

    // we will log the error in the server side by calling the logger, or that is already 
    // done on the server side if the error has been caught
    this._loggerService.logErrors(err, "team page");

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
          case "GetTeam":
            this._pmService.emitProcessMessage("PMGT");
            break;
          case "UpdateTeam":
            this._pmService.emitProcessMessage("PMUT");
            break;
          default:
            this._pmService.emitProcessMessage("PMG");
        }
      }
    }
  }

}