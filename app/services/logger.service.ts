import { Inject, Injectable, EventEmitter } from '@angular/core';
import { Http, Response } from '@angular/http';
import { CONFIG } from '../config';

import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

let debugOn = CONFIG.debugKeys.debugOn;


@Injectable()
export class LoggerService {
    private localUrl: string;

    constructor(private _http: Http) { };

    //TODO audit logging and usage logging to be performed here
    public logErrors(err: any, passedservicecomp: string) {
        // call web api to log the error on the server side
    }


}
