import { Component, OnInit } from "@angular/core";
import { Store, select } from "@ngrx/store";
import {
  AppState,
  selectWords,
  selectGameWords,
  selectScore,
  selectIsPlay
} from "../app.reducer";
import { Observable, Subject, timer, interval, Subscription } from "rxjs";
import { updateGameWords, loseScore, toggleisPlay } from "../app.action";

@Component({
  selector: "app-word",
  templateUrl: "./word.component.html",
  styleUrls: ["./word.component.css"]
})
export class WordComponent implements OnInit {
  private gameSubscription: Subscription;
  private intervalSubscription: Subscription;
  private unsubscribe$ = new Subject<void>();

  isPlay$: Observable<boolean>;
  maxWordTop: number = 380;
  fallingSpeed: number = 1;
  intervalTime: number = 60;
  gameWords$: Observable<any[]>;
  score$: Observable<number>;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.score$ = this.store.select(selectScore);
    this.gameWords$ = this.store.select(selectGameWords);
    this.isPlay$ = this.store.select(selectIsPlay);
    this.store.dispatch(toggleisPlay({ isPlay: true }));

    this.gameSubscription = this.gameWords$.subscribe(words => {
      this.intervalSubscription = interval(this.intervalTime).subscribe(() => {
        words.forEach(word => {
          word.top < this.maxWordTop
            ? (word.top += this.fallingSpeed)
            : word.top === this.maxWordTop
            ? this.loseScore(word)
            : null;
        });
      });
    });

    this.renderGameWords();

  }

  renderGameWords() {
    this.score$.subscribe(score => {
      if (score === 0) {
        debugger;
        this.gameSubscription.unsubscribe();
        this.intervalSubscription.unsubscribe();
        this.store.dispatch(toggleisPlay({ isPlay: false }));
      } else {
      }
    });
  }

  loseScore(word) {
    this.store.dispatch(loseScore());
    word.top++;
  }

}
