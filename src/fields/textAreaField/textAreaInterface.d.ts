import { FieldInterface } from '../field/fieldInterface';

export interface TextAreaInterface extends FieldInterface {
    hasRichText?: boolean;
    rows?: number;
}
