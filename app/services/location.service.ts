import { Inject, Injectable, EventEmitter } from '@angular/core';
import { Http, Response } from '@angular/http';
import { CONFIG } from '../config';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { LoggerService } from './logger.service';

import { Locality } from '../helpers/classes';

let localitiesUrl = CONFIG.baseUrls.localities;


@Injectable()export class LocationService {

    private localUrl: string;

    constructor(private _http: Http, private _loggerService:LoggerService) { };


    //******************************************************
    // GET LOCATION
    //******************************************************
    public getLocalities(id?: number):Observable<Locality[]> {
        return this._http.get(localitiesUrl)
            .map((res: Response) => res.json())
            .catch((error:Response) => this.onError(error, "GetLocalities"));
    }


    //******************************************************
    // GET LOCALITY
    //******************************************************
    public getLocality(id:number):Observable<Locality> {
        return this._http.get(`${localitiesUrl}/${id}`)
            .map((res: Response) => <Locality>res.json()) 
            .catch((error:Response) => this.onError(error, "GetLocality"));
    }


    //******************************************************
    // ADD LOCATION
    //******************************************************


    //******************************************************
    // DELETE LOCATION
    //******************************************************


    //******************************************************
    // UPDATE LOCATION
    //******************************************************


    //******************************************************
    // PRIVATE METHODS
    //******************************************************  
    private onError(err: any, method: string) {
      this._loggerService.logErrors(err, "location.service had an error in the method " + method);
      return Observable.throw(err);   
    }
}
