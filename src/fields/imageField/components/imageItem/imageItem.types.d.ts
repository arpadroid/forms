import { FileItemInterface } from '../../../fileField/components/fileItem/fileItemInterface';

export type ImageItemConfigType = FileItemInterface & {
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
}
