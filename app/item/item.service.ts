import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Item } from "./item"
import { Image } from "tns-core-modules/ui/image";

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
    public follow_data = {followers: [], following: [], pending: [], requested: []};
    public pending = [];
    public requests = [];
    public userIcon: Image;
    public friendStatus = [];
    public loadedItem= {
        _id: '',
        url: '',
        name: '',
        price: '',
        img: '',
        gender: '',
        category: '',
        source: '',
        product_id: '',
    };
    public allUsers;
    public loadedItemLiked = false;
    public loadedItemSaved = false;
    public currentlyChosen = [];
    public outfitCost = 0;
    public outfitCostLabel = "Total cost of this outfit is: $" + this.outfitCost.toFixed(2);

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
        this.loadedItemLiked=false;
        this.loadedItemSaved=false;
        var query = "grab?item=" + itemID;
        this.http.get(
            this.serverUrl + query, {
                responseType: "json"
            }).subscribe(res => {
                this.loadedItem = <Item>res;
                for(var j=0;j<this.userLikes.length;j++){
                    if(this.userLikes[j]['_id']==this.loadedItem['_id']){
                        this.loadedItemLiked=true;
                    }
                }
    
                for(var k=0;k<this.userSaved.length;k++){
                    if(this.userSaved[k]['_id']==this.loadedItem['_id']){
                        this.loadedItemSaved = true;  
                    }
                }
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
        let itemID = this.loadedItem['_id'];
        let thisItem = this.loadedItem;
        if(action == "like") {
            if(source == "itemsShown") {
                let thisItem = this.itemsShown.getItem(index);   
                let itemID = thisItem['_id'];  
                this.userLikes.unshift(thisItem)
                this.sendUserAction(itemID, action);
                this.itemsLiked[index]=true;
            } else if(source == "userLikes") {
                this.userLikes.unshift(thisItem)
                this.sendUserAction(itemID, action);
            }else if(source == "userSaved") {
                this.userLikes.unshift(thisItem)
                this.sendUserAction(itemID, action);
            }else if(source == "outfit") {
                this.userLikes.unshift(thisItem)
                this.sendUserAction(itemID, action);
            }else if(source == "user") {
                this.userLikes.unshift(thisItem)
                this.sendUserAction(itemID, action);
            }
        }
        else if (action == "reset") {
            if(source == "itemsShown") {
                this.itemsLiked[index] = false;
                this.itemsDisliked[index] = false;
                let thisItem = this.itemsShown.getItem(index);   
                let itemID = thisItem['_id']; 
                for(let i = 0; i < this.userLikes.length; i++) {
                    if(this.userLikes[i]["_id"] == itemID) {
                        this.userLikes.splice(i, 1);
                        break;
                    }
                }
                this.sendUserAction(itemID, action);
            } else if(source == "userLikes") {
                this.userLikes.splice(index, 1);
                this.sendUserAction(itemID, action);
            }
        }else if(action=="unsave"){
            if(source == "itemsShown") {
                for(let j=0;j<this.userSaved.length;j++){
                    if(this.userSaved[j]['_id']==itemID){
                        this.userSaved.splice(j, 1);
                        break;
                    }
                }
                this.sendUserAction(itemID, action);
            } else if(source == "userLikes") {
                for(let j=0;j<this.userSaved.length;j++){
                    if(this.userSaved[j]['_id']==itemID){
                        this.userSaved.splice(j, 1);
                        break;
                    }
                }
                this.sendUserAction(itemID, action);
            }else if(source == "userSaved") {             
                for(let j=0;j<this.userSaved.length;j++){
                    if(this.userSaved[j]['_id']==itemID){
                        this.userSaved.splice(j, 1);
                        break;
                    }
                }
                this.sendUserAction(itemID, action);
            }else if(source == "user") {             
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
                this.userSaved.unshift(thisItem);
                this.sendUserAction(itemID, action);
            } else if(source == "userLikes") {
                this.userSaved.unshift(thisItem);
                this.sendUserAction(itemID, action);
            } else if(source == "userSaved") {
                this.userSaved.unshift(thisItem);
                this.sendUserAction(itemID, action);
            }else if(source == "outfit") {
                this.userSaved.unshift(thisItem);
                this.sendUserAction(itemID, action);
            }else if(source == "user") {
                this.userSaved.unshift(thisItem);
                this.sendUserAction(itemID, action);
            }
            
        } else {
            throw new Error("invalid action specified");
        }
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

    getFollowerData(id){
        let body = {
            "id": id
        }
        var url = "https://fashionapi.herokuapp.com/user/user-data";
        let header = {"Authorization": "Bearer " + this.token}
        return this.http.post(
            url, body, { headers: header, responseType: "json" }
        );
    }

    sendUserAction(item, action) {
        let input = { item, action }
        this.getPostResponse(input).subscribe((res) =>{
        })
    }

    sendFollowAction(id, action, user){
        console.log('Action Received: ' + action);
        let body = {
            "id": id
        }
        if(action=='follow'){
            this.follow_data['following'].push(user);

            var url = "https://fashionapi.herokuapp.com/user/follow";
            let header = {"Authorization": "Bearer " + this.token}
            
            return this.http.post(
                url, body, { headers: header, responseType: "json" }
            ).subscribe();
        }else if(action=='unfollow'){
            for(let i = 0; i<this.follow_data['following'].length;i++){
                if(this.follow_data['following'][i]['_id'] == id){
                    this.follow_data['following'].splice(i,1)
                    break;
                }
            } 

            var url = "https://fashionapi.herokuapp.com/user/unfollow";
            let header = {"Authorization": "Bearer " + this.token}
            return this.http.post(
                url, body, { headers: header, responseType: "json" }
            ).subscribe();
        }else if(action=='reject-follow'){

            for(let i = 0; i<this.follow_data['pending'].length;i++){
                if(this.follow_data['pending'][i]['_id'] == id){
                    this.follow_data['pending'].splice(i,1)
                    break;
                }
            } 

            var url = "https://fashionapi.herokuapp.com/user/reject-follow";
            let header = {"Authorization": "Bearer " + this.token}
            return this.http.post(
                url, body, { headers: header, responseType: "json" }
            ).subscribe();
        }else if(action=='accept-follow'){
            this.follow_data['followers'].push(user);
            for(let i = 0; i<this.follow_data['pending'].length;i++){
                if(this.follow_data['pending'][i]['_id'] == id){
                    this.follow_data['pending'].splice(i,1)
                    break;
                }
            } 

            var url = "https://fashionapi.herokuapp.com/user/accept-follow";
            let header = {"Authorization": "Bearer " + this.token}
            return this.http.post(
                url, body, { headers: header, responseType: "json" }
            ).subscribe();
        }

    }
}
