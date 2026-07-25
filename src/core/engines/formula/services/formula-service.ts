import { FormulaEngine } from '../engine';
import type { FormulaRequest, FormulaResult, ASTNode } from '../types';
import { FormulaParser } from '../parser';

export interface FormulaLogEntry {
  id: string;
  timestamp: Date;
  expression: string;
  variables: Record<string, number>;
  executionTimeMs: number;
  errors: string[];
  warnings: string[];
  success: boolean;
}

export type FormulaLog = FormulaLogEntry[];

export class FormulaService {
  private engine: FormulaEngine;
  private parser: FormulaParser;
  private logs: FormulaLog = [];

  constructor(engine?: FormulaEngine) {
    this.engine = engine ?? new FormulaEngine();
    this.parser = new FormulaParser();
  }

  calculate(request: FormulaRequest): { result: FormulaResult; ast: ASTNode | null } {
    const logEntry: FormulaLogEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      expression: request.expression,
      variables: { ...request.variables },
      executionTimeMs: 0,
      errors: [],
      warnings: [],
      success: false,
    };

    let ast: ASTNode | null = null;

    try {
      ast = this.parser.parse(request.expression);
    } catch {
      // parse error — engine will catch it too
    }

    const result = this.engine.calculate(request);

    logEntry.executionTimeMs = result.executionTime;
    logEntry.errors = [...result.errors];
    logEntry.warnings = [...result.warnings];
    logEntry.success = result.value !== null;

    this.logs = [logEntry, ...this.logs].slice(0, 50);

    return { result, ast };
  }

  getLogs(): FormulaLog {
    return this.logs;
  }

  parse(expression: string): ASTNode {
    return this.parser.parse(expression);
  }
}

export const formulaService = new FormulaService();
