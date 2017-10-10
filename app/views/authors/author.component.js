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
var author_service_1 = require('../../services/author.service');
var logger_service_1 = require('../../services/logger.service');
var processmessage_service_1 = require('../../services/processmessage.service');
var pagetitle_service_1 = require('../../services/pagetitle.service');
var classes_1 = require('../../helpers/classes');
var AuthorComponent = (function () {
    //*****************************************************
    // CONSTRUCTOR IMPLEMENTAION
    //*****************************************************
    function AuthorComponent(_routeParams, _router, _authorService, _pmService, _pageTitleService, _loggerService) {
        this._routeParams = _routeParams;
        this._router = _router;
        this._authorService = _authorService;
        this._pmService = _pmService;
        this._pageTitleService = _pageTitleService;
        this._loggerService = _loggerService;
        this.componentAuthor = new classes_1.ApplicationUser();
        this.authorid = null;
    }
    AuthorComponent.prototype.ngOnInit = function () {
        this._pmService.emitRoute("nill");
        this.isRequesting = true;
        this.authorid = this._routeParams.get('id');
        this.getAnAuthor(this.authorid);
    };
    //****************************************************
    // GET AUTHOR
    //****************************************************
    AuthorComponent.prototype.getAnAuthor = function (id) {
        var _this = this;
        this._authorService.getAuthor(id)
            .subscribe(function (returnedAuthor) {
            _this.onSuccessGetAuthor(returnedAuthor),
                _this.isRequesting = false;
        }, function (res) { return _this.onError(res, "GetAuthor"); });
    };
    //****************************************************
    // UPDATE AUTHOR
    //****************************************************
    AuthorComponent.prototype.updateAuthor = function (id) { };
    //****************************************************
    // PRIVATE METHODS
    //**************************************************** 
    AuthorComponent.prototype.onSuccessGetAuthor = function (passedauthor) {
        if (passedauthor) {
            this.componentAuthor = passedauthor;
            this._pageTitleService.emitPageTitle(new classes_1.PageTitle("Author", this.componentAuthor.Name));
        }
        else {
            this._gotoAuthors();
        }
    };
    // to navigate back if the article is nothing
    AuthorComponent.prototype._gotoAuthors = function () {
        var route = ['Authors', { id: this.componentAuthor ? this.componentAuthor.Id : null }];
        this._router.navigate(route);
    };
    AuthorComponent.prototype.onError = function (err, type) {
        var message = "";
        // stop the spinner
        this.isRequesting = false;
        // we will log the error in the server side by calling the logger, or that is already 
        // done on the server side if the error has been caught
        this._loggerService.logErrors(err, "author page");
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
                    case "GetAuthor":
                        this._pmService.emitProcessMessage("PMGAU");
                        break;
                    case "UpdateAuthor":
                        this._pmService.emitProcessMessage("PMUAU");
                        break;
                    default:
                        this._pmService.emitProcessMessage("PMG");
                }
            }
        }
    };
    AuthorComponent = __decorate([
        core_1.Component({
            selector: 'my-author',
            templateUrl: './app/views/authors/author.component.html',
            directives: [router_deprecated_1.ROUTER_DIRECTIVES],
            providers: [author_service_1.AuthorService]
        }), 
        __metadata('design:paramtypes', [router_deprecated_1.RouteParams, router_deprecated_1.Router, author_service_1.AuthorService, processmessage_service_1.ProcessMessageService, pagetitle_service_1.PageTitleService, logger_service_1.LoggerService])
    ], AuthorComponent);
    return AuthorComponent;
}());
exports.AuthorComponent = AuthorComponent;
//# sourceMappingURL=author.component.js.map