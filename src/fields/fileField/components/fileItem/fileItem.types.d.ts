import { ListItemConfigType } from '@arpadroid/lists';
import type FileItem from './fileItem.js';

export type FileItemConfigType = ListItemConfigType & {
    // defaultImage?: string;
    // dialogContext?: DialogContext;
    // list item props
    // nav?: IconMenuInterface;
    action?: () => void;
    error?: string;
    extension?: string;
    file?: File;
    fileSize?: number;
    hasSelection?: boolean;
    icon?: string;
    id?: string;
    image?: string;
    imageAlt?: string;
    isUploading?: boolean;
    link?: string;
    lblRemoveFile?: string;
    name?: string;
    onDelete?: (fileItem: FileItem) => Promise<unknown>;
    onEdit?: (fileItem: FileItem) => void;
    onImageError?: (event: Event, image: HTMLElement) => void;
    onImageLoaded?: (event: Event, image: HTMLElement) => void;
    hasIcon?: boolean;
    progress?: number;
    rhsContent?: string;
    size?: string;
    status?: string;
    subTitle?: string;
    title?: string;
    titleIcon?: string;
    titleLink?: string;
    type?: string;
    url?: string;
    key?: string;
};


export type FileItemPayloadType = Record<string, unknown> & {
    extension?: string;
};