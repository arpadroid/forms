export interface FieldInterface {
    className?: string;
    classNames?: string[],
    description?: string;
    disabled?: boolean;
    footNote?: string;
    icon?: string;
    iconRight?: string;
    id?: string;
    inputAttributes?: Record<string, unknown>;
    inputTemplate?: string;
    label?: string;
    name?: string;
    // onChange?: (value, field, event) => unknown;
    onFocus?: (field) => boolean;
    outputObject?: string;
    placeholder?: string;
    readOnly?: boolean;
    regex?: string;
    regexMessage?: string;
    required?: boolean;
    template?: string;
    tooltip?: string;
    value?: unknown;
    variant?: string;
}
