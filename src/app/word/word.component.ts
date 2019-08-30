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
import { loseScore, toggleisPlay, countTime } from "../app.action";
import { switchMap, takeUntil } from "rxjs/operators";

@Component({
  selector: "app-word",
  templateUrl: "./word.component.html",
  styleUrls: ["./word.component.css"]
})
export class WordComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  private intervalSubscription: Subscription;

  isPlay$: Observable<boolean>;
  gameWords$: Observable<any[]>;
  score$: Observable<number>;
  gameTime$: Observable<number>;

  maxWordTop: number = 380;
  fallingSpeed: number = 1;
  intervalTime: number = 60;
  isGameOver: boolean = false;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.isPlay$ = this.store.select(
      selectIsPlay,
      takeUntil(this.unsubscribe$)
    );
    this.gameWords$ = this.store.select(
      selectGameWords,
      takeUntil(this.unsubscribe$)
    );
    this.score$ = this.store.select(selectScore, takeUntil(this.unsubscribe$));
    this.gameTime$ = this.store.select(selectGameTime, takeUntil(this.unsubscribe$));

    this.getPlay();
    this.getWordTopVal();
  }

  toggleIsPlay(isPlay) {
    this.store.dispatch(toggleisPlay({ isPlay: isPlay.isTrue }));
  }

  getPlay() {
    this.score$.subscribe(score => {
      if (score === 0) {
        this.isGameOver = true;
        this.toggleIsPlay({ isTrue: false });
        this.resetGameTime()
      } else {
        this.toggleIsPlay({ isTrue: true });
      }
    });
  }

  resetGameTime() {
    this.store.dispatch(countTime(0))
  }

  getWordTopVal() {
    this.gameWords$.subscribe(words => {
      // this.intervalSubscription = interval(this.intervalTime).subscribe(() => {
      words.forEach(word => {
        console.log(word)
        if (word.top < this.maxWordTop && !this.isGameOver) {
          word.top += this.fallingSpeed;
        } else if (word.top === this.maxWordTop) {
          // this.loseScore(word);
          word.top++;
        }
      });
      // });
    });

    // this.gameWords$
    //   .pipe(
    //     switchMap(words => interval(this.intervalTime))
    //   )
    //   .subscribe((words) => {
    //     words.forEach(word => {
    //       if (word.top < this.maxWordTop && !this.isGameOver) {
    //         word.top += this.fallingSpeed;
    //       } else if (word.top === this.maxWordTop) {
    //         this.loseScore(word);
    //         word.top++;
    //       }
    //     });
    //   });
  }

  loseScore(word) {
    this.store.dispatch(loseScore());
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
