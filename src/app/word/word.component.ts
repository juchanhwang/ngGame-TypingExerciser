import { Component, OnInit, OnDestroy } from "@angular/core";
import { Store, select } from "@ngrx/store";
import {
  AppState,
  selectWords,
  selectGameWords,
  selectScore,
  selectIsPlay,
  selectGameTime
} from "../app.reducer";
import { Observable, interval, Subscription, Subject } from "rxjs";
import { loseScore, toggleisPlay, countTime, removeWord } from "../app.action";
import { switchMap, takeUntil } from "rxjs/operators";

@Component({
  selector: "app-word",
  templateUrl: "./word.component.html",
  styleUrls: ["./word.component.css"]
})
export class WordComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();

  isPlay$: Observable<boolean>;
  gameWords$: Observable<any[]>;
  score$: Observable<number>;
  gameTime$: Observable<number>;

  initTopVal: number = 35;
  maxWordTop: number = 380;
  fallingSpeed: number = 2;
  intervalTime: number = 60;
  isGameOver: boolean = false;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.isPlay$ = this.store.select(selectIsPlay);
    this.gameWords$ = this.store.select(selectGameWords);
    this.score$ = this.store.select(selectScore);
    this.gameTime$ = this.store.select(selectGameTime);

    this.getPlay();
    this.getWordTopVal();
  }

  toggleIsPlay(isPlay) {
    this.store.dispatch(toggleisPlay({ isPlay: isPlay.isTrue }));
  }

  getPlay() {
    this.score$.pipe(takeUntil(this.unsubscribe$)).subscribe(score => {
      if (score === 0) {
        this.isGameOver = true;
        this.toggleIsPlay({ isTrue: false });
        this.resetGameTime();
      } else {
        this.toggleIsPlay({ isTrue: true });
      }
    });
  }

  resetGameTime() {
    const resetTime = 0;
    this.store.dispatch(countTime({ time: resetTime }));
  }

  getWordTopVal() {
    this.gameWords$
      .pipe(
        switchMap(
          () => interval(this.intervalTime),
          gameWords => {
            gameWords.forEach((word, wordIdx) => {
              if (word.top < this.maxWordTop && !this.isGameOver) {
                word.top += this.fallingSpeed;
              } else if (word.top >= this.maxWordTop) {
                word.top = this.initTopVal;
                this.loseScore(word);
                this.removeWord(wordIdx);
              }
            });
          }
        ),
        takeUntil(this.unsubscribe$)
      )
      .subscribe();
  }

  loseScore(word) {
    this.store.dispatch(loseScore());
  }

  removeWord(wordIdx) {
    this.store.dispatch(removeWord({ idxOfInputVal: wordIdx }));
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
