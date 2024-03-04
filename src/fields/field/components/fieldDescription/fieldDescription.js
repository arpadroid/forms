class FieldDescription extends HTMLParagraphElement {
    connectedCallback() {
        this.field = this.closest('.arpaField');
        this.render();
    }

    render() {
        const content = this.getDescription();
        if (content) {
            this.classList.add('fieldDescription');
            this.innerHTML = content;
        } else {
            this.remove();
        }
    }

    getDescription() {
        return this.field.getAttribute('description');
    }
}

customElements.define('field-description', FieldDescription, { extends: 'p' });

export default FieldDescription;
