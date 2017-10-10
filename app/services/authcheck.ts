import { Directive, Attribute, ElementRef, ViewContainerRef, DynamicComponentLoader } from  '@angular/core';
import { Router, RouterOutlet, ComponentInstruction } from '@angular/router-deprecated';
import { AuthenticationService } from './authentication.service';

@Directive({
    selector: 'router-outlet'
})

export class AuthCheck extends RouterOutlet {

    public publicRoutes: any;
    public parentRouter: Router;
    private _authenticationService: AuthenticationService;

    constructor(_elementRef: ViewContainerRef, _loader: DynamicComponentLoader,
                    _parentRouter: Router, @Attribute('name') nameAttr: string) {

        super(_elementRef, _loader, _parentRouter, nameAttr);
    
        this.parentRouter = _parentRouter;
        this.publicRoutes = {
           'Dashboard': true,

            'About': true,
            'Contact': true,

            'Login': true,
            'Register': true,

            'Articles': true,
            'Article': true,

            'Authors': true,
            'Author': true,

            'Teams': true,
            'Team': true,

            'TeamMembers': true,
            'Member': true,
            'Members': true
        };
    }

    activate(instruction: ComponentInstruction) {
        let url = instruction.routeName;              

        if (!this.publicRoutes[url] && sessionStorage.getItem('UserSession') == 'null') {          
            this.parentRouter.navigateByUrl('/views/authentication/login');  
            return super.activate(instruction);         
        }
        return super.activate(instruction);
    }
}

