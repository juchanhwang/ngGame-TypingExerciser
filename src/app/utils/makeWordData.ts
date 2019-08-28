export default function makeWordData(wordData) {
  const maxLeftPX = 1100;
  const setData = wordData.map((val, idx) => {
    const result = {
      word: "",
      left: 0,
      top: 35,
    };
    result.word = val.text;
    result.left = Math.floor(Math.random() * maxLeftPX);
    return result;
  });

  return setData;
}