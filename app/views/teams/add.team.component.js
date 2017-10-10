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
/// <reference path="../../../typings/tsd.d.ts" />
var core_1 = require('@angular/core');
var router_deprecated_1 = require('@angular/router-deprecated');
var http_1 = require('@angular/http');
var common_1 = require('@angular/common');
var control_messages_component_1 = require('../controls/control-messages.component');
var validation_service_1 = require('../../services/validation.service');
var logger_service_1 = require('../../services/logger.service');
var member_service_1 = require('../../services/member.service');
var location_service_1 = require('../../services/location.service');
var team_service_1 = require('../../services/team.service');
var businessline_service_1 = require('../../services/businessline.service');
var processmessage_service_1 = require('../../services/processmessage.service');
var pagetitle_service_1 = require('../../services/pagetitle.service');
var classes_1 = require('../../helpers/classes');
var AddTeamComponent = (function () {
    //*****************************************************
    // CONSTRUCTOR IMPLEMENTAION
    //*****************************************************
    function AddTeamComponent(_routeParams, _router, _teamService, _locationService, _memberService, _businessLineService, _pmService, _pageTitleService, _loggerService, _formBuilder) {
        this._routeParams = _routeParams;
        this._router = _router;
        this._teamService = _teamService;
        this._locationService = _locationService;
        this._memberService = _memberService;
        this._businessLineService = _businessLineService;
        this._pmService = _pmService;
        this._pageTitleService = _pageTitleService;
        this._loggerService = _loggerService;
        this._formBuilder = _formBuilder;
        this._newTeam = new classes_1.Team();
        this._teams = [];
        this._locations = [];
        this._members = [];
        this._businesslines = [];
        this.isSubmitted = false;
        this.returnedTeam = new classes_1.Team();
        this.isAuthenticated = false;
        this.isAllowed = false;
        this.default = "NOT ON THE LIST";
        this.teamForm = this._formBuilder.group({
            'TeamName': ['', common_1.Validators.compose([common_1.Validators.required, validation_service_1.ValidationService.teamNameValidator])],
            'Description': ['', common_1.Validators.compose([common_1.Validators.required,])],
            'TeamLead': ['', common_1.Validators.required],
            'ProjectManager': ['', common_1.Validators.required],
            'ProjectDirector': ['', common_1.Validators.required],
            'Location': ['', common_1.Validators.required],
            'BusinessLine': ['', common_1.Validators.required]
        });
    }
    AddTeamComponent.prototype.ngOnInit = function () {
        this._pageTitleService.emitPageTitle(new classes_1.PageTitle("Add Team"));
        this._pmService.emitRoute("nill");
        this.isRequesting = true;
        this.getMembers();
        this.getLocations();
        this.getBusinessLines();
        this.getTeams();
    };
    //****************************************************
    // GET DATA
    //****************************************************
    // get users
    AddTeamComponent.prototype.getMembers = function () {
        var _this = this;
        this._memberService.getMembers()
            .subscribe(function (returnedMembers) {
            _this._members = returnedMembers;
        }, function (error) { return _this.onError(error, "Members"); });
    };
    // get the locations
    AddTeamComponent.prototype.getLocations = function () {
        var _this = this;
        this._locationService.getLocalities()
            .subscribe(function (returnedLocations) {
            _this._locations = returnedLocations;
        }, function (error) { return _this.onError(error, "Locations"); });
    };
    // get the locations
    AddTeamComponent.prototype.getBusinessLines = function () {
        var _this = this;
        this._businessLineService.getBusinessLines()
            .subscribe(function (returnedBusinessLines) {
            _this._businesslines = returnedBusinessLines;
        }, function (error) { return _this.onError(error, "BLs"); });
    };
    // get the teams
    AddTeamComponent.prototype.getTeams = function () {
        var _this = this;
        this._teamService.getTeams()
            .subscribe(function (returnedTeams) {
            _this._teams = returnedTeams,
                _this.isRequesting = false;
        }, function (error) { return _this.onError(error, "Teams"); });
    };
    //****************************************************
    // SUBMIT REQUEST
    //****************************************************
    AddTeamComponent.prototype.saveTeam = function () {
        if (this.teamForm.dirty && this.teamForm.valid) {
            if (this.doesTeamExists()) {
                this._pmService.emitProcessMessage("PMTE");
            }
            else {
                this.addTeam(this._newTeam);
            }
        }
    };
    // add the new team
    AddTeamComponent.prototype.addTeam = function (team) {
        var _this = this;
        if (!team) {
            return;
        }
        this.isRequesting = true;
        this._teamService.addTeam(team)
            .subscribe(function (team) {
            _this._teams.push(team);
            _this.onSuccessAddTeam();
        }, function (error) { return _this.onError(error, "AddTeam"); });
    };
    // navigate to generic add member view
    AddTeamComponent.prototype.addNewMember = function () {
        if (this.isAuthenticated) {
            this._router.navigate(['AddMember']);
        }
        else {
            this._router.navigate(['Login']);
        }
    };
    // toggles the submitted flag which should disable the form and
    // show the succes small form
    AddTeamComponent.prototype.onSubmit = function () { this.isSubmitted = true; };
    //****************************************************
    // PRIVATE METHODS
    //****************************************************
    // success, the member has been added to the team
    AddTeamComponent.prototype.onSuccessAddTeam = function () {
        var _this = this;
        this.isSubmitted = true;
        this.isRequesting = false;
        this.returnedTeam = this._teams.find(function (x) { return x.TeamName === _this._newTeam.TeamName; });
        this._pmService.emitProcessMessage("PMATS");
    };
    // does member already exists in the list of team members
    AddTeamComponent.prototype.doesTeamExists = function () {
        var _this = this;
        var team = this._teams.find(function (x) { return (x.TeamName === _this._newTeam.TeamName); });
        if (team) {
            return true;
        }
        else {
            return false;
        }
    };
    // an error has occured
    AddTeamComponent.prototype.onError = function (err, type) {
        var message = "";
        // stop the spinner
        this.isRequesting = false;
        // we will log the error in the server side by calling the logger, or that is already 
        // done on the server side if the error has been caught
        this._loggerService.logErrors(err, "add team page");
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
    };
    AddTeamComponent = __decorate([
        core_1.Component({
            selector: 'Add-Team-Form',
            templateUrl: './app/views/teams/add.team.component.html',
            directives: [router_deprecated_1.ROUTER_DIRECTIVES, control_messages_component_1.ControlMessages],
            providers: [http_1.Http, http_1.HTTP_BINDINGS, team_service_1.TeamService, businessline_service_1.BusinessLineService, location_service_1.LocationService, member_service_1.MemberService]
        }), 
        __metadata('design:paramtypes', [router_deprecated_1.RouteParams, router_deprecated_1.Router, team_service_1.TeamService, location_service_1.LocationService, member_service_1.MemberService, businessline_service_1.BusinessLineService, processmessage_service_1.ProcessMessageService, pagetitle_service_1.PageTitleService, logger_service_1.LoggerService, common_1.FormBuilder])
    ], AddTeamComponent);
    return AddTeamComponent;
}());
exports.AddTeamComponent = AddTeamComponent;
//# sourceMappingURL=add.team.component.js.map