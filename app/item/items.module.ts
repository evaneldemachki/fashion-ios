import { NativeScriptHttpClientModule } from "@nativescript/angular/http-client";
import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular";
import { NativeScriptCommonModule } from "@nativescript/angular/common";
import { NgModule } from "@angular/core";

import { ItemsComponent } from "./items.component";
import { ItemsRoutingModule } from "./items-routing.module";
import { ItemDetailComponent } from "./item-detail.component";
import { ItemReferenceComponent } from "./item-reference.component";
import { ItemService } from "./item.service";
import { ProfileComponent } from "./profile-page";
import { OutfitComponent } from "./outfit.component";


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
        ProfileComponent,
        OutfitComponent
    ],
    providers: [
        ItemService
    ]
})
export class ItemsModule { }
