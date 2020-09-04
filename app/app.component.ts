import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";

@Component({
    selector: "ns-app",
    templateUrl: "app.component.html"
})
export class AppComponent {
    constructor(private router: Router, private routerExtensions: RouterExtensions) {
        // Use the component constructor to inject services.
    }
}
