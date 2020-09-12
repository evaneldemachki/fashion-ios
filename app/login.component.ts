import { Component } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { HttpClient } from "@angular/common/http";
import { NativeScriptFormsModule } from "@nativescript/angular/forms";
import { alert, prompt } from "tns-core-modules/ui/dialogs";
import { ActivityIndicator } from "tns-core-modules/ui/activity-indicator";
import { EventData } from "tns-core-modules/data/observable";
import { getBoolean, setBoolean, getNumber, setNumber, getString, setString, hasKey, remove, clear} from "tns-core-modules/application-settings";
import { topmost } from '@nativescript/core/ui/frame';


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
    public isBusy: boolean = false;
    public confirm: string = "";
    public checkYes: Boolean = false;


    constructor(
        private routerExtensions: RouterExtensions,
        private http: HttpClient) { }

    ngOnInit(): void {
        this.checkYes = getBoolean("checkYes");
        this.credentials.username = getString("email");
    }

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
            this.isBusy = true;
            this.validateLogin().subscribe(res => {
                let token = res.body; // return token if verification successful
                if(this.checkYes==true){
                    setBoolean("checkYes", true);
                    setString("email", this.credentials.username)
                }
                this.routerExtensions.navigate(["items", token], { clearHistory: true });
            }, err => { // alert with error message if verification failed
                let response = err.error.slice(7, err.error.length);
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

}

export interface User {
    username: string;
    password: string;
}