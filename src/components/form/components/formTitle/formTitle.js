import { ArpaElement } from '@arpadroid/ui';
import { defineCustomElement } from '@arpadroid/tools';
const html = String.raw;
class FormTitle extends ArpaElement {
    render() {
        this.classList.add('formTitle');
        this.form = this.closest('arpa-form');
        const title = this.form?.getAttribute('title');
        if (title) {
            this.innerHTML = html`<h2 class="formTitle__content">${title}</h2>`;
        }
    }
}

defineCustomElement('form-title', FormTitle);

export default FormTitle;
