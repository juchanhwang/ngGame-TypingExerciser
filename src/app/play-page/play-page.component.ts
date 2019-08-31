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

  gameWords$: Observable<any[]>;
  isPlay$: Observable<boolean>;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.gameWords$ = this.store.select(selectGameWords);
    this.isPlay$ = this.store.select(selectIsPlay);

    this.resetState();
    this.toggleIsPlay();
  }

  resetState() {
    console.log('reste')
    this.store.dispatch(resetState());
  }

  toggleIsPlay() {
    this.store.dispatch(toggleisPlay({ isPlay: true }));
  }

  inputEvent(event) {
    const inputValue = event.target.value;
    this.removeWord(inputValue);
    this.initInputVal(event);
  }

  removeWord(inputValue) {
    let curWordIdx = this.getCurWordIdx(inputValue);
    this.store.dispatch(removeWord({ curWordIdx }));
  }

  getCurWordIdx(inputValue) {
    let curWordIdx;
    this.gameWords$.pipe(takeUntil(this.unsubscribe$)).subscribe(gameWords => {
      gameWords.forEach((curWord, idx) => {
        if (curWord.word === inputValue) {
          curWordIdx = idx;
          this.addScore();
        }
      });
    });

    return curWordIdx;
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
