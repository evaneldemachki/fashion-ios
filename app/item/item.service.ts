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
    public userLikes = [];
    public itemsShown = new ObservableArray<Item>();
    public itemsLiked = [];
    public itemsDisliked = [];
    public itemsSaved = [];
    public userSaved = [];
    public wardrobe = [];

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
        let categories=category[0].toLowerCase();
        for(var i=1; i<category.length; i++){
            categories = categories+","+category[i].toLowerCase();
        }
        var query = "search?category="+categories+"&limit="+this.limit;
        console.log(query);
        console.log("Searching for <all> in category '"+categories+"'");
        this.lastSearch = query;
        return this.http.get(
            this.serverUrl + query, {
                responseType: "text"
            });
    }

    getFromNameAndCategory(name, category){
        let categories=category[0].toLowerCase();
        for(var i=1; i<category.length; i++){
            categories = categories+","+category[i].toLowerCase();
        }

        var basequery = "search?category="+categories+"&"+"name="+name+"&limit="+this.limit
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

    processAction(action, source, index) {
        console.log("GOT ACTION: " + action + ", " + source)
        if(action == "like") {
            if(source == "itemsShown") {
                this.itemsLiked[index] = true;
                this.itemsDisliked[index] = false;

                let thisItem = this.itemsShown.getItem(index);
                this.userLikes.push(thisItem);

                let itemID = thisItem["_id"];

                this.sendUserAction(itemID, action);
            } else if(source == "userLikes") {
                let thisItem = this.userLikes[index];
                this.userLikes.push(thisItem);

                let itemID = thisItem["_id"];

                let newIndex = null;
                for(let i = 0; i < this.itemsShown.length; i++) {
                    if(this.itemsShown.getItem(i)["_id"] == itemID) {
                        newIndex = i;
                        console.log("Found: " + itemID)
                    }
                }
                if(newIndex) {
                    this.itemsLiked[newIndex] = true;
                    this.itemsDisliked[newIndex] = false;                    
                }

                this.sendUserAction(itemID, action);
            }
        }
        else if (action == "dislike") {
            if(source == "itemsShown") {
                let itemID = this.itemsShown.getItem(index)["_id"];

                this.itemsLiked[index] = false;
                this.itemsDisliked[index] = true;

                for(let i = 0; i < this.userLikes.length; i++) {
                    if(this.userLikes[i]["_id"] == itemID) {
                        this.userLikes.splice(i, 1);
                        break;
                    }
                }
    
                this.sendUserAction(itemID, action);
            } else if(source == "userLikes") {
                let itemID = this.userLikes[index]["_id"];
                this.userLikes.splice(index, 1);

                let newIndex = null;
                for(let i = 0; i < this.itemsShown.length; i++) {
                    if(this.itemsShown.getItem(i)["_id"] == itemID) {
                        newIndex = i;
                        console.log("Found: " + itemID)
                    }
                }
                if(newIndex) {
                    this.itemsLiked[newIndex] = false;
                    this.itemsDisliked[newIndex] = true;                    
                }
                this.sendUserAction(itemID, action);
            } 
        }
        else if (action == "reset") {
            if(source == "itemsShown") {
                let itemID = this.itemsShown.getItem(index)["_id"];

                this.itemsLiked[index] = false;
                this.itemsDisliked[index] = false;

                for(let i = 0; i < this.userLikes.length; i++) {
                    if(this.userLikes[i]["_id"] == itemID) {
                        this.userLikes.splice(i, 1);
                        break;
                    }
                }
    
                this.sendUserAction(itemID, action);
            } else if(source == "userLikes") {
                let itemID = this.userLikes[index]["_id"];
                this.userLikes.splice(index, 1);

                let newIndex = null;
                for(let i = 0; i < this.itemsShown.length; i++) {
                    if(this.itemsShown.getItem(i)["_id"] == itemID) {
                        newIndex = i;
                        console.log("Found: " + itemID)
                    }
                }
                if(newIndex) {
                    this.itemsLiked[newIndex] = false;
                    this.itemsDisliked[newIndex] = false;                    
                }
                this.sendUserAction(itemID, action);
            } 
        }else if(action=="unsave"){
            if(source == "itemsShown") {
                let thisItem = this.itemsShown.getItem(index);
                let itemID = this.itemsShown.getItem(index)["_id"];
                this.userSaved.splice(index, 1);
                let newIndex = null;
                this.itemsSaved[index] = false
                this.sendUserAction(itemID, action);
            } else if(source == "userLikes") {
                let thisItem = this.itemsShown.getItem(index);
                let itemID = this.userLikes[index]["_id"];
                this.itemsSaved[index] = false
                this.itemsSaved.splice(index, 1);
                this.sendUserAction(itemID, action);
            }
        }else if(action=="save"){
            if(source == "itemsShown") {
                let thisItem = this.itemsShown.getItem(index);
                let itemID = this.itemsShown.getItem(index)["_id"];
                this.itemsSaved[index] = true
                this.userSaved.push(thisItem);
                this.sendUserAction(itemID, action);
            } else if(source == "userLikes") {
                let thisItem = this.itemsShown.getItem(index);
                let itemID = this.userLikes[index]["_id"];
                this.itemsSaved[index] = true
                this.userSaved.push(thisItem);
                this.sendUserAction(itemID, action);
            }
        } else {
            throw new Error("invalid action specified");
        }
    }

    //save and unsave action
    sendUserAction(item, action) {
        let input = { item, action }
        this.getPostResponse(input).subscribe((res) =>{
        })
    }
}
