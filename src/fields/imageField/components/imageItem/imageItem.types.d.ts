import { FileItemConfigType } from '../../../fileField/components/fileItem/fileItem.types';

export type ImageItemConfigType = FileItemConfigType & {
    fileSize?: number;
    size?: string;
    extension?: string;
    type?: string;
    url?: string;
    name?: string;
    file?: File;
    status?: string;
    width?: number;
    height?: number;
    highResImage?: string;
}
