import { FileFieldInterface } from '../fileField/fileFieldInterface';

export interface ImageFieldInterface extends FileFieldInterface {
    srcSet?: string;
}
