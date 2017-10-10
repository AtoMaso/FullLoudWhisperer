import { Inject, Injectable, EventEmitter } from '@angular/core';
import { Http, Response, Headers, RequestOptions} from '@angular/http';

import { CONFIG } from '../config';

import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { LoggerService } from './logger.service';
import { Team, UserSession } from '../helpers/classes';

let teamsUrl = CONFIG.baseUrls.teams;
let addTeamUrl = CONFIG.baseUrls.addteam;
let removeTeamUrl = CONFIG.baseUrls.removeteam;

@Injectable()
export class TeamService {
    private session: UserSession;

    constructor(private _http: Http, private _loggerService: LoggerService) {

        if (sessionStorage["UserSession"] != "null" ) {
            this.session = JSON.parse(sessionStorage["UserSession"]);
        }
    };


    //******************************************************
    // GET Teams
    //******************************************************
    // gets all teams normal
    public getTeams() {
        return this._http.get(teamsUrl)            
            .map((res: Response) => res.json())
            .catch(( error:Response) => this.logError(error, "GetTeams"));
    }

    // gets all teams per set
    public getSetOfTeams(page: number, perpage: number) {
        let localUrl = teamsUrl + "?page=" + page + "&perpage=" + perpage;
        return this._http.get(localUrl)            
            .map((res: Response) => res.json())
            .catch((error:Response) => this.logError(error, "GetSetOfTeams"));
    }

    // get an team normal
    public getTeam(id: number) {
        return this._http.get(`${teamsUrl}/${id}`)            
            .map((res: Response) => res.json())
            .catch((error:Response) => this.logError(error, "GetTeam"));
    }


    //******************************************************
    // ADD TEAM
    //******************************************************
    public addTeam(team: Team) {
        let body = JSON.stringify(team);
        let headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');        
        headers.append('Authorization', `Bearer ${this.session.userIdentity.accessToken}` );

        return this._http.post(addTeamUrl, body, { headers: headers })
                .map((res: Response) => res.json())
                .catch((error: Response) => this.logError(error, "AddTeam"));
    }


    private onSuccessAddTeam(res: any) {
      if (res) { let str = res.json(); }
    }

    //******************************************************
    // REMOVE MEMBER
    //******************************************************
    public removeTeam(teamid: number) {
        let localUrl = removeTeamUrl + "?id=" + teamid;
        let headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `Bearer ${this.session.userIdentity.accessToken}`);

        return this._http.delete(localUrl, { headers: headers })         
            .map((res: Response) => res.json())
            .catch((error:Response) => this.logError(error, "RemoveTeam"));
    }


    //******************************************************
    // UPDATE TEAM
    //******************************************************


    //******************************************************
    // PRIVATE METHODS
    //******************************************************
    private logError(err: any, method:string) {      
      this._loggerService.logErrors(err, "team.service had an error in the method " + method);      
        return Observable.throw(err);
    }

}
