import { Item } from "./item";
import { ItemService } from "./item.service";
import { Component, OnInit } from "@angular/core";
import { SearchBar } from "tns-core-modules/ui/search-bar";
import { Page } from "tns-core-modules/ui/page";
import { registerElement } from 'nativescript-angular/element-registry';
import { RadListView } from "nativescript-ui-listview";

import { Observable } from 'tns-core-modules/data/observable';
import { ObservableArray } from 'tns-core-modules/data/observable-array';
import { SelectedIndexChangedEventData, ValueList, DropDown } from "nativescript-drop-down";
import { EventData, fromObject } from "tns-core-modules/data/observable";
import { ListPicker } from "tns-core-modules/ui/list-picker";
import { View } from "tns-core-modules/ui/core/view";

@Component({
    selector: "ns-items",
    moduleId: module.id,
    templateUrl: "./items.component.html"
})
export class ItemsComponent implements OnInit {
    items: ObservableArray<Item>;
    itemsShown = new ObservableArray<Item>();
    categories = [];
    public selectedIndex = 0;
    searchBar: SearchBar;
    listPicker: ListPicker;
    searchText: string;
    public currentlyLoaded=0;
    loadMore = false;

    constructor(private itemService: ItemService) {}

    ngOnInit(): void {
        this.itemService.getItems().subscribe((res) => {
            this.items = JSON.parse(res);
            this.itemService.items = this.items;
            var newitems = this.items.slice(0,20)
            for(let i=0; i<newitems.length; i++){
                this.itemsShown.push(newitems[i]);
            }
            this.currentlyLoaded = this.itemsShown.length;
        });

        this.itemService.getCategories().subscribe((res) =>{
            let cat = JSON.parse(res);
            for(let i=0; i < cat.length; i++) {
                // capitalize first letter of category
                cat[i] = cat[i].charAt(0).toUpperCase() + cat[i].slice(1);
            }
            // add 'Any' category to search all items
            cat.unshift("Any");
            this.categories = cat;
        });

        this.searchText = "";
        
    }

    onSubmit(args) {
        this.refreshSearch();
    }

    onTextChanged(args) {
        this.searchBar = args.object as SearchBar;
        if(this.searchBar.text !=null){
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

    scrollStartedEvent(args) {
        this.searchBar.dismissSoftInput();
    }

    searchRouter() {
        let itemsRequest;

        if (this.searchText == "") {
            if(this.selectedIndex==0) {
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
            this.itemService.items = this.items;
        });
    }

    onSearch(){
        if(this.searchBar.visibility=="collapse"){
            this.searchBar.visibility = "visible";
            this.listPicker.visibility = "visible";
        }else{
            this.searchBar.visibility = "collapse";
            this.listPicker.visibility = "collapse";
        }
    }
    
    public onLoadMoreItemsRequested(args) {
        if(this.currentlyLoaded >= this.items.length){
            this.itemService.loadMore().subscribe((res) => {
                console.log("populating more: " + this.items.length);

                this.items = JSON.parse(res);
                this.itemService.items = this.items;
            });
            this.currentlyLoaded+=1;
        }
        
        var newitems = this.items.slice(this.currentlyLoaded,this.currentlyLoaded+20);
        for(let i=0; i<newitems.length; i++){
            this.itemsShown.push(newitems[i]);
        }
        this.currentlyLoaded = this.itemsShown.length+20;
        args.returnValue = false;
    }
}