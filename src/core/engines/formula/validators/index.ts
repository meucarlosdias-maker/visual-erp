import type { ASTNode, FormulaRequest } from '../types';

const KNOWN_FUNCTIONS = new Set(['MIN', 'MAX', 'ROUND', 'CEIL', 'FLOOR', 'ABS', 'SUM', 'AVG']);

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  variablesUsed: string[];
}

export class FormulaValidator {
  validate(ast: ASTNode, request: FormulaRequest): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const variablesUsed = new Set<string>();

    this.validateNode(ast, request.variables, variablesUsed, errors, warnings);

    const valid = errors.length === 0;

    return { valid, errors, warnings, variablesUsed: [...variablesUsed] };
  }

  private validateNode(
    node: ASTNode,
    availableVariables: Record<string, number>,
    variablesUsed: Set<string>,
    errors: string[],
    warnings: string[],
  ): void {
    switch (node.type) {
      case 'LiteralNode':
        break;

      case 'VariableNode':
        variablesUsed.add(node.name);
        if (!(node.name in availableVariables)) {
          warnings.push(`Variable '${node.name}' is not defined, using 0`);
        }
        break;

      case 'BinaryOperationNode':
        this.validateNode(node.left, availableVariables, variablesUsed, errors, warnings);
        this.validateNode(node.right, availableVariables, variablesUsed, errors, warnings);
        if (node.operator === '/' || node.operator === '%') {
          if (node.right.type === 'LiteralNode' && node.right.value === 0) {
            errors.push(`Division by zero in expression`);
          }
        }
        break;

      case 'UnaryOperationNode':
        this.validateNode(node.operand, availableVariables, variablesUsed, errors, warnings);
        break;

      case 'FunctionNode': {
        const upper = node.name.toUpperCase();
        if (!KNOWN_FUNCTIONS.has(upper)) {
          errors.push(`Unknown function '${node.name}'`);
        }
        for (const arg of node.arguments) {
          this.validateNode(arg, availableVariables, variablesUsed, errors, warnings);
        }
        break;
      }
    }
  }
}
