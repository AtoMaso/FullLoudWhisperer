/// <reference path="../../../typings/tsd.d.ts" />
import {Component} from '@angular/core';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
import {CORE_DIRECTIVES, FORM_DIRECTIVES, NgClass, NgStyle} from '@angular/common';
import {FILE_UPLOAD_DIRECTIVES, FileSelectDirective,FileDropDirective, FileUploader} from 'ng2-file-upload';
import { CONFIG } from '../../config';

import { ProcessMessageService } from '../../services/processmessage.service';
import { UserSession, UserIdentity, Authentication} from '../../helpers/classes';

let uploadsUrl = CONFIG.baseUrls.uploads;
let uploadsAttachUrl = CONFIG.baseUrls.uploadsattach;

@Component({
  selector: 'ng2-file-upload',
  templateUrl: './app/views/file-upload/ng2-file-upload.component.html',
  directives: [FILE_UPLOAD_DIRECTIVES, NgClass, NgStyle, CORE_DIRECTIVES, FORM_DIRECTIVES]
})

export class NG2FileUploadComponent {
  private session: UserSession;
  private identity: UserIdentity = new UserIdentity;
  private isAuthenticated: boolean = false;
  private isAllowed: boolean = false;

  constructor(private _pmService: ProcessMessageService) {}


  private uploader: FileUploader = new FileUploader({
    url: uploadsUrl,
    queueLimit: 5,   
    maxFileSize: 1024*1024,
  });


  private hasBaseDropZoneOver: boolean = true;
  private hasAnotherDropZoneOver: boolean = false;

  private uploadSingleFile(item: any) {
    item.withCredentials = false;   
    item.file.name = "ArticleId" + item.file.name;
    item.upload();
  }

  private fileOverBase(e: any) {
    this.hasBaseDropZoneOver = e;

  }

  private fileOverAnother(e: any) {
    this.hasAnotherDropZoneOver = e;
  }

}
