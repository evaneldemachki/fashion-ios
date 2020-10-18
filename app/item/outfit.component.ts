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
import { RouterExtensions } from 'nativescript-angular/router';

@Component({
    selector: "ns-outfit",
    templateUrl: "./outfit.component.html",
})
export class OutfitComponent implements OnInit {

    constructor(
        private itemService: ItemService,
        private route: ActivatedRoute,
        private page: Page,
        private http: HttpClient,
        private router: RouterExtensions,

    ) { }
    createdBy = '';
    username = '';
    created = false;
    outfit = [];
    topOutfits = [];
    brands = '';
    index;
    nameBrands = [];

    ngOnInit(): void {
        this.username = this.itemService.userName;
        this.route.queryParams.subscribe(params => {
            // convert string parameters to boolean:
            this.index = params.outfit;
        });
        this.outfit = this.itemService.outfits[this.index]['items'];
        for(var i=0; i<this.outfit.length;i++){
            var found = 0;
            for(var j=0; j<this.nameBrands.length;j++){
                if(this.nameBrands[j] == this.outfit[i]['source']){
                    found=1;
                }
            }
            if(found==0){
                this.nameBrands.push(this.outfit[i]['source'])
            }
        }
        if(this.nameBrands.length==1){
            this.brands = this.nameBrands[0]
        }else if(this.nameBrands.length==2){
            this.brands = this.nameBrands[0] + ' ' + this.nameBrands[1]
        }else{
            for(var i=0; i<this.nameBrands.length-1;i++){
                this.brands = this.nameBrands[i] + ', '
            }
            this.brands = this.brands + 'and ' + this.nameBrands[this.nameBrands.length];
        }

        if(this.createdBy == this.username){
            this.created=true;
        }

    }
    
    goToItemPage(source, id){
        this.router.navigate(['detail', id], 
            {
                relativeTo: this.route.parent,
                queryParams: { 'source': source, 'id': id },
                transition: {
                    name: 'slideLeft',
                    duration: 500
                }
            });
    }
}