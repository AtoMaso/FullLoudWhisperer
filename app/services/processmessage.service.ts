import { Inject, Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { LoggerService } from './logger.service';
import {ProcessMessage } from '../helpers/classes';


@Injectable()
export class ProcessMessageService {

    public allProcessMessages: ProcessMessage[] = [];
    public _behaviorProcessMessageStore: BehaviorSubject<ProcessMessage> = new BehaviorSubject(null);
    public _behaviorMessageObserver$: Observable<ProcessMessage> = this._behaviorProcessMessageStore.asObservable(); 

    public _behaviorRouteStore: BehaviorSubject<string> = new BehaviorSubject(null);
    public _behaviorRouteObserver$: Observable<string> = this._behaviorRouteStore.asObservable(); 

    constructor(private _http: Http, private _loggerService: LoggerService) {
              this.getProcessMessage();
    };


    //******************************************************
    // GET PROCESS MESSAGE
    //******************************************************
    // method called in the contructor to initialis all process messages
    public getProcessMessage() {
      this.getProcessMessagesFromRepository()
            .subscribe(
                        (messages: ProcessMessage[]) => this.onSuccess(messages)
                        , (error: Response) => this.onError(error, "GetProcessMessage"));     
    }

    // get the process messages from the json repository
    public getProcessMessagesFromRepository() {

      return this._http.get("app/api/processmessages.json")
        .map((response: Response) => <ProcessMessage[]>response.json().data)
        .catch((error:Response) => this.onError(error, "GetProcessmessageFromRepository"));
    }

   // get process message based on the message id
    public getProcessMessageById(id: string):ProcessMessage {
          return this.allProcessMessages.find(pm => pm.id === id);   
    }


    // raises the event which the app component is subcribed to
    // and the messageis passed to the child control on the app component
    public emitProcessMessage(id: string, message?: string) {
      let pm: ProcessMessage = this.getProcessMessageById(id);
      if (id == "PME") {
        pm.text = message;
      }
      this._behaviorProcessMessageStore.next(pm);
    }

    // raises the event which the app component is subcribed to
    // and the messageis passed to the child control on the app component
    public emitRoute(id: string) {     
      this._behaviorRouteStore.next(id);
    }

    //******************************************************
    // PRIVATE METHODS
    //******************************************************
    // on success of the http call
    private onSuccess(passedMessages: ProcessMessage[]) {
      this.allProcessMessages = passedMessages;
      // plus other stuff here
    }

    // logs errors to the web api side
    private onError(err: any, method:string) {      
      this._loggerService.logErrors(err, "processmessage.service had an error in the method " + method);
      return Observable.throw(err);
      //this._loggerService.logErrors(error, "processmessage.service");            
      //return Observable.throw(error.json().error || 'Server error');
    }

}
