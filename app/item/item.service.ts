import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Item } from "./item"

import { Observable } from 'tns-core-modules/data/observable';
import { ObservableArray } from 'tns-core-modules/data/observable-array';

@Injectable()
export class ItemService {
    // dev mode
    private serverUrl = "https://fashionapi.herokuapp.com/api/";
    
    //items: Item[];
    public items = new ObservableArray();
    public search = new ObservableArray();
    public lastSearch = "";
    public limit = 500;
    public token: String;
    public userLikes = new ObservableArray();
    public userDislikes = new ObservableArray();
    public itemsShown = new ObservableArray<Item>();

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
        return this.items[i];
    }

    getCategories() {
        return this.http.get(
            this.serverUrl + "categories", {
                responseType: "text"
            });
    }

    getOne(itemID) {
        var query = "grab?item=" + itemID;
        return this.http.get(
            this.serverUrl + query, {
                responseType: "json"
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

    getPostResponse(input) {
        let endpoint = "http://fashionapi.herokuapp.com/user/action";
        let header = {"Authorization": "Bearer " + this.token}
        return this.http.post(endpoint, input, 
          {headers: header, responseType: "text", observe: "response"});
    }

    setToken(data){
        this.token = data;
    }

    getUserData(input) {
        let endpoint = "http://fashionapi.herokuapp.com/user/data/";
        let header = {"Authorization": "Bearer " + this.token}
        return this.http.post(endpoint, input, 
          {headers: header, responseType: "json", observe: "body"});
    }

}
