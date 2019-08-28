import { Component, OnInit, Input } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { Observable, Subject, interval } from "rxjs";
import { takeUntil, takeWhile } from "rxjs/operators";

import {
  AppState,
  selectIsPlay,
  selectWords,
  selectGameWords,
  selectScore
} from "../app.reducer";
import { toggleisPlay, removeWord, addScore } from "../app.action";

@Component({
  selector: "app-play-page",
  templateUrl: "./play-page.component.html",
  styleUrls: ["./play-page.component.css"]
})
export class PlayPageComponent implements OnInit {
  isPlay$: Observable<boolean>;
  isPlay: boolean;
  words$: Observable<any[]>;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.startGame();
    this.store.select(selectScore).subscribe(score => {
      if (score === 0) {
        this.isPlay = false;
        this.store.dispatch(toggleisPlay({ isPlay: this.isPlay }));
      }
    });
  }

  startGame() {
    this.isPlay = true;
    this.isPlay$ = this.store.select(selectIsPlay);
    this.store.dispatch(toggleisPlay({ isPlay: this.isPlay }));
  }

  inputEvent(event) {
    const inputValue = event.target.value;
    this.removeWord(inputValue);
    event.target.value = "";
  }

  removeWord(inputValue) {
    let idxOfInputVal = this.getIdxOfInputVal(inputValue);
    this.store.dispatch(removeWord({ idxOfInputVal }));
  }

  getIdxOfInputVal(inputValue) {
    let IdxOfInputVal;
    this.store.select(selectGameWords).subscribe(words => {
      words.forEach((element, idx) => {
        if (element.word === inputValue) {
          IdxOfInputVal = idx;
          this.addScore();
        }
      });
    });

    return IdxOfInputVal;
  }

  addScore() {
    this.store.dispatch(addScore());
  }
}
