const fs = require('fs/promises');

const numMap = {
  'one': 'o1ne',
  'two': 't2wo',
  'three': 't3hree',
  'four': 'f4our',
  'five': 'f5ive',
  'six': 's6ix',
  'seven': 's7even',
  'eight': 'e8ight',
  'nine': 'n9ine',
};

fs.readFile(__dirname + '/input.txt')
// Promise.resolve(`two1nine
// eightwothree
// abcone2threexyz
// xtwone3four
// 4nineeightseven2
// zoneight234
// 7pqrstsixteen
// `)
  .then(b => b.toString('utf8'))
  .then(file => file
    .replaceAll('\r\n', '\n')
    .split('\n')
    .map(line => { //part 2
      let newLine = line;
      for (const numberString in numMap) {
        newLine = newLine.replaceAll(numberString, numberString + numMap[numberString]);
      }
      return newLine;
    })
    // .forEach(el => console.log(el))
    .map(line => /^[^0-9]*([0-9]?).*([0-9]).*$/.exec(line))
    .map(regexResult => regexResult ? (regexResult[1] || regexResult[2]) + regexResult[2] : 0)
    .reduce((prev, cur) => Number(cur) + Number(prev))
  )
  .then(result => console.log(result));