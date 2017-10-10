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
var ValidationService = (function () {
    function ValidationService() {
    }
    ValidationService.getValidatorErrorMessage = function (code) {
        var config = {
            'required': 'Required',
            'invalidCreditCard': 'Is invalid credit card number',
            'invalidEmailAddress': 'Invalid pattern in your email address.',
            'invalidEmailDomain': 'Invalid domain in your email address',
            'invalidPassword': 'Invalid password. Password must be between 6 and 10 characters long, and contain a number.',
            'invalidConfirmPassword': 'Invalid confirmpassword. Password must be between 6 and 10 characters long, and contain a number.',
            'invalidName': 'Invalid name. The name should contain first name and last name separated by a space with maximum lenght of 50 characters. ',
            'invalidTeamName': 'Invalid team name. The team name must contain alphanumeric character and maximum lenght of 50 characters. ',
            'invalidUsername': 'Invalid username. Username must be 5 alphanumeric characters long. ',
            'invalidPhone': 'Invalid phone. Phone must contain 10 numeric characters. ',
            'invalidWorkpoint': 'Invalid workpoint. Workpoint must contain 3-6 numeric characters separated with a dot character. ',
            'invalidManager': '',
            'invalidLevel': '',
            'invalidPosition': '',
            'invalidTeam': '',
            'invalidLocation': ''
        };
        return config[code];
    };
    // GOOD - TEST IT
    ValidationService.creditCardValidator = function (control) {
        // Visa, MasterCard, American Express, Diners Club, Discover, JCB
        if (control.value) {
            if (control.value.match(/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/)) {
                return null;
            }
            else {
                return { 'invalidCreditCard': true };
            }
        }
    };
    // GOOD
    ValidationService.emailValidator = function (control) {
        if (control.value) {
            // RFC 2822 compliant regex
            //if (control.value.match(/^([a-zA-Z0-9!#$%&'*+/=?^_`{|}~-])(\.[a-zA-Z0-9!#$ %&'*+/=?^_`{|}~-])(\@\w+(\.\w{3})(\.\w{2}))$/)) {
            if (control.value.match(/^(\w+)(\.\w+)(\@\w+(\.\w{3})(\.\w{2}))$/)) {
                return null;
            }
            else {
                return { 'invalidEmailAddress': true };
            }
        }
    };
    ValidationService.emailDomainValidator = function (control) {
        if (control.value) {
            // RFC 2822 compliant regex
            if (control.value.match(/^(\w+)(\.\w+)(\@ato.gov.au)$/)) {
                return null;
            }
            else {
                return { 'invalidEmailDomain': true };
            }
        }
    };
    // GOOD
    ValidationService.passwordValidator = function (control) {
        // {6,100}-Assert password is between 6 and 100 characters
        // (?=.*[0-9])-Assert a string has at least one number
        if (control.value) {
            if (control.value.match(/^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,10}$/)) {
                return null;
            }
            else {
                return { 'invalidPassword': true };
            }
        }
    };
    // GOOD
    ValidationService.confirmPasswordValidator = function (control) {
        // {6,100}-Assert password is between 6 and 100 characters
        // (?=.*[0-9])-Assert a string has at least one number
        if (control.value) {
            if (control.value.match(/^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,10}$/)) {
                return null;
            }
            else {
                return { 'invalidConfirmPassword': true };
            }
        }
    };
    // GOOD
    ValidationService.usernameValidator = function (control) {
        // {5}-Assert username is 5 characters
        if (control.value) {
            if (control.value.match(/^(\w{5})$/)) {
                return null;
            }
            else {
                return { 'invalidUsername': true };
            }
        }
    };
    // GOOD
    ValidationService.phoneValidator = function (control) {
        // {1-10}-Assert phone is numeric only
        if (control.value) {
            if (control.value.match(/^(\d{10})$/)) {
                return null;
            }
            else {
                return { 'invalidPhone': true };
            }
        }
    };
    // GOOD
    ValidationService.workpointValidator = function (control) {
        // {3-6}-Assert workpoint is alphanumeric characters and the dot character
        if (control.value) {
            if (control.value.match(/^\d{1,3}(\.\d{1,3})$/)) {
                return null;
            }
            else {
                return { 'invalidWorkpoint': true };
            }
        }
    };
    // GOOD
    ValidationService.nameValidator = function (control) {
        // Name should be any character set separated with minimum one space
        if (control.value) {
            if (control.value.match(/^(\w{1,20}\s+\w{1,30})$/)) {
                return null;
            }
            else {
                return { 'invalidName': true };
            }
        }
    };
    // GOOD
    ValidationService.teamNameValidator = function (control) {
        // Name should be any character set separated with minimum one space
        if (control.value) {
            // if (control.value.match(/^(\w{1,50})$/)) {
            if (control.value.match(/^\w+( +\w+)*$/)) {
                return null;
            }
            else {
                return { 'invalidTeamName': true };
            }
        }
    };
    ValidationService.memberManagerValidator = function (control) {
        // Name should be any character set separated with minimum one space
        if (control.value) {
            if (control.value.match(/^(\w+)$/)) {
                return null;
            }
            else {
                return { 'invalidManager': true };
            }
        }
    };
    ValidationService.levelValidator = function (control) {
        // Name should be any character set separated with minimum one space
        if (control.value) {
            if (control.value.match(/^(\w+)$/)) {
                return null;
            }
            else {
                return { 'invalidLevel': true };
            }
        }
    };
    ValidationService.positionValidator = function (control) {
        // Name should be any character set separated with minimum one space
        if (control.value) {
            if (control.value.match(/^(\w+)$/)) {
                return null;
            }
            else {
                return { 'invalidPosition': true };
            }
        }
    };
    ValidationService.locationValidator = function (control) {
        // Name should be any character set separated with minimum one space
        if (control.value) {
            if (control.value.match(/^(\w+)$/)) {
                return null;
            }
            else {
                return { 'invalidLocation': true };
            }
        }
    };
    ValidationService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], ValidationService);
    return ValidationService;
}());
exports.ValidationService = ValidationService;
//# sourceMappingURL=validation.service.js.map