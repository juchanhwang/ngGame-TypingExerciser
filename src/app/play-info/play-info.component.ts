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
const TIMERTIME = 1000;
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

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.isPlay$ = this.store.select(selectIsPlay);
    this.score$ = this.store.select(selectScore);
    this.gameTime$ = this.store.select(selectGameTime);
    this.getCountTime();
    this.unsubscribeTimer();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  unsubscribeTimer() {
    this.isPlay$.subscribe(isPlay => {
      !isPlay ? this.gameTimerSubscription.unsubscribe() : null;
    });
  }

  getCountTime() {
    this.gameTimerSubscription = timer(TIMERTIME, TIMERTIME)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(time => this.store.dispatch(countTime({ time })));
  }
}
