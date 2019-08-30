import { Component, OnInit, OnDestroy } from "@angular/core";
import { Store, select } from "@ngrx/store";
import {
  AppState,
  selectWords,
  selectGameWords,
  selectScore,
  selectIsPlay
} from "../app.reducer";
import { Observable, interval, Subscription, Subject } from "rxjs";
import { loseScore, toggleisPlay } from "../app.action";
import { switchMap, takeUntil } from "rxjs/operators";

@Component({
  selector: "app-word",
  templateUrl: "./word.component.html",
  styleUrls: ["./word.component.css"]
})
export class WordComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  private intervalSubscription: Subscription;

  isPlay$: Observable<boolean> = this.store.select(
    selectIsPlay,
    takeUntil(this.unsubscribe$)
  );
  gameWords$: Observable<any[]> = this.store.select(
    selectGameWords,
    takeUntil(this.unsubscribe$)
  );
  score$: Observable<number> = this.store.select(
    selectScore,
    takeUntil(this.unsubscribe$)
  );
  maxWordTop: number = 380;
  fallingSpeed: number = 1;
  intervalTime: number = 60;
  isGameOver: boolean = false;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.store.dispatch(toggleisPlay({ isPlay: true }));
    this.getPlay();
    this.getWordTopVal();
  }

  getPlay() {
    this.score$.subscribe(score => {
      if (score === 0) {
        this.isGameOver = true;
        this.store.dispatch(toggleisPlay({ isPlay: false }));
      } else {
        this.store.dispatch(toggleisPlay({ isPlay: true }));
      }
    });
  }

  getWordTopVal() {
    this.gameWords$.subscribe(words => {
      this.intervalSubscription = interval(this.intervalTime).subscribe(() => {
        words.forEach(word => {
          if (word.top < this.maxWordTop && !this.isGameOver) {
            word.top += this.fallingSpeed;
          } else if (word.top === this.maxWordTop) {
            this.loseScore(word);
          }
        });
      });
    });
  }

  loseScore(word) {
    this.store.dispatch(loseScore());
    word.top++;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
