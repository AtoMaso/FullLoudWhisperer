import { Inject, Injectable, EventEmitter } from '@angular/core';
import { Http, Response } from '@angular/http';
import { CONFIG } from '../config';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { LoggerService } from './logger.service';
import { Image } from '../helpers/classes';

@Injectable()
export class ImageService {

    constructor(private _http: Http, private _loggerService: LoggerService) { };


    //******************************************************
    // GET IMAGES
    //******************************************************
    public getImages() {
       
        return this._http.get("app/api/images.json")
          .map((response: Response) => <Image[]>response.json().data)        
          .catch(error => this.onError(error, "GetImages"));
    }

    //******************************************************
    // PRIVATE METHODS
    //******************************************************
    private onError(error: any, method:string) {      
      this._loggerService.logErrors(error, "image.service " + " has happened in method " + method);    
      return Observable.throw(error);      
      //return Observable.throw(error.json().error || 'Server error');
    }

}
