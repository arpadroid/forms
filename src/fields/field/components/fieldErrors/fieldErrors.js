import { appendNodes } from '@arpadroid/tools';
const html = String.raw;
/**
 * Represents a custom element for displaying field errors.
 */
class FieldErrors extends HTMLElement {
    static get observedAttributes() {
        return ['errors'];
    }

    async connectedCallback() {
        this.field = this.closest('.arpaField');
        this.classList.add('fieldErrors');
        this.render();
        this.tooltip = this.querySelector('.fieldErrors__tooltip');
        await this.tooltip.promise;
        this.errorList = this.querySelector('.fieldErrors__list');
        this.updateErrors();
    }

    /**
     * Renders the content.
     */
    render() {
        const content = html`
            <arpa-tooltip class="fieldErrors__tooltip" icon="warning" position="left">
                <arpa-zone name="tooltip-content">
                    <ul class="fieldErrors__list"></ul>
                </arpa-zone>
            </arpa-tooltip>
        `;
        this.innerHTML = content;
    }

    /**
     * Renders the error messages.
     * @returns {HTMLElement[]} An array of error message elements.
     */
    renderErrors() {
        const errors = this.getErrors();
        const errorNodes = [];
        errors?.forEach(error => {
            errorNodes.push(this.renderError(error));
        });
        return errorNodes;
    }

    /**
     * Renders an individual error message.
     * @param {string} error - The error message to render.
     * @returns {HTMLElement} The error message element.
     */
    renderError(error) {
        const errorItem = document.createElement('li');
        errorItem.classList.add('fieldErrors__item');
        errorItem.innerHTML = error;
        return errorItem;
    }

    /**
     * Sets the errors for the field.
     * @param {string[]} errors - An array of error messages.
     * @param {boolean} [update] - Indicates whether to update the errors immediately.
     */
    setErrors(errors = [], update = true) {
        if (!Array.isArray(errors)) {
            errors = [];
        }
        this.errors = errors;
        if (update) {
            this.updateErrors();
        }
    }

    /**
     * Retrieves the current errors for the field.
     * @returns {string[]} An array of error messages.
     */
    getErrors() {
        return this.errors || [];
    }

    /**
     * Clears all errors for the field.
     */
    clearErrors() {
        this.setErrors([]);
    }

    /**
     * Updates the displayed errors.
     */
    updateErrors() {
        this.errorList = this.querySelector('.fieldErrors__list');
        if (this.errorList) {
            this.errorList.innerHTML = '';
            const errors = this.renderErrors();
            appendNodes(this.errorList, errors);
        }
    }
}

customElements.define('field-errors', FieldErrors);

export default FieldErrors;
