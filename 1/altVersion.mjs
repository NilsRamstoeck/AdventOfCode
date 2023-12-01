import { readFile } from 'fs/promises';

const file = await readFile('1/input.txt') //get file as string
  .then(b => b.toString('utf8'))
  .then(file => file
    .replaceAll('\r\n', '\n')); //remove carriage return for windows compatibility


//Define parsing
const parseTree = {
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  'o': {
    'n': {
      'e': 1
    }
  },
  't': {
    'w': {
      'o': 2
    },
    'h': {
      'r': {
        'e': {
          'e': 3
        }
      }
    }
  },
  'f': {
    'o': {
      'u': {
        'r': 4
      }
    },
    'i': {
      'v': {
        'e': 5
      }
    }
  },
  's': {
    'i': {
      'x': 6
    },
    'e': {
      'v': {
        'e': {
          'n': 7
        }
      }
    }
  },
  'e': {
    'i': {
      'g': {
        'h': {
          't': 8
        }
      }
    }
  },
  'n': {
    'i': {
      'n': {
        'e': 9
      }
    }
  }
};

let sum = 0; //total sum
let num1; //first digit
let num2; //last digit
let curTree = parseTree; //current parsing state
for (const [i, char] of [...file].entries()) {
  const lookahead = file[i + 1]; //get lookahead
  if (char == '\n') { //if newline, reset and add digits to sum
    sum += (((num1 ?? null) * 10) + (num2 ?? 0));
    //reset
    num1 = undefined;
    num2 = undefined;
    curTree = parseTree;
    continue;
  }

  if (!curTree[char]) { //if char cant be parsed, reset state
    curTree = parseTree;
    continue;
  };

  if (typeof curTree[char] == 'number') { //if number has been parsed
    num1 = num1 ?? curTree[char]; //set first digit
    num2 = curTree[char]; //set last digit

    //if lookahead can be parsed, start new state there
    //this catches cases like 'sevenine'
    //where the start of a number is the end of the previous one
    if ((parseTree[char] ?? {})[lookahead]) {
      curTree = parseTree[char];
    } else {
      curTree = parseTree;
    }
    continue;
  }

  //if the lookahead can be parsed from the base state, reset to base
  //this catches cases like 'seveight'
  //where a char could be parsed as 'seven' but really belongs to 'eight'
  if (i < file.length - 1 && (parseTree[char] ?? {})[lookahead]) {
    curTree = parseTree[char];
    continue;
  }

  //If lookahead cant be parsed, reset state
  if (i < file.length - 1 && !(curTree[char] ?? {})[lookahead]) {
    curTree = parseTree;
    continue;
  }

  //advance state
  curTree = curTree[char];
}

//add last nums
sum += (((num1 ?? null) * 10) + (num2 ?? 0));

console.log(sum);