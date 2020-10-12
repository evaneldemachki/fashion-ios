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


@Component({
    selector: "ns-outfit",
    templateUrl: "./friends.html",
})
export class friendsComponent implements OnInit {
    searchUsers;
    index;
    friendsList = []
    searchBar: SearchBar;
    friendsGrid: GridLayout;
    closeFriendMenu: Label;
    public windowHeight = screen.mainScreen.heightPixels;
    public windowWidth = screen.mainScreen.widthPixels;
    
    friendUser;
    friendsIcon:Image;
    friendsName:String;
    friendsUsername:String;
    friendLikes = [];
    friendOutfits = [];
    friendsView = 0;
    

    constructor(
        private itemService: ItemService,
        private route: ActivatedRoute,
        private page: Page,
        private http: HttpClient,
    ) { }


    ngOnInit(): void {
        const i = this.route.snapshot.params.id;
        this.index = i;
        this.friendsList = this.itemService.friends;
        this.searchUsers = this.friendsList;
    }
    
    onSubmit(args){
        this.itemService.searchUsers(args.object.text).subscribe((res) => {
            this.searchUsers = JSON.parse(res);  
            this.itemService.search = this.searchUsers;
        });
    }

    onClear(){
        this.searchUsers = this.friendsList;  
    }

    onTextChanged(args){
        var searchText = args.object.text;
        if(searchText && searchText.length>0){
            this.searchUsers = [];
            for(var i=0; i<this.friendsList.length;i++){
                if(this.friendsList[i]['username'].includes(searchText)){
                    this.searchUsers.push(this.friendsList[i]);
                }else if(this.friendsList[i]['first_name'].includes(searchText)){
                    this.searchUsers.push(this.friendsList[i]);
                }else if(this.friendsList[i]['last_name'].includes(searchText)){
                    this.searchUsers.push(this.friendsList[i]);
                }
            }
        }
    }
    
    friendsScrollStartedEvent(args){
        this.searchBar.dismissSoftInput();
    }

    gridInitialized(args){
        this.page = args.object.page;
        this.searchBar = this.page.getViewById('searchBar');
        this.friendsGrid = <GridLayout>this.page.getViewById('friendsProfile');
        //this.closeFriendMenu = this.page.getViewById('closeFriendIcon');
        //this.closeFriendMenu.on(GestureTypes.tap, function (args) {
         //   this.closeFriend();
        //});
        this.friendsGrid.translateY = this.friendsGrid.originY + this.windowHeight;
        this.friendsGrid.scaleX = this.friendsGrid.scaleX * .5;
        this.friendsGrid.scaleY = this.friendsGrid.scaleY * .5;

    }

    loadFriend(index){
        this.friendUser = this.searchUsers[index];
        this.friendsIcon = this.friendUser.img;
        this.friendsName = this.friendUser['first_name'] + ' ' + this.friendUser['last_name'];
        this.friendsUsername = this.friendUser['username'];
        this.friendLikes = this.friendUser['likes'];
        this.friendOutfits = this.friendUser['outfits'];

    }

    closeFriend(){
        let closing = new Animation([
            {
                translate: { x: this.friendsGrid.originX, y:this.friendsGrid.originY + this.windowHeight },
                scale: { x: .5, y: .5},
                duration: 1000,
                target: this.friendsGrid,
                delay: 0,
            }
        ]);
        if(this.friendsView==1){
            closing.play();
            this.friendsView = 0;
        }
    }

    openFriend(index){
        this.loadFriend(index);
        let opening = new Animation([
            {
                translate: { x: this.friendsGrid.originX, y: this.friendsGrid.originY +100},
                scale: { x: 1, y: 1},
                duration: 1000,
                target: this.friendsGrid,
                delay: 0,
            }
        ]);
        if(this.friendsView==0){
            opening.play();
            this.friendsView = 1;
        }
    }
    
    
}