import { within, fn } from 'storybook/test';
import Field from './field';
import { Form } from './field.stories';

export type FieldPlaySetupOptionsType = {
    fieldTag?: string;
};

export type FieldPlaySetupReturnType = {
    canvas: ReturnType<typeof within>;
    field: Field | null;
    form: Form | null;
    submitButton: HTMLButtonElement | null;
    onSubmitMock: ReturnType<typeof fn>;
    onErrorMock: ReturnType<typeof fn>;
    onChangeMock: ReturnType<typeof fn>;
    input: import('src/types').FieldInputType;
};
