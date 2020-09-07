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
    searchBar: SearchBar;
    listPicker: ListPicker;
    searchText: string;

    public categories = [];
    public loadMore = false;
    public currentlyLoaded = 0;
    public selectedIndex = 0;

    constructor(private itemService: ItemService) {}

    ngOnInit(): void {
        this.itemService.getItems().subscribe((res) => {
            this.items = JSON.parse(res);
            this.itemService.items = this.items;
            this.addItemsToView();
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

    addItemsToView() {
        let newitems = this.items.splice(this.currentlyLoaded, this.currentlyLoaded + 20)
        for(let i = 0; i < 20; i++) {
            this.itemsShown.push(newitems[i]);
        }
        this.currentlyLoaded = this.itemsShown.length;
    }

    refreshView() {
        this.itemsShown = this.items;
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
            console.log(this.items[this.items.length - 1].name)
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
    
    onSearch() {
        if(this.searchBar.visibility=="collapse") {
            this.searchBar.visibility = "visible";
            this.listPicker.visibility = "visible";
        } else {
            this.searchBar.visibility = "collapse";
            this.listPicker.visibility = "collapse";
        }

    }
    
    onLoadMoreItemsRequested(args) {
        console.log("fetching more items: ");
        if(this.currentlyLoaded >= this.items.length){
            this.itemService.loadMore().subscribe((res) => {
                console.log("populating more: " + this.items.length);

                this.items = JSON.parse(res);
                this.itemService.items = this.items;
            });
<<<<<<< HEAD
            this.currentlyLoaded += 1;
=======
            this.currentlyLoaded+=1;
>>>>>>> 4b3f1eeda55b0e269afc866189d33716be67391d
        }
        
        this.addItemsToView();
        args.returnValue = false;
    }
}