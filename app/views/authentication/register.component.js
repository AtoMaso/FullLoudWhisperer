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
var classes_1 = require('../../helpers/classes');
var logger_service_1 = require('../../services/logger.service');
var authentication_service_1 = require('../../services/authentication.service');
var control_messages_component_1 = require('../controls/control-messages.component');
var validation_service_1 = require('../../services/validation.service');
var processmessage_service_1 = require('../../services/processmessage.service');
var pagetitle_service_1 = require('../../services/pagetitle.service');
var RegisterComponent = (function () {
    //*****************************************************
    // CONSTRUCTOR IMPLEMENTAION
    //*****************************************************
    function RegisterComponent(_routeParams, _router, _formBuilder, _authenticationService, _pmService, _pageTitleService, _loggerService) {
        this._routeParams = _routeParams;
        this._router = _router;
        this._formBuilder = _formBuilder;
        this._authenticationService = _authenticationService;
        this._pmService = _pmService;
        this._pageTitleService = _pageTitleService;
        this._loggerService = _loggerService;
        this._account = new classes_1.ApplicationUser();
        this.submitted = false;
        this.signInForm = this._formBuilder.group({
            'Name': ['', common_1.Validators.compose([common_1.Validators.required, validation_service_1.ValidationService.nameValidator])],
            'AtoUsername': ['', common_1.Validators.compose([common_1.Validators.required, validation_service_1.ValidationService.usernameValidator])],
            'Email': ['', common_1.Validators.compose([common_1.Validators.required, validation_service_1.ValidationService.emailValidator, validation_service_1.ValidationService.emailDomainValidator])],
            'Password': ['', common_1.Validators.compose([common_1.Validators.required, validation_service_1.ValidationService.passwordValidator])],
            'ConfirmPassword': ['', common_1.Validators.compose([common_1.Validators.required, validation_service_1.ValidationService.confirmPasswordValidator])],
        });
        _pageTitleService.emitPageTitle(new classes_1.PageTitle("Register"));
        _pmService.emitRoute("nill");
        this._account.Role = this._routeParams.get('role');
    }
    //****************************************************
    // GET ACCOUNT
    //****************************************************
    RegisterComponent.prototype.register = function () {
        var _this = this;
        if (this.ComparePasswords()) {
            this._authenticationService.register(this._account)
                .subscribe(function (res) { return _this.onSucessRegistering(res); }, function (err) { return _this.onError(err); });
        }
    };
    RegisterComponent.prototype.ComparePasswords = function () {
        if (this._account.Password === this._account.ConfirmPassword) {
            return true;
        }
        else {
            this._pmService.emitProcessMessage("PMPNE");
            return false;
        }
    };
    RegisterComponent.prototype.onSucessRegistering = function (res) {
        this.submitted = true;
        this._pmService.emitProcessMessage("PMRS");
    };
    // toggles the submitted flag which should disable the form and
    // show the succes small form
    RegisterComponent.prototype.onSubmit = function () { this.submitted = true; };
    //****************************************************
    // PRIVATE METHODS
    //****************************************************
    RegisterComponent.prototype.onError = function (err) {
        var message = null;
        // we will log the error in the server side by calling the logger, or that is already 
        // done on the server side if the error has been caught
        this._loggerService.logErrors(err, "register");
        // we will display a fiendly process message using the process message service   
        if (err.status !== 200 || err.status !== 300) {
            var data = err.json();
            if (data.ModelState) {
                for (var key in data.ModelState) {
                    for (var i = 0; i < data.ModelState[key].length; i++) {
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
                this._pmService.emitProcessMessage("PMG");
            }
        } //end if       
    }; // end method
    RegisterComponent = __decorate([
        core_1.Component({
            selector: 'sign-in-view',
            templateUrl: 'app/views/authentication/register.component.html',
            directives: [control_messages_component_1.ControlMessages, router_deprecated_1.ROUTER_DIRECTIVES]
        }), 
        __metadata('design:paramtypes', [router_deprecated_1.RouteParams, router_deprecated_1.Router, common_1.FormBuilder, authentication_service_1.AuthenticationService, processmessage_service_1.ProcessMessageService, pagetitle_service_1.PageTitleService, logger_service_1.LoggerService])
    ], RegisterComponent);
    return RegisterComponent;
}());
exports.RegisterComponent = RegisterComponent; // end class
//# sourceMappingURL=register.component.js.map