import { FieldConfigType } from '../field/field.types';

export type PasswordFieldConfigType = FieldConfigType & {
    confirm?: boolean;
    confirmField?: PasswordFieldConfigType;
    mode?: 'login' | 'register';
    isConfirm?: boolean;
    lblShowPassword?: string;
};
