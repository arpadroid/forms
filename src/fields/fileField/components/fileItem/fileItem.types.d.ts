// import type { ListItemInterface } from '@arpadroid/lists/src/types.d.ts';

export type FileItemConfigType = {
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
    // list item props
    id?: string;
    link?: string;
    action?: () => void;
    title?: string;
    titleLink?: string;
    titleIcon?: string;
    subTitle?: string;
    icon?: string;
    image?: string;
    imageAlt?: string;
    hasSelection?: boolean;
    rhsContent?: string;
    // dialogContext?: DialogContext;
    // defaultImage?: string;
    // nav?: IconMenuInterface;
    onImageLoaded?: (event: Event, image: HTMLElement) => void;
    onImageError?: (event: Event, image: HTMLElement) => void;
}
