import { Component, OnInit, OnDestroy } from "@angular/core";
import { Store, select } from "@ngrx/store";
import {
  AppState,
  selectWords,
  selectGameWords,
  selectScore,
  selectIsPlay,
  selectGameTime,
  selectSpeedLevel
} from "../app.reducer";
import { Observable, interval, Subscription, Subject } from "rxjs";
import {
  loseScore,
  toggleisPlay,
  countTime,
  removeWord,
  updateSpeedLevel
} from "../app.action";
import { switchMap, takeUntil, tap, mergeMap, withLatestFrom, map } from "rxjs/operators";
import { GameWord } from "../../type";
const INTERVAL_TIME = 60;
const INITIAL_Y_VALUE = 35;
const MAX_WORD_Y = 380;
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
  score$: Observable<number>;
  speedLevel$: Observable<number>;

  isGameOver: boolean = false;
  fallingSpeed: number = 5;
  nextSpeedLevel: number = 1;

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.isPlay$ = this.store.select(selectIsPlay);
    this.gameWords$ = this.store.select(selectGameWords);
    this.score$ = this.store.select(selectScore);
    this.speedLevel$ = this.store.select(selectSpeedLevel);

    this.showFallingWords();
    this.updateFallingSpeed();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  showFallingWords() {
    interval(INTERVAL_TIME).pipe(
      withLatestFrom(this.gameWords$), // outer observable이 돌아간 시점의 gameWord 상태값을 가져옴
      map(([, gameWords]) => this.getWordXVal(gameWords)),
      takeUntil(this.unsubscribe$)
    )
      .subscribe();
  }

  getWordXVal(gameWords) {
    gameWords.forEach((word, wordIdx) => {
      if (word.Y < MAX_WORD_Y && !this.isGameOver) {
        word.Y += this.fallingSpeed;
      } else if (word.Y >= MAX_WORD_Y) {
        word.Y = INITIAL_Y_VALUE;
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

  updateFallingSpeed() {
    this.speedLevel$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(speedLevel => {
        if (this.nextSpeedLevel === speedLevel) {
          this.fallingSpeed = this.fallingSpeed * 1.5;
          this.nextSpeedLevel++;
        }
      });
  }
}
