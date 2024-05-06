export const EmptyImage = new File([''], 'test.jpg', { type: 'image/jpg' });

/**
 * Creates a new image file from the given URL.
 * @param {string} url - URL to the image.
 * @param {string} [name] - Name of the file.
 * @returns {Promise<File>} The image file.
 */
export async function createImageFileFromURL(url, name = 'test.jpg') {
    const response = await fetch(url);
    const data = await response.blob();
    return new File([data], name, { type: 'image/jpeg' });
}
