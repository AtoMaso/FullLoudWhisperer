import { Inject, Injectable, EventEmitter } from '@angular/core';
import { Http, Response } from '@angular/http';
import { CONFIG } from '../config';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { LoggerService } from './logger.service';

import { BusinessLine } from '../helpers/classes';

let businesslinesUrl = CONFIG.baseUrls.businesslines;


@Injectable()
export class BusinessLineService {   
    private localUrl: string;

    constructor(private _http: Http, private _loggerService:LoggerService) { };   

    //******************************************************
    // GET BUSINESS LINE
    //******************************************************  
    public getBusinessLines(id?: number): Observable<BusinessLine[]> {                                              
        return this._http.get(businesslinesUrl)
            .map((res: Response) => <BusinessLine[]>res.json()) //BusinessLine.fromJSONArrayToPositions(res.json()))
            .catch((error:Response) => this.onError(error, "GetBusinessLines"));                                    
    }


    //******************************************************
    // GET BUSINESS LINE
    //****************************************************** 
    public getBusinessLine(id: number): Observable<BusinessLine> {                
        return this._http.get(`${businesslinesUrl}/${id}`)
            .map((res: Response) => <BusinessLine>res.json()) // BusinessLine.mapJSONObjectToPosition(res.json()))
            .catch((error:Response) => this.onError(error, "GetBusinessLine"));          
    }


    //******************************************************
    // ADD BUSINESS LINE
    //******************************************************
   

    //******************************************************
    // DELETE BUSINESS LINE
    //******************************************************
  

    //******************************************************
    // UPDATE BUSINESS LINE
    //******************************************************
 
  
    //******************************************************
    // PRIVATE METHODS
    //******************************************************  
    private onError(err: any, method: string) {
            this._loggerService.logErrors(err, "businessline.service had error in the method " + method);
            return Observable.throw(err);
    }  
}