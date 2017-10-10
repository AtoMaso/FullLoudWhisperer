import { Inject, Injectable, EventEmitter } from '@angular/core';
import { Http, Response } from '@angular/http';
import { CONFIG } from '../config';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { LoggerService } from './logger.service';

import { Level } from '../helpers/classes';

let levelsUrl = CONFIG.baseUrls.levels;


@Injectable()
export class LevelService {

   private localUrl: string;

    constructor(private _http: Http, private _loggerService: LoggerService) {   };


    //******************************************************
    // GET LEVELS
    //******************************************************
    public getLevels(id?: number):Observable<Level[]> {
        return this._http.get(levelsUrl)
            .map((res: Response) => res.json())
            .catch((error:Response) => this.onError(error, "GetLevels"));
    }


    //******************************************************
    // GET LEVEL
    //******************************************************
    public getLevel(id:number):Observable<Level> {
        return this._http.get(`${levelsUrl}/${id}`)
            .map((res: Response) => res.json()) 
            .catch((error: Response) => this.onError(error, "GetLevel"));
    }


    //******************************************************
    // ADD LEVEL
    //******************************************************


    //******************************************************
    // DELETE LEVEL
    //******************************************************


    //******************************************************
    // UPDATE LEVEL
    //******************************************************


    //******************************************************
    // PRIVATE METHODS
    //******************************************************  
    private onError(err: any, method: string) {
          this._loggerService.logErrors(err, "level.service had error in the method " + method);
          return Observable.throw(err);
    }
}
