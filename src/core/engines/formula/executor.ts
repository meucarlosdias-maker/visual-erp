import type { ASTNode, FormulaRequest } from './types';

const NATIVE_FUNCTIONS: Record<string, (...args: number[]) => number> = {
  MIN: (...args) => (args.length > 0 ? Math.min(...args) : 0),
  MAX: (...args) => (args.length > 0 ? Math.max(...args) : 0),
  ROUND: (x) => Math.round(x),
  CEIL: (x) => Math.ceil(x),
  FLOOR: (x) => Math.floor(x),
  ABS: (x) => Math.abs(x),
  SUM: (...args) => args.reduce((a, b) => a + b, 0),
  AVG: (...args) => (args.length > 0 ? args.reduce((a, b) => a + b, 0) / args.length : 0),
};

export class FormulaExecutor {
  execute(ast: ASTNode, request: FormulaRequest): number {
    const { variables } = request;
    return this.evaluateNode(ast, variables);
  }

  private evaluateNode(node: ASTNode, variables: Record<string, number>): number {
    switch (node.type) {
      case 'LiteralNode':
        return node.value;

      case 'VariableNode': {
        const value = variables[node.name];
        if (value === undefined) {
          throw new Error(`Variable '${node.name}' is not defined`);
        }
        return value;
      }

      case 'BinaryOperationNode': {
        const left = this.evaluateNode(node.left, variables);
        const right = this.evaluateNode(node.right, variables);
        return this.applyBinaryOp(node.operator, left, right);
      }

      case 'UnaryOperationNode': {
        const operand = this.evaluateNode(node.operand, variables);
        return this.applyUnaryOp(node.operator, operand);
      }

      case 'FunctionNode': {
        const args = node.arguments.map((arg) => this.evaluateNode(arg, variables));
        return this.evaluateFunction(node.name, args);
      }
    }
  }

  private applyBinaryOp(operator: string, left: number, right: number): number {
    switch (operator) {
      case '+': return left + right;
      case '-': return left - right;
      case '*': return left * right;
      case '/':
        if (right === 0) throw new Error('Division by zero');
        return left / right;
      case '%':
        if (right === 0) throw new Error('Division by zero');
        return left % right;
      case '^': return Math.pow(left, right);
      case '>': return left > right ? 1 : 0;
      case '<': return left < right ? 1 : 0;
      case '>=': return left >= right ? 1 : 0;
      case '<=': return left <= right ? 1 : 0;
      case '==': return left === right ? 1 : 0;
      case '!=': return left !== right ? 1 : 0;
      case '&&': return (left !== 0 && right !== 0) ? 1 : 0;
      case '||': return (left !== 0 || right !== 0) ? 1 : 0;
      default: throw new Error(`Unknown operator '${operator}'`);
    }
  }

  private applyUnaryOp(operator: string, operand: number): number {
    switch (operator) {
      case '-': return -operand;
      case '+': return operand;
      case '!': return operand === 0 ? 1 : 0;
      default: throw new Error(`Unknown unary operator '${operator}'`);
    }
  }

  private evaluateFunction(name: string, args: number[]): number {
    const fn = NATIVE_FUNCTIONS[name.toUpperCase()];
    if (!fn) {
      throw new Error(`Unknown function '${name}'`);
    }
    return fn(...args);
  }
}
