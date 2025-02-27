import { Component } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { HttpClient } from "@angular/common/http";
import { NativeScriptFormsModule } from "@nativescript/angular/forms";
import { alert, prompt } from "tns-core-modules/ui/dialogs";
import { ActivityIndicator } from "tns-core-modules/ui/activity-indicator";
import { EventData } from "tns-core-modules/data/observable";
import { getBoolean, setBoolean, getNumber, setNumber, getString, setString, hasKey, remove, clear} from "tns-core-modules/application-settings";
import { topmost } from '@nativescript/core/ui/frame';
import { trigger, state, style, animate, transition, } from '@angular/animations';
import { View } from "tns-core-modules/ui/core/view";
import { Color } from "tns-core-modules/color";
import { FlexboxLayout } from "@nativescript/core/ui/layouts/flexbox-layout";
import * as viewModule from 'tns-core-modules/ui/core/view';
import { Observable } from 'tns-core-modules/data/observable';
import { Image } from "tns-core-modules/ui/image";
import { Page } from "tns-core-modules/ui/page";
import { Animation } from "tns-core-modules/ui/animation";
import {GridLayout} from "@nativescript/core/ui/layouts//grid-layout";
import {TextField} from "tns-core-modules/ui/text-field";


@Component({
    selector: "ns-login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login-style.css"],
    animations: [
        trigger('openClose', [
          // ...
          state('open', style({
            opacity: 1,
            backgroundColor: 'yellow'
          })),
          state('closed', style({
            opacity: 0.5,
            backgroundColor: 'green'
          })),
          transition('open => closed', [
            animate('1s')
          ]),
          transition('closed => open', [
            animate('0.5s')
          ]),
        ]),
      ],
})
export class LoginComponent {
    public isLoggingIn = true;
    public credentials: User = {
        email: "", 
        password: "",
        username: "",
        first_name: "",
        last_name: ""
    }
    public isBusy: boolean = false;
    public confirm: string = "";
    public checkYes: Boolean = false;
    public checkYesPW: Boolean = false;
    public token;
    public isOpen = true;
    public flexBox: FlexboxLayout;
    public landingImages = ['~/images/IMG_6513.png','~/images/IMG_6514.png','~/images/IMG_6515.png','~/images/IMG_6516.png','~/images/IMG_6518.png','~/images/IMG_6519.png','~/images/IMG_6520.png','~/images/IMG_6521.png','~/images/IMG_6522.png']
    public firstImageSpot: Image;
    public secondImageSpot: Image;
    public image1anim: Animation;
    public image2anim: Animation;


    constructor(
        private routerExtensions: RouterExtensions,
        private http: HttpClient) { }

    ngOnInit(): void {
        this.checkYes = getBoolean("checkYes");
        this.credentials.email = getString("email");
        this.checkYesPW = getBoolean("checkYesPW");
        this.credentials.password = getString("password")
        this.token = getString("token")
        if(this.token){
            this.routerExtensions.navigate(["items", this.token], { clearHistory: true });
        }
        
    }

    toggle() {
        this.isOpen = !this.isOpen;
    }

    toggleForm() {
        this.isLoggingIn = !this.isLoggingIn;
    }

    validateLogin() {
        let endpoint = "https://fashionapi.herokuapp.com/user/login";
        return this.http.post(endpoint, this.credentials, 
            {responseType: "text", observe: "response"});
    }

    createUser() {
        let endpoint = "https://fashionapi.herokuapp.com/user/register";
        return this.http.post(endpoint, this.credentials,
            {responseType: "text", observe: "response"});
    }

    submit() {
        if (this.isLoggingIn) {
            this.isBusy = true;
            this.validateLogin().subscribe(res => {
                let token = res.body; // return token if verification successful
                setString("token", token);
                if(this.checkYes==true){
                    setBoolean("checkYes", true);
                    setString("email", this.credentials.email);
                }
                if(this.checkYesPW==true){
                    setBoolean("checkYesPW", true);
                    setString("password", this.credentials.password);
                }
                this.routerExtensions.navigate(["items", token], { clearHistory: true });
            }, err => { // alert with error message if verification failed
                let response = err.error
                alert(response);
                this.isBusy=false;
            });
        } else {
            if(this.credentials.password != this.confirm) {
                alert("passwords do not match");
                this.isBusy=false;
                return;
            }
            this.isBusy = true;
            this.createUser().subscribe(res => {
                // if account creation successful: validate login and pass token
                this.validateLogin().subscribe(res => {
                    let token = res.body; // return token if verification successful
                    this.routerExtensions.navigate(["items", token], { clearHistory: true });
                }, err => { // alert with error message if verification failed
                    let response = err.error.slice(7, err.error.length);
                    alert(response);
                });
            }, err => { // if account creation failed: alert with error response
                let response = err.error.slice(7, err.error.length);
                alert(response); 
            });
            this.isBusy=false;
        }
    }

    onBusyChanged(args: EventData) {
        let indicator: ActivityIndicator = <ActivityIndicator>args.object;
        console.log("indicator.busy changed to: " + indicator.busy);
    }
    saveEmailOption(){
        if(this.checkYes==true){
            this.checkYes = false;
            remove("email")
            remove("checkYes")
        }else{
            this.checkYes = true;
        }
    }

    savePWOption(){
        if(this.checkYesPW==true){
            this.checkYesPW=false;
            remove("password")
            remove("checkYesPW");
        }else{
            this.checkYesPW = true;
        }
    }

    startAnimations(args){
        const container = <GridLayout>args.object;
        const newImage = new Image();
        newImage.style.width = 160;
        newImage.style.height = 180;
        newImage.order=1;
        let imageIndex = Math.floor(Math.random()*(8-0)+0);
        newImage.src = this.landingImages[imageIndex];
        container.addChild(newImage);
        let imageX = 0;
        this.animateFalling(newImage);
    }
    
    firstImage(args){
        let image: Image = <Image>args.object;
        let secondImage: Image = <Image>this.secondImageSpot;
        args.object.originY = 0;
        let page: Page =  <Page>args.page;
        this.firstImageSpot = args.object;
        let imageIndex = Math.floor(Math.random()*(8-0)+0);
        args.object.src = this.landingImages[imageIndex];
        let negative = 0;
        image.scaleX = 5;
        image.scaleY = 5;
        image.translateY = -5000;
        image.opacity = .3;
        this.animateFalling(image);
        
    }

    secondImage(args){
        let image: Image = <Image>args.object;
        let secondImage: Image = <Image>this.secondImageSpot;
        args.object.originY = 0;
        let page: Page =  <Page>args.page;
        this.firstImageSpot = args.object;
        let imageIndex = Math.floor(Math.random()*(8-0)+0);
        args.object.src = this.landingImages[imageIndex];
        let negative = 0;
        image.scaleX = 5;
        image.scaleY = 5;
        image.translateY = -5000;
        image.opacity = .3;
        setTimeout(() => {
            this.animateFalling(image);
        }, 4000)
    }

    animateFalling(image: Image){
        let imageIndex = Math.floor(Math.random()*(8-0)+0);
        image.src = this.landingImages[imageIndex];
        let imageX = 0;
        if(Math.random()>.5){
            imageX = Math.floor(Math.random()*(50))*-1
        }else{
            imageX = Math.floor(Math.random()*(50))
        }

        image.translateX = imageX;
        image.translateY = -1200;
        let animation = new Animation([
            {
                translate: { x: imageX, y: 1000 },
                duration: 8000,
                target: image,
                delay: 0,
                scale: { x: 5, y: 5}
            }
        ]);
        
        setTimeout(() => {
            this.image2anim = animation;
            animation.play().then(()=>{
                this.animateFalling(image);
            });
        }, 100)

    }

    onReturnPress(args){
        var page = args.object.page;
        let textField = <TextField>args.object;
        if(!this.isLoggingIn){
            switch(textField.id){
                case 'first_name':
                    <TextField>page.getViewById("last_name").focus()
                    break;
                case 'last_name':
                    <TextField>page.getViewById("username").focus()
                    break;
                case 'username':
                    <TextField>page.getViewById("email").focus()
                    break;
                case 'email':
                    <TextField>page.getViewById("password").focus()
                    break;
                case 'password':
                    <TextField>page.getViewById("password_confirm").focus()
                    break;
                case 'password_confirm':
                    this.submit()
                    break;
            }
        }else{
            switch(textField.id){
                case 'email':
                    <TextField>page.getViewById("password").focus()
                    break;
                case 'password':
                    this.submit()
                    break;
            }
        }
    }
}

export interface User {
    email: string;
    password: string;
    username: string;
    first_name: string;
    last_name: string;
}