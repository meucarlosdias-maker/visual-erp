'use client';

import { useState, useEffect, useCallback } from 'react';
import type { CustomEntityRecord, FieldDefinition, CustomLayoutRecord, CustomDataRecord, FieldType } from '@/core/builder';
import { EntityModuleService, FieldModuleService, LayoutModuleService, RecordModuleService } from '../services';

export function useBuilderEntities(companyId = 'company-1') {
  const [data, setData] = useState<CustomEntityRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    try { setData(await EntityModuleService.list(companyId)); } finally { setLoading(false); }
  }, [companyId]);

  useEffect(() => { refetch(); }, [refetch]);

  return { data, loading, refetch };
}

export function useBuilderEntity(id: string) {
  const [entity, setEntity] = useState<CustomEntityRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    EntityModuleService.getById(id).then((r) => { setEntity(r); setLoading(false); });
  }, [id]);

  return { entity, loading };
}

export function useBuilderFields(entityId: string) {
  const [data, setData] = useState<FieldDefinition[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    try { setData(await FieldModuleService.listByEntity(entityId)); } finally { setLoading(false); }
  }, [entityId]);

  useEffect(() => { refetch(); }, [refetch]);

  return { data, loading, refetch };
}

export function useBuilderLayouts(entityId: string) {
  const [data, setData] = useState<CustomLayoutRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    try { setData(await LayoutModuleService.listByEntity(entityId)); } finally { setLoading(false); }
  }, [entityId]);

  useEffect(() => { refetch(); }, [refetch]);

  return { data, loading, refetch };
}

export function useBuilderRecords(entityId: string) {
  const [data, setData] = useState<CustomDataRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    try { setData(await RecordModuleService.listByEntity(entityId)); } finally { setLoading(false); }
  }, [entityId]);

  useEffect(() => { refetch(); }, [refetch]);

  return { data, loading, refetch };
}
