import { Component } from '@angular/core';

import { ProcessMessageService } from '../../services/processmessage.service';
import { PageTitleService } from '../../services/pagetitle.service';

import { PageTitle } from '../../helpers/classes';

@Component({
    selector: 'userhome-app',
    templateUrl: './app/views/authentication/home.component.html',
})


export class HomeComponent {

      constructor(private _pmService: ProcessMessageService,
                       private _pageTitleService: PageTitleService) {
      
                      _pageTitleService.emitPageTitle(new PageTitle("Members Home"));
                      _pmService.emitRoute("nill");
      }
}

