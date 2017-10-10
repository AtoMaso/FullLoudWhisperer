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
var pagetitle_service_1 = require('../../services/pagetitle.service');
var classes_1 = require('../../helpers/classes');
var AboutComponent = (function () {
    function AboutComponent(_pmService, _pageTitleService) {
        this._pmService = _pmService;
        this._pageTitleService = _pageTitleService;
        this._pageTitleService.emitPageTitle(new classes_1.PageTitle("About Us Page"));
        this._pmService.emitRoute("nill");
    }
    AboutComponent = __decorate([
        core_1.Component({
            selector: 'about-view',
            templateUrl: 'app/views/info/about.component.html'
        }), 
        __metadata('design:paramtypes', [processmessage_service_1.ProcessMessageService, pagetitle_service_1.PageTitleService])
    ], AboutComponent);
    return AboutComponent;
}());
exports.AboutComponent = AboutComponent;
//# sourceMappingURL=about.component.js.map