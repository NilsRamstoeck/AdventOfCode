import { readFile } from "fs/promises";

const file =
  await readFile('2/input.txt').then(b => b.toString('utf8'));
//   await Promise.resolve(`
// Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
// Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
// Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
// Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
// Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`);

/// Tokenization ///

const TokenSpec = [
  //Whitespace
  [/^\s+/, null],

  //Semicolon
  [/^;+/, ';', ''],

  //Colon
  [/^:+/, ':', ''],

  //Comma
  [/^,+/, ',', ''],

  //Game Keyword
  [/^Game/, 'GAME', ''],

  //Identifier
  [/^[a-z]+/, 'IDENTIFIER'],

  //Numbers
  [/^\d+/, 'NUMBER'],

];

class Tokenizer {

  _string;
  _cursor;

  constructor(string) {
    this._string = string;
    this._cursor = 0;
  }

  hasMoreTokens() {
    return this._cursor < this._string.length;
  }

  isEOF() {
    return this._cursor >= this._string.length;
  }

  getNextToken(lookahead = false) {
    if (!this.hasMoreTokens()) return null;

    const token = this._string.slice(this._cursor);
    for (const [regexp, type, defaultValue] of TokenSpec) {
      const [value] = regexp.exec(token) ?? [null];
      if (value == null) continue; //cant match
      if (!lookahead || type == null) this._cursor += value.length;
      if (type == null) return this.getNextToken(lookahead); //ignore token
      // console.log({ type, value: defaultValue ?? value, lookahead });
      return {
        type,
        value: defaultValue ?? value,
        start: this._cursor - value.length,
        stop: this._cursor,
      };
    }

    throw SyntaxError(`Unexpected Token: '${token.split(' ')[0]}'\n\t${/^.*$/.exec(token)}`);
  }
}

/// Parser ///

class Parser {
  _tokenizer;
  _token;

  parse(string) {

    this._tokenizer = new Tokenizer(string);
    this._token = this._tokenizer.getNextToken();

    try {
      return this.Game();
    } catch (e) {
      console.log(e);
    }

  }

  Game() {
    const body = [];

    while (this._token) {

      body.push(this.GameStatement());

    }

    return {
      type: 'Game',
      body,
      start: 0,
      stop: body[body.length - 1].stop
    };
  }

  GameStatement() {
    if (!this._token) {
      throw new SyntaxError(
        `Unexpected end of input, expected Statement`
      );
    }

    //Game Statement start with the game keyword
    const { start } = this._eat('GAME');

    //Followed by game id
    const { value: id, stop } = this._eat('NUMBER');
    // console.log(id);

    //Followed by a colon
    this._eat(':');


    const maxValues = {
      red: 0,
      green: 0,
      blue: 0
    };
    //Now parse the game info
    while (this._token && this._token.type != 'GAME') {
      const { red, green, blue } = this.DrawStatement();
      maxValues['red'] = Math.max(maxValues['red'], red);
      maxValues['green'] = Math.max(maxValues['green'], green);
      maxValues['blue'] = Math.max(maxValues['blue'], blue);
    }

    // console.log(this._token);
    // console.log(this._tokenizer.getNextToken(true));

    return {
      id: Number(id),
      ...maxValues,
      start,
      stop
    };
  }

  DrawStatement() {
    if (!this._token) {
      throw new SyntaxError(
        `Unexpected end of input, expected Statement`
      );
    }

    const maxValues = {
      red: 0,
      green: 0,
      blue: 0,
    };

    const { start } = this._token;

    do {

      //first comes the value
      const { value: amount } = this._eat('NUMBER');

      //then the color
      const { value: color } = this._eat('IDENTIFIER');

      // console.log({ amount, color });
      maxValues[color] = Math.max(maxValues[color], amount);

    } while (this._optional(',')); //list continues if a comma is at the end

    // console.log(maxValues);
    // console.log({ next: this._tokenizer.getNextToken(true) });

    if (this._token && this._token.type != 'GAME') {
      this._eat(';');
    }

    return {
      ...maxValues,
      start
    };
  }

  _optional(tokenType) {
    const token = this._token;
    const consume = token?.type == tokenType;
    if (consume) this._eat(tokenType);
    // console.log({ token, ntoke: this._token, eaten: tokenType, consume });

    return consume;
  }

  _eat(tokenType) {
    const token = this._token;
    // console.log(token);

    if (token == null) {
      throw new SyntaxError(
        `Unexpected end of input, expected: "${tokenType}"`
      );
    }

    if (tokenType != token.type) {
      throw new SyntaxError(`Unexpected token "${token.type}". Expected "${tokenType}" at ${token.start}`);
    }

    this._token = this._tokenizer.getNextToken();
    return token;
  }
}

/// Solution ///

const game = (new Parser).parse(file);
let sum = 0;
let powerSum = 0;
for (const round of game.body) {
  const { id, red, green, blue } = round;
  //only 12 red cubes, 13 green cubes, and 14 blue cubes
  if (
    red <= 12 &&
    green <= 13 &&
    blue <= 14
  ) sum += id;
  powerSum += red * green * blue;
}

console.log(sum, powerSum);