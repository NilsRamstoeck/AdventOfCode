import { readFile } from "fs/promises";

const file =
  await readFile('4/input.txt').then(b => b.toString('utf8'));
//   await Promise.resolve(`\
//   Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
//   Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
//   Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
//   Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
//   Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
//   Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11
//   \
// `);



let sum = 0;
let amount = 0;
let cursor = 0;

const duplicates = {};

while (cursor < file.length) {
  if (file[cursor] != 'C') {
    cursor++;
    continue;
  }

  let points = 0;

  for (const tokenChar of 'Card') {
    const char = file[cursor];
    if (tokenChar != char) throw new Error('Unexpected Token: ' + tokenChar);
    cursor++;
  }

  while (isNaN(Number(file[cursor] + '.'))) { //advance to game number
    cursor++;
  }

  let gameNumber = '';

  while (!isNaN(Number(file[cursor] + '.'))) { //advance past game number
    gameNumber += file[cursor];
    cursor++;
  }

  gameNumber = Number(gameNumber);

  let winning = new Set();
  while (file[cursor] != '|') {
    let num = '';

    while (isNaN(Number(file[cursor] + '.'))) {
      cursor++;
    }

    while (!isNaN(Number(file[cursor] + '.'))) {
      num += file[cursor];
      cursor++;
    }

    while (isNaN(Number(file[cursor] + '.'))) {
      if (file[cursor] == '|') break;
      cursor++;
    }

    num = Number(num);
    winning.add(num);
  }

  while (file[cursor] != 'C' && cursor < file.length) {
    let num = '';
    while (isNaN(Number(file[cursor] + '.'))) {
      cursor++;
    }
    while (!isNaN(Number(file[cursor] + '.'))) {
      num += file[cursor];
      cursor++;
    }
    while (isNaN(Number(file[cursor] + '.')) && cursor < file.length) {
      if (file[cursor] == 'C') break;
      cursor++;
    }
    num = Number(num);
    if (winning.has(num)) points++;
  }

  amount++;
  if (points) {
    for (let j = 0; j <= (duplicates[gameNumber] ?? 0); j++) {
      for (let i = 1; i <= points; i++) {
        amount++;
        duplicates[gameNumber + i] = (duplicates[gameNumber + i] ?? 0) + 1;
      }
    }
  }

  if (points > 0) points = 2 ** (points - 1);
  sum += points;

}

console.log(sum, amount, 30);