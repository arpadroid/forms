/**
 * Storybook Vitest Setup File
 * Initializes the Storybook preview annotations for Vitest testing
 * This ensures that framework functions like renderToCanvas are available
 */
import { setProjectAnnotations } from '@storybook/web-components-vite';
import * as previewAnnotations from './preview.js';

// Initialize Storybook's portable stories API with preview annotations
setProjectAnnotations([previewAnnotations]);
