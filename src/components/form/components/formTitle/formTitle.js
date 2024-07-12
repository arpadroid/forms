import { ArpaElement } from '@arpadroid/ui';
import { mergeObjects } from '@arpadroid/tools';
const html = String.raw;
class FormTitle extends ArpaElement {
    getDefaultConfig() {
        return mergeObjects(super.getDefaultConfig(), {
            removeIfEmpty: true
        });
    }

    render() {
        this.form = this.closest('form');
        const title = this.form.getAttribute('title');
        if (title) {
            this.innerHTML = html`<h2 class="formTitle__content">${title}</h2>`;
        }
    }

    getTitle() {
        return this.form.getAttribute('title');
    }
}

customElements.define('form-title', FormTitle);

export default FormTitle;
