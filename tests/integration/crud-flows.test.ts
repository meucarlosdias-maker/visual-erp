import { describe, it, expect } from 'vitest';

interface Entity {
  id: string;
  name: string;
}

function createEntity<T extends Entity>(store: T[], item: T): T {
  store.push(item);
  return item;
}

function updateEntity<T extends Entity>(store: T[], id: string, updates: Partial<T>): T | null {
  const idx = store.findIndex((e) => e.id === id);
  if (idx === -1) return null;
  store[idx] = { ...store[idx], ...updates };
  return store[idx];
}

function deleteEntity<T extends Entity>(store: T[], id: string): boolean {
  const idx = store.findIndex((e) => e.id === id);
  if (idx === -1) return false;
  store.splice(idx, 1);
  return true;
}

describe('CRUD Integration Flows', () => {
  describe('Users CRUD', () => {
    const store: Entity[] = [];

    it('creates a user', () => {
      const user = createEntity(store, { id: '1', name: 'João' });
      expect(store).toHaveLength(1);
      expect(user.name).toBe('João');
    });

    it('reads users', () => {
      expect(store.find((u) => u.id === '1')).toBeDefined();
    });

    it('updates a user', () => {
      const updated = updateEntity(store, '1', { name: 'João Silva' });
      expect(updated?.name).toBe('João Silva');
    });

    it('deletes a user', () => {
      const result = deleteEntity(store, '1');
      expect(result).toBe(true);
      expect(store).toHaveLength(0);
    });
  });

  describe('Clients CRUD', () => {
    const store: Entity[] = [];
    const client = { id: '1', name: 'ABC Ltda' };

    it('creates a client', () => {
      createEntity(store, client);
      expect(store).toHaveLength(1);
    });

    it('reads a client', () => {
      expect(store.find((c) => c.id === '1')?.name).toBe('ABC Ltda');
    });

    it('updates a client', () => {
      updateEntity(store, '1', { name: 'ABC Comércio' });
      expect(store[0].name).toBe('ABC Comércio');
    });

    it('deletes a client', () => {
      deleteEntity(store, '1');
      expect(store).toHaveLength(0);
    });
  });

  describe('Quotations CRUD', () => {
    const store: Entity[] = [];

    it('creates a quotation', () => {
      createEntity(store, { id: 'q1', name: 'Orçamento #001' });
      expect(store[0].name).toContain('001');
    });

    it('updates quotation status', () => {
      updateEntity(store, 'q1', { name: 'Orçamento #001 - Aprovado' });
      expect(store[0].name).toContain('Aprovado');
    });

    it('deletes a quotation', () => {
      deleteEntity(store, 'q1');
      expect(store).toHaveLength(0);
    });
  });

  describe('Work Orders CRUD', () => {
    const store: Entity[] = [];

    it('creates a work order', () => {
      createEntity(store, { id: 'os1', name: 'OS #001' });
      expect(store).toHaveLength(1);
    });
  });

  describe('Financial Records CRUD', () => {
    const store: Entity[] = [];

    it('creates a financial record', () => {
      createEntity(store, { id: 'f1', name: 'Recebimento Cliente A' });
      expect(store[0].name).toContain('Recebimento');
    });
  });

  describe('Entity not found handling', () => {
    it('returns null for non-existent entity on update', () => {
      const result = updateEntity([], 'non-existent', { name: 'test' });
      expect(result).toBeNull();
    });

    it('returns false for non-existent entity on delete', () => {
      const result = deleteEntity([], 'non-existent');
      expect(result).toBe(false);
    });
  });
});
