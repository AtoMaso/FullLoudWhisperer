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
var Observable_1 = require('rxjs/Observable');
var BehaviorSubject_1 = require('rxjs/BehaviorSubject');
var logger_service_1 = require('./logger.service');
var ProcessMessageService = (function () {
    function ProcessMessageService(_http, _loggerService) {
        this._http = _http;
        this._loggerService = _loggerService;
        this.allProcessMessages = [];
        this._behaviorProcessMessageStore = new BehaviorSubject_1.BehaviorSubject(null);
        this._behaviorMessageObserver$ = this._behaviorProcessMessageStore.asObservable();
        this._behaviorRouteStore = new BehaviorSubject_1.BehaviorSubject(null);
        this._behaviorRouteObserver$ = this._behaviorRouteStore.asObservable();
        this.getProcessMessage();
    }
    ;
    //******************************************************
    // GET PROCESS MESSAGE
    //******************************************************
    // method called in the contructor to initialis all process messages
    ProcessMessageService.prototype.getProcessMessage = function () {
        var _this = this;
        this.getProcessMessagesFromRepository()
            .subscribe(function (messages) { return _this.onSuccess(messages); }, function (error) { return _this.onError(error, "GetProcessMessage"); });
    };
    // get the process messages from the json repository
    ProcessMessageService.prototype.getProcessMessagesFromRepository = function () {
        var _this = this;
        return this._http.get("app/api/processmessages.json")
            .map(function (response) { return response.json().data; })
            .catch(function (error) { return _this.onError(error, "GetProcessmessageFromRepository"); });
    };
    // get process message based on the message id
    ProcessMessageService.prototype.getProcessMessageById = function (id) {
        return this.allProcessMessages.find(function (pm) { return pm.id === id; });
    };
    // raises the event which the app component is subcribed to
    // and the messageis passed to the child control on the app component
    ProcessMessageService.prototype.emitProcessMessage = function (id, message) {
        var pm = this.getProcessMessageById(id);
        if (id == "PME") {
            pm.text = message;
        }
        this._behaviorProcessMessageStore.next(pm);
    };
    // raises the event which the app component is subcribed to
    // and the messageis passed to the child control on the app component
    ProcessMessageService.prototype.emitRoute = function (id) {
        this._behaviorRouteStore.next(id);
    };
    //******************************************************
    // PRIVATE METHODS
    //******************************************************
    // on success of the http call
    ProcessMessageService.prototype.onSuccess = function (passedMessages) {
        this.allProcessMessages = passedMessages;
        // plus other stuff here
    };
    // logs errors to the web api side
    ProcessMessageService.prototype.onError = function (err, method) {
        this._loggerService.logErrors(err, "processmessage.service had an error in the method " + method);
        return Observable_1.Observable.throw(err);
        //this._loggerService.logErrors(error, "processmessage.service");            
        //return Observable.throw(error.json().error || 'Server error');
    };
    ProcessMessageService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http, logger_service_1.LoggerService])
    ], ProcessMessageService);
    return ProcessMessageService;
}());
exports.ProcessMessageService = ProcessMessageService;
//# sourceMappingURL=processmessage.service.js.map