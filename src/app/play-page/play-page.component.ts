import { Component, OnInit, Input } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { Observable, Subject, interval, Subscription, timer } from "rxjs";
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
  setGameWord,
  countTime
} from "../app.action";
import mapToGameWord from "../utils/makeWordData";
const INITIALVAL = "";
const INTERVALTIME = 1000;
const ZERO_SCORE = 0;
const RESET_TIME = 0;
const DELAY_TIME = 3000;
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
  score$: Observable<number>;
  isPlay$: Observable<boolean>;
  isPlay: boolean;
  isGameOver: boolean = false;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.words$ = this.store.select(selectWords);
    this.gameWords$ = this.store.select(selectGameWords);
    this.isPlay$ = this.store.select(selectIsPlay);
    this.score$ = this.store.select(selectScore);

    this.getPlay();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getPlay() {
    this.isPlay$.pipe(takeUntil(this.unsubscribe$)).subscribe(isPlay => {
      this.isPlay = isPlay;
    });

    this.score$.pipe(takeUntil(this.unsubscribe$)).subscribe(score => {
      if (score === ZERO_SCORE) {
        this.isGameOver = true;
        this.resetGameTime();
        timer(DELAY_TIME).subscribe(() => this.resetState());
      } else {
        this.isGameOver = false;
      }
    });
  }

  toggleIsPlay(isPlay) {
    this.store.dispatch(toggleisPlay({ isPlay: isPlay.isTrue }));
  }

  resetGameTime() {
    this.store.dispatch(countTime({ time: RESET_TIME }));
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
      curWordIdx = gameWords.findIndex(curWord => curWord.text === inputValue);
    });
    curWordIdx >= 0 ? this.addScore() : null;

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
    }
  }

  resetState() {
    this.store.dispatch(resetState());
  }
}
