import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "@nativescript/angular/router";

import { ItemDetailComponent } from "./item-detail.component"
import { ItemsComponent } from "./items.component";
import { ItemReferenceComponent } from "./item-reference.component";
import { ProfileComponent } from "./profile-page";

const routes: Routes = [
    { path: "", component: ItemsComponent },
    { path: "detail/:id", component: ItemDetailComponent },
    { path: "detail/:id/:url", component: ItemReferenceComponent },
    { path: "profile/:id", component: ProfileComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class ItemsRoutingModule { }