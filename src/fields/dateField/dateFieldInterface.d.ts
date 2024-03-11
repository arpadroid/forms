import { FieldInterface } from '../field/fieldInterface';

export interface DateFieldInterface extends FieldInterface {
    disableFuture?: boolean;
    disablePast?: boolean;
    format?: string;
}
