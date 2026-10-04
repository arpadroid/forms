import { ListConfigType } from '@arpadroid/lists';
import FieldOption from '../fieldOption/fieldOption';

export type FieldOptionsConfigType = ListConfigType & {
    itemComponent: typeof FieldOption;
};
