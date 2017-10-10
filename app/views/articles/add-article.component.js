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
var router_deprecated_1 = require('@angular/router-deprecated');
var http_1 = require('@angular/http');
var common_1 = require('@angular/common');
var ng2_file_upload_1 = require('ng2-file-upload');
var config_1 = require('../../config');
var article_service_1 = require('../../services/article.service');
var category_service_1 = require('../../services/category.service');
var logger_service_1 = require('../../services/logger.service');
var processmessage_service_1 = require('../../services/processmessage.service');
var pagetitle_service_1 = require('../../services/pagetitle.service');
var control_messages_component_1 = require('../controls/control-messages.component');
var classes_1 = require('../../helpers/classes');
var uploadsUrl = config_1.CONFIG.baseUrls.uploads;
var uploadsAttachUrl = config_1.CONFIG.baseUrls.uploadsattach;
var uploadPhysical = config_1.CONFIG.baseUrls.uploadsphysical;
var AddArticleComponent = (function () {
    function AddArticleComponent(_http, _articleService, _categoryService, _pmService, _pageTitleService, _loggerService, _formBuilder) {
        this._http = _http;
        this._articleService = _articleService;
        this._categoryService = _categoryService;
        this._pmService = _pmService;
        this._pageTitleService = _pageTitleService;
        this._loggerService = _loggerService;
        this._formBuilder = _formBuilder;
        this.newArticle = new classes_1.Article();
        this.returnedArticle = new classes_1.Article();
        this.returnedAttachements = [];
        this.categories = [];
        this.isSubmitted = false;
        this.isRequesting = false;
        this.isVisible = false;
        this.isMessageVisible = false;
        this.isFileAllowed = false;
        this.fileErrorMessage = "";
        this.uploader = new ng2_file_upload_1.FileUploader({
            url: uploadsUrl,
            queueLimit: 2,
            maxFileSize: 1024 * 1024,
            allowedFileType: ['csv', 'xls', 'xlsx', 'xml', 'txt', 'doc', 'docx', 'cs', 'vb', 'sql', 'json']
        });
        this.hasBaseDropZoneOver = true;
        this.hasAnotherDropZoneOver = false;
        this.articleForm = this._formBuilder.group({
            'Title': ['', common_1.Validators.compose([common_1.Validators.required])],
            'Flash': ['', common_1.Validators.compose([common_1.Validators.required,])],
            'Content': ['', common_1.Validators.required],
            'Category': ['', common_1.Validators.required],
        });
    }
    ;
    AddArticleComponent.prototype.ngOnInit = function () {
        // generate the article id which will need to be passed as part of the file attached
        this.articleId = classes_1.Guid.newGuid();
        this._pageTitleService.emitPageTitle(new classes_1.PageTitle("Add Article"));
        this._pmService.emitRoute("nill");
        this.isRequesting = false;
        this.isFileAllowed = false;
        this.getCategories();
    };
    AddArticleComponent.prototype.fileOverBase = function (e) {
        this.hasBaseDropZoneOver = e;
    };
    AddArticleComponent.prototype.fileOverAnother = function (e) {
        this.hasAnotherDropZoneOver = e;
    };
    //*******************************************
    // GET CATEGORIES 
    //*******************************************
    AddArticleComponent.prototype.getCategories = function () {
        var _this = this;
        this._categoryService.getCategories()
            .subscribe(function (returnedCategories) {
            if (returnedCategories.length == 0) {
                _this._pmService.emitProcessMessage("PMNOCs");
            }
            _this.categories = returnedCategories,
                _this.isRequesting = false;
        }, function (res) { return _this.onError(res, "GetCategories"); });
    };
    //*************************************
    // ADD ARTICLE
    //*************************************
    AddArticleComponent.prototype.onChange = function (event) {
        var _this = this;
        this.isFileAllowed = false;
        this.isMessageVisible = false;
        var i = 0;
        // get the files from the event which controll has passed
        var files = event.srcElement.files;
        // MULTIPLE FILES POSSIBLE
        // check the number of files selected
        if ((this.uploader.queue.length + files.length) > 2) {
            this.isMessageVisible = true;
            this.fileErrorMessage = "Warning: Maximum of 2 files can be attached with maximum size of 10MB each!";
        }
        for (i = 0; i < files.length; i++) {
            // check the sizeof the file
            if (files[i].size > this.uploader.options.maxFileSize) {
                this.isMessageVisible = true;
                this.fileErrorMessage = "Warning: The selected file '" + files[i].name + "' is too big!";
            }
            // check the type of the file
            this.uploader.options.allowedFileType.forEach(function (type) {
                var filename = files[i].name.split(".");
                if (type === filename[filename.length - 1]) {
                    _this.isFileAllowed = true;
                }
            });
            if (!this.isFileAllowed) {
                this.isMessageVisible = true;
                var filename = files[i].name.split(".");
                this.fileErrorMessage = "Warning: The  file extension '" + filename[filename.length - 1] + "' is not allowed!";
            }
        }
        // SINGLE FILE AT THE TIME
        //if (this.uploader.queue.length == 2) {
        //    this.isMessageVisible = true;     
        //    this.fileErrorMessage = "Warning: Maximum of 2 files can be attached and with maximum size of 10MB each!";
        //    return;
        //}
        //// check the size of the file selected
        //if (files[0].size > this.uploader.options.maxFileSize) {
        //      this.isMessageVisible = true;
        //      this.fileErrorMessage = "Warning: The file selected " + files[0].name  + " is too big!";
        //}
        //// check the selected file type
        //this.uploader.options.allowedFileType.forEach(type => {
        //      let filename = files[0].name.split(".");
        //      if (type === filename[filename.length-1]) {
        //            this.isFileAllowed = true;
        //      }
        //});
        //if (!this.isFileAllowed) {        
        //  this.isMessageVisible = true;       
        //    this.fileErrorMessage = "Warning: The file extension not allowed!";
        //}
    };
    // called when remove file button is clicked
    AddArticleComponent.prototype.removeFile = function (item) {
        this.isMessageVisible = false;
        item.remove();
    };
    // called when remove all files button is clicked
    AddArticleComponent.prototype.removeAllFiles = function () {
        this.isMessageVisible = false;
        this.uploader.clearQueue();
    };
    AddArticleComponent.prototype.saveArticle = function () {
        var _this = this;
        if (this.articleForm.dirty && this.articleForm.valid) {
            this.isMessageVisible = false;
            this.isRequesting = true;
            this.newArticle.ArticleId = this.articleId;
            // upload files if any and get result first
            if (this.uploader.queue.length > 0) {
                this.uploader.queue.forEach(function (x) { return _this.uploadSingleFile(x); });
            }
            this.addArticle(this.newArticle);
        }
    };
    AddArticleComponent.prototype.uploadSingleFile = function (item) {
        var originalFileName = item.file.name;
        item.withCredentials = false;
        // we are making the name unique evenif the file is the same 
        // and does exist on the server upload side
        item.file.name = this.articleId + "_" + item.file.name;
        item.upload();
        // set the attachement array here
        var attachement = new classes_1.Attachement();
        // date and the authorid of the article are added in the artcile service
        // the service has an access to the session and user identity
        attachement.ArticleId = this.articleId;
        attachement.Name = item.file.name;
        attachement.PhysicalPath = uploadPhysical + "/" + item.file.name;
        this.newArticle.Attachements.push(attachement);
    };
    AddArticleComponent.prototype.addArticle = function (article) {
        var _this = this;
        if (!article) {
            return;
        }
        // call the article service to post the articles
        this._articleService.addArticle(article)
            .subscribe(function (addedArticle) { return _this.onSuccessAddArticle(addedArticle); }, (function (err) { return _this.onError(err, "AddArticle"); }));
    };
    //*****************************************************
    // PRIVATE METHODS ARTICLES
    //*****************************************************
    AddArticleComponent.prototype.onSuccessAddArticle = function (article) {
        this.isSubmitted = true;
        this.returnedArticle = article;
        this.returnedAttachements = article.Attachements;
        if (this.returnedAttachements.length > 0) {
            this.isVisible = true;
        }
        this.isRequesting = false;
        this._pmService.emitProcessMessage("PMAAS");
    };
    // an error has occured
    AddArticleComponent.prototype.onError = function (err, type) {
        var message = "";
        // stop the spinner
        this.isRequesting = false;
        // we will log the error in the server side by calling the logger, or that is already 
        // done on the server side if the error has been caught
        this._loggerService.logErrors(err, "add article page");
        // we will display a fiendly process message using the process message service             
        this._pmService.emitProcessMessage("PMAA");
        // we will display a fiendly process message using the process message service   
        if (err.status !== 200 || err.status !== 300) {
            var data = err.json();
            if (data.ModelState) {
                for (var key in data.ModelState) {
                    for (var i = 0; i < data.ModelState[key].length; i++) {
                        //errors.push(data.modelState[key][i]);
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
                // we will display a fiendly process message using the process message service    
                switch (type) {
                    case "AddArticle":
                        this._pmService.emitProcessMessage("PMAA");
                        break;
                    case "GetCategories":
                        this._pmService.emitProcessMessage("PMGCs");
                        break;
                    default:
                        this._pmService.emitProcessMessage("PMG");
                }
            }
        }
    };
    AddArticleComponent = __decorate([
        core_1.Component({
            selector: 'article-view',
            templateUrl: './app/views/articles/add-article.component.html',
            directives: [router_deprecated_1.ROUTER_DIRECTIVES, control_messages_component_1.ControlMessages, ng2_file_upload_1.FILE_UPLOAD_DIRECTIVES, common_1.NgClass, common_1.NgStyle, common_1.CORE_DIRECTIVES, common_1.FORM_DIRECTIVES],
            providers: [http_1.Http, http_1.HTTP_BINDINGS, article_service_1.ArticleService, category_service_1.CategoryService]
        }), 
        __metadata('design:paramtypes', [http_1.Http, article_service_1.ArticleService, category_service_1.CategoryService, processmessage_service_1.ProcessMessageService, pagetitle_service_1.PageTitleService, logger_service_1.LoggerService, common_1.FormBuilder])
    ], AddArticleComponent);
    return AddArticleComponent;
}());
exports.AddArticleComponent = AddArticleComponent;
//// check the number of files selected
//if (files.length > 2) {
//  this.isMessageVisible = true;
//  this.fileErrorMessage = "Warning: Maximum of 2 files can be attached and with maximum size of 10MB each!";
//  return;
//}
//for (i = 0; i < files.length; i++) {
//  if (files[i].size > this.uploader.options.maxFileSize) {
//    this.isMessageVisible = true;
//    this.fileErrorMessage = "Warning: The file " + files[i].name + " selected is too big!";
//  }
//  // check the type of each file
//  this.uploader.options.allowedFileType.forEach(type => {
//    let filename = files[i].name.split(".");
//    if (type === filename[filename.length - 1]) {
//      this.isFileAllowed = true;
//    }
//  });
//  if (!this.isFileAllowed) {
//    this.isMessageVisible = true;
//    this.fileErrorMessage = "Warning: The file extension " + " not allowed!";
//    return;
//  }
//}
//this.uploader.addToQueue(files); 
//# sourceMappingURL=add-article.component.js.map