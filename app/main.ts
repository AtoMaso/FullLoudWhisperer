import { bootstrap }    from '@angular/platform-browser-dynamic';
import { AppComponent } from './app.component';

import { ROUTER_PROVIDERS } from '@angular/router-deprecated';
import { FORM_PROVIDERS } from '@angular/common';
import { HTTP_PROVIDERS } from '@angular/http';
import { IDLE_PROVIDERS } from 'ng2-idle/core'; 

import { AuthenticationService } from './services/authentication.service';
import { ProcessMessageService } from './services/processmessage.service';
import { PageTitleService } from './services/pagetitle.service';
import { LoggerService } from './services/logger.service';


bootstrap(AppComponent, [HTTP_PROVIDERS, FORM_PROVIDERS, 
                                       ROUTER_PROVIDERS, IDLE_PROVIDERS,
                                       AuthenticationService, ProcessMessageService,
                                       PageTitleService ,LoggerService]);