import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ItemService } from "./item.service"
import { Item } from "./item";
import { ActionItem } from "tns-core-modules/ui/action-bar";
import { ActionBar } from "tns-core-modules/ui/action-bar";
import { Image } from 'tns-core-modules/ui/image';
import { Page, Observable } from "tns-core-modules/ui/page";
import { HttpClient } from "@angular/common/http";
import { User } from "~/login.component";
import { ObservableArray } from 'tns-core-modules/data/observable-array';
import { SearchBar } from "tns-core-modules/ui/search-bar";
import { Animation } from "tns-core-modules/ui/animation";
import { RadListView, ListViewEventData, SwipeActionsEventData } from "nativescript-ui-listview";
import { GestureTypes, GestureEventData } from "tns-core-modules/ui/gestures";
import { GridLayout, ItemSpec } from "tns-core-modules/ui/layouts/grid-layout";
import { Label } from "tns-core-modules/ui/label";
import { screen } from "tns-core-modules/platform/platform";
import { ListPicker } from "tns-core-modules/ui/list-picker";
import { RouterExtensions } from 'nativescript-angular/router';


@Component({
    selector: "ns-user",
    templateUrl: "./user.html",
})
export class userComponent implements OnInit {
    id;
    source;
    user;
    username;
    fullname;
    index;
    userLikes=[];
    userOutfits=[];
    userFollowData={followers: [], following: []};
    userIcon;
    categories = [];
    followStatus = "";
    showOptionsAccept = false;
    showOptionsReject = false;

    public profileLikesSearchMenu: GridLayout;
    public profileLikesSearchBar: SearchBar;
    public profileLikesSearchMenuOn = 0;
    public searchLikes = [];

    public profileFollowerSearchBar: SearchBar;
    public profileFollowerGrid: GridLayout;
    public profileFollowerGridOn = 0;
    public profileFollowerSearchUsers = [];
    public profileFollowerList = [];
    public profileLikesSearchText = "";
    public profileLikesCategoryIndex = 0;

    public profileFollowingSearchBar: SearchBar;
    public profileFollowingGrid: GridLayout;
    public profileFollowingGridOn = 0;
    public profileFollowingSearchUsers = [];
    public profileFollowingList = [];

    public windowHeight = screen.mainScreen.heightPixels;
    public windowWidth = screen.mainScreen.widthPixels;

    constructor(
        private itemService: ItemService,
        private route: ActivatedRoute,
        protected router: RouterExtensions,
        private page: Page,
        private http: HttpClient,
    ) { }

    ngOnInit(): void {
        const i = this.route.snapshot.params.id;
        this.index = i;

        this.route.queryParams.subscribe(params => {
            this.source = params.source;
            this.id = params.id;
        });
        this.itemService.getFollowerData(this.id).subscribe(res => {
            this.userIcon = res['img']
            this.fullname = res['first_name'] + ' ' + res['last_name']
            this.username = '@' + res['username']
            this.userOutfits = res['outfits']
            this.userLikes = res['likes']
            this.userFollowData['followers'] = res['followers']
            this.userFollowData['following'] = res['following']
            this.profileFollowerSearchUsers = this.userFollowData['followers'];
            this.profileFollowingSearchUsers = this.userFollowData['followers'];
            this.searchLikes = this.userLikes;
        });

        this.itemService.getCategories().subscribe((res) =>{
            let cat = JSON.parse(res);
            //this.categories.push({"name" : "Any"});
            for(let i=0; i < cat.length; i++) {
                // capitalize first letter of category
                cat[i] = cat[i].charAt(0).toUpperCase() + cat[i].slice(1);
                //this.categories.push({"name" : cat[i]});
            }
            // add 'Any' category to search all items
            cat.unshift("Any");
            this.categories = cat;
        });
        this.getFollowerStatus();
    }

    getFollowerStatus(){
        let found = 0
        for(let i=0; i<this.itemService.follow_data['followers'].length; i++){
            if(this.id ==this.itemService.follow_data['followers'][i]['_id']){
                this.followStatus = 'Unfollow'
                found = 1;
                break;
            }
        }
        for(let j=0; j<this.itemService.follow_data['requested'].length; j++){
            if(this.id ==this.itemService.follow_data['requested'][j]['_id']){
                this.followStatus = 'Pending'
                found = 1;
                break;
            }
        }
        for(let k=0; k<this.itemService.follow_data['pending'].length; k++){
            if(this.id ==this.itemService.follow_data['pending'][k]['_id']){
                this.followStatus = 'Respond'
                found = 1;
                break;
            }
        }
        if(found==0){
            this.followStatus = 'Follow'
        }
    }

    FollowUser(){
        if(this.followStatus=='Follow'){
            this.itemService.sendUserAction(this.id, 'follow');
        }else{
            if(this.followStatus=='Unfollow'){
                if(this.showOptionsAccept==false){
                    this.showOptionsAccept = true;
                    this.showOptionsReject = true;
                }else{
                    this.showOptionsAccept = false;
                    this.showOptionsReject = false;
                }
            }else if(this.followStatus=="Pending"){
                if(this.showOptionsReject == false){
                    this.showOptionsReject = true;
                }else{
                    this.showOptionsReject = false;
                }
            }else if(this.followStatus=='Respond'){
                if(this.showOptionsAccept==false){
                    this.showOptionsAccept = true;
                    this.showOptionsReject = true;
                }else{
                    this.showOptionsAccept = false;
                    this.showOptionsReject = false;
                }
            }
        }
    }

    confirmRequest(){
        if(this.followStatus=="Unfollow"){
            this.itemService.sendUserAction(this.id, 'unfollow');
            this.followStatus = 'Follow';
            this.showOptionsAccept = false;
            this.showOptionsReject = false;
            for(let i = 0; i<this.itemService.follow_data['followers'].length;i++){
                if(this.itemService.follow_data['followers']['_id'] == this.id){
                    this.itemService.follow_data['followers'].splice(i,1)
                    break;
                }

            }
        }else if(this.followStatus=="Pending"){

        }else if(this.followStatus=='Respond'){
            this.itemService.sendUserAction(this.id, 'accept-follow');
            this.followStatus = 'Unfollow';
            this.showOptionsAccept = false;
            this.showOptionsReject = false;
            this.itemService.follow_data['followers'].push(this.user);
        }
    }

    denyRequest(){
        if(this.followStatus=="Unfollow"){
            this.showOptionsAccept = false;
            this.showOptionsReject = false;
        }else if(this.followStatus=="Pending"){
            this.followStatus = 'Follow';
            this.itemService.sendUserAction(this.id, 'reject-follow');
            this.showOptionsAccept = false;
            this.showOptionsReject = false;  
            for(let i = 0; i<this.itemService.follow_data['pending'].length;i++){
                if(this.itemService.follow_data['pending']['_id'] == this.id){
                    this.itemService.follow_data['pending'].splice(i,1)
                    break;
                }
            } 
        }else if(this.followStatus=='Respond'){
            this.followStatus = 'Follow';
            this.itemService.sendUserAction(this.id, 'reject-follow');
            this.showOptionsAccept = false;
            this.showOptionsReject = false;   
            for(let i = 0; i<this.itemService.follow_data['pending'].length;i++){
                if(this.itemService.follow_data['pending']['_id'] == this.id){
                    this.itemService.follow_data['pending'].splice(i,1)
                    break;
                }
            } 
        }
    }

    goToUserProfile(source, id){
        this.router.navigate(['user', id], 
            {
                relativeTo: this.route.parent,
                queryParams: { 'source': source, 'id': id },
                transition: {
                    name: 'slideLeft',
                    duration: 500
                }
            });
    }

    start(args){
        this.page = args.object.page;
    }

    //Likes Grid Functions
    likesGridInitialized(args){
        this.profileLikesSearchMenuOn = 0;
        this.profileLikesSearchBar = <SearchBar>this.page.getViewById('searchBarLikesProfile');
        this.profileLikesSearchMenu = args.object;
        this.profileLikesSearchMenu.translateY = this.profileLikesSearchMenu.originY + this.windowHeight;
    }

    profileLikesScrollStartedEvent(args){
        this.profileLikesSearchBar.dismissSoftInput();
    }

    closeLikes(){
        this.profileLikesSearchBar.dismissSoftInput();
        let closing = new Animation([
            {
                translate: { x: this.profileLikesSearchMenu.originX, y:this.profileLikesSearchMenu.originY + this.windowHeight },
                scale: { x: .5, y: .5},
                duration: 1000,
                target: this.profileLikesSearchMenu,
                delay: 0,
            }
        ]);
        if(this.profileLikesSearchMenuOn==1){
            closing.play();
            this.profileLikesSearchMenuOn = 0;
        }
    }

    openLikes(){
        let opening = new Animation([
            {
                translate: { x: this.profileLikesSearchMenu.originX, y: this.profileLikesSearchMenu.originY},
                scale: { x: 1, y: 1},
                duration: 300,
                target: this.profileLikesSearchMenu,
                delay: 0,
            }
        ]);
        if(this.profileLikesSearchMenuOn==0){
            opening.play();
            this.profileLikesSearchMenuOn = 1;
        }
    }

    onLikesClear(args){
        this.searchLikes = this.userLikes;
    }

    onLikeTextChanged(args){
        this.profileLikesSearchText = args.object.text;
        this.likesSearchRouter();
    }

    likesCategoryChange(args){
        let likesListPicker = <ListPicker>this.page.getViewById('likeCategoryPicker');
        this.profileLikesCategoryIndex = likesListPicker.selectedIndex;
        this.likesSearchRouter();
    }

    likesSearchRouter() {
        this.searchLikes = [];
        if (this.profileLikesSearchText == null) {
            if(this.profileLikesCategoryIndex == 0) {
                for(var i=0; i<this.userLikes.length;i++){
                    this.searchLikes.push(this.userLikes[i]);
                }      
            } else {
                let itemCategory = this.categories[this.profileLikesCategoryIndex].toLowerCase();
                for(var i=0; i<this.userLikes.length;i++){
                    if(this.userLikes[i]['category']==itemCategory){
                        this.searchLikes.push(this.userLikes[i]);
                    }
                }   
            }
        } else {
            if(this.profileLikesCategoryIndex == 0) {
                let lowerSearchText = this.profileLikesSearchText.toLowerCase();
                for(var i=0; i<this.userLikes.length;i++){
                    let itemName = this.userLikes[i]['name'].toLowerCase();
                    if(itemName.search(lowerSearchText)!=-1){
                        this.searchLikes.push(this.userLikes[i]);
                    }
                }         
            } else {
                let lowerSearchText = this.profileLikesSearchText.toLowerCase();
                for(var i=0; i<this.userLikes.length;i++){
                    let itemName = this.userLikes[i]['name'].toLowerCase();
                    let itemCategory = this.categories[this.profileLikesCategoryIndex].toLowerCase()
                    if(itemName.search(lowerSearchText)!=-1 && this.userLikes[i]['category']==itemCategory){
                        this.searchLikes.push(this.userLikes[i]);
                    }
                }             
            }
        }
    }

    //Follower Grid Functions
    followerGridInitialized(args){
        this.profileLikesSearchMenuOn = 0;
        this.profileFollowerSearchBar = this.page.getViewById('searchBarFollower');
        this.profileFollowerGrid = <GridLayout>this.page.getViewById('profileFollowers');

        this.profileFollowerGrid.translateY = this.profileFollowerGrid.originY + this.windowHeight;
        this.profileFollowerGrid.scaleX = this.profileFollowerGrid.scaleX * .5;
        this.profileFollowerGrid.scaleY = this.profileFollowerGrid.scaleY * .5;

    }

    followerScrollStartedEvent(args){
        this.profileFollowerSearchBar.dismissSoftInput();
    }

    closeFollower(){
        this.profileFollowerSearchBar.dismissSoftInput();
        let closing = new Animation([
            {
                translate: { x: this.profileFollowerGrid.originX, y:this.profileFollowerGrid.originY + this.windowHeight },
                scale: { x: .5, y: .5},
                duration: 1000,
                target: this.profileFollowerGrid,
                delay: 0,
            }
        ]);
        if(this.profileFollowerGridOn==1){
            closing.play();
            this.profileFollowerGridOn = 0;
        }
    }

    openFollower(){
        let opening = new Animation([
            {
                translate: { x: this.profileFollowerGrid.originX, y: this.profileFollowerGrid.originY},
                scale: { x: 1, y: 1},
                duration: 300,
                target: this.profileFollowerGrid,
                delay: 0,
            }
        ]);
        if(this.profileFollowerGridOn==0){
            opening.play();
            this.profileFollowerGridOn = 1;
        }
    }

    onFollowerClear(){
        this.profileFollowerSearchUsers = this.profileFollowerList;  
    }

    onFollowerTextChanged(args){
        var searchText = args.object.text;
        if(searchText && searchText.length>0){
            this.profileFollowerSearchUsers = [];
            for(var i=0; i<this.profileFollowerList.length;i++){
                if(this.profileFollowerList[i]['username'].includes(searchText)){
                    this.profileFollowerSearchUsers.push(this.profileFollowerList[i]);
                }else if(this.profileFollowerList[i]['first_name'].includes(searchText)){
                    this.profileFollowerSearchUsers.push(this.profileFollowerList[i]);
                }else if(this.profileFollowerList[i]['last_name'].includes(searchText)){
                    this.profileFollowerSearchUsers.push(this.profileFollowerList[i]);
                }
            }
        }
    }

    //Following Grid Functions
    followingGridInitialized(args){
        this.profileLikesSearchMenuOn = 0;
        this.profileFollowingSearchBar = this.page.getViewById('searchBarFollowing');
        this.profileFollowingGrid = <GridLayout>this.page.getViewById('profileFollowing');

        this.profileFollowingGrid.translateY = this.profileFollowingGrid.originY + this.windowHeight;
        this.profileFollowingGrid.scaleX = this.profileFollowingGrid.scaleX * .5;
        this.profileFollowingGrid.scaleY = this.profileFollowingGrid.scaleY * .5;

    }

    followingScrollStartedEvent(args){
        this.profileFollowingSearchBar.dismissSoftInput();
    }

    closeFollowing(){
        this.profileFollowingSearchBar.dismissSoftInput();
        let closing = new Animation([
            {
                translate: { x: this.profileFollowingGrid.originX, y:this.profileFollowingGrid.originY + this.windowHeight },
                scale: { x: .5, y: .5},
                duration: 1000,
                target: this.profileFollowingGrid,
                delay: 0,
            }
        ]);
        if(this.profileFollowingGridOn==1){
            closing.play();
            this.profileFollowingGridOn = 0;
        }
    }

    openFollowing(){
        let opening = new Animation([
            {
                translate: { x: this.profileFollowingGrid.originX, y: this.profileFollowingGrid.originY},
                scale: { x: 1, y: 1},
                duration: 300,
                target: this.profileFollowingGrid,
                delay: 0,
            }
        ]);
        if(this.profileFollowingGridOn==0){
            opening.play();
            this.profileFollowingGridOn = 1;
        }
    }

    onFollowingClear(){
        this.profileFollowingSearchUsers = this.profileFollowingList;  
    }

    onFollowingTextChanged(args){
        var searchText = args.object.text;
        if(searchText && searchText.length>0){
            this.profileFollowingSearchUsers = [];
            for(var i=0; i<this.profileFollowingList.length;i++){
                if(this.profileFollowingList[i]['username'].includes(searchText)){
                    this.profileFollowingSearchUsers.push(this.profileFollowingList[i]);
                }else if(this.profileFollowingList[i]['first_name'].includes(searchText)){
                    this.profileFollowingSearchUsers.push(this.profileFollowingList[i]);
                }else if(this.profileFollowingList[i]['last_name'].includes(searchText)){
                    this.profileFollowingSearchUsers.push(this.profileFollowingList[i]);
                }
            }
        }
    }


}