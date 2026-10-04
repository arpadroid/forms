import SelectOption from '../selectOption/selectOption';
import { FieldOptionsConfigType } from '../../optionsField/fieldOptions/fieldOptions.types';

export type SelectOptionsConfigType = FieldOptionsConfigType & {
    itemComponent: typeof SelectOption;
};
