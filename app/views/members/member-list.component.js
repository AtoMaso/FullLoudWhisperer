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
var member_service_1 = require('../../services/member.service');
var logger_service_1 = require('../../services/logger.service');
var team_service_1 = require('../../services/team.service');
var processmessage_service_1 = require('../../services/processmessage.service');
var pagetitle_service_1 = require('../../services/pagetitle.service');
var pipes_1 = require('../../helpers/pipes');
var classes_1 = require('../../helpers/classes');
var classes_2 = require('../../helpers/classes');
var MemberListComponent = (function () {
    // constructor which injects the service
    function MemberListComponent(_memberService, _teamService, _pmService, _pageTitleService, _loggerService, _router, _routeParams) {
        this._memberService = _memberService;
        this._teamService = _teamService;
        this._pmService = _pmService;
        this._pageTitleService = _pageTitleService;
        this._loggerService = _loggerService;
        this._router = _router;
        this._routeParams = _routeParams;
        this.removedMemberId = null;
        this.team = new classes_2.Team();
        this.identity = new classes_1.UserIdentity;
        this.isAuthenticated = false;
        this.isAllowed = false;
        this.isManager = false;
        //***********************************************
        //ng2-pagination methods
        //***********************************************
        this.isNameAsc = true;
        this.isUsernameAsc = true;
        this.isLevelAsc = true;
        this.isPositionAsc = true;
        this.isManagerAsc = true;
        this.sortName = 'desc';
        this.sortUsername = 'desc';
        this.sortLevel = 'desc';
        this.sortPosition = 'desc';
        this.sortManager = 'desc';
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
            filtering: { filterString: '', columnName: 'Name' }
        };
    }
    ;
    // implement OnInit to get the initiall lsit of articles
    MemberListComponent.prototype.ngOnInit = function () {
        this._pmService.emitRoute("nill");
        this.teamid = +this._routeParams.get('teamid');
        this.getMembers(this.teamid);
        if (sessionStorage["UserSession"] != 'null') {
            try {
                this.session = JSON.parse(sessionStorage["UserSession"]);
                this.isAuthenticated = this.session.authentication.isAuthenticated;
                this.identity.roles = this.session.userIdentity.roles;
            }
            catch (ex) {
                this._pmService.emitProcessMessage("PMG");
            }
        }
    };
    MemberListComponent.prototype.ngAfterViewInit = function () {
        // ONE WAY OF PASSING VALUES TO MODAL
        //triggered when modal is about to be shown
        $('#removeAllowed').on('show.bs.modal', function (event) {
            //get data-memberid attribute of the clicked element
            var memId = $(event.relatedTarget).data('memberid');
            var modal = $(this);
            //populate the textbox
            modal.find('input[name="memberid"]').val(memId);
            //modal.find('.modal-body input').val(memId);
        });
    };
    // passes the neccessary member to be removed butchecks if the member is manager
    MemberListComponent.prototype.passToModal = function (memberToDelete) {
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
    };
    // checks is the logged on user allowed to delete member
    MemberListComponent.prototype.IsAllowedToAddRemoveMember = function () {
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
    };
    //****************************************************
    // GET MEMBERS
    //****************************************************
    MemberListComponent.prototype.getMembers = function (passedTeamId) {
        var _this = this;
        this._memberService.getMembers(passedTeamId)
            .subscribe(function (returnedMembers) {
            if (returnedMembers.length === 0) {
                _this._pmService.emitProcessMessage("PMNOMs");
            }
            _this.data = returnedMembers,
                _this.getTeam(passedTeamId);
        } // called here as we need to get complete data
         // called here as we need to get complete data
        , function (error) { return _this.onError(error, "GetMembers"); });
    };
    MemberListComponent.prototype.getTeam = function (passedTeamId) {
        var _this = this;
        this._teamService.getTeam(passedTeamId)
            .subscribe(function (returnedTeam) {
            _this.isRequesting = false,
                _this.team = returnedTeam,
                _this.ChangeTable(_this.configTwo),
                _this._pageTitleService.emitPageTitle(new classes_2.PageTitle("Team Members", returnedTeam.TeamName));
            // called here because it needs the teamleadid of the team we are removing the member from    
            _this.IsAllowedToAddRemoveMember();
        }), function (error) { return _this.onError(error, "GetTeam"); };
    };
    //****************************************************
    // ADD MEMBER
    //****************************************************
    MemberListComponent.prototype.addMember = function (passedTeamId) {
        this._router.navigate(['AddMember', { teamid: passedTeamId }]);
    };
    //****************************************************
    // REMOVE MEMBER // member is ApplicationUser
    //****************************************************
    MemberListComponent.prototype.removeMember = function (memberId) {
        var _this = this;
        this._memberService.removeMember(memberId, this.teamid)
            .subscribe(function (removedMember) { return _this.onSuccessRemoveMember(removedMember); }, function (error) { return _this.onError(error, "RemoveMember"); });
    };
    //****************************************************
    // PRIVATE METHODS // member is ApplicationUser
    //****************************************************
    MemberListComponent.prototype.onSuccessRemoveMember = function (passedMember) {
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
    };
    // an error has occured
    MemberListComponent.prototype.onError = function (err, type) {
        var message = "";
        // stop the spinner regardless of the results
        this.isRequesting = false;
        // we will log the error in the server side by calling the logger
        this._loggerService.logErrors(err, "memberlist");
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
    };
    // method on page change of the pagination controls
    MemberListComponent.prototype.onPageChange = function (passedpage) {
        this.config.currentPage = passedpage;
    };
    // method to toggle the desc and asc sorting of date
    MemberListComponent.prototype.sortTable = function (column) {
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
    };
    // sorting of any array of any
    MemberListComponent.prototype.changeSort = function (data, config) {
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
    MemberListComponent.prototype.changeFilter = function (data, config) {
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
    MemberListComponent.prototype.changeRemove = function (data, config) {
        var _this = this;
        if (this.removedMemberId == null) {
            return data;
        }
        var removedData = data.filter(function (item) { return item.Id !== _this.removedMemberId; });
        this.data = null;
        this.data = removedData;
        return this.data;
    };
    // remove the managers from the list of members
    MemberListComponent.prototype.changeManagers = function (data, config) {
        var _this = this;
        // Business Rule: the director can not be deleted 
        // Business Rule: the manager can not be deleted
        // Business Rule: the team lead can not be deleted
        // Business Rule: the director can be updated by Admin or itself
        // Business Rule: the manager can be updated by director, Admin or itself   
        // Business Rule: the team lead can be updated by director, manager, Admin or itself   
        var changedData = data.filter(function (item) { return item.Id !== _this.team.TeamLeadId; });
        changedData = changedData.filter(function (item) { return item.Id !== _this.team.ProjectManagerId; });
        changedData = changedData.filter(function (item) { return item.Id !== _this.team.ProjectDirectorId; });
        this.data = null;
        this.data = changedData;
        return this.data;
    };
    // change of the table due to filtering and sorting
    MemberListComponent.prototype.ChangeTable = function (config, page) {
        if (page === void 0) { page = { page: this.config.currentPage, itemsPerPage: this.config.itemsPerPage }; }
        if (config.filtering) {
            Object.assign(this.configTwo.filtering, config.filtering);
        }
        if (config.sorting) {
            Object.assign(this.configTwo.sorting, config.sorting);
        }
        // TODO we will show the team lead, manager and director but we will stop of deleting them
        //let managersData = this.changeManagers(this.data, this.configTwo);
        var removedData = this.changeRemove(this.data, this.configTwo);
        var filteredData = this.changeFilter(removedData, this.configTwo);
        var sortedData = this.changeSort(filteredData, this.configTwo);
        this.rows = sortedData;
        this.length = sortedData.length;
    };
    MemberListComponent = __decorate([
        core_1.Component({
            selector: 'member-list',
            templateUrl: './app/views/members/member-list.component.html',
            pipes: [pipes_1.CapsPipe, ng2_pagination_1.PaginatePipe],
            directives: [router_deprecated_1.ROUTER_DIRECTIVES, ng2_bootstrap_1.PAGINATION_DIRECTIVES, ng2_pagination_1.PaginationControlsCmp, spinnerone_component_1.SpinnerOneComponent,
                ng2_table_1.NG_TABLE_DIRECTIVES, common_1.CORE_DIRECTIVES, common_1.FORM_DIRECTIVES, common_1.NgClass, common_1.NgIf],
            providers: [member_service_1.MemberService, team_service_1.TeamService, ng2_pagination_1.PaginationService]
        }), 
        __metadata('design:paramtypes', [member_service_1.MemberService, team_service_1.TeamService, processmessage_service_1.ProcessMessageService, pagetitle_service_1.PageTitleService, logger_service_1.LoggerService, router_deprecated_1.Router, router_deprecated_1.RouteParams])
    ], MemberListComponent);
    return MemberListComponent;
}());
exports.MemberListComponent = MemberListComponent;
//# sourceMappingURL=member-list.component.js.map