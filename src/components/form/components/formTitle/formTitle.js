import { ArpaElement } from '@arpadroid/ui';
import { mergeObjects } from '@arpadroid/tools';
const html = String.raw;
class FormTitle extends ArpaElement {
    initializeProperties() {
        super.initializeProperties();
        this.render();
    }

    getDefaultConfig() {
        return mergeObjects(super.getDefaultConfig(), {
            removeIfEmpty: true
        });
    }

    render() {
        const title = this.getProperty('title');
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
