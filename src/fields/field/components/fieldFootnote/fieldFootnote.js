const html = String.raw;
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
        return this.field.getAttribute('footnote');
    }
}

customElements.define('field-footnote', FieldFootnote, { extends: 'p' });

export default FieldFootnote;