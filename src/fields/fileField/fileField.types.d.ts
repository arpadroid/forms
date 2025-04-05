import { FieldConfigType } from '../field/field.types';
import FileItem from './components/fileItem/fileItem';

export type FileFieldConfigType = FieldConfigType & {
    allowMultiple?: boolean;
    extensions?: string[];
    maxSize?: number;
    minSize?: number;
    onDelete?: (fileItem: FileItem) => Promise<unknown>;
    onDeleteUpload?: (fileItem: FileItem) => Promise<unknown>;
    onEdit?: (fileItem: FileItem) => Promise<unknown>;
    hasDropArea?: boolean;
    listComponent?: string;
    uploadListComponent?: string;
    fileComponent?: string;
    lblUploads?: string;
    fileListLabel?: string;
    lblAddFile?: string;
    uploadListIcon?: string;
    fileListIcon?: string;
};
