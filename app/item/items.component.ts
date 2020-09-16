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
    public items: ObservableArray<Item> = new ObservableArray();
    public itemsSaved = [];

    searchBar: SearchBar;
    listPicker: ListPicker;
    searchText: string;
    categoryView: RadListView;
    //categories = new ObservableArray()

    public categories = [];
    public loadMore = false;
    public currentlyLoaded = 0;
    public selectedIndex = 0;
    public totalLoaded = 0;
    public leftThresholdPassed = false;
    public rightThresholdPassed = false;

    public userIcon: Image;

    private token: string;

    constructor(
        private itemService: ItemService,
        private route: ActivatedRoute
        ) { }

    set userLikes(value) {
        this.itemService.userLikes = value;
    }
    get userLikes() {
        return this.itemService.userLikes;
    }
    set itemsShown(value) {
        this.itemService.itemsShown = value;
    }
    get itemsShown() {
        return this.itemService.itemsShown;
    }
    set itemsLiked(value) {
        this.itemService.itemsLiked = value;
    }
    get itemsLiked() {
        return this.itemService.itemsLiked;
    }
    set itemsDisliked(value) {
        this.itemService.itemsLiked = value;
    }
    get itemsDisliked() {
        return this.itemService.itemsDisliked;
    }

    ngOnInit(): void {
        this.token = this.route.snapshot.params.token;
        this.itemService.setToken(this.token);
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
        this.loadUserData();
        this.searchText = "";
   
    }

    loadUserData() {
        let input = { "token": this.token };
        this.itemService.getUserData(input).subscribe(res => {
            this.userLikes = res['likes'];
            this.userIcon = res['img'];
            this.findUserActions();
        });

    }

    addItemsToView() {
        let newitems = [];
        let tobeLoaded = 0
        if(this.currentlyLoaded + 1 > this.totalLoaded) {
            newitems = this.items.slice(this.currentlyLoaded, this.totalLoaded);
            tobeLoaded = this.totalLoaded - this.currentlyLoaded;
        } else {
            newitems = this.items.slice(this.currentlyLoaded, this.currentlyLoaded + 1);
            tobeLoaded = 1;
        }
        for(let i = 0; i < tobeLoaded; i++) {
            this.itemsShown.push(newitems[i]);
        }
        this.currentlyLoaded = this.itemsShown.length;
        this.findUserActions();
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
    
    findUserActions() {
        for(let i = 0; i < this.userLikes.length; i++) {
            for(let j =0; j < this.items.length; j++) {
                if(this.userLikes[i]['_id'] == this.items[j]['_id']) {
                    this.itemsLiked[j] = true;
                }
            }
        }
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
        } else {
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

        let thisItem = this.itemsShown.getItem(currentItemIndex);
        // swiped to dislike item:
        if(args.data.x > (swipeLimits.left / 3) - 10) {
            // send DISLIKE
            this.itemService.processAction("dislike", "itemsShown", currentItemIndex);
        } // swipe to like item
        else if (args.data.x < ((swipeLimits.right / 3) * -1) + 10) {
            // send RESET if already liked
            if(this.itemsLiked[currentItemIndex]) {
                this.itemService.processAction("reset", "itemsShown", currentItemIndex);
            } else { // send LIKE
                this.itemService.processAction("like", "itemsShown", currentItemIndex);    
            } 
        }
    }
}