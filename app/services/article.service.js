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
var http_1 = require('@angular/http');
var moment = require('moment');
var Observable_1 = require('rxjs/Observable');
var config_1 = require('../config');
var logger_service_1 = require('./logger.service');
var articlesUrl = config_1.CONFIG.baseUrls.articles;
var addArticleUrl = config_1.CONFIG.baseUrls.adarticle;
var removeArticleUrl = config_1.CONFIG.baseUrls.removearticle;
var ArticleService = (function () {
    function ArticleService(_http, _loggerService) {
        this._http = _http;
        this._loggerService = _loggerService;
        if (sessionStorage["UserSession"] !== undefined) {
            this.session = JSON.parse(sessionStorage["UserSession"]);
        }
    }
    ;
    //******************************************************
    // GET ARTICLES
    //******************************************************
    ArticleService.prototype.getArticles = function (id) {
        var _this = this;
        // get author's list of articles
        if (id != "" || id != undefined) {
            this.localUrl = articlesUrl + "?AuthorId=" + id;
        }
        // get all articles list
        if (id == "" || id == undefined) {
            this.localUrl = articlesUrl;
        }
        return this._http.get(this.localUrl)
            .map(function (res) { return res.json(); })
            .catch(function (res) { return _this.logError(res, "GetArticles"); });
    };
    // gets set of articles
    ArticleService.prototype.getPageOfArticles = function (id, page, perpage) {
        var _this = this;
        // get author's list of articles
        if (id != 0 || id != undefined) {
            this.localUrl = articlesUrl + "?authorid=" + id + "&page=" + page + "&perpage=" + perpage;
        }
        // get all articles list
        if (id == 0 || id == undefined) {
            this.localUrl = articlesUrl + "?page=" + page + "&perpage=" + perpage;
        }
        return this._http.get(this.localUrl)
            .map(function (res) { return res.json(); }) // Article.mapJSONArrayToArticles(res.json()))
            .catch(function (res) { return _this.logError(res, "GetArticles"); });
    };
    //******************************************************
    // GET ARTICLE
    //******************************************************
    ArticleService.prototype.getArticle = function (id) {
        var _this = this;
        return this._http.get(articlesUrl + "/" + id)
            .map(function (res) { return res.json(); }) // Article.mapJSONObjectToArticle(res.json()))
            .catch(function (res) { return _this.logError(res, "GetArticle"); });
    };
    //******************************************************
    // ADD ARTICLE
    //******************************************************
    ArticleService.prototype.addArticle = function (passedArticle) {
        var _this = this;
        // add the date when article has been created 
        // and the logged on authopr or admin user
        passedArticle.DatePublished = moment().toDate();
        passedArticle.AuthorId = this.session.userIdentity.userId;
        // stringify the article
        var body = JSON.stringify(passedArticle);
        var headers = new http_1.Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', "Bearer " + this.session.userIdentity.accessToken);
        // post the article
        return this._http.post(addArticleUrl, body, { headers: headers })
            .map(function (res) { return res.json(); })
            .catch(function (res) { return _this.logError(res, "AddArticle"); });
    };
    ArticleService.prototype.addAttachement = function (passedAthachement) {
        return new Observable_1.Observable(function () { });
    };
    //******************************************************
    // DELETE ARTICLE
    //******************************************************
    ArticleService.prototype.removeArticle = function (articleid) {
        var _this = this;
        var localUrl = removeArticleUrl + "?id=" + articleid;
        var headers = new http_1.Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', "Bearer " + this.session.userIdentity.accessToken);
        return this._http.delete(localUrl, { headers: headers })
            .map(function (res) { return res.json(); })
            .catch(function (res) { return _this.logError(res, "RemoveArticle"); });
    };
    ArticleService.prototype.removeAttachement = function (articleid) {
        var _this = this;
        var localUrl = removeArticleUrl + "?id=" + articleid;
        var headers = new http_1.Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', "Bearer " + this.session.userIdentity.accessToken);
        return this._http.delete(localUrl, { headers: headers })
            .map(function (res) { return res.json(); })
            .catch(function (error) { return _this.logError(error, "RemoveArticle"); });
    };
    //******************************************************
    // UPDATE ARTICLE
    //******************************************************
    //******************************************************
    // PRIVATE METHODS
    //******************************************************
    ArticleService.prototype.logError = function (err, method) {
        this._loggerService.logErrors(err, "article.service had an error in method " + method);
        return Observable_1.Observable.throw(err);
    };
    ArticleService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http, logger_service_1.LoggerService])
    ], ArticleService);
    return ArticleService;
}());
exports.ArticleService = ArticleService;
//# sourceMappingURL=article.service.js.map