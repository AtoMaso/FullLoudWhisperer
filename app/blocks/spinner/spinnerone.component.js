'use strict';
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
var SpinnerOneComponent = (function () {
    function SpinnerOneComponent() {
        this.isDelayedRunning = false;
        this.delay = 300;
    }
    Object.defineProperty(SpinnerOneComponent.prototype, "isRunning", {
        set: function (value) {
            var _this = this;
            if (!value) {
                this.cancelTimeout();
                this.isDelayedRunning = false;
            }
            if (this.currentTimeout) {
                return;
            }
            this.currentTimeout = setTimeout(function () {
                _this.isDelayedRunning = value;
                _this.cancelTimeout();
            }, this.delay);
        },
        enumerable: true,
        configurable: true
    });
    SpinnerOneComponent.prototype.cancelTimeout = function () {
        clearTimeout(this.currentTimeout);
        this.currentTimeout = undefined;
    };
    SpinnerOneComponent.prototype.ngOnDestroy = function () {
        this.cancelTimeout();
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], SpinnerOneComponent.prototype, "delay", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean), 
        __metadata('design:paramtypes', [Boolean])
    ], SpinnerOneComponent.prototype, "isRunning", null);
    SpinnerOneComponent = __decorate([
        core_1.Component({
            selector: 'my-spinner',
            templateUrl: './app/blocks/spinner/spinnerone.component.html'
        }), 
        __metadata('design:paramtypes', [])
    ], SpinnerOneComponent);
    return SpinnerOneComponent;
}());
exports.SpinnerOneComponent = SpinnerOneComponent;
//# sourceMappingURL=spinnerone.component.js.map