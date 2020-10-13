import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "@nativescript/angular/router";

import { ItemDetailComponent } from "./item-detail.component"
import { ItemsComponent } from "./items.component";
import { ItemReferenceComponent } from "./item-reference.component";
import { OutfitComponent } from "./outfit.component";
import { friendsComponent } from "./friends";
import { userComponent } from "./user";


const routes: Routes = [
    { path: "", component: ItemsComponent },
    { path: "detail/:id", component: ItemDetailComponent },
    { path: "detail/:id/:url", component: ItemReferenceComponent },
    { path: "outfit", component: OutfitComponent },
    { path: "friends", component: friendsComponent},
    { path: "user", component: userComponent},
    
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class ItemsRoutingModule { }