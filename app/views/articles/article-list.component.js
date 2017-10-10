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
var article_service_1 = require('../../services/article.service');
var logger_service_1 = require('../../services/logger.service');
var processmessage_service_1 = require('../../services/processmessage.service');
var pagetitle_service_1 = require('../../services/pagetitle.service');
var pipes_1 = require('../../helpers/pipes');
var classes_1 = require('../../helpers/classes');
var ArticleListComponent = (function () {
    // constructor which injects the services
    function ArticleListComponent(_routeParams, _articleService, _pmService, _pageTitleService, _router, _loggerService) {
        this._routeParams = _routeParams;
        this._articleService = _articleService;
        this._pmService = _pmService;
        this._pageTitleService = _pageTitleService;
        this._router = _router;
        this._loggerService = _loggerService;
        this.identity = new classes_1.UserIdentity;
        this.isRequesting = false;
        this.isAuthenticated = false;
        this.isAllowedToAddArticle = false;
        this.isAllowedToRemoveArticle = false;
        this.isOwner = false;
        /**********************************************/
        //ng2-pagination methods
        /***********************************************/
        this.isTitleAsc = true;
        this.isCategoryAsc = true;
        this.isNameAsc = true;
        this.isDateAsc = true;
        this.sortTitle = 'desc';
        this.sortCategory = 'desc';
        this.sortName = 'desc';
        this.sortDate = 'desc';
        this.maxSize = 5;
        //public directionLinks: boolean = true;
        //public autoHide: boolean = true;
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
            filtering: { filterString: '', columnName: 'Title' }
        };
    }
    ;
    // implement OnInit to get the initial list of articles
    ArticleListComponent.prototype.ngOnInit = function () {
        if (sessionStorage["UserSession"] != "null") {
            try {
                this.session = JSON.parse(sessionStorage["UserSession"]);
                this.isAuthenticated = this.session.authentication.isAuthenticated;
                this.identity.roles = this.session.userIdentity.roles;
                this.IsAllowedToAddArticle();
                this.IsAllowedToRemoveArticle();
            }
            catch (ex) {
                this._pmService.emitProcessMessage("PMG");
            }
        }
        this._pmService.emitRoute("nill");
        this.isRequesting = true;
        this.authorid = this._routeParams.get('id');
        // set proper title depending of what we displaying
        if (this.authorid) {
            this._pageTitleService.emitPageTitle(new classes_1.PageTitle("Author's Articles"));
        }
        else {
            this._pageTitleService.emitPageTitle(new classes_1.PageTitle("All Articles"));
        }
        // get all or author's articles
        this.getArticles(this.authorid);
    };
    ArticleListComponent.prototype.ngAfterViewInit = function () {
        // ONE WAY OF PASSING VALUES TO MODAL
        //triggered when modal is about to be shown
        $('#removeAllowed').on('show.bs.modal', function (event) {
            //get data-articleid attribute of the clicked element
            var artId = $(event.relatedTarget).data('articleid');
            var modal = $(this);
            //populate the textbox
            modal.find('input[name="articleid"]').val(artId);
            //modal.find('.modal-body input').val(artId);
        });
    };
    ArticleListComponent.prototype.passToModal = function (article) {
        if (article.AuthorId == this.session.userIdentity.userId) {
            this.isOwner = true;
            this.articleIdToBeRemoved = article.ArticleId;
        }
        else {
            this.isOwner = false;
            this.articleIdToBeRemoved = null;
        }
    };
    ArticleListComponent.prototype.IsAllowedToAddArticle = function () {
        // in TYPESCRIPT call to class methods containing call to "this" have to be created
        // and relevant parameters passed (roles in thsi case) and then method called on
        // that instance of the class, in this instance "identity" object. The reason for this is
        // the "this" keyword is the one of the object calling the method
        if (this.isAuthenticated && this.identity.isInRole("Author") && this.identity.isInRole("Admin")) {
            this.isAllowedToAddArticle = true;
        }
    };
    ArticleListComponent.prototype.IsAllowedToRemoveArticle = function () {
        // in TYPESCRIPT call to class methods containing call to "this" have to be created
        // and relevant parameters passed (roles in thsi case) and then method called on
        // that instance of the class, in this instance "identity" object. The reason for this is
        // the "this" keyword is the one of the object calling the method
        if (this.isAuthenticated && this.identity.isInRole("Author")) {
            this.isAllowedToRemoveArticle = true;
        }
    };
    //*****************************************************
    // GET ARTICLES
    //*****************************************************
    ArticleListComponent.prototype.getArticles = function (id) {
        var _this = this;
        this._articleService.getArticles(id)
            .subscribe(function (returnedArticles) {
            if (returnedArticles.length === 0) {
                _this._pmService.emitProcessMessage("PMNOAs");
            }
            _this.data = returnedArticles,
                _this.isRequesting = false,
                _this.ChangeTable(_this.configTwo);
        }, function (res) { return _this.onError(res, "GetArticles"); });
    };
    // get set of records of articles service method
    ArticleListComponent.prototype.getPageOfArticles = function (id, page, total) {
        var _this = this;
        this._articleService.getPageOfArticles(id, page, total)
            .subscribe(function (returnedArticles) {
            if (returnedArticles.length === 0) {
                _this._pmService.emitProcessMessage("PMNOAs");
            }
            _this.data = returnedArticles,
                _this.isRequesting = false,
                _this.ChangeTable(_this.configTwo);
        }, function (res) { return _this.onError(res, "GetArticles"); });
    };
    //****************************************************
    // ADD ARTICLE
    //****************************************************
    ArticleListComponent.prototype.addArticle = function () {
        this._router.navigate(['AddArticle']);
    };
    //****************************************************
    // REMOVE ARTICLE
    //****************************************************
    ArticleListComponent.prototype.removeArticle = function (articleId) {
        var _this = this;
        this._articleService.removeArticle(articleId)
            .subscribe(function (removedArticle) { return _this.onSuccessRemoveArticle(removedArticle); }, function (error) { return _this.onError(error, "RemoveArticle"); });
    };
    //*****************************************************
    // PRIVATE METHODS ARTICLES
    //*****************************************************
    ArticleListComponent.prototype.onSuccessRemoveArticle = function (article) {
        if (article) {
            this.removedArticleId = article.ArticleId;
            this.ChangeTable(this.configTwo);
            // reset the removed article after the data has been updated
            // so it is ready for the next filtering or sorting of the list
            this.removedArticleId = null;
            this._pmService.emitProcessMessage("PMRAS");
        }
        else {
            this._pmService.emitProcessMessage("PMRA");
        }
    };
    // an error has occured
    ArticleListComponent.prototype.onError = function (err, type) {
        // stop the spinner
        this.isRequesting = false;
        var message = "";
        // we will log the error in the server side by calling the logger, or that is already 
        // done on the server side if the error has been caught
        this._loggerService.logErrors(err, "article list page");
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
                    case "RemoveArticle":
                        this._pmService.emitProcessMessage("PMRA");
                        break;
                    case "GetArticles":
                        this._pmService.emitProcessMessage("PMGAs");
                        break;
                    default:
                        this._pmService.emitProcessMessage("PMG");
                }
            }
        } //end if              
    };
    // method on page change of the pagination controls
    ArticleListComponent.prototype.onPageChange = function (passedpage) {
        this.config.currentPage = passedpage;
    };
    // method to toggle the desc and asc sorting of date
    ArticleListComponent.prototype.sortTable = function (column) {
        // reset the array of columns
        this.configTwo.sorting.columns = [];
        switch (column) {
            case 'Title':
                this.configTwo.sorting.columns = [{ name: 'Title', sort: this.sortTitle }];
                this.ChangeTable(this.configTwo);
                this.isTitleAsc = !this.isTitleAsc;
                this.sortTitle = this.isTitleAsc ? 'desc' : 'asc';
                break;
            case 'CategoryName':
                this.configTwo.sorting.columns = [{ name: 'CategoryName', sort: this.sortCategory }];
                this.ChangeTable(this.configTwo);
                this.isCategoryAsc = !this.isCategoryAsc;
                this.sortCategory = this.isCategoryAsc ? 'desc' : 'asc';
                break;
            case 'AuthorName':
                this.configTwo.sorting.columns = [{ name: 'AuthorName', sort: this.sortName }];
                this.ChangeTable(this.configTwo);
                this.isNameAsc = !this.isNameAsc;
                this.sortName = this.isNameAsc ? 'desc' : 'asc';
                break;
            case 'DatePublished':
                this.configTwo.sorting.columns = [{ name: 'DatePublished', sort: this.sortDate }];
                this.ChangeTable(this.configTwo);
                this.isDateAsc = !this.isDateAsc;
                this.sortDate = this.isDateAsc ? 'desc' : 'asc';
                break;
            default:
        }
    };
    // sorting of any array of any
    ArticleListComponent.prototype.changeSort = function (data, config) {
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
    ArticleListComponent.prototype.changeFilter = function (data, config) {
        var _this = this;
        if (!config.filtering) {
            return data;
        }
        var filteredData = data.filter(function (item) {
            return item[config.filtering.columnName].match(_this.configTwo.filtering.filterString);
        });
        return filteredData;
    };
    // filter the removed user from the list
    ArticleListComponent.prototype.changeRemove = function (data, config) {
        var _this = this;
        if (this.removedArticleId == null) {
            return data;
        }
        var removedData = data.filter(function (item) { return item.ArticleId !== _this.removedArticleId; });
        this.data = null;
        this.data = removedData;
        return this.data;
    };
    // change of the table due to filtering and sorting
    ArticleListComponent.prototype.ChangeTable = function (config, page) {
        if (page === void 0) { page = { page: this.config.currentPage, itemsPerPage: this.config.itemsPerPage }; }
        if (config.filtering) {
            Object.assign(this.configTwo.filtering, config.filtering);
        }
        if (config.sorting) {
            Object.assign(this.configTwo.sorting, config.sorting);
        }
        var removedData = this.changeRemove(this.data, this.configTwo);
        var filteredData = this.changeFilter(removedData, this.configTwo);
        var sortedData = this.changeSort(filteredData, this.configTwo);
        this.rows = sortedData;
        this.length = sortedData.length;
    };
    ArticleListComponent = __decorate([
        core_1.Component({
            selector: 'articles-view',
            templateUrl: './app/views/articles/article-list.component.html',
            pipes: [pipes_1.CapsPipe, ng2_pagination_1.PaginatePipe],
            directives: [router_deprecated_1.ROUTER_DIRECTIVES, ng2_bootstrap_1.PAGINATION_DIRECTIVES, ng2_pagination_1.PaginationControlsCmp, spinnerone_component_1.SpinnerOneComponent,
                ng2_table_1.NG_TABLE_DIRECTIVES, common_1.CORE_DIRECTIVES, common_1.FORM_DIRECTIVES, common_1.NgClass, common_1.NgIf],
            providers: [article_service_1.ArticleService, ng2_pagination_1.PaginationService]
        }), 
        __metadata('design:paramtypes', [router_deprecated_1.RouteParams, article_service_1.ArticleService, processmessage_service_1.ProcessMessageService, pagetitle_service_1.PageTitleService, router_deprecated_1.Router, logger_service_1.LoggerService])
    ], ArticleListComponent);
    return ArticleListComponent;
}());
exports.ArticleListComponent = ArticleListComponent;
//# sourceMappingURL=article-list.component.js.map