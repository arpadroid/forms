import { ArpaElementConfigType } from '@arpadroid/ui/dist/@types/components/arpaElement/arpaElement.types';
import type FieldValidator from '../../utils/fieldValidator';
import type Field from './field';
import { FormComponent } from './field';

export type FieldOnChangeType = (value: unknown, field: Field, event: Event) => unknown;

export type FieldValidationType = (value: unknown, field: Field) => string | boolean;

export type FieldConfigType = ArpaElementConfigType & {
    className?: string;
    classNames?: string[];
    description?: string;
    disabled?: boolean;
    footNote?: string;
    icon?: string;
    iconRight?: string;
    id?: string;
    inputAttributes?: Record<string, unknown>;
    inputTemplate?: string;
    hasInputMask?: boolean;
    label?: string;
    name?: string;
    onChange?: FieldOnChangeType;
    onFocus?: (field: Field) => boolean;
    validator?: typeof FieldValidator;
    validation?: FieldValidationType;
    outputObject?: string;
    placeholder?: string;
    minLength?: number;
    maxLength?: number;
    readOnly?: boolean;
    regex?: string;
    regexMessage?: string;
    required?: boolean;
    template?: string;
    tooltip?: string;
    value?: unknown;
    form?: FormComponent;
    variant?: string;
};
