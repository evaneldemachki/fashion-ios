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
    public itemsLiked = [];
    public itemsDisliked = [];

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

    processAction(action, index) {
        let thisItem = this.itemsShown.getItem(index);
        // swiped to dislike item:
        if(action == "like") {
            // send RESET if already disliked
            if(this.itemsDisliked[index]) {
                this.sendResetRequest(index);
            } else { // send DISLIKE
                this.sendDislikeRequest(index);       
            } 
        } // swipe to like item
        else if (action == "dislike") {
            // send RESET if already liked
            if(this.itemsLiked[index]) {
                this.sendResetRequest(index);
            } else { // send LIKE
                this.sendLikeRequest(index);       
            } 
        }
    }

    //save and unsave action
    sendLikeRequest(index) {
        this.itemsLiked[index] = true;
        this.itemsDisliked[index] = false;

        let item = this.itemsShown.getItem(index)
        for(let i=0; i < this.userDislikes.length; i++) {
            if(this.userDislikes["_id"] == item._id) {
                this.userDislikes.splice(i, 0);
                break;
            }
        }

        this.userLikes.push(this.itemsShown[index]);

        let input = { item, "action": "like" }

        this.getPostResponse(input).subscribe((res) =>{
        })
    }

    sendDislikeRequest(index) {
        this.itemsLiked[index] = false;
        this.itemsDisliked[index] = true;

        let item = this.itemsShown.getItem(index)
        for(let i=0; i < this.userLikes.length; i++) {
            if(this.userLikes["_id"] == item._id) {
                this.userLikes.splice(i, 0);
                break;
            }
        }

        this.userLikes.push(this.itemsShown[index]);

        let input = { item, "action": "dislike" };

        this.getPostResponse(input).subscribe(res => {
        })
    }

    sendResetRequest(index) {
        this.itemsLiked[index] = false;
        this.itemsDisliked[index] = false;

        let item = this.itemsShown.getItem(index)
        for(let i=0; i < this.userLikes.length; i++) {
            if(this.userLikes["_id"] == item._id) {
                this.userLikes.splice(i, 0);
                break;
            }
        }

        this.userLikes.push(this.itemsShown[index]);

        let input = { item, "action": "dislike" };

        this.getPostResponse(input).subscribe(res => {
        })
    }

}
