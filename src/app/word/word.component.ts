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
import { switchMap, takeUntil, tap, mergeMap } from "rxjs/operators";
import { GameWord } from "../../type";
const INTERVAL_TIME = 60;
const INITIAL_TOP_VALUE = 35;
const MAX_WORD_TOP = 380;
const FALLING_SPEED = 2;

@Component({
  selector: "app-word",
  templateUrl: "./word.component.html",
  styleUrls: ["./word.component.css"]
})
export class WordComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();

  isPlay$: Observable<boolean>;
  gameWords$: Observable<GameWord[]>;

  isGameOver: boolean = false;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.isPlay$ = this.store.select(selectIsPlay);
    this.gameWords$ = this.store.select(selectGameWords);

    this.showFallingWords();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  showFallingWords() {
    this.gameWords$
      .pipe(
        switchMap(
          () => interval(INTERVAL_TIME),
          gameWords => this.getWordTopVal(gameWords)
        ),
        takeUntil(this.unsubscribe$)
      )
      .subscribe();
  }

  getWordTopVal(gameWords) {
    gameWords.forEach((word, wordIdx) => {
      if (word.top < MAX_WORD_TOP && !this.isGameOver) {
        word.top += FALLING_SPEED;
      } else if (word.top >= MAX_WORD_TOP) {
        word.top = INITIAL_TOP_VALUE;
        this.loseScore();
        this.removeWord(wordIdx);
      }
    });
  }

  loseScore() {
    this.store.dispatch(loseScore());
  }

  removeWord(wordIdx) {
    this.store.dispatch(removeWord({ curWordIdx: wordIdx }));
  }
}
