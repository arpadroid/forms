import { TagInterface } from '../../../../ui/src/components/tag/tagInterface';
import { FieldInterface } from '../field/fieldInterface';

export interface TagFieldInterface extends FieldInterface {
    tags?: TagInterface[];
    tagDefaults?: TagInterface;
    allowText?: boolean;
    debounceSearch?: number;
}
