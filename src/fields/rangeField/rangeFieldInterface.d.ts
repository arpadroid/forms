import { FieldInterface } from '../field/fieldInterface';

export interface RangeFieldInterface extends FieldInterface {
    min?: number;
    max?: number;
    step?: number;
    value?: number;
}
