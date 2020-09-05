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

    constructor(private http: HttpClient) { }

    getItems() {
        return this.http.get(
            this.serverUrl + "search?category=dress", {
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
        return this.http.get(
            this.serverUrl + "search?category="+category, {
                responseType: "text"
            });
    }

    getFromNameAndCategory(name, category){
        return this.http.get(
            this.serverUrl + "search?category="+category+"&"+"name="+name, {
                responseType: "text"
            });
    }

    getFromName(name){
        return this.http.get(
            this.serverUrl + "search?name="+name, {
                responseType: "text"
            });
    }

}
