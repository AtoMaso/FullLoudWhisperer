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
var config_1 = require('../../config');
var image_service_1 = require('../../services/image.service');
var logger_service_1 = require('../../services/logger.service');
var processmessage_service_1 = require('../../services/processmessage.service');
var numberOfImages = config_1.CONFIG.appKeys.numberOfImages;
var totalNumberOfImages = config_1.CONFIG.appKeys.totalNumberOfImages;
var CSSCarouselComponent = (function () {
    function CSSCarouselComponent(_imageService, _loggerService, _pmService) {
        this._imageService = _imageService;
        this._loggerService = _loggerService;
        this._pmService = _pmService;
        this.allImages = [];
        this.selectedNumbers = [];
        this.showImages1 = [];
        this.showImages2 = [];
        this.showImages3 = [];
        this.showImages4 = [];
        this.showImages5 = [];
        this.showImages6 = [];
        this.setNumber = 0;
        this.isVisible = true;
        this.getImages();
    }
    // gets the images data from the local json file
    CSSCarouselComponent.prototype.getImages = function () {
        var _this = this;
        this._imageService.getImages()
            .subscribe(function (images) { return _this.onSuccessGetImage(images); }, function (error) { return _this.onError(error); });
    };
    //**************************************************************
    // PRIVATE METHODS ARTICLES
    //**************************************************************
    // on success of the http call
    CSSCarouselComponent.prototype.onSuccessGetImage = function (passedImages) {
        this.allImages = passedImages;
        this.showImages1 = this.getRandomImages();
        this.showImages2 = this.getRandomImages();
        this.showImages3 = this.getRandomImages();
        this.showImages4 = this.getRandomImages();
        this.showImages5 = this.getRandomImages();
        this.showImages6 = this.getRandomImages();
    };
    // get the random images to display
    CSSCarouselComponent.prototype.getRandomImages = function () {
        var img = [];
        for (var x = 0; x < numberOfImages; x++) {
            this.getUniqueRandomSet();
            // img.push(IMAGES[this.selectedNumbers[x]]);
            img.push(this.allImages[this.selectedNumbers[x + this.setNumber * 5]]);
        }
        this.setNumber++;
        return img;
    };
    // gets the random numbers for different sets
    CSSCarouselComponent.prototype.getUniqueRandomSet = function () {
        var num = Math.floor(Math.random() * totalNumberOfImages);
        if (num < 1) {
            num = 1;
        }
        this.selectedNumbers.push(num);
        for (var x = 0; x < this.selectedNumbers.length - 1; x++) {
            if (num === this.selectedNumbers[x]) {
                this.selectedNumbers.pop();
                this.getUniqueRandomSet();
            }
        }
    };
    // on error of http call
    CSSCarouselComponent.prototype.onError = function (err) {
        // toggle visibility when error is raised
        this.isVisible = false;
        // we will log the error in the server side by calling the logger, or that is already 
        // done on the server side if the error has been caught
        this._loggerService.logErrors(err, "carousel control");
        // we will display a fiendly process message using the process message service             
        this._pmService.emitProcessMessage("PMGI");
    };
    CSSCarouselComponent = __decorate([
        core_1.Component({
            selector: 'css-carousel',
            templateUrl: './app/views/controls/carousel.component.html',
            styleUrls: ['assets/css/carousel.component.css'],
            providers: [image_service_1.ImageService]
        }), 
        __metadata('design:paramtypes', [image_service_1.ImageService, logger_service_1.LoggerService, processmessage_service_1.ProcessMessageService])
    ], CSSCarouselComponent);
    return CSSCarouselComponent;
}());
exports.CSSCarouselComponent = CSSCarouselComponent;
//# sourceMappingURL=carousel.component.js.map