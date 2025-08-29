import { ArpaElementConfigType } from '@arpadroid/ui';
import type FieldInput from './fieldInput.js';

export type FieldInputType = (FieldInput | HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement) | null | undefined;

export type FieldInputConfigType = ArpaElementConfigType & {
    inputClass?: string;
    inputAttributes?: Record<string, string | number | boolean>;
};
