import { Component } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { Observable, interval } from "rxjs";

import { GameState, selectWords, selectGameWords, AppState } from "./app.reducer";
import { getWordData, setGameWord } from "./app.action";
import { AppService } from "./app.service";
import { takeWhile, map } from "rxjs/operators";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  wordData$;
  gameWords;

  constructor(private store: Store<AppState>) {
    this.gameWords = [];
  }
  ngOnInit() {
    this.store.select(selectWords).subscribe(wordData => {
      if (wordData.length > 0) {
        interval(1000).pipe(
          takeWhile(n => n < wordData.length),
          map(n =>  this.store.dispatch(setGameWord({ word: wordData[n] })))
        ).subscribe();
      }
    });
    this.store.dispatch(getWordData());
  }
}
