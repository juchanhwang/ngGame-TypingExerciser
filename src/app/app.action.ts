import { createAction, props } from "@ngrx/store";
import { Word, GameWord } from '../type';


export const getWordData = createAction("[meta] getWordData");
export const setWordData = createAction("[meta] setWordData",props<{ wordData: Word[] }>());
export const setGameWord = createAction("[meta] set word", props<{ word: string }>());

export const toggleisPlay = createAction("isPlay", props<{ isPlay: boolean }>());
export const removeWord = createAction("removeWord", props<{ curWordIdx: number }>());
export const countTime = createAction("countTime", props<{ time: number }>());
export const addScore = createAction("addScore");
export const loseScore = createAction("loseScore");

export const resetState = createAction("[meta] resetState");