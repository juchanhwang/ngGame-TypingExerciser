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
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-play-info",
  templateUrl: "./play-info.component.html",
  styleUrls: ["./play-info.component.css"]
})
export class PlayInfoComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();

  gameTimerSubscription: Subscription;

  isPlay$: Observable<boolean>;
  gameTime$: Observable<number>;
  score$: Observable<number>;
  second: number = 1000;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.isPlay$ = this.store.select(selectIsPlay);
    this.score$ = this.store.select(selectScore);
    this.gameTime$ = this.store.select(selectGameTime);
    this.getCountTime();
    this.unsubscribeTimer();
  }

  unsubscribeTimer() {
    this.isPlay$.subscribe(isPlay => {
      !isPlay ? this.gameTimerSubscription.unsubscribe() : null;
    });
  }

  getCountTime() {
    this.gameTimerSubscription = timer(this.second, this.second)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(time => this.store.dispatch(countTime({ time })));
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
