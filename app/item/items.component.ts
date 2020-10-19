import { Item } from "./item";
import { ItemService } from "./item.service";
import { Component, OnInit } from "@angular/core";
import { SearchBar } from "tns-core-modules/ui/search-bar";
import { Page } from "tns-core-modules/ui/page";
import { registerElement } from 'nativescript-angular/element-registry';
import { RadListView, ListViewEventData, SwipeActionsEventData } from "nativescript-ui-listview";
import * as viewModule from 'tns-core-modules/ui/core/view';
import * as utils from "tns-core-modules/utils/utils";
import { getBoolean, setBoolean, getNumber, setNumber, getString, setString, hasKey, remove, clear} from "tns-core-modules/application-settings";
import { RouterExtensions } from "nativescript-angular/router";

import { Observable } from 'tns-core-modules/data/observable';
import { ObservableArray } from 'tns-core-modules/data/observable-array';
import { SelectedIndexChangedEventData, ValueList, DropDown } from "nativescript-drop-down";
import { EventData, fromObject } from "tns-core-modules/data/observable";
import { ListPicker } from "tns-core-modules/ui/list-picker";
import { View } from "tns-core-modules/ui/core/view";

import { PanGestureEventData, GestureStateTypes } from "tns-core-modules/ui/gestures";
import { GestureTypes, GestureEventData } from "tns-core-modules/ui/gestures";
import { ActivatedRoute } from "@angular/router";
import { Image } from "tns-core-modules/ui/image";
import { isIOS } from "tns-core-modules/platform";
import { Color } from "tns-core-modules/color";

import { Button } from "tns-core-modules/ui/button";
import { ShowModalOptions } from "tns-core-modules/ui/core/view";
import { GridLayout, ItemSpec } from "tns-core-modules/ui/layouts/grid-layout";
const modalViewModulets = "ns-ui-category/modal-view/basics/modal-ts-view-page";
import { Animation } from "tns-core-modules/ui/animation";
import { screen } from "tns-core-modules/platform/platform";
import { Vibrate } from 'nativescript-vibrate';


@Component({
    selector: "ns-items",
    moduleId: module.id,
    templateUrl: "./items.component.html"
})
export class ItemsComponent implements OnInit {
    
    //Main View
    public items: ObservableArray<Item> = new ObservableArray();
    searchBar: SearchBar;
    listPicker: ListPicker;
    searchText: string;
    sideBarMenu: GridLayout;
    
    //User Profile
    private token: string;
    public categoryList: RadListView;

    public categories = [];
    public isFriend = [];
    public currentlyLoaded = 0;
    public selectedIndex = 0;
    public totalLoaded = 0;
    public currIndex=0;
    public friendsListView = true;


    public profileSearchMenu: GridLayout;
    public profileSearchBar: SearchBar;
    public profileSearchMenuOn = 0;
    public profileSearchUsers = [];

    public profileFriendsSearchBar: SearchBar;
    public profileFriendsGrid: GridLayout;
    public profileFriendsGridOn = 0;
    public profileFriendsSearchUsers = [];
    public profileFriendsList = [];
    public requestsNum = 0;

    public profileLikesSearchMenu: GridLayout;
    public profileLikesSearchBar: SearchBar;
    public profileLikesSearchMenuOn = 0;
    public searchLikes = [];
    public profileLikesSearchText="";
    public profileLikesCategoryIndex=0;

    public profileSavedSearchBar: SearchBar;
    public profileSavedGrid: GridLayout;
    public profileSavedGridOn = 0;
    public searchSaved = [];
    public profileSavedList = [];
    public profileSavedSearchText="";
    public profileSavedCategoryIndex=0;


    public shareGrid: GridLayout;
    public shareGrid2: GridLayout;
    public shareGrid3: GridLayout;
    public shareOn = 0;
    public shareOn2 = 0;
    public shareOn3 = 0;
    public shareIcon: Image;
    
    public windowHeight = screen.mainScreen.heightPixels;
    public windowWidth = screen.mainScreen.widthPixels;
    


    //Outfit Creator
    public currentlyChosen = [];
    public savedItems = [];
    public outfitCreaterList = [];
    public filterBySaved = true;
    public searchCategories =[];
    public tutorialHide = false;
    public outfitTutorialHide = false;
    public outfitCost = 0;
    public outfitCostLabel = "";
    public searchView = 0;
    public sideMenuView = 0;
    public categoryVisible = false;

    constructor(
        private itemService: ItemService,
        private route: ActivatedRoute,
        protected router: RouterExtensions,
        private page: Page,
        private routerExtensions: RouterExtensions,
        ) { }

    set userLikes(value) {
        this.itemService.userLikes = value;
    }
    get userLikes() {
        return this.itemService.userLikes;
    }
    set userDislikes(value) {
        this.itemService.userDislikes = value;
    }
    get userDislikes() {
        return this.itemService.userDislikes;
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
    set itemsSaved(value) {
        this.itemService.itemsSaved = value;
    }
    get itemsSaved() {
        return this.itemService.itemsSaved;
    }
    set userSaved(value) {
        this.itemService.userSaved = value;
    }
    get userSaved() {
        return this.itemService.userSaved;
    }
    set userIcon(value) {
        this.itemService.userIcon = value;
    }
    get userIcon() {
        return this.itemService.userIcon;
    }
    set friendStatus(value) {
        this.itemService.friendStatus = value;
    }
    get friendStatus() {
        return this.itemService.friendStatus;
    }
    set userId(value) {
        this.itemService.userId = value;
    }
    get userId() {
        return this.itemService.userId;
    }
    set userName(value) {
        this.itemService.userName = value;
    }
    get userName() {
        return this.itemService.userName;
    }
    set userFullname(value) {
        this.itemService.userFullname = value;
    }
    get userFullname() {
        return this.itemService.userFullname;
    }
    set friends(value) {
        this.itemService.friends = value;
    }
    get friends() {
        return this.itemService.friends;
    }
    set outfits(value) {
        this.itemService.outfits = value;
    }
    get outfits() {
        return this.itemService.outfits;
    }
    set requests(value) {
        this.itemService.requests = value;
    }
    get requests() {
        return this.itemService.requests;
    }
    set pending(value) {
        this.itemService.pending = value;
    }
    get pending() {
        return this.itemService.pending;
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
        this.refreshSearch();
   
    }

    buttonLoaded(){
        console.log("BUTTON LOADED");
    }

    loadUserData() {
        let input = { "token": this.token };
        this.itemService.getUserData(input).subscribe(res => {
            //this.itemService.userID = res['username']
            this.userId = res['_id'];
            this.userName = res['username'];
            this.userFullname = res['first_name'] + ' ' + res['last_name'];
            this.friends = res['friends'];
            this.userLikes = res['likes'];
            this.userDislikes = res['dislikes'];
            this.userIcon = res['img'];
            this.userSaved = res['wardrobe'];
            this.outfits = res['outfits'];
            this.requests = res['requests'];
            this.pending =  res['pending'];

            this.userLikes.reverse();
            this.userSaved.reverse();
            this.searchLikes = this.userLikes;
            this.profileSavedList = this.userSaved;
            this.searchSaved = this.profileSavedList;
            this.outfitCreaterList = this.userSaved;
            this.profileFriendsList = this.friends;
            this.profileFriendsSearchUsers = this.profileFriendsList;       
            this.requestsNum = this.requests.length;                             
            this.findUserActions();
        });

        this.itemService.getAllUsers().subscribe(res => {
            this.itemService.allUsers = res;
            for(var i =0; i<this.itemService.allUsers.length;i++){
                if(this.itemService.allUsers[i]['_id']==this.itemService.userId){
                    this.itemService.allUsers.splice(i,1);
                }
            }
            this.profileSearchUsers = this.itemService.allUsers;
        });

    }

    Logout(){
        remove("token");
        this.routerExtensions.navigate(["login"], { clearHistory: true });
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

        if(this.itemsShown.length > 2){
            this.tutorialHide = true;
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

    searchBarLoaded(args){
        this.searchBar = args.object as SearchBar;
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

    categorySelected(args){
        const item = this.categories[args.index];
        this.searchCategories.push(this.categories[args.index]);
        this.refreshSearch();
    }

    categoryDeselected(args){
        const item = this.categories[args.index];
        for(var i=0; i<this.searchCategories.length;i++){
            if(this.searchCategories[i]==this.categories[args.index]){
                this.searchCategories.splice(i,1);
            }
        }
        this.refreshSearch();
    }

    scrollStartedEvent(args) {
        this.searchBar.dismissSoftInput();
    }

    searchRouter() {
        let itemsRequest;

        if (this.searchText == "") {
            if(this.searchCategories.length == 0) {
                console.log("Searching for <all>");
                itemsRequest = this.itemService.getItems();         
            } else {
                itemsRequest = this.itemService.getFromCategory(this.searchCategories);
            }
        } else {
            if(this.searchCategories.length==0) {
                console.log("Searching for '" + this.searchText + "'");
                itemsRequest = this.itemService.getFromName(this.searchText);
            } else {
                console.log("Searching for '" + this.searchText + "' in category: '"+ this.searchCategories + "'");
                itemsRequest = this.itemService.getFromNameAndCategory(this.searchText, this.searchCategories);
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
            this.findUserActions();
        });
    }
    
    findUserActions() {
        this.itemsLiked=[]
        this.itemsSaved = [];
        this.friendStatus = [];
        for(let i = 0; i < this.userLikes.length; i++) {
            for(let j =0; j < this.items.length; j++) {
                if(this.userLikes[i]['_id'] == this.items[j]['_id']) {
                    this.itemsLiked[j] = true;
                }
            }
        }
        for(let k = 0; k< this.userSaved.length; k++) {
            for(let l =0; l < this.items.length; l++) {
                if(this.userSaved[k]['_id'] == this.items[l]['_id']) {
                    this.itemsSaved[l] = true;
                }
            }
        }
        for(let m=0; m<this.itemService.friends.length;m++){
            this.isFriend[m]=true;
        }
        
    }

    onSearch() {
        let opening = new Animation([
            {
                translate: { x: this.searchBar.originX, y: this.searchBar.originY+100 },
                duration: 500,
                target: this.searchBar,
                delay: 0,
            }
        ]);
        let closing = new Animation([
            {
                translate: { x: this.searchBar.originX, y:this.searchBar.originY-100 },
                duration: 500,
                target: this.searchBar,
                delay: 0,
            }
        ]);
        if(this.searchView==0){
            opening.play();
            this.searchView = 1;
        }else{
            closing.play();
            this.searchView = 0;
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
                //this.rightThresholdPassed = false;
                //this.leftThresholdPassed = true;
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
                //this.leftThresholdPassed = false;
                //this.rightThresholdPassed = true;
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

    swapFilterSaved(){
        if(this.filterBySaved==true){
            this.filterBySaved = false;
            this.outfitCreaterList = this.userLikes;
        }else{
            this.filterBySaved=true;
            this.outfitCreaterList = this.userSaved;
        }
    }

    createrSelected(args){
        this.outfitTutorialHide = true;
        let i = args.index;
        var exists =false;
        for(var j=0;j<this.currentlyChosen.length;j++){
            if(this.outfitCreaterList[i]==this.currentlyChosen[j]){
                exists = true;
            }
        }
        if(exists==false){
            this.currentlyChosen.push(this.outfitCreaterList[i]);
            this.outfitCost = this.outfitCost + Number(this.outfitCreaterList[i]['price']);
            this.outfitCostLabel = "Total cost of this outfit is: $" + this.outfitCost.toFixed(2);
        }
    }

    createrDeselected(args){
        let item = this.currentlyChosen[args.index];
        for(var i=0; i<this.currentlyChosen.length; i++){
            if(this.currentlyChosen[i]==item){
                if(this.currentlyChosen.length==0){
                    this.outfitCost = 0;
                }else{
                    this.outfitCost = this.outfitCost - Number(this.currentlyChosen[i]['price']);
                }                
                this.outfitCostLabel = "Total cost of this outfit is: $" + this.outfitCost.toFixed(2);
                this.currentlyChosen.splice(i,1);
            }
        }
    }

    saveOutfit(args){
        if(this.currentlyChosen.length>0){
            let ids = [];
            let createdOutfit = [];
            for(let i =0;i<this.currentlyChosen.length;i++){
                ids.push(this.currentlyChosen[i]['_id']);
                createdOutfit.push(this.currentlyChosen[i]);
            }
            console.log(ids)
            let input = { "items": ids }
            let newID = "";
            this.itemService.addOutfit(input).subscribe((res) =>{
                newID = res['outfitID'];
            });
            this.outfits.push({'items': createdOutfit})
            this.currentlyChosen=[];
            let vibrator = new Vibrate();
            vibrator.vibrate(50);

            console.log(newID);
        }
    }

    updateOutfit(args){
        let input = this.currentlyChosen;
        this.itemService.updateOutfit(input);
    }

    outfitCategorySelected(args){
        let index = args.index;
        let newcategory = this.categories[index].toLowerCase();
        this.outfitCreaterList = [];
        if(this.filterBySaved==true){
            if(newcategory!="any"){
                for(let i=0;i<this.userSaved.length;i++){
                    if(this.userSaved[i].category==newcategory){
                        this.outfitCreaterList.push(this.userSaved[i]);
                    }
                }
            }else{
                this.outfitCreaterList=this.userSaved;
            }
        }else{
            if(newcategory!="any"){
                for(let i=0;i<this.userLikes.length;i++){
                    if(this.userLikes[i].category==newcategory){
                        this.outfitCreaterList.push(this.userLikes[i]);
                    }
                }
            }else{
                this.outfitCreaterList=this.userLikes;
            }
        }

    }

    outfitCategoryDeselected(args){
        let index = args.index;
        if(this.filterBySaved==true){
            this.outfitCreaterList = this.userSaved;
        }else{
            this.outfitCreaterList = this.userLikes;
        }
    }

    menuLoaded(args){
        this.sideBarMenu = args.object as GridLayout;
        this.sideBarMenu.translateX = this.sideBarMenu.originX + 200;
        this.page = args.object.page;
        this.searchBar = <SearchBar>this.page.getViewById('searchBar')
    }

    categoryListLoaded(args){
        this.categoryList = args.object as RadListView;
        this.categoryList.translateX
    }

    indexChanged(args){
        this.currIndex = args.newIndex;
        
    }

    openSearch(args){
        if(this.currIndex==0){
            let opening = new Animation([
                {
                    translate: { x: this.sideBarMenu.originX, y: this.sideBarMenu.originY },
                    duration: 300,
                    target: this.sideBarMenu,
                    delay: 0,
                }
            ]);
            let closing = new Animation([
                {
                    translate: { x: this.sideBarMenu.originX+200, y: this.sideBarMenu.originY },
                    duration: 300,
                    target: this.sideBarMenu,
                    delay: 0,
                }
            ]);
            if(this.sideMenuView==0){
                opening.play();
                this.sideMenuView = 1;
            }else{
                this.searchBar.dismissSoftInput();
                closing.play();
                this.sideMenuView = 0;
            }
        }else if(this.currIndex==2){
            let opening = new Animation([
                {
                    translate: { x: this.profileSearchMenu.originX, y: this.profileSearchMenu.originY },
                    duration: 300,
                    target: this.profileSearchMenu,
                    delay: 0,
                }
            ]);
            let closing = new Animation([
                {
                    translate: { x: this.profileSearchMenu.originX, y: this.profileSearchMenu.originY+this.windowHeight},
                    duration: 300,
                    target: this.profileSearchMenu,
                    delay: 0,
                }
            ]);
            if(this.profileSearchMenuOn==0){
                opening.play();
                this.profileSearchMenuOn = 1;
            }else{
                this.profileSearchBar.dismissSoftInput();
                closing.play();
                this.profileSearchMenuOn = 0;
            }
        }

    }

    showCategories(){
        if(this.categoryVisible==false){
            this.categoryVisible=true;
        }else{
            this.categoryVisible=false;
        }
    }

    fashionItemInit(index){
        let vibrator = new Vibrate();
        let thisItem = this.itemsShown.getItem(index);
        // swiped to dislike item:
        if(this.itemsLiked[index]) {
            this.itemService.processAction("reset", "itemsShown", index);
        } else { // send LIKE
            this.itemService.processAction("like", "itemsShown", index);    
            vibrator.vibrate(50);
        } 
        
    }

    fashionItemBorder(args: EventData){
        const view = args.object as View;
        if (isIOS) {
            const iosUIView = view.ios as UIView;
            iosUIView.layer.shadowColor = UIColor.blackColor.CGColor;
            //iosUIView.layer.shadowOpacity = .5;
            //iosUIView.layer.shadowRadius = 20;
            //iosUIView.layer.shadowOffset = CGSizeMake(10, 10);
        }
    }

    shareLoaded(args){
        this.shareOn = 0;
        this.shareGrid = args.object;
        this.shareGrid.translateX = this.shareGrid.originX - this.windowWidth;        
    }

    shareLoaded2(args){
        this.shareOn2 = 0;
        this.shareGrid2 = args.object;
        this.shareGrid2.translateX = this.shareGrid2.originX - this.windowWidth;        
    }

    shareLoaded3(args){
        this.shareOn3 = 0;
        this.shareGrid3 = args.object;
        this.shareGrid3.translateX = this.shareGrid3.originX - this.windowWidth;        
    }

    onShare(){
        console.log(this.currIndex)
        if(this.currIndex==0){
            this.onShare1();
        }else if(this.currIndex==1){
            this.onShare2();
        }else if(this.currIndex==2){
            this.onShare3();
        }
    }

    onShare1(){
        let closing = new Animation([
            {
                translate: { x: this.shareGrid.originX - this.windowWidth, y:this.shareGrid.originY },
                scale: { x: .5, y: .5},
                duration: 1000,
                target: this.shareGrid,
                delay: 0,
            }
        ]);
        let opening = new Animation([
            {
                translate: { x: this.shareGrid.originX, y: this.shareGrid.originY},
                scale: { x: 1, y: 1},
                duration: 300,
                target: this.shareGrid,
                delay: 0,
            }
        ]);
        if(this.shareOn==0){
            opening.play();
            this.shareOn = 1;
        }else{
            closing.play();
            this.shareOn = 0;
        }
    }

    onShare2(){
        let closing = new Animation([
            {
                translate: { x: this.shareGrid2.originX - this.windowWidth, y:this.shareGrid2.originY },
                scale: { x: .5, y: .5},
                duration: 1000,
                target: this.shareGrid2,
                delay: 0,
            }
        ]);
        let opening = new Animation([
            {
                translate: { x: this.shareGrid2.originX, y: this.shareGrid2.originY},
                scale: { x: 1, y: 1},
                duration: 300,
                target: this.shareGrid2,
                delay: 0,
            }
        ]);
        if(this.shareOn2==0){
            opening.play();
            this.shareOn2 = 1;
        }else{
            closing.play();
            this.shareOn2 = 0;
        }
    }

    onShare3(){
        let closing = new Animation([
            {
                translate: { x: this.shareGrid3.originX - this.windowWidth, y:this.shareGrid3.originY },
                scale: { x: .5, y: .5},
                duration: 1000,
                target: this.shareGrid3,
                delay: 0,
            }
        ]);
        let opening = new Animation([
            {
                translate: { x: this.shareGrid3.originX, y: this.shareGrid3.originY},
                scale: { x: 1, y: 1},
                duration: 300,
                target: this.shareGrid3,
                delay: 0,
            }
        ]);
        if(this.shareOn3==0){
            opening.play();
            this.shareOn3 = 1;
        }else{
            closing.play();
            this.shareOn3 = 0;
        }
    }

    copyShareText(){
        var clipboard = require("nativescript-clipboard");
        clipboard.setText("Fashion iOS - Find Your Fashion: App Store (iOS): https://itunes.apple.com/us/app/nativescript-playground/id1263543946?mt=8&ls=1 After installing, send a text to 856-316-9329 for the Fashion iOS QR Code").then(function() {
            alert('Message Copied, Share it with whomever you please.')
        })
    }

    goToFriendsProfile(source, id){
        this.router.navigate(['user', id], 
            {
                relativeTo: this.route,
                queryParams: { 'source': source, 'id': id },
                transition: {
                    name: 'slideLeft',
                    duration: 500
                }
            });
    }

    friendAction(id, source, index){
        let found = 0; 
        for(var i = 0; i<this.itemService.friends.length;i++){
            if(id==this.itemService.friends[i]['_id']){
                found=1;
                break;
            }
        }
        if(found==0){
            this.itemService.sendFriendAction(id, 'add')
        }else{
            this.isFriend[index] = false;
        }
    }

    SwapFriendsView(switchView){
        if(switchView=='friends'){
            this.friendsListView = true;
        }else if(switchView=='requests'){
            this.friendsListView = false;
        }
    }

    //User Grid Functions
    userGridInitialized(args){
        this.profileSearchMenuOn = 0;
        this.profileSearchBar = <SearchBar>this.page.getViewById('searchBarUser');
        this.profileSearchMenu = args.object;
        this.profileSearchMenu.translateY = this.profileSearchMenu.originY + this.windowHeight;
    }

    profileUserScrollStartedEvent(args){
        this.profileSearchBar.dismissSoftInput();
    }

    closeUser(){
        this.profileSearchBar.dismissSoftInput();
        let closing = new Animation([
            {
                translate: { x: this.profileSearchMenu.originX, y:this.profileSearchMenu.originY + this.windowHeight },
                scale: { x: .5, y: .5},
                duration: 1000,
                target: this.profileSearchMenu,
                delay: 0,
            }
        ]);
        if(this.profileSearchMenuOn==1){
            closing.play();
            this.profileSearchMenuOn = 0;
        }
    }

    openUser(){
        let opening = new Animation([
            {
                translate: { x: this.profileSearchMenu.originX, y: this.profileSearchMenu.originY},
                scale: { x: 1, y: 1},
                duration: 300,
                target: this.profileSearchMenu,
                delay: 0,
            }
        ]);
        if(this.profileSearchMenuOn==0){
            opening.play();
            this.profileSearchMenuOn = 1;
        }
    }

    onUserClear(args){
        this.profileSearchUsers = this.itemService.allUsers;
    }

    onUserTextChanged(args){
        var searchText = args.object.text;
        if(searchText && searchText.length>0){
            this.profileSearchUsers = [];
            for(var i=0; i<this.itemService.allUsers.length;i++){
                if(this.itemService.allUsers[i]['username'].toLowerCase().includes(searchText.toLowerCase())){
                    this.profileSearchUsers.push(this.itemService.allUsers[i]);
                }else if(this.itemService.allUsers[i]['first_name'].toLowerCase().includes(searchText.toLowerCase())){
                    this.profileSearchUsers.push(this.itemService.allUsers[i]);
                }else if(this.itemService.allUsers[i]['last_name'].toLowerCase().includes(searchText.toLowerCase())){
                    this.profileSearchUsers.push(this.itemService.allUsers[i]);
                }
            }
        }
    }

    //Friends Grid Functions
    friendGridInitialized(args){
        this.profileFriendsGridOn = 0;
        this.profileFriendsSearchBar = this.page.getViewById('searchBarFriends');
        this.profileFriendsGrid = <GridLayout>this.page.getViewById('profileFriends');

        this.profileFriendsGrid.translateY = this.profileFriendsGrid.originY + this.windowHeight;
        this.profileFriendsGrid.scaleX = this.profileFriendsGrid.scaleX * .5;
        this.profileFriendsGrid.scaleY = this.profileFriendsGrid.scaleY * .5;

    }

    friendsScrollStartedEvent(args){
        this.profileFriendsSearchBar.dismissSoftInput();
    }

    closeFriend(){
        this.profileFriendsSearchBar.dismissSoftInput();
        let closing = new Animation([
            {
                translate: { x: this.profileFriendsGrid.originX, y:this.profileFriendsGrid.originY + this.windowHeight },
                scale: { x: .5, y: .5},
                duration: 1000,
                target: this.profileFriendsGrid,
                delay: 0,
            }
        ]);
        if(this.profileFriendsGridOn==1){
            closing.play();
            this.profileFriendsGridOn = 0;
        }
    }

    openFriend(){
        let opening = new Animation([
            {
                translate: { x: this.profileFriendsGrid.originX, y: this.profileFriendsGrid.originY},
                scale: { x: 1, y: 1},
                duration: 300,
                target: this.profileFriendsGrid,
                delay: 0,
            }
        ]);
        if(this.profileFriendsGridOn==0){
            opening.play();
            this.profileFriendsGridOn = 1;
        }
    }

    onFriendClear(){
        this.profileFriendsSearchUsers = this.profileFriendsList;  
    }

    onFriendTextChanged(args){
        var searchText = args.object.text;
        if(searchText && searchText.length>0){
            this.profileFriendsSearchUsers = [];
            for(var i=0; i<this.profileFriendsList.length;i++){
                if(this.profileFriendsList[i]['username'].includes(searchText)){
                    this.profileFriendsSearchUsers.push(this.profileFriendsList[i]);
                }else if(this.profileFriendsList[i]['first_name'].includes(searchText)){
                    this.profileFriendsSearchUsers.push(this.profileFriendsList[i]);
                }else if(this.profileFriendsList[i]['last_name'].includes(searchText)){
                    this.profileFriendsSearchUsers.push(this.profileFriendsList[i]);
                }
            }
        }
    }

    //Likes Grid Functions
    likesGridInitialized(args){
        this.profileLikesSearchMenuOn = 0;
        this.profileLikesSearchBar = <SearchBar>this.page.getViewById('searchBarLikesProfile');
        this.profileLikesSearchText = this.profileLikesSearchBar.text;
        this.profileLikesSearchMenu = args.object;
        this.profileLikesSearchMenu.translateY = this.profileLikesSearchMenu.originY + this.windowHeight;
    }

    profileLikesScrollStartedEvent(args){
        this.profileLikesSearchBar.dismissSoftInput();
    }

    closeLikes(){
        this.profileLikesSearchBar.dismissSoftInput();
        let closing = new Animation([
            {
                translate: { x: this.profileLikesSearchMenu.originX, y:this.profileLikesSearchMenu.originY + this.windowHeight },
                scale: { x: .5, y: .5},
                duration: 1000,
                target: this.profileLikesSearchMenu,
                delay: 0,
            }
        ]);
        if(this.profileLikesSearchMenuOn==1){
            closing.play();
            this.profileLikesSearchMenuOn = 0;
        }
    }

    openLikes(){
        let opening = new Animation([
            {
                translate: { x: this.profileLikesSearchMenu.originX, y: this.profileLikesSearchMenu.originY},
                scale: { x: 1, y: 1},
                duration: 300,
                target: this.profileLikesSearchMenu,
                delay: 0,
            }
        ]);
        if(this.profileLikesSearchMenuOn==0){
            opening.play();
            this.profileLikesSearchMenuOn = 1;
        }
    }

    onLikesClear(args){
        this.searchLikes = this.userLikes;
    }

    onLikeTextChanged(args){
        this.profileLikesSearchText = args.object.text;
        this.likesSearchRouter();
    }

    likesCategoryChange(args){
        let likesListPicker = <ListPicker>this.page.getViewById('likeCategoryPicker');
        this.profileLikesCategoryIndex = likesListPicker.selectedIndex;
        this.likesSearchRouter();
    }

    likesSearchRouter() {
        this.searchLikes = [];
        if (this.profileLikesSearchText == null) {
            if(this.profileLikesCategoryIndex == 0) {
                for(var i=0; i<this.userLikes.length;i++){
                    this.searchLikes.push(this.userLikes[i]);
                }      
            } else {
                let itemCategory = this.categories[this.profileLikesCategoryIndex].toLowerCase();
                for(var i=0; i<this.userLikes.length;i++){
                    if(this.userLikes[i]['category']==itemCategory){
                        this.searchLikes.push(this.userLikes[i]);
                    }
                }   
            }
        } else {
            if(this.profileLikesCategoryIndex == 0) {
                let lowerSearchText = this.profileLikesSearchText.toLowerCase();
                for(var i=0; i<this.userLikes.length;i++){
                    let itemName = this.userLikes[i]['name'].toLowerCase();
                    if(itemName.search(lowerSearchText)!=-1){
                        this.searchLikes.push(this.userLikes[i]);
                    }
                }         
            } else {
                let lowerSearchText = this.profileLikesSearchText.toLowerCase();
                for(var i=0; i<this.userLikes.length;i++){
                    let itemName = this.userLikes[i]['name'].toLowerCase();
                    let itemCategory = this.categories[this.profileLikesCategoryIndex].toLowerCase()
                    if(itemName.search(lowerSearchText)!=-1 && this.userLikes[i]['category']==itemCategory){
                        this.searchLikes.push(this.userLikes[i]);
                    }
                }             
            }
        }
    }
    
    //Saved Grid Functions
    savedGridInitialized(args){
        this.profileSavedGridOn = 0;
        this.profileSavedSearchBar = this.page.getViewById('searchBarSavedProfile');
        this.profileSavedGrid = <GridLayout>this.page.getViewById('profileSavedSearch');

        this.profileSavedGrid.translateY = this.profileSavedGrid.originY + this.windowHeight;
        this.profileSavedGrid.scaleX = this.profileSavedGrid.scaleX * .5;
        this.profileSavedGrid.scaleY = this.profileSavedGrid.scaleY * .5;

    }

    savedScrollStartedEvent(args){
        this.profileSavedSearchBar.dismissSoftInput();
    }

    closeSaved(){
        this.profileSavedSearchBar.dismissSoftInput();
        let closing = new Animation([
            {
                translate: { x: this.profileSavedGrid.originX, y:this.profileSavedGrid.originY + this.windowHeight },
                scale: { x: .5, y: .5},
                duration: 1000,
                target: this.profileSavedGrid,
                delay: 0,
            }
        ]);
        if(this.profileSavedGridOn==1){
            closing.play();
            this.profileSavedGridOn = 0;
        }
    }

    openSaved(){
        let opening = new Animation([
            {
                translate: { x: this.profileSavedGrid.originX, y: this.profileSavedGrid.originY},
                scale: { x: 1, y: 1},
                duration: 300,
                target: this.profileSavedGrid,
                delay: 0,
            }
        ]);
        if(this.profileSavedGridOn==0){
            opening.play();
            this.profileSavedGridOn = 1;
        }
    }

    onSavedClear(){
        this.searchSaved = this.profileSavedList;  
    }

    onSavedTextChanged(args){
        this.profileSavedSearchText = args.object.text;
        this.savedSearchRouter();        

    }

    savedCategoryChange(args){
        let savedListPicker = <ListPicker>this.page.getViewById('savedCategoryPicker');
        this.profileSavedCategoryIndex = savedListPicker.selectedIndex;
        this.savedSearchRouter();
    }

    savedSearchRouter() {
        this.searchSaved = [];
        if (this.profileSavedSearchText == null) {
            if(this.profileSavedCategoryIndex == 0) {
                for(var i=0; i<this.userSaved.length;i++){
                    this.searchSaved.push(this.userSaved[i]);
                }      
            } else {
                let itemCategory = this.categories[this.profileSavedCategoryIndex].toLowerCase();
                for(var i=0; i<this.userSaved.length;i++){
                    if(this.userSaved[i]['category']==itemCategory){
                        this.searchSaved.push(this.userSaved[i]);
                    }
                }   
            }
        } else {
            if(this.profileSavedCategoryIndex == 0) {
                let lowerSearchText = this.profileSavedSearchText.toLowerCase();
                for(var i=0; i<this.userSaved.length;i++){
                    let itemName = this.userSaved[i]['name'].toLowerCase();
                    if(itemName.search(lowerSearchText)!=-1){
                        this.searchSaved.push(this.userSaved[i]);
                    }
                }         
            } else {
                let lowerSearchText = this.profileSavedSearchText.toLowerCase();
                for(var i=0; i<this.userSaved.length;i++){
                    let itemName = this.userSaved[i]['name'].toLowerCase();
                    let itemCategory = this.categories[this.profileSavedCategoryIndex].toLowerCase()
                    if(itemName.search(lowerSearchText)!=-1 && this.userSaved[i]['category']==itemCategory){
                        this.searchSaved.push(this.userSaved[i]);
                    }
                }             
            }
        }
    }
}