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
var membersUrl = config_1.CONFIG.baseUrls.members;
var memberUrl = config_1.CONFIG.baseUrls.member;
var updateMemberUrl = config_1.CONFIG.baseUrls.addmember;
var addMemberUrl = config_1.CONFIG.baseUrls.addmember;
var removeMemberUrl = config_1.CONFIG.baseUrls.removemember;
var MemberService = (function () {
    function MemberService(_http, _loggerService) {
        this._http = _http;
        this._loggerService = _loggerService;
        if (sessionStorage["UserSession"] !== undefined) {
            this.session = JSON.parse(sessionStorage["UserSession"]);
        }
    }
    ;
    //******************************************************
    // GET members
    //******************************************************
    MemberService.prototype.getMembers = function (id) {
        var _this = this;
        var localUrl;
        if (id != undefined) {
            localUrl = membersUrl + "?teamid=" + id;
        }
        else {
            localUrl = membersUrl;
        }
        return this._http.get(localUrl)
            .map(function (res) { return res.json(); })
            .catch(function (res) { return _this.logError(res, "GetMembers"); });
    };
    // page of members
    MemberService.prototype.getPageOfMembers = function (page, perpage) {
        var _this = this;
        var localUrl = membersUrl + "?page=" + page + "&perpage=" + perpage;
        return this._http.get(localUrl)
            .map(function (res) { return res.json(); })
            .catch(function (res) { return _this.logError(res, "GetMembers"); });
    };
    //******************************************************
    // GET MEMBER
    //******************************************************
    MemberService.prototype.getMember = function (id, teamid) {
        var _this = this;
        return this._http.get(memberUrl + "?id=" + id + "&teamid=" + teamid)
            .map(function (res) { return res.json(); })
            .catch(function (res) { return _this.logError(res, "GetMember"); });
    };
    //******************************************************
    // UPDATE MEMBER
    //******************************************************
    // this will be on the members details page whcih will be the view
    // and update view with two way databinding
    //******************************************************
    // ADD MEMBER
    //******************************************************
    MemberService.prototype.addMember = function (member) {
        var _this = this;
        var body = JSON.stringify(member);
        var headers = new http_1.Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', "Bearer " + this.session.userIdentity.accessToken);
        return this._http.post(addMemberUrl, body, { headers: headers })
            .map(function (res) { return res.json(); })
            .catch(function (res) { return _this.logError(res, "AddMember"); });
    };
    //******************************************************
    // REMOVE MEMBER
    //******************************************************
    MemberService.prototype.removeMember = function (memberId, teamid) {
        var _this = this;
        var localUrl = removeMemberUrl + "?id=" + memberId + "&teamid=" + teamid;
        var headers = new http_1.Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', "Bearer " + this.session.userIdentity.accessToken);
        return this._http.delete(localUrl, { headers: headers })
            .map(function (res) { return res.json(); })
            .catch(function (res) { return _this.logError(res, "RemoveMember"); });
    };
    //******************************************************
    // PRIVATE METHODS
    //******************************************************
    MemberService.prototype.logError = function (err, method) {
        this._loggerService.logErrors(err, "member.service had an error in the method " + method);
        //return Promise.reject(err);
        return Observable_1.Observable.throw(err);
    };
    MemberService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http, logger_service_1.LoggerService])
    ], MemberService);
    return MemberService;
}());
exports.MemberService = MemberService;
//# sourceMappingURL=member.service.js.map