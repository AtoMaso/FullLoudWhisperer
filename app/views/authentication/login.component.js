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
var common_1 = require('@angular/common');
var authentication_service_1 = require('../../services/authentication.service');
var validation_service_1 = require('../../services/validation.service');
var logger_service_1 = require('../../services/logger.service');
var processmessage_service_1 = require('../../services/processmessage.service');
var pagetitle_service_1 = require('../../services/pagetitle.service');
var classes_1 = require('../../helpers/classes');
var control_messages_component_1 = require('../controls/control-messages.component');
var LoginComponent = (function () {
    //*****************************************************
    // CONSTRUCTOR IMPLEMENTAION
    //*****************************************************
    function LoginComponent(_routeParams, _router, _formBuilder, _authenticationService, _pmService, _pageTitleService, _loggerService) {
        this._routeParams = _routeParams;
        this._router = _router;
        this._formBuilder = _formBuilder;
        this._authenticationService = _authenticationService;
        this._pmService = _pmService;
        this._pageTitleService = _pageTitleService;
        this._loggerService = _loggerService;
        this._account = new classes_1.ApplicationUser();
        this.loginForm = this._formBuilder.group({
            //'UserName': ['', Validators.compose([Validators.required, ValidationService.usernameValidator])],
            'Email': ['', common_1.Validators.compose([common_1.Validators.required, validation_service_1.ValidationService.emailValidator, validation_service_1.ValidationService.emailDomainValidator])],
            'Password': ['', common_1.Validators.compose([common_1.Validators.required, validation_service_1.ValidationService.passwordValidator])],
        });
        _pageTitleService.emitPageTitle(new classes_1.PageTitle("Login"));
        _pmService.emitRoute("nill");
    }
    //****************************************************
    // GET ACCOUNT
    //****************************************************
    LoginComponent.prototype.login = function () {
        var _this = this;
        this._authenticationService.login(this._account.Email, this._account.Password)
            .subscribe(function (res) { return _this.onLoginSuccess(res); }, function (error) { return _this.onError(error); });
    };
    //****************************************************
    // PRIVATE METHODS
    //****************************************************
    LoginComponent.prototype.onLoginSuccess = function (res) {
        if (sessionStorage["UserSession"] != "null") {
            this._router.navigate(['Home']);
            this.emitUserSession(res);
        }
    };
    // get the next session from the session observable
    LoginComponent.prototype.emitUserSession = function (res) {
        this._authenticationService.emitUserSession(this._authenticationService.getUserSession());
    };
    //****************************************************
    // LOGGING METHODS
    //****************************************************
    // an error has occured
    LoginComponent.prototype.onError = function (err) {
        var message;
        // stop the spinner
        this.isRequesting = false;
        // we will log the error in the server side by calling the logger, or that is already 
        // done on the server side if the error has been caught
        this._loggerService.logErrors(err, "login");
        // we will display a fiendly process message using the process message service        
        if (err.status !== 200 || err.status !== 300) {
            var data = err.json();
            if (data.error) {
                // login user
                message = data.error;
                this._pmService.emitProcessMessage("PME", message);
            }
            else {
                this._pmService.emitProcessMessage("PMG");
            }
        }
    };
    LoginComponent = __decorate([
        core_1.Component({
            selector: 'login-view',
            templateUrl: 'app/views/authentication/login.component.html',
            directives: [control_messages_component_1.ControlMessages, router_deprecated_1.ROUTER_DIRECTIVES]
        }), 
        __metadata('design:paramtypes', [router_deprecated_1.RouteParams, router_deprecated_1.Router, common_1.FormBuilder, authentication_service_1.AuthenticationService, processmessage_service_1.ProcessMessageService, pagetitle_service_1.PageTitleService, logger_service_1.LoggerService])
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=login.component.js.map