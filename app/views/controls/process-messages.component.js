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
var processmessage_service_1 = require('../../services/processmessage.service');
var ProcessMessagesComponent = (function () {
    // this is the host where this message control is used
    function ProcessMessagesComponent(_pmService) {
        this._pmService = _pmService;
    }
    // display the message text 
    ProcessMessagesComponent.prototype.displayProcessMessage = function (message) {
        try {
            if (message === null) {
                this.errorMessage = null;
            }
            else {
                this.errorMessage = this.getThePrefix(message.type) + message.text;
                this.getControlStyle(message.type);
            }
        }
        catch (error) {
            // Display friendly client message in case the error message can not be displayed
            this.errorMessage = "An error has occured. Please contact the application administration.";
            this.getControlStyle("error");
        }
    };
    ProcessMessagesComponent.prototype.getThePrefix = function (type) {
        switch (type) {
            case "error":
                return "ERROR: ";
            case "warning":
                return "WARNING: ";
            case "information":
                return "INFORMATION: ";
            case "success":
                return "SUCCESS: ";
        }
    };
    // gets the style of the control depending on the type of the message
    ProcessMessagesComponent.prototype.getControlStyle = function (type) {
        switch (type) {
            case "error":
                this.style = "text-danger smalltext";
                break;
            case "warning":
                this.style = "text-warning smalltext";
                break;
            case "information":
                this.style = "text-info smalltext";
                break;
            case "success":
                this.style = "text-success smalltext";
                break;
        }
    };
    ProcessMessagesComponent = __decorate([
        core_1.Component({
            selector: 'process-messages',
            template: " <div class=\"row\">\n                      <div class=\"col-md-10 col-md-offset-1 panel panel-danger\"  *ngIf=\"errorMessage\">\n                          <span [class]=\"style\">{{ errorMessage }}</span>\n                      </div>\n                  </div>"
        }), 
        __metadata('design:paramtypes', [processmessage_service_1.ProcessMessageService])
    ], ProcessMessagesComponent);
    return ProcessMessagesComponent;
}());
exports.ProcessMessagesComponent = ProcessMessagesComponent;
//# sourceMappingURL=process-messages.component.js.map