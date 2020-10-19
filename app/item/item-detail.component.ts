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
        this.index = i;

        this.route.queryParams.subscribe(params => {
            // convert string parameters to boolean:
            //this.liked = (params.liked == "true");
            //this.disliked = (params.disliked == "true");
            //this.saved = (params.saved == "true");
            this.source = params.source;
            this.id = params.id;

            if(this.source == "itemsShown") {
                this.item = <Item>this.itemService.itemsShown.getItem(i);
            } else if(this.source == "userLikes") {
                if(this.id){
                    this.itemService.getOne(this.id).subscribe(res => {
                        this.item = <Item>res
                    });
                }else{
                    this.item = <Item>this.itemService.userLikes[i];
                }
            }else if(this.source == "userSaved"){
                if(this.id){
                    this.itemService.getOne(this.id).subscribe(res => {
                        this.item = <Item>res
                    });
                }else{
                    this.item = <Item>this.itemService.userSaved[i];
                }
            }else if(this.source == "user"){
                if(this.id){
                    this.itemService.getOne(this.id).subscribe(res => {
                        this.item = <Item>res
                    });
                }
            }else if(this.source == "outfit"){
                if(this.id){
                    this.itemService.getOne(this.id).subscribe(res => {
                        this.item = <Item>res
                    });
                }
            
            }
            for(var j=0;j<this.itemService.userLikes.length;j++){
                if(this.itemService.userLikes[j]['_id']==this.item['_id']){
                    this.liked=true;
                }
            }

            for(var j=0;j<this.itemService.userSaved.length;j++){
                if(this.itemService.userSaved[j]['_id']==this.item['_id']){
                    this.saved = true;  
                }
            }
            this.id = this.item['_id']
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

    onItemLike(args) {
        if(this.liked) {
            this.liked = false;
            this.itemService.processAction("reset", this.source, this.index);
        } else {
            this.liked = true;
            this.itemService.processAction("like", this.source, this.index);
        }
    }

    onItemSave(args) {
        if(this.saved) {
            this.itemService.processAction("unsave", this.source, this.index);
            this.saved = false;
        } else {
            this.itemService.processAction("save", this.source, this.index);
            this.saved = true;
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