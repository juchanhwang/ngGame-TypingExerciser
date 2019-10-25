import { createReducer, on, Action, createSelector } from "@ngrx/store";
import {
  removeWord,
  setWordData,
  toggleisPlay,
  setGameWord,
  addScore,
  loseScore,
  countTime,
  resetState,
  updateSpeedLevel
} from "./app.action";
import { GameEffects } from "./app.effects";
import { GameWord } from '../../type';
import mapToGameWord from '../component/utils/makeWordData';

export interface AppState {
  game: GameState;
}

export interface GameState {
  isPlay: boolean;
  words: { text: string }[];
  gameWords: GameWord[];
  score: number;
  gameTime: number;
  speedLevel: number;
}

export const initialState: GameState = {
  isPlay: false,
  words: [],
  gameWords: [],
  score: 5,
  gameTime: 0,
  speedLevel: 0
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

export const selectSpeedLevel = createSelector(
  selectState,
  (state: GameState) => state.speedLevel
);

export const gameReducer = createReducer(
  initialState,
  on(toggleisPlay, (state, { isPlay }) => {
    return { ...state, isPlay };
  }),
  on(setWordData, (state, { wordData }) => {
    debugger;
    console.log(state, wordData)
    return { ...state, words: wordData };
  }),
  on(setGameWord, (state, { word }) => {
    return { ...state, gameWords: [...state.gameWords, mapToGameWord(word)] };
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
  on(updateSpeedLevel, state => {
    return { ...state, speedLevel: state.speedLevel + 1 };
  }),
  on(resetState, ({ words }) => {
    return { ...initialState, words };
  })
);