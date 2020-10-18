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
import { SearchBar } from "tns-core-modules/ui/search-bar";
import { Animation } from "tns-core-modules/ui/animation";
import { RadListView, ListViewEventData, SwipeActionsEventData } from "nativescript-ui-listview";
import { GestureTypes, GestureEventData } from "tns-core-modules/ui/gestures";
import { GridLayout, ItemSpec } from "tns-core-modules/ui/layouts/grid-layout";
import { Label } from "tns-core-modules/ui/label";
import { screen } from "tns-core-modules/platform/platform";
import { ListPicker } from "tns-core-modules/ui/list-picker";
import { RouterExtensions } from 'nativescript-angular/router';


@Component({
    selector: "ns-user",
    templateUrl: "./user.html",
})
export class userComponent implements OnInit {
    id;
    source;
    user;
    username;
    fullname;
    index;
    userLikes=[];
    userOutfits=[];
    userFriends=[];
    userIcon;
    categories = [];

    public profileLikesSearchMenu: GridLayout;
    public profileLikesSearchBar: SearchBar;
    public profileLikesSearchMenuOn = 0;
    public searchLikes = [];

    public profileFriendsSearchBar: SearchBar;
    public profileFriendsGrid: GridLayout;
    public profileFriendsGridOn = 0;
    public profileFriendsSearchUsers = [];
    public profileFriendsList = [];
    public profileLikesSearchText = "";
    public profileLikesCategoryIndex = 0;

    public windowHeight = screen.mainScreen.heightPixels;
    public windowWidth = screen.mainScreen.widthPixels;

    constructor(
        private itemService: ItemService,
        private route: ActivatedRoute,
        protected router: RouterExtensions,
        private page: Page,
        private http: HttpClient,
    ) { }

    ngOnInit(): void {
        const i = this.route.snapshot.params.id;
        this.index = i;

        this.route.queryParams.subscribe(params => {
            this.source = params.source;
            this.id = params.id;
        });
        this.itemService.getFriendData(this.id).subscribe(res => {
            this.userIcon = res['img']
            this.fullname = res['first_name'] + ' ' + res['last_name']
            this.username = '@' + res['username']
            this.userOutfits = res['outfits']
            this.userLikes = res['likes']
            this.userFriends = res['friends']
            this.profileFriendsSearchUsers = this.userFriends;
            this.searchLikes = this.userLikes;
        });

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
    }

    goToFriendsProfile(source, id){
        this.router.navigate(['user', id], 
            {
                relativeTo: this.route.parent,
                queryParams: { 'source': source, 'id': id },
                transition: {
                    name: 'slideLeft',
                    duration: 500
                }
            });
    }

    start(args){
        this.page = args.object.page;
    }

    //Likes Grid Functions
    likesGridInitialized(args){
        this.profileLikesSearchMenuOn = 0;
        this.profileLikesSearchBar = <SearchBar>this.page.getViewById('searchBarLikesProfile');
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

    //Friends Grid Functions
    friendGridInitialized(args){
        this.profileLikesSearchMenuOn = 0;
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


}