import { FileFieldConfigType } from '../fileField/fileField.types';

export type ImageFieldConfigType = FileFieldConfigType & {
    srcSet?: string;
};
