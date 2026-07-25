import { BaseService } from '@/lib/service-base';
import { executionRepository, type ExecutionRepository } from '../repository/execution-repository';
import { executionLogRepository } from '../repository/execution-log-repository';
import { NotFoundError } from '@/lib/errors';
import type { WorkflowExecution } from '../types';
import type { ExecutionInput } from '../schemas';
import { runWorkflow, createContext } from '@/core/workflow';
import { workflowRepository } from '../repository/workflow-repository';
import type { WorkflowDefinition } from '@/core/workflow';

export class ExecutionService extends BaseService<WorkflowExecution, ExecutionInput, Partial<ExecutionInput>, ExecutionRepository> {
  protected entityName = 'Execução';

  constructor() {
    super(executionRepository);
  }

  async list(): Promise<WorkflowExecution[]> {
    return this.repository.findAll();
  }

  async get(id: string): Promise<WorkflowExecution> {
    const exec = await this.repository.findById(id);
    if (!exec) throw new NotFoundError('Execução', id);
    return exec;
  }

  async create(input: ExecutionInput): Promise<WorkflowExecution> {
    return this.repository.create(input);
  }

  async update(id: string, input: Partial<ExecutionInput>): Promise<WorkflowExecution> {
    await this.get(id);
    return this.repository.update(id, input);
  }

  async delete(id: string): Promise<boolean> {
    await this.get(id);
    return this.repository.delete(id);
  }

  async restore(_id: string): Promise<WorkflowExecution> {
    throw new NotFoundError('Execução');
  }

  async findByWorkflow(workflowId: string): Promise<WorkflowExecution[]> {
    return this.repository.findByWorkflow(workflowId);
  }

  async executeWorkflow(workflowId: string, payload: Record<string, unknown>): Promise<WorkflowExecution> {
    const workflow = await workflowRepository.findById(workflowId);
    if (!workflow) throw new NotFoundError('Workflow', workflowId);

    const wfDef: WorkflowDefinition = {
      ...workflow,
      description: workflow.description ?? '',
      steps: workflow.steps.map((s) => ({
        id: s.id,
        order: s.order,
        conditions: [],
        actionType: (s.configuration as Record<string, unknown>).actionType as WorkflowDefinition['steps'][0]['actionType'] ?? 'log_entry',
        actionConfig: (s.configuration as Record<string, unknown>).actionConfig as Record<string, unknown> ?? {},
      })),
    };

    const context = createContext(wfDef, payload);

    const execution = await this.repository.create({
      workflowId,
      status: 'RUNNING',
      startedAt: new Date(),
      finishedAt: null,
      duration: null,
      error: null,
    });

    const result = await runWorkflow(wfDef, payload);

    await executionLogRepository.create({
      executionId: execution.id,
      step: 'workflow',
      status: result.success ? 'completed' : 'failed',
      message: result.success ? 'Workflow executado com sucesso' : `Workflow falhou: ${result.error ?? ''}`,
      createdAt: new Date(),
    });

    for (const stepResult of result.steps) {
      await executionLogRepository.create({
        executionId: execution.id,
        step: `passo_${stepResult.stepOrder}`,
        status: stepResult.status,
        message: stepResult.message,
        createdAt: new Date(),
      });
    }

    const finishedAt = new Date();
    return this.repository.update(execution.id, {
      status: result.success ? 'COMPLETED' : 'FAILED',
      finishedAt,
      duration: result.totalDurationMs,
      error: result.error ?? null,
    });
  }
}

export const executionService = new ExecutionService();
