import { Component } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { Observable, interval } from "rxjs";

import {
  GameState,
  selectWords,
  selectGameWords,
  AppState
} from "./app.reducer";
import { getWordData } from "./app.action";
import { AppService } from "./app.service";
import { takeWhile, map } from "rxjs/operators";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  constructor(private store: Store<AppState>) {}
  ngOnInit() {
    this.store.dispatch(getWordData());
  }
}
