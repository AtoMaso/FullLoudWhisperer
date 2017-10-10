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
var authentication_service_1 = require('./authentication.service');
var usersUrl = config_1.CONFIG.baseUrls.users;
var userUrl = config_1.CONFIG.baseUrls.user;
var updateUserUrl = config_1.CONFIG.baseUrls.updateuser;
var addUserUrl = config_1.CONFIG.baseUrls.adduser;
var removeUserUrl = config_1.CONFIG.baseUrls.removeuser;
var UserService = (function () {
    function UserService(_http, _loggerService, _authenticationService) {
        this._http = _http;
        this._loggerService = _loggerService;
        this._authenticationService = _authenticationService;
        if (sessionStorage["UserSession"] != "null") {
            this.session = JSON.parse(sessionStorage["UserSession"]);
        }
    }
    ;
    //******************************************************
    // GET USERS
    //******************************************************
    UserService.prototype.getUsers = function (id) {
        var _this = this;
        var localUrl;
        if (id != undefined) {
            localUrl = usersUrl + "?teamid=" + id;
        }
        else {
            localUrl = usersUrl;
        }
        var headers = new http_1.Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', "Bearer " + this.session.userIdentity.accessToken);
        return this._http.get(localUrl, { headers: headers })
            .map(function (res) { return res.json(); })
            .catch(function (err) { return _this.logError(err, "GetUsers"); });
    };
    // page of members
    UserService.prototype.getPageOfUsers = function (page, perpage) {
        var _this = this;
        var localUrl = usersUrl + "?page=" + page + "&perpage=" + perpage;
        var headers = new http_1.Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', "Bearer " + this.session.userIdentity.accessToken);
        return this._http.get(localUrl, { headers: headers })
            .map(function (res) { return res.json(); })
            .catch(function (err) { return _this.logError(err, "GetUsers"); });
    };
    //******************************************************
    // GET USER
    //******************************************************
    UserService.prototype.getUser = function (id) {
        var _this = this;
        var headers = new http_1.Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', "Bearer " + this.session.userIdentity.accessToken);
        return this._http.get(userUrl + "?id=" + id, { headers: headers })
            .map(function (res) { return res.json(); })
            .catch(function (err) { return _this.logError(err, "GetUser"); });
    };
    //******************************************************
    // UPDATE USER
    //******************************************************
    // this will be on the members details page whcih will be the view
    // and update view with two way databinding
    //******************************************************
    // ADD USER
    //******************************************************
    UserService.prototype.addUser = function (user) {
        var _this = this;
        var body = JSON.stringify(user);
        var headers = new http_1.Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', "Bearer " + this.session.userIdentity.accessToken);
        return this._http.post(addUserUrl, body, { headers: headers })
            .map(function (res) { return res.json(); })
            .catch(function (err) { return _this.logError(err, "AddUser"); });
    };
    //******************************************************
    // REMOVE USER
    //******************************************************
    UserService.prototype.removeUser = function (userId) {
        var _this = this;
        var localUrl = removeUserUrl + "?id=" + userId;
        var headers = new http_1.Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', "Bearer " + this.session.userIdentity.accessToken);
        return this._http.delete(localUrl, { headers: headers })
            .map(function (res) { return res.json(); })
            .catch(function (error) { return _this.logError(error, "RemoveUser"); });
    };
    //******************************************************
    // PRIVATE METHODS
    //******************************************************
    UserService.prototype.logError = function (err, method) {
        this._loggerService.logErrors(err, "user.service had an error in the method " + method);
        return Observable_1.Observable.throw(err);
    };
    UserService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http, logger_service_1.LoggerService, authentication_service_1.AuthenticationService])
    ], UserService);
    return UserService;
}());
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map