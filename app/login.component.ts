import { Component } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { HttpClient } from "@angular/common/http";
import { NativeScriptFormsModule } from "@nativescript/angular/forms";
import { alert, prompt } from "tns-core-modules/ui/dialogs";

@Component({
    selector: "ns-login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login-style.css"]
})
export class LoginComponent {
    public isLoggingIn = true;
    public credentials: User = {
        username: "", 
        password: ""
    }
    public confirm: string = "";

    constructor(
        private routerExtensions: RouterExtensions,
        private http: HttpClient) { }

    toggleForm() {
        this.isLoggingIn = !this.isLoggingIn;
    }

    validateLogin() {
        let endpoint = "http://fashionapi.herokuapp.com/api/user/verify";
        return this.http.post(endpoint, this.credentials, 
            {responseType: "text", observe: "response"});
    }

    createUser() {
        let endpoint = "http://fashionapi.herokuapp.com/api/user/create";
        return this.http.post(endpoint, this.credentials,
            {responseType: "text", observe: "response"});
    }

    submit() {
        if (this.isLoggingIn) {
            this.validateLogin().subscribe(res => {
                let token = res.body; // return token if verification successful
                this.routerExtensions.navigate(["items", token], { clearHistory: true });
            }, err => { // alert with error message if verification failed
                let response = err.error.slice(7, err.error.length);
                alert(response);
            });
        } else {
            if(this.credentials.password != this.confirm) {
                alert("passwords do not match");
                return;
            }
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
        }
    }
}

export interface User {
    username: string;
    password: string;
}