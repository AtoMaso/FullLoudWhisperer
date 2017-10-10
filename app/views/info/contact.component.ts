import {Component} from '@angular/core';

import { ProcessMessageService } from '../../services/processmessage.service';
import { PageTitleService } from '../../services/pagetitle.service';

import { PageTitle } from '../../helpers/classes';

@Component({
    selector: 'contact-view',
    templateUrl: 'app/views/info/contact.component.html'
})


export class ContactComponent {

  constructor(private _pmService: ProcessMessageService,
                   private _pageTitleService: PageTitleService) {

    this._pageTitleService.emitPageTitle(new PageTitle("Contact Us Page"));
    this._pmService.emitRoute("nill");

  }

}

