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
var author_service_1 = require('../../services/author.service');
var team_service_1 = require('../../services/team.service');
var level_service_1 = require('../../services/level.service');
var position_service_1 = require('../../services/position.service');
var location_service_1 = require('../../services/location.service');
var processmessage_service_1 = require('../../services/processmessage.service');
var pagetitle_service_1 = require('../../services/pagetitle.service');
var classes_1 = require('../../helpers/classes');
var UpdateAuthorComponent = (function () {
    //*****************************************************
    // CONSTRUCTOR IMPLEMENTAION
    //*****************************************************
    function UpdateAuthorComponent(_routeParams, _router, _memberService, _authorService, _teamService, _locationService, _levelService, _positionService, _pmService, _pageTitleService, _loggerService, _formBuilder) {
        this._routeParams = _routeParams;
        this._router = _router;
        this._memberService = _memberService;
        this._authorService = _authorService;
        this._teamService = _teamService;
        this._locationService = _locationService;
        this._levelService = _levelService;
        this._positionService = _positionService;
        this._pmService = _pmService;
        this._pageTitleService = _pageTitleService;
        this._loggerService = _loggerService;
        this._formBuilder = _formBuilder;
        this.newAuthor = new classes_1.ApplicationUser();
        this.returnedAuthor = new classes_1.ApplicationUser();
        this._members = [];
        this._authors = [];
        this._teams = [];
        this._locations = [];
        this._levels = [];
        this._positions = [];
        this.isSubmitted = false;
        this.isAuthenticated = false;
        this.isAllowed = false;
        this.isRequesting = false;
        this.authorForm = this._formBuilder.group({
            'Name': ['', common_1.Validators.compose([common_1.Validators.required, validation_service_1.ValidationService.nameValidator])],
            'Username': ['', common_1.Validators.compose([common_1.Validators.required, validation_service_1.ValidationService.usernameValidator])],
            'Email': ['', common_1.Validators.compose([common_1.Validators.required, validation_service_1.ValidationService.emailValidator, validation_service_1.ValidationService.emailDomainValidator])],
            'Phone': ['', common_1.Validators.compose([common_1.Validators.required, validation_service_1.ValidationService.phoneValidator])],
            'Workpoint': ['', common_1.Validators.compose([common_1.Validators.required, validation_service_1.ValidationService.workpointValidator])],
            'Manager': ['', common_1.Validators.required],
            'Level': ['', common_1.Validators.required],
            'Position': ['', common_1.Validators.required],
            'Team': ['', common_1.Validators.required],
            'Location': ['', common_1.Validators.required],
        });
    }
    UpdateAuthorComponent.prototype.ngOnInit = function () {
        this._pageTitleService.emitPageTitle(new classes_1.PageTitle("Add Author"));
        this._pmService.emitRoute("nill");
        this.isRequesting = true;
        this.newAuthor.TeamId = +this._routeParams.get('teamid');
        this.getMembers();
        this.getAuthors();
        this.getLevels();
        this.getPositions();
        this.getTeams();
        this.getLocations();
    };
    //****************************************************
    // GET DATA
    //****************************************************
    UpdateAuthorComponent.prototype.getMembers = function () {
        var _this = this;
        this._memberService.getMembers()
            .subscribe(function (returnedMembers) {
            _this._members = returnedMembers;
        }, function (err) { return _this.onError(err, "Members"); });
    };
    UpdateAuthorComponent.prototype.getAuthors = function () {
        var _this = this;
        this._authorService.getAuthors()
            .subscribe(function (returnedAuthors) {
            _this._authors = returnedAuthors;
            _this._members.concat(_this._authors);
        }, function (err) { return _this.onError(err, "Authors"); });
    };
    // get the levels based on the observable stream
    UpdateAuthorComponent.prototype.getLevels = function () {
        var _this = this;
        this._levelService.getLevels()
            .subscribe(function (returnedLevels) {
            _this._levels = returnedLevels;
        }, function (err) { return _this.onError(err, "Levels"); });
    };
    // get the positions based on the observable stream
    UpdateAuthorComponent.prototype.getPositions = function () {
        var _this = this;
        this._positionService.getPositions()
            .subscribe(function (returnedPositions) {
            _this._positions = returnedPositions;
        }, function (err) { return _this.onError(err, "Positions"); });
    };
    UpdateAuthorComponent.prototype.getTeams = function () {
        var _this = this;
        this._teamService.getTeams()
            .subscribe(function (returnedTeams) {
            _this._teams = returnedTeams;
        }, function (err) { return _this.onError(err, "Teams"); });
    };
    // get the locations based on the observable stream
    UpdateAuthorComponent.prototype.getLocations = function () {
        var _this = this;
        this._locationService.getLocalities()
            .subscribe(function (returnedLocations) {
            _this._locations = returnedLocations,
                _this.isRequesting = false;
        }, function (err) { return _this.onError(err, "Locations"); });
    };
    //****************************************************
    // SUBMIT REQUEST
    //****************************************************
    UpdateAuthorComponent.prototype.saveAuthor = function () {
        if (this.authorForm.dirty && this.authorForm.valid) {
            // if we are adding a member in the team
            if (this.doesAuthorExists()) {
                this._pmService.emitProcessMessage("PMAUE");
            }
            else {
                this.addAuthor(this.newAuthor);
            }
        }
    };
    // try to add the member to the team
    UpdateAuthorComponent.prototype.addAuthor = function (author) {
        var _this = this;
        if (!author) {
            return;
        }
        this.isRequesting = true;
        this._authorService.addAuthor(author)
            .subscribe(function (retAuthor) {
            _this.onSuccessAddAuthor(retAuthor);
        }, function (error) { return _this.onError(error, "AddAuthor"); });
    };
    // toggles the submitted flag which should disable the form and show the succes small form
    UpdateAuthorComponent.prototype.onSubmit = function () { this.isSubmitted = true; };
    //****************************************************
    // PRIVATE METHODS
    //****************************************************
    // success, the member has been added to the team
    UpdateAuthorComponent.prototype.onSuccessAddAuthor = function (passedAuthor) {
        this.isSubmitted = true;
        this.isRequesting = false;
        this.returnedAuthor = passedAuthor;
        this._pmService.emitProcessMessage("PMAAUS");
    };
    // does member already exists in the list of team members, based on the username and email provided
    UpdateAuthorComponent.prototype.doesAuthorExists = function () {
        var _this = this;
        var findauthor = null;
        // Busesiness Rule: User with same user name or email can be set in a different team
        findauthor = this._authors.find(function (x) { return x.Email == _this.newAuthor.Email; }); //&& x.TeamId == this.newAuthor.TeamId);
        if (findauthor) {
            return true;
        }
        else {
            return false;
        }
    };
    // an error has occured
    UpdateAuthorComponent.prototype.onError = function (err, type) {
        var message = "";
        // stop the spinner
        this.isRequesting = false;
        // we will log the error in the server side by calling the logger, or that is already 
        // done on the server side if the error has been caught
        this._loggerService.logErrors(err, "add member page");
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
    };
    UpdateAuthorComponent = __decorate([
        core_1.Component({
            selector: 'Update-Author-Form',
            templateUrl: './app/views/authors/update-author.component.html',
            directives: [router_deprecated_1.ROUTER_DIRECTIVES, control_messages_component_1.ControlMessages],
            providers: [http_1.Http, http_1.HTTP_BINDINGS, member_service_1.MemberService, author_service_1.AuthorService, team_service_1.TeamService, location_service_1.LocationService, level_service_1.LevelService, position_service_1.PositionService]
        }), 
        __metadata('design:paramtypes', [router_deprecated_1.RouteParams, router_deprecated_1.Router, member_service_1.MemberService, author_service_1.AuthorService, team_service_1.TeamService, location_service_1.LocationService, level_service_1.LevelService, position_service_1.PositionService, processmessage_service_1.ProcessMessageService, pagetitle_service_1.PageTitleService, logger_service_1.LoggerService, common_1.FormBuilder])
    ], UpdateAuthorComponent);
    return UpdateAuthorComponent;
}());
exports.UpdateAuthorComponent = UpdateAuthorComponent;
//# sourceMappingURL=update-author.component.js.map