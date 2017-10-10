import { Inject, Injectable, EventEmitter } from '@angular/core';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
import { CONFIG } from '../config';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { LoggerService } from './logger.service';
import { ApplicationUser, UserSession} from '../helpers/classes';

let teammembersUrl = CONFIG.baseUrls.teammembers;
let updateTeamMemberUrl = CONFIG.baseUrls.addteammember;
let addTeamMemberUrl = CONFIG.baseUrls.addteammember;
let removeteamMemberUrl = CONFIG.baseUrls.removeteammember;



@Injectable()
export class TeamMemberService {
    private localUrl: string;
    private session: UserSession;

    constructor(private _http: Http,
                     private _loggerService: LoggerService) {

        if (sessionStorage["UserSession"] !== undefined) {
            this.session = JSON.parse(sessionStorage["UserSession"]);
        }
    };

    //******************************************************
    // GET TEAMEMBERS
    //******************************************************
    public getTeamMembers(): any {
    
        return this._http.get(teammembersUrl)                  
            .map((res: Response) => res.json()) 
            .catch((res:Response) => this.logError(res, "GetTeamMembers"));
    }


    //******************************************************
    // UPDATE TEAMMEMBER
    //******************************************************
    // this will be on the members details page whcih will be the view
    // and update view with two way databinding


    //******************************************************
    // ADD TEAMMEMBER
    //******************************************************
  

    //******************************************************
    // REMOVE TEAMMEMBER
    //******************************************************
 



    //******************************************************
    // PRIVATE METHODS
    //******************************************************
    private logError(err: any, method:string) { 
      this._loggerService.logErrors(err, "member.service had an error in the method " + method);   
      //return Promise.reject(err);
      return Observable.throw(err);
    }

}
