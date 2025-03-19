import { ArpaElementConfigType } from '@arpadroid/ui';
import type FormComponent from './form';

export type FormSubmitResponseType = {
    formValues?: Record<string, unknown>;
};

export type FormSubmitType<T = Record<string, unknown>> = (
    values?: T,
    form?: FormComponent
) => Promise<FormSubmitResponseType> | boolean;

export type FormConfigType = ArpaElementConfigType & {
    id?: string;
    initialValues?: Record<string, unknown>;
    variant?: string;
    submitButtonText?: string;
    onSubmit?: FormSubmitType;
    debounce?: number;
    template?: string;
    hasSubmit?: boolean;
    submitText?: string;
    errorMessage?: string;
    title?: string;
    successMessage?: string;
};

export type FormTemplatePropsType = {
    submitLabel?: string | unknown;
    title?: string;
    formId?: string;
    description?: string;
    submitButton?: string;
    content?: string;
    header?: string;
    messages?: string;
    footer?: string;
    fullLayout?: string;
    miniLayout?: string;
};

export type FormPayloadType = {
    id?: string;
    values: Record<string, unknown>;
    form: FormComponent;
};
