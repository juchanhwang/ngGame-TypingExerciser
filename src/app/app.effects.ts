import { Injectable } from "@angular/core";
import { Actions, ofType, createEffect } from "@ngrx/effects";
import { EMPTY } from "rxjs";
import { map, mergeMap, catchError, takeWhile } from "rxjs/operators";
import { AppService } from "./app.service";
import { getWordData, setWordData } from "./app.action";
import makeWordData from "./utils/makeWordData";
import { Word } from '../type';

@Injectable()
export class GameEffects {
  loadWordList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getWordData),
      mergeMap(() =>
        this.apiService.getWordList().pipe(
          map((wordData: Word[]) =>  setWordData({ wordData })),
          catchError(() => EMPTY)
        )
      )
    )
  );

  constructor(private actions$: Actions, private apiService: AppService) {}
}
