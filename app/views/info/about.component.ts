import {Component} from '@angular/core';

import { ProcessMessageService } from '../../services/processmessage.service';
import { PageTitleService } from '../../services/pagetitle.service';

import { PageTitle } from '../../helpers/classes';

@Component({
    selector: 'about-view',
    templateUrl: 'app/views/info/about.component.html'
})
export class AboutComponent {
  constructor(private _pmService: ProcessMessageService,
                   private _pageTitleService: PageTitleService) {

    this._pageTitleService.emitPageTitle(new PageTitle("About Us Page"));
    this._pmService.emitRoute("nill");
  }

}

