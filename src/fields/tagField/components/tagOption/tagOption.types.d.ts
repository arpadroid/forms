import { TagItem } from '@arpadroid/lists';
import { FieldOptionConfigType } from '../../../optionsField/fieldOption/fieldOption.types';

export type TagOptionConfigType = FieldOptionConfigType & {
    color?: string;
    onDelete?: (tag: TagItem) => boolean;
    text?: string;
};
