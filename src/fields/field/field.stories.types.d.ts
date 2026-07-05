import { within, fn } from 'storybook/test';
import Field from './field';
import { Form } from './field.stories';
import type { FieldInputType } from '../field/components/fieldInput/fieldInput.types';

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
    input: FieldInputType;
};
