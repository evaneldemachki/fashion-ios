import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Item } from "./item"

@Injectable()
export class ItemService {
    // dev mode
    private serverUrl = "https://fashionapi.herokuapp.com/api/search?category=dress";
    items: Item[];

    constructor(private http: HttpClient) { }

    getItems() {
        return this.http.get(
            this.serverUrl, {
                responseType: "text"
            });
    }

    getItem(i) {
        console.log(i)
        return this.items[i];
    }
}
