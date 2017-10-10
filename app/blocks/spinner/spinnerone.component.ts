﻿'use strict';

import {Component, Input, OnDestroy} from '@angular/core';

@Component({
  selector: 'my-spinner',
    templateUrl: './app/blocks/spinner/spinnerone.component.html'
})
export class SpinnerOneComponent implements OnDestroy {

  private str: string;
    private currentTimeout: any;
    private isDelayedRunning: boolean = false;

    @Input()
    public delay: number = 300;

    @Input()
    public set isRunning(value: boolean) {
        if (!value) {
            this.cancelTimeout();
            this.isDelayedRunning = false;
        }

        if (this.currentTimeout) {
            return;
        }

        this.currentTimeout = setTimeout(() => {
            this.isDelayedRunning = value;
            this.cancelTimeout();
        }, this.delay);
    }

    private cancelTimeout(): void {
        clearTimeout(this.currentTimeout);
        this.currentTimeout = undefined;
    }

    ngOnDestroy(): any {
        this.cancelTimeout();
    }
}
