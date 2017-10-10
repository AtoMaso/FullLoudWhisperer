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
var logger_service_1 = require('./logger.service');
var ImageService = (function () {
    function ImageService(_http, _loggerService) {
        this._http = _http;
        this._loggerService = _loggerService;
    }
    ;
    //******************************************************
    // GET IMAGES
    //******************************************************
    ImageService.prototype.getImages = function () {
        var _this = this;
        return this._http.get("app/api/images.json")
            .map(function (response) { return response.json().data; })
            .catch(function (error) { return _this.onError(error, "GetImages"); });
    };
    //******************************************************
    // PRIVATE METHODS
    //******************************************************
    ImageService.prototype.onError = function (error, method) {
        this._loggerService.logErrors(error, "image.service " + " has happened in method " + method);
        return Observable_1.Observable.throw(error);
        //return Observable.throw(error.json().error || 'Server error');
    };
    ImageService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http, logger_service_1.LoggerService])
    ], ImageService);
    return ImageService;
}());
exports.ImageService = ImageService;
//# sourceMappingURL=image.service.js.map