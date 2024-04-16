import { FileItemInterface } from '../../../fileField/components/fileItem/fileItemInterface';

export interface ImageItemInterface extends FileItemInterface {
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
