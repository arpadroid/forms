import { Tooltip } from '@arpadroid/ui';
class FieldErrors extends HTMLElement {
    static get observedAttributes() {
        return ['errors'];
    }

    connectedCallback() {
        this.field = this.closest('.arpaField');
        this.render();
        this.classList.add('fieldErrors');
    }

    render() {
        const tooltip = new Tooltip();
        tooltip.setAttribute('icon', 'warning');
        this.errorList = document.createElement('ul');
        this.errorList.classList.add('fieldErrors__list');
        tooltip.appendChild(this.errorList);
        this.appendChild(tooltip);
        this.update();
    }

    renderErrors() {
        const errors = this.getErrors();
        const errorNodes = [];
        errors?.forEach(error => {
            errorNodes.push(this.renderError(error));
        });
        return errorNodes;
    }

    renderError(error) {
        const errorItem = document.createElement('li');
        errorItem.classList.add('fieldErrors__item');
        errorItem.textContent = error;
        return errorItem;
    }

    setErrors(errors = [], update = true) {
        if (!Array.isArray(errors)) {
            errors = [];
        }
        this.errors = errors;
        if (update) {
            this.update();
        }
    }

    getErrors() {
        return this.errors || [];
    }

    update() {
        this.errorList.innerHTML = '';
        const errors = this.renderErrors();
        this.errorList.append(...errors);
    }
}

customElements.define('field-errors', FieldErrors);

export default FieldErrors;
