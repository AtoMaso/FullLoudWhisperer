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
require('./rxjs-operators');
var authcheck_1 = require('./services/authcheck');
var core_2 = require('ng2-idle/core');
var authentication_service_1 = require('./services/authentication.service');
var processmessage_service_1 = require('./services/processmessage.service');
var pagetitle_service_1 = require('./services/pagetitle.service');
var dashboard_component_1 = require('./views/dashboard/dashboard.component');
var home_component_1 = require('./views/authentication/home.component');
var article_list_component_1 = require('./views/articles/article-list.component');
var article_component_1 = require('./views/articles/article.component');
var add_article_component_1 = require('./views/articles/add-article.component');
//import { NG2FileUploadComponent } from './views/file-upload/ng2-file-upload.component';
var author_list_component_1 = require('./views/authors/author-list.component');
var author_component_1 = require('./views/authors/author.component');
var add_author_component_1 = require('./views/authors/add-author.component');
var team_list_component_1 = require('./views/teams/team-list.component');
var team_component_1 = require('./views/teams/team.component');
var add_team_component_1 = require('./views/teams/add.team.component');
var member_list_component_1 = require('./views/members/member-list.component');
var member_component_1 = require('./views/members/member.component');
var add_member_component_1 = require('./views/members/add.member.component');
//import { UserListComponent } from './views/users/user-list.component';
//import { UserComponent } from './views/users/user.component';
//import { AddUserComponent } from './views/users/add.user.component';
var about_component_1 = require('./views/info/about.component');
var contact_component_1 = require('./views/info/contact.component');
var login_component_1 = require('./views/authentication/login.component');
var register_component_1 = require('./views/authentication/register.component');
var modaldialog_component_1 = require('./views/controls/modaldialog.component');
var process_messages_component_1 = require('./views/controls/process-messages.component');
var pagetitle_component_1 = require('./views/controls/pagetitle.component');
var classes_1 = require('./helpers/classes');
var AppComponent = (function () {
    //******************************************************
    //CONSTRUCTOR AND CICLE METHODS
    //******************************************************
    function AppComponent(_authenticationService, _pmService, _titleService, _router, idle) {
        this._authenticationService = _authenticationService;
        this._pmService = _pmService;
        this._titleService = _titleService;
        this._router = _router;
        this.idle = idle;
        // this is a reference to itself passed to the child ModalDialog
        this.itself = this;
        this._authentication = new classes_1.Authentication();
        this._userSession = new classes_1.UserSession();
        this._userIdentity = new classes_1.UserIdentity();
        this._isUserAuthenticated = false;
        this._isUserAllowed = false;
        sessionStorage['UserSession'] = "null";
    }
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._subscriptionSession =
            this._authenticationService._behaviorSessionStore
                .subscribe(function (session) {
                // this needs to be check otherwise the app component fails on session not created yet
                if (session !== null) {
                    _this._userSession = session,
                        _this._isUserAuthenticated = session.authentication.isAuthenticated;
                    _this.IsAllowed();
                    _this.IdleSetup(session.userIdentity.accessTokenExpiresIn);
                }
            });
        this._subscriptionMessages =
            this._pmService._behaviorProcessMessageStore
                .subscribe(function (message) {
                // this needs to be check otherwise the app component fails on pmComponent not created yet
                if (message) {
                    _this.messagesComponent.displayProcessMessage(message);
                }
            });
        this._subscriptionTitle =
            this._titleService._behaviorTitleStore
                .subscribe(function (page) {
                // this needs to be check otherwise the app component fails on pmComponent not created yet
                if (page) {
                    _this.pageTitleComponent.displayPageTitle(page);
                }
            });
        this._subscriptionRouter =
            this._pmService._behaviorRouteStore
                .subscribe(function () {
                if (_this.messagesComponent) {
                    _this.messagesComponent.displayProcessMessage(null);
                }
            });
    };
    AppComponent.prototype.ngOnDestroy = function () {
        this._subscriptionSession.unsubscribe();
        this._subscriptionMessages.unsubscribe();
        this._subscriptionTitle.unsubscribe();
        this._subscriptionRouter.unsubscribe();
    };
    //*******************************************************
    // PUBLIC METHODS
    //*******************************************************
    // called from the session modal dialog when session needs to be closed
    AppComponent.prototype.onCloseSession = function () {
        this.logOut();
        this._isUserAuthenticated = false;
        this._isUserAllowed = false;
    };
    //*******************************************************
    // PRIVATE METHODS
    //*******************************************************
    AppComponent.prototype.IdleSetup = function (sessiontimeout) {
        var _this = this;
        // sets an idle timeout , in this case this is returned from webapi as 2 minutes
        // and we are giving a minute he user to refresh the session token before is logged out.
        // the session will be session-2 minutes. One minute as set for the dialog box to be shown
        // and the next minute to refresh the token before the original token expires
        this.idle.setIdle(sessiontimeout - 2 * 60);
        // testing only
        //this.idle.setIdle(30);
        // sets the session timeout warning period, the user will be considered 
        // timed out when we add setIdle and setTimeout times are add together
        // we are giving the warning shown for 30 seconds????   
        this.idle.setTimeout(30);
        // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
        this.idle.setInterrupts(core_2.DEFAULT_INTERRUPTSOURCES);
        // the client has decided to continue, so refresh the token
        this.idle.onIdleEnd.subscribe(function () {
            // call the referesh token method to get the refresh token from the webapi        
            _this._authenticationService.refreshToken();
            //console.log("refresh from IDLE has happened");
            _this.modal.modalIsVisible = false;
        });
        // we will show the modal form here telling the user that the session 
        // is about to finish. We will wait for response for period set in the 
        // setTimeout property and if we did not get any response the onTimeout
        // will take over and logout the user and kill the session
        this.idle.onTimeoutWarning.subscribe(function (countdown) {
            _this.modal.showModalDialog("You session is about to expire in: " + countdown + " seconds. Are you still there?");
        });
        // when the timeout has been kill the modal and kill the session
        this.idle.onTimeout.subscribe(function () {
            _this.modal.closeSession();
        });
        // start watching for idleness right away.
        this.idle.watch();
    };
    AppComponent.prototype.IsAllowed = function () {
        if (this._isUserAuthenticated && this._userSession.userIdentity.isInRole("Admin")) {
            this._isUserAllowed = true;
        }
    };
    AppComponent.prototype.logOut = function () {
        this._authenticationService.logOut();
        var route = ['Dashboard'];
        this._router.navigate(route);
    };
    AppComponent.getParameterByName = function (name, url) {
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)", "i"), results = regex.exec(url);
        if (!results)
            return null;
        if (!results[2])
            return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    };
    __decorate([
        core_1.ViewChild(modaldialog_component_1.ModalDialog), 
        __metadata('design:type', modaldialog_component_1.ModalDialog)
    ], AppComponent.prototype, "modal", void 0);
    __decorate([
        core_1.ViewChild(process_messages_component_1.ProcessMessagesComponent), 
        __metadata('design:type', process_messages_component_1.ProcessMessagesComponent)
    ], AppComponent.prototype, "messagesComponent", void 0);
    __decorate([
        core_1.ViewChild(pagetitle_component_1.PageTitleComponent), 
        __metadata('design:type', pagetitle_component_1.PageTitleComponent)
    ], AppComponent.prototype, "pageTitleComponent", void 0);
    AppComponent = __decorate([
        core_1.Component({
            selector: 'my-app',
            templateUrl: './app/app.component.html',
            //directives: [ROUTER_DIRECTIVES], // moved to main
            encapsulation: core_1.ViewEncapsulation.None,
            directives: [authcheck_1.AuthCheck, router_deprecated_1.RouterLink, modaldialog_component_1.ModalDialog,
                process_messages_component_1.ProcessMessagesComponent, pagetitle_component_1.PageTitleComponent]
        }),
        router_deprecated_1.RouteConfig([
            { path: '/views/dashbord', name: 'Dashboard', component: dashboard_component_1.DashboardComponent, useAsDefault: true },
            { path: '/views/articles', name: 'Articles', component: article_list_component_1.ArticleListComponent },
            { path: '/views/article/:id', name: 'Article', component: article_component_1.ArticleComponent },
            { path: '/views/addarticle', name: 'AddArticle', component: add_article_component_1.AddArticleComponent },
            { path: '/views/authors', name: 'Authors', component: author_list_component_1.AuthorListComponent },
            { path: '/views/author/:id', name: 'Author', component: author_component_1.AuthorComponent },
            { path: '/view/addauthor', name: 'AddAuthor', component: add_author_component_1.AddAuthorComponent },
            { path: '/views/teams', name: 'Teams', component: team_list_component_1.TeamListComponent },
            { path: '/views/team/:id', name: 'Team', component: team_component_1.TeamComponent },
            { path: '/views/addteam', name: 'AddTeam', component: add_team_component_1.AddTeamComponent },
            { path: '/views/members', name: 'Members', component: member_list_component_1.MemberListComponent },
            { path: '/views/members/:id', name: 'TeamMembers', component: member_list_component_1.MemberListComponent },
            { path: '/views/member/:id', name: 'Member', component: member_component_1.MemberComponent },
            { path: '/views/addmember', name: 'AddMember', component: add_member_component_1.AddMemberComponent },
            { path: '/views/info/about', name: 'About', component: about_component_1.AboutComponent },
            { path: '/views/info/contact', name: 'Contact', component: contact_component_1.ContactComponent },
            { path: '/views/authentication/login', name: 'Login', component: login_component_1.LoginComponent },
            { path: '/views/authentication/register', name: 'Register', component: register_component_1.RegisterComponent },
            { path: '/views/authentication/home', name: 'Home', component: home_component_1.HomeComponent },
            //{ path: '/views/file-upload/ng2-file-upload', name: 'Upload', component: NG2FileUploadComponent }
            { path: '/**', redirectTo: ['Dashboard'] },
        ]), 
        __metadata('design:paramtypes', [authentication_service_1.AuthenticationService, processmessage_service_1.ProcessMessageService, pagetitle_service_1.PageTitleService, router_deprecated_1.Router, core_2.Idle])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map