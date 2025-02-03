import { FieldConfigType } from '../field/field.types';
import FileItem from './components/fileItem/fileItem';

export type FileFieldConfigType = FieldConfigType & {
    allowMultiple?: boolean;
    extensions?: string[];
    maxSize?: number;
    minSize?: number;
    onDelete?: (fileItem: FileItem) => void;
    onDeleteUpload?: (fileItem: FileItem) => void;
    hasDropArea?: boolean;
    listComponent?: string;
    uploadListComponent?: string;
    fileComponent?: string;
    lblUploads?: string;
    fileListLabel?: string;
    lblAddFile?: string;
};
