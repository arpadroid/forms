import { FieldConfigType } from '../field/field.types';
import { TagOptionConfigType } from './components/tagOption/tagOption.types';

export type TagFieldConfigType = FieldConfigType & {
    tags?: TagOptionConfigType[];
    tagDefaults?: TagOptionConfigType;
    allowTextInput?: boolean;
    allowText?: boolean;
    hasSearch?: boolean;
    debounceSearch?: number;
    optionComponent?: string;
};
