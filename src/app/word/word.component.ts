import { Component, OnInit } from "@angular/core";
import { Store, select } from "@ngrx/store";
import {
  AppState,
  selectWords,
  selectGameWords,
  selectScore,
  selectIsPlay
} from "../app.reducer";
import { Observable, interval, Subscription } from "rxjs";
import { loseScore, toggleisPlay } from "../app.action";
import { switchMap } from "rxjs/operators";

@Component({
  selector: "app-word",
  templateUrl: "./word.component.html",
  styleUrls: ["./word.component.css"]
})
export class WordComponent implements OnInit {
  private gameSubscription: Subscription;
  private intervalSubscription: Subscription;

  isPlay$: Observable<boolean> = this.store.select(selectIsPlay);
  gameWords$: Observable<any[]> = this.store.select(selectGameWords);
  score$: Observable<number> = (this.score$ = this.store.select(selectScore));
  maxWordTop: number = 380;
  fallingSpeed: number = 1;
  intervalTime: number = 60;
  isGameOver: boolean = false;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.store.dispatch(toggleisPlay({ isPlay: true }));

    // 원상 복귀
    this.gameSubscription = this.gameWords$.subscribe(words => {
      // console.log(words);
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

    this.unsubscribeGameWords();
  }

  unsubscribeGameWords() {
    this.score$.subscribe(score => {
      if (score === 0) {
        this.isGameOver = true;
        this.gameSubscription.unsubscribe();
        this.intervalSubscription.unsubscribe();
        this.store.dispatch(toggleisPlay({ isPlay: false }));
      }
    });
  }

  loseScore(word) {
    this.store.dispatch(loseScore());
    word.top++;
  }
}
