import { readFile } from "fs/promises";

const file =
  await readFile('5/input.txt').then(b => b.toString('utf8'));
  await Promise.resolve(`\
seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4\
`);

function isWhitespace(char) {
  return char.trim().length == 0;
}

performance.mark('start solve');

let mapTokens = [
  'seed-to-soil map:',
  'soil-to-fertilizer map:',
  'fertilizer-to-water map:',
  'water-to-light map:',
  'light-to-temperature map:',
  'temperature-to-humidity map:',
  'humidity-to-location map:',
];
let cursor = 0;

//advance to beginning of input
while (isWhitespace(file[cursor])) cursor++;

//consume seeds string
cursor += 7; //seeds:

//advance to seeds
while (isWhitespace(file[cursor])) cursor++;

//read in seeds
const seeds = [];
const locations = [];
while (file[cursor] != 's') {
  let seed = '';
  while (!isWhitespace(file[cursor])) {
    seed += file[cursor];
    cursor++;
  }
  seeds.push(Number(seed));
  locations.push(Number(seed));
  while (isWhitespace(file[cursor])) cursor++;
}

for (const token of mapTokens) {
  cursor += token.length;

  const mapped = [];
  while (!isNaN(Number(file[cursor]))) {
    const map = [];
    for (let i = 0; i < 3; i++) {

      //advance to map
      while (isWhitespace(file[cursor])) cursor++;

      let num = '';
      while (cursor < file.length && !isWhitespace(file[cursor])) {
        num += file[cursor];
        cursor++;
      }
      map.push(Number(num));
    }

    for (let i = 0; i < locations.length; i++) {
      if (mapped.includes(i)) continue;
      const valueToMap = locations[i];
      if (valueToMap >= map[1] && valueToMap < (map[1] + map[2])) {
        // if (token == mapTokens[2]) {
        //   // console.log({ seed, valueToMap, map, result: map[0] + valueToMap - map[1] });
        // }
        locations[i] = map[0] + valueToMap - map[1];
        mapped.push(i);
      } else {
        mapped[i] = valueToMap;
      }
    }

    while (cursor < file.length && isWhitespace(file[cursor])) cursor++;
  }
  // console.log({ token, seeds, locations });

}


/*
Seed 79, soil 81, fertilizer 81, water 81, light 74, temperature 78, humidity 78, location 82.
Seed 14, soil 14, fertilizer 53, water 49, light 42, temperature 42, humidity 43, location 43.
Seed 55, soil 57, fertilizer 57, water 53, light 46, temperature 82, humidity 82, location 86.
Seed 13, soil 13, fertilizer 52, water 41, light 34, temperature 34, humidity 35, location 35.
*/
const answer = Math.min(...locations);
performance.mark('stop solve');
// console.log(seeds, locations);
console.log(answer, 13);

console.log(performance.measure('solve', 'start solve', 'stop solve'));