import { Inject, Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { CONFIG } from '../config';

import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { LoggerService } from './logger.service';
import { Article, ApplicationUser, UserSession } from '../helpers/classes';

let authorsUrl = CONFIG.baseUrls.authors;
let authorUrl = CONFIG.baseUrls.author;
let addAuthorUrl = CONFIG.baseUrls.addauthor;
let removeAuthorUrl = CONFIG.baseUrls.removeauthor;

@Injectable()
export class AuthorService {
    private localUrl: string;
    private session: UserSession;

    constructor(private _http: Http, private _loggerService: LoggerService) {

          if (sessionStorage["UserSession"] != "null") {
            this.session = JSON.parse(sessionStorage["UserSession"]);
          }
    }

    //******************************************************
    // GET AUTHORS
    //******************************************************
    public getAuthors(): Observable<ApplicationUser[]> {

        return this._http.get(authorsUrl)
            .map((res: Response) => res.json())                                       // Author.fromJSONArrayToAuthors(res.json()))
            .catch((error:Response) => this.logError(error, "GetAuthors"));
    }

    //******************************************************
    // GET AUTHOR
    //******************************************************
    public getAuthor(id: string): Observable<ApplicationUser> {

        return this._http.get(`${authorUrl}?id=${id}`)
            .map((res: Response) => res.json())      
            .catch((error:Response) => this.logError(error, "GetAuthor"));
    }


    //******************************************************
    // ADD AUTHOR
    //******************************************************
    public addAuthor(author: ApplicationUser): any {
      let body = JSON.stringify(author);
      let headers = new Headers();
      headers.append('Accept', 'application/json');
      headers.append('Content-Type', 'application/json');
      headers.append('Authorization', `Bearer ${this.session.userIdentity.accessToken}`);

      return this._http.post(addAuthorUrl, body, { headers: headers })
        .map((res: Response) => res.json())
        .catch((res: Response) => this.logError(res, "AddAuthor"));
    }


    //******************************************************
    // REMOVE AUTHOR
    //******************************************************
    public removeAuthor(authorId: string) {
        let localUrl = removeAuthorUrl + "?id=" + authorId;
        let headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `Bearer ${this.session.userIdentity.accessToken}`);

        return this._http.delete(localUrl, { headers: headers }) 
          .map((res: Response) => res.json())
          .catch((error: Response) => this.logError(error, "RemoveAuthor"));            
      }

    //******************************************************
    // UPDATE AUTHOR
    //******************************************************


    //******************************************************
    // PRIVATE METHODS
    //******************************************************
    private logError(err: any, method:string) {
      this._loggerService.logErrors(err, "author.service had error in the method " + method);
      return Observable.throw(err);
    }

}
