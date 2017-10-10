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
var levelsUrl = config_1.CONFIG.baseUrls.levels;
var LevelService = (function () {
    function LevelService(_http, _loggerService) {
        this._http = _http;
        this._loggerService = _loggerService;
    }
    ;
    //******************************************************
    // GET LEVELS
    //******************************************************
    LevelService.prototype.getLevels = function (id) {
        var _this = this;
        return this._http.get(levelsUrl)
            .map(function (res) { return res.json(); })
            .catch(function (error) { return _this.onError(error, "GetLevels"); });
    };
    //******************************************************
    // GET LEVEL
    //******************************************************
    LevelService.prototype.getLevel = function (id) {
        var _this = this;
        return this._http.get(levelsUrl + "/" + id)
            .map(function (res) { return res.json(); })
            .catch(function (error) { return _this.onError(error, "GetLevel"); });
    };
    //******************************************************
    // ADD LEVEL
    //******************************************************
    //******************************************************
    // DELETE LEVEL
    //******************************************************
    //******************************************************
    // UPDATE LEVEL
    //******************************************************
    //******************************************************
    // PRIVATE METHODS
    //******************************************************  
    LevelService.prototype.onError = function (err, method) {
        this._loggerService.logErrors(err, "level.service had error in the method " + method);
        return Observable_1.Observable.throw(err);
    };
    LevelService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http, logger_service_1.LoggerService])
    ], LevelService);
    return LevelService;
}());
exports.LevelService = LevelService;
//# sourceMappingURL=level.service.js.map