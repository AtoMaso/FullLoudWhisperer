import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RouteParams, Router, ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import { Http, Response, HTTP_PROVIDERS } from '@angular/http';

import { MemberService } from '../../services/member.service';
import { LoggerService } from '../../services/logger.service';
import { ProcessMessageService } from '../../services/processmessage.service';
import { PageTitleService } from '../../services/pagetitle.service';

import { ApplicationUser, PageTitle } from '../../helpers/classes';

@Component({
    selector: 'my-Member',
    templateUrl: './app/views/members/member.component.html',
    directives: [ROUTER_DIRECTIVES],
    providers: [MemberService]
})

export class MemberComponent {
    private componentMember: ApplicationUser;
    private memberid: string = null;
    private teamid: number = 0;
    public isRequesting: boolean;

    //*****************************************************
    // CONSTRUCTOR IMPLEMENTAION
    //*****************************************************
    constructor(private _routeParams: RouteParams,
                    private _router: Router,
                    private _memberService: MemberService,
                    private _pmService: ProcessMessageService,
                    private _pageTitleService: PageTitleService,
                    private _loggerService: LoggerService) { }


    private ngOnInit() {      
          this._pmService.emitRoute("nill");
          
          this.isRequesting = true;
          this.memberid = this._routeParams.get('id');
          this.teamid = +this._routeParams.get('idteam');
          this.getMember(this.memberid, this.teamid);
    }

    //****************************************************
    // GET MEMBER
    //****************************************************
    private getMember(id: string, teamid:number) {
      this._memberService.getMember(id, teamid)
                  .subscribe((returnedMember: ApplicationUser) => {
                  this.onSuccessGetMember(returnedMember)
                  this.isRequesting = false
            }, (err: Response) => this.onError(err, "GetMember"));
    }

    //****************************************************
    // UPDATE MEMBER - TODO
    //****************************************************
    private updateMember(id: string) {}


    //****************************************************
    // PRIVATE METHODS
    //****************************************************
    // determine the member object or go back
    private onSuccessGetMember(passedMember: ApplicationUser) {
        if (passedMember) {
            this.componentMember = passedMember;
            this._pageTitleService.emitPageTitle(new PageTitle("Team Member", this.componentMember.Name ));
        }
      else { this._gotoMembers(); }
    }

    // to navigate back if the member is nothing
    private _gotoMembers() {
      let route = ['Members', { id: this.componentMember ? this.componentMember.Id : null }]
      this._router.navigate(route);
    }


    // an error has occured
    private onError(err: any, type: string) {
      let message: string = "";
      // stop the spinner
      this.isRequesting = false;

      // we will log the error in the server side by calling the logger, or that is already 
      // done on the server side if the error has been caught
      this._loggerService.logErrors(err, "team member page");

      // we will display a fiendly process message using the process message service   
      if (err.status !== 200 || err.status !== 300) {
        let data = err.json();

        if (data.ModelState) {
          for (var key in data.ModelState) {
            for (var i = 0; i < data.ModelState[key].length; i++) {
              //errors.push(data.modelState[key][i]);
              if (message == null) { message = data.ModelState[key][i]; }
              else { message = message + data.ModelState[key][i]; } // end if else
            }// end for
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

    }
  
}
