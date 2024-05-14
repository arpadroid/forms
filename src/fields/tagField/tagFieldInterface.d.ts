// import { TagInterface } from '../../../../ui/src/components/tag/tagInterface';

import { FieldInterface } from '../field/fieldInterface';
import { TagInterface } from '@arpadroid/ui/src/components/tag/tagInterface';

export interface TagFieldInterface extends FieldInterface {
    tags?: TagInterface[];
    
}
