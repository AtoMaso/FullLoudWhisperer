import { Inject, Injectable, EventEmitter } from '@angular/core';
import { Http, Response } from '@angular/http';
import { CONFIG } from '../config';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { LoggerService } from './logger.service';
import { Category, UserSession} from '../helpers/classes';

let categoriesUrl = CONFIG.baseUrls.categories;


@Injectable()
export class CategoryService {   
    private localUrl: string;
    private session: UserSession;

    constructor(private _http: Http, private _loggerService: LoggerService) {

      if (sessionStorage["UserSession"] !== undefined) {
        this.session = JSON.parse(sessionStorage["UserSession"]);
      }
    };   

    //******************************************************
    // GET CATEGORIES
    //******************************************************  
    public getCategories():Observable<Category[]> {                                              
      return this._http.get(categoriesUrl)
            .map((res: Response) => res.json())
            .catch((error:Response) => this.onError(error, "GetCategories"));                                    
    }


    //******************************************************
    // GET CATEGORY
    //****************************************************** 
    public getCategory(id:number):Observable<Category> {                
      return this._http.get(`${categoriesUrl}/${id}`)
            .map((res: Response) => <Category>res.json()) 
            .catch((error:Response) => this.onError(error, "GetCategory"));          
    }


    //******************************************************
    // ADD CATEGORY
    //******************************************************
   

    //******************************************************
    // DELETE CATEGORY
    //******************************************************
  

    //******************************************************
    // UPDATE CATEGORY
    //******************************************************
 
   
    //******************************************************
    // PRIVATE METHODS
    //******************************************************  
    private onError(err: any, method:string) {    
      this._loggerService.logErrors(err, "category.service had an error in the method " + method);
      return Observable.throw(err);
    }
}