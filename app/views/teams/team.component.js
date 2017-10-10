"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var router_deprecated_1 = require('@angular/router-deprecated');
var pipes_1 = require('../../helpers/pipes');
var team_service_1 = require('../../services/team.service');
var logger_service_1 = require('../../services/logger.service');
var processmessage_service_1 = require('../../services/processmessage.service');
var pagetitle_service_1 = require('../../services/pagetitle.service');
var classes_1 = require('../../helpers/classes');
var TeamComponent = (function () {
    //*****************************************************
    // CONSTRUCTOR IMPLEMENTAION
    //*****************************************************
    function TeamComponent(_routeParams, _router, _teamService, _pmService, _pageTitleService, _loggerService) {
        this._routeParams = _routeParams;
        this._router = _router;
        this._teamService = _teamService;
        this._pmService = _pmService;
        this._pageTitleService = _pageTitleService;
        this._loggerService = _loggerService;
        this.componentTeam = new classes_1.Team();
        this.errorMessage = null;
    }
    TeamComponent.prototype.ngOnInit = function () {
        this._pmService.emitRoute("nill");
        this.isRequesting = true;
        var teamid = +this._routeParams.get('id');
        this.getTeam(teamid);
    };
    //****************************************************
    // GET TEAM
    //****************************************************   
    // get an team normal
    TeamComponent.prototype.getTeam = function (passedTeamId) {
        var _this = this;
        this._teamService.getTeam(passedTeamId)
            .subscribe(function (returnedteam) {
            _this.onSuccessGetTeam(returnedteam),
                _this.isRequesting = false;
        }, function (error) { return _this.onError(error, "GetTeam"); });
    };
    //****************************************************
    // UPDATE TEAM
    //****************************************************   
    TeamComponent.prototype.updateTeam = function (passedTeamId) { };
    //****************************************************
    // PRIVATE METHODS
    //****************************************************
    // determine the team object or go back
    TeamComponent.prototype.onSuccessGetTeam = function (passedteam) {
        if (passedteam) {
            this.componentTeam = passedteam;
            // called here as we need to get the team data first
            this._pageTitleService.emitPageTitle(new classes_1.PageTitle("Team", this.componentTeam.TeamName));
        }
        else {
            this.gotoTeams();
        }
    };
    // to navigate back if the article is nothing
    TeamComponent.prototype.gotoTeams = function () {
        var route = ['Teams', { id: this.componentTeam ? this.componentTeam.TeamId : null }];
        this._router.navigate(route);
    };
    // an error has occured
    TeamComponent.prototype.onError = function (err, type) {
        var message = "";
        // stop the spinner
        this.isRequesting = false;
        // we will log the error in the server side by calling the logger, or that is already 
        // done on the server side if the error has been caught
        this._loggerService.logErrors(err, "team page");
        // we will display a fiendly process message using the process message service   
        if (err.status !== 200 || err.status !== 300) {
            var data = err.json();
            if (data.ModelState) {
                for (var key in data.ModelState) {
                    for (var i = 0; i < data.ModelState[key].length; i++) {
                        //errors.push(data.modelState[key][i]);
                        if (message == null) {
                            message = data.ModelState[key][i];
                        }
                        else {
                            message = message + data.ModelState[key][i];
                        } // end if else
                    } // end for
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
    };
    TeamComponent = __decorate([
        core_1.Component({
            selector: 'my-article',
            templateUrl: './app/views/teams/team.component.html',
            pipes: [pipes_1.CapsPipe],
            directives: [router_deprecated_1.ROUTER_DIRECTIVES],
            providers: [team_service_1.TeamService]
        }), 
        __metadata('design:paramtypes', [router_deprecated_1.RouteParams, router_deprecated_1.Router, team_service_1.TeamService, processmessage_service_1.ProcessMessageService, pagetitle_service_1.PageTitleService, logger_service_1.LoggerService])
    ], TeamComponent);
    return TeamComponent;
}());
exports.TeamComponent = TeamComponent;
//# sourceMappingURL=team.component.js.map