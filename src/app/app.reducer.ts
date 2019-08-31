import { createReducer, on, Action, createSelector } from "@ngrx/store";
import {
  removeWord,
  setWordData,
  toggleisPlay,
  setGameWord,
  updateGameWords,
  addScore,
  loseScore,
  countTime,
  resetState
} from "./app.action";
import { GameEffects } from "./app.effects";

export interface AppState {
  game: GameState;
}

export interface GameState {
  isPlay: boolean;
  words: any[];
  gameWords: any[];
  score: number;
  gameTime: number;
}

export const initialState: GameState = {
  isPlay: false,
  words: [],
  gameWords: [],
  score: 5,
  gameTime: 0
};

export const selectState = (state: AppState) => state.game;

export const selectIsPlay = createSelector(
  selectState,
  (state: GameState) => state.isPlay
);

export const selectWords = createSelector(
  selectState,
  (state: GameState) => state.words
);

export const selectGameWords = createSelector(
  selectState,
  (state: GameState) => state.gameWords
);

export const selectScore = createSelector(
  selectState,
  (state: GameState) => state.score
);

export const selectGameTime = createSelector(
  selectState,
  (state: GameState) => state.gameTime
);

export const gameReducer = createReducer(
  initialState,
  on(toggleisPlay, (state, { isPlay }) => {
    return { ...state, isPlay };
  }),
  on(setWordData, (state, { wordData }) => {
    return { ...state, words: wordData };
  }),
  on(setGameWord, (state, { word }) => {
    console.log(state, word)
    return { ...state, gameWords: [...state.gameWords, word] };
  }),
  on(updateGameWords, (state, { words }) => {
    return { ...state, gameWords: [...words] };
  }),
  on(removeWord, (state, action) => {
    return {
      ...state,
      gameWords: state.gameWords.filter(
        (item, index) => index !== action.curWordIdx
      )
    };
  }),
  on(addScore, state => {
    return { ...state, score: state.score + 1 };
  }),
  on(loseScore, state => {
    return { ...state, score: state.score - 1 };
  }),
  on(countTime, (state, action) => {
    return { ...state, gameTime: action.time };
  }),
  on(resetState, state => {
    return { ...state, initialState };
  })
);

export function reducer(state: GameState | undefined, action: Action) {
  return gameReducer(state, action);
}
