import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RouteParams, Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { Http, Response, HTTP_PROVIDERS } from '@angular/http';
import { FormBuilder, Validators } from '@angular/common';

import { ApplicationUser, PageTitle } from '../../helpers/classes';

import { LoggerService } from '../../services/logger.service';
import { AuthenticationService } from '../../services/authentication.service';
import { ControlMessages } from '../controls/control-messages.component';
import { ValidationService } from '../../services/validation.service';
import { ProcessMessageService } from '../../services/processmessage.service';
import { PageTitleService } from '../../services/pagetitle.service';

@Component({
    selector: 'sign-in-view',
    templateUrl: 'app/views/authentication/register.component.html',
    directives: [ControlMessages, ROUTER_DIRECTIVES]
})

export class RegisterComponent {

    private _account: ApplicationUser = new ApplicationUser();    
    private submitted = false;
    private signInForm: any;

    //*****************************************************
    // CONSTRUCTOR IMPLEMENTAION
    //*****************************************************
    constructor(private _routeParams: RouteParams,
                    private _router: Router, private _formBuilder: FormBuilder,
                    private _authenticationService: AuthenticationService,
                    private _pmService: ProcessMessageService,
                    private _pageTitleService: PageTitleService,
                    private _loggerService: LoggerService) { 

      this.signInForm = this._formBuilder.group({
            'Name': ['', Validators.compose([Validators.required, ValidationService.nameValidator])],
            'AtoUsername': ['', Validators.compose([Validators.required, ValidationService.usernameValidator])],
            'Email': ['', Validators.compose([Validators.required, ValidationService.emailValidator, ValidationService.emailDomainValidator])],
            'Password': ['', Validators.compose([Validators.required, ValidationService.passwordValidator])],
            'ConfirmPassword': ['', Validators.compose([Validators.required, ValidationService.confirmPasswordValidator])],
      });

      _pageTitleService.emitPageTitle(new PageTitle("Register"));
      _pmService.emitRoute("nill");
      this._account.Role = this._routeParams.get('role');
    }


    //****************************************************
    // GET ACCOUNT
    //****************************************************
    private register() {        
        if (this.ComparePasswords()) {
            this._authenticationService.register(this._account)
                .subscribe(res => this.onSucessRegistering(res)
                , (err: Response) => this.onError(err));
        }
    }
  
    private ComparePasswords(): boolean {
        if (this._account.Password === this._account.ConfirmPassword) { return true; }
        else {
            this._pmService.emitProcessMessage("PMPNE");
            return false;
        }
    }

    private onSucessRegistering(res: any) {
        this.submitted = true;
        this._pmService.emitProcessMessage("PMRS");
    }

    // toggles the submitted flag which should disable the form and
    // show the succes small form
    private onSubmit() { this.submitted = true; }


    //****************************************************
    // PRIVATE METHODS
    //****************************************************
    private onError(err: Response) {       
          let message: string = null;     

          // we will log the error in the server side by calling the logger, or that is already 
          // done on the server side if the error has been caught
          this._loggerService.logErrors(err, "register");      

          // we will display a fiendly process message using the process message service   
          if (err.status !== 200 || err.status !== 300) {
                let data = err.json();

                if (data.ModelState) {
                      for (var key in data.ModelState) {
                            for (var i = 0; i < data.ModelState[key].length; i++) {                                
                                  if (message == null) { message = data.ModelState[key][i]; }
                                  else { message = message + data.ModelState[key][i]; } // end if else
                            }// end for
                      } // end for
                      this._pmService.emitProcessMessage("PME", message);
                } // end if
                else {
                    this._pmService.emitProcessMessage("PMG");
                }
          } //end if       
    }// end method
} // end class

