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
/// <reference path="../../../typings/tsd.d.ts" />
var core_1 = require('@angular/core');
var common_1 = require('@angular/common');
var ng2_file_upload_1 = require('ng2-file-upload');
var config_1 = require('../../config');
var processmessage_service_1 = require('../../services/processmessage.service');
var classes_1 = require('../../helpers/classes');
var uploadsUrl = config_1.CONFIG.baseUrls.uploads;
var uploadsAttachUrl = config_1.CONFIG.baseUrls.uploadsattach;
var NG2FileUploadComponent = (function () {
    function NG2FileUploadComponent(_pmService) {
        this._pmService = _pmService;
        this.identity = new classes_1.UserIdentity;
        this.isAuthenticated = false;
        this.isAllowed = false;
        this.uploader = new ng2_file_upload_1.FileUploader({
            url: uploadsUrl,
            queueLimit: 5,
            maxFileSize: 1024 * 1024,
        });
        this.hasBaseDropZoneOver = true;
        this.hasAnotherDropZoneOver = false;
    }
    NG2FileUploadComponent.prototype.uploadSingleFile = function (item) {
        item.withCredentials = false;
        item.file.name = "ArticleId" + item.file.name;
        item.upload();
    };
    NG2FileUploadComponent.prototype.fileOverBase = function (e) {
        this.hasBaseDropZoneOver = e;
    };
    NG2FileUploadComponent.prototype.fileOverAnother = function (e) {
        this.hasAnotherDropZoneOver = e;
    };
    NG2FileUploadComponent = __decorate([
        core_1.Component({
            selector: 'ng2-file-upload',
            templateUrl: './app/views/file-upload/ng2-file-upload.component.html',
            directives: [ng2_file_upload_1.FILE_UPLOAD_DIRECTIVES, common_1.NgClass, common_1.NgStyle, common_1.CORE_DIRECTIVES, common_1.FORM_DIRECTIVES]
        }), 
        __metadata('design:paramtypes', [processmessage_service_1.ProcessMessageService])
    ], NG2FileUploadComponent);
    return NG2FileUploadComponent;
}());
exports.NG2FileUploadComponent = NG2FileUploadComponent;
//# sourceMappingURL=ng2-file-upload.component.js.map