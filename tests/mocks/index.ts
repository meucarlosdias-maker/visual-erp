export function createMockRepository<T extends Record<string, unknown>>(data: T[] = []) {
  return {
    findAll: vi.fn().mockResolvedValue(data),
    findById: vi.fn().mockImplementation((id: string) =>
      Promise.resolve(data.find((item) => item.id === id) ?? null),
    ),
    create: vi.fn().mockImplementation((input: T) =>
      Promise.resolve({ ...input, id: crypto.randomUUID() }),
    ),
    update: vi.fn().mockImplementation((id: string, input: Partial<T>) =>
      Promise.resolve({ ...data.find((item) => item.id === id), ...input, id }),
    ),
    delete: vi.fn().mockResolvedValue(true),
  };
}

export const mockPrisma = {
  user: createMockRepository(),
  client: createMockRepository(),
  lead: createMockRepository(),
  quotation: createMockRepository(),
  project: createMockRepository(),
  workOrder: createMockRepository(),
  $transaction: vi.fn().mockImplementation((cb: (...args: unknown[]) => unknown) => cb(mockPrisma)),
};
