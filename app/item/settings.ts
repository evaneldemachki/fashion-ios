import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Page } from "tns-core-modules/ui/page";
import { RouterExtensions } from "nativescript-angular/router";
import { ItemService } from "./item.service";

@Component({
    selector: "ns-items",
    moduleId: module.id,
    templateUrl: "./settings.html"
})
export class settingsComponent implements OnInit {

    constructor(
        private itemService: ItemService,
        private route: ActivatedRoute,
        protected router: RouterExtensions,
        private page: Page,
        private routerExtensions: RouterExtensions,
        ) { }

    ngOnInit(): void {


    }
}
