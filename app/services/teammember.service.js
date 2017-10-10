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
var teammembersUrl = config_1.CONFIG.baseUrls.teammembers;
var updateTeamMemberUrl = config_1.CONFIG.baseUrls.addteammember;
var addTeamMemberUrl = config_1.CONFIG.baseUrls.addteammember;
var removeteamMemberUrl = config_1.CONFIG.baseUrls.removeteammember;
var TeamMemberService = (function () {
    function TeamMemberService(_http, _loggerService) {
        this._http = _http;
        this._loggerService = _loggerService;
        if (sessionStorage["UserSession"] !== undefined) {
            this.session = JSON.parse(sessionStorage["UserSession"]);
        }
    }
    ;
    //******************************************************
    // GET TEAMEMBERS
    //******************************************************
    TeamMemberService.prototype.getTeamMembers = function () {
        var _this = this;
        return this._http.get(teammembersUrl)
            .map(function (res) { return res.json(); })
            .catch(function (res) { return _this.logError(res, "GetTeamMembers"); });
    };
    //******************************************************
    // UPDATE TEAMMEMBER
    //******************************************************
    // this will be on the members details page whcih will be the view
    // and update view with two way databinding
    //******************************************************
    // ADD TEAMMEMBER
    //******************************************************
    //******************************************************
    // REMOVE TEAMMEMBER
    //******************************************************
    //******************************************************
    // PRIVATE METHODS
    //******************************************************
    TeamMemberService.prototype.logError = function (err, method) {
        this._loggerService.logErrors(err, "member.service had an error in the method " + method);
        //return Promise.reject(err);
        return Observable_1.Observable.throw(err);
    };
    TeamMemberService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http, logger_service_1.LoggerService])
    ], TeamMemberService);
    return TeamMemberService;
}());
exports.TeamMemberService = TeamMemberService;
//# sourceMappingURL=teammember.service.js.map