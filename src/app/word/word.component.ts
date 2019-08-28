import { Component, OnInit } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { AppState, selectWords, selectGameWords } from "../app.reducer";
import { Observable, Subject, timer, interval } from "rxjs";
import { updateGameWords, loseScore } from "../app.action";

@Component({
  selector: "app-word",
  templateUrl: "./word.component.html",
  styleUrls: ["./word.component.css"]
})
export class WordComponent implements OnInit {
  maxWordTop: number = 380;
  fallingSpeed: number = 1;
  intervalTime: number = 60;
  gameWords$: Observable<any[]>;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.gameWords$ = this.store.select(selectGameWords);
    this.gameWords$.subscribe(words => {
      if (words.length > 0) {
        interval(this.intervalTime).subscribe(() => {
          words.forEach(word => {
            word.top < this.maxWordTop ? (word.top += this.fallingSpeed) : 
            word.top === this.maxWordTop ? this.loseScore(word) :
            null;
          });
        });
      }
    });
  }

  loseScore(word) {
    this.store.dispatch(loseScore())
    word.top++;
  }
}
