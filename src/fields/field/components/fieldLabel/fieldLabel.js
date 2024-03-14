/**
 * @typedef {import('../../field').default} Field
 */

import { mergeObjects, processTemplate } from '@arpadroid/tools';

const html = String.raw;
class FieldLabel extends HTMLLabelElement {
    static template = html`
        <span class="fieldLabel__text">{label}</span>
        {required}
    `;

    static requiredTemplate = html`<span class="fieldLabel__required">*</span>`;

    static defaultConfig = {
        required: false,
        requiredTemplate: FieldLabel.requiredTemplate,
        template: FieldLabel.template
    };

    constructor(config = {}) {
        super();
        this._config = mergeObjects(FieldLabel.defaultConfig, config);
        this.labelNode = this.querySelector('.fieldLabel__text');
        this.classList.add('fieldLabel');
    }

    connectedCallback() {
        /** @type {Field} */
        this.field = this.closest('.arpaField');
        this.setAttribute('for', this.field?.getHtmlId());
        this.render();
    }

    render() {
        if (this.labelNode) {
            this.labelNode.innerHTML = this?.field?.getLabel() ?? '';
        } else {
            this.innerHTML = processTemplate(FieldLabel.template, this.getTemplateVars());    
        }
    }

    getTemplateVars() {
        return {
            label: this?.field?.getLabel() ?? '',
            required: this.field?.isRequired() && this._config.requiredTemplate
        };
    }
}

customElements.define('field-label', FieldLabel, { extends: 'label' });

export default FieldLabel;
