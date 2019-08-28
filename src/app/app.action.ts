import { createAction, props } from "@ngrx/store";


export const getWordData = createAction("[meta] getWordData");
export const setWordData = createAction("[meta] setWordData",props<{ wordData }>());
export const setGameWord = createAction("[meta] set word", props<{ word }>());
export const updateGameWords = createAction("[meta] update game words", props<{ words }>());

export const toggleisPlay = createAction("isPlay", props<{ isPlay }>());
export const removeWord = createAction("removeWord", props<{ idxOfInputVal: number }>());
export const countTime = createAction("countTime", props<{ time: number }>());
export const addScore = createAction("addScore");
export const loseScore = createAction("loseScore");
