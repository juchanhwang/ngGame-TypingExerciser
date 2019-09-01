import { Component, OnInit, Input, OnDestroy } from "@angular/core";
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
  countTime,
  updateSpeedLevel
} from "../app.action";
import mapToGameWord from "../utils/makeWordData";
import { GameWord, Word } from "../../type";
const INITIALVAL = "";
const INTERVALTIME = 1000;
const ZERO_SCORE = 0;
const RESET_TIME = 0;
const DELAY_TIME = 3000;
const MAX_GAGE = 10;
const RESET_GAGE = 0;
@Component({
  selector: "app-play-page",
  templateUrl: "./play-page.component.html",
  styleUrls: ["./play-page.component.css"]
})
export class PlayPageComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  private wordSubscription: Subscription;

  words$: Observable<any[]>;
  gameWords$: Observable<GameWord[]>;
  score$: Observable<number>;
  isPlay$: Observable<boolean>;
  isPlay: boolean;
  isGameOver: boolean = false;
  speedLevelGage: number = 0;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.words$ = this.store.select(selectWords);
    this.gameWords$ = this.store.select(selectGameWords);
    this.isPlay$ = this.store.select(selectIsPlay);
    this.score$ = this.store.select(selectScore);

    this.getPlayState();
    this.getGameOver();
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

  getGameOver() {
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
    this.getSpeedLevelGage();
    this.store.dispatch(addScore());
  }

  getSpeedLevelGage() {
    if (this.speedLevelGage === MAX_GAGE) {
      this.store.dispatch(updateSpeedLevel());
      this.speedLevelGage = RESET_GAGE;
    } else {
      this.speedLevelGage++;
    }
  }

  initInputVal(event) {
    event.target.value = INITIALVAL;
  }

  toggleGamePlay() {
    !this.isPlay ? this.setGameWord() : this.resetGameWord();
  }

  setGameWord() {
    this.wordSubscription = this.words$.subscribe(wordData => {
      interval(INTERVALTIME)
        .pipe(
          takeWhile(n => n < wordData.length && this.isPlay),
          map(n => this.store.dispatch(setGameWord({ word: wordData[n] })))
        )
        .subscribe();
    });
    this.store.dispatch(toggleisPlay({ isPlay: true }));
  }

  resetGameWord() {
    this.wordSubscription.unsubscribe();
    this.resetState();
  }

  resetState() {
    this.store.dispatch(resetState());
  }
}
