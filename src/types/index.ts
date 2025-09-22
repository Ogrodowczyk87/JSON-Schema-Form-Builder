export interface JSONSchemaProperty {
    type: 'string' | 'number' | 'integer' | 'boolean' | 'array' | 'object';
    title?: string;
    description?: string;
    default?: any;
    enum?: any[];
    minimum?: number;
    maximum?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    format?: 'email' | 'date' | 'time' | 'date-time' | 'uri' | 'password';
    items?: JSONSchemaProperty;
    properties?: { [key: string]: JSONSchemaProperty };
    required?: string[];
}

export interface JSONSchema {
    $schema?: string;
    type: 'object';
    title?: string;
    description?: string;
    properties: { [key: string]: JSONSchemaProperty };
    required?: string[];
    additionalProperties?: boolean;
}

export interface FormField {
    id: string;
    type: FieldType;
    name: string;
    label: string;
    placeholder?: string;
    required: boolean;
    description?: string;
    validation?: FieldValidation;
    options?: SelectOption[];
    order: number;
}

export type FieldType =
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'integer'
    | 'boolean'
    | 'select'
    | 'multiselect'
    | 'textarea'
    | 'date'
    | 'time'
    | 'datetime'
    | 'url'
    | 'tel'
    | 'color'
    | 'range'
    | 'file';

export interface FieldValidation {
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: string;
    customMessage?: string;
}

export interface SelectOption {
    value: string | number;
    label: string;
}

export interface FormBuilderState {
    fields: FormField[];
    selectedFieldId: string | null;
    jsonSchema: JSONSchema;
}

export interface DragItem {
    type: string;
    fieldType: FieldType;
    id?: string;
}

export const DRAG_TYPES = {
    FIELD_FROM_PALETTE: 'field-from-palette',
    FIELD_IN_FORM: 'field-in-form',
} as const;