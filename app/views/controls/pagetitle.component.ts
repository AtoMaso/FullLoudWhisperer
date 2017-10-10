import { Component, Input} from '@angular/core';
import { PageTitle } from '../../helpers/classes';

@Component({
  selector: 'page-title',
  template: ` <div class="panel panel-heading textgray">
                      <h3><i>{{ pageTitle }} {{ pageValue }} </i></h3>
                    </div>`
})

export class PageTitleComponent {
      private pageTitle: string = "";
      private pageValue: string = "";

      constructor() {}


      public displayPageTitle(page:PageTitle) {
        this.pageTitle = page.title;
        if (page.value !== "") { this.pageValue = page.value; }
        else { this.pageValue = ""; }
      }

}

