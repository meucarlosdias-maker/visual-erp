import type { ASTNode, Token, BinaryOperator, UnaryOperator, FunctionNode } from './types';

export class FormulaParser {
  private tokens: Token[] = [];
  private position = 0;

  parse(expression: string): ASTNode {
    if (!expression || expression.trim().length === 0) {
      throw new Error('Empty expression');
    }

    this.tokens = this.tokenize(expression);
    this.position = 0;

    const ast = this.parseExpression();

    if (this.position < this.tokens.length) {
      const tok = this.tokens[this.position];
      throw new Error(`Unexpected token '${tok.value}' at position ${tok.position}`);
    }

    return ast;
  }

  private tokenize(expression: string): Token[] {
    const tokens: Token[] = [];
    let i = 0;

    while (i < expression.length) {
      const ch = expression[i];

      if (/\s/.test(ch)) {
        i++;
        continue;
      }

      if (ch === '!' && i + 1 < expression.length && expression[i + 1] === '=') {
        tokens.push({ type: 'OPERATOR', value: '!=', position: i });
        i += 2;
        continue;
      }

      if (ch === '=' && i + 1 < expression.length && expression[i + 1] === '=') {
        tokens.push({ type: 'OPERATOR', value: '==', position: i });
        i += 2;
        continue;
      }

      if (ch === '&' && i + 1 < expression.length && expression[i + 1] === '&') {
        tokens.push({ type: 'OPERATOR', value: '&&', position: i });
        i += 2;
        continue;
      }

      if (ch === '|' && i + 1 < expression.length && expression[i + 1] === '|') {
        tokens.push({ type: 'OPERATOR', value: '||', position: i });
        i += 2;
        continue;
      }

      if (ch === '>' && i + 1 < expression.length && expression[i + 1] === '=') {
        tokens.push({ type: 'OPERATOR', value: '>=', position: i });
        i += 2;
        continue;
      }

      if (ch === '<' && i + 1 < expression.length && expression[i + 1] === '=') {
        tokens.push({ type: 'OPERATOR', value: '<=', position: i });
        i += 2;
        continue;
      }

      if (ch === '>' || ch === '<') {
        tokens.push({ type: 'OPERATOR', value: ch, position: i });
        i++;
        continue;
      }

      if (ch >= '0' && ch <= '9') {
        const start = i;
        while (i < expression.length && (expression[i] >= '0' && expression[i] <= '9' || expression[i] === '.')) {
          i++;
        }
        tokens.push({ type: 'NUMBER', value: expression.slice(start, i), position: start });
        continue;
      }

      if (ch >= 'a' && ch <= 'z' || ch >= 'A' && ch <= 'Z' || ch === '_') {
        const start = i;
        while (i < expression.length && (expression[i] >= 'a' && expression[i] <= 'z' || expression[i] >= 'A' && expression[i] <= 'Z' || expression[i] >= '0' && expression[i] <= '9' || expression[i] === '_')) {
          i++;
        }
        const name = expression.slice(start, i);
        if (i < expression.length && expression[i] === '(') {
          tokens.push({ type: 'FUNCTION', value: name, position: start });
        } else {
          tokens.push({ type: 'VARIABLE', value: name, position: start });
        }
        continue;
      }

      if ('+-*/%^!'.includes(ch)) {
        tokens.push({ type: 'OPERATOR', value: ch, position: i });
        i++;
        continue;
      }

      if (ch === '(') {
        tokens.push({ type: 'LPAREN', value: '(', position: i });
        i++;
        continue;
      }

      if (ch === ')') {
        tokens.push({ type: 'RPAREN', value: ')', position: i });
        i++;
        continue;
      }

      if (ch === ',') {
        tokens.push({ type: 'COMMA', value: ',', position: i });
        i++;
        continue;
      }

      throw new Error(`Unexpected character '${ch}' at position ${i}`);
    }

    return tokens;
  }

  private peek(): Token | null {
    return this.position < this.tokens.length ? this.tokens[this.position] : null;
  }

  private consume(): Token {
    const token = this.peek();
    if (!token) throw new Error('Unexpected end of expression');
    this.position++;
    return token;
  }

  private match(...types: string[]): boolean {
    const token = this.peek();
    return token !== null && types.includes(token.type);
  }

  private matchOp(...ops: string[]): boolean {
    const token = this.peek();
    return token !== null && token.type === 'OPERATOR' && ops.includes(token.value);
  }

  private parseExpression(): ASTNode {
    let left = this.parseLogicalOr();

    while (this.matchOp('||')) {
      const op = this.consume().value as BinaryOperator;
      const right = this.parseLogicalOr();
      left = { type: 'BinaryOperationNode', operator: op, left, right };
    }

    return left;
  }

  private parseLogicalOr(): ASTNode {
    let left = this.parseLogicalAnd();

    while (this.matchOp('&&')) {
      const op = this.consume().value as BinaryOperator;
      const right = this.parseLogicalAnd();
      left = { type: 'BinaryOperationNode', operator: op, left, right };
    }

    return left;
  }

  private parseLogicalAnd(): ASTNode {
    let left = this.parseEquality();

    while (this.matchOp('==', '!=')) {
      const op = this.consume().value as BinaryOperator;
      const right = this.parseEquality();
      left = { type: 'BinaryOperationNode', operator: op, left, right };
    }

    return left;
  }

  private parseEquality(): ASTNode {
    let left = this.parseRelational();

    while (this.matchOp('>', '<', '>=', '<=')) {
      const op = this.consume().value as BinaryOperator;
      const right = this.parseRelational();
      left = { type: 'BinaryOperationNode', operator: op, left, right };
    }

    return left;
  }

  private parseRelational(): ASTNode {
    let left = this.parseAdditive();

    while (this.matchOp('+', '-')) {
      const op = this.consume().value as BinaryOperator;
      const right = this.parseAdditive();
      left = { type: 'BinaryOperationNode', operator: op, left, right };
    }

    return left;
  }

  private parseAdditive(): ASTNode {
    let left = this.parseMultiplicative();

    while (this.matchOp('*', '/', '%')) {
      const op = this.consume().value as BinaryOperator;
      const right = this.parseMultiplicative();
      left = { type: 'BinaryOperationNode', operator: op, left, right };
    }

    return left;
  }

  private parseMultiplicative(): ASTNode {
    let left = this.parseUnary();

    while (this.matchOp('^')) {
      const op = this.consume().value as BinaryOperator;
      const right = this.parseMultiplicative();
      left = { type: 'BinaryOperationNode', operator: op, left, right };
    }

    return left;
  }

  private parseUnary(): ASTNode {
    const token = this.peek();

    if (token && token.type === 'OPERATOR' && (token.value === '-' || token.value === '+' || token.value === '!')) {
      this.consume();
      const operand = this.parseUnary();
      return { type: 'UnaryOperationNode', operator: token.value as UnaryOperator, operand };
    }

    return this.parsePrimary();
  }

  private parsePrimary(): ASTNode {
    const token = this.peek();
    if (!token) throw new Error('Unexpected end of expression');

    if (token.type === 'NUMBER') {
      this.consume();
      return { type: 'LiteralNode', value: parseFloat(token.value) };
    }

    if (token.type === 'VARIABLE') {
      this.consume();
      return { type: 'VariableNode', name: token.value };
    }

    if (token.type === 'FUNCTION') {
      return this.parseFunction();
    }

    if (token.type === 'LPAREN') {
      this.consume();
      const node = this.parseExpression();
      if (!this.match('RPAREN')) {
        throw new Error(`Expected ')' at position ${this.peek()?.position ?? this.tokens.length}`);
      }
      this.consume();
      return node;
    }

    throw new Error(`Unexpected token '${token.value}' at position ${token.position}`);
  }

  private parseFunction(): FunctionNode {
    const token = this.consume();
    const name = token.value;

    if (!this.match('LPAREN')) {
      throw new Error(`Expected '(' after function '${name}' at position ${token.position}`);
    }
    this.consume();

    const args: ASTNode[] = [];
    if (!this.match('RPAREN')) {
      args.push(this.parseExpression());
      while (this.match('COMMA')) {
        this.consume();
        args.push(this.parseExpression());
      }
    }

    if (!this.match('RPAREN')) {
      throw new Error(`Expected ')' after function arguments at position ${this.peek()?.position ?? this.tokens.length}`);
    }
    this.consume();

    return { type: 'FunctionNode', name, arguments: args };
  }
}
