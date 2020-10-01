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


@Component({
    selector: "ns-outfit",
    templateUrl: "./friends.html",
})
export class friendsComponent implements OnInit {

    constructor(
        private itemService: ItemService,
        private route: ActivatedRoute,
        private page: Page,
        private http: HttpClient,
    ) { }

    users = [];
    usersShown = [];
    usersCurrentlyChosen = [];
    searchBar: SearchBar;
    searchView = 0;
    list: RadListView;
    searchPhrase="";
    grid: GridLayout;

    ngOnInit(): void {

    }

    searchStart(args){
        this.searchBar = <SearchBar>args.object;
        this.searchBar.text = this.searchPhrase;
        this.searchBar.translateY=this.searchBar.originY - 60
    
    }

    clearedText(args){
        this.searchBar.dismissSoftInput();
    }

    onTextChanged(args){
        for(var i=0;i<this.users.length;i++){
            if(this.users[i].contains(args.object.text)){
                this.usersCurrentlyChosen.push(this.users[i]);
            }
        }
    }
    onSubmit(args){

    }

    listInitialized(args){
        this.list = args.object as RadListView;
    }
    gridInitialized(args){
        this.grid = args.object as GridLayout;
        
    }

    onSearch(args){
        let opening = new Animation([
            {
                translate: { x: this.searchBar.originX, y:20 },
                duration: 500,
                target: this.searchBar,
                delay: 0,
            }
        ]);
        let closing = new Animation([
            {
                translate: { x: this.searchBar.originX, y:-60 },
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
}