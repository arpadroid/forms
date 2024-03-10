export interface FieldInterface {
    disabled?: boolean;
    id?: string;
    name?: string;
    inputTagName?: string;
    inputAttributes?: Record<string, unknown>;
    onInitialized?: (value, field) => boolean;
    onFocus?: (field) => boolean;
    onChange?: (value, field, event) => unknown;
    outputObject?: string;
    placeholder?: string;
    readOnly?: boolean;
    type?: string;
    regex?: string;
    required?: boolean;
    regexMessage?: string;
    value?: unknown;
    template?: string;
    inputTemplate?: string;
    description?: string;
    icon?: string;
    iconRight?: string;
    label?: string;
    footNote?: string;
    tooltip?: string;
    variant?: string;
}
