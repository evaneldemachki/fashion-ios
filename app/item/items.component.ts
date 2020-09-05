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

@Component({
    selector: "ns-items",
    moduleId: module.id,
    templateUrl: "./items.component.html"
})
export class ItemsComponent implements OnInit {
    //items: Item[];
    items: ObservableArray<Item>;
    categories = [];
    public selectedIndex = 0;
    searchingBar;

    constructor(private itemService: ItemService) {}

    ngOnInit(): void {
        this.itemService.getItems().subscribe((res) => {
            this.items = JSON.parse(res);
            this.itemService.items = this.items;
        });

        this.itemService.getCategories().subscribe((res) =>{
            var str = res.slice(1,res.length-1);
            var words = str.split(',')
            for(var i=0; i<words.length;i++){
                words[i] = words[i].slice(1,words[i].length-1)
                words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
            }
            words.unshift("Any");
            this.categories = words;
        });
        
    }

    onSubmit(args) {
        const searchBar = args.object as SearchBar;
        var searchText = searchBar.text.toLowerCase();
        this.refreshSearch(searchText);

    }

    onTextChanged(args) {
        this.searchingBar = args.object as SearchBar;
    }

    onClear(args) {
        while(this.items.length > 0) {
            this.items.pop();
        }
        this.itemService.getItems().subscribe((res) => {
            this.items = JSON.parse(res);
            this.itemService.items = this.items;
        });
    }

    categoryPicker(index) {
        this.selectedIndex = index;
    }

    scrollStartedEvent(args) {
        this.searchingBar.dismissSoftInput();
    }


    refreshSearch(searchText){
        console.log("Searching for " + searchText + " in "+ this.categories[this.selectedIndex]);
        if(this.selectedIndex==0){
            while(this.items.length > 0) {
                this.items.pop();
            }

            this.itemService.getFromName(searchText).subscribe((res) => {
                this.items = JSON.parse(res);
                this.itemService.items = this.items;
            });
        }
        else{
            while(this.items.length > 0) {
                this.items.pop();
            }
            this.itemService.getFromNameAndCategory(searchText, this.categories[this.selectedIndex]).subscribe((res) => {
                this.items = JSON.parse(res);
                this.itemService.items = this.items;
            });
        }
    }
}