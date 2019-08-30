import { Component, OnInit } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { Observable, timer } from "rxjs";

import { AppState, selectIsPlay } from "../app.reducer";
import { toggleisPlay, countTime } from "../app.action";

@Component({
  selector: "app-main-page",
  templateUrl: "./main-page.component.html",
  styleUrls: ["./main-page.component.css"]
})
export class MainPageComponent implements OnInit {
  isPlay$: Observable<boolean> = this.store.select(selectIsPlay);
  isPlay: boolean;
  gameTime$: number;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.getPlayFalse();
  }

  getPlayFalse() {
    this.store.dispatch(toggleisPlay({ isPlay: false }));
  }
}
