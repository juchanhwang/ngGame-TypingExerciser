import { Component, OnInit, OnDestroy } from "@angular/core";
import { Store, select } from "@ngrx/store";
import {
  AppState,
  selectScore,
  selectIsPlay,
  selectGameTime
} from "../app.reducer";
import { countTime } from "../app.action";
import { Observable, Subject, timer, Subscribable, Subscription } from "rxjs";

@Component({
  selector: "app-play-info",
  templateUrl: "./play-info.component.html",
  styleUrls: ["./play-info.component.css"]
})
export class PlayInfoComponent implements OnInit, OnDestroy {
  countTimeSubscription: Subscription;

  gameTime$: Observable<number>;
  second: number = 1000;
  isPlay$: Observable<boolean>;
  score$: Observable<number>;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.score$ = this.store.select(selectScore);
    this.gameTime$ = this.store.select(selectGameTime);
    this.isPlay$ = this.store.select(selectIsPlay);
    this.getCountTime();
  }

  getCountTime() {
    const gameTimer = timer(this.second, this.second);
    this.countTimeSubscription = gameTimer.subscribe(time =>
      this.store.dispatch(countTime({ time }))
    );
  }

  ngOnDestroy() {
    this.countTimeSubscription.unsubscribe();
  }
}
