const file =
  `\
  Time:        56     97     78     75
  Distance:   546   1927   1131   1139\
  `;
// `\
// Time:      7  15   30
// Distance:  9  40  200\
// `;

function getPartTwoTime(tokens) {
  const timeTokens = [];
  for (const compareToken in tokens) {
    if (!isTime(compareToken, tokens)) continue;
    if (tokens[compareToken] == tokens["Time:"]) continue;
    timeTokens.push({ token: compareToken, location: tokens[compareToken] });
  }
  return timeTokens.sort(({ location: a }, { location: b }) => a - b).reduce((prev, cur) => prev + cur.token, '');
}

function getPartTwoDistance(tokens) {
  const distanceTokens = [];
  for (const compareToken in tokens) {
    if (isTime(compareToken, tokens)) continue;
    if (tokens[compareToken] == tokens["Distance:"]) continue;
    distanceTokens.push({ token: compareToken, location: tokens[compareToken] });
  }
  return distanceTokens.sort(({ location: a }, { location: b }) => a - b).reduce((prev, cur) => prev + cur.token, '');
}

function countWaysToWin(time, distance) {
  let wins = 0;
  for (let i = 0; i < time; i++) {
    const reached = i * (time - i);
    if (reached > distance) wins++;
  }
  return wins;
}

function isWhitespace(str) {
  return !str || str.trim().length == 0;
}

function isNumber(str) {
  return !isNaN(Number(str)) && !isWhitespace(str);
}

function isTime(token, tokens) {
  return tokens[token] < tokens['Distance:'];
}

function findDistanceForTime(token, tokens) {
  let preCount = 0;
  const distanceLocation = tokens['Distance:'];

  for (const compareToken in tokens) {
    if (!isTime(compareToken, tokens)) continue;
    const tokenLocation = tokens[compareToken];
    if (tokenLocation < tokens[token]) preCount++;
  }

  for (const distanceToken in tokens) {
    if (isTime(distanceToken, tokens)) continue;
    if (tokens[distanceToken] == distanceLocation) continue;
    let dPreCount = 0;
    for (const compareToken in tokens) {
      if (isTime(compareToken, tokens)) continue;
      if (tokens[distanceToken] == distanceLocation) continue;
      const tokenLocation = tokens[compareToken];
      if (tokenLocation < tokens[distanceToken]) dPreCount++;
    }
    if (preCount == dPreCount) return distanceToken;
  }
}

function shuffle(sourceArray, iterations) {
  const targetArray = sourceArray;
  for (let iteration = 0; iteration < iterations; iteration++) {
    for (let i = 0; i < targetArray.length - 2; i++) {
      const newIndex = Math.floor(Math.random() * (targetArray.length));
      if (newIndex == i) continue;

      //look mom, no allocating :)
      targetArray[i] = targetArray[newIndex] + targetArray[i];
      targetArray[newIndex] = targetArray[i] - targetArray[newIndex];
      targetArray[i] = targetArray[i] - targetArray[newIndex];
    }
  }
  return targetArray;
}

performance.mark('start solve');


const tokens = {};

const randomizedIndices = shuffle([...file].map((_, i) => i), 100);

for (const randomIndex of randomizedIndices) {
  if (isWhitespace(file[randomIndex])) continue;

  let cursor = randomIndex;
  while (!isWhitespace(file[cursor - 1])) cursor--;

  const begin = cursor;
  while (!isWhitespace(file[cursor])) cursor++;
  tokens[file.slice(begin, cursor)] = randomIndex;

}

let answer = 0;
for (const token in tokens) {
  if (!isNumber(token)) continue;
  if (!isTime(token, tokens)) continue;

  const time = Number(token);
  const distance = Number(findDistanceForTime(token, tokens));

  const wins = countWaysToWin(time, distance);
  if (!answer) answer = wins;
  else answer *= wins;
}

const partTwoTime = Number(getPartTwoTime(tokens));
const partTwoDistance = Number(getPartTwoDistance(tokens));
const partTwoAnswer = countWaysToWin(partTwoTime, partTwoDistance);
performance.mark('stop solve');

console.log(answer, partTwoAnswer);
console.log(performance.measure('solve', 'start solve', 'stop solve'));