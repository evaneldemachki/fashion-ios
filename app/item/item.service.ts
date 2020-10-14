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
    public userId = "";
    public userName = "";
    public userFullname = "";
    public lastSearch = ""; 
    public limit = 500;
    public token: String;
    public userLikes = [];
    public userDislikes = [];
    public itemsShown = new ObservableArray<Item>();
    public itemsLiked = [];
    public itemsDisliked = [];
    public itemsSaved = [];
    public userSaved = [];
    public wardrobe = [];
    public outfits = [];
    public friends = [];
    public allUsers;

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
                this.userLikes.unshift(thisItem)
                let itemID = thisItem["_id"];
                
                this.sendUserAction(itemID, action);
            } else if(source == "userLikes") {
                this.itemsLiked[index] = true;
                this.itemsDisliked[index] = false;

                let thisItem = this.userLikes[index];
                this.userLikes.unshift(thisItem)
                let itemID = thisItem["_id"];

                for(let i = 0; i < this.itemsShown.length; i++) {
                    if(this.itemsShown.getItem(i)["_id"] == itemID) {
                        this.itemsLiked[i] = true;
                        this.itemsDisliked[i] = false;
                    }
                }

                this.sendUserAction(itemID, action);
            }else if(source == "userSaved") {
                this.itemsLiked[index] = true;
                this.itemsDisliked[index] = false;

                let thisItem = this.userSaved[index];
                this.userLikes.unshift(thisItem)
                let itemID = thisItem["_id"];

                for(let i = 0; i < this.itemsShown.length; i++) {
                    if(this.itemsShown.getItem(i)["_id"] == itemID) {
                        this.itemsLiked[i] = true;
                        this.itemsDisliked[i] = false;
                    }
                }
                this.sendUserAction(itemID, action);
            }
        }
        else if (action == "dislike") {
            if(source == "itemsShown") {
                this.itemsLiked[index] = false;
                this.itemsDisliked[index] = true;
                let itemID = this.itemsShown.getItem(index)["_id"];

                for(let i = 0; i < this.userLikes.length; i++) {
                    if(this.userLikes[i]["_id"] == itemID) {
                        this.userLikes.splice(i, 1);
                        break;
                    }
                }
                this.sendUserAction(itemID, action);
            } else if(source == "userLikes") {
                this.itemsLiked[index] = false;
                this.itemsDisliked[index] = true;

                let itemID = this.userLikes[index]["_id"];
                this.userLikes.splice(index, 1);

                for(let i = 0; i < this.itemsShown.length; i++) {
                    if(this.itemsShown.getItem(index)["_id"] == itemID) {
                        this.itemsLiked[i] = false;
                        this.itemsDisliked[i] = true; 
                        break;
                    }
                }
                this.sendUserAction(itemID, action);
            } else if(source == "userSaved") {
                this.itemsLiked[index] = false;
                this.itemsDisliked[index] = true;

                let itemID = this.userSaved[index]["_id"];
                
                for(let i = 0; i < this.userLikes.length; i++) {
                    if(this.userLikes[i]["_id"] == itemID) {
                        this.userLikes.splice(i, 1);
                        break;
                    }
                }
                for(let i = 0; i < this.itemsShown.length; i++) {
                    if(this.itemsShown.getItem(index)["_id"] == itemID) {
                        this.itemsLiked[i] = false;
                        this.itemsDisliked[i] = true;
                        break;
                    }
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

                for(let i = 0; i < this.itemsShown.length; i++) {
                    if(this.itemsShown.getItem(i)["_id"] == itemID) {
                        this.itemsLiked[i] = false;
                        this.itemsDisliked[i] = false;
                        break;
                    }
                }
                this.sendUserAction(itemID, action);
            }
        }else if(action=="unsave"){
            if(source == "itemsShown") {
                let thisItem = this.itemsShown.getItem(index);
                let itemID = this.itemsShown.getItem(index)["_id"];

                for(let i = 0; i < this.itemsShown.length; i++) {
                    if(this.itemsShown.getItem(i)["_id"] == itemID) {
                        this.itemsSaved[i] = false;
                        break;
                    }
                }
                for(let j=0;j<this.userSaved.length;j++){
                    if(this.userSaved[j]['_id']==itemID){
                        this.userSaved.splice(j, 1);
                        break;
                    }
                }
                this.sendUserAction(itemID, action);
            } else if(source == "userLikes") {
                let thisItem = this.userLikes[index];
                let itemID = this.userLikes[index]["_id"];

                for(let i = 0; i < this.itemsShown.length; i++) {
                    if(this.itemsShown.getItem(i)["_id"] == itemID) {
                        this.itemsSaved[i] = false
                        break;
                    }
                }
                for(let j=0;j<this.userSaved.length;j++){
                    if(this.userSaved[j]['_id']==itemID){
                        this.userSaved.splice(j, 1);
                        break;
                    }
                }
                this.sendUserAction(itemID, action);
            }else if(source == "userSaved") {
                let thisItem = this.userSaved[index];
                let itemID = this.userSaved[index]["_id"];

                for(let i = 0; i < this.itemsShown.length; i++) {
                    if(this.itemsShown.getItem(i)["_id"] == itemID) {
                        this.itemsSaved[i] = false
                        break;
                    }
                }                
                for(let j=0;j<this.userSaved.length;j++){
                    if(this.userSaved[j]['_id']==itemID){
                        this.userSaved.splice(j, 1);
                        break;
                    }
                }
                this.sendUserAction(itemID, action);
            }
        }else if(action=="save"){
            if(source == "itemsShown") {
                let thisItem = this.itemsShown.getItem(index);
                let itemID = this.itemsShown.getItem(index)["_id"];

                for(let i = 0; i < this.itemsShown.length; i++) {
                    if(this.itemsShown.getItem(i)["_id"] == itemID) {
                        this.itemsSaved[i] = true
                        break;
                    }
                }
                this.userSaved.unshift(thisItem);
                this.sendUserAction(itemID, action);
                //this.userSaved.unshift(thisItem)
            } else if(source == "userLikes") {
                let thisItem = this.userLikes[index];
                let itemID = this.userLikes[index]["_id"];

                for(let i = 0; i < this.itemsShown.length; i++) {
                    if(this.itemsShown.getItem(i)["_id"] == itemID) {
                        this.itemsSaved[i] = true
                        break;
                    }
                }
                this.userSaved.unshift(thisItem);
                this.sendUserAction(itemID, action);
                //this.userSaved.unshift(thisItem)
            } else if(source == "userSaved") {
                let thisItem = this.userSaved[index];
                let itemID = this.userSaved[index]["_id"];

                for(let i = 0; i < this.itemsShown.length; i++) {
                    if(this.itemsShown.getItem(i)["_id"] == itemID) {
                        this.itemsSaved[i] = true

                    }
                }
                this.userSaved.unshift(thisItem);
                this.sendUserAction(itemID, action);
                //this.userSaved.unshift(thisItem)
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

    addOutfit(input){
        let endpoint = "http://fashionapi.herokuapp.com/user/add-outfit";
        let header = {"Authorization": "Bearer " + this.token}
        return this.http.post(endpoint, input, 
          {headers: header, responseType: "text", observe: "response"});
    }

    updateOutfit(input){
        let endpoint = "http://fashionapi.herokuapp.com/user/update-outfit";
        let header = {"Authorization": "Bearer " + this.token}
        return this.http.post(endpoint, input, 
          {headers: header, responseType: "text", observe: "response"});
    }

    getAllUsers(){
        var url = "https://fashionapi.herokuapp.com/user/search";
        let header = {"Authorization": "Bearer " + this.token}
        return this.http.get(
            url, {
                headers: header,
                responseType: "json"
            });
    }

    searchUsers(name){
        var url = "https://fashionapi.herokuapp.com/user/search?term="+name;
        let header = {"Authorization": "Bearer " + this.token}
        return this.http.get(
            url, {
                headers: header,
                responseType: "text"
            });
    }

    getFriends(){
        var url = "https://fashionapi.herokuapp.com/user/friend";
        let header = {"Authorization": "Bearer " + this.token}
        return this.http.get(
            url, {
                headers: header,
                responseType: "text"
            });
    }

    getFriendData(id){
        let body = {
            "id": id
        }
        var url = "https://fashionapi.herokuapp.com/user/friend";
        let header = {"Authorization": "Bearer " + this.token}
        return this.http.post(
            url, body, { headers: header, responseType: "json" }
        );
    }
}
