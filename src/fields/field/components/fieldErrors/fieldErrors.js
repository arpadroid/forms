import { appendNodes } from '@arpadroid/tools';
const html = String.raw;
/**
 * Represents a custom element for displaying field errors.
 */
class FieldErrors extends HTMLElement {
    async connectedCallback() {
        this.field = this.closest('.arpaField');
        this.classList.add('fieldErrors');
        this.render();
        this.tooltip = this.querySelector('.fieldErrors__tooltip');
        await this.tooltip.promise;
        requestAnimationFrame(() => {
            this.errorList = this.querySelector('.fieldErrors__list');
        });
    }

    /**
     * Renders the content.
     */
    render() {
        this.innerHTML = html`<arpa-tooltip class="fieldErrors__tooltip" icon="warning" position="left">
            <zone name="tooltip-content">
                <ul class="fieldErrors__list"></ul>
            </zone>
        </arpa-tooltip>`;
    }

    /**
     * Renders the error messages.
     * @returns {HTMLElement[]} An array of error message elements.
     */
    renderErrors() {
        return this.getErrors().map(error => this.renderError(error));
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
    async updateErrors() {
        requestAnimationFrame(() => {
            const errors = this.renderErrors();
            this.errorList = this.querySelector('.fieldErrors__list');
            if (this.errorList) {
                this.errorList.innerHTML = '';
                appendNodes(this.errorList, errors);
            }
        });
    }
}

/**
 * @todo - Ideally field errors can be simplified by extending ArpaElement.
 */

customElements.define('field-errors', FieldErrors);

export default FieldErrors;
