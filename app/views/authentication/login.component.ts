import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RouteParams, Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { Http, Response, HTTP_PROVIDERS } from '@angular/http';
import { FormBuilder, Validators } from '@angular/common';

import { AuthenticationService } from '../../services/authentication.service';
import { ValidationService } from '../../services/validation.service';
import { LoggerService } from '../../services/logger.service';
import { ProcessMessageService } from '../../services/processmessage.service';
import { PageTitleService } from '../../services/pagetitle.service';

import { ApplicationUser, Authentication, UserSession, UserIdentity, Role, PageTitle } from '../../helpers/classes';
import { ControlMessages } from '../controls/control-messages.component';

@Component({
    selector: 'login-view',
    templateUrl: 'app/views/authentication/login.component.html',
    directives: [ControlMessages, ROUTER_DIRECTIVES]
})


export class LoginComponent {
  private _account: ApplicationUser = new ApplicationUser();
  private loginForm: any;
  private isRequesting: boolean;

  //*****************************************************
  // CONSTRUCTOR IMPLEMENTAION
  //*****************************************************
  constructor(private _routeParams: RouteParams, private _router: Router,
                    private _formBuilder: FormBuilder,
                    private _authenticationService: AuthenticationService,
                    private _pmService: ProcessMessageService,
                    private _pageTitleService: PageTitleService,
                    private _loggerService: LoggerService) {

        this.loginForm = this._formBuilder.group({
          //'UserName': ['', Validators.compose([Validators.required, ValidationService.usernameValidator])],
          'Email': ['', Validators.compose([Validators.required, ValidationService.emailValidator, ValidationService.emailDomainValidator])],
          'Password': ['', Validators.compose([Validators.required, ValidationService.passwordValidator])],
        });

        _pageTitleService.emitPageTitle(new PageTitle("Login"));
        _pmService.emitRoute("nill");
  }

  //****************************************************
  // GET ACCOUNT
  //****************************************************
  private login() {
      this._authenticationService.login(this._account.Email, this._account.Password)
          .subscribe(res => this.onLoginSuccess(res)
          , error =>  this.onError(error));
  }

  //****************************************************
  // PRIVATE METHODS
  //****************************************************
  private onLoginSuccess(res:any) {    
      if (sessionStorage["UserSession"] != "null") {               
          this._router.navigate(['Home']);
          this.emitUserSession(res);
      }    
  }

  // get the next session from the session observable
  private emitUserSession(res:any) {
        this._authenticationService.emitUserSession(this._authenticationService.getUserSession());
  }


  //****************************************************
  // LOGGING METHODS
  //****************************************************
  // an error has occured
  private onError(err: any) {    

      let message: string;
      // stop the spinner
      this.isRequesting = false;
      // we will log the error in the server side by calling the logger, or that is already 
      // done on the server side if the error has been caught
      this._loggerService.logErrors(err, "login");

      // we will display a fiendly process message using the process message service        
      if (err.status !== 200 || err.status !== 300) {
        let data = err.json();
        if (data.error) {
              // login user
              message = data.error;
              this._pmService.emitProcessMessage("PME", message);
        }
        else {
                this._pmService.emitProcessMessage("PMG");
        }
      }      
  }
}

