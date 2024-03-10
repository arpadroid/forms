import { FieldInterface } from '../field/fieldInterface';
import { FieldOptionInterface } from './fieldOption/fieldOptionInterface';

export interface OptionsFieldInterface extends FieldInterface {
    options?: FieldOptionInterface[];
    hasInput?: boolean;
    optionTemplate?: string;
    autoFetchOptions?: boolean;
}
