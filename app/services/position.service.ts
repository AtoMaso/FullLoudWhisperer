import { Inject, Injectable, EventEmitter } from '@angular/core';
import { Http, Response } from '@angular/http';
import { CONFIG } from '../config';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { LoggerService } from './logger.service';

import { Position } from '../helpers/classes';

let positionsUrl = CONFIG.baseUrls.positions;


@Injectable()
export class PositionService {   
    private localUrl: string;

    constructor(private _http: Http, private _loggerService: LoggerService) { };   

    //******************************************************
    // GET POSITIONS
    //******************************************************  
    public getPositions(id?: number):Observable<Position[]> {                                              
        return this._http.get(positionsUrl)
            .map((res: Response) => <Position[]>res.json())
            .catch((error:Response) => this.onError(error, "GetPositions"));                                    
    }


    //******************************************************
    // GET POSITION
    //****************************************************** 
    public getPosition(id:number):Observable<Position> {                
        return this._http.get(`${positionsUrl}/${id}`)
            .map((res: Response) => <Position>res.json()) 
            .catch((error:Response) => this.onError(error, "GetPoistion"));          
    }


    //******************************************************
    // ADD POSITION
    //******************************************************
   

    //******************************************************
    // DELETE POSITION
    //******************************************************
  

    //******************************************************
    // UPDATE POSITION
    //******************************************************
 
   
    //******************************************************
    // PRIVATE METHODS
    //******************************************************  
    private onError(err: any, method:string) {    
      this._loggerService.logErrors(err, "position.service had an error in the method " + method);
      return Observable.throw(err);
    }
}