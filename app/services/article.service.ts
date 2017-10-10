import { Inject, Injectable, EventEmitter } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { CONFIG } from '../config';

import { LoggerService } from './logger.service';
import { Article, Attachement, UserSession } from '../helpers/classes';

let articlesUrl = CONFIG.baseUrls.articles;
let addArticleUrl = CONFIG.baseUrls.adarticle;
let removeArticleUrl = CONFIG.baseUrls.removearticle;

@Injectable()
export class ArticleService {

    private localUrl: string;
    private session: UserSession;

    constructor(private _http: Http, private _loggerService: LoggerService) {

      if (sessionStorage["UserSession"] !== undefined) {
        this.session = JSON.parse(sessionStorage["UserSession"]);
      }

    };


    //******************************************************
    // GET ARTICLES
    //******************************************************
    public getArticles(id?: string):Observable<Article[]> {

        // get author's list of articles
        if (id != "" || id != undefined) { this.localUrl = `${articlesUrl}?AuthorId=${id}`; }
        // get all articles list
        if (id == "" || id == undefined) { this.localUrl = articlesUrl; }

        return this._http.get(this.localUrl)
            .map((res: Response) => res.json())    
            .catch((res:Response) => this.logError(res, "GetArticles"));
    }


    // gets set of articles
    public getPageOfArticles(id: number, page: number, perpage: number) {

        // get author's list of articles
        if (id != 0 || id != undefined) { this.localUrl = `${articlesUrl}?authorid=${id}&page=${page}&perpage=${perpage}`; }
        // get all articles list
        if (id == 0 || id == undefined) { this.localUrl = `${articlesUrl}?page=${page}&perpage=${perpage}`; }

        return this._http.get(this.localUrl)
            .map((res: Response) => res.json())     // Article.mapJSONArrayToArticles(res.json()))
            .catch((res:Response) => this.logError(res, "GetArticles"));
    }



    //******************************************************
    // GET ARTICLE
    //******************************************************
    public getArticle(id: string): Observable<Article> {

        return this._http.get(`${articlesUrl}/${id}`)
            .map((res: Response) => res.json())    // Article.mapJSONObjectToArticle(res.json()))
            .catch((res:Response) => this.logError(res, "GetArticle"));
    }


    //******************************************************
    // ADD ARTICLE
    //******************************************************
    public addArticle(passedArticle: Article) {     
          // add the date when article has been created 
          // and the logged on authopr or admin user
          passedArticle.DatePublished = moment().toDate();
          passedArticle.AuthorId = this.session.userIdentity.userId;
          // stringify the article
          let body = JSON.stringify(passedArticle);
          let headers = new Headers();
          headers.append('Accept', 'application/json');
          headers.append('Content-Type', 'application/json');
          headers.append('Authorization', `Bearer ${this.session.userIdentity.accessToken}`);
          // post the article
          return this._http.post(addArticleUrl, body, { headers: headers })
                        .map((res: Response) => res.json())
                        .catch((res: Response) => this.logError(res, "AddArticle"));      
    }

    public addAttachement(passedAthachement: Attachement) {
      return new Observable(() => { });
    }

    //******************************************************
    // DELETE ARTICLE
    //******************************************************
    public removeArticle(articleid: string) {
      let localUrl = removeArticleUrl + "?id=" + articleid;
      let headers = new Headers();
      headers.append('Accept', 'application/json');
      headers.append('Content-Type', 'application/json');
      headers.append('Authorization', `Bearer ${this.session.userIdentity.accessToken}`);

      return this._http.delete(localUrl, { headers: headers })
        .map((res: Response) => res.json())
        .catch((res: Response) => this.logError(res, "RemoveArticle"));
    }

    public removeAttachement(articleid: string) {
      let localUrl = removeArticleUrl + "?id=" + articleid;
      let headers = new Headers();
      headers.append('Accept', 'application/json');
      headers.append('Content-Type', 'application/json');
      headers.append('Authorization', `Bearer ${this.session.userIdentity.accessToken}`);

      return this._http.delete(localUrl, { headers: headers })
        .map((res: Response) => res.json())
        .catch((error: Response) => this.logError(error, "RemoveArticle"));
    }


    //******************************************************
    // UPDATE ARTICLE
    //******************************************************


    //******************************************************
    // PRIVATE METHODS
    //******************************************************
    private logError(err: any, method:string) {     
        this._loggerService.logErrors(err, "article.service had an error in method " + method );
        return Observable.throw(err);
    }

}
