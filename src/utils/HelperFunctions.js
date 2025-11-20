const shuffleArray = (arr) => {
  const newArr = [...arr];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

const pickRandom = (arr, n) => {
  const copy = shuffleArray(arr);
  return copy.slice(0, n);
};

export { shuffleArray, pickRandom };