import { GameWord } from '../../type';

export default function mapToGameWord(word): GameWord {
  const maxLeftPX = 1100;
  const { text } = word;
  return { text, top: 35, left: Math.floor(Math.random() * maxLeftPX) };
}
