import { FieldInterface } from '../field/fieldInterface';

export interface GroupFieldInterface extends FieldInterface {
    open?: boolean;
    isCollapsible?: boolean;
    rememberToggle?: boolean;
}
