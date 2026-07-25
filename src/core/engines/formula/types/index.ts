export interface FormulaRequest {
  expression: string;
  variables: Record<string, number>;
  precision?: number;
}

export interface FormulaResult {
  value: number | null;
  executionTime: number;
  variablesUsed: string[];
  errors: string[];
  warnings: string[];
}

export interface LiteralNode {
  type: 'LiteralNode';
  value: number;
}

export interface VariableNode {
  type: 'VariableNode';
  name: string;
}

export type BinaryOperator =
  | '+' | '-' | '*' | '/' | '%' | '^'
  | '>' | '<' | '>=' | '<=' | '==' | '!='
  | '&&' | '||';

export interface BinaryOperationNode {
  type: 'BinaryOperationNode';
  operator: BinaryOperator;
  left: ASTNode;
  right: ASTNode;
}

export type UnaryOperator = '-' | '+' | '!';

export interface UnaryOperationNode {
  type: 'UnaryOperationNode';
  operator: UnaryOperator;
  operand: ASTNode;
}

export interface FunctionNode {
  type: 'FunctionNode';
  name: string;
  arguments: ASTNode[];
}

export type ASTNode =
  | LiteralNode
  | VariableNode
  | BinaryOperationNode
  | UnaryOperationNode
  | FunctionNode;

export type TokenType =
  | 'NUMBER'
  | 'VARIABLE'
  | 'OPERATOR'
  | 'LPAREN'
  | 'RPAREN'
  | 'COMMA'
  | 'FUNCTION';

export interface Token {
  type: TokenType;
  value: string;
  position: number;
}
