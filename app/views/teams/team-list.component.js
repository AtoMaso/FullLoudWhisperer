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
///<reference path="../../../typings/jquery.d.ts" />
var core_1 = require('@angular/core');
var router_deprecated_1 = require('@angular/router-deprecated');
var common_1 = require('@angular/common');
var ng2_pagination_1 = require('ng2-pagination');
var ng2_table_1 = require('ng2-table');
var ng2_bootstrap_1 = require('ng2-bootstrap/ng2-bootstrap');
var spinnerone_component_1 = require('../../blocks/spinner/spinnerone.component');
var authentication_service_1 = require('../../services/authentication.service');
var team_service_1 = require('../../services/team.service');
var logger_service_1 = require('../../services/logger.service');
var processmessage_service_1 = require('../../services/processmessage.service');
var pagetitle_service_1 = require('../../services/pagetitle.service');
var pipes_1 = require('../../helpers/pipes');
var classes_1 = require('../../helpers/classes');
var TeamListComponent = (function () {
    // constructor which injects the service
    function TeamListComponent(_teamService, _router, _authenticationService, _pmService, _pageTitleService, _loggerService) {
        this._teamService = _teamService;
        this._router = _router;
        this._authenticationService = _authenticationService;
        this._pmService = _pmService;
        this._pageTitleService = _pageTitleService;
        this._loggerService = _loggerService;
        this.componentTeams = new Array();
        this.identity = new classes_1.UserIdentity;
        this.isAuthenticated = false;
        this.isAllowedToAdd = false;
        this.isAllowedToRemove = false;
        //**********************************************
        //ng2-pagination methods
        //***********************************************
        this.isTNameAsc = true;
        this.isPManagerAsc = true;
        this.isPDirectorAsc = true;
        this.isTLeadAsc = true;
        this.isBLineAsc = true;
        this.sortTName = 'desc';
        this.sortPManager = 'desc';
        this.sortPDirector = 'desc';
        this.sortTLead = 'desc';
        this.sortBLine = 'desc';
        this.maxSize = 5;
        this.directionLinks = true;
        this.autoHide = true;
        this.config = {
            id: 'advanced',
            itemsPerPage: 5,
            currentPage: 1
        };
        this.numPages = 1;
        this.length = 0;
        this.data = [];
        this.rows = [];
        this.columns = [];
        this.configTwo = {
            paging: true,
            sorting: { columns: [] },
            filtering: { filterString: '', columnName: 'TeamName' }
        };
    }
    ;
    TeamListComponent.prototype.ngOnInit = function () {
        this._pageTitleService.emitPageTitle(new classes_1.PageTitle("All Teams"));
        this._pmService.emitRoute("nill");
        if (sessionStorage["UserSession"] != "null") {
            try {
                this.session = JSON.parse(sessionStorage["UserSession"]);
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
    };
    TeamListComponent.prototype.ngAfterViewInit = function () {
        // ONE WAY OF PASSING VALUES TO MODAL
        //triggered when modal is about to be shown
        $('#removeAllowed').on('show.bs.modal', function (event) {
            //get data-teamid attribute of the clicked element
            var teamId = $(event.relatedTarget).data('teamid');
            var modal = $(this);
            //populate the textbox
            modal.find('input[name="teamid"]').val(teamId);
            //modal.find('.modal-body input').val(teamId);
        });
    };
    TeamListComponent.prototype.passToModal = function (id) {
        this.teamIdToBeRemoved = id;
    };
    TeamListComponent.prototype.IsAllowedToAddTeam = function () {
        // in TYPESCRIPT call to class methods containing call to "this" have to be created
        // and relevant parameters passed (roles in thsi case) and then method called on
        // that instance of the class, in this instance "identity" object. The reason for this is
        // the "this" keyword is the one of the object calling the method
        // Business Rule: teamcan a
        if (this.isAuthenticated && (this.identity.isInRole("Admin") || this.identity.isInRole("Author"))) {
            this.isAllowedToAdd = true;
        }
    };
    TeamListComponent.prototype.IsAllowedToRemoveTeam = function () {
        // Business Rule: A team can be removed only by the Admin guy
        if (this.isAuthenticated && this.identity.isInRole("Admin")) {
            this.isAllowedToRemove = true;
        }
    };
    //*****************************************************
    // GET ARTICLES
    //*****************************************************
    TeamListComponent.prototype.getTeams = function () {
        var _this = this;
        this._teamService.getTeams()
            .subscribe(function (returnedTeams) {
            if (returnedTeams.length === 0) {
                _this._pmService.emitProcessMessage("PMNOTs");
            }
            _this.data = returnedTeams,
                _this.ChangeTable(_this.configTwo),
                _this.isRequesting = false;
        }, function (error) { return _this.onError(error, "GetTeams"); });
    };
    //****************************************************
    // ADD TEAM
    //****************************************************
    TeamListComponent.prototype.addTeam = function () {
        this._router.navigate(['AddTeam']);
    };
    //****************************************************
    // REMOVE TEAM
    //****************************************************
    TeamListComponent.prototype.removeTeam = function (teamId) {
        var _this = this;
        this._teamService.removeTeam(teamId)
            .subscribe(function (removedTeam) { return _this.onRemoveTeamSuccess(removedTeam); }, function (error) { return _this.onError(error, "RemoveTeam"); });
    };
    // handel the response of the removing the selected member
    TeamListComponent.prototype.onRemoveTeamSuccess = function (passedTeam) {
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
    };
    //*****************************************************
    // PRIVATE METHODS TEAMS
    //*****************************************************
    // an error has occured
    TeamListComponent.prototype.onError = function (err, type) {
        var message = "";
        // stop the spinner
        this.isRequesting = false;
        // we will log the error in the server side by calling the logger, or that is already 
        // done on the server side if the error has been caught
        this._loggerService.logErrors(err, "team-list page");
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
    };
    // method on page change of the pagination controls
    TeamListComponent.prototype.onPageChange = function (passedpage) {
        this.config.currentPage = passedpage;
    };
    // method to toggle the desc and asc sorting of date
    TeamListComponent.prototype.sortTable = function (column) {
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
    };
    // sorting of any array of any
    TeamListComponent.prototype.changeSort = function (data, config) {
        if (!config.sorting) {
            return data;
        }
        var columns = this.configTwo.sorting.columns || [];
        var columnName = null;
        var sort = null;
        for (var i = 0; i < columns.length; i++) {
            if (columns[i].sort != '') {
                columnName = columns[i].name;
                sort = columns[i].sort;
            }
        }
        if (!columnName) {
            return data;
        }
        // simple sorting
        return data.sort(function (previous, current) {
            if (previous[columnName] > current[columnName]) {
                return sort === 'desc' ? -1 : 1;
            }
            else if (previous[columnName] < current[columnName]) {
                return sort === 'asc' ? -1 : 1;
            }
            return 0;
        });
    };
    // filtering of array of any data by column name
    TeamListComponent.prototype.changeFilter = function (data, config) {
        var _this = this;
        if (!config.filtering) {
            return data;
        }
        var filteredData = data.filter(function (item) {
            return item[config.filtering.columnName].match(_this.configTwo.filtering.filterString);
        });
        return filteredData;
    };
    // filter the removed member from the list
    TeamListComponent.prototype.changeRemove = function (data, config) {
        var _this = this;
        if (this.removedTeamId === null) {
            return data;
        }
        var removedData = data.filter(function (item) { return (item.TeamId !== _this.removedTeamId); });
        this.data = null;
        this.data = removedData;
        return this.data;
    };
    // filter the removed member from the list
    TeamListComponent.prototype.changeDefault = function (data, config) {
        var removedDefault = data.filter(function (item) { return (item.TeamName !== "NOT ON THE LIST"); });
        this.data = null;
        this.data = removedDefault;
        return this.data;
    };
    // change of the table due to filtering and sorting
    TeamListComponent.prototype.ChangeTable = function (config, page) {
        if (page === void 0) { page = { page: this.config.currentPage, itemsPerPage: this.config.itemsPerPage }; }
        if (config.filtering) {
            Object.assign(this.configTwo.filtering, config.filtering);
        }
        if (config.sorting) {
            Object.assign(this.configTwo.sorting, config.sorting);
        }
        var removeDefault = this.changeDefault(this.data, this.configTwo);
        var removedData = this.changeRemove(removeDefault, this.configTwo);
        var filteredData = this.changeFilter(removedData, this.configTwo);
        var sortedData = this.changeSort(filteredData, this.configTwo);
        this.rows = removedData;
        this.length = removedData.length;
    };
    TeamListComponent = __decorate([
        core_1.Component({
            selector: 'my-content',
            templateUrl: './app/views/teams/team-list.component.html',
            pipes: [pipes_1.CapsPipe, ng2_pagination_1.PaginatePipe],
            directives: [router_deprecated_1.ROUTER_DIRECTIVES, ng2_bootstrap_1.PAGINATION_DIRECTIVES, ng2_pagination_1.PaginationControlsCmp, spinnerone_component_1.SpinnerOneComponent,
                ng2_table_1.NG_TABLE_DIRECTIVES, common_1.CORE_DIRECTIVES, common_1.FORM_DIRECTIVES, common_1.NgClass, common_1.NgIf],
            providers: [team_service_1.TeamService, ng2_pagination_1.PaginationService]
        }), 
        __metadata('design:paramtypes', [team_service_1.TeamService, router_deprecated_1.Router, authentication_service_1.AuthenticationService, processmessage_service_1.ProcessMessageService, pagetitle_service_1.PageTitleService, logger_service_1.LoggerService])
    ], TeamListComponent);
    return TeamListComponent;
}());
exports.TeamListComponent = TeamListComponent;
//# sourceMappingURL=team-list.component.js.map