import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { WebView, LoadEventData } from "tns-core-modules/ui/web-view";

import { ItemService } from "./item.service"

@Component({
    selector: "ns-reference",
    templateUrl: "./item-reference.component.html"
})
export class ItemReferenceComponent implements OnInit {
    item_url: string;

    constructor( 
        private route: ActivatedRoute,
        private itemService: ItemService) { }

    onLoadStarted(args: LoadEventData) {
        const webView = args.object as WebView;
    }
    ngOnInit(): void {
        let index = this.route.snapshot.params.id;
        this.item_url = this.itemService.getItem(index)["url"];
    }
}