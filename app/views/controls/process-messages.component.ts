import { Component, Input} from '@angular/core';

import { ProcessMessageService } from '../../services/processmessage.service';
import { ProcessMessage } from '../../helpers/classes/';


@Component({
  selector: 'process-messages',
  template: ` <div class="row">
                      <div class="col-md-10 col-md-offset-1 panel panel-danger"  *ngIf="errorMessage">
                          <span [class]="style">{{ errorMessage }}</span>
                      </div>
                  </div>`
})

export class ProcessMessagesComponent {
  private style: string;
  private errorMessage: string;

  // this is the host where this message control is used
  constructor(private _pmService: ProcessMessageService) {}

  // display the message text 
  public displayProcessMessage(message: ProcessMessage) {
    try {
      if (message === null) { this.errorMessage = null; }
      else {
        
        this.errorMessage = this.getThePrefix(message.type) + message.text;
        this.getControlStyle(message.type);
      }
    }
    catch (error) {
      // Display friendly client message in case the error message can not be displayed
      this.errorMessage = "An error has occured. Please contact the application administration.";
      this.getControlStyle("error");
    }
  }

  private getThePrefix(type: string): string {    
         switch (type) {
          case "error":
              return "ERROR: ";            
          case "warning":
              return "WARNING: ";  
          case "information":
              return "INFORMATION: ";  
          case "success":
              return "SUCCESS: ";  
      }
  }

  // gets the style of the control depending on the type of the message
  public getControlStyle(type: string) {

    switch (type) {
        case "error":
            this.style = "text-danger smalltext";
            break;
        case "warning":
            this.style = "text-warning smalltext";
            break;
        case "information":
            this.style = "text-info smalltext";
            break;    
        case "success":
            this.style = "text-success smalltext";
            break;      
          }
  }

}

