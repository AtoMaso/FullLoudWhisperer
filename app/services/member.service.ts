import { Inject, Injectable, EventEmitter } from '@angular/core';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
import { CONFIG } from '../config';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { LoggerService } from './logger.service';
import { ApplicationUser, UserSession} from '../helpers/classes';

let membersUrl = CONFIG.baseUrls.members;
let memberUrl = CONFIG.baseUrls.member;

let updateMemberUrl = CONFIG.baseUrls.addmember;
let addMemberUrl = CONFIG.baseUrls.addmember;
let removeMemberUrl = CONFIG.baseUrls.removemember;



@Injectable()
export class MemberService {
    private localUrl: string;
    private session: UserSession;

    constructor(private _http: Http,
                     private _loggerService: LoggerService) {

        if (sessionStorage["UserSession"] !== undefined) {
            this.session = JSON.parse(sessionStorage["UserSession"]);
        }
    };

    //******************************************************
    // GET members
    //******************************************************
    public getMembers(id?: number): any {
        let localUrl: string;
        if (id != undefined) { localUrl = `${membersUrl}?teamid=${id}`}
        else { localUrl = membersUrl; }

        return this._http.get(localUrl)                  
            .map((res: Response) => res.json()) 
            .catch((res:Response) => this.logError(res, "GetMembers"));

    }


    // page of members
    public getPageOfMembers(page: number, perpage: number) {
        let localUrl = membersUrl + "?page=" + page + "&perpage=" + perpage;
        return this._http.get(localUrl) 
          .map((res: Response) => res.json())  
          .catch((res: Response) => this.logError(res ,"GetMembers"));
    }


    //******************************************************
    // GET MEMBER
    //******************************************************
    public getMember(id:string, teamid:number):any {
        return this._http.get(`${memberUrl}?id=${id}&teamid=${teamid}`)        
            .map((res: Response) => res.json()) 
            .catch((res:Response) => this.logError(res, "GetMember"));
    }


    //******************************************************
    // UPDATE MEMBER
    //******************************************************
    // this will be on the members details page whcih will be the view
    // and update view with two way databinding


    //******************************************************
    // ADD MEMBER
    //******************************************************
    public addMember(member: ApplicationUser): any {
        let body = JSON.stringify(member);
        let headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `Bearer ${this.session.userIdentity.accessToken}`);

        return this._http.post(addMemberUrl , body, { headers: headers })              
                .map((res: Response) => res.json())  
                .catch((res: Response) => this.logError(res, "AddMember"));
          }


    //******************************************************
    // REMOVE MEMBER
    //******************************************************
    public removeMember(memberId: string, teamid:number) {
      let localUrl = removeMemberUrl + "?id=" + memberId + "&teamid=" + teamid;
      let headers = new Headers();
      headers.append('Accept', 'application/json');
      headers.append('Content-Type', 'application/json');
      headers.append('Authorization', `Bearer ${this.session.userIdentity.accessToken}`);

      return this._http.delete(localUrl, { headers: headers })       
             .map((res: Response) => res.json()) 
             .catch((res: Response) => this.logError(res, "RemoveMember"));
    }



    //******************************************************
    // PRIVATE METHODS
    //******************************************************
    private logError(err: any, method:string) { 
      this._loggerService.logErrors(err, "member.service had an error in the method " + method);   
      //return Promise.reject(err);
      return Observable.throw(err);
    }

}
