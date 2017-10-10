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
var classes_1 = require('../../helpers/classes');
var article_service_1 = require('../../services/article.service');
var logger_service_1 = require('../../services/logger.service');
var processmessage_service_1 = require('../../services/processmessage.service');
var pagetitle_service_1 = require('../../services/pagetitle.service');
var ArticleComponent = (function () {
    //*****************************************************
    // CONSTRUCTOR IMPLEMENTAION
    //*****************************************************
    function ArticleComponent(_routeParams, _router, _articleService, _pmService, _pageTitleService, _loggerService) {
        this._routeParams = _routeParams;
        this._router = _router;
        this._articleService = _articleService;
        this._pmService = _pmService;
        this._pageTitleService = _pageTitleService;
        this._loggerService = _loggerService;
        this.componentArticle = new classes_1.Article();
        this.attachements = [];
        this.errorMessage = null;
        this.isVisible = false;
    }
    ArticleComponent.prototype.ngOnInit = function () {
        this._pmService.emitRoute("nill");
        this.isRequesting = true;
        this.articleid = this._routeParams.get('id');
        this.getAnArticle(this.articleid);
    };
    //****************************************************
    // GET ARTICLE
    //****************************************************
    ArticleComponent.prototype.getAnArticle = function (id) {
        var _this = this;
        this._articleService.getArticle(id)
            .subscribe(function (returnedArticle) {
            _this.onSuccessGetArticle(returnedArticle);
            _this.isRequesting = false;
        }, function (res) { return _this.onError(res, "GetArticle"); });
    };
    //****************************************************
    // UPDATE ARTICLE
    //****************************************************
    ArticleComponent.prototype.updateArticle = function (id) { };
    //****************************************************
    // PRIVATE METHODS
    //****************************************************
    // determine the article object or go back
    ArticleComponent.prototype.onSuccessGetArticle = function (passedarticle) {
        if (passedarticle) {
            this.componentArticle = passedarticle;
            this.attachements = passedarticle.Attachements;
            if (this.attachements.length > 0) {
                this.isVisible = true;
            }
            this._pageTitleService.emitPageTitle(new classes_1.PageTitle("Article", this.componentArticle.Title));
        }
        else {
            this.gotoArticles();
        }
    };
    // to navigate back if the article is nothing
    ArticleComponent.prototype.gotoArticles = function () {
        var route = ['Articles', { id: this.componentArticle ? this.componentArticle.ArticleId : null }];
        this._router.navigate(route);
    };
    // an error has occured
    ArticleComponent.prototype.onError = function (err, type) {
        var message = "";
        // stop the spinner
        this.isRequesting = false;
        // we will log the error in the server side by calling the logger, or that is already 
        // done on the server side if the error has been caught
        this._loggerService.logErrors(err, "article page");
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
                    case "GetArticle":
                        this._pmService.emitProcessMessage("PMGA");
                        break;
                    case "UpdateArticle":
                        this._pmService.emitProcessMessage("PMUA");
                        break;
                    default:
                        this._pmService.emitProcessMessage("PMG");
                }
            }
        }
    };
    ArticleComponent = __decorate([
        core_1.Component({
            selector: 'article-view',
            templateUrl: './app/views/articles/article.component.html',
            pipes: [pipes_1.CapsPipe],
            providers: [article_service_1.ArticleService]
        }), 
        __metadata('design:paramtypes', [router_deprecated_1.RouteParams, router_deprecated_1.Router, article_service_1.ArticleService, processmessage_service_1.ProcessMessageService, pagetitle_service_1.PageTitleService, logger_service_1.LoggerService])
    ], ArticleComponent);
    return ArticleComponent;
}());
exports.ArticleComponent = ArticleComponent;
//# sourceMappingURL=article.component.js.map