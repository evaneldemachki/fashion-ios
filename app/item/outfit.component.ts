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

    myOutfits = [];
    topOutfits = [];
    likedItems = [];
    savedItems = [];
    currentlyChosen = [];

    ngOnInit(): void {

        //this.myOutfits = this.itemService.wardrobe;
        this.savedItems = this.itemService.userSaved;
        //this.topOutfits = this.itemService.getTopOutfits();
        this.likedItems = this.itemService.userLikes;
        //this.savedItems = this.itemService.savedItems;

    }
}