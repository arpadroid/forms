

import { FieldInterface } from '../field/fieldInterface';
import FileItem from './components/fileItem/fileItem';

export interface FileFieldInterface extends FieldInterface {
    allowMultiple?: boolean;
    extensions?: string[];
    maxSize?: number;
    minSize?: number;
    onDelete?: (fileItem: FileItem) => void;
    onDeleteUpload?: (fileItem: FileItem) => void;
    hasDropArea?: boolean;
}
