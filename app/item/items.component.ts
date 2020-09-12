import { Item } from "./item";
import { ItemService } from "./item.service";
import { Component, OnInit } from "@angular/core";
import { SearchBar } from "tns-core-modules/ui/search-bar";
import { Page } from "tns-core-modules/ui/page";
import { registerElement } from 'nativescript-angular/element-registry';
import { RadListView, ListViewEventData, SwipeActionsEventData } from "nativescript-ui-listview";
import * as viewModule from 'tns-core-modules/ui/core/view';
import * as utils from "tns-core-modules/utils/utils";

import { Observable } from 'tns-core-modules/data/observable';
import { ObservableArray } from 'tns-core-modules/data/observable-array';
import { SelectedIndexChangedEventData, ValueList, DropDown } from "nativescript-drop-down";
import { EventData, fromObject } from "tns-core-modules/data/observable";
import { ListPicker } from "tns-core-modules/ui/list-picker";
import { View } from "tns-core-modules/ui/core/view";

import { PanGestureEventData, GestureStateTypes } from "tns-core-modules/ui/gestures";
import { ActivatedRoute } from "@angular/router";
import { Image } from "tns-core-modules/ui/image";


@Component({
    selector: "ns-items",
    moduleId: module.id,
    templateUrl: "./items.component.html"
})
export class ItemsComponent implements OnInit {
    items: ObservableArray<Item>;
    itemsShown = new ObservableArray<Item>();
    itemsLiked = []
    userLikes = new ObservableArray();
    userDislikes = new ObservableArray();
    searchBar: SearchBar;
    listPicker: ListPicker;
    searchText: string;
    //categories = new ObservableArray()

    public categories = [];
    public loadMore = false;
    public currentlyLoaded = 0;
    public selectedIndex = 0;
    public totalLoaded = 0;
    public leftThresholdPassed = false;
    public rightThresholdPassed = false;
    public likes = [];
    public dislikes = [];
    public userIcon: Image;
    public liked = false;
    public disliked = false;
    private token: string;

    constructor(
        private itemService: ItemService,
        private route: ActivatedRoute
        ) { }

    ngOnInit(): void {
        this.token = this.route.snapshot.params.token;
        
        this.itemService.getCategories().subscribe((res) =>{
            let cat = JSON.parse(res);
            //this.categories.push({"name" : "Any"});
            for(let i=0; i < cat.length; i++) {
                // capitalize first letter of category
                cat[i] = cat[i].charAt(0).toUpperCase() + cat[i].slice(1);
                //this.categories.push({"name" : cat[i]});
            }
            // add 'Any' category to search all items
            cat.unshift("Any");
            this.categories = cat;
        });
        this.refreshUserData();
        this.searchText = "";     
   
    }

    refreshUserData(){
        let input={"token": this.token};
        this.itemService.getUserData(input).subscribe((res) =>{
            let data = JSON.parse(res['body']);
            this.userLikes = data['likes'];
            this.userDislikes = data['dislikes'];
            this.userIcon = data['img'];
        });
    }

    addItemsToView() {
        let newitems = [];
        let tobeLoaded = 0
        if(this.currentlyLoaded + 20 > this.totalLoaded) {
            newitems = this.items.slice(this.currentlyLoaded, this.totalLoaded);
            tobeLoaded = this.totalLoaded - this.currentlyLoaded;
        } else {
            newitems = this.items.slice(this.currentlyLoaded, this.currentlyLoaded + 20);
            tobeLoaded = 20;
        }
        for(let i = 0; i < tobeLoaded; i++) {
            this.itemsShown.push(newitems[i]);
        }
        this.currentlyLoaded = this.itemsShown.length;
        this.findLiked();
    }

    refreshView() {
        this.itemsShown = this.items;
    }



    onSubmit(args) {
        this.refreshSearch();
    }

    onTextChanged(args) {
        this.searchBar = args.object as SearchBar;
        if(this.searchBar.text != null) {
            this.searchText = this.searchBar.text.toLowerCase();
        }
    }

    onClear(args) {
        this.refreshSearch();
    }

    categoryPicker(args) {
        this.listPicker = args.object as ListPicker;
        this.selectedIndex = args.object.selectedIndex;
        this.refreshSearch()
    }

    categorySelected(args){
        const item = this.categories[args.index];
    }

    categoryDeselected(args){
        const item = this.categories[args.index];
        console.log("Category selected " + item);
    }

    scrollStartedEvent(args) {
        this.searchBar.dismissSoftInput();
    }

    searchRouter() {
        let itemsRequest;

        if (this.searchText == "") {
            if(this.selectedIndex == 0) {
                console.log("Searching for <all>");
                itemsRequest = this.itemService.getItems();         
            } else {
                console.log("Searching for <all> in category '" + this.categories[this.selectedIndex] + "'");
                itemsRequest = this.itemService.getFromCategory(this.categories[this.selectedIndex].toLowerCase());
            }
        } else {
            if(this.selectedIndex==0) {
                console.log("Searching for '" + this.searchText + "'");
                itemsRequest = this.itemService.getFromName(this.searchText);
            } else {
                console.log("Searching for '" + this.searchText + "' in category: '"+ this.categories[this.selectedIndex] + "'");
                itemsRequest = this.itemService.getFromNameAndCategory(
                    this.searchText, this.categories[this.selectedIndex].toLowerCase());
            }
        }
        return itemsRequest;
    }

    refreshSearch() {
        let itemsRequest = this.searchRouter();

        itemsRequest.subscribe((res) => {
            this.items = JSON.parse(res);
            this.totalLoaded = this.items.length;
            this.itemService.items = this.items;
            this.itemsShown.length = 0;
            this.currentlyLoaded = 0;
            this.addItemsToView();
        });
    }
    
    findLiked(){
        for(var i=0; i<this.userLikes.length;i++){
            for(var j =0; j<this.items.length;j++){
                if(this.userLikes[i]['_id']==this.items[j]['_id'])
                    this.itemsLiked[j] = true;
            }
        }
        console.log(this.itemsLiked);
    }

    onSearch() {
        if(this.searchBar.visibility=="collapse") {
            this.searchBar.visibility = "visible";
        } else {
            this.searchBar.visibility = "collapse";
        }

    }
    
    onLoadMoreItemsRequested(args) {
        if(this.currentlyLoaded==0){
            this.itemService.getItems().subscribe((res) => {
                this.items = JSON.parse(res);
                this.itemService.items = this.items;
                this.addItemsToView();
            });
        }else{
            this.addItemsToView();
        }   
        args.returnValue = false;
    }
    
    onSwipeCellStarted(args: SwipeActionsEventData) {
        const swipeLimits = args.data.swipeLimits;
        const swipeView = args.swipeView;
        const leftItem = swipeView.getViewById('mark-view');
        const rightItem = swipeView.getViewById('delete-view');
        swipeLimits.left = swipeLimits.right = args.data.x > 0 ? swipeView.getMeasuredWidth() / 2 : swipeView.getMeasuredWidth() / 2;
        swipeLimits.threshold = swipeView.getMeasuredWidth();
    }

    onLeftSwipeClick(args) {
        console.log("Left swipe click");
    }
    
    onRightSwipeClick(args) {
        console.log("Right swipe click");
    }

    onItemSwiping(args: any) {
        let itemView = args.swipeView;
        let mainView = args.mainView;
        let currentView;
    
        if (args.data.x >= 0) {
            currentView = itemView.getViewById("complete-view");
            var dimensions = viewModule.View.measureChild(
                <viewModule.View>currentView.parent,
                currentView,
                utils.layout.makeMeasureSpec(Math.abs(args.data.x), utils.layout.EXACTLY),
                utils.layout.makeMeasureSpec(itemView.getMeasuredHeight(), utils.layout.EXACTLY));
            viewModule.View.layoutChild(<viewModule.View>currentView.parent, currentView, 0, 0, dimensions.measuredWidth, dimensions.measuredHeight);
            if (args.data.x > mainView.getMeasuredWidth() / 3) {
                this.rightThresholdPassed = false;
                this.leftThresholdPassed = true;
            }
        } else {
            currentView = itemView.getViewById("delete-view");
            var dimensions = viewModule.View.measureChild(
                <viewModule.View>currentView.parent,
                currentView,
                utils.layout.makeMeasureSpec(Math.abs(args.data.x), utils.layout.EXACTLY),
                utils.layout.makeMeasureSpec(mainView.getMeasuredHeight(), utils.layout.EXACTLY));
            viewModule.View.layoutChild(<viewModule.View>currentView.parent, currentView, mainView.getMeasuredWidth() - dimensions.measuredWidth, 0, mainView.getMeasuredWidth(), dimensions.measuredHeight);
            if (Math.abs(args.data.x) > mainView.getMeasuredWidth() / 3) {
                this.leftThresholdPassed = false;
                this.rightThresholdPassed = true;
            }
        }
    }
    
    onSwipeCellFinished(args: SwipeActionsEventData) {
        const swipeLimits = args.data.swipeLimits;
        const currentItemIndex = args.index;
        var liked = false;
        var disliked = false;
        //console.log(this.itemsShown)
        let thisItem=this.itemsShown.getItem(currentItemIndex);
        var index=0;
        for(var i=0;i<this.userLikes.length;i++){
            if(this.userLikes[i]['_id']==thisItem['_id']){
                liked = true;
                index=i;
            }
        }
        for(var i=0;i<this.userDislikes.length;i++){
            if(this.userDislikes[i]['_id']==thisItem['_id']){
                disliked = true;
                index=i;
            }        
        }
        if (args.data.x > swipeLimits.left/3) {
            if(disliked==true){
                //this.activelikedIcon.visibility="visible";
                disliked=false;
                liked=false;
                this.sendResetRequest(currentItemIndex);
                this.userDislikes.splice(index,0);
            }else{
                disliked=true;
                if(liked==true){
                    liked=false;
                }
                //this.activelikedIcon.visibility="hidden";
                this.sendDislikeRequest(currentItemIndex);
            }
            
        } else if (args.data.x < (swipeLimits.right/3)*-1) {
            if(liked==true){
                //this.activedislikedIcon.visibility="visible";
                disliked=false;
                liked=false;
                this.sendResetRequest(currentItemIndex);
                this.userLikes.splice(index,0);
            }else{
                liked=true;
                if(disliked==true){
                    disliked=false;
                }
                //this.activedislikedIcon.visibility="hidden";
                this.sendLikeRequest(currentItemIndex);
            }
        }
    }

    sendLikeRequest(index){
        let input = {
            "token": this.token,
            "item_id": this.itemsShown.getItem(index)['_id'],
            "action": "like"
        }
        this.itemService.getPostResponse(input).subscribe((res) =>{
        })
    }

    sendDislikeRequest(index){
        let input = {
            "token": this.token,
            "item_id": this.itemsShown.getItem(index)['_id'],
            "action": "dislike"
        }
        this.itemService.getPostResponse(input).subscribe((res) =>{
        })
    }

    sendResetRequest(index){
        let input = {
            "token": this.token,
            "item_id": this.itemsShown.getItem(index)['_id'],
            "action": "reset"
        }
        this.itemService.getPostResponse(input).subscribe((res) =>{
        })
    }

    onItemLike(args){
        console.log(args.object.src);
    }

    onItemDislike(args){
        console.log(args.object.src);

    }
}