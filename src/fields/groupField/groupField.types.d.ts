import { FieldConfigType } from '../field/field.types';

export type GroupFieldConfigType = FieldConfigType & {
    open?: boolean | 'false';
    isCollapsible?: boolean;
    rememberToggle?: boolean;
    closedIcon?: string;
    openIcon?: string;
}
