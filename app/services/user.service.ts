import { Inject, Injectable, EventEmitter } from '@angular/core';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
import { CONFIG } from '../config';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { LoggerService } from './logger.service';
import { AuthenticationService } from './authentication.service';
import { ApplicationUser, UserSession} from '../helpers/classes';

let usersUrl = CONFIG.baseUrls.users;
let userUrl = CONFIG.baseUrls.user;
let updateUserUrl = CONFIG.baseUrls.updateuser;
let addUserUrl = CONFIG.baseUrls.adduser;
let removeUserUrl = CONFIG.baseUrls.removeuser;

@Injectable()
export class UserService {
    private localUrl: string;
    private session: UserSession;

    constructor(private _http: Http, private _loggerService: LoggerService, private _authenticationService:AuthenticationService) {

        if (sessionStorage["UserSession"] != "null") {
            this.session = JSON.parse(sessionStorage["UserSession"]);
        }  
    };

    //******************************************************
    // GET USERS
    //******************************************************
    public getUsers(id?: number): any {
        let localUrl: string;
        if (id != undefined) { localUrl = `${usersUrl}?teamid=${id}`}
        else { localUrl = usersUrl; }

        let headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');      
        headers.append('Authorization', `Bearer ${this.session.userIdentity.accessToken}`);

        return this._http.get(localUrl, { headers: headers })           
            .map((res: Response) => res.json())  
            .catch((err: Response) => this.logError(err, "GetUsers"));
    }

    // page of members
    public getPageOfUsers(page: number, perpage: number) {

        let localUrl = usersUrl + "?page=" + page + "&perpage=" + perpage;
        let headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');   
        headers.append('Authorization', `Bearer ${this.session.userIdentity.accessToken}`);

        return this._http.get(localUrl, {headers: headers})          
            .map((res: Response) => res.json())   
            .catch((err: Response) => this.logError(err, "GetUsers"));
    }


    //******************************************************
    // GET USER
    //******************************************************
    public getUser(id: string): any {
        let headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `Bearer ${this.session.userIdentity.accessToken}`);

        return this._http.get(`${userUrl}?id=${id}`, { headers: headers })            
            .map((res: Response) => res.json())  
            .catch((err: Response) => this.logError(err, "GetUser"));
    }


    //******************************************************
    // UPDATE USER
    //******************************************************
    // this will be on the members details page whcih will be the view
    // and update view with two way databinding


    //******************************************************
    // ADD USER
    //******************************************************
    public addUser(user: ApplicationUser): any {

        let body = JSON.stringify(user);
        let headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `Bearer ${this.session.userIdentity.accessToken}`);

        return this._http.post(addUserUrl, body, { headers: headers })                  
                  .map((res: Response) => res.json())
                  .catch((err: Response) => this.logError(err, "AddUser"));
    }


    //******************************************************
    // REMOVE USER
    //******************************************************
    public removeUser(userId: string) {
      let localUrl = removeUserUrl + "?id=" + userId;
      let headers = new Headers();
      headers.append('Accept', 'application/json');
      headers.append('Content-Type', 'application/json');
      headers.append('Authorization', `Bearer ${this.session.userIdentity.accessToken}`);

      return this._http.delete(localUrl, { headers: headers })         
              .map((res: Response) => res.json())
              .catch(( error:Response) => this.logError(error, "RemoveUser"));
    }


    //******************************************************
    // PRIVATE METHODS
    //******************************************************
    private logError(err: any, method:string) {
      this._loggerService.logErrors(err, "user.service had an error in the method " + method);   
      return Observable.throw(err);
    }

}
