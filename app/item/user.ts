import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ItemService } from "./item.service"
import { Item } from "./item";
import { ActionItem } from "tns-core-modules/ui/action-bar";
import { ActionBar } from "tns-core-modules/ui/action-bar";
import { Image } from 'tns-core-modules/ui/image';
import { Page, Observable } from "tns-core-modules/ui/page";
import { HttpClient } from "@angular/common/http";
import { User } from "~/login.component";
import { ObservableArray } from 'tns-core-modules/data/observable-array';
import { SearchBar } from "tns-core-modules/ui/search-bar";
import { Animation } from "tns-core-modules/ui/animation";
import { RadListView, ListViewEventData, SwipeActionsEventData } from "nativescript-ui-listview";
import { GestureTypes, GestureEventData } from "tns-core-modules/ui/gestures";
import { GridLayout, ItemSpec } from "tns-core-modules/ui/layouts/grid-layout";
import { Label } from "tns-core-modules/ui/label";


@Component({
    selector: "ns-user",
    templateUrl: "./user.html",
})
export class userComponent implements OnInit {
    id;
    source;
    user;
    username;
    fullname;
    index;

    constructor(
        private itemService: ItemService,
        private route: ActivatedRoute,
        private page: Page,
        private http: HttpClient,
    ) { }

    ngOnInit(): void {
        const i = this.route.snapshot.params.id;
        this.index = i;

        this.route.queryParams.subscribe(params => {
            this.source = params.source;
            this.id = params.index;
            if(this.source == "friends") {
                this.user = this.itemService.search.getItem(this.id);
                this.username = this.user.username;
                this.fullname = this.user.first_name + ' ' + this.user.last_name
            } 
        });
    }

    start(args){
        this.page = args.object.page;
       
    }
}