import type FormComponent from './form';

export type FormSubmitResponseType = {
    formValues?: Record<string, unknown>;
};

export type FormSubmitType = (values?: Record<string, unknown>, form?: FormComponent) => Promise<FormSubmitResponseType> | boolean;

export type FormConfigType = {
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
};

export type FormPayloadType = {
    id?: string;
    values: Record<string, unknown>;
    form: FormComponent;
};
