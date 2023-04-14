// Token types
const NUMBER = "NUMBER";
const PLUS = "PLUS";
const MINUS = "MINUS";
const MULTIPLY = "MULTIPLY";
const DIVIDE = "DIVIDE";
const LPAREN = "LPAREN";
const RPAREN = "RPAREN";
const EOF = "EOF";

class Token {
  constructor(type, value, position) {
    this.type = type;
    this.value = value;
    this.position = position;
  }
}

export class Lexer {
  constructor(text) {
    this.text = text;
    this.pos = 0;
    this.currentChar = this.text[this.pos];
  }

  advance() {
    this.pos += 1;
    if (this.pos > this.text.length - 1) {
      this.currentChar = null;
    } else {
      this.currentChar = this.text[this.pos];
    }
  }

  skipWhitespace() {
    while (this.currentChar && /\s/.test(this.currentChar)) {
      this.advance();
    }
  }

  integer() {
    let result = "";
    const currentPosition = this.pos;
    while (this.currentChar && /\d/.test(this.currentChar)) {
      result += this.currentChar;
      this.advance();
    }
    if (currentPosition === this.pos) {
      throw new Error(`Invawid chawactew at position ${currentPosition}.`);
    }
    return parseInt(result);
  }

  getNextToken() {
    while (this.currentChar) {
      if (/\s/.test(this.currentChar)) {
        this.skipWhitespace();
        continue;
      }

      if (/\d/.test(this.currentChar)) {
        const currentPosition = this.pos;
        const value = this.integer();
        return new Token(NUMBER, value, currentPosition);
      }

      if (this.currentChar === "+") {
        const currentPosition = this.pos;
        this.advance();
        return new Token(PLUS, "+", currentPosition);
      }

      if (this.currentChar === "-") {
        const currentPosition = this.pos;
        this.advance();
        return new Token(MINUS, "-", currentPosition);
      }

      if (this.currentChar === "*") {
        const currentPosition = this.pos;
        this.advance();
        return new Token(MULTIPLY, "*", currentPosition);
      }

      if (this.currentChar === "/") {
        const currentPosition = this.pos;
        this.advance();
        return new Token(DIVIDE, "/", currentPosition);
      }

      if (this.currentChar === "(") {
        const currentPosition = this.pos;
        this.advance();
        return new Token(LPAREN, "(", currentPosition);
      }

      if (this.currentChar === ")") {
        const currentPosition = this.pos;
        this.advance();
        return new Token(RPAREN, ")", currentPosition);
      }

      const currentPosition = this.pos;
      let errorMessage = `Invawid chawactew at position ${currentPosition}\n${this.text}`
      let arrow = "";
      for (let i = 0; i < currentPosition; i++) {
        arrow += " ";
      }
      arrow += "^";

      // Gabungkan pesan kesalahan dan panah.
      errorMessage += `\n${arrow}`;
      return console.log(`Error: ${errorMessage}`), process.exit();
    }

    return new Token(EOF, null, this.pos);
  }
}

export class Parser {
  constructor(lexer, text) {
    this.text = text;
    this.lexer = lexer;
    this.currentToken = this.lexer.getNextToken();
  }

  error() {
    let errorToken = this.currentToken;
    let errorMessage = `Invawid syntax at position ${errorToken.position}.\n${this.text}`;
    let arrow = "";

    // Buat panah yang menunjukkan posisi kesalahan.
    for (let i = 0; i < errorToken.position; i++) {
      arrow += " ";
    }
    arrow += "^";

    // Gabungkan pesan kesalahan dan panah.
    errorMessage += `\n${arrow}`;

    return console.log(`Error: ${errorMessage}`), process.exit();
  }

  eat(tokenType) {
    if (this.currentToken.type === tokenType) {
      this.currentToken = this.lexer.getNextToken();
    } else {
      this.error();
    }
  }

  factor() {
    if (this.currentToken.type === LPAREN) {
      this.eat(LPAREN);
      let result = this.expression();
      this.eat(RPAREN);
      return result;
    } else {
      let token = this.currentToken;
      this.eat(NUMBER);
      return token.value;
    }
  }

  term() {
    let result = this.factor();

    while ([MULTIPLY, DIVIDE].includes(this.currentToken.type)) {
      let token = this.currentToken;
      if (token.type === MULTIPLY) {
        this.eat(MULTIPLY);
        result = result * this.factor();
      } else if (token.type === DIVIDE) {
        this.eat(DIVIDE);
        result = result / this.factor();
      }
    }

    return result;
  }

  expression() {
    let result = this.term();

    while ([PLUS, MINUS].includes(this.currentToken.type)) {
      let token = this.currentToken;
      if (token.type === PLUS) {
        this.eat(PLUS);
        result = result + this.term();
      } else if (token.type === MINUS) {
        this.eat(MINUS);
        result = result - this.term();
      }
    }

    return result;
  }

  parse() {
    let result = this.expression();

    if (this.currentToken.type !== EOF) {
      this.error();
    }

    return result;
  }
}
