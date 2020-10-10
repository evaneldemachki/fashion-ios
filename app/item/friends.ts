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


@Component({
    selector: "ns-outfit",
    templateUrl: "./friends.html",
})
export class friendsComponent implements OnInit {
    searchUsers;
    index;
    friendsList = []
    searchBar: SearchBar;

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
    }
    
}