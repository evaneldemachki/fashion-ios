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

@Component({
    selector: "ns-outfit",
    templateUrl: "./outfit.component.html",
})
export class OutfitComponent implements OnInit {

    constructor(
        private itemService: ItemService,
        private route: ActivatedRoute,
        private page: Page,
        private http: HttpClient,
    ) { }

    outfit = [];
    topOutfits = [];
    likedItems = [];
    savedItems = [];
    currentlyChosen = [];
    index;

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            // convert string parameters to boolean:
            this.index = params.outfit;
        });
        this.outfit = this.itemService.outfits[this.index]['items'];
    }
    

}