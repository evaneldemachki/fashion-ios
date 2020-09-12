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
    token: String;
    activelikedIcon: Image;
    likes=[];
    dislikes=[];
    userData: User;

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
        this.token = this.route.snapshot.params.token;
        const i = +this.route.snapshot.params.id;
        this.item = this.itemService.getItem(i);
        this.checkLikeDislikeStatus();
        let input = {"token": this.token}
        this.itemService.getUserData(input).subscribe((res) =>{
            let data = JSON.parse(res['body']);
            this.likes = data['likes'];
            this.dislikes = data['dislikes'];
            for(var i=0;i<this.likes.length;i++){
                if(this.likes[i]==this.item._id){
                    this.liked = true;
                }
            }
            for(var i=0;i<this.dislikes.length;i++){
                if(this.dislikes[i]==this.item._id){
                    this.disliked = true;
                }        
            }
            console.log(this.likes)
            console.log(this.dislikes)
        })
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
        if(this.liked==true){
            this.activedislikedIcon.visibility="visible";
            this.disliked=false;
            this.liked=false;
            this.sendResetRequest();
        }else{
            this.liked=true;
            this.activedislikedIcon.visibility="hidden";
            this.sendLikeRequest();
        }
    }

    onItemDislike(args){
        if(this.disliked==true){
            this.activelikedIcon.visibility="visible";
            this.disliked=false;
            this.liked=false;
            this.sendResetRequest();
        }else{
            this.disliked=true;
            this.activelikedIcon.visibility="hidden";
            this.sendDislikeRequest();
        }
    }

    checkLikeActive(args){
        this.activelikedIcon = args.object;
    }

    checkDislikeActive(args){
        this.activedislikedIcon = args.object;  
    }
    
    checkLikeDislikeStatus(){
        if(this.disliked==true){
            this.activedislikedIcon.visibility="visible";
            this.activelikedIcon.visibility="collapse";
        }
        if(this.liked==true){
            this.activelikedIcon.visibility="visible";
            this.activedislikedIcon.visibility="collapse";
        }
    }

    sendLikeRequest(){
        let input = {
            "token": this.token,
            "item_id": this.item._id,
            "action": "like"
        }
        this.itemService.getPostResponse(input).subscribe((res) =>{
            console.log(res);
        })
    }

    sendDislikeRequest(){
        let input = {
            "token": this.token,
            "item_id": this.item._id,
            "action": "dislike"
        }
        this.itemService.getPostResponse(input).subscribe((res) =>{
            console.log(res);
        })
    }

    sendResetRequest(){
        let input = {
            "token": this.token,
            "item_id": this.item._id,
            "action": "reset"
        }
        this.itemService.getPostResponse(input).subscribe((res) =>{
            console.log(res);
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