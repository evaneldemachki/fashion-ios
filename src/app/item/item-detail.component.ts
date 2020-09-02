import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { ItemService } from "./item.service"

import { Item } from "./item";

@Component({
    selector: "ns-details",
    templateUrl: "./item-detail.component.html",
    styleUrls: ["./item-detail-style.css"]
})
export class ItemDetailComponent implements OnInit {
    item: Item;
    focus: number = 0;

    constructor(
        private itemService: ItemService,
        private route: ActivatedRoute
    ) { }

    onScrollEnded(event) {
        if(event.scrollOffset % 350 != 0) {
            this.focus = Math.round(event.scrollOffset / 350);
            event.object.scrollToIndex(this.focus, true);
        }
    }

    onScrollDragEnded(event) {
        if(event.scrollOffset > ( (this.focus * 350) + 175 )) {
            this.focus += 1;
        } else if(event.scrollOffset < ( (this.focus * 350) - 175 )) {
            this.focus -= 1;
        }
        event.object.scrollToIndex(this.focus, true);
    }

    ngOnInit(): void {
        const i = +this.route.snapshot.params.id;
        this.item = this.itemService.getItem(i);
    }
}
