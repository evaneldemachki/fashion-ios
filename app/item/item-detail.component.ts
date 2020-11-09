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
import { Vibrate } from 'nativescript-vibrate';
import {AnimationCurve} from "tns-core-modules/ui/enums";
import { Animation } from "tns-core-modules/ui/animation";


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

    set currentlyChosen(value) {
        this.itemService.currentlyChosen = value;
    }
    get currentlyChosen() {
        return this.itemService.currentlyChosen;
    }

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

    addToOutfit(args){
        var exists =false;
        for(var j=0;j<this.currentlyChosen.length;j++){
            if(this.itemService.loadedItem['_id']==this.currentlyChosen[j]['_id']){
                exists = true;
            }
        }
        if(exists==false){
            this.currentlyChosen.push(this.itemService.loadedItem);
            this.itemService.outfitCost = this.itemService.outfitCost + Number(this.itemService.loadedItem['price']);
            this.itemService.outfitCostLabel = "Total cost of this outfit is: $" + this.itemService.outfitCost.toFixed(2);
        }

        let vibrator = new Vibrate();
        vibrator.vibrate(50);
        /*
        let rotate = new Array();
        rotate.push({ rotate: 5, scale: { x: 1, y: 1}, duration: 100, target: button, delay: 0, curve: AnimationCurve.easeOut })
        rotate.push({ rotate: -10, scale: { x: 1, y: 1}, duration: 100, target: button, delay: 0,curve: AnimationCurve.easeOut})
        rotate.push({ rotate: 5, scale: { x: 1, y: 1}, duration: 100, target: button, delay: 0,curve: AnimationCurve.easeOut})
        rotate.push({ rotate: 0, scale: { x: 1, y: 1}, duration: 100, target: button, delay: 0,curve: AnimationCurve.easeOut})
        var animationSet = new Animation(rotate, true);
        animationSet.play();
        */
    }
      /*
    input = {
        "token": "token12345",
        "item_id": "id09876",
        "action": "like"
    }
*/
}