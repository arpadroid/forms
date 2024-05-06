import { FieldInterface } from '../field/fieldInterface';

export interface DateFieldInterface extends FieldInterface {
    disableFuture?: boolean;
    disablePast?: boolean;
    min?: string | Date;
    max?: string | Date;
    format?: string;
}
