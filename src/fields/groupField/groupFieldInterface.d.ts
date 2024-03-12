import { FieldInterface } from '../field/fieldInterface';

export interface GroupFieldInterface extends FieldInterface {
    isOpen?: boolean;
    isCollapsible?: boolean;
    rememberToggle?: boolean;
}
