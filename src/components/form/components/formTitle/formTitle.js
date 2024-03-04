const html = String.raw;
class FormTitle extends HTMLElement {
    connectedCallback() {
        this.form = this.closest('form');
        this.render();
    }

    render() {
        const title = this.getTitle();
        if (title) {
            this.innerHTML = html` <h2>${title}</h2> `;
        } else {
            this.remove();
        }
    }

    getTitle() {
        return this.form.getAttribute('title');
    }
}

customElements.define('form-title', FormTitle);

export default FormTitle;