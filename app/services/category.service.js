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
var categoriesUrl = config_1.CONFIG.baseUrls.categories;
var CategoryService = (function () {
    function CategoryService(_http, _loggerService) {
        this._http = _http;
        this._loggerService = _loggerService;
        if (sessionStorage["UserSession"] !== undefined) {
            this.session = JSON.parse(sessionStorage["UserSession"]);
        }
    }
    ;
    //******************************************************
    // GET CATEGORIES
    //******************************************************  
    CategoryService.prototype.getCategories = function () {
        var _this = this;
        return this._http.get(categoriesUrl)
            .map(function (res) { return res.json(); })
            .catch(function (error) { return _this.onError(error, "GetCategories"); });
    };
    //******************************************************
    // GET CATEGORY
    //****************************************************** 
    CategoryService.prototype.getCategory = function (id) {
        var _this = this;
        return this._http.get(categoriesUrl + "/" + id)
            .map(function (res) { return res.json(); })
            .catch(function (error) { return _this.onError(error, "GetCategory"); });
    };
    //******************************************************
    // ADD CATEGORY
    //******************************************************
    //******************************************************
    // DELETE CATEGORY
    //******************************************************
    //******************************************************
    // UPDATE CATEGORY
    //******************************************************
    //******************************************************
    // PRIVATE METHODS
    //******************************************************  
    CategoryService.prototype.onError = function (err, method) {
        this._loggerService.logErrors(err, "category.service had an error in the method " + method);
        return Observable_1.Observable.throw(err);
    };
    CategoryService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http, logger_service_1.LoggerService])
    ], CategoryService);
    return CategoryService;
}());
exports.CategoryService = CategoryService;
//# sourceMappingURL=category.service.js.map