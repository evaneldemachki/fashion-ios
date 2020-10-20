import { NativeScriptHttpClientModule } from "@nativescript/angular/http-client";
import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular";
import { NativeScriptCommonModule } from "@nativescript/angular/common";
import { NgModule } from "@angular/core";

import { ItemsComponent } from "./items.component";
import { ItemsRoutingModule } from "./items-routing.module";
import { ItemDetailComponent } from "./item-detail.component";
import { ItemReferenceComponent } from "./item-reference.component";
import { ItemService } from "./item.service";
import { OutfitComponent } from "./outfit.component";
import { tutorialComponent } from "./tutorial";
import { friendsComponent } from "./friends";
import { userComponent } from "./user";
import { RouteReuseStrategy } from "@angular/router";
import { CustomRouteReuseStrategy } from "./custom-route-reuse-strategy";



@NgModule({
    imports: [
        NativeScriptHttpClientModule,
        ItemsRoutingModule,
        NativeScriptCommonModule,
        NativeScriptUIListViewModule
    ],
    declarations: [
        ItemsComponent,
        ItemDetailComponent,
        ItemReferenceComponent,
        OutfitComponent,
        tutorialComponent,
        friendsComponent,
        userComponent,
    ],
    providers: [
        ItemService,
        {
            provide: RouteReuseStrategy,
            useClass: CustomRouteReuseStrategy
        }
    ]
})
export class ItemsModule { }
