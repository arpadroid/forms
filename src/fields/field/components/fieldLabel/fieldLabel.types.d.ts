import { ArpaElementConfigType } from '@arpadroid/ui';

export type FieldLabelConfigType = ArpaElementConfigType & {
    label?: string;
    required?: boolean;
    requiredTemplate?: string;
    tooltip?: string;
};
