import { readFile } from "fs/promises";

const file =
  (await readFile('3/input.txt').then(b => b.toString('utf8'))).replaceAll('\r\n', '\n');
// await Promise.resolve(`\
// 467..114..
// ...*......
// ..35..633.
// ......#..1
// 617*......
// .....+.58.
// ..592.....
// ......755.
// ...$.*....
// .664.598..\
// `);

const width = file.indexOf('\n') + 1;
let ids = [];
let sum = 0;
let ratio = 0;
for (let i = 0; i < file.length; i++) {
  const char = file[i];
  if (char == '.') continue;

  if (!isNaN(Number(char))) continue;

  const x = i % width;
  const y = Math.floor(i / width);
  const surrounding = [
    [x - 1, y - 1], [x, y - 1], [x + 1, y - 1],
    [x - 1, y], /*symbol*/[x + 1, y],
    [x - 1, y + 1], [x, y + 1], [x + 1, y + 1],
  ];

  const gears = [];
  for (const [x2, y2] of surrounding) {
    let index = x2 + y2 * width;
    let num = '';

    if (isNaN(Number(file[index] + '.'))) continue; //check if num

    //walk to beginning of num
    while (!isNaN(Number(file[index] + '.'))) {
      index--;
    }

    index++;//the walk goes to the char in front of the num

    if (ids.includes(index)) continue; //prevent duplicates
    ids.push(index);

    //read in full number
    while (!isNaN(Number(file[index] + '.'))) {
      num += file[index];
      index++;
    }

    num = Number(num); //add num to sum
    sum += num;
    gears.push(num);
  }
  if (gears.length == 2 && char == '*') ratio += gears[0] * gears[1];
}

console.log({sum, ratio});