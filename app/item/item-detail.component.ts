import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { ItemService } from "./item.service"

import { Item } from "./item";
import { ActionItem } from "tns-core-modules/ui/action-bar";
import { ActionBar } from "tns-core-modules/ui/action-bar";
import { Image } from 'tns-core-modules/ui/image'
import { Page } from "tns-core-modules/ui/page";


@Component({
    selector: "ns-details",
    templateUrl: "./item-detail.component.html",
    styleUrls: ["./item-detail-style.css"]
})
export class ItemDetailComponent implements OnInit {
    item: Item;
    focus: number = 0;
    liked: boolean = false;
    disliked: boolean = false;

    activelikedIcon: Image;

    activedislikedIcon: Image;
    Color = require("tns-core-modules/color").Color;
    colors = require("tns-core-modules/color/known-colors");
    colorRed = new this.Color("#FF0000");

    constructor(
        private itemService: ItemService,
        private route: ActivatedRoute,
        private page: Page
    ) { }

    onScrollEnded(event) {
        if(event.scrollOffset % 350 != 0) {
            this.focus = Math.round(event.scrollOffset / 350);
            event.object.scrollToIndex(this.focus, true);
        }
    }

    onScrollDragEnded(event) {
        if(event.scrollOffset > ( (this.focus * 350) + 175 )) {
            this.focus += 1;
        } else if(event.scrollOffset < ( (this.focus * 350) - 175 )) {
            this.focus -= 1;
        }
        event.object.scrollToIndex(this.focus, true);
    }

    ngOnInit(): void {
        const i = +this.route.snapshot.params.id;
        this.item = this.itemService.getItem(i);

        
    }

    onItemLike(args){
        if(this.liked==true){
            this.activedislikedIcon.visibility="visible";
            this.disliked=false;
            this.liked=false;
        }else{
            this.liked=true;
            this.activedislikedIcon.visibility="hidden";
        }
    }

    onItemDislike(args){
        if(this.disliked==true){
            this.activelikedIcon.visibility="visible";
            this.disliked=false;
            this.liked=false;
        }else{
            this.disliked=true;
            this.activelikedIcon.visibility="hidden";
        }
    }


    //        <Image [src] = "disliked ? 'font://&#xf165;' : 'font://&#xf165;'" class="fas t-36"></Image>
    //        <Image [src] = "liked ? 'font://&#xf004;' : 'font://&#xf004;'" [class]="liked ? 'fas t-36' : 'far t-36'"></Image>


    checkLikeActive(args){
        this.activelikedIcon = args.object;
    }

    checkDislikeActive(args){
        this.activedislikedIcon = args.object;  
    }

    actionBarLoaded(args){

    }
    
}