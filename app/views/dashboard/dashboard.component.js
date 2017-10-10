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
var article_service_1 = require('../../services/article.service');
var spinnerone_component_1 = require('../../blocks/spinner/spinnerone.component');
var logger_service_1 = require('../../services/logger.service');
var processmessage_service_1 = require('../../services/processmessage.service');
var pagetitle_service_1 = require('../../services/pagetitle.service');
//import our Carousel Component
var carousel_component_1 = require('../controls/carousel.component');
var pipes_1 = require('../../helpers/pipes');
var classes_1 = require('../../helpers/classes');
var DashboardComponent = (function () {
    // constructor which injects the service
    function DashboardComponent(_articleService, _pmService, _pageTitleService, _loggerService) {
        this._articleService = _articleService;
        this._pmService = _pmService;
        this._pageTitleService = _pageTitleService;
        this._loggerService = _loggerService;
        this.componentArticles = new Array();
        this.itself = this;
    }
    ;
    // component cycle event
    DashboardComponent.prototype.ngOnInit = function () {
        this._pmService.emitRoute("nill");
        this._pageTitleService.emitPageTitle(new classes_1.PageTitle("Whisperer Latest"));
        this.isRequesting = true;
        this.getArticles();
    };
    //*****************************************************
    // GET ARTICLES
    //*****************************************************
    DashboardComponent.prototype.getArticles = function () {
        var _this = this;
        this._articleService.getArticles()
            .subscribe(function (returnedArticles) {
            _this.componentArticles = returnedArticles,
                _this.isRequesting = false;
        }, function (res) { return _this.onError(res); });
    };
    //******************************************************
    // PRIVATE METHODS
    //******************************************************
    // an error has occured
    DashboardComponent.prototype.onError = function (res) {
        // stop the spinner
        this.isRequesting = false;
        // we will log the error in the server side by calling the logger, or that is already 
        // done on the server side if the error has been caught
        this._loggerService.logErrors(res, "dashboard page");
        // we will display a fiendly process message using the process message service             
        this._pmService.emitProcessMessage("PMGA");
    };
    DashboardComponent = __decorate([
        core_1.Component({
            selector: 'dashboard-view',
            templateUrl: './app/views/dashboard/dashboard.component.html',
            styles: ['../../../assets/css/carousel.css'],
            pipes: [pipes_1.TopArticlesPipe, pipes_1.SortDatePipe],
            directives: [router_deprecated_1.ROUTER_DIRECTIVES, spinnerone_component_1.SpinnerOneComponent, carousel_component_1.CSSCarouselComponent],
            providers: [article_service_1.ArticleService]
        }), 
        __metadata('design:paramtypes', [article_service_1.ArticleService, processmessage_service_1.ProcessMessageService, pagetitle_service_1.PageTitleService, logger_service_1.LoggerService])
    ], DashboardComponent);
    return DashboardComponent;
}());
exports.DashboardComponent = DashboardComponent;
//# sourceMappingURL=dashboard.component.js.map