import { FieldInterface } from '../field/fieldInterface.js';

export interface PasswordFieldInterface extends FieldInterface {
    confirm?: boolean;
    confirmField?: PasswordFieldInterface;
    mode?: 'login' | 'register';
}
