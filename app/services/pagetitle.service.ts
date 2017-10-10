import { Inject, Injectable} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { PageTitle } from '../helpers/classes';

@Injectable()
export class PageTitleService {

    public _behaviorTitleStore: BehaviorSubject<PageTitle> = new BehaviorSubject(null);
    public _behaviorTitleObserver$: Observable<PageTitle> = this._behaviorTitleStore.asObservable(); 

    constructor() {};


    //******************************************************
    // GET PROCESS MESSAGE
    //*****************************************************
    // raises the event which the app component is subcribed to
    public emitPageTitle(page: PageTitle) {  
            this._behaviorTitleStore.next(page);
    }
}
