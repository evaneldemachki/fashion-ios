import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "@nativescript/angular/router";

import { ItemDetailComponent } from "./item-detail.component"
import { ItemsComponent } from "./items.component";
import { ItemReferenceComponent } from "./item-reference.component";
import { OutfitComponent } from "./outfit.component";
import { userComponent } from "./user";
import { settingsComponent } from "./settings";


const routes: Routes = [
    { path: "", component: ItemsComponent},
    { path: "detail/:id", component: ItemDetailComponent },
    { path: "detail/:id/:url", component: ItemReferenceComponent },
    { path: "outfit", component: OutfitComponent },
    { path: "user/:id", component: userComponent, data: { noReuse: true, id: ':/id' }},
    { path: "user/:id/detail/:id", component: ItemDetailComponent},
    { path: "user/:id/detail/:id/:url", component: ItemReferenceComponent },
    { path: "settings", component: settingsComponent },

];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class ItemsRoutingModule { }