import { FormulaParser } from './parser';
import { FormulaValidator } from './validators';
import { FormulaExecutor } from './executor';
import type { FormulaRequest, FormulaResult } from './types';

export class FormulaEngine {
  private parser = new FormulaParser();
  private validator = new FormulaValidator();
  private executor = new FormulaExecutor();

  calculate(request: FormulaRequest): FormulaResult {
    const start = performance.now();

    const errors: string[] = [];
    const warnings: string[] = [];
    let variablesUsed: string[] = [];

    let ast: import('./types').ASTNode;
    try {
      ast = this.parser.parse(request.expression);
    } catch (e) {
      const elapsed = performance.now() - start;
      return {
        value: null,
        executionTime: elapsed,
        variablesUsed: [],
        errors: [e instanceof Error ? e.message : String(e)],
        warnings: [],
      };
    }

    const validation = this.validator.validate(ast, request);
    errors.push(...validation.errors);
    warnings.push(...validation.warnings);
    variablesUsed = validation.variablesUsed;

    if (errors.length > 0) {
      const elapsed = performance.now() - start;
      return {
        value: null,
        executionTime: elapsed,
        variablesUsed,
        errors,
        warnings,
      };
    }

    let value: number;
    try {
      value = this.executor.execute(ast, request);
    } catch (e) {
      const elapsed = performance.now() - start;
      return {
        value: null,
        executionTime: elapsed,
        variablesUsed,
        errors: [e instanceof Error ? e.message : String(e)],
        warnings,
      };
    }

    if (request.precision !== undefined) {
      value = parseFloat(value.toFixed(request.precision));
    }

    const elapsed = performance.now() - start;

    return {
      value,
      executionTime: elapsed,
      variablesUsed,
      errors: [],
      warnings,
    };
  }
}

export const formulaEngine = new FormulaEngine();
