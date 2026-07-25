import type {
  CustomEntityRecord, CustomLayoutRecord, FieldDefinition, LayoutComponent,
  CustomDataRecord, FieldType,
} from '../types';
import { FormEngine, FormValidator } from '../forms';

export interface RenderContext {
  entity: CustomEntityRecord;
  fields: FieldDefinition[];
  layout: CustomLayoutRecord | null;
  data: Record<string, unknown>;
  errors: Record<string, string>;
  mode: 'create' | 'edit' | 'view';
}

export interface RenderedField {
  id: string;
  name: string;
  label: string;
  type: FieldType;
  required: boolean;
  defaultValue: string | null;
  options: { value: string; label: string }[] | null;
  placeholder: string | null;
  helpText: string | null;
  value: unknown;
  error: string | null;
  formattedValue: string;
}

export interface RenderedSection {
  componentId: string;
  type: string;
  title?: string;
  description?: string;
  columns?: number;
  fields: RenderedField[];
  children: RenderedSection[];
  config?: Record<string, unknown>;
}

export const Renderer = {
  buildContext(entity: CustomEntityRecord, fields: FieldDefinition[], data: Record<string, unknown>, mode: 'create' | 'edit' | 'view' = 'create'): RenderContext {
    const errors = mode === 'view' ? {} : FormValidator.validateForm(fields, data);
    return { entity, fields, layout: null, data, errors, mode };
  },

  renderFields(fields: FieldDefinition[], data: Record<string, unknown>, errors: Record<string, string>, mode: 'create' | 'edit' | 'view'): RenderedField[] {
    return fields.map((field) => ({
      id: field.id,
      name: field.name,
      label: field.label,
      type: field.type,
      required: field.required,
      defaultValue: field.defaultValue,
      options: field.options,
      placeholder: field.placeholder,
      helpText: field.helpText,
      value: data[field.name] ?? field.defaultValue ?? '',
      error: errors[field.name] ?? null,
      formattedValue: mode === 'view' ? FormEngine.formatValue(data[field.name], field.type) : '',
    }));
  },

  renderLayout(layout: CustomLayoutRecord, fields: FieldDefinition[], data: Record<string, unknown>, errors: Record<string, string>, mode: 'create' | 'edit' | 'view'): RenderedSection[] {
    return layout.layout.map((component) => Renderer.renderComponent(component, fields, data, errors, mode));
  },

  renderComponent(component: LayoutComponent, fields: FieldDefinition[], data: Record<string, unknown>, errors: Record<string, string>, mode: 'create' | 'edit' | 'view'): RenderedSection {
    const componentFields = component.fieldIds
      ? fields.filter((f) => component.fieldIds!.includes(f.id))
      : [];

    return {
      componentId: component.id,
      type: component.type,
      title: component.title,
      description: component.description,
      columns: component.columns,
      fields: Renderer.renderFields(componentFields, data, errors, mode),
      children: component.children.map((child) => Renderer.renderComponent(child, fields, data, errors, mode)),
      config: component.config,
    };
  },

  renderDefault(entity: CustomEntityRecord, fields: FieldDefinition[], mode: 'create' | 'edit' | 'view' = 'create'): RenderedField[] {
    const data = FormEngine.buildDefaultValues(fields);
    const errors = mode === 'view' ? {} : FormValidator.validateForm(fields, data);
    return Renderer.renderFields(fields, data, errors, mode);
  },

  prepareData(fields: FieldDefinition[], formData: Record<string, unknown>): Record<string, unknown> {
    const data: Record<string, unknown> = {};
    for (const field of fields) {
      const value = formData[field.name];
      if (field.type === 'number' || field.type === 'currency') {
        data[field.name] = value !== '' ? Number(value) : null;
      } else if (field.type === 'checkbox' || field.type === 'switch') {
        data[field.name] = value === true || value === 'true' || value === 'on';
      } else {
        data[field.name] = value ?? '';
      }
    }
    return data;
  },
};
