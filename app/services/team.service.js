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
var teamsUrl = config_1.CONFIG.baseUrls.teams;
var addTeamUrl = config_1.CONFIG.baseUrls.addteam;
var removeTeamUrl = config_1.CONFIG.baseUrls.removeteam;
var TeamService = (function () {
    function TeamService(_http, _loggerService) {
        this._http = _http;
        this._loggerService = _loggerService;
        if (sessionStorage["UserSession"] != "null") {
            this.session = JSON.parse(sessionStorage["UserSession"]);
        }
    }
    ;
    //******************************************************
    // GET Teams
    //******************************************************
    // gets all teams normal
    TeamService.prototype.getTeams = function () {
        var _this = this;
        return this._http.get(teamsUrl)
            .map(function (res) { return res.json(); })
            .catch(function (error) { return _this.logError(error, "GetTeams"); });
    };
    // gets all teams per set
    TeamService.prototype.getSetOfTeams = function (page, perpage) {
        var _this = this;
        var localUrl = teamsUrl + "?page=" + page + "&perpage=" + perpage;
        return this._http.get(localUrl)
            .map(function (res) { return res.json(); })
            .catch(function (error) { return _this.logError(error, "GetSetOfTeams"); });
    };
    // get an team normal
    TeamService.prototype.getTeam = function (id) {
        var _this = this;
        return this._http.get(teamsUrl + "/" + id)
            .map(function (res) { return res.json(); })
            .catch(function (error) { return _this.logError(error, "GetTeam"); });
    };
    //******************************************************
    // ADD TEAM
    //******************************************************
    TeamService.prototype.addTeam = function (team) {
        var _this = this;
        var body = JSON.stringify(team);
        var headers = new http_1.Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', "Bearer " + this.session.userIdentity.accessToken);
        return this._http.post(addTeamUrl, body, { headers: headers })
            .map(function (res) { return res.json(); })
            .catch(function (error) { return _this.logError(error, "AddTeam"); });
    };
    TeamService.prototype.onSuccessAddTeam = function (res) {
        if (res) {
            var str = res.json();
        }
    };
    //******************************************************
    // REMOVE MEMBER
    //******************************************************
    TeamService.prototype.removeTeam = function (teamid) {
        var _this = this;
        var localUrl = removeTeamUrl + "?id=" + teamid;
        var headers = new http_1.Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', "Bearer " + this.session.userIdentity.accessToken);
        return this._http.delete(localUrl, { headers: headers })
            .map(function (res) { return res.json(); })
            .catch(function (error) { return _this.logError(error, "RemoveTeam"); });
    };
    //******************************************************
    // UPDATE TEAM
    //******************************************************
    //******************************************************
    // PRIVATE METHODS
    //******************************************************
    TeamService.prototype.logError = function (err, method) {
        this._loggerService.logErrors(err, "team.service had an error in the method " + method);
        return Observable_1.Observable.throw(err);
    };
    TeamService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http, logger_service_1.LoggerService])
    ], TeamService);
    return TeamService;
}());
exports.TeamService = TeamService;
//# sourceMappingURL=team.service.js.map