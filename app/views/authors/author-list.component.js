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
var author_service_1 = require('../../services/author.service');
var logger_service_1 = require('../../services/logger.service');
var processmessage_service_1 = require('../../services/processmessage.service');
var pagetitle_service_1 = require('../../services/pagetitle.service');
var pipes_1 = require('../../helpers/pipes');
var classes_1 = require('../../helpers/classes');
var AuthorListComponent = (function () {
    // constructor which injects the service
    function AuthorListComponent(_router, _authorService, _pmService, _pageTitleService, _loggerService) {
        this._router = _router;
        this._authorService = _authorService;
        this._pmService = _pmService;
        this._pageTitleService = _pageTitleService;
        this._loggerService = _loggerService;
        this.removedAuthorId = null;
        this.identity = new classes_1.UserIdentity;
        this.isAuthenticated = false;
        this.isAllowed = false;
        this.isHimself = false;
        //**********************************************
        //ng2-pagination methods
        //**********************************************
        this.isNameAsc = true;
        this.isUsernameAsc = true;
        this.isTeamnameAsc = true;
        this.sortName = 'desc';
        this.sortUsername = 'desc';
        this.sortTeamname = 'desc';
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
    AuthorListComponent.prototype.ngOnInit = function () {
        if (sessionStorage["UserSession"] != "null") {
            try {
                this.session = JSON.parse(sessionStorage["UserSession"]);
                this.isAuthenticated = this.session.authentication.isAuthenticated;
                this.identity.roles = this.session.userIdentity.roles;
                this.IsAllowedToAddAuthor();
            }
            catch (ex) {
                this._pmService.emitProcessMessage("PMG");
            }
        }
        this._pageTitleService.emitPageTitle(new classes_1.PageTitle("All Authors"));
        this._pmService.emitRoute("nill");
        this.isRequesting = true;
        this.getAuthors();
    };
    AuthorListComponent.prototype.ngAfterViewInit = function () {
        // ONE WAY OF PASSING VALUES TO MODAL
        //triggered when modal is about to be shown
        $('#removeAllowed').on('show.bs.modal', function (event) {
            //get data-articleid attribute of the clicked element
            var autId = $(event.relatedTarget).data('authorid');
            var modal = $(this);
            //populate the textbox
            modal.find('input[name="authorid"]').val(autId);
            //modal.find('.modal-body input').val(autId);
        });
    };
    AuthorListComponent.prototype.passToModal = function (id) {
        if (this.session.userIdentity.userId == id) {
            this.isHimself = true;
            this.authorIdToBeRemoved = null;
        }
        else {
            this.isHimself = false;
            this.authorIdToBeRemoved = id;
        }
    };
    AuthorListComponent.prototype.IsAllowedToAddAuthor = function () {
        // in TYPESCRIPT call to class methods containing call to "this" have to be created
        // and relevant parameters passed (roles in thsi case) and then method called on
        // that instance of the class, in this instance "identity" object. The reason for this is
        // the "this" keyword is the one of the object calling the method
        if (this.isAuthenticated && this.identity.isInRole("Admin")) {
            this.isAllowed = true;
        }
    };
    //****************************************************
    // GET AUTHORS METHODS
    //****************************************************
    AuthorListComponent.prototype.getAuthors = function () {
        var _this = this;
        this._authorService.getAuthors()
            .subscribe(function (returnedAuthors) {
            if (returnedAuthors.length === 0) {
                _this._pmService.emitProcessMessage("PMNOAUs");
            }
            _this.data = returnedAuthors,
                _this.ChangeTable(_this.configTwo),
                _this.isRequesting = false;
        }, function (res) { return _this.onError(res, "Get"); });
    };
    //****************************************************
    // ADD AUTHOR
    //****************************************************
    AuthorListComponent.prototype.addAuthor = function () {
        // the check to do this operation is done on the html page
        this._router.navigate(['AddAuthor']);
    };
    //****************************************************
    // REMOVE AUTHOR
    //****************************************************
    AuthorListComponent.prototype.removeAuthor = function (authorId) {
        var _this = this;
        // the check to do this operation is done on the html page
        this._authorService.removeAuthor(authorId)
            .subscribe(function (removedAuthor) { return _this.onSuccessRemoveAuthor(removedAuthor); }, function (error) { return _this.onError(error, "Remove"); });
    };
    // handel the response of the removing the selected member
    AuthorListComponent.prototype.onSuccessRemoveAuthor = function (passedAuthor) {
        if (passedAuthor) {
            this.removedAuthorId = passedAuthor.Id;
            this.ChangeTable(this.configTwo);
            // reset the removed member after the data has been updated
            // so it is ready for the next filtering or sorting of the list
            this.removedAuthorId = null;
            this._pmService.emitProcessMessage("PMRAUS");
        }
        else {
            this._pmService.emitProcessMessage("PMRAU");
        }
    };
    //****************************************************
    // PRIVATE METHODS
    //****************************************************
    // an error has occured
    AuthorListComponent.prototype.onError = function (err, type) {
        var message = "";
        // stop the spinner
        this.isRequesting = false;
        // we will log the error in the server side by calling the logger, or that is already 
        // done on the server side if the error has been caught
        this._loggerService.logErrors(err, "authors list page");
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
                    case "Remove":
                        this._pmService.emitProcessMessage("PMRAU");
                        break;
                    case "Get":
                        this._pmService.emitProcessMessage("PMGAUs");
                        break;
                    default:
                        this._pmService.emitProcessMessage("PMG");
                }
            }
        }
    };
    // method on page change of the pagination controls
    AuthorListComponent.prototype.onPageChange = function (passedpage) {
        this.config.currentPage = passedpage;
    };
    // change of the table due to filtering and sorting
    AuthorListComponent.prototype.ChangeTable = function (config, page) {
        if (page === void 0) { page = { page: this.config.currentPage, itemsPerPage: this.config.itemsPerPage }; }
        if (config.filtering) {
            Object.assign(this.configTwo.filtering, config.filtering);
        }
        if (config.sorting) {
            Object.assign(this.configTwo.sorting, config.sorting);
        }
        //let changeLoggon = this.changeLoggonUser(this.data, this.configTwo);
        var removedData = this.changeRemove(this.data, this.configTwo);
        var filteredData = this.changeFilter(removedData, this.configTwo);
        var sortedData = this.changeSort(filteredData, this.configTwo);
        this.rows = sortedData;
        this.length = sortedData.length;
    };
    // method to toggle the desc and asc sorting of date
    AuthorListComponent.prototype.sortTable = function (column) {
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
            case 'TeamName':
                this.configTwo.sorting.columns = [{ name: 'TeamName', sort: this.sortTeamname }];
                this.ChangeTable(this.configTwo);
                this.isTeamnameAsc = !this.isTeamnameAsc;
                this.sortTeamname = this.isTeamnameAsc ? 'desc' : 'asc';
                break;
            default:
        }
    };
    // sorting of any array of any
    AuthorListComponent.prototype.changeSort = function (data, config) {
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
    AuthorListComponent.prototype.changeFilter = function (data, config) {
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
    AuthorListComponent.prototype.changeRemove = function (data, config) {
        var _this = this;
        if (this.removedAuthorId == null) {
            return data;
        }
        var removedData = data.filter(function (item) { return item.Id !== _this.removedAuthorId; });
        this.data = null;
        this.data = removedData;
        return this.data;
    };
    // filter the loggon user from the list if it is an author
    AuthorListComponent.prototype.changeLoggonUser = function (data, config) {
        var _this = this;
        if (this.session != null) {
            var removedData = data.filter(function (item) { return item.Id !== _this.session.userIdentity.userId; });
            this.data = null;
            this.data = removedData;
            return this.data;
        }
        else {
            return this.data;
        }
    };
    AuthorListComponent = __decorate([
        core_1.Component({
            selector: 'my-content',
            templateUrl: './app/views/authors/author-list.component.html',
            pipes: [pipes_1.CapsPipe, ng2_pagination_1.PaginatePipe],
            directives: [router_deprecated_1.ROUTER_DIRECTIVES, ng2_bootstrap_1.PAGINATION_DIRECTIVES, ng2_pagination_1.PaginationControlsCmp, spinnerone_component_1.SpinnerOneComponent,
                ng2_table_1.NG_TABLE_DIRECTIVES, common_1.CORE_DIRECTIVES, common_1.FORM_DIRECTIVES, common_1.NgClass, common_1.NgIf],
            providers: [author_service_1.AuthorService, ng2_pagination_1.PaginationService]
        }), 
        __metadata('design:paramtypes', [router_deprecated_1.Router, author_service_1.AuthorService, processmessage_service_1.ProcessMessageService, pagetitle_service_1.PageTitleService, logger_service_1.LoggerService])
    ], AuthorListComponent);
    return AuthorListComponent;
}());
exports.AuthorListComponent = AuthorListComponent;
//# sourceMappingURL=author-list.component.js.map