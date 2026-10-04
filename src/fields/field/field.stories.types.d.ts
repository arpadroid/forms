import { fn } from 'storybook/test';
import Field from './field';
import { Canvas, Form } from './field.stories';

export type FieldPlaySetupOptionsType = {
    fieldTag?: string;
};

export type FieldPlaySetupReturnType = {
    field: Field;
    form: Form;
    input: HTMLInputElement;
    submitButton: HTMLButtonElement;
    onFocusMock: ReturnType<typeof fn>;
    onSubmitMock: ReturnType<typeof fn>;
    onErrorMock: ReturnType<typeof fn>;
    onChangeMock: ReturnType<typeof fn>;
};

export type FieldPlayConfigType = {
    tag?: string;
    canvasElement: HTMLElement;
    canvas: Canvas;
    inputSelector?: string;
};
