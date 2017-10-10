import { Component, ViewChild, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { RouteParams, Router, RouteConfig, RouterLink, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from '@angular/router-deprecated';
import { RouteSegment, OnActivate } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import './rxjs-operators';

import { AuthCheck } from './services/authcheck';
import {Idle, DEFAULT_INTERRUPTSOURCES} from 'ng2-idle/core';
import { AuthenticationService } from './services/authentication.service';
import { ProcessMessageService } from './services/processmessage.service';
import { PageTitleService } from './services/pagetitle.service';

import { DashboardComponent } from './views/dashboard/dashboard.component';
import { HomeComponent } from './views/authentication/home.component';
import { ArticleListComponent } from './views/articles/article-list.component';
import { ArticleComponent } from './views/articles/article.component';
import {AddArticleComponent} from './views/articles/add-article.component';
//import { NG2FileUploadComponent } from './views/file-upload/ng2-file-upload.component';

import { AuthorListComponent } from './views/authors/author-list.component';
import { AuthorComponent } from './views/authors/author.component';
import { AddAuthorComponent } from './views/authors/add-author.component';

import { TeamListComponent } from './views/teams/team-list.component';
import { TeamComponent } from './views/teams/team.component';
import { AddTeamComponent } from './views/teams/add.team.component';

import { MemberListComponent } from './views/members/member-list.component';
import { MemberComponent } from './views/members/member.component';
import { AddMemberComponent } from './views/members/add.member.component';

//import { UserListComponent } from './views/users/user-list.component';
//import { UserComponent } from './views/users/user.component';
//import { AddUserComponent } from './views/users/add.user.component';

import { AboutComponent } from './views/info/about.component';
import { ContactComponent } from './views/info/contact.component';
import { LoginComponent } from './views/authentication/login.component';
import { RegisterComponent } from './views/authentication/register.component';
import { ModalDialog } from './views/controls/modaldialog.component';
import { ProcessMessagesComponent } from './views/controls/process-messages.component';
import { PageTitleComponent } from './views/controls/pagetitle.component';

import { UserSession, UserIdentity, Authentication, ProcessMessage, PageTitle } from './helpers/classes';

@Component({
  selector: 'my-app',
  templateUrl: './app/app.component.html',
  //directives: [ROUTER_DIRECTIVES], // moved to main
  encapsulation: ViewEncapsulation.None,
  directives: [AuthCheck, RouterLink, ModalDialog,
                   ProcessMessagesComponent, PageTitleComponent]
  //providers: [ROUTER_PROVIDERS] // moved to main
})

@RouteConfig([

  { path: '/views/dashbord', name: 'Dashboard', component: DashboardComponent, useAsDefault: true },

  { path: '/views/articles', name: 'Articles', component: ArticleListComponent },
  { path: '/views/article/:id', name: 'Article', component: ArticleComponent },
  { path: '/views/addarticle', name: 'AddArticle', component: AddArticleComponent },

  { path: '/views/authors', name: 'Authors', component: AuthorListComponent },
  { path: '/views/author/:id', name: 'Author', component: AuthorComponent },
  { path: '/view/addauthor', name: 'AddAuthor', component: AddAuthorComponent },

  { path: '/views/teams', name: 'Teams', component: TeamListComponent },
  { path: '/views/team/:id', name: 'Team', component: TeamComponent },
  { path: '/views/addteam', name: 'AddTeam', component: AddTeamComponent },

  { path: '/views/members', name: 'Members', component: MemberListComponent },
  { path: '/views/members/:id', name: 'TeamMembers', component: MemberListComponent },
  { path: '/views/member/:id', name: 'Member', component: MemberComponent },
  { path: '/views/addmember', name: 'AddMember', component: AddMemberComponent },

  { path: '/views/info/about', name: 'About', component: AboutComponent },
  { path: '/views/info/contact', name: 'Contact', component: ContactComponent },

  { path: '/views/authentication/login', name: 'Login', component: LoginComponent },
  { path: '/views/authentication/register', name: 'Register', component: RegisterComponent },
  { path: '/views/authentication/home', name: 'Home', component: HomeComponent },

  //{ path: '/views/file-upload/ng2-file-upload', name: 'Upload', component: NG2FileUploadComponent }

  { path: '/**', redirectTo: ['Dashboard'] },
])

  
export class AppComponent implements OnDestroy, OnInit {

  //******************************************************
  // PROPERTIES
  //******************************************************
  // set child components handles
  @ViewChild(ModalDialog) modal: ModalDialog;  
  @ViewChild(ProcessMessagesComponent) messagesComponent: ProcessMessagesComponent;
  @ViewChild(PageTitleComponent) pageTitleComponent: PageTitleComponent;

  // this is a reference to itself passed to the child ModalDialog
  private itself: AppComponent = this;
  private _subscriptionSession: Subscription;
  private _subscriptionMessages: Subscription;
  private _subscriptionTitle: Subscription;
  private _subscriptionRouter: Subscription;
  
  private _authentication: Authentication = new Authentication();
  private _userSession: UserSession = new UserSession();
  private _userIdentity: UserIdentity = new UserIdentity();
  private _isUserAuthenticated: boolean = false;
  private _isUserAllowed: boolean = false;


  //******************************************************
  //CONSTRUCTOR AND CICLE METHODS
  //******************************************************
  constructor(private _authenticationService: AuthenticationService,
                   private _pmService: ProcessMessageService,
                   private _titleService: PageTitleService,
                   private _router: Router, private idle: Idle) {   

    sessionStorage['UserSession'] = "null";   
  }



  public ngOnInit() {

            this._subscriptionSession = 
              this._authenticationService._behaviorSessionStore
                .subscribe((session: UserSession) => {
                              // this needs to be check otherwise the app component fails on session not created yet
                              if (session !== null) {
                                  this._userSession = session,
                                  this._isUserAuthenticated = session.authentication.isAuthenticated;
                                  this.IsAllowed();
                                  this.IdleSetup(session.userIdentity.accessTokenExpiresIn);
                              }
               });

              this._subscriptionMessages = 
              this._pmService._behaviorProcessMessageStore
                .subscribe((message: ProcessMessage) => {  
                              // this needs to be check otherwise the app component fails on pmComponent not created yet
                              if (message) {
                                this.messagesComponent.displayProcessMessage(message)
                              }
                });

              this._subscriptionTitle =
                this._titleService._behaviorTitleStore
                  .subscribe((page: PageTitle) => {
                            // this needs to be check otherwise the app component fails on pmComponent not created yet
                            if (page) {
                              this.pageTitleComponent.displayPageTitle(page)
                    }
                  });

              this._subscriptionRouter = 
                this._pmService._behaviorRouteStore
                 .subscribe(() => {
                            if ( this.messagesComponent ) {
                                    this.messagesComponent.displayProcessMessage(null);
                            }
              });            

  }

  public ngOnDestroy() {
    this._subscriptionSession.unsubscribe();
    this._subscriptionMessages.unsubscribe();
    this._subscriptionTitle.unsubscribe();
    this._subscriptionRouter.unsubscribe();
  }


  //*******************************************************
  // PUBLIC METHODS
  //*******************************************************
  // called from the session modal dialog when session needs to be closed
  public onCloseSession() {
    this.logOut();
    this._isUserAuthenticated = false;
    this._isUserAllowed = false;   
  }


  //*******************************************************
  // PRIVATE METHODS
  //*******************************************************
  private IdleSetup(sessiontimeout: number) {

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
        this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

        // the client has decided to continue, so refresh the token
        this.idle.onIdleEnd.subscribe(() => {  
          // call the referesh token method to get the refresh token from the webapi        
          this._authenticationService.refreshToken();        
          //console.log("refresh from IDLE has happened");
          this.modal.modalIsVisible = false;        
        });

        // we will show the modal form here telling the user that the session 
        // is about to finish. We will wait for response for period set in the 
        // setTimeout property and if we did not get any response the onTimeout
        // will take over and logout the user and kill the session
      this.idle.onTimeoutWarning.subscribe((countdown:number) => {                              
          this.modal.showModalDialog("You session is about to expire in: " + countdown +" seconds. Are you still there?");     
      });

      // when the timeout has been kill the modal and kill the session
      this.idle.onTimeout.subscribe(() => {        
        this.modal.closeSession();      
      });
    
      // start watching for idleness right away.
      this.idle.watch();
  }

  private IsAllowed() {
    if (this._isUserAuthenticated && this._userSession.userIdentity.isInRole("Admin")) {
      this._isUserAllowed = true;
    }
  }

  private logOut() {       
      this._authenticationService.logOut();
      let route = ['Dashboard']
      this._router.navigate(route);
  }

  static getParameterByName(name: string, url: string) {
      name = name.replace(/[\[\]]/g, "\\$&");
      var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)", "i"),
          results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, " "));
  }
}


