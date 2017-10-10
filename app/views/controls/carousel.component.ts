import { Component, Input } from '@angular/core';
import { Response } from '@angular/http';
import { CONFIG } from '../../config';

import { ImageService } from '../../services/image.service';
import { LoggerService } from '../../services/logger.service';
import { ProcessMessageService } from '../../services/processmessage.service';
import { Image } from '../../helpers/classes';

let numberOfImages = CONFIG.appKeys.numberOfImages;
let totalNumberOfImages = CONFIG.appKeys.totalNumberOfImages;

@Component({
    selector: 'css-carousel',   
    templateUrl: './app/views/controls/carousel.component.html',
    styleUrls: ['assets/css/carousel.component.css'],
    providers: [ImageService]
})

export class CSSCarouselComponent {
  
    public allImages: Image[] = [];  
    public selectedNumbers: number[] = [];
    public showImages1: Image[] = [];
    public showImages2: Image[] = [];
    public showImages3: Image[] = [];
    public showImages4: Image[] = [];
    public showImages5: Image[] = [];
    public showImages6: Image[] = [];
    private setNumber: number = 0;
    private isVisible: boolean = true;

    constructor(private _imageService: ImageService,
                     private _loggerService: LoggerService,
                     private _pmService: ProcessMessageService) {            
        this.getImages();         
    }  
    
    // gets the images data from the local json file
    public getImages() {

      this._imageService.getImages()
            .subscribe(
                  (images: Image[]) => this.onSuccessGetImage(images)
                 ,(error:any) => this.onError(error));
    }

    //**************************************************************
    // PRIVATE METHODS ARTICLES
    //**************************************************************
    // on success of the http call
    private onSuccessGetImage(passedImages:Image[]) {
      this.allImages = passedImages;
      this.showImages1 = this.getRandomImages();      
      this.showImages2 = this.getRandomImages();  
      this.showImages3 = this.getRandomImages();  
      this.showImages4 = this.getRandomImages();  
      this.showImages5 = this.getRandomImages();  
      this.showImages6 = this.getRandomImages();  
    }

    // get the random images to display
    private getRandomImages() {

      let img: Image[] = [];
      for (let x = 0; x < numberOfImages; x++) {
            
            this.getUniqueRandomSet();
            // img.push(IMAGES[this.selectedNumbers[x]]);
            img.push(this.allImages[this.selectedNumbers[x + this.setNumber * 5]]);         
      }
      this.setNumber++;
      return img;
    }

    // gets the random numbers for different sets
    private getUniqueRandomSet() {

      let num = Math.floor(Math.random() * totalNumberOfImages);
      if (num < 1) {
        num = 1;
      }
      this.selectedNumbers.push(num);
      for (let x = 0; x < this.selectedNumbers.length - 1; x++) {
        if (num === this.selectedNumbers[x]) {
          this.selectedNumbers.pop();
          this.getUniqueRandomSet();
        }
      }
    }

    // on error of http call
    private onError(err: any) {
      // toggle visibility when error is raised
      this.isVisible = false;   

      // we will log the error in the server side by calling the logger, or that is already 
      // done on the server side if the error has been caught
      this._loggerService.logErrors(err, "carousel control");

      // we will display a fiendly process message using the process message service             
      this._pmService.emitProcessMessage("PMGI");       
    
    }
}

