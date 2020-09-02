import { Item } from "./item";
import { ItemService } from "./item.service";
import { Component, OnInit } from "@angular/core";

@Component({
    selector: "ns-items",
    moduleId: module.id,
    templateUrl: "./items.component.html"
})
export class ItemsComponent implements OnInit {
    items: Item[];

    constructor(private itemService: ItemService) { }

    ngOnInit(): void {
        this.itemService.getItems().subscribe((res) => {
            this.items = JSON.parse(res);
            this.itemService.items = this.items;
            console.log(this.itemService.items.length)
        });
    }
}
