import { Tag } from '../../../../ui/src/components/tag/tagInterface';
import { FieldConfigType } from '../field/field.types';

export type TagFieldConfigType = FieldConfigType & {
    tags?: TagInterface[];
    tagDefaults?: TagInterface;
    allowText?: boolean;
    debounceSearch?: number;
}
