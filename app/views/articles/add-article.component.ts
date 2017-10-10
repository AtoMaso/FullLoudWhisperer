/// <reference path="../../../typings/tsd.d.ts" />
import { Component, OnInit} from '@angular/core';
import { RouteParams, Router, RouteConfig, RouterLink, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from '@angular/router-deprecated';
import { Http, Response, HTTP_PROVIDERS, HTTP_BINDINGS, Headers, RequestOptions } from '@angular/http';
import { FormBuilder, Validators, CORE_DIRECTIVES, FORM_DIRECTIVES, NgClass, NgStyle} from '@angular/common';
import { FILE_UPLOAD_DIRECTIVES, FileSelectDirective, FileDropDirective, FileUploader} from 'ng2-file-upload';
import { Observable } from 'rxjs/Observable';
import { CONFIG } from '../../config';

import { ValidationService } from '../../services/validation.service';
import { ArticleService } from '../../services/article.service';
import { CategoryService } from '../../services/category.service';
import { LoggerService } from '../../services/logger.service';
import { ProcessMessageService } from '../../services/processmessage.service';
import { PageTitleService } from '../../services/pagetitle.service';

import { ControlMessages } from '../controls/control-messages.component';
import { Article, Attachement, Category ,PageTitle , UserSession, UserIdentity, Authentication, Guid} from '../../helpers/classes';

let uploadsUrl = CONFIG.baseUrls.uploads;
let uploadsAttachUrl = CONFIG.baseUrls.uploadsattach;
let uploadPhysical = CONFIG.baseUrls.uploadsphysical;

@Component({
  selector: 'article-view',
  templateUrl: './app/views/articles/add-article.component.html', 
  directives: [ROUTER_DIRECTIVES, ControlMessages, FILE_UPLOAD_DIRECTIVES, NgClass, NgStyle, CORE_DIRECTIVES, FORM_DIRECTIVES],
  providers: [Http, HTTP_BINDINGS, ArticleService, CategoryService]
})

export class AddArticleComponent {

  private articleId: string;
  private articleForm: any;
  private newArticle: Article = new Article();
  private returnedArticle: Article = new Article();
  private returnedAttachements: Attachement[] =[]; 
  private categories: Category[] = [];
  private isSubmitted: boolean = false;
  private isRequesting: boolean = false;
  private isVisible: boolean =  false;
  private isMessageVisible: boolean = false;
  private isFileAllowed: boolean = false;

  private fileErrorMessage: string = "";

  private uploader: FileUploader = new FileUploader({
    url: uploadsUrl,
    queueLimit: 2,
    maxFileSize: 1024 * 1024, //max 10 MB
    allowedFileType: ['csv', 'xls', 'xlsx', 'xml', 'txt', 'doc', 'docx', 'cs', 'vb', 'sql', 'json']
    // MAKE SURE THAT ALL EXTENSIONS ARE INTRODUCED IN THE file-type.class.js of the ng2-file-upload 
  });
  private hasBaseDropZoneOver: boolean = true;
  private hasAnotherDropZoneOver: boolean = false;


  constructor(private _http: Http,
        private _articleService: ArticleService,
        private _categoryService:CategoryService,
        private _pmService: ProcessMessageService,
        private _pageTitleService: PageTitleService,
        private _loggerService: LoggerService,
        private _formBuilder: FormBuilder) {

        this.articleForm = this._formBuilder.group({
          'Title': ['', Validators.compose([Validators.required])],
          'Flash': ['', Validators.compose([Validators.required,])],
          'Content': ['', Validators.required],
          'Category': ['', Validators.required],
        });
  };

  ngOnInit() {
    // generate the article id which will need to be passed as part of the file attached
    this.articleId = Guid.newGuid();
    this._pageTitleService.emitPageTitle(new PageTitle("Add Article"));
    this._pmService.emitRoute("nill");

    this.isRequesting = false;
    this.isFileAllowed = false;
    this.getCategories();
  }

 
  private fileOverBase(e: any) {
    this.hasBaseDropZoneOver = e;

  }

  private fileOverAnother(e: any) {
    this.hasAnotherDropZoneOver = e;
  }

 //*******************************************
 // GET CATEGORIES 
 //*******************************************
  private getCategories() {
    this._categoryService.getCategories()
          .subscribe((returnedCategories: Category[]) => {
                  if (returnedCategories.length == 0) { this._pmService.emitProcessMessage("PMNOCs"); }
                  this.categories = returnedCategories,
                  this.isRequesting = false       
              }, (res: Response) => this.onError(res, "GetCategories"));
  }


 //*************************************
 // ADD ARTICLE
 //*************************************
  private onChange(event: any) {
    this.isFileAllowed = false;
    this.isMessageVisible = false;
    let i: number = 0;

    // get the files from the event which controll has passed
    let files: File[] = event.srcElement.files;

     // MULTIPLE FILES POSSIBLE
     // check the number of files selected
     if ((this.uploader.queue.length + files.length) > 2 ) {
            this.isMessageVisible = true;
            this.fileErrorMessage = "Warning: Maximum of 2 files can be attached with maximum size of 10MB each!";           
      }

     for (i = 0; i < files.length; i++) {
          // check the sizeof the file
          if (files[i].size > this.uploader.options.maxFileSize) {
                this.isMessageVisible = true;
                this.fileErrorMessage = "Warning: The selected file '" + files[i].name + "' is too big!";               
          }
          // check the type of the file
          this.uploader.options.allowedFileType.forEach(type => {
                let filename = files[i].name.split(".");
                if (type === filename[filename.length - 1]) {
                  this.isFileAllowed = true;
              }
          });

          if (!this.isFileAllowed) {
            this.isMessageVisible = true;
                let filename = files[i].name.split(".");
                this.fileErrorMessage = "Warning: The  file extension '" + filename[filename.length - 1] + "' is not allowed!";                  
          }
      }

    // SINGLE FILE AT THE TIME
    //if (this.uploader.queue.length == 2) {
    //    this.isMessageVisible = true;     
    //    this.fileErrorMessage = "Warning: Maximum of 2 files can be attached and with maximum size of 10MB each!";
    //    return;
    //}

    //// check the size of the file selected
    //if (files[0].size > this.uploader.options.maxFileSize) {
    //      this.isMessageVisible = true;
    //      this.fileErrorMessage = "Warning: The file selected " + files[0].name  + " is too big!";
    //}
    //// check the selected file type
    //this.uploader.options.allowedFileType.forEach(type => {
    //      let filename = files[0].name.split(".");
    //      if (type === filename[filename.length-1]) {
    //            this.isFileAllowed = true;
    //      }
    //});
    //if (!this.isFileAllowed) {        
    //  this.isMessageVisible = true;       
    //    this.fileErrorMessage = "Warning: The file extension not allowed!";
    //}

  }

  // called when remove file button is clicked
  private removeFile(item: any) {
       this.isMessageVisible = false;
       item.remove();
     
  }

  // called when remove all files button is clicked
  private removeAllFiles() {
    this.isMessageVisible = false;
    this.uploader.clearQueue();
  }

  private saveArticle() {
    if (this.articleForm.dirty && this.articleForm.valid) {   

              this.isMessageVisible = false;
              this.isRequesting = true;
              this.newArticle.ArticleId = this.articleId;   
           
              // upload files if any and get result first
              if (this.uploader.queue.length > 0) {
                    this.uploader.queue.forEach(x => this.uploadSingleFile(x))                        
              }                        
              this.addArticle(this.newArticle);               
        }
  }


  private uploadSingleFile(item: any) {
      let originalFileName: string = item.file.name;   
      item.withCredentials = false;
      // we are making the name unique evenif the file is the same 
      // and does exist on the server upload side
      item.file.name = this.articleId + "_" + item.file.name;    
      item.upload();   

      // set the attachement array here
      let attachement = new Attachement();
      // date and the authorid of the article are added in the artcile service
      // the service has an access to the session and user identity
      attachement.ArticleId = this.articleId;
      attachement.Name = item.file.name;   
      attachement.PhysicalPath = uploadPhysical + "/" + item.file.name;  
      this.newArticle.Attachements.push(attachement);
 }

  private addArticle(article: Article) {
        if (!article) { return; }
        // call the article service to post the articles
        this._articleService.addArticle(article)
              .subscribe((addedArticle: any) => this.onSuccessAddArticle(addedArticle),
              (err => this.onError(err, "AddArticle")));
  }

  //*****************************************************
  // PRIVATE METHODS ARTICLES
  //*****************************************************
  private onSuccessAddArticle(article: Article) {    
          this.isSubmitted = true;   
          this.returnedArticle = article;
          this.returnedAttachements = article.Attachements;
          if (this.returnedAttachements.length > 0) { this.isVisible = true; }
          this.isRequesting = false; 
          this._pmService.emitProcessMessage("PMAAS");
      
  }

  // an error has occured
  private onError(err: any, type: string) {

    let message: string = "";
    // stop the spinner
    this.isRequesting = false;

    // we will log the error in the server side by calling the logger, or that is already 
    // done on the server side if the error has been caught
    this._loggerService.logErrors(err, "add article page");

    // we will display a fiendly process message using the process message service             
    this._pmService.emitProcessMessage("PMAA");
    // we will display a fiendly process message using the process message service   
    if (err.status !== 200 || err.status !== 300) {
      let data = err.json();

      if (data.ModelState) {
        for (var key in data.ModelState) {
          for (var i = 0; i < data.ModelState[key].length; i++) {
            //errors.push(data.modelState[key][i]);
            if (message == null) { message = data.ModelState[key][i]; }
            else { message = message + data.ModelState[key][i]; } // end if else
          }// end for
        } // end for
        this._pmService.emitProcessMessage("PME", message);
      } // end if
      else {
        // we will display a fiendly process message using the process message service    
        switch (type) {
          case "AddArticle":
            this._pmService.emitProcessMessage("PMAA");
            break;
          case "GetCategories":
            this._pmService.emitProcessMessage("PMGCs");
            break;
          default:
            this._pmService.emitProcessMessage("PMG");
        }
      }
    }
  }
}



//// check the number of files selected
//if (files.length > 2) {
//  this.isMessageVisible = true;
//  this.fileErrorMessage = "Warning: Maximum of 2 files can be attached and with maximum size of 10MB each!";
//  return;
//}

//for (i = 0; i < files.length; i++) {

//  if (files[i].size > this.uploader.options.maxFileSize) {
//    this.isMessageVisible = true;
//    this.fileErrorMessage = "Warning: The file " + files[i].name + " selected is too big!";
//  }
//  // check the type of each file
//  this.uploader.options.allowedFileType.forEach(type => {
//    let filename = files[i].name.split(".");
//    if (type === filename[filename.length - 1]) {
//      this.isFileAllowed = true;
//    }
//  });

//  if (!this.isFileAllowed) {
//    this.isMessageVisible = true;
//    this.fileErrorMessage = "Warning: The file extension " + " not allowed!";
//    return;
//  }

//}
//this.uploader.addToQueue(files);