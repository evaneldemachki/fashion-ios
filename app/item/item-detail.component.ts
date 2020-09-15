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
    disliked: boolean;
    
    activelikedIcon: Image;
    activedislikedIcon: Image;
    Color = require("tns-core-modules/color").Color;
    colors = require("tns-core-modules/color/known-colors");
    colorRed = new this.Color("#FF0000");

    constructor(
        private itemService: ItemService,
        private route: ActivatedRoute,
        private page: Page,
        private http: HttpClient
    ) { }

    ngOnInit(): void {
        const i = this.route.snapshot.params.id;

        this.route.queryParams.subscribe(params => {
            // convert string parameters to boolean:
            this.liked = (params.liked == "true");
            this.disliked = (params.disliked === "true");

            console.log("liked: " + this.liked + ", disliked: "  + this.disliked);
            if(params.source == "itemsShown") {
                this.item = this.itemService.itemsShown['_array'][i];
            } else if(params.source == "userLikes") {
                this.item = this.itemService.userLikes[i];
            }
        });

    }

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

    onItemLike(args){
        if(this.liked == true) {
            //this.activedislikedIcon.visibility="visible";
            this.disliked = false;
            this.liked = false;
            this.sendResetRequest();
        } else {
            this.liked = true;
            if (this.disliked == true){
                this.disliked = false;
            }
            //this.activedislikedIcon.visibility="hidden";
            this.sendLikeRequest();
        }
    }

    onItemDislike(args){
        if(this.disliked==true){
            //this.activelikedIcon.visibility="visible";
            this.disliked=false;
            this.liked=false;
            this.sendResetRequest();
        }else{
            this.disliked=true;
            if(this.liked==true){
                this.liked=false;
            }
            //this.activelikedIcon.visibility="hidden";
            this.sendDislikeRequest();
        }
    }

    sendLikeRequest(){
        let input = {
            "item": this.item._id,
            "action": "like"
        }
        this.itemService.getPostResponse(input).subscribe((res) =>{
        })
    }

    sendDislikeRequest(){
        let input = {
            "item": this.item._id,
            "action": "dislike"
        }
        this.itemService.getPostResponse(input).subscribe((res) =>{
        })
    }

    sendResetRequest(){
        let input = {
            "item": this.item._id,
            "action": "reset"
        }
        this.itemService.getPostResponse(input).subscribe((res) =>{
        })
    }

      /*
    input = {
        "token": "token12345",
        "item_id": "id09876",
        "action": "like"
    }
*/
}