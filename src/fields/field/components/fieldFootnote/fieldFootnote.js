class FieldFootnote extends HTMLParagraphElement {
    connectedCallback() {
        this.field = this.closest('.arpaField');
        this.render();
    }

    render() {
        const content = this.getFootnote();
        if (content) {
            this.classList.add('fieldFootnote');
            this.innerHTML = content;
        } else {
            this.remove();
        }
    }

    getFootnote() {
        this.field = this.closest('.arpaField');
        return this.field?.getProperty('footnote');
    }
}

customElements.define('field-footnote', FieldFootnote, { extends: 'p' });

export default FieldFootnote;
