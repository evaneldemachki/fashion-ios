import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { ItemService } from "./item.service"

import { Item } from "./item";
import { ActionItem } from "tns-core-modules/ui/action-bar";
import { ActionBar } from "tns-core-modules/ui/action-bar";
import { Image } from 'tns-core-modules/ui/image';
import { Page } from "tns-core-modules/ui/page";
import { HttpClient } from "@angular/common/http";
import { User } from "~/login.component";
import { ObservableArray } from 'tns-core-modules/data/observable-array';


@Component({
    selector: "ns-details",
    templateUrl: "./item-detail.component.html",
    styleUrls: ["./item-detail-style.css"]
})
export class ItemDetailComponent implements OnInit {
    item: Item;
    focus: number = 0;
    token: String;
    liked: boolean;
    index: number;
    source: string;
    saved: boolean;
    id: string;
    images = [];
    
    activelikedIcon: Image;
    activedislikedIcon: Image;

    constructor(
        private itemService: ItemService,
        private route: ActivatedRoute,
        private page: Page,
        private http: HttpClient
    ) { }

    ngOnInit(): void {
        const i = this.route.snapshot.params.id;
        this.index = i;

        this.route.queryParams.subscribe(params => {
            this.source = params.source;
            this.id = params.id;
            this.itemService.getOne(this.id);

        });
    }

    onItemLike(args) {
        if(this.itemService.loadedItemLiked) {
            this.itemService.processAction("reset", this.source, this.index);
            this.itemService.loadedItemLiked = false;
        } else {
            this.itemService.processAction("like", this.source, this.index);
            this.itemService.loadedItemLiked = true;
        }
    }

    onItemSave(args) {
        if(this.itemService.loadedItemSaved) {
            this.itemService.processAction("unsave", this.source, this.index);
            this.itemService.loadedItemSaved = false;
        } else {
            this.itemService.processAction("save", this.source, this.index);
            this.itemService.loadedItemSaved = true;
        }
    }
      /*
    input = {
        "token": "token12345",
        "item_id": "id09876",
        "action": "like"
    }
*/
}