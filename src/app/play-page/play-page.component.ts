import { Component, OnInit, Input } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { Observable, Subject, interval, Subscription } from "rxjs";
import { takeUntil, takeWhile } from "rxjs/operators";

import {
  AppState,
  selectIsPlay,
  selectWords,
  selectGameWords,
  selectScore
} from "../app.reducer";
import { toggleisPlay, removeWord, addScore, resetState } from "../app.action";

@Component({
  selector: "app-play-page",
  templateUrl: "./play-page.component.html",
  styleUrls: ["./play-page.component.css"]
})
export class PlayPageComponent implements OnInit {
  private unsubscribe$ = new Subject<void>();

  gameWords$: Observable<any[]> = this.store.select(
    selectGameWords,
    takeUntil(this.unsubscribe$)
  );
  isPlay$: Observable<boolean> = this.store.select(selectIsPlay);
  isGameOver: boolean = false;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.store.dispatch(resetState());
    this.getPlayTrue();
  }

  getPlayTrue() {
    this.store.dispatch(toggleisPlay({ isPlay: true }));
  }

  inputEvent(event) {
    const inputValue = event.target.value;
    this.removeWord(inputValue);
    this.initInputVal(event);
  }

  removeWord(inputValue) {
    let idxOfInputVal = this.getIdxOfInputVal(inputValue);
    this.store.dispatch(removeWord({ idxOfInputVal }));
  }

  getIdxOfInputVal(inputValue) {
    let IdxOfInputVal;
    this.gameWords$.subscribe(words => {
      words.forEach((element, idx) => {
        if (element.word === inputValue) {
          IdxOfInputVal = idx;
          this.addScore();
        }
      });
    });

    return IdxOfInputVal;
  }

  addScore() {
    this.store.dispatch(addScore());
  }

  initInputVal(event) {
    const initialVal = "";
    event.target.value = initialVal;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
