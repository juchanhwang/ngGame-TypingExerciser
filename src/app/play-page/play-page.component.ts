import { Component, OnInit, Input } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { Observable, Subject, interval, Subscription } from "rxjs";
import { takeUntil, takeWhile, map } from "rxjs/operators";

import {
  AppState,
  selectIsPlay,
  selectWords,
  selectGameWords,
  selectScore
} from "../app.reducer";
import {
  toggleisPlay,
  removeWord,
  addScore,
  resetState,
  setGameWord
} from "../app.action";
import mapToGameWord from "../utils/makeWordData";
const INITIALVAL = "";
const INTERVALTIME = 1000;
@Component({
  selector: "app-play-page",
  templateUrl: "./play-page.component.html",
  styleUrls: ["./play-page.component.css"]
})
export class PlayPageComponent implements OnInit {
  private unsubscribe$ = new Subject<void>();
  private wordSubscription: Subscription;

  words$: Observable<any[]>;
  gameWords$: Observable<any[]>;
  isPlay$: Observable<boolean>;
  isPlay: boolean;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.words$ = this.store.select(selectWords);
    this.gameWords$ = this.store.select(selectGameWords);
    this.isPlay$ = this.store.select(selectIsPlay);

    this.getPlayState();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getPlayState() {
    this.isPlay$.pipe(takeUntil(this.unsubscribe$)).subscribe(isPlay => {
      this.isPlay = isPlay;
    });
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
        if (curWord.text === inputValue) {
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
    event.target.value = INITIALVAL;
  }

  toggleGamePlay() {
    if (!this.isPlay) {
      this.wordSubscription = this.words$.subscribe(wordData => {
        interval(INTERVALTIME)
          .pipe(
            takeWhile(n => n < wordData.length && this.isPlay),
            map(n => this.store.dispatch(setGameWord({ word: wordData[n] })))
          )
          .subscribe();
      });
      this.store.dispatch(toggleisPlay({ isPlay: true }));
    } else {
      this.wordSubscription.unsubscribe();
      this.resetState();
      this.store.dispatch(toggleisPlay({ isPlay: false }));
    }
  }

  resetState() {
    this.store.dispatch(resetState());
  }
}
