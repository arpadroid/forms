import { ArpaElement } from '@arpadroid/ui';
const html = String.raw;
class FormTitle extends ArpaElement {
    render() {
        this.classList.add('formTitle');
        this.form = this.closest('form');
        const title = this.form.getAttribute('title');
        if (title) {
            this.innerHTML = html`<h2 class="formTitle__content">${title}</h2>`;
        }
    }
}

customElements.define('form-title', FormTitle);

export default FormTitle;
