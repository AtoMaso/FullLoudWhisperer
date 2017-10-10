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
var router_deprecated_1 = require('@angular/router-deprecated');
var member_service_1 = require('../../services/member.service');
var logger_service_1 = require('../../services/logger.service');
var processmessage_service_1 = require('../../services/processmessage.service');
var pagetitle_service_1 = require('../../services/pagetitle.service');
var classes_1 = require('../../helpers/classes');
var MemberComponent = (function () {
    //*****************************************************
    // CONSTRUCTOR IMPLEMENTAION
    //*****************************************************
    function MemberComponent(_routeParams, _router, _memberService, _pmService, _pageTitleService, _loggerService) {
        this._routeParams = _routeParams;
        this._router = _router;
        this._memberService = _memberService;
        this._pmService = _pmService;
        this._pageTitleService = _pageTitleService;
        this._loggerService = _loggerService;
        this.memberid = null;
        this.teamid = 0;
    }
    MemberComponent.prototype.ngOnInit = function () {
        this._pmService.emitRoute("nill");
        this.isRequesting = true;
        this.memberid = this._routeParams.get('id');
        this.teamid = +this._routeParams.get('idteam');
        this.getMember(this.memberid, this.teamid);
    };
    //****************************************************
    // GET MEMBER
    //****************************************************
    MemberComponent.prototype.getMember = function (id, teamid) {
        var _this = this;
        this._memberService.getMember(id, teamid)
            .subscribe(function (returnedMember) {
            _this.onSuccessGetMember(returnedMember);
            _this.isRequesting = false;
        }, function (err) { return _this.onError(err, "GetMember"); });
    };
    //****************************************************
    // UPDATE MEMBER - TODO
    //****************************************************
    MemberComponent.prototype.updateMember = function (id) { };
    //****************************************************
    // PRIVATE METHODS
    //****************************************************
    // determine the member object or go back
    MemberComponent.prototype.onSuccessGetMember = function (passedMember) {
        if (passedMember) {
            this.componentMember = passedMember;
            this._pageTitleService.emitPageTitle(new classes_1.PageTitle("Team Member", this.componentMember.Name));
        }
        else {
            this._gotoMembers();
        }
    };
    // to navigate back if the member is nothing
    MemberComponent.prototype._gotoMembers = function () {
        var route = ['Members', { id: this.componentMember ? this.componentMember.Id : null }];
        this._router.navigate(route);
    };
    // an error has occured
    MemberComponent.prototype.onError = function (err, type) {
        var message = "";
        // stop the spinner
        this.isRequesting = false;
        // we will log the error in the server side by calling the logger, or that is already 
        // done on the server side if the error has been caught
        this._loggerService.logErrors(err, "team member page");
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
                    case "GetMember":
                        this._pmService.emitProcessMessage("PMGM");
                        break;
                    case "UpdateMember":
                        this._pmService.emitProcessMessage("PMUM");
                        break;
                    default:
                        this._pmService.emitProcessMessage("PMG");
                }
            }
        }
    };
    MemberComponent = __decorate([
        core_1.Component({
            selector: 'my-Member',
            templateUrl: './app/views/members/member.component.html',
            directives: [router_deprecated_1.ROUTER_DIRECTIVES],
            providers: [member_service_1.MemberService]
        }), 
        __metadata('design:paramtypes', [router_deprecated_1.RouteParams, router_deprecated_1.Router, member_service_1.MemberService, processmessage_service_1.ProcessMessageService, pagetitle_service_1.PageTitleService, logger_service_1.LoggerService])
    ], MemberComponent);
    return MemberComponent;
}());
exports.MemberComponent = MemberComponent;
//# sourceMappingURL=member.component.js.map