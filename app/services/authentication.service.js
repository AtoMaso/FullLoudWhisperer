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
// ///<reference path="../../typings/moment.d.ts" />
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
var moment = require('moment');
var config_1 = require('../config');
var Observable_1 = require('rxjs/Observable');
var BehaviorSubject_1 = require('rxjs/BehaviorSubject');
var Subject_1 = require('rxjs/Subject');
var logger_service_1 = require('./logger.service');
var classes_1 = require('../helpers/classes');
var serviceBase = config_1.CONFIG.baseUrls.servicebase;
var serviceBaseAccount = config_1.CONFIG.baseUrls.accounts;
var AuthenticationService = (function () {
    function AuthenticationService(_http, _loggerService) {
        this._http = _http;
        this._loggerService = _loggerService;
        this.timer = null;
        this._subjectSessionStore = new Subject_1.Subject();
        this._subjectSessionObserver$ = this._subjectSessionStore.asObservable();
        this._behaviorSessionStore = new BehaviorSubject_1.BehaviorSubject(null);
        this._behaviorSessionObserver$ = this._behaviorSessionStore.asObservable();
    }
    AuthenticationService.prototype.ngOnDestroy = function () {
        this._authentication = null;
        this._userIdentity = null;
        this._userSession = null;
        this._subjectSessionStore = null;
        this._subjectSessionObserver$ = null;
        this._behaviorSessionStore = null;
        this._behaviorSessionObserver$ = null;
    };
    //******************************************************
    // Login/Get token
    //******************************************************
    AuthenticationService.prototype.login = function (UserName, Password) {
        var _this = this;
        var data = "grant_type=password&username=" + UserName + "&password=" + Password;
        var headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' });
        return this._http.post(serviceBase + "Token", data, { headers: headers })
            .map(function (res) { return _this.onLoginSuccess(res); } // this should be .map as the component is subscribing for it
         // this should be .map as the component is subscribing for it
        , function (error) { return _this.onLoginError(error, "Login"); });
    };
    // grabs the refresh token when IDLE requires or WORKING session is close to expiry
    AuthenticationService.prototype.refreshToken = function () {
        var _this = this;
        var data = "grant_type=refresh_token&refresh_token=" + this._userIdentity.refreshToken + "&client_id=";
        var headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' });
        return this._http.post(serviceBase + "Token", data, { headers: headers })
            .subscribe(function (res) { return _this.onLoginSuccess(res); } // this should be subscibe as we need to run onLoginSuccess
         // this should be subscibe as we need to run onLoginSuccess
        , function (error) { return _this.onLoginError(error, "RefreshToken"); });
    };
    //******************************************************
    // Register new account
    //******************************************************
    AuthenticationService.prototype.register = function (user) {
        var _this = this;
        var body = JSON.stringify(user);
        var headers = new http_1.Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        return this._http.post(serviceBaseAccount + "Register", body, { headers: headers })
            .map(function (res) { return _this.onSucessRegistering(res); }, function (error) { return _this.onRegisterError(error, "Register"); });
    };
    //******************************************************
    // Logout the logged in user
    //******************************************************
    AuthenticationService.prototype.logOut = function () {
        this.clearSessionTimer();
        this.removeUserIdentity();
        this.removeAuthData();
        this.removeUserSession();
    };
    //******************************************************
    // PRIVATE METHODS
    //****************************************************** 
    AuthenticationService.prototype.onLoginSuccess = function (res) {
        var body = res.json();
        this._userIdentity = new classes_1.UserIdentity();
        this._authentication = new classes_1.Authentication();
        this._userSession = new classes_1.UserSession();
        // identity
        this._userIdentity.accessToken = body.access_token;
        this._userIdentity.refreshToken = body.refresh_token;
        this._userIdentity.accessTokenType = body.token_type;
        this._userIdentity.accessTokenExpiresIn = body.expires_in;
        this._userIdentity.accessTokenExpiresDate = this.tokenExpiresInDate(this._userIdentity.accessTokenExpiresIn);
        this._userIdentity.userName = body.userName;
        this._userIdentity.userId = body.id;
        this._userIdentity.name = body.name;
        this._userIdentity.roles = body.roles.split(",");
        // authentication
        this._authentication.isAuthenticated = true;
        this._authentication.authenticationType = this._userIdentity.accessTokenType;
        // session
        this._userSession.authentication = this._authentication;
        this._userSession.userIdentity = this._userIdentity;
        this.storeUserIdentity(this._userIdentity);
        this.storeAuthData(this._authentication);
        this.storeUsersSession(this._userSession);
        // we do emit from the login component as we do not need to emit new session every time is created
        // if we are planning to pass different sesssion values of expiry values then we need the following line
        // and remove the emiting of the session in the login component
        // this.emitUserSession(this._userSession);
        // clear the webapi session timer if one exist, this is needed when IDLE has done the refresh of the token
        this.clearSessionTimer();
        // start the webapi session timer
        this.startSessionTimer(this._userIdentity.accessTokenExpiresIn);
    };
    AuthenticationService.prototype.emitUserSession = function (passedSession) {
        this._behaviorSessionStore.next(passedSession);
    };
    AuthenticationService.prototype.onSucessRegistering = function (response) {
        // TODO do we need to do here maybe log the new account creating
        //let errors: any = [];
        //for (var key in response.data.modelState) {
        //    for (var i = 0; i < response.data.modelState[key].length; i++) {
        //        errors.push(response.data.modelState[key][i]);
        //    }
        //}
    };
    //******************************************************
    // SESSION METHODS
    //*******************************************************
    // gives us reminder before the webapi expires
    AuthenticationService.prototype.startSessionTimer = function (sessionLengthInSeconds) {
        var _this = this;
        // what we do here is: we are creating a breaking point when the token
        // needs to be refreshed before the wep api session elapses 
        // so we are taking 1 minutes(60 seconds) from the web api session
        // with that we can call the refresh token method and give it time 
        // to get the refresh token before the original expires so we don't get UnAuthorized error.
        // We have WORKING refresh token happening 1 minute after the IDLE would have happened
        // if we were IDLE for session -2 minutes. So we would have have session cleared.
        if (this._userSession !== null) {
            this.timer = setTimeout(function () {
                _this.refreshToken();
                //console.log("refresh from working has happend");
                //alert("Session has been extended with refresh token and new idles started.");
            }, (sessionLengthInSeconds - 60) * 1000);
        }
    };
    // called when logout is happening
    AuthenticationService.prototype.clearSessionTimer = function () {
        // kill timer if one exists
        if (this.timer !== null) {
            clearTimeout(this.timer);
            this.timer = 0;
        }
    };
    // gets the date and time when webapi session expires
    AuthenticationService.prototype.tokenExpiresInDate = function (sessionTime) {
        return moment().add(sessionTime - 60, 'seconds').toDate();
    };
    // NOT USED we will use this method for all authorization method before me make a call
    // this is used in situations when we are constantly working
    // the IDLE situation is handled by the IDLE methods on the app
    // component
    AuthenticationService.prototype.refreshTokenWhenNotIdle = function () {
        if (this._userSession != null) {
            if (moment().isAfter(this._userIdentity.accessTokenExpiresDate)) {
                this.refreshToken();
            }
        }
    };
    // identity section
    AuthenticationService.prototype.storeUserIdentity = function (userIdentity) {
        sessionStorage["UserIdentity"] = JSON.stringify(userIdentity);
    };
    AuthenticationService.prototype.getUserIdentity = function () {
        return this._userIdentity;
    };
    AuthenticationService.prototype.removeUserIdentity = function () {
        this._userIdentity = null;
        sessionStorage["UserIdentity"] = "null";
    };
    AuthenticationService.prototype.init = function () {
        if (sessionStorage["UserIdentity"] != "null") {
            this._userIdentity = JSON.parse(sessionStorage["UserIdentity"]);
        }
    };
    // authentication section
    AuthenticationService.prototype.storeAuthData = function (authData) {
        sessionStorage["Authentication"] = JSON.stringify(authData);
    };
    AuthenticationService.prototype.getAuthData = function () {
        return this._authentication;
    };
    AuthenticationService.prototype.removeAuthData = function () {
        this._authentication = null;
        sessionStorage["Authentication"] = "null";
    };
    AuthenticationService.prototype.initAuthData = function () {
        if (sessionStorage["Authentication"] != "null") {
            this._authentication = JSON.parse(sessionStorage["Authentication"]);
        }
    };
    // session section
    AuthenticationService.prototype.storeUsersSession = function (session) {
        sessionStorage["UserSession"] = JSON.stringify(session);
    };
    AuthenticationService.prototype.getUserSession = function () {
        return this._userSession;
    };
    AuthenticationService.prototype.removeUserSession = function () {
        this._userSession = null;
        sessionStorage["UserSession"] = "null";
    };
    AuthenticationService.prototype.initUserSession = function () {
        if (sessionStorage["UserSession"] != "null") {
            this._userSession = JSON.parse(sessionStorage["UserSession"]);
        }
    };
    //****************************************************
    // LOGGING METHODS
    //****************************************************
    AuthenticationService.prototype.onLoginError = function (err, method) {
        this._authentication.isAuthenticated = false;
        this._authentication.authenticationType = "";
        this._loggerService.logErrors(err, "authentication.service had error in the method " + method);
        return Observable_1.Observable.throw(err);
    };
    AuthenticationService.prototype.onRegisterError = function (err, method) {
        this._loggerService.logErrors(err, "authentication.service had error in the method " + method);
        return Observable_1.Observable.throw(err);
    };
    AuthenticationService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http, logger_service_1.LoggerService])
    ], AuthenticationService);
    return AuthenticationService;
}());
exports.AuthenticationService = AuthenticationService;
//# sourceMappingURL=authentication.service.js.map