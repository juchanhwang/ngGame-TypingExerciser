import { Component, OnInit, OnDestroy } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { Observable, Subject } from "rxjs";

import { AppState, selectIsPlay } from "../app.reducer";
import { toggleisPlay} from "../app.action";

@Component({
  selector: "app-main-page",
  templateUrl: "./main-page.component.html",
  styleUrls: ["./main-page.component.css"]
})
export class MainPageComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();

  isPlay$: Observable<boolean>;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.isPlay$ = this.store.select(selectIsPlay);
    this.getPlayFalse();
  }

  getPlayFalse() {
    this.store.dispatch(toggleisPlay({ isPlay: false }));
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
