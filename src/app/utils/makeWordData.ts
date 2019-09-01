import { GameWord } from '../../type';
const MAX_X_PX = 1100;

export default function mapToGameWord(word): GameWord {
  const { text } = word;
  return { text, Y: 35, X: Math.floor(Math.random() * MAX_X_PX) };
}
