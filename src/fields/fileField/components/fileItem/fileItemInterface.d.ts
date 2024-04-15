import { ListItemInterface } from "@arpadroid/ui/src/types";


export interface FileItemInterface extends ListItemInterface {
    fileSize?: number;
    size?: string;
    extension?: string;
    type?: string;
    url?: string;
    name?: string;
    file?: File;
    progress?: number;
    status?: string;
    error?: string;
    isUploading?: boolean;
}