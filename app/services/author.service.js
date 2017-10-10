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
var config_1 = require('../config');
var Observable_1 = require('rxjs/Observable');
var logger_service_1 = require('./logger.service');
var authorsUrl = config_1.CONFIG.baseUrls.authors;
var authorUrl = config_1.CONFIG.baseUrls.author;
var addAuthorUrl = config_1.CONFIG.baseUrls.addauthor;
var removeAuthorUrl = config_1.CONFIG.baseUrls.removeauthor;
var AuthorService = (function () {
    function AuthorService(_http, _loggerService) {
        this._http = _http;
        this._loggerService = _loggerService;
        if (sessionStorage["UserSession"] != "null") {
            this.session = JSON.parse(sessionStorage["UserSession"]);
        }
    }
    //******************************************************
    // GET AUTHORS
    //******************************************************
    AuthorService.prototype.getAuthors = function () {
        var _this = this;
        return this._http.get(authorsUrl)
            .map(function (res) { return res.json(); }) // Author.fromJSONArrayToAuthors(res.json()))
            .catch(function (error) { return _this.logError(error, "GetAuthors"); });
    };
    //******************************************************
    // GET AUTHOR
    //******************************************************
    AuthorService.prototype.getAuthor = function (id) {
        var _this = this;
        return this._http.get(authorUrl + "?id=" + id)
            .map(function (res) { return res.json(); })
            .catch(function (error) { return _this.logError(error, "GetAuthor"); });
    };
    //******************************************************
    // ADD AUTHOR
    //******************************************************
    AuthorService.prototype.addAuthor = function (author) {
        var _this = this;
        var body = JSON.stringify(author);
        var headers = new http_1.Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', "Bearer " + this.session.userIdentity.accessToken);
        return this._http.post(addAuthorUrl, body, { headers: headers })
            .map(function (res) { return res.json(); })
            .catch(function (res) { return _this.logError(res, "AddAuthor"); });
    };
    //******************************************************
    // REMOVE AUTHOR
    //******************************************************
    AuthorService.prototype.removeAuthor = function (authorId) {
        var _this = this;
        var localUrl = removeAuthorUrl + "?id=" + authorId;
        var headers = new http_1.Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', "Bearer " + this.session.userIdentity.accessToken);
        return this._http.delete(localUrl, { headers: headers })
            .map(function (res) { return res.json(); })
            .catch(function (error) { return _this.logError(error, "RemoveAuthor"); });
    };
    //******************************************************
    // UPDATE AUTHOR
    //******************************************************
    //******************************************************
    // PRIVATE METHODS
    //******************************************************
    AuthorService.prototype.logError = function (err, method) {
        this._loggerService.logErrors(err, "author.service had error in the method " + method);
        return Observable_1.Observable.throw(err);
    };
    AuthorService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http, logger_service_1.LoggerService])
    ], AuthorService);
    return AuthorService;
}());
exports.AuthorService = AuthorService;
//# sourceMappingURL=author.service.js.map