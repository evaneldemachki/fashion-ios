import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Item } from "./item"

import { Observable } from 'tns-core-modules/data/observable';
import { ObservableArray } from 'tns-core-modules/data/observable-array';

@Injectable()
export class ItemService {
    // dev mode
    private serverUrl = "https://fashionapi.herokuapp.com/api/";
    
    //items: Item[];
    items = new ObservableArray();
    search = new ObservableArray();
    lastSearch = "";
    limit=500;

    constructor(private http: HttpClient) { }

    getItems() {
        var basequery = "search?category=dress";
        this.lastSearch = basequery;
        var limitQuery = "&limit="+this.limit;

        var query = basequery + limitQuery
        return this.http.get(
            this.serverUrl + query, {
                responseType: "text"
            });
    }

    loadMore(){
        var basequery = this.lastSearch;
        var limitQuery = "&limit="+this.limit+100;
        var query = basequery + limitQuery;
        return this.http.get(
            this.serverUrl + query, {
                responseType: "text"
            });
    }

    getItem(i) {
        console.log(i)
        return this.items[i];
    }

    getCategories() {
        return this.http.get(
            this.serverUrl + "categories", {
                responseType: "text"
            });
    }

    getFromCategory(category){
        var query = "search?category="+category+"&limit="+this.limit;
        this.lastSearch = query
        return this.http.get(
            this.serverUrl + query, {
                responseType: "text"
            });
    }

    getFromNameAndCategory(name, category){
        var basequery = "search?category="+category+"&"+"name="+name+"&limit="+this.limit
        this.lastSearch = basequery;

        this.lastSearch = basequery;
        return this.http.get(
            this.serverUrl + basequery, {
                responseType: "text"
            });
    }

    getFromName(name){
        var basequery = "search?name="+name+"&limit="+this.limit;
        this.lastSearch = basequery;
        return this.http.get(
            this.serverUrl + basequery, {
                responseType: "text"
            });
    }

}
